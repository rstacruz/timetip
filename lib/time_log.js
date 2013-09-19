var fs = require('fs');
var _  = require('underscore');
var extend = require('util')._extend;

/**
 * Time log model for a log.
 *
 *     var log = new TimeLog();
 *     var log = new TimeLog('~/.timelog');
 *
 * Adding data:
 *
 *     log.push({ type: 'task',  date: date, project: '...', task: '...' });
 *     log.push({ type: 'break', date: date });
 *     log.push({ type: 'break', date: date, reason: '...' });
 *     log.save();
 *
 * Retrieving data:
 *
 *     log.get(date)         // get data for date
 *     log.range(date,date)  // TODO: full data for day range
 *     log.range()           // TODO: get all
 *
 *     log.dates()        // List of dates
 *
 * Lower-level data retrieval:
 *
 *     log.day()          // Entries for today
 *     log.day(date)      // Entries for a `date`
 *
 * Properties:
 *
 *     log.raw            //=> {}  (raw data)
 *     log.file           //=> "~/.timelogs"  (filename to load/save)
 */

var TimeLog = module.exports = function(file) {
  this.raw = {};
  this.file = file;

  if (file) this.load(file);
};

/**
 * Date formats.
 */

TimeLog.prototype.formats = {
  date: '{yyyy}-{MM}-{dd} {dow}',
  time: '{h}:{mm}{tt}'
};

/**
 * Fetches the dates. Returns an array of Date objects.
 *
 *     log.dates()
 *     //=> [ sept2, sept3, sept4, ... ]
 */

TimeLog.prototype.dates = function() {
  var dates, log = this;

  dates = Object.keys(this.raw);
  dates = _.compact(_.map(dates, function(d) { return log.parseDate(d); }));

  return dates;
};

/**
 * Formats a given `date` to a given format `fmt`.
 *
 *     log.format(date, 'date')   //=> "2013-03-04 mon"
 *     log.format(date, 'time')   //=> "3:14pm"
 */

TimeLog.prototype.format = function(date, fmt) {
  if (!Date.create) require('sugar');

  return (new Date(date)).format(this.formats[fmt]).toLowerCase();
};

/**
 * Converts a string `date` to a Date object. Returns a Date object, or null.
 *
 *     log.parseDate("2013-03-04 mon")     //=> [object Date]
 *     log.parseDate("3:14pm", date)
 *     log.parseDate("??")                 //=> null
 */

TimeLog.prototype.parseDate = function(date, context) {
  if (date.getHours) return date;

  // Catch `.parseDate('#', Date(september 2))` -- it will
  // otherwise return a date
  if (!date.match(/^\s*\d/)) return null;

  // Get rid of 'mon'
  var str = date.split(' ')[0];

  // Account for `context`
  if (context) str = context.format('{yyyy}-{MM}-{dd}') + ' ' + str;

  // Use sugar!
  if (!Date.create) require('sugar');
  var d = Date.create(str);

  return isNaN(+d) ? null : d;
};

/**
 * Adds a time log.
 *
 *     log.push({ type: 'task',  date: date, project: 'x', time: 'x' });
 *     log.push({ type: 'break', date: date });
 *     log.push({ type: 'task',  date: date, reason: 'reason' });
 */

TimeLog.prototype.push = function(spec) {
  var date = new Date(spec.date);

  var day  = this.format(date, 'date');
  var time = this.format(date, 'time');

  var str;

  // Compose the string to be written.
  if (spec.type === 'break') {
    if (spec.reason && spec.reason.length > 0) {
      str = '-- '+spec.reason+' --';
    } else {
      str = '--';
    }
  } else {
    if (spec.task) {
      str = spec.project + ' ' + spec.task;
    } else {
      str = spec.project;
    }
  }

  if (!this.raw[day]) this.raw[day] = {};
  this.raw[day][time] = str;

  return this;
};

/**
 * Gets the data for the given `date`, which can be a Date, string (parseable
 * date), or number (Unix time). Returns an object.
 *
 *     d = log.get(date);
 *     d = log.get('2013-09-08');
 *
 * Returns `null` when no data exists for that day, and throws an error if the
 * date is not parseable.
 *
 * The return value has these things:
 *
 *     d.date               - (Date)
 *     d.entries            - (Array of Entries)
 *     d.last               - (Entry)
 *     d.summary            - (Object)
 *     d.summary.total      - (Number, ms) duration of total time
 *     d.summary.productive - (Number, ms) duration of productive time
 *     d.summary.start      - (Date) start of the day
 *     d.summary.finish     - (Date) end of the day
 *
 * Where `Entry` is:
 *
 *     e = d.entries[0];
 *     e.type      - (String) 'break' or 'task'
 *     e.date      - (Date) start date
 *     e.endDate   - (Date) end date
 *     e.duration  - (Number, ms) duration of time in milliseconds
 *     e.project   - (String) for tasks: the project name (or null)
 *     e.task      - (String) for tasks: task name (or null)
 *     e.reason    - (String) for breaks: the reason for the break (or null)
 */

TimeLog.prototype.get = function(date) {
  date = this.parseDate(date);
  if (isNaN(+date)) throw new Error("Invalid Date");

  var log = this;
  var dateStr = this.format(date, 'date');

  // If it's the current day, add up the 'now working on' to totals
  var isToday = new Date() - date < 86400000;

  // Raw data
  var raw = this.raw[dateStr];
  if (!raw) return null;

  // To items
  var list = _.compact(_.map(raw, function(item, itemDate) {
    itemDate = log.parseDate(itemDate, date);
    if (itemDate)
      return extend(log._parseItem(item), { date: itemDate });
  }));

  // Fill in the missing endDate/duration from each item
  var entries = eachCons(list, function(a, b) {
    return extend(a, {
      endDate: b.date,
      duration: (b.date - a.date)
    });
  });

  var last = _.last(list) || null;

  // Last
  return {
    date: date,
    entries: entries,
    last: last,
    summary: summarize(entries, last, isToday)
  };
};

/**
 * Summarizes a day. Used in `get().summary`.
 * @private
 */

function summarize(entries, last, isToday) {
  var re = {
    productive: 0,
    total: 0,
    start: entries.length > 0 ? entries[0].date : null,
    finish: (entries.length > 0 && last) ? last.date : null
  };

  entries.forEach(function(entry) {
    re.total += entry.duration;
    if (entry.type === 'task')
      re.productive += entry.duration;
  });

  // If it's the current day, add up the 'now working on' to totals
  if (last && last.type === 'task' && isToday) {
    var dur = +new Date() - last.date;
    re.total += dur;
    re.productive += dur;
  }

  return re;
}

/**
 * Loads raw data from a file.
 * Called on constructor, so there's no need to call this manually.
 */

TimeLog.prototype.load = function(file) {
  var ini  = require('ini');
  var data = read(file) || '';
  this.raw = ini.parse(data);

  return this;
};

/**
 * Saves to the data file.
 *
 * Optionally, you may also pass a `file` to save it to another file (ie,
 * "save as").
 */

TimeLog.prototype.save = function(file) {
  if (file) this.file = file;
  file = this.file;

  fs.writeFileSync(abs(file), this.toString());
  return this;
};

/**
 * Shows the time log as a string.
 *
 *     log.toString();
 *
 * Returns a string that's something like:
 *
 *     [2013-09-02 mon]
 *     8:00am = Birthday call guests
 *     9:12am = Birthday get pizza ready
 *     9:39am = -- play candy crush --
 */

TimeLog.prototype.toString = function() {
  var ini = require('ini');
  return ini.stringify(this.raw);
};

/**
 * Converts a raw item string into an item. (Hint: you can override this)
 * @private
 *
 *      _parseItem("-- break --")
 *      _parseItem("MyProject: do mockups")
 */

TimeLog.prototype._parseItem = function(item) {
  var m;
  if (m = item.match(/^-- (.*?) --$/)) {
    return {
      type: 'break',
      reason: m[1]
    };
  } else if (item.match(/^--+$/)) {
    return {
      type: 'break',
      reason: null
    };
  } else if (m = item.match(/^(.+?) (.+)$/)) {
    return {
      type: 'task',
      project: m[1],
      task: m[2]
    };
  } else {
    return {
      type: 'task',
      project: item
    };
  }
};

/*
 * Helpers!
 */

function read(filepath) {
  var data;

  try {
    data = fs.readFileSync(abs(filepath || this.filepath), 'utf-8');
  } catch (e) {
    if (!e.code || e.code !== 'ENOENT') throw e;
  }

  return data;
}

/**
 * Iterates through each consecutive item.
 */

function eachCons(list, block) {
  var last;
  var re = [];
  _.each(list, function(v, k) {
    if (last) re.push(block(last.v, v, last.k, k));
    last = { v:v, k:k };
  });
  return re;
}

function abs(filepath) {
  var path = require('path');
  return path.resolve(filepath.replace('~', process.env.HOME));
}

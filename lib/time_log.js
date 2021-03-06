var fs = require('fs');
var _  = require('underscore');
var extend = require('util')._extend;
var abs = require('./helpers').abs;
var isToday = require('./helpers').isToday;
var eachCons = require('./helpers').eachCons;
var readFile = require('./helpers').readFile;
var sortedPush = require('./helpers').sortedPush;

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
 *     log.get(date)           // get data for date
 *     log.all()               // all data
 *     log.range([date,date])  // full data for day range
 *     log.range()             // get all
 *
 *     log.dates()        // list of dates
 *
 * Lower-level data retrieval:
 *
 *     log.day()          // entries for today
 *     log.day(date)      // entries for a `date`
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
 *
 * You can give it a range to find dates within that range:
 *
 *     log.dates([ sept2, sept5 ])
 *     //=> [ sept2, sept3, sept5 ]
 *
 * Or even a single date:
 *
 *     log.dates([ sept2, sept5 ])
 *     //=> [ sept2, sept3, sept5 ]
 */

TimeLog.prototype.dates = function(range) {
  var dates, log = this, date;

  dates = Object.keys(this.raw);
  dates = _.compact(_.map(dates, function(d) { return log.parseDate(d); }));

  if (!range) { /* All */
    return dates;
  }
  else if (range && range[1]) { /* Range */
    return _.filter(dates, function(d) {
      return d >= range[0] && d <= range[1];
    });
  }
  else if (date = log.parseDate(range)) { /* Single date */
    return _.filter(dates, function(d) {
      return isToday(d, range);
    });
  }
};

/**
 * Formats a given `date` to a given format `fmt`.
 *
 *     log.format(date, 'date')   //=> "2013-03-04 mon"
 *     log.format(date, 'time')   //=> "3:14pm"
 */

TimeLog.prototype.format = function(date, fmt) {
  require('../vendor/sugar-date');

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
  if (date && date.getHours) return date;

  // Catch `.parseDate('#', Date(september 2))` -- it will
  // otherwise return a date
  if (!date.match(/^\s*\d/)) return null;

  var DateParser = require('./date_parser');
  return DateParser.date(date, context);
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
  var str = entryToString(spec);

  if (!this.raw[day]) this.raw[day] = {};
  this.raw[day] = this._sortedPush(this.raw[day], time, str);

  return this;
};

TimeLog.prototype._sortedPush = function(list, key, value) {
  var log = this;

  // Replace an existing entry?
  if (list[key]) {
    list[key] = value;
    return list;
  } else {
    var comp = function(key) { return +log.parseDate(key)||-1; };
    return sortedPush(list, key, value, comp);
  }
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
 *
 * If the current date being requested is today, you will also get some stuff:
 *
 *  - `d.today` will be true
 *  - `d.last.duration` will report how long you've been working on current task
 *  - `d.summary` will take into account the currently-worked on task
 */

TimeLog.prototype.get = function(date) {
  date = this.parseDate(date);
  if (isNaN(+date)) throw new Error("Invalid Date");

  var log = this;
  var dateStr = this.format(date, 'date');
  var today = isToday(date);

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
  var re = {
    date: date,
    entries: entries,
    last: last,
    summary: summarize(entries, last, today)
  };

  if (today) {
    re.today = true;
    if (last) last.duration = new Date() - last.date;
  }

  return re;
};

/**
 * Summarizes a day. Used in `get().summary`.
 * @private
 *
 * If it's the current day (`isToday`), add up the 'now working on' to totals.
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
 * Returns data for a range of dates.
 *
 *     log.range([ date, date ]);
 */

TimeLog.prototype.range = function(range) {
  var log = this;

  var dates = this.dates(range);
  var re = {
    range: range,
    dates: []
  };

  dates.forEach(function(date) {
    re.dates.push(log.get(date));
  });

  return re;
};

/**
 * Returns all data for all logged days. Same as `range()` without arguments.
 *
 *     log.all();
 */

TimeLog.prototype.all = function() {
  return this.range();
};

/**
 * Loads raw data from a file.
 * Called on constructor, so there's no need to call this manually.
 */

TimeLog.prototype.load = function(file) {
  var ini  = require('ini');
  var data = readFile(file) || '';
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
 *     9:39am = - play candy crush -
 */

TimeLog.prototype.toString = function() {
  var ini = require('ini');
  return ini.stringify(this.raw);
};

/**
 * Converts a raw item string into an item. (Hint: you can override this)
 * @private
 *
 *      _parseItem("-- break")
 *      _parseItem("MyProject: do mockups")
 */

TimeLog.prototype._parseItem = function(item) {
  var m;
  if (item.match(/^-*$/)) {
    return {
      type: 'break',
      reason: null
    };
  } else if (m = item.match(/^-+ ?(.*?)$/)) {
    return {
      type: 'break',
      reason: m[1]
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

function entryToString(spec) {
  // Compose the string to be written.
  if (spec.type === 'break') {
    if (spec.reason && spec.reason.length > 0) {
      return '-- '+spec.reason;
    } else {
      return '-';
    }
  } else {
    if (spec.task) {
      return spec.project + ' ' + spec.task;
    } else {
      return spec.project;
    }
  }
}

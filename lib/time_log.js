var fs = require('fs');
var _  = require('underscore');
var extend = require('util')._extend;

/**
 * Time log model for a log.
 *
 *     var log = new TimeLog();
 *     var log = new TimeLog('~/.timelog');
 *
 *     log.raw  // Raw data
 *
 *     log.push({ date: date, project: 'x', time: 'x' });
 *     log.push({ date: date, break: 'reason' });
 *     log.push({ date: date, break: null });
 *
 *     log.now();         // Last entry
 *     log.now(date);     // Last entry on `date`
 *
 *     log.day();         // Entries for today
 *     log.day(date);     // Entries for a `date`
 *
 *     log.dates();       // List of dates
 *
 * TODO:
 *
 *     log.days(date, date);   // Range
 */

var TimeLog = module.exports = function(file) {
  this.raw = {};
  this.file = file;

  if (file) this.load(file);
};

/**
 * Formats.
 */

TimeLog.prototype.formats = {
  date: '{yyyy}-{MM}-{dd} {dow}',
  time: '{h}:{mm}{tt}'
};

/**
 * Returns the latest time entry.
 */

TimeLog.prototype.now = function(date) {
  var list = this._dayItems(date);
  return _.last(list);
};

/**
 * Fetches the dates. Returns an array of Date objects.
 *
 *     log.dates();
 *     //=> [ sept2, sept3, sept4, ... ]
 */

TimeLog.prototype.dates = function() {
  var dates, log = this;

  dates = Object.keys(this.raw);
  dates = _.compact(_.map(dates, function(d) { return log.parse(d); }));

  return dates;
};

/**
 * Fetches the entries for the day.
 * If no `date` is given, the last one is assumed.
 */

TimeLog.prototype.day = function(date) {
  var list = this._dayItems(date);

  // Fill in the missing endDate/duration from each item
  list = eachCons(list, function(a, b) {
    return extend(a, {
      endDate: b.date,
      duration: (b.date - a.date)
    });
  });

  return list;
};

/**
 * Formats a given `date` to a given format `fmt`.
 *
 *     log.format(date, 'date')   //=> "2013-03-04 mon"
 *     log.format(date, 'time')   //=> "3:14pm"
 */

TimeLog.prototype.format = function(date, fmt) {
  require('sugar');

  return (new Date(date)).format(this.formats[fmt]).toLowerCase();
};

/**
 * Converts a string `date` to a Date object.
 *
 *     log.parse("2013-03-04 mon")            //=> [object Date]
 *     log.parse("3:14pm", date)
 */

TimeLog.prototype.parse = function(date, context) {
  require('sugar');

  var str = date.split(' ')[0];
  if (context) str = context.format('{yyyy}-{MM}-{dd}') + ' ' + str;

  var d = Date.create(str);
  if (!isNaN(+d)) return d;
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
 * Loads raw data from a file.
 */

TimeLog.prototype.load = function(file) {
  var ini  = require('ini');
  var data = read(file) || '';
  this.raw = ini.parse(data);

  return this;
};

/**
 * Flushes to a given file.
 */

TimeLog.prototype.save = function(file) {
  if (file) this.file = file;
  file = this.file;

  fs.writeFileSync(abs(file), this.toString());
  return this;
};

/**
 * Shows the time log as a string.
 */

TimeLog.prototype.toString = function() {
  var ini = require('ini');
  return ini.stringify(this.raw);
};

function abs(filepath) {
  var path = require('path');
  return path.resolve(filepath.replace('~', process.env.HOME));
}

/**
 * Converts a raw item string into an item.
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

/**
 * @private
 */

TimeLog.prototype._dayItems = function(date) {
  if (!date) date = _.last(this.dates());

  var log = this;
  var raw = this._rawDay(date);
  if (!raw) return [];

  // Turn them into consecutive items.
  return _.compact(_.map(raw, function(item, itemDate) {
    itemDate = log.parse(itemDate, date);
    return extend(log._parseItem(item), { date: itemDate });
  }));
};

/**
 * Fetches raw entries for a given `date`. Returns a raw list.
 * @private
 */

TimeLog.prototype._rawDay = function(date) {
  if (!date) return;

  var dateStr = this.format(date, 'date');
  return this.raw[dateStr];
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

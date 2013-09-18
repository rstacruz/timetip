var fs = require('fs');
var _  = require('underscore');

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
 *     log.now(); // Last entry
 *
 *     log.dates();
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

TimeLog.prototype.now = function() {
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
  if (!date) date = _.last(this.dates());
  if (!date) return;

  var dateStr = this.format(date, 'date');
  var raw = this.raw[dateStr];
  if (!raw) return;

  return raw;
};

/**
 * Formats a given `date` to a given format `fmt`.
 *
 *     log.format(date, 'date')   //=> "2013-03-04 mon"
 *     log.format(date, 'time')   //=> "3:14pm"
 */

TimeLog.prototype.format = function(date, fmt) {
  return (new Date(date)).format(this.formats[fmt]).toLowerCase();
};

/**
 * Inverse of .format().
 *
 *     log.parse("2013-03-04 mon")            //=> [object Date]
 *     log.parse("3:14pm", "2013-03-04 mon")
 */

TimeLog.prototype.parse = function(date, context) {
  var str = date.split(' ')[0];
  if (context) str = context.split(' ')[0] + ' ' + str;

  var d = Date.create(str);
  if (!isNaN(+d)) return d;
};

/**
 * Adds a time log.
 */

TimeLog.prototype.push = function(spec) {
  var date = new Date(spec.date);

  var day  = this.format(date, 'date');
  var time = this.format(date, 'time');

  var str;

  // Compose the string to be written.
  if (typeof spec['break'] !== 'undefined') {
    var reason = spec['break'];
    if (reason) {
      str = '-- ' + reason + ' --';
    } else {
      str = '--';
    }
  } else {
    if (spec.task) {
      str = spec.project + ": " + spec.task;
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

function read(filepath) {
  var data;

  try {
    data = fs.readFileSync(abs(filepath || this.filepath), 'utf-8');
  } catch (e) {
    if (!e.code || e.code !== 'ENOENT') throw e;
  }

  return data;
}

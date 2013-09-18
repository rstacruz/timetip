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
 */

var TimeLog = module.exports = function(file) {
  this.raw = {};
  this.file = file;
  if (file) this.load(file);
};

/**
 * Adds a time log.
 */

TimeLog.prototype.push = function(spec) {
  var date = new Date(spec.date);

  var day = date.format('{yyyy}-{MM}-{dd} {dow}').toLowerCase();
  var time = date.format('{H}:{mm}{tt}').toLowerCase();

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
};

/**
 * Loads raw data from a file.
 */

TimeLog.prototype.load = function(file) {
  var ini  = require('ini');
  var fs   = require('fs');

  var data = fs.readFileSync(file || this.file, 'utf-8');
  this.raw = ini.parse(data);
};

/**
 * Flushes to a given file.
 */

TimeLog.prototype.save = function(file) {
  var fs = require('fs');

  if (file) this.file = file;
  file = this.file;

  fs.writeFileSync(file, this.toString());
};

/**
 * Shows the time log as a string.
 */

TimeLog.prototype.toString = function() {
  var ini = require('ini');
  return ini.stringify(this.raw);
};


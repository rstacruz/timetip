var c        = require('../helpers').color;
var duration = require('../helpers').duration;
var f        = require('../formatter');
var pf       = function() { console.log(f.apply(this, arguments)); };

var dot = '⋅';
var dash = '┄ ';
var gt = '›';
var peg = '✈';
var chk = '✓';

/**
 * Default CLI reporter.
 *
 *     var r = new Reporter(log, options);
 *
 *     r.day(data, options);
 *
 * Where:
 *
 *  - `log` is a TimeLog instance
 *  - `data` is data to be reported
 *  - `options` are options specific to a given view
 */

var Reporter = module.exports = function(log, options) {
  this.log = log;
};

/**
 * Reports a single day.
 *
 *     Reporter.day({
 *       date: ...,
 *       entries: [ ... ]
 *       last: ...
 *     }, options);
 *
 * Options:
 *
 *   - added: true
 */

Reporter.prototype.day = function(data, options) {
  var self = this;
  var entries = data.entries;
  var now = data.last;
  var today = (new Date() - data.date < 86400000);

  var heading = c(data.date.format('{month} {dd} {yyyy}'), c.blue);
  if (!today) heading += c(" "+dash, c.grey) + data.date.relative();

  var total = c("total ", c.grey) + c(duration(data.summary.productive), c.blue);

  pf("");
  pf("  %-60s%19s", heading, total);
  pf("");

  if (now) {
    entries.forEach(function(entry) { self._entry(entry, { today: today }); });
    this._entry(now, { today: today, now: true });
  } else {
    console.log("  no entries");
  }

  console.log('');
};

/**
 * @private
 */

Reporter.prototype._entry = function(entry, options) {
  var time = entry.date.format(this.log.formats.time);
  var str, dur, col = {};

  // ---- Colors
  if (entry.type === 'break') {
    col.task = c.grey;
    col.dur  = c.clear;
  } else {
    col.task = c.white;
    col.dur  = c.white;
  }

  // --- Time
  if (options && options.now)
    time = c(time + '  ', c.grey) + c(chk, c.green);
  else
    time = c(time + '  ', c.grey) + ' ';

  // --- Task entry
  if (entry.type === 'task')
    str = f("%s %s", c(entry.project, col.task), entry.task||'');
  else if (entry.reason)
    str = c(dot + ' ' + entry.reason, col.task);
  else
    str = c(dot, col.task);

  // --- Duration
  if (options && options.now) {
    dur = duration(new Date() - entry.date);
    if (dur.length) dur = c(dur, col.dur) + c("+", c.green);
  } else {
    dur = c(duration(entry.duration), col.dur);
  }

  var columns = 79;
  var n = columns-22;
  console.log(f('%12s  %-'+n+'s%10s', time, str, dur));
};

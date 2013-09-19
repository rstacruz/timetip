var c        = require('../helpers').color;
var C        = require('../color');
var duration = require('../helpers').duration;
var f        = require('../formatter');
var pf       = function() { console.log(f.apply(this, arguments)); };

var dot = '⋅';
var dash = '┄ ';
var gt = '›';
var peg = '✈';
var check = '✓';

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

Reporter.description = 'default command-line reporter';

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

  var date  = data.date.format('{month} {dd} {yyyy}');
  var total = duration(data.summary.productive);

  // "1 day ago" or "3:14pm"
  var rel = today ?
    data.date.format(this.log.formats.time) :
    data.date.relative();

  pf("");
  pf("  %-55s%15s",
    f("%s %s %s", // Heading
      C.blue(date),
      C.grey(dash),
      C.blue(rel)),
    f("%s  %s", // Total
      C.grey(check),
      C.blue(total)));
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
  var prefix='', dur, task, suffix='';

  // --- Prefix
  if (options && options.now)
    prefix = C.green(check);

  // --- Task entry
  if (entry.type === 'task') /* task */
    task = f("%s %s",
      C.white(entry.project),
      entry.task||'');
  else if (entry.reason) /* break with reason */
    task = C.grey(f("%s %s",
      dot,
      entry.reason));
  else /* break */
    task = dot;

  // --- Duration
  if (options && options.now)
    dur = duration(new Date() - entry.date);
  else
    dur = duration(entry.duration);

  // -- Duration color
  if (entry.type === 'task')
    dur = C.white(dur);
  else
    dur = C.grey(dur);

  // -- Suffix
  if (options && options.now && dur.length)
    suffix = C.green(" +");

  pf('%9s  %1s  %-48s%10s%s',
    C.grey(time),
    prefix,
    task,
    dur,
    suffix);
};

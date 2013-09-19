var duration = require('../helpers').duration;
var isToday  = require('../helpers').isToday;

var C = require('../color');
var f = require('../formatter');

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

var S = Reporter.symbols = {
  dot   : '⋅',
  tri   : '▸',
  dash  : '┄ ',
  check : '✓',
  cross : '❌'
};

var T = Reporter.theme = {
  mute   : C.use('grey'),
  bold   : C.use('bold white'),
  accent : C.use('blue'),
  now    : C.use('green'),
  err    : C.use('red')
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
  var today = isToday(data.date);

  var date  = data.date.format('{month} {dd} {yyyy}');
  var total = duration(data.summary.productive);

  // "1 day ago" or "3:14pm"
  var rel = today ?
    data.date.format(this.log.formats.time) :
    data.date.relative();

  var heading = 
    f("%s %s %s", // Heading
      T.accent(date),
      T.mute(S.dash),
      T.accent(rel));

  pf("");

  if (!now) {
    pf("  %-55s%15s",
      heading,
      f('%s %s',
        'no entries',
        T.err(S.cross)));
  } else {
    pf("  %-55s%15s",
      heading,
      f("%s  %s", // Total
        T.mute(S.check),
        T.accent(total)));
    pf("");

    entries.forEach(function(entry) { self._entry(entry, { today: today }); });

    // Only show the 'currently working on' if it's today's log.
    if (today) this._entry(now, { today: true, now: true });
  }
};

/**
 * @private
 */

Reporter.prototype._entry = function(entry, options) {
  var time = entry.date.format(this.log.formats.time);
  var prefix='', dur='', task, suffix='';

  // --- Prefix
  if (options && options.now)
    prefix = C.green(S.check);

  // --- Task entry
  if (entry.type === 'task') /* task */
    task = f("%s %s",
      T.bold(entry.project),
      entry.task||'');
  else if (entry.reason) /* break with reason */
    task = T.mute(f("%s %s",
      S.dot,
      entry.reason));
  else /* break */
    task = S.dot;

  // --- Duration
  if (entry.duration)
    dur = duration(entry.duration);
  else if (entry.date)
    dur = duration(new Date() - entry.date);

  // -- Suffix
  if (options && options.now && dur.length)
    suffix = T.now(" +");

  // -- Duration color
  if (options && options.now && dur.length === 0)
    dur = T.now(f("%s  %s", S.dot+S.dot, 'now'));
  else if (entry.type === 'task')
    dur = T.bold(dur);
  else
    dur = T.mute(dur);

  pf('%9s  %1s  %-48s%10s%s',
    T.mute(time),
    prefix,
    task,
    dur,
    suffix);
};

// Printf helper
function pf() { console.log(f.apply(this, arguments)); }

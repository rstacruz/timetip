var duration = require('../helpers').duration;
var isToday  = require('../helpers').isToday;

var C = require('../color');
var f = require('../formatter');
var _ = require('underscore');

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
  dot   : '\u22c5',
  tri   : '\u25b8',
  dash  : '\u2504 ',
  check : '\u2713',
  cross : '\u274c'
};

var T = Reporter.theme = {
  mute   : C.use('grey'),
  bold   : C.use('white bold'),
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
  require('../sugar-date');

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
      T.mute(S.dot),
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

    entries.forEach(function(entry) { self._entry(entry); });

    // Only show the 'currently working on' if it's today's log.
    if (today) this._entry(now, { now: true });
  }
};

/**
 * Show dates.
 */

Reporter.prototype.dates = function(dates) {
  require('../sugar-date');

  // Populate the hash
  var hash = {};
  dates.forEach(function(d) {
    var year = d.format('{yyyy}');
    var month = d.format('{mon}');
    var day = d.getDate();

    if (!hash[year]) hash[year] = {};
    if (!hash[year][month]) hash[year][month] = {};
    hash[year][month][day] = true;
  });

  var i = 0;
  _.each(hash, function(months, year) {
    if (i++ > 0) console.log('');
    console.log(f("%s %s", T.now(S.tri), T.bold(year)));

    _.each(months, function(days, month) {
      var line = '';

      _.range(1, 31).forEach(function(day) {
        if (days[day]) line += T.bold(' '+day);
        else if (day < 10) line += T.mute(' '+S.dot);
        else line += T.mute(' '+S.dot+' ');
      });

      console.log(f('  %s%s', T.accent(month), line));
    });
  });
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
      S.dash,
      entry.reason));
  else /* break */
    task = T.mute(S.dash);

  // --- Duration
  if (entry.duration)
    dur = duration(entry.duration);

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

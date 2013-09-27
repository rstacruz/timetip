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
  require('../../vendor/sugar-date');

  var self = this;
  var now = new Date();

  var entries = data.entries;
  var last = data.last;
  var today = isToday(data.date, now);

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

  pf("  %-55s%15s",
    heading,
    total.length ?
      T.accent(total) :
      T.mute('-'));
  pf("");

  if (last) {
    entries.forEach(function(entry) { self._entry(entry); });

    // Only show the 'currently working on' if it's today's log.
    this._entry(last, { now: today });
  } else {
    pf(T.mute("   no entries"));
  }
};


Reporter.prototype.range = function(data) {
  var rep = this;

  data.dates.forEach(function(day) { rep.day(day); });
};

/**
 * Show dates.
 */

Reporter.prototype.dates = function(dates) {
  require('../../vendor/sugar-date');

  var hash = hashifyDates(dates);
  var now = new Date();

  var i = 0;
  _.each(hash, function(months, year) {
    if (i++ > 0) console.log('');
    console.log(f("%s %s", T.now(S.tri), T.bold(year)));

    _.each(months, function(days, sMonth) {
      var line = '', c;

      _.range(1, 31).forEach(function(day) {
        var d = new Date(days.year, days.month, day);
        if (d > now) return;

        if (isWeekend(d)) c = T.err;
        else if (days[day]) c = T.bold;
        else c = T.mute;

        line += ' ';
        if (days[day]) line += c(day);
        else if (day < 10) line += c(S.dot);
        else line += c(S.dot+' ');
      });

      console.log(f('  %s%s', T.accent(sMonth), line));
    });
  });
};

function hashifyDates(dates) {
  // Populate the hash
  var hash = {};
  dates.forEach(function(d) {
    var year = d.format('{yyyy}');
    var month = d.format('{mon}');
    var day = d.getDate();

    if (!hash[year]) hash[year] = {};
    if (!hash[year][month]) {
      hash[year][month] = {
        year: d.getFullYear(),
        month: d.getMonth()
      };
    }

    // Push date
    hash[year][month][day] = true;
  });

  return hash;
}

function isWeekend(d) {
  var day = d.getDay();
  return (day === 0);
  // return (day === 0 || day === 6);
}

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

/**
 * For `t summary`
 *
 *  - `summary` - (Object) the result of Summarize()
 *  - `data` - (Object) gotten from TimeLog#range()
 */

Reporter.prototype.summary = function(summary, data) {
  var projects = summary.projects;

  pf('  %s', T.accent('projects:'));

  _.each(projects, function(project, name) {
    var dur = f('%ih', project.duration / 3600000);
    pf ('%9s %s', T.mute(dur), T.bold(name));
  });
};

// Printf helper
function pf() { console.log(f.apply(this, arguments)); }

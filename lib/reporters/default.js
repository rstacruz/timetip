var c        = require('../helpers').color;
var duration = require('../helpers').duration;
var f        = require('printf');

var dot = '⋅';
var dash = '┄ ';
var gt = '›';
var peg = '✈';
var chk = '✓';

var Reporter = module.exports = {
  // Report a single day
  day: function(data, log) {
    var self = this;
    var entries = data.entries;
    var now = data.last;

    console.log("");
    console.log("  " + c(data.date.format('{month} {dd} {yyyy}'), 34));
    console.log("");

    if (now) {
      entries.forEach(function(entry) { self.entry(entry); });
      this.entry(now, { now: true });
    } else {
      console.log("  no entries");
    }

    console.log('');
  },

  entry: function(entry, options) {
    var time = entry.date.format(App.log.formats.time);
    var str, dur;

    var col;
    if (entry.type === 'break')
      col = 30;
    else
      col = 37;

    if (entry.type === 'task')
      str = f("%s %s", c(entry.project, col), entry.task||'');
    else if (entry.reason)
      str = c(dot + ' ' + entry.reason, col);
    else
      str = c(dot, col);

    if (options && options.now) {
      time = c(time + '  ', 30) + c(chk, 32);
      dur = duration(new Date() - entry.date);
      if (dur.length)
        dur = c(duration(new Date() - entry.date), 37) + c("+", 32);
      console.log(f('%29s  %-65s  %22s', time, str, dur));
    } else {
      time = c(time + '  ', 30) + c(' ', 32);
      dur = c(duration(entry.duration), 37);
      console.log(f('%29s  %-65s  %12s', time, str, dur));
    }
  }
};


var f = require('../formatter');
var symbols = require('./default').symbols;
var duration = require('../helpers').duration;

var TmuxReporter = module.exports = function(log, options) {
  this.log = log;
};

TmuxReporter.description = 'tmux status bar';

var theme = TmuxReporter.theme = {
  sep: '#[fg=0] '+symbols.dot+' ',
  task: {
    name: '#[fg=7]',
    time: '#[fg=4]'
  },
  'break': {
    'default': 'idle',
    name: '#[fg=0]',
    time: '#[fg=2]'
  }
};

TmuxReporter.prototype.day = function(data) {
  if (!data.today) return;

  var now = data.last;
  var dur = duration(now.duration);

  if (dur.length === 0) dur = 'now';

  if (now.type === 'task')
    console.log([
      theme.task.name,
      now.project,
      theme.sep,
      theme.task.time,
      dur
    ].join(''));

  // Break (only if > 1m)
  else if (now.duration > 60000)
    console.log([
      theme['break'].name,
      now.reason || theme['break']['default'],
      theme.sep,
      theme['break'].time,
      dur
    ].join(''));
};

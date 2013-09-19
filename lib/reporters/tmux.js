var f = require('../formatter');
var duration = require('../helpers').duration;

var TmuxReporter = module.exports = function(log, options) {
  this.log = log;
};

TmuxReporter.description = 'tmux status bar';

var theme = TmuxReporter.theme = {
  task: {
    name: '#[fg=7]',
    time: '#[fg=4]'
  },
  'break': {
    time: '#[fg=0]'
  }
};

TmuxReporter.prototype.day = function(data) {
  if (!data.today) return;

  var now = data.last;
  var dur = duration(now.duration);

  if (dur.length === 0) dur = 'now';

  if (now.type === 'task')
    console.log(f("%s%s %s%s",
      theme.task.name,
      now.project,
      theme.task.time,
      dur));

  // Break (only if > 1m)
  else if (now.duration > 60000)
    console.log(f("%s%s",
      theme['break'].time,
      dur));
};

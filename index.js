module.exports = {
  TimeLog: require('./lib/time_log'),
  reporters: {
    'default': require('./lib/reporters/default'),
    'json': require('./lib/reporters/json'),
    'tmux': require('./lib/reporters/tmux')
  },
  utils: {
    formatter: require('./lib/formatter'),
    color: require('./lib/color')
  }
};

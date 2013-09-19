module.exports = {
  TimeLog: require('./lib/time_log'),
  reporters: {
    'default': require('./lib/reporters/default'),
    'json': require('./lib/reporters/json')
  }
};

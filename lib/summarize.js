var keysort = require('./helpers').keysort;
var _ = require('underscore');

module.exports = function(range) {
  var dates = range.dates;
  var projects = {};

  dates.forEach(function(day) {
    day.entries.forEach(function(e) {
      if (e.type === 'task') {
        if (!projects[e.project])
          projects[e.project] = { duration: 0, days: {} };

        projects[e.project].duration += e.duration;
        projects[e.project].days[+day.date] = true;
      }
    });
  });

  // Summarize days
  _.each(projects, function(project) {
    project.days = _.size(project.days);
  });

  projects = keysort(projects, function(p) { return -1 * p.duration; });

  return {
    projects: projects
  };
};

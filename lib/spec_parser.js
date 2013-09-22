var re = {};

var t = /\d+(?::\d\d)?(?:[ap]m)?/.source;
re.mins     = /(?:minutes?|mins?|m)/ig;
re.hours    = /(?:hours?|hrs?|h)/ig;     // eg: "hour", "hrs"
re.time     = new RegExp('^'+t+'\\s*|\\s*?'+t+'$', 'i'); // eg: "12:30pm"
re.duration = new RegExp(
  "\\s*"+
  "((?:\\d+ *(?:"+re.mins.source+"|"+re.hours.source+") ))"+
  "(ago|from now)",
  'i');

/**
 * Parses natural-language specs.
 *
 *     parse("MyProject do mockups")
 *     parse("MyProject do mockups 2m ago")
 *
 * Returns a JSON hash.
 */

var SpecParser = module.exports = function(str, options) {
  require('../vendor/sugar-date');

  var date = new Date();
  var m;

  // Handle "11:20pm"
  str = str.replace(re.time, function(time) {
    date = Date.create(date.format('{yyyy}-{MM}-{dd} '+time));
    return '';
  });

  // Handle "3m ago"
  str = str.replace(re.duration, function(_, dur, direction) {
    dur = dur
      .replace(re.mins, ' minutes ')
      .replace(re.hours, ' hours ');

    date = Date.create(dur + direction);
    return '';
  });

  if (options && options.mode === 'break') {
    var reason = str.trim();
    if (reason.length === 0) reason = null;

    return {
      type: 'break',
      reason: reason,
      date: date
    };
  }
  else {
    // Split into first word + rest
    m = str.match(/^([^\s]+)(?:\s(.*))?$/);
    if (!m) return;

    return {
      type: 'task',
      project: m[1],
      task: m[2]||null,
      date: date
    };
  }
};

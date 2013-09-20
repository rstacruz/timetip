/**
 * Parses natural language dates.
 *
 *     DateParser.any('2d ago')             //=> Date
 *     DateParser.any('yesterday - today')  //=> [Date, Date]
 */

var DateParser = module.exports = {};

/**
 * Both
 */

DateParser.any = function(str) {
  return DateParser.range(str) || DateParser.date(str);
};

/**
 * Single date
 */

DateParser.date = function(str) {
  require('./sugar-date');

  str = str
    .replace(/(\d+)d(\s|$)/g, function(_,d,s) { return d + " days"+s; })
    .replace(/(\d+)h(\s|$)/g, function(_,d,s) { return d + " hours"+s; });

  var date = Date.create(str);
  return isNaN(+date) ? null : date;
};

/**
 * Range
 */

DateParser.range = function(str) {
  var m = str.match(/^(.*?) (?:-|to) (.*?)$/);
  if (!m) return;

  var from = DateParser.date(m[1]);
  if (!from) return;

  var to = DateParser.date(m[2]);
  if (!to) return;

  return [from, to];
};

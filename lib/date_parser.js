/**
 * Parses natural language dates.
 */

var DateParser = module.exports = function(str) {
  require('sugar');

  str = str
    .replace(/(\d+)d(\s|$)/g, function(_,d,s) { return d + " days"+s; })
    .replace(/(\d+)h(\s|$)/g, function(_,d,s) { return d + " hours"+s; });

  var date = Date.create(str);
  return isNaN(+date) ? null : date;
};

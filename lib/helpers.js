var Helpers = module.exports = {};

/**
 * Converts `n` milliseconds into a duration string.
 */

Helpers.duration = function(n) {
  var f = Math.floor;
  var secs = f(n / 1000);
  var re = [];

  if (secs > 3600) { var h = f(secs/3600); re.push(h+'h'); secs -= h*3600; }
  if (secs > 60) { var m = f(secs/60); re.push(m+'m'); secs -= m*60; }
  // if (secs > 0) { re.push(s+'s'); }

  return re.join(' ');
};

/**
 * Colorizes.
 */

Helpers.color = function(str, c) {
  return "\033["+c+"m"+str+"\033[0m";
};

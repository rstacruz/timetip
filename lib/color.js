/**
 * ANSI colorizer.
 *
 *     var c = require('color');
 *
 * Use it as:
 *
 *     c.blue("Hello");
 *
 * Or:
 *
 *     c('blue', 'Hello');
 *     c(34, 'Hello');        // raw ansi code
 */

var color = module.exports = function(c, str) {
  if (typeof c === 'string' && c.match(/^[^\d]/))
    c = color.map[c];

  if (process.env.NO_COLOR || !c)
    return str;
  else
    return "\033["+c+"m"+str+"\033[0m";
};

color.map = {
  bold    : 1,
  reverse : 3,
  uline   : 4,
  blink   : 5,
  grey    : 30,
  red     : 31,
  green   : 32,
  yellow  : 33,
  blue    : 34,
  magenta : 35,
  cyan    : 36,
  white   : 37
};

function use(c) { return function(str) { return color(c, str); }; }
for (var name in color.map)
  color[name] = use(color.map[name]);

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
 *
 * You can use multiple flags:
 *
 *     c('bold red', 'Hello');
 */

var color = module.exports = function(c, str) {
  c = color.ansi(c);

  if (process.env.NO_COLOR || !c)
    return str;
  else
    return "\033["+c+"m"+str+"\033[0m";
};

/**
 * Great map of color names.
 */

color.symbols = {
  clear   : 0,
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

/**
 * Functionizes a color.
 *
 *     var accent = color.use('blue');
 *     accent('hello');
 *
 * Example:
 *
 *     var theme = {
 *       strong: color.use('green'),
 *       h1:     color.use('bold white')
 *     };
 *
 *     console.log(theme.h1('Books:'));
 *     console.log(theme.strong("Cuckoo's Calling") + " by R. Galbraith");
 */

color.use = function(c) {
  c = color.ansi(c);
  return function(str) { return color(c, str); };
};

/**
 * Converts a symbol string to an ansi color code.
 *
 *     color.ansi('red')      //=> 31
 *     color.ansi('bold red') //=> 1;31
 */

color.ansi = function(str) {
  // Raw ansi code (32)
  if (typeof str === 'number')
    return str;

  // Raw ansi code as string ("32")
  if (typeof str === 'string' && str.match(/^\d/))
    return str;

  // Multiple words ("bold red")
  if (typeof str === 'string' && str.indexOf(' ') > -1)
    return str.split(' ')
      .map(function(s) { return color.symbols[s]; })
      .join(';');

  return color.symbols[str];
};

for (var name in color.symbols)
  color[name] = color.use(color.symbols[name]);

/**
 * ANSI colorizer.
 *
 *     var c = require('color');
 *
 * Use it as:
 *
 *     c('blue', 'Hello');
 *
 * You can use multiple flags (see `color.flags` for a list):
 *
 *     c('bold red', 'Hello');
 *     c('white bgblue', 'Hello');
 *     c('underline red', 'Hello');
 *
 * Or raw ANSI codes:
 *
 *     c(34, 'Hello');
 *
 * You can also use shortcuts:
 *
 *     c.blue('Hello');
 *
 * Or make your own theme with `.use()`:
 *
 *     em = color.use('green');
 *     h1 = color.use('bold white');
 *
 *     h1('Books:');
 *     em("Cuckoo's Calling");
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

color.flags = {
  clear     : 0,
  bold      : 1,
  reverse   : 3,
  underline : 4,
  blink     : 5,

  grey      : 30,
  red       : 31,
  green     : 32,
  yellow    : 33,
  blue      : 34,
  magenta   : 35,
  cyan      : 36,
  white     : 37,

  bggrey    : 40,
  bgred     : 41,
  bggreen   : 42,
  bgyellow  : 43,
  bgblue    : 44,
  bgmagenta : 45,
  bgcyan    : 46,
  bgwhite   : 47
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
      .map(function(s) { return color.flags[s]; })
      .join(';');

  return color.flags[str];
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
 *       em: color.use('green'),
 *       h1: color.use('bold white')
 *     };
 *
 *     console.log(theme.h1('Books:'));
 *     console.log(theme.em("Cuckoo's Calling") + " by R. Galbraith");
 */

color.use = function(c) {
  c = color.ansi(c);
  return function(str) { return color(c, str); };
};


/**
 * Expose `c.blue()` shortcuts (and so on).
 */

for (var name in color.flags)
  color[name] = color.use(color.flags[name]);

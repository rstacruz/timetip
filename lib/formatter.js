var Fmt = module.exports = function() {
  // Token regexp
  // Separated into these parts: % - 2 .10 f
  this.re = new RegExp(
    "%" +
    "("+this.flags.source+")?" + // flags
    "(\\d+)?" +                  // length
    "(?:\\.(\\d+))?" +           // precision
    "("+this.types.source+")",   // type
    "g");
};

Fmt.prototype.types = /[sdifc]/;
Fmt.prototype.flags = /[ \-+0]/;

/**
 * Actually formats.
 */

Fmt.prototype.format = function(spec) {
  var args = arguments;
  var i = 1;
  var self = this;

  return spec
    .replace(this.re,
    function(full, flag, len, prec, type) {
      return self.token(
        args[i++],
        {
          flag: flag,
          length: (typeof len === 'string') ? parseInt(len, 10) : null,
          precision: (typeof prec === 'string') ? parseInt(prec, 10) : null,
          type: type,
          full: full
        });
    });
};

/**
 * Processes a token.
 */

Fmt.prototype.token = function(src, token) {
  var text;

  // Account for `type` flags
  // Delegate it to the `.from_c()` methods, or revert to plain .toString()
  var fn = this["from_"+token.type];
  if (fn) text = fn.apply(this, arguments);
  else text = src.toString();

  // Account for length
  if (token.length)
    text = this.pad(text, token.length, token.flag);

  return text;
};

Fmt.prototype.from_f = function(f, token) {
  return floatToString(f, token.precision);
};

Fmt.prototype.from_c = function(char, token) {
  return String.fromCharCode(parseInt(char, 10));
};

Fmt.prototype.from_i = function(i, token) {
  return (token.flag === "+") ? "+"+i : ""+i;
};

Fmt.prototype.from_d = Fmt.prototype.from_i;


/**
 * Pads a given string for `n` stuff.
 */

Fmt.prototype.pad = function(str, n, flag) {
  var len = this.length(str);
  if (len >= n) return str;

  // Calculate remainder
  var char = flag === "0" ? "0" : " ";
  var space = repeat(char, n-len);

  if (flag === "-") return str + space;
  else return space + str;
};

/**
 * Returns the length of a given string.
 * You can reimplement this.
 */

Fmt.prototype.length = function(str) {
  // Strip ansi codes
  var mstr = str.replace(/\033\[[\d;]*m/g, '');

  return mstr.length;
};

/**
 * Shortcut for console.log.
 */

Fmt.prototype.print = function() {
  console.log(this.format.apply(this, arguments));
};

/**
 * Stringifies a float number.
 *
 *     floatToString(3.14159)      //=> "3.14159"
 *     floatToString(3.14159, 2)   //=> "3.14"
 */

function floatToString(n, prec) {
  if (typeof prec === 'number' && prec > 0) {
    var x = Math.pow(10, prec);

    // Get left and right of decimal point
    var left = Math.floor(n);
    var right = (Math.round(n*x) / x).toString().split('.')[1];

    // Pad by extra zeros
    if (right.length < prec) right += repeat('0', prec-right.length);

    return left + "." + right;
  }
  else
    return n.toString();
}

/**
 * Repeats a given character `char` by  `n` times.
 * @private
 */

function repeat(char, n) {
  var str = '';
  for (var i=0; i<n; i++) str += char;
  return str;
}


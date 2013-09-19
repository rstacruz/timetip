// TODO: %x

var Fmt = module.exports = function() {
  return Fmt.format.apply(this, arguments);
};

var types = /[sdifc]/;
var flags = /[ \-+0]/;

// Token regexp
// Separated into these parts: % - 2 .10 f
var re = new RegExp(
  "%" +
  "("+flags.source+")?" +      // flags
  "(\\d+)?" +                  // length
  "(?:\\.(\\d+))?" +           // precision
  "("+types.source+")",        // type
  "g");

/**
 * Performs formatting.
 */

Fmt.format = function(spec) {
  var args = arguments, i = 1;
  return spec
    .replace(re,
    function(full, flag, len, prec, type) {
      return Fmt.token(
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

Fmt.token = function(src, token) {
  var text;

  // Account for `type` flags
  // Delegate it to the `.flag` methods, or revert to plain .toString()
  var fn = this.flags[token.type];
  if (fn) text = fn.apply(this, arguments);
  else text = src.toString();

  // Account for length
  if (token.length)
    text = pad(text, token.length, token.flag);

  return text;
};

Fmt.flags = {
  f: function(f,  token) { return floatToString(f, token.precision); },
  c: function(ch, token) { return String.fromCharCode(parseInt(ch, 10)); },
  i: function(i,  token) { return (token.flag === "+") ? "+"+i : ""+i; }
};

Fmt.flags.d = Fmt.flags.i;

/**
 * Returns the length of a given string.
 * You can reimplement this.
 */

Fmt.len = function(str) {
  // Strip ansi codes
  return str.replace(/\033\[[\d;]*m/g, '').length;
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

/**
 * Pads a given string for `n` stuff.
 */

function pad(str, n, flag) {
  var len = Fmt.len(str);
  if (len >= n) return str;

  // Calculate remainder
  var char = flag === "0" ? "0" : " ";
  var space = repeat(char, n-len);

  if (flag === "-") return str + space;
  else return space + str;
}


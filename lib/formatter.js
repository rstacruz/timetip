/**
 * Printf-style formatter.
 *
 *     var f = require('formatter');
 *
 *     console.log(f("Hello %s", "John"));
 *
 * Features:
 *
 *  - Supports most everything
 *  - Padding  (`f("%6s", "John") => "  John")
 *  - Named groups  (`f("%(name)s", { name: "John" })`)
 *  - It's ansi-color aware (wohoo!)
 */

var Fmt = module.exports = function() {
  return Fmt.format.apply(this, arguments);
};

var types = /[sdifcx]/;
var flags = /[ \-+0]/;

// Token regexp
// Separated into these parts: % - 2 .10 f
var re = new RegExp(
  "%" +
  "(?:\\((.*?)\\))?" +         // string index
  "(?:(\\d+)\\$)?" +           // numeric index
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
  return spec.replace(re,
    function(full, strIndex, nIndex, flag, len, prec, type) {
      var src;

      if (strIndex) src = args[1][strIndex];
      else if (nIndex) src = args[parseInt(nIndex, 10)];
      else src = args[i++];

      return Fmt.token(src, {
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

  var fn = this.flags[token.type];

  // Account for `type` flags
  // Delegate it to the `.flag` methods, or revert to plain .toString()
  if (fn)
    text = fn.apply(this, arguments);
  else if (!src)
    text = '';
  else
    text = src.toString();

  // Account for length
  if (token.length)
    text = pad(text, token.length, token.flag);

  return text;
};

Fmt.flags = {
  f: function(f,  token) { return floatToString(f, token.precision); },
  c: function(ch, token) { return String.fromCharCode(parseInt(ch, 10)); },
  i: function(i,  token) { i = Math.floor(i); return (token.flag === "+") ? "+"+i : ""+i; },
  x: function(i,  token) { return i.toString(16); }
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
 * @private
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
 * @private
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

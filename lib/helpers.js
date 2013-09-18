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

var c = Helpers.color = function(str, c) {
  return "\033["+c+"m"+str+"\033[0m";
};

/**
 * Print a usage field.
 *
 *     printUsage('tw', 'tw stop <task>    # stops a task');
 */

Helpers.printUsage = function(name, str, col) {
  var f = require('printf');

  var m = str.match(/^[a-z]+ (?:((?:--)?[a-z]+) )?(?:(.*?))? *# (.*)$/);
  var cmd = m[1], args = m[2].toLowerCase(), text = m[3];
  text = text.replace(/`(.*?)`/, function(_, a) { return c(a, col); });
  cmd = (!cmd) ? name : (name+' '+cmd);
  var left = c(cmd,col) + ' ' + c(args||'', 30);
  console.log(f('    %-45s %s', left, text));
};

/**
 * Opens a given file in the default editor.
 */

Helpers.openEditor = function(file) {
  var spawn = require('child_process').spawn;
  var bin = process.env['EDITOR'];
  var cmd = bin+" "+file;

  // Vim hack to open the file and scroll to the last line
  // (`vim + ~/.timelogs`)
  if (bin.match(/vim$/)) cmd = bin+" + "+file;

  // Spawn
  var proc = spawn('sh', ['-c', cmd], { stdio: 'inherit' });
};

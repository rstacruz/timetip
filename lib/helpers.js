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
 * Print a usage field.
 *
 *     printUsage('tw', 'tw stop <task>    # stops a task');
 */

Helpers.printUsage = function(name, str, color) {
  var f = require('./formatter').format;
  var C = require('./color');
  var m = str.match(/^[a-z]+ (?:((?:-+)?[a-z]*) )?(?:(.*?))? *# (.*)$/);

  var args = m[2].toLowerCase();

  var text = m[3]
    .replace(/`(.*?)`/, function(_, a) { return C(color, a); });

  var cmd = m[1] ?
    f("%s %s", name, m[1]) : name;

  console.log(f('    %-30s %s',
    f('%s %s',
      C(color, cmd),
      C.grey(args || '')),
    text));
};

/**
 * Opens a given file in the default editor.
 */

Helpers.openEditor = function(file) {
  var spawn = require('child_process').spawn;
  var bin = process.env.EDITOR;
  var cmd = bin+" "+file;

  // Vim hack to open the file and scroll to the last line
  // (`vim + ~/.timelogs`)
  if (bin.match(/vim$/)) cmd = bin+" + "+file;

  // Spawn
  var proc = spawn('sh', ['-c', cmd], { stdio: 'inherit' });
};

/**
 * Checks if a given date is today.
 */

Helpers.isToday = function(date) {
  var now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);

  var delta = date - now;
  return delta < 86400000 && delta >= 0;
};

/**
 * Sets an `object`s `key` to `value`, and ensures that it's in the correct
 * position.
 *
 * This ensures the sorted integrity of a given object.
 */

Helpers.sortedPush = function (object, key, value, comp) {
  var _  = require('underscore');
  var re = {};
  var keys = Object.keys(object);

  if (keys.length === 0) {
    re[key] = value;
    return re;
  }

  // Insert at given place in the begin/middle
  var idx = _.sortedIndex(keys, key, comp);
  for (var i=0; i<keys.length; ++i) {
    if (i === idx) re[key] = value;
    re[keys[i]] = object[keys[i]];
  }

  // Insert at the end
  if (i === idx) re[key] = value;

  return re;
};

/**
 * Iterates through each consecutive item.
 */

Helpers.eachCons = function(list, block) {
  var _  = require('underscore');
  var last;
  var re = [];
  _.each(list, function(v, k) {
    if (last) re.push(block(last.v, v, last.k, k));
    last = { v:v, k:k };
  });
  return re;
};

/*
 * Shorthand for fs.readFileSync() that silences ENOENT.
 */

Helpers.readFile = function(filepath) {
  var fs = require('fs');
  try {
    return fs.readFileSync(Helpers.abs(filepath), 'utf-8');
  } catch (e) {
    if (!e.code || e.code !== 'ENOENT') throw e;
  }
};

Helpers.abs = function(filepath) {
  var path = require('path');
  return path.resolve(filepath.replace('~', process.env.HOME));
};

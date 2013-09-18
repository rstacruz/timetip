var SpecParser = module.exports = function(str) {
  var m = str.match(/^([^\s]+)(?:\s(.*))?$/);
  if (!m) return;

  return {
    project: m[1],
    task: m[2]||null
  };
};

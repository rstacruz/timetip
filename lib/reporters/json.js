var JsonReporter = module.exports = function(log, options) {
  this.log = log;
};

JsonReporter.description = 'json exporter';

JsonReporter.prototype.summary =
JsonReporter.prototype.range =
JsonReporter.prototype.day = function(data) {
  console.log(JSON.stringify(data, null, 2));
};

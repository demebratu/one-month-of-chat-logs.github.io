module.exports = function() {
  var fs = require('fs');
  var util = require('util');
  var walk = require('walk');
  var options = this.options();
  var template = fs.readFileSync(options.template).toString();
  var done = this.async();
  var urls = [];

  walk.walk(options.docdir).on('names', function(dir, names) {
    names.forEach(function(name) {
      var path = dir + '/' + name;
      if (/.txt$/.test(name)) {
        urls.push('<a href="' + path + '">' + path + '</a>');
      }
    });
  }).on('end', function() {
    fs.writeFileSync('index.html',
      util.format(template, urls.join('<br />\n    ')));
    done();
  });
};

module.exports.desc = 'generate the index.html listing all of the links';

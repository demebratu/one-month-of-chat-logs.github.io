module.exports = function() {
  var fs = require('fs');
  var _ = require('lodash');
  var walk = require('walk');
  var options = this.options();
  var done = this.async();
  var lastmod = '2013-10-18';
  var base = 'http://he-said-she-said.github.io/';
  var sitemaps = [];
  var pages = [];
  var sitemapSize = 25000;
  var maxSitemaps = Number.MAX_VALUE;
  var template = _.template(fs.readFileSync(options.sitemap).toString());
  var sitemapTemplateString = fs.readFileSync(options.sitemapindex).toString();
  var sitemapTemplate = _.template(sitemapTemplateString);
  var ended;

  function finish() {
    fs.writeFileSync(options.sitemapdir + '/sitemap-index.xml',
      sitemapTemplate({sitemaps: sitemaps}));
    ended = true;
    done();
  }

  walk.walk(options.docdir).on('names', function(dir, names) {
    var fname;

    if (ended)
      return;

    for (var name, i = 0, l = names.length; name = names[i], i < l; i++) {
      if (!/.txt$/.test(name))
        continue;

      pages.push({
        url: base + dir + '/' + name,
        lastmod: lastmod
      });

      if (pages.length >= sitemapSize) {
        fname = options.sitemapdir + '/sitemap-' + sitemaps.length + '.xml';
        fs.writeFileSync(fname, template({pages: pages}));
        sitemaps.push({
          url: base + fname,
          lastmod: lastmod
        });
        pages = [];

        if (sitemaps.length >= maxSitemaps) {
          finish();
          break;
        }
      }
    }
  }).on('end', finish);
};

module.exports.desc = 'generate the sitemap.xml listing all of the links';

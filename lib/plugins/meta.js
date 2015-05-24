'use strict';

var url = require('url');
var path = require('path');

function meta() {
  return function (files, metalsmith, done) {
    var data = metalsmith.metadata();

    for (var file in files) {
      var f = files[file];

      var title = data.meta.title;
      if (f.title) {
        title = f.title + ' — ' + title;
      }

      var keywords = data.meta.keywords;
      if (f.keywords) {
        keywords = f.keywords.concat(keywords);
      }

      f.title = title;
      f.description = f.description || data.meta.description;
      f.keywords = keywords.join(' ');
      f.canonical = url.resolve(
        data.host, file.replace(path.extname(file), '.html'));
    }

    done();
  };
}

module.exports = meta;

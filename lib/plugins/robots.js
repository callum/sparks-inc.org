'use strict';

function robots() {
  return function (files, metalsmith, done) {
    var env = metalsmith.metadata().env;

    for (var file in files) {
      var matches = file.match(/^robots\.(.+)\.txt$/);

      if (matches) {
        if (matches[1] === env) {
          files['robots.txt'] = files[file];
        }

        delete files[file];
      }
    }

    done();
  };
}

module.exports = robots;

'use strict';

var fs = require('fs');

function config() {
  return function (files, metalsmith, done) {
    fs.readFile('./config/default.json', function (err, data) {
      if (err) {
        throw err;
      }

      metalsmith.metadata(JSON.parse(data));
      done();
    });
  };
}

module.exports = config;

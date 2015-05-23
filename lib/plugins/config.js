'use strict';

var fs = require('fs');
var extend = require('xtend');

function getConfig(env, done) {
  fs.readFile('./config/' + env + '.json', function (err, data) {
    if (err) {
      throw err;
    }

    done(JSON.parse(data));
  });
}

function config(env) {
  return function (files, metalsmith, done) {
    getConfig('default', function (defaultData) {
      if (env) {
        getConfig(env, function (data) {
          metalsmith.metadata(extend(defaultData, data));
          done();
        });

        return;
      }

      metalsmith.metadata(defaultData);
      done();
    });
  };
}

module.exports = config;

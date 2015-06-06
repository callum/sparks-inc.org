'use strict';

var knox = require('knox');

function emptyBucket(config, done) {
  var client = knox.createClient(config);

  client.list(function(err, data) {
    if (err) {
      throw err;
    }

    var objects = data.Contents.map(function (object) {
      return object.Key;
    });

    if (objects.length) {
      client.deleteMultiple(objects, function (delErr) {
        if (delErr) {
          throw delErr;
        }

        done();
      });

      return;
    }

    done();
  });
}

module.exports = emptyBucket;

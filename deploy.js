'use strict';

var path = require('path');
var readdirp = require('readdirp');
var s3sync = require('s3-sync');
var emptyBucket = require('./lib/emptyBucket');

var config = {
  key: process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  bucket: process.env.NODE_ENV + '.sparks-inc.org',
  region: 'eu-west-1'
};

emptyBucket(config, function () {
  var files = readdirp({
    root: path.join(__dirname, 'build/')
  });

  var uploader = s3sync(config).on('data', function (file) {
    console.log(file.path + ' -> ' + file.url);
  });

  files.pipe(uploader);
});

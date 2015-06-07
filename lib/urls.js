'use strict';

var mime = require('mime');
var path = require('path');

function lookup(files, metalsmith, srcPath) {
  var fingerprints = metalsmith.metadata().fingerprint;
  var url = srcPath;

  if (fingerprints && fingerprints[url]) {
    url = fingerprints[url];
  }

  return url;
}

function assetUrl(files, metalsmith, srcPath) {
  return path.join('/', lookup(files, metalsmith, srcPath));
}

module.exports.assetUrl = assetUrl;

function dataUrl(files, metalsmith, srcPath) {
  var file = files[lookup(files, metalsmith, srcPath)];

  if (file && !file.base64) {
    var encoded = file.contents.toString('base64');
    file.base64 = 'data:' + mime.lookup(srcPath) + ';base64,' + encoded;
  }

  return file.base64;
}

module.exports.dataUrl = dataUrl;

function pageUrl(files, metalsmith, srcPath) {
  var url = srcPath.replace('.jade', '.html').replace('index.html', '');
  return path.join('/', url);
}

module.exports.pageUrl = pageUrl;


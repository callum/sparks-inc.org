'use strict';

var mime = require('mime');
var path = require('path');

function lookupUrl(files, metalsmith, srcPath) {
  var fingerprints = metalsmith.metadata().fingerprint;

  if (fingerprints && fingerprints[srcPath]) {
    srcPath = fingerprints[srcPath];
  }

  return srcPath;
}

function assetUrl(files, metalsmith, srcPath) {
  return path.join('/', lookupUrl(files, metalsmith, srcPath));
}

module.exports.assetUrl = assetUrl;

function dataUrl(files, metalsmith, srcPath) {
  var file = files[lookupUrl(files, metalsmith, srcPath)];

  if (file && !file.base64) {
    var encoded = file.contents.toString('base64');
    file.base64 = 'data:' + mime.lookup(srcPath) + ';base64,' + encoded;
  }

  return file.base64;
}

module.exports.dataUrl = dataUrl;

function pageUrl(files, metalsmith, srcPath) {
  return path.join('/', srcPath.replace('.jade', '.html'));
}

module.exports.pageUrl = pageUrl;


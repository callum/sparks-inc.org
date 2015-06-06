'use strict';

var path = require('path');

function assetUrl(metalsmith, srcPath) {
  var fingerprints = metalsmith.metadata().fingerprint;

  if (fingerprints && fingerprints[srcPath]) {
    srcPath = fingerprints[srcPath];
  }

  return path.join('/', srcPath);
}

module.exports = assetUrl;

'use strict';

var path = require('path');

function assetUrl(metalsmith, assetPath) {
  var fingerprints = metalsmith.metadata().fingerprint;
  var file = assetPath;

  if (fingerprints) {
    if (fingerprints[file]) {
      file = fingerprints[file];
    }
  }

  return path.join('/', file);
}

module.exports = assetUrl;

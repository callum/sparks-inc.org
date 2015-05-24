'use strict';

var join = require('path').join;

function assetUrl(metalsmith, path) {
  var fingerprints = metalsmith.metadata().fingerprint;

  if (fingerprints && fingerprints[path]) {
    path = fingerprints[path];
  }

  return join('/', path);
}

module.exports = assetUrl;

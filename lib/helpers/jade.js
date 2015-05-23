'use strict';

var assetUrl = require('../assetUrl');

module.exports = function (metalsmith) {
  return {
    assetUrl: function (path) {
      return assetUrl(metalsmith, path);
    }
  };
};

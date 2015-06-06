'use strict';

var path = require('path');
var assetUrl = require('../assetUrl');

module.exports = function (metalsmith) {
  return {
    assetUrl: function (srcPath) {
      return assetUrl(metalsmith, srcPath);
    },

    pageUrl: function (srcPath) {
      return path.join('/', srcPath.replace('.jade', '.html'));
    }
  };
};

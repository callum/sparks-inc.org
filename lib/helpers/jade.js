'use strict';

var path = require('path');
var urls = require('../urls');

module.exports = function (files, metalsmith) {
  return {
    assetUrl: function (srcPath) {
      return urls.assetUrl(files, metalsmith, srcPath);
    },

    dataUrl: function (srcPath) {
      return urls.dataUrl(files, metalsmith, srcPath);
    },

    pageUrl: function (srcPath) {
      return urls.pageUrl(files, metalsmith, srcPath);
    }
  };
};

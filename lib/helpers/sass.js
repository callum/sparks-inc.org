'use strict';

var sass = require('node-sass');
var assetUrl = require('../assetUrl');

module.exports = function (metalsmith) {
  return {
    'asset-url($path)': function (path) {
      var url = assetUrl(metalsmith, path.getValue());
      return new sass.types.String('url(' + url + ')');
    }
  };
};

var sass = require('node-sass')
var urls = require('../urls')

module.exports = function (files, metalsmith, production) {
  return {
    'asset-url($path)': function (path) {
      var url = urls.assetUrl(files, metalsmith, production, path.getValue())
      return new sass.types.String('url(' + url + ')')
    },

    'data-url($path)': function (path) {
      var url = urls.dataUrl(files, metalsmith, production, path.getValue())
      return new sass.types.String('url(' + url + ')')
    }
  }
}

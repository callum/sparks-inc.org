var sass = require('node-sass')
var urls = require('../urls')

module.exports = function (files, metalsmith) {
  return {
    'asset-url($path)': function (path) {
      var url = urls.assetUrl(files, metalsmith, path.getValue())
      return new sass.types.String('url(' + url + ')')
    },

    'data-url($path)': function (path) {
      var url = urls.dataUrl(files, metalsmith, path.getValue())
      return new sass.types.String('url(' + url + ')')
    }
  }
}

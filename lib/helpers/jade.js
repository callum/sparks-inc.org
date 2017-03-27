var urls = require('../urls')

module.exports = function (files, metalsmith, production) {
  return {
    assetUrl: function (srcPath) {
      return urls.assetUrl(files, metalsmith, production, srcPath)
    },

    dataUrl: function (srcPath) {
      return urls.dataUrl(files, metalsmith, production, srcPath)
    },

    pageUrl: function (srcPath) {
      return urls.pageUrl(files, metalsmith, production, srcPath)
    },

    backgroundImageStyle: function (srcPath) {
      var url = urls.assetUrl(files, metalsmith, production, srcPath)
      return { 'background-image': 'url(' + url + ')' }
    }
  }
}

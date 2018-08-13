var urls = require('../urls')

module.exports = function (files, metalsmith) {
  return {
    assetUrl: function (srcPath) {
      return urls.assetUrl(files, metalsmith, srcPath)
    },

    dataUrl: function (srcPath) {
      return urls.dataUrl(files, metalsmith, srcPath)
    },

    pageUrl: function (srcPath) {
      return urls.pageUrl(files, metalsmith, srcPath)
    },

    backgroundImageStyle: function (srcPath) {
      var url = urls.assetUrl(files, metalsmith, srcPath)
      return { 'background-image': 'url(' + url + ')' }
    },

    increaseCost: function(cost, percentageIncrease) {
      var additionalCost = (cost * percentageIncrease) / 100
      var totalCost = Math.round((cost + additionalCost) * 100) / 100
      var simplifiedCost = (Math.ceil((totalCost * 100) / 5) * 5) / 100
      return simplifiedCost.toFixed(2)
    }
  }
}

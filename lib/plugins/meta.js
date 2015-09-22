var url = require('url')
var urls = require('../urls')

function meta () {
  return function (files, metalsmith) {
    var data = metalsmith.metadata()

    for (var file in files) {
      var f = files[file]

      var title = data.meta.title
      if (f.title) {
        title = f.title + ' — ' + title
      }

      var keywords = data.meta.keywords
      if (f.keywords) {
        keywords = f.keywords.concat(keywords)
      }

      f.filename = file
      f.pageTitle = title
      f.pageDescription = f.description || data.meta.description
      f.pageKeywords = keywords.join(' ')

      if (data.host) {
        var pageUrl = urls.pageUrl(files, metalsmith, file)
        f.canonical = url.resolve(data.host, pageUrl)
      }
    }
  }
}

module.exports = meta

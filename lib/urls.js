var mime = require('mime')
var path = require('path')

function lookup (files, metalsmith, srcPath) {
  var fingerprints = metalsmith.metadata().fingerprint

  if (fingerprints && fingerprints[srcPath]) {
    return fingerprints[srcPath]
  }

  return srcPath
}

function assetUrl (files, metalsmith, production, srcPath) {
  return path.join('/', lookup(files, metalsmith, srcPath))
}

module.exports.assetUrl = assetUrl

function dataUrl (files, metalsmith, production, srcPath) {
  if (!production) return pageUrl(files, metalsmith, production, srcPath)
  var file = files[lookup(files, metalsmith, srcPath)]
  var encoded = file.contents.toString('base64')
  return 'data:' + mime.lookup(srcPath) + ';base64,' + encoded
}

module.exports.dataUrl = dataUrl

function pageUrl (files, metalsmith, production, srcPath) {
  var url = srcPath.replace('.jade', '.html').replace('index.html', '')
  return path.join('/', url)
}

module.exports.pageUrl = pageUrl


var mime = require('mime')
var path = require('path')

module.exports.assetUrl = assetUrl
module.exports.dataUrl = dataUrl
module.exports.pageUrl = pageUrl

function lookup (files, metalsmith, srcPath) {
  var fingerprints = metalsmith.metadata().fingerprint
  // console.log(fingerprints)
  if (fingerprints && fingerprints[srcPath]) return fingerprints[srcPath]
  return srcPath
}

function assetUrl (files, metalsmith, srcPath) {
  return path.join('/', lookup(files, metalsmith, srcPath))
}

function dataUrl (files, metalsmith, srcPath) {
  var file = files[lookup(files, metalsmith, srcPath)]
  if (!file) return path.join('/', srcPath)
  var encoded = file.contents.toString('base64')
  return 'data:' + mime.lookup(srcPath) + ';base64,' + encoded
}

function pageUrl (files, metalsmith, srcPath) {
  var url = srcPath.replace('.jade', '.html').replace('index.html', '')
  return path.join('/', url)
}

var path = require('path')
var readdirp = require('readdirp')
var s3sync = require('s3-sync')
var extend = require('xtend')
var emptyBucket = require('./lib/emptyBucket')

var bucket = process.env.NODE_ENV
if (bucket === 'production') bucket = 'www'

var config = {
  key: process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  bucket: bucket + '.sparks-inc.org',
  region: 'eu-west-1'
}

function sync (filter, headers) {
  var opts = extend({
    headers: headers
  }, config)

  var files = readdirp({
    root: path.join(__dirname, 'public/'),
    fileFilter: filter
  })

  var uploader = s3sync(opts).on('data', function (file) {
    console.log(file.path + ' -> ' + file.url)
  })

  files.pipe(uploader)
}

emptyBucket(config, function () {
  sync('**/*.html', {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Encoding': 'gzip'
  })

  sync('**/*.txt', {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Encoding': 'gzip'
  })

  sync('**/*.+(css|js|svg)', {
    'Content-Encoding': 'gzip',
    'Cache-Control': 'max-age=31536000'
  })

  sync('**/*.+(gif|ico|jpg|png|woff|woff2)', {
    'Cache-Control': 'max-age=31536000'
  })
})

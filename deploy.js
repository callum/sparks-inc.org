var path = require('path')
var readdirp = require('readdirp')
var s3sync = require('s3-sync')
var extend = require('xtend')
var emptyBucket = require('./lib/emptyBucket')

var config = {
  key: process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  bucket: process.env.NODE_ENV + '.sparks-inc.org',
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
  sync('**/*.+(html|txt)', {
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

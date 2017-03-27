var path = require('path')
var readdirp = require('readdirp')
var s3sync = require('s3-sync')
var emptyBucket = require('./lib/empty_bucket')
var invalidateCache = require('./lib/invalidate_cache')

var bucket = process.env.NODE_ENV
if (bucket === 'production') bucket = 'www'

var root = path.join(__dirname, 'public/')

var config = {
  key: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: bucket + '.sparks-inc.org',
  region: 'eu-west-1'
}

emptyBucket(config, function (err) {
  if (err) throw err

  var uploader = s3sync(config)
    .on('error', function (err) {
      if (err) throw err
    })
    .on('fail', function (err) {
      console.log('Upload failed', err)
    })
    .on('data', function (file) {
      console.log(file.path + ' -> ' + file.url)
    })
    .on('end', function () {
      invalidateCache(process.env.CLOUDFRONT_DISTRIBUTION_ID, function (err) {
        if (err) throw err
        console.log('Done')
      })
    })

  readdirp({
    fileFilter: '!.*',
    root: root
  }).pipe(uploader)
})

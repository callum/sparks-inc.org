var knox = require('knox')

function emptyBucket (config, done) {
  var client = knox.createClient(config)

  client.list(function (err, data) {
    if (err) done(err)

    var objects = data.Contents.map(function (object) {
      return object.Key
    })

    if (objects.length) {
      client.deleteMultiple(objects, function (err) {
        if (err) done(err)
        done()
      })
      return
    }

    done()
  })
}

module.exports = emptyBucket

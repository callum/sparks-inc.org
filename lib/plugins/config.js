var fs = require('fs')
var xtend = require('xtend')

function getConfig (env, done) {
  fs.readFile('./config/' + env + '.json', function (err, data) {
    if (err) throw err
    done(JSON.parse(data))
  })
}

function config (env, watch) {
  return function (files, metalsmith, done) {
    getConfig('default', function (defaultData) {
      defaultData = xtend({ watch: watch }, defaultData)

      if (env) {
        getConfig(env, function (data) {
          metalsmith.metadata(xtend(defaultData, data))
          done()
        })

        return
      }

      metalsmith.metadata(defaultData)
      done()
    })
  }
}

module.exports = config

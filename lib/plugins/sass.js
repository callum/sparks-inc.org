var lib = require('metalsmith-sass')
var xtend = require('xtend')
var helper = require('../helpers/sass')

module.exports = sass

function sass (opts) {
  return function (files, metalsmith, done) {
    opts = xtend(opts, {
      functions: helper(files, metalsmith)
    })
    return lib(opts)(files, metalsmith, done)
  }
}

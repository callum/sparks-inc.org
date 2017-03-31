var lib = require('metalsmith-jade')
var xtend = require('xtend')
var helper = require('../helpers/jade')

module.exports = jade

function jade (opts) {
  return function (files, metalsmith, done) {
    opts = xtend(opts, {
      locals: helper(files, metalsmith)
    })
    return lib(opts)(files, metalsmith, done)
  }
}

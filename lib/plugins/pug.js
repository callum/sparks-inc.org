var lib = require('metalsmith-pug')
var xtend = require('xtend')
var helper = require('../helpers/pug')

module.exports = pug

function pug (opts) {
  return function (files, metalsmith, done) {
    opts = xtend(opts, {
      locals: helper(files, metalsmith)
    })
    return lib(opts)(files, metalsmith, done)
  }
}

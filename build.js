var metalsmith = require('metalsmith')
var changed = require('metalsmith-changed')
var collections = require('metalsmith-collections')
var fingerprint = require('metalsmith-fingerprint-ignore')
var gzip = require('metalsmith-gzip')
var ignore = require('metalsmith-ignore')
var jade = require('metalsmith-jade')
var postcss = require('metalsmith-postcss')
var sass = require('metalsmith-sass')
var patterns = require('css-patterns')
var config = require('./lib/plugins/config')
var meta = require('./lib/plugins/meta')
var robots = require('./lib/plugins/robots')
var jadeHelper = require('./lib/helpers/jade')
var sassHelper = require('./lib/helpers/sass')

var m = metalsmith(__dirname)

var watchmode = process.argv[2] === '-w'
var production =
  process.env.NODE_ENV === 'staging' ||
  process.env.NODE_ENV === 'production'

m.destination('public')

if (!production) {
  m.clean(false)
  m.use(changed())
}

m.use(config(process.env.NODE_ENV))
m.use(ignore([
  'includes/**/*',
  'layouts/**/*',
  'mixins/**/*'
]))

if (production) {
  m.use(fingerprint({
    pattern: [
      'fonts/**/*',
      'images/**/*'
    ]
  }))
}

m.use(function (f, m, d) {
  return sass({
    outputDir: 'css',
    outputStyle: production ? 'compressed' : 'expanded',
    sourceMap: !production,
    sourceMapContents: !production,
    sourceMapEmbed: !production,
    includePaths: patterns.includePaths,
    functions: sassHelper(f, m, production)
  })(f, m, d)
})
m.use(postcss([
  require('autoprefixer'),
  require('css-mqpacker')({ sort: true }),
  require('postcss-focus')
]))
m.use(collections({
  posts: {
    pattern: 'blog/!(index).jade',
    reverse: true,
    sortBy: 'date'
  }
}))

if (production) {
  m.use(fingerprint({ pattern: 'css/**/*' }))
}

m.use(meta(production))
m.use(function (f, m, d) {
  return jade({
    pretty: true,
    useMetadata: true,
    locals: jadeHelper(f, m, production)
  })(f, m, d)
})
m.use(robots())

if (production) {
  m.use(gzip({ overwrite: true }))
}

m.build(function (err) {
  if (err) throw err
})

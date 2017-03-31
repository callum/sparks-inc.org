var metalsmith = require('metalsmith')
var collections = require('metalsmith-collections')
var fingerprint = require('metalsmith-fingerprint-ignore')
var ignore = require('metalsmith-ignore')
var postcss = require('metalsmith-postcss')
var serve = require('metalsmith-serve')
var watch = require('metalsmith-watch')
var patterns = require('css-patterns')
var config = require('./lib/plugins/config')
var jade = require('./lib/plugins/jade')
var meta = require('./lib/plugins/meta')
var robots = require('./lib/plugins/robots')
var sass = require('./lib/plugins/sass')

var msmith = metalsmith(__dirname)

var watchmode = process.argv[2] === '-w'
var production =
  process.env.NODE_ENV === 'staging' ||
  process.env.NODE_ENV === 'production'

msmith.destination('public')

msmith.use(ignore([
  'includes/**/*',
  'layouts/**/*',
  'mixins/**/*',
  '**/.*'
]))
msmith.use(config(process.env.NODE_ENV, watchmode))
msmith.use(meta())
msmith.use(robots())

if (production) {
  msmith.use(fingerprint({
    pattern: [
      '**/*.!(jade|scss)',
      '!favicon.ico',
      '!robots.txt'
    ]
  }))
}

msmith.use(sass({
  outputDir: 'css',
  outputStyle: production ? 'compressed' : 'expanded',
  sourceMap: !production,
  sourceMapContents: !production,
  sourceMapEmbed: !production,
  includePaths: patterns.includePaths
}))
msmith.use(postcss([
  require('autoprefixer'),
  require('css-mqpacker')({ sort: true }),
  require('postcss-focus')
]))

if (production) msmith.use(fingerprint({ pattern: ['**/*.css'] }))

msmith.use(collections({
  posts: {
    pattern: 'blog/!(index).jade',
    reverse: true,
    sortBy: 'date'
  }
}))
msmith.use(jade({
  pretty: true,
  useMetadata: true
}))

if (watchmode) {
  msmith.use(watch({
    paths: {
      'config/**/*': '**/*',
      'src/**/*.jade': '**/*.jade',
      'src/**/*.scss': 'scss/index.scss',
      'src/**/*.!(jade|scss)': true
    },
    livereload: true
  }))
  msmith.use(serve({
    host: '0.0.0.0',
    port: process.env.PORT || 8000
  }))
}

msmith.build(function (err) {
  if (err) throw err
})

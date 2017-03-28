var metalsmith = require('metalsmith')
var collections = require('metalsmith-collections')
var ignore = require('metalsmith-ignore')
var jade = require('metalsmith-jade')
var postcss = require('metalsmith-postcss')
var sass = require('metalsmith-sass')
var serve = require('metalsmith-serve')
var watch = require('metalsmith-watch')
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

m.use(config(process.env.NODE_ENV, watchmode))
m.use(ignore([
  'includes/**/*',
  'layouts/**/*',
  'mixins/**/*'
]))

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

m.use(meta(production))
m.use(function (f, m, d) {
  return jade({
    pretty: true,
    useMetadata: true,
    locals: jadeHelper(f, m, production)
  })(f, m, d)
})
m.use(robots())

if (watchmode) {
  m.use(watch({
    paths: {
      'config/**/*': '**/*',
      'src/**/*.jade': '**/*.jade',
      'src/**/*.scss': 'scss/index.scss',
      'src/**/*.!(jade|scss)': true
    },
    livereload: true
  }))
  m.use(serve({
    host: '0.0.0.0',
    port: process.env.PORT || 8000
  }))
}

m.build(function (err) {
  if (err) throw err
})

'use strict';

var metalsmith = require('metalsmith');
var fingerprint = require('metalsmith-fingerprint');
var gzip = require('metalsmith-gzip');
var ignore = require('metalsmith-ignore');
var jade = require('metalsmith-jade');
var postcss = require('metalsmith-postcss');
var sass = require('metalsmith-sass');
var serve = require('metalsmith-serve');
var watch = require('metalsmith-watch');
var patterns = require('css-patterns');
var config = require('./lib/plugins/config');
var meta = require('./lib/plugins/meta');
var robots = require('./lib/plugins/robots');
var jadeHelper = require('./lib/helpers/jade');
var sassHelper = require('./lib/helpers/sass');

var m = metalsmith(__dirname);

var watchmode = process.argv[2] === '-w';
var production =
  process.env.NODE_ENV === 'staging' ||
  process.env.NODE_ENV === 'production';

m.use(config(process.env.NODE_ENV, watchmode));
m.use(ignore([
  'layouts/**/*',
  'partials/**/*'
]));

if (production) {
  m.use(fingerprint({
    pattern: [
      'fonts/**/*',
      'images/**/*'
    ]
  }));
}

m.use(function (files, metalsmith, done) {
  return sass({
    outputDir: 'css',
    outputStyle: production ? 'compressed' : 'expanded',
    sourceMap: !production,
    sourceMapContents: !production,
    sourceMapEmbed: !production,
    includePaths: patterns.includePaths,
    functions: sassHelper(files, metalsmith)
  }).apply(this, arguments);
});
m.use(postcss([
  require('autoprefixer'),
  require('css-mqpacker'),
  require('postcss-focus')
]));

if (production) {
  m.use(fingerprint({ pattern: 'css/**/*' }));
}

m.use(meta());
m.use(function (files, metalsmith, done) {
  return jade({
    pretty: true,
    useMetadata: true,
    locals: jadeHelper(files, metalsmith)
  }).apply(this, arguments);
});
m.use(robots());

if (production) {
  m.use(gzip({ overwrite: true }));
}

if (watchmode) {
  m.use(watch({
    paths: {
      'config/**/*': '**/*',
      'src/**/*': true,
      'src/scss/**/*': '**/*.scss',
      'src/layouts/**/*': '**/*.jade',
      'src/partials/**/*': '**/*.jade'
    },
    livereload: true
  }));
  m.use(serve({
    host: '0.0.0.0',
    port: process.env.PORT
  }));
}

m.build(function (err) {
  if (err) {
    throw err;
  }
});

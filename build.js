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

var ms = metalsmith(__dirname);

var watchmode = process.argv[2] === '-w';
var production =
  process.env.NODE_ENV === 'staging' ||
  process.env.NODE_ENV === 'production';

ms.use(config(process.env.NODE_ENV, watchmode));
ms.use(ignore([
  'layouts/**/*',
  'partials/**/*'
]));

if (production) {
  ms.use(fingerprint({
    pattern: [
      'fonts/**/*',
      'images/**/*'
    ]
  }));
}

ms.use(function (f, m, d) {
  return sass({
    outputDir: 'css',
    outputStyle: production ? 'compressed' : 'expanded',
    sourceMap: !production,
    sourceMapContents: !production,
    sourceMapEmbed: !production,
    includePaths: patterns.includePaths,
    functions: sassHelper(f, m)
  })(f, m, d);
});
ms.use(postcss([
  require('autoprefixer'),
  require('css-mqpacker'),
  require('postcss-focus')
]));

if (production) {
  ms.use(fingerprint({ pattern: 'css/**/*' }));
}

ms.use(meta());
ms.use(function (f, m, d) {
  return jade({
    pretty: true,
    useMetadata: true,
    locals: jadeHelper(f, m)
  })(f, m, d);
});
ms.use(robots());

if (production) {
  ms.use(gzip({ overwrite: true }));
}

if (watchmode) {
  ms.use(watch({
    paths: {
      'config/**/*': '**/*',
      'src/**/*': true,
      'src/scss/**/*': '**/*.scss',
      'src/layouts/**/*': '**/*.jade',
      'src/partials/**/*': '**/*.jade'
    },
    livereload: true
  }));
  ms.use(serve({
    host: '0.0.0.0',
    port: process.env.PORT
  }));
}

ms.build(function (err) {
  if (err) {
    throw err;
  }
});

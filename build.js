'use strict';

var metalsmith = require('metalsmith');
var autoprefixer = require('metalsmith-autoprefixer');
var fingerprint = require('metalsmith-fingerprint');
var ignore = require('metalsmith-ignore');
var jade = require('metalsmith-jade');
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
  m.use(fingerprint({ pattern: 'img/**/*' }));
}

m.use(sass({
  outputDir: 'css',
  outputStyle: production ? 'compact' : 'expanded',
  includePaths: patterns.includePaths,
  functions: sassHelper(m)
}));
m.use(autoprefixer());

if (production) {
  m.use(fingerprint({ pattern: 'css/**/*' }));
}

m.use(meta());
m.use(jade({
  pretty: true,
  useMetadata: true,
  locals: jadeHelper(m)
}));
m.use(robots());

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
  m.use(serve({ port: process.env.PORT }));
}

m.build(function (err) {
  if (err) {
    throw err;
  }
});

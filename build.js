'use strict';

var metalsmith = require('metalsmith');
var autoprefixer = require('metalsmith-autoprefixer');
var gzip = require('metalsmith-gzip');
var fingerprint = require('metalsmith-fingerprint');
var jade = require('metalsmith-jade');
var sass = require('metalsmith-sass');
var patterns = require('css-patterns');
var config = require('./lib/plugins/config');
var meta = require('./lib/plugins/meta');
var jadeHelper = require('./lib/helpers/jade');
var sassHelper = require('./lib/helpers/sass');

var production = process.env.NODE_ENV === 'production';

var m = metalsmith(__dirname);

m.use(config());

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

if (production) {
  m.use(gzip({
    src: '**/*.{css,svg}',
    overwrite: true
  }));
}

m.build(function (err) {
  if (err) {
    throw err;
  }
});

'use strict';

const browserify = require('browserify');
const paths = require('../../paths');
const patterns = require('../../patterns');
const source = require('vinyl-source-stream');

module.exports = function (gulp) {
  return function () {
    return browserify(patterns.src.app.bundle)
      .transform('babelify', require('../../configs/babelify'))
      .bundle()
      .pipe(source('main.js', paths.dest.js))
      .pipe(gulp.dest(paths.dest.js));
  };
};

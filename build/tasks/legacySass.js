'use strict';

const paths = require('../paths');
const patterns = require('../patterns');

module.exports = function (gulp, $) {
  return function () {
    return gulp.src(patterns.src.app.legacySass)
      .pipe($.sourcemaps.init())
      .pipe($
        .sass(require('../configs/sass'))
        .on('error', $.sass.logError))
      .pipe($.autoprefixer(require('../configs/autoprefixer')))
      .pipe($.cssnano(require('../configs/cssnano')))
      .pipe($.sourcemaps.write())
      .pipe($.rename({
        extname: '.min.css',
      }))
      .pipe(gulp.dest(paths.dest.css));
  };
};

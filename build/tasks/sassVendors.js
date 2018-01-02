'use strict';

const paths = require('../paths');
const patterns = require('../patterns');
const concat = require('gulp-concat');

module.exports = function (gulp, $) {
  return function () {
    return gulp.src(patterns.src.app.sassVendors, {base: '.'})
      .pipe(concat('vendors.scss'))
      .pipe($
        .sass(require('../configs/sass'))
        .on('error', $.sass.logError))
      .pipe($.autoprefixer(require('../configs/autoprefixer')))
      .pipe($.cssnano(require('../configs/cssnano')))
      .pipe($.rename({
        extname: '.min.css',
      }))
      .pipe(gulp.dest(paths.dest.css));
  };
};

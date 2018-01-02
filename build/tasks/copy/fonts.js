'use strict';

const paths = require('../../paths');
const patterns = require('../../patterns');

module.exports = function (gulp) {
  return function () {
    return gulp.src(patterns.src.app.fonts)
      .pipe(gulp.dest(paths.dest.fonts));
  };
};

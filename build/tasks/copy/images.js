'use strict';

const paths = require('../../paths');
const patterns = require('../../patterns');

module.exports = function (gulp) {
  return function () {
    return gulp.src(patterns.src.app.images)
      .pipe(gulp.dest(paths.dest.images));
  };
};

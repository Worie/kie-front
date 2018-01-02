'use strict';

const patterns = require('../patterns');
const runSequence = require('run-sequence');

module.exports = function (gulp) {
  gulp.task('_watchSrcAppJsSequence', function () {
    runSequence(
//      'lint:js',
      'build:javascripts'
    );
  });

  gulp.task('_watchSrcAppSassSequence', function () {
    runSequence(
      'lint:sass',
      'sass'
    );
  });

  return function () {
    gulp.watch(patterns.src.app.css, ['_watchSrcAppSassSequence']);
    gulp.watch(patterns.src.app.sass, ['_watchSrcAppSassSequence']);
    gulp.watch(patterns.src.app.js, ['_watchSrcAppJsSequence']);
    gulp.watch(patterns.src.app.images, ['copy:images']);
    gulp.watch(patterns.src.app.fonts, ['copy:fonts']);
    gulp.watch(patterns.demos, ['copy:demos']);
    gulp.watch(patterns.src.app.legacySassWatch, ['legacy-sass']);
  };
};

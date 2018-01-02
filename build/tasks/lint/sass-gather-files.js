'use strict';

const patterns = require('../../patterns');
const lintedSourcesCacheIdentifier = require('./linted-sources-cache-identifier').sass;

module.exports = function (gulp, $) {
  return function () {
    return gulp.src(patterns.src.app.sass)
      .pipe($.modified(lintedSourcesCacheIdentifier));
  };
};

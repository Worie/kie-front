'use strict';

const lintedSources = require('./linted-sources');
const lintedSourcesCacheIdentifier = require('./linted-sources-cache-identifier').js;

module.exports = function (gulp, $) {
  return function () {
    return gulp
      .src(lintedSources)
      .pipe($.modified(lintedSourcesCacheIdentifier));
  };
};

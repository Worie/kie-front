'use strict';

const runSequence = require('run-sequence');

module.exports = function () {
  return function (done) {
    return runSequence(
      [
        'clean',
        'lint:sass-gather-files',
      ],
      [
        'legacy-sass',
        'sass-vendors',
        'sass',
        'copy:fonts',
        'copy:images',
        'build:javascripts',
      ],
      done
    );
  };
};

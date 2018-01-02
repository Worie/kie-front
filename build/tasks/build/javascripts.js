'use strict';

const runSequence = require('run-sequence');

module.exports = function () {
  return function (done) {
    return runSequence(
      'compile:javascripts',
      'compile:iframe',
      done
    );
  };
};

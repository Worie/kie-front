'use strict';

const patterns = require('../../patterns');
const del = require('del');

module.exports = function () {
  return function () {
    return del(patterns.generated.app.js);
  };
};

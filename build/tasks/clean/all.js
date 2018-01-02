'use strict';

const patterns = require('../../patterns');
const del = require('del');

module.exports = function () {
  return function () {
    return del([]
      .concat(patterns.generated.app.js)
      .concat(patterns.generated.app.css)
      .concat(patterns.generated.app.fonts)
      .concat(patterns.generated.app.images)
    );
  };
};

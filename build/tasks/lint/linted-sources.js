'use strict';

const patterns = require('../../patterns');

module.exports = [
  './gulpfile.js',
]
  .concat(patterns.src.app.js)
  .concat(patterns.build);

'use strict';

module.exports = {
  sourceMap: 'inline',
  retainLines: true,
  loose: [
    // Speed up for-of on arrays by not using the iterator directly.
    'es6.forOf',
  ],
};

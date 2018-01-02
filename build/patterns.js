'use strict';

module.exports = {
  src: {
    app: {
      js: [
        './src/js/*.js',
        './src/js/**/*.js',
        '!./src/js/**/iframe/*.js',
      ],
      bundle: './src/js/main.js',
      iframe: './src/js/exercise/lib/iframe/iframe.js',
      sassEntryPoint: [
        './src/scss/main.scss',
        '!./src/scss/_*.scss',
      ],
      sass: [
        './src/scss/*.scss',
        './src/scss/**/*.scss',
      ],
      legacySass: [
        './src/_legacy-scss/legacy.scss',
        '!./src/_legacy-scss/_*.scss',
      ],
      legacySassWatch: [
        './src/_legacy-scss/*.scss',
        './src/_legacy-scss/**/*.scss',
      ],
      sassVendors: [
        './src/scss/_vendors-config.scss',
        './node_modules/material-design-iconic-font/scss/_path.scss',
        './node_modules/material-design-iconic-font/scss/_core.scss',
        './node_modules/material-design-iconic-font/scss/_sizes.scss',
        './node_modules/material-design-iconic-font/scss/_border.scss',
        './node_modules/material-design-iconic-font/scss/_icons.scss',
        './node_modules/material-design-iconic-font/scss/_aliases.scss',
        './node_modules/normalize.css/normalize.css',
      ],
      fonts: './src/fonts/**/*',
      images: [
        './src/images/*',
        './src/images/**/*',
      ],
    },
  },
  build: [
    './build/*.js',
    './build/**/*.js',
  ],
  generated: {
    app: {
      js: [
        './dist/js/*.js',
        './dist/js/**/*.js',
      ],
      bundle: 'main.js',
      css: [
        './dist/css/*.css',
        './dist/css/**/*.css',
      ],
      fonts: [
        './dist/fonts/*',
        './dist/fonts/**/*',
      ],
      images: [
        './dist/images/*',
        './dist/images/**/*',
      ],
    },
  },
};

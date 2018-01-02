'use strict';

const paths = require('../../paths');
const patterns = require('../../patterns');
const pug = require('gulp-pug');
require('dotenv').config();

const stylesheetURL = `http://${process.env.NODE_SERVER_HOST}:${process.env.NODE_SERVER_PORT}/assets/css/main.min.css`;


module.exports = function (gulp) {
  return function () {
    return gulp.src(patterns.demos)
      .pipe(pug({
        pretty: true,
        locals: {
          server: stylesheetURL
        }
      }))
      .pipe(gulp.dest(paths.dest.demos));
  };
};

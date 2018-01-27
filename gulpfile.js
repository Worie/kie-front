'use strict';

const gulp = require('gulp');
const taskListing = require('gulp-task-listing');
const { argv } = require('yargs');

const $ = require('gulp-load-plugins')({
  lazy: false,
});

const path = require('path');

const taskDirectory = "build/tasks/";

const rootDirectory = argv.buildDir || '.';

const task = function (pathRelativeToBuild) {
  return require(
    path.resolve(
      rootDirectory,
      taskDirectory,
      pathRelativeToBuild
    )
  )(gulp, $);
};

gulp.task('help', taskListing);

// Linters
gulp.task('lint', ['lint:js', 'lint:sass']);
gulp.task('lint:js', task('lint/js'));
gulp.task('lint:sass', task('lint/sass'));

gulp.task('lint:gather-files', ['lint:js-gather-files', 'lint:sass-gather-files']);
gulp.task('lint:js-gather-files', task('lint/js-gather-files'));
gulp.task('lint:sass-gather-files', task('lint/sass-gather-files'));

// Janitors
gulp.task('clean', ['clean:all']);
gulp.task('clean:all', task('clean/all'));
gulp.task('clean:javascripts', task('clean/javascripts'));

// Builds
gulp.task('build', ['build:all']);
gulp.task('build:all', task('build/all'));
gulp.task('build:javascripts', task('build/javascripts'));

// Compilers
gulp.task('sass', task('sass'));
gulp.task('legacy-sass', task('legacySass'));
gulp.task('sass-vendors', task('sassVendors'));
gulp.task('compile:javascripts', task('compile/javascripts'));
gulp.task('compile:iframe', task('compile/iframe'));

// Copiers
gulp.task('copy:fonts', task('copy/fonts'));
gulp.task('copy:images', task('copy/images'));

gulp.task('default', task('default'));
gulp.task('watch', ['lint:gather-files'], task('watch'));

// runs a task if this file has been executed by running gulpfile.js
if (argv.run) {
  // gets an array of comma separated tasks to run, and runs them
  argv.run.split(',').forEach(task => {
    gulp.start(task);
  });
}

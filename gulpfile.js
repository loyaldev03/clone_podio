'use strict';

// sass compile
var gulp = require('gulp');
var sass = require('gulp-sass');

//*** SASS compiler task
gulp.task('sass', function () {
  // bootstrap compilation
    gulp.src('./public/stylesheets/sass/**/*.scss').pipe(sass()).pipe(gulp.dest('./public/stylesheets/css'));
});

//*** SASS watch(realtime) compiler task
gulp.task('sass:watch', function () {
    gulp.watch('./public/stylesheets/sass/**/*.scss', ['sass']);
});

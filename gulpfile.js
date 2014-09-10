'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var bourbon = require('node-bourbon').includePaths;

var css = [
  './src/scss/main.scss'
]

gulp.task('scripts', function () {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    b.transform('reactify');
    return b.bundle();
  });

  return gulp.src('./src/js/main.js')
    .pipe(browserified)
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('styles', function () {
  return gulp.src(css)
    .pipe(sass({
      includePaths: ['./src/scss'].concat(bourbon)
    }))
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.*', ['default']);
});

gulp.task('default', ['styles', 'scripts']);

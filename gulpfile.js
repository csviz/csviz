'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var bourbon = require('node-bourbon').includePaths;

var css = [
  './src/scss/main.scss',
  './node_modules/mapbox.js/theme/style.css',
  './src/libs/jquery.handsontable.css'
]

var libs = [
  './src/libs/jquery.js',
  './src/libs/jquery.handsontable.js',
  './node_modules/hellojs/src/hello.js',
  './node_modules/hellojs/src/modules/github.js'
]

var images = [
  './node_modules/mapbox.js/theme/images/*'
]

var assets = [
  './src/assets/**/*'
]

gulp.task('scripts', function () {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    b.transform('reactify');
    return b.bundle();
  });

  return gulp.src('./src/js/main.js')
    .pipe(browserified)
    // .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

// jquery sucks here
gulp.task('lib', function () {
  return gulp.src(libs)
    .pipe(uglify())
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('assets', function() {
  return gulp.src(assets)
    .pipe(gulp.dest('./dist/assets'));
})

gulp.task('styles', function () {
  return gulp.src(css)
    .pipe(sass({
      includePaths: ['./src/scss'].concat(bourbon)
    }))
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('images', function () {
  return gulp.src(images)
    .pipe(gulp.dest('./dist/css/images'));
});

gulp.task('watch', function() {
  gulp.watch(css, ['styles']);
  gulp.watch(assets, ['assets']);
  gulp.watch('./src/js/**/*', ['scripts']);
});

gulp.task('default', ['styles', 'images', 'lib', 'assets', 'scripts']);

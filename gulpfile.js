'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var bourbon = require('node-bourbon').includePaths;

var css = [
  './src/scss/main.scss',
  './node_modules/mapbox.js/theme/style.css',
  './src/libs/jquery.handsontable.css'
]

var libs = [
  './src/libs/jquery.js',
  './src/libs/jquery.handsontable.js'
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
    .pipe(plumber())
    .pipe(browserified)
    // .pipe(uglify())
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist/js'));
});

// jquery sucks here
gulp.task('lib', function () {
  return gulp.src(libs)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat('lib.js'))
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('assets', function() {
  return gulp.src(assets)
    .pipe(plumber())
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist/assets'));
})

gulp.task('styles', function () {
  return gulp.src(css)
    .pipe(plumber())
    .pipe(sass({
      includePaths: ['./src/scss'].concat(bourbon)
    }))
    .pipe(concat('all.css'))
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('images', function () {
  return gulp.src(images)
    .pipe(plumber())
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist/css/images'));
});

gulp.task('watch', function() {
  gulp.watch(css, ['styles']);
  gulp.watch(assets, ['assets']);
  gulp.watch('./src/js/**/*', ['scripts']);
});

gulp.task('default', ['styles', 'images', 'lib', 'assets', 'scripts']);

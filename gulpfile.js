  'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    browserSync = require('browser-sync'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    minimist = require('minimist'),
    autoprefixer = require('gulp-autoprefixer'),
    mochaPhantomjs = require('gulp-mocha-phantomjs'),
    runSequence = require('run-sequence'),
    minifyCss = require('gulp-minify-css'),
    glob = require('glob'),
    gutil = require('gulp-util'),
    s3 = require('gulp-s3'),
    aws = JSON.parse(fs.readFileSync('aws.json'));


//====COMPILING====//

//Compile html
gulp.task('compile-html', function(){
  console.log('...getting you that sweet sweet HTML');
    return gulp.src('dev/*.jade')
   .pipe(jade({}))
   .pipe(gulp.dest('staging/'));
});

gulp.task('copy-html', function(){
  console.log('...copying over html');
  return gulp.src('staging/*.html')
  .pipe(gulp.dest('dist/'));
});

//Compile sass
gulp.task('compile-sass', function(){
  console.log('...compiling sass');
  gulp.src('dev/stylesheets/**')
  .pipe(sass())
  .pipe(gulp.dest('staging/stylesheets/'));
});

//Add vendor prefixes
gulp.task('prefix-styles', function(){
  console.log('...adding vendor prefixes');
  gulp.src('staging/stylesheets/*.css')
  .pipe(autoprefixer({
    browsers: 'last 2 versions'
  }))
  .pipe(gulp.dest('staging/stylesheets/'));
});

//Minify CSS
gulp.task('minify-css', function() {
  console.log('...minifying css');
  gulp.src('staging/stylesheets/*.css')
  .pipe(minifyCss())
  .pipe(gulp.dest('dist/stylesheets/'));
});

//JS hinting
gulp.task('jshint', function(){
  gulp.src('dev/javascripts/**')
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(gulp.dest('./staging/js/'));
});

//Copying JS
gulp.task('copy-js', function(){
  gulp.src('dev/javascripts/**')
  .pipe(gulp.dest('staging/js/'));
});

//js minification
gulp.task('uglify', function() {
  console.log('..minifying that js');
  gulp.src('./staging/js/**')
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'))
})

//Copy Images
gulp.task('copy-imgs', function(){
  gulp.src('dev/imgs/**')
  .pipe(gulp.dest('staging/imgs/'));
});

gulp.task('imgs-to-dist', function(){
  console.log('...moving imgs to dist');
  return gulp.src('staging/imgs/**')
  .pipe(gulp.dest('dist/imgs/'));
});

//----BUILD----//

gulp.task('clean-staging', function() {
  del([
    'staging/**'
    ]);
  console.log('..cleaning staging folder')
});

//clean distribution file
gulp.task('clean-dist', function() {
  del([
    'dist/**'
    ]);
  console.log('..cleaning dist folder')
});

//render styles
gulp.task('render-styles', function(callback) {
  runSequence(
    'compile-html',
    'compile-sass',
    'prefix-styles',
    'copy-imgs',
    callback
   );
});

//render scripts
gulp.task('render-scripts', function(callback) {
  runSequence(
    'jshint',
    'copy-js',
    callback
  );
});

//start server
gulp.task('browser-sync', function(){
  browserSync.init({
    server: {
      baseDir: './staging/'
    }
  })
});

//build staging
gulp.task('build-staging', ['clean-staging'], function(cb) {
  runSequence(
    'render-styles',
    'render-scripts',
    cb
  );
});

//build dist
gulp.task('build-dist', ['clean-dist'], function(cb) {
  runSequence(
    'copy-html',
    'uglify',
    'minify-css',
    'imgs-to-dist',
     cb
  );
});

// ---- INITIALIZATION ---- //
gulp.task('init', function(cb) {
  runSequence(
    'build-staging',
    'browser-sync',
    'watch',
    cb
  );
});

// ---- WATCHING ---- //
gulp.task('watch', function() {
  gulp.watch('dev/stylesheets/**/*.scss', ['render-styles',browserSync.reload]);
  gulp.watch('dev/javascripts/*.js', ['render-scripts',browserSync.reload]);
  gulp.watch('dev/**/*.jade', ['compile-html',browserSync.reload]);
});

// ---- DEPLOYMENT ---- //


gulp.task('deploy', ['build-dist'], function() {
  var options = { headers: {'Cache-Control': 'max-age=315360000, no-transform, public'} };
  console.log(aws);
  gulp.src('./dist/**', {read: false})
      .pipe(s3(aws, options))
});

// ---- SET DEFAULT ---- //
gulp.task('default', function(cb) {
  runSequence(
    'init',
    cb
    )
});






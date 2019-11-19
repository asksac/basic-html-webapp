"use strict";

// Load plugins
const browsersync = require('browser-sync').create();
const del = require('del');
const gulp = require('gulp');
const merge = require('merge-stream');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './src'
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean lib
function clean() {
  return del(['./src/lib/', './dist']);
}

// Create a dist package
function dist() {
  return gulp.src(['src/lib/**/*', 'src/css/**/*', 'src/js/**.*', 'src/index.html'], {base: './src'}).pipe(gulp.dest('./dist')); 
}

// Bring third party dependencies from node_modules into lib directory
function modules() {
  // Bootstrap
  var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('./src/lib/bootstrap'));
  // jQuery
  var jquery = gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./src/lib/jquery'));
  // jQuery Easing
  var jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
    .pipe(gulp.dest('./src/lib/jquery-easing'));
  return merge(bootstrap, jquery, jqueryEasing);
}

// Watch files
function watchFiles() {
  gulp.watch('./src/**/*.css', browserSyncReload);
  gulp.watch('./src/**/*.html', browserSyncReload);
}

// Define complex tasks
const lib = gulp.series(clean, modules);
const build = gulp.series(lib, dist);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.clean = clean;
exports.lib = lib;
exports.build = build;
exports.watch = watch;
exports.default = build;

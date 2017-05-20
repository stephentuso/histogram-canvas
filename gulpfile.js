const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const source = require('vinyl-source-stream')
const browserify = require('browserify')
const runSequence = require('run-sequence')
const del = require('del')
const pump = require('pump')

const MODULE_NAME = 'histogram-canvas'
const STANDALONE_NAME = 'HistogramCanvas'

gulp.task('default', function (cb) {
  runSequence('clean', 'compile', 'browserify', 'minify', cb)
})

gulp.task('clean', function () {
  return del(['lib', 'dist'])
})

gulp.task('compile', function () {
  return gulp.src('./src/*.js')
    .pipe($.babel({
      plugins: [
        'transform-es2015-arrow-functions',
        'transform-es2015-block-scoping',
        'transform-es2015-classes',
        'transform-es2015-parameters'
      ]
    }))
    .pipe(gulp.dest('lib'))
})

gulp.task('browserify', function () {
  let stream = browserify({
    builtins: ['url', 'path'],
    entries: 'lib/main.js',
    standalone: STANDALONE_NAME
  })
    .ignore('_process')
    .bundle()

  return stream.pipe(source(MODULE_NAME + '.js'))
    .pipe($.derequire())
    .pipe(gulp.dest('./dist'))
})

gulp.task('minify', function (cb) {
  pump([
    gulp.src(`./dist/${MODULE_NAME}.js`),
    $.uglify(),
    $.rename({extname: '.min.js'}),
    gulp.dest('./dist')
  ], cb)
})

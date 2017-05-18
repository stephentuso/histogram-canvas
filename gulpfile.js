const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const source = require('vinyl-source-stream')
const browserify = require('browserify')
const runSequence = require('run-sequence')
const del = require('del')

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
      presets: ['es2015'],
      plugins: ['transform-runtime']
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

gulp.task('minify', function () {
  return gulp.src(`./dist/${MODULE_NAME}.js`)
    .pipe($.uglify())
    .pipe($.rename({extname: '.min.js'}))
    .pipe(gulp.dest('./dist'))
})

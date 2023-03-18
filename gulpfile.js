const {series, src, dest, watch} = require('gulp');
const babel = require('gulp-babel');
const jade = require('gulp-jade');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync');



const babelTask = () => {
  return src("dev/js/client.js")
         .pipe( babel() )
         .pipe( dest('dist/js/'))
         .pipe( browserSync.stream() );
};

const jadeTask = () => {
  return src('./dev/*.jade')
          .pipe(jade({
            pretty: true
          }))
          .pipe(dest('./dist/'))
          .pipe(browserSync.stream());
}

const sassTask =  () => {
  return src('./dev/sass/main.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe( dest('./dist/css/') )
      .pipe( browserSync.stream() );
}

/*
  Initialize browser-sync
*/

const syncInit = () => {
  browserSync.init({
    server: './dist',
    logFileChanges: false
  });
};

const watchTask = () => {
  watch('./dev/sass/main.scss', ['sass']);
  watch('./dev/*.jade', ['jade']);
  watch('./dev/js/client.js', ['babel']);
}

const syncTask = series(syncInit, watchTask)


// gulp.task('default', ['babel', 'jade', 'sass']);
exports.sync = syncTask
exports.default = series(babelTask, jadeTask, sassTask)
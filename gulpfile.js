const gulp = require('gulp');
const babel = require('gulp-babel');
const jade = require('gulp-jade');
const sass = require('gulp-sass')

gulp.task('default', ['babel', 'jade', 'sass']);

gulp.task('babel', () => {
  return gulp.src("dev/js/client.js")
         .pipe( babel() )
         .pipe(gulp.dest('dist/js/'));
});

gulp.task('jade', function() {

  var YOUR_LOCALS = {

  };

  gulp.src('./dev/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('sass', () => {
  gulp.src('./dev/sass/main.scss')
      .pipe( sass() )
      .pipe( gulp.dest('./dist/css/') );
});

gulp.task('watch', function(){
  gulp.watch('./dev/sass/main.scss', ['sass']);
  gulp.watch('./dev/*.jade', ['jade']);
  gulp.watch('./dev/js/client.js', ['babel']);
});

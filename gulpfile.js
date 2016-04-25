var gulp = require('gulp')
var docs = require('./index')

gulp.task('default', function() {
  return gulp.src('/home/fireneslo/globalit/FaMoUs-Widgets/components/**/*.js')
    .pipe(docs())
    .pipe(gulp.dest('docs'))
})
gulp.task('demo', function() {
  return gulp.src('demo/**/*.js')
    .pipe(docs())
    .pipe(gulp.dest('docs'))
})


const gulp = require('gulp')
const babel = require('gulp-babel')
const del = require('del')

gulp.task('default', function () {
  del.sync('lib')

  gulp.src([
    'src/**/*.js'
  ]).pipe(babel())
    .pipe(gulp.dest('lib/'))

  gulp.src([
    'src/**/*.json',
    'src/**/*.md',
    'src/**/*.less',
    'src/**/*.ejs',
    'src/**/*.scss',
    'src/**/gitignore',
    'src/**/npmignore',
  ]).pipe(gulp.dest('lib/'))

})

gulp.task('watch', function () {
  gulp.watch([
    'src/**/*.js',
    'src/**/*.json',
    'src/**/*.md',
    'src/**/*.less',
    'src/**/*.ejs',
    'src/**/*.scss',
    'src/**/gitignore',
    'src/**/npmignore'
  ],
  [ 'default' ])
})

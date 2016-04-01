var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();


gulp.task('jshint', function() {
    
    return gulp.src('./client/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('css-autoprefixer', function() {
    
    return gulp.src('./client/css/**/*.css', { base: './'})
    .pipe(autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./'));
});


gulp.task('watch', function() {
    gulp.watch('./client/js/**/*.js', ['jshint']);
    gulp.watch(['./client/**/*.html', './client/js/**/*.js', './client/css/**/*.css'], browserSync.reload);
});

gulp.task('browserSync', function() {
    browserSync.init({
        proxy: "localhost:8080"
    });
});

gulp.task('default', ['watch']);
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    autoprefixer = require('gulp-autoprefixer'),
    mocha = require('gulp-mocha'),
    browserSync = require('browser-sync').create();


gulp.task('jshint', function () {

    return gulp.src(['./client/js/**/*.js', './server/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('css-autoprefixer', function () {

    return gulp.src('./client/css/**/*.css', {
            base: './'
        })
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./'));
});


gulp.task('watch', ['browserSync', 'jshint', 'mocha'], function () {
    gulp.watch(['./client/js/**/*.js', './server/js/**/*.js'], ['jshint']);
    gulp.watch(['./client/**/*.html', './client/js/**/*.js', './client/css/**/*.css'], browserSync.reload);
    gulp.watch('./server/**/*.js', ['mocha']);
});

gulp.task('browserSync', function () {
    browserSync.init({
        proxy: "localhost:8081"
    });
});


gulp.task('mocha', function () {
	gulp.watch('./server/**/*.js', ['mocha']);
    return gulp.src('./server/test/**/*.test.js')
        .pipe(mocha());
});

gulp.task('default', ['watch']);

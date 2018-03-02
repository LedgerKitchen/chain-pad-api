'use strict';

let gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');

let dir = {
    build: {
        js: './public/build/js/',
        css: './public/build/css/',
        fonts: './public/build/fonts/'
    },
    src: {
        root: './public/',
        js: './public/js/',
        css: './public/css/',
        fonts: './public/fonts/'
    }
};

// CSS
gulp.task('css', function () {
    gulp.run('css-images');
    return gulp.src([
        dir.src.css + 'bootstrap.css',
        dir.src.css + 'font-awesome.css',
        dir.src.css + 'fonts-google.css',
        dir.src.css + 'sweet-alert.css',
        dir.src.css + 'custom.css'
    ])
        .pipe(concatCss('app.css'))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(dir.build.css));
});

gulp.task('css-images', function () {
    return gulp.src([
        dir.src.css + '**/*{png,jpeg,gif,svg,jpg}',
        dir.src.css + '**/*{png,jpeg,gif,svg,jpg}'
    ])
        .pipe(gulp.dest(dir.build.css))
});

//JS
gulp.task('js', function () {
    return gulp.src([
        dir.src.js + 'jquery.js',
        dir.src.js + 'tether.min.js',
        dir.src.js + 'waterbubble.min.js',
        dir.src.js + 'bootstrap.min.js',
        dir.src.js + 'sweetalert.js',
        //dir.src.js + 'font-awesome.js',
        dir.src.js + 'global.js',
        dir.src.js + 'actions.js'

    ])
        .pipe(sourcemaps.init())
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dir.build.js));

});

gulp.task('build', function () {
    gulp.run('css', 'js');
});

// Watch
gulp.task('watch', function () {
    gulp.watch(dir.src.css + '**/*.css', ['css']);
    gulp.watch(dir.src.js + '**/*.js', ['js']);
});

// Default
gulp.task('default', ['css', 'js']);
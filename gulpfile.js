/**
 * Using Gulp to Build a Front End Website.
 *
 * @author Mahmoud Eid
*/

"use strict";

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	eslint = require('gulp-eslint'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	maps = require('gulp-sourcemaps'),
	useref = require('gulp-useref'),
	imagemin = require('gulp-imagemin'),
	del = require('del'),
	browserSync = require('browser-sync').create();


var options = {
  src: 'src',
  dist: 'dist'
};


// Concat scripts to on efile
gulp.task("concatScripts", function() {
    return gulp.src([
    	options.src+'/js/query-3.1.1.js',
		options.src+'/js/circle/autogrow.js',
		options.src+'/js/circle/circle.js'
        ])
    .pipe(maps.init())
    .pipe(concat('global.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(options.src+'/js'));
});

// Run concatScripts then run test eslint then minfy js files and save it at dist/scripts
gulp.task('scripts', ['concatScripts'], function() {
	return gulp.src([options.src+'/js/global.js'])
	.pipe(eslint())
	.pipe(eslint.format())
	.pipe(eslint.failAfterError())
	.pipe(uglify())
	.pipe(rename('all.min.js'))
	.pipe(gulp.dest(options.dist+'/scripts'));
});

// Compile sass files to css
gulp.task('compileSass', function() {
	return gulp.src([options.src+'/sass/global.scss'])
	.pipe(maps.init())
	.pipe(sass())
	.pipe(maps.write('./'))
	.pipe(gulp.dest(options.src+'/css'));
});

// Run compile sass then minfy css file and save it at dist/styles
gulp.task('styles', ['compileSass'], function() {
	return gulp.src([options.src+'/css/global.css'])
	.pipe(cssnano())
	.pipe(rename('all.min.css'))
	.pipe(gulp.dest(options.dist+'/styles'));
});

// Compress images
gulp.task('images', function() {
  gulp.src(options.src+'/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(options.dist+'/content'));
});

// Copy html to dist
gulp.task('html', ['scripts', 'styles'],function () {
    return gulp.src(options.src+'/index.html')
	.pipe(useref())
	.pipe(gulp.dest(options.dist));
});

// Copy icons to dist
gulp.task('icons',function () {
    return gulp.src(options.src+'/icons/*')
	.pipe(gulp.dest(options.dist+'/icons/'));
});

// Clean old generated files
gulp.task('clean', function() {
  	del([
  		options.dist,
  		options.src+'/css',
  		options.src+'/js/global.js',
		options.src+'/js/global.js*'
	]);
});

// Build
gulp.task('build', ['clean'], function() {
	return gulp.start(['html', 'images', 'icons']);
});

// Watch all sass and js files changes
gulp.task('watch', function() {
  gulp.watch([options.src + '/sass/*.scss',
    options.src + '/sass/**/*.scss'
  ], ['styles']);
  gulp.watch([options.src + '/js/circle/*.js'], ['scripts']);
});

// Serve production project also run watch.
gulp.task('serve', ['watch'], function() {
  browserSync.init(options.dist, {
    server: {
      baseDir: options.dist
    }
  });
});

// Default
gulp.task("default", ["build"]);
var gulp = require('gulp');
var path = require('path');
var files = require('./files');

// release
gulp.task('default', ['release']);
gulp.task('release', ['assets']); // add jslint and uTest later maybe
gulp.task('assets', ['copyTemplate', 'assets:css', 'assets:js', 'copy:lib']);

gulp.task('dev', ['concat', 'watch', 'server']);
gulp.task('concat', ['concat:css', 'concat:js']);

var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minify = require('gulp-minify-css'); //css
var uglify = require('gulp-uglify'); //js
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');

gulp.task('server', function() {

	return nodemon({
			ignore: files.monignore,
			ext: "js"
		});
});

gulp.task('copy:lib', function() {

	return gulp.src(files.lib)
			.pipe(gulp.dest(files.librealse || files.release));
});

// concat css
gulp.task('concat:css', function() {

	return gulp.src(files.css)
			.pipe(concat(files.destCss))
			.pipe(gulp.dest(files.destLib))
			.pipe(livereload());
});

// concat js
gulp.task('concat:js', function() {

	return gulp.src(files.js)
			.pipe(concat(files.destJs))
			.pipe(gulp.dest(files.destLib))
			.pipe(livereload());
});

gulp.task('assets:css', ['concat:css'], function() {

	//css
	return gulp.src(path.resolve(files.destLib, files.destCss))
			.pipe(rename({suffix:'.min'}))
			.pipe(minify())
			.pipe(gulp.dest(files.release));
});

gulp.task('assets:js', ['concat:js'], function() {

	//js
	return gulp.src(path.resolve(files.destLib, files.destJs))
			.pipe(rename({suffix:'.min'}))
			.pipe(uglify())
			.pipe(gulp.dest(files.release));
});

gulp.task('copyTemplate', function() {

	return gulp.src(files.templatesrc)
			.pipe(gulp.dest(files.templatedest));
})

gulp.task('reloadView', ['copyTemplate'], function() {

	//views
	return gulp.src(files.templatedest)
			.pipe(livereload());
});

gulp.task('watch', function() {

	livereload.listen();

	gulp.watch(files.js, ['concat:js']);
	gulp.watch(files.css, ['concat:css']);
	gulp.watch(files.templatesrc, ['reloadView']);
});

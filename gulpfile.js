var gulp = require('gulp');
var files = require('./files');

gulp.task('default', ['assets', 'watch']);
gulp.task('dev', ['monitor', 'watch']);

var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minify = require('gulp-minify-css'); //css
var uglify = require('gulp-uglify'); //js
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');

gulp.task('assets', function() {

	//css
	gulp.src(files.css)
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./assets/lib'))
		.pipe(rename({suffix:'.min'}))
		.pipe(minify())
		.pipe(gulp.dest('./assets/'))
		.pipe(livereload());

	//js
	gulp.src(files.js)
		.pipe(concat('script.js'))
		.pipe(gulp.dest('./assets/lib'))
		.pipe(rename({suffix:'.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('./assets/'))
		.pipe(livereload());
});

gulp.task('watch', function() {

	// refresh if file cahnges
	gulp.src(files.watch)
		.pipe(livereload());

	livereload.listen();
	// watch assets
	var watcher = gulp.watch(Array.prototype.concat.call(files.js, files.css), ['assets']);
	watcher.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

gulp.task('monitor', function() {
	nodemon({ script: 'app.js', ext: 'js', ignore: files.monignore })
		.on('restart', function() {
			console.log('restarted!');
		});
});

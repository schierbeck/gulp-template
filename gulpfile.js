var p = require('./package.json'),
	gulp = require('gulp'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),
	stylish = require('jshint-stylish'),
	minifycss = require('gulp-minify-css'),
	browserSync = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer'),
	gutil = require('gulp-util');

// Pretty sass errors
var sassError = function (err) {  
  gutil.beep();
  gutil.log('\n' + gutil.colors.bgRed.bold.white('\n\n (╯°□°)╯ SASS ERROR! \n') + gutil.colors.red.bgWhite('\n\n'+err) + gutil.colors.bgRed.bold.white('\n'));
};
gutil.log('\n' + gutil.colors.bgBlue.bold('\n\n ♪ ' + p.name + '\n > ' + p.version +'\n') + '\n');


var target = {
	sass_src : 'docroot/assets/stylesheets/style.scss',
	css_dest : 'docroot/assets/css/',
	js_lint_src : [
		'docroot/assets/javascripts/script.js'
	],
	js_concat_src : [
		'docroot/assets/javascripts/jquery.js',
		'docroot/assets/javascripts/script.js'
	],
	js_dest : 'docroot/assets/javascripts'
};

/**
 * SASS
 */
gulp.task('sass', function() {
	gulp.src(target.sass_src)
		
		.pipe(plumber({
      errorHandler: sassError
    }))											// Keeps gulp running on errors
		.pipe(sass({
			sourceComments : 'normal' // Bättre felmeddelanden
		}))
		.pipe(autoprefixer( // Definiera vilka browsers som bör prefixas för
			'last 2 version',
			'> 1%',
			'ie 8',
			'ie 9',
			'Opera',
			'ios 6',
			'android 4'
		))
		.pipe(minifycss())
		.pipe(gulp.dest(target.css_dest))
		.pipe(notify({title: 'SUCESS!', message : 'Sass was compiled.'}));
});

/**
 * JS LINT
 */
gulp.task('js-lint', function() {
	gulp.src(target.js_lint_src)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

/**
 * BROWSER SYNC
 */
gulp.task('browser-sync', function() {
	browserSync.init(['docroot/assets/css/*.css', 'docroot/assets/javascripts/*.js'], {
		// proxy: "local.reportage.se"
		server: {
			baseDir: "docroot"
		}
	})
});

/**
 * DEFAULT TASK
 */
gulp.task('default', function() {
	gulp.run('sass', 'browser-sync', 'js-lint');
	gulp.watch('docroot/assets/stylesheets/*.scss', function() {
		gulp.run('sass');
	})
	gulp.watch('docroot/assets/javascripts/*.js', function() {
		gulp.run('js-lint');
	});
});
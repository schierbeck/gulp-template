// Sources
var root_src = 'docroot',
		assets_src = root_src + '/assets',
		sass_src = assets_src + 	'/stylesheets',
		css_src = assets_src + 	'/css',
		js_src = assets_src + '/javascripts',
		img_src = assets_src + '/images';

var p = require('./package.json'), // Our project file
		gulp = require('gulp'), // Gulp!
		sass = require('gulp-sass'), // Sass compiler
		gutil = require('gulp-util'), // Style log messages
		rename = require('gulp-rename'), // Rename files
		uglify = require('gulp-uglify'), // Make js tiny and ugly
		jshint = require('gulp-jshint'), // JavaScript validator (really nags!)
		gulp_concat = require('gulp-concat'), // Mash multiple files into one
		notify = require('gulp-notify'), // System notifications
		plumber = require('gulp-plumber'), // Keeps gulp running on errors
		stylish = require('jshint-stylish'), // Better lookin jsHint messages
		browserSync = require('browser-sync'), // No need to refresh browser for styling changes
		minifycss = require('gulp-minify-css'), // Minify CSS
		autoprefixer = require('gulp-autoprefixer'); // No more prefixes for different browsers! :-D

// Pretty sass errors
var sassError = function (err) {  
  gutil.beep();
  gutil.log('\n' + gutil.colors.bgRed.bold.white('\n\n (╯°□°)╯ SASS ERROR! \n') + gutil.colors.red.bgWhite('\n\n'+err) + gutil.colors.bgRed.bold.white('\n'));
};
gutil.log('\n' + gutil.colors.bgBlue.bold('\n\n ♪ ' + p.name + '\n > ' + p.version +'\n') + '\n');

/**
 * SASS
 */
gulp.task('sass', function() {
	gulp.src(sass_src + '/style.scss')
		.pipe(plumber({ // Keeps gulp running on errors
      errorHandler: sassError
    }))
		.pipe(sass({
			sourceComments : 'normal' // Bättre felmeddelanden
		}))
		.pipe(autoprefixer( // Definiera vilka browsers som bör prefixas för
			'last 2 version', '> 1%', 'ie 8', 'ie 9', 'Opera', 'ios 6', 'android 4'
		))
		.pipe(minifycss())
		.pipe(gulp.dest(css_src))
		.pipe(notify({title: 'SUCESS!', message : 'Sass was compiled.'}));
});

/**
 * JAVASCRIPT
 */
gulp.task('js', function() {
	gulp.src(js_src + '/script.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
  gulp.src([
  	js_src + '/jquery.js',
  	js_src + '/script.js'
  	])
  .pipe(gulp_concat('script.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(js_src));
});

/**
 * BROWSER SYNC
 */
gulp.task('browser-sync', function() {
  browserSync({
    files: root_src + "/**/*",
    server: {
      baseDir: "docroot"
    }
  });
});

/**
 * TASKS
 */
gulp.task('default', function() {
	gulp.run('sass', 'js', 'browser-sync');
	gulp.watch( sass_src + '/**/*.scss', function() {
		gulp.run('sass');
	})
	gulp.watch( js_src + '/script.js', function() {
		gulp.run('js');
	});
});
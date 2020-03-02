'use strict';
//include gulp-less
var fs = require('fs'),
	glob = require('glob'),
	path = require('path'),
	gulp = require('gulp'),
	sass = require('gulp-sass'),
	gcmq = require('gulp-group-css-media-queries'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	watch = require('gulp-watch'),
	//livereload = require('gulp-livereload'),
	Glob = glob.Glob;
	sass.compiler = require('node-sass');

	

var themeconfig = {
    area: 'frontend',
    name: 'c4u/child',
    locale: 'en_US',
}

var appcssdir = 'app/design/frontend/' + themeconfig.name + '/' + 'web/css/';
var appcssdirglob = 'app/design/frontend/' + themeconfig.name + '/' + 'web/css/**/*.scss';
var pubdir = 'pub/static/frontend/' + themeconfig.name + '/' + themeconfig.locale + '/';
var pubcssdir = 'pub/static/frontend/' + themeconfig.name + '/' + themeconfig.locale + '/' + 'css/';


var srcfiles = [
       appcssdir + 'style.scss',
];




gulp.task('sass', async function(){
	 	gulp.src(srcfiles)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({cascade: false}))
        .pipe(gcmq())
        .pipe(sourcemaps.write('./'))
       	.pipe(gulp.dest(appcssdir))
       	//.pipe(livereload());
       	return console.log("sass compiled");
});

gulp.task('watch',async function() {
	//livereload.listen();
	gulp.watch(appcssdirglob,gulp.series('sass'));
})



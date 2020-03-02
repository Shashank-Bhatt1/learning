//include gulp-less
var fs = require('fs'),
	glob = require('glob'),
	path = require('path'),
	gulp = require('gulp'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	watch = require('gulp-watch'),
	livereload = require('gulp-livereload'),
	Glob = glob.Glob;
	//browserSync = require('browser-sync').create();

	

	


var themeconfig = {
    area: 'frontend',
    name: 'Magento/futureshop',
    locale: 'en_US',
}

var applessdir = 'app/design/frontend/' + themeconfig.name + '/' + 'web/css' + '/**/*.less';
var pubdir = 'pub/static/frontend/' + themeconfig.name + '/' + themeconfig.locale + '/**/*.less';
var cssdir = 'pub/static/frontend/' + themeconfig.name + '/' + themeconfig.locale + '/' + 'css/';

var filestowatch = [
        // cssdir + 'styles-l.less',
        // cssdir + 'styles-m.less',
        cssdir + 'custom.less',
];


var files = glob.sync(pubdir,{realpath:true});
var assetstowatch = [];
files.forEach(function(file,index){
	resolve = require('path').resolve;
	var actualwinpath = path.relative(process.cwd(),resolve(file));
	assetstowatch.push(actualwinpath.replace(/\\/g,"/"));
})



gulp.task('lesscss', async function(){
	

	gulp.src(filestowatch)
        .pipe(sourcemaps.init({loadMaps: true,largeFile: true}))
        .pipe(less())
        // .pipe(autoprefixer({
        //    cascade: false
        // }))
        .pipe(sourcemaps.write('./'))
       	.pipe(gulp.dest(cssdir));
       	//.pipe(livereload());
       	
       	//.pipe(browserSync.stream());
});

gulp.task('watch',function() {
	//livereload.listen();
	gulp.watch(assetstowatch,gulp.series('lesscss'));
})



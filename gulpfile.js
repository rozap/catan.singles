var gulp = require('gulp'),
	less = require('gulp-less'),
	uglify = require('gulp-uglify'),
	spawn = require('child_process').spawn,
	minifyCSS = require('gulp-minify-css'),
	node;

var paths = {
	clientScripts: ['public/js/*'],
	serverScripts: ['./index.js', './models/*.js', './libs/**/*.js'],
	less: ['./public/less/*.less'],
	css: './public/static/css/',
};


gulp.task('server', function() {
	console.log("starting server...");
	if (node) node.kill()
	node = spawn('node', ['index.js', '-c', 'dev'], {
		stdio: 'inherit'
	})
	node.on('close', function(code) {
		if (code === 8) {
			console.log('Error detected, waiting for changes...');
		}
	});
});

process.on('exit', function() {
	if (node) node.kill()
})



gulp.task('scripts', function() {
	console.log("UGLIFYING")
	gulp.src(paths.clientScripts)
		.pipe(uglify())
		.pipe(gulp.dest('./public/js/min/'))
});

gulp.task('less', function() {
	console.log("Rebuilding less files...");
	gulp.src('./public/less/style.less')
		.pipe(less({
			paths: ['style.less']
		}))
		.pipe(minifyCSS())
		.pipe(gulp.dest(paths.css));
});


gulp.task('watch', function() {
	// gulp.watch(paths.clientScripts, ['scripts']);
	gulp.watch(paths.less, ['less']);
	gulp.watch(paths.serverScripts, ['server']);
});



gulp.task('default', ['server', 'watch', 'scripts'])
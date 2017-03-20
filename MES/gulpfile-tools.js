// Requis
var gulp = require('gulp');
var ui5preload = require('gulp-ui5-preload');
var connect = require('gulp-connect');
var runSequence = require('run-sequence');
var open = require('gulp-open');

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//															Table Translate													//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

gulp.task('connect-table-translate', function () {
	return connect.server({
		root: 'WebContent/tools/TableTranslate',
		port: 3000,
		middleware: function (connect, opt) {
			return [
				function (req, res, next) {
					// treat POST request like GET during dev
					if (req.headers.host.startsWith('localhost')) {
						req.method = 'GET';
					}

					return next();
				}
			];
		},
		livereload: true
	});
});

gulp.task('open-table-translate', function () {
	gulp.src(__filename)
		.pipe(open({ uri: 'http://localhost:3000/' }));
});

gulp.task('serve-table-translate', function (callback) {
	runSequence(
		'connect-table-translate',
		'open-table-translate',
		'watch',
		callback);

});



gulp.task('watch', false, function () {
	var livereload = require('gulp-livereload');

	livereload.listen();
	gulp.watch(
		'WebContent/Sass/**/*.scss',
		['styles']
	);
	gulp.watch('WebContent/Sass/*.css', function(file){
      livereload.changed(file)
  });
});

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//															Table Viewer													//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

gulp.task('connect-table-viewer', function () {
	return connect.server({
		root: 'WebContent/tools/TableViewer',
		port: 3001,
		middleware: function (connect, opt) {
			return [
				function (req, res, next) {
					// treat POST request like GET during dev
					if (req.headers.host.startsWith('localhost')) {
						req.method = 'GET';
					}

					return next();
				}
			];
		},
		livereload: true
	});
});

gulp.task('open-table-viewer', function () {
	gulp.src(__filename)
		.pipe(open({ uri: 'http://localhost:3001/' }));
});

gulp.task('serve-table-viewer', function (callback) {
	runSequence(
		'connect-table-viewer',
		'open-table-viewer',
		'watch',
		callback);

});



gulp.task('watch', false, function () {
	var livereload = require('gulp-livereload');

	livereload.listen();
	gulp.watch(
		'WebContent/Sass/**/*.scss',
		['styles']
	);
	gulp.watch('WebContent/Sass/*.css', function(file){
      livereload.changed(file)
  });
});
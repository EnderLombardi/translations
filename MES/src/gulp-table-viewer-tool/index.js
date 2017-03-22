'use strict'
var gulp = require('gulp');
var open = require('gulp-open');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
//var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-tableviewer-tool';
//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//															Table Viewer													//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

module.exports = function () {
	connect.server({
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
		livereload: false
	});
	gulp.src(__filename)
		.pipe(open({ uri: 'http://localhost:3001/' }));
	return;
};





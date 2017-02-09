"use strict";

var gulp = require('gulp');
var ui5preload = require('gulp-ui5-preload');
//var uglify = require('gulp-uglify');
//var prettydata = require('gulp-pretty-data');
var gulpif = require('gulp-if');
var escapeProperties = require('./src/gulp-escape-characters');
var pushMii = require('./src/gulp-push-mii');
var clean = require('gulp-clean');
var rename = require("gulp-rename");
var fs = require("fs");
var connect = require('gulp-connect');
var runSequence = require('run-sequence');
var open = require('gulp-open');

var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
var version = {};
[version.major, version.minor, version.batch] = pkg.version.split('-')[0].split('.').map(n => parseInt(n));
version.patch = parseInt(pkg.version.split('-')[1]);
version.toString = function () {
	return [version.major, version.minor, [version.batch, version.patch].map(n => "" + n).join('-')].map(n => "" + n).join('.');
}

var src = './WebContent';
var rootdest = './build';
var dest = rootdest + '/current';

// url - log - pwd
// TODO : create a table for multi push
var miiHost = ['http://swinsapdi01.ptx.fr.sopra:50000', 'https://dmiswde0.eu.airbus.corp'];
var miiUser = ['S00DB44', 'NG560DB'];
var miiPassword = ['start000', 'pierre248'];
var miiTransaction = 'XX_MOD1684_MES_Temp%2FTools%2FCreateFile';
var pushServiceUrlMDI = `${miiHost[0]}/XMII/Illuminator?QueryTemplate=${miiTransaction}&j_user=${miiUser[0]}&j_password=${miiPassword[0]}`;
var pushServiceUrlDMI = `${miiHost[1]}/XMII/Illuminator?QueryTemplate=${miiTransaction}&j_user=${miiUser[1]}&j_password=${miiPassword[1]}`;
var rootRemotePath = "WEB://XX_MOD1684_MES_Temp/ui/mes";

//table for build
var component = [];
var buildname = [];
var ui5preloadtask = '';

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//                                                         Shell 															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

gulp.task('ui5preload_shell', ['clean'], function () {
	return gulp.src([
		'./shell/**.+(js|xml|properties|css|json)',
		'./shell/*/**.+(js|xml|properties|css|json)',
		'!./shell/dist/**'
	], { cwd: src })
		.pipe(gulpif('**/i18n/*.properties', escapeProperties({ type: "properties" })))
		.pipe(ui5preload({ base: './WebContent/shell/', namespace: 'airbus.mes.shell' }))
		.pipe(gulp.dest(dest + '/shell'));
});

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//													Componennts 															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

//Asynchronous 
//fs.readdir('../MES/WebContent/components/', function(err, files){
//	for (var i=0; i<files.length; i++) {
//        component.push(files[i]);
//    }
//	console.log(component.length); 
//	console.log(component);		
//});

//Synchronous 
component = fs.readdirSync('../MES/WebContent/components/');

//Generic
for (let i = 0; i < component.length; i++) {
	if (component[i] != "shell") {

		//generate list of name ui5preload
		buildname.push('ui5preload_' + component[i]);

		gulp.task('ui5preload_' + component[i] + '', ['clean'], function () {
			return gulp.src([
				'./WebContent/components/' + component[i] + '/**.+(js|xml|properties|css|json)',
				'./WebContent/components/' + component[i] + '/*/**.+(js|xml|properties|css|json)',
				'./WebContent/components/' + component[i] + '/*/*/**.+(js|xml|properties|css|json)',
				'!./WebContent/components/' + component[i] + '/kpi/**',
			])
				//.pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
				//.pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
				.pipe(gulpif('**/i18n/*.properties', escapeProperties({ type: "properties" })))
				.pipe(ui5preload({ base: './WebContent/components/' + component[i] + '/', namespace: 'airbus.mes.' + component[i] }))
				.pipe(gulp.dest(dest + '/components/' + component[i]));
		});
	}
}

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//														copy_index 															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

gulp.task('copy_index', ['clean'], function () {
	return gulp.src('./shell/index_airbus.html', { cwd: src })
		.pipe(rename('./shell/index.html'))
		.pipe(gulp.dest(dest));
});

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//															copy 															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

gulp.task('copy', ['clean'], function () {
	return gulp.src([
		'./shell/config/res_config_prod.properties',
		'./shell/data/**',
		'./shell/model/**',
		'./components/homepage/css/margin.css',
		'./Sass/global.css',
		'./Sass/*.png',
		'./components/homepage/data/1TileLineHome.json',
		'./components/homepage/images/**',
		'./components/calendar/model/**',
		'./components/settings/model/**',
		'./components/settings/data/program.json',
		'./components/settings/icon/**',
		'./components/polypoly/model/needlevels.json',
		'./components/polypoly/images/**',
		'./components/linetracker/images/**',
		'./components/stationHandover/model/**',
		'./components/stationtracker/css/img/**',
		'./components/stationtracker/data/groupModel.json',
		'./components/stationtracker/data/KPIModel.json',
		'./components/disruptions/local/Jigtool_Server.json',
		'./components/disruptions/local/MaterialList_Server.json',

	], { cwd: src, cwdbase: true }).pipe(gulp.dest(dest));
});

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//	 													copy_res															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

gulp.task('copy_res', ['clean'], function () {
	return gulp.src([
		'./images/**',
		'./lib/**'
	], { cwd: src, cwdbase: true }).pipe(gulp.dest(rootdest));
});

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//															clean															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

gulp.task('clean', function () {
	return gulp.src(rootdest, { read: false }).pipe(clean());
});

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//															push															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

gulp.task('push', ['build'], function () {
	return gulp.src(['./**'], { cwd: dest }) // .+(json|properties|css|js)
		.pipe(pushMii({
			url: pushServiceUrl,
			root: dest,
			remotePath: rootRemotePath + '/current',
		}));
});

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//														push_res															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

gulp.task('push_res', ['build'], function () {
	return gulp.src(['./**', '!./current/**'], { cwd: rootdest }) // .+(json|properties|css|js)
		.pipe(pushMii({
			url: pushServiceUrl,
			root: rootdest,
			remotePath: rootRemotePath,
		}));
});

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//														bump_ver															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

// Bump and push to vX.Y.Z-P
gulp.task('bump_ver', function () {
	// Increase patch number
	version.patch = version.patch + 1;
	console.log("====================     Bump version     =======================")
	console.log("Bump version: " + pkg.version + " => " + version.toString());
	// Regenerate version text
	pkg.version = version.toString();
	// Regenerate package.json
	fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n')
});

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//															bump															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

gulp.task('bump', ['bump_ver', 'build'], function () {
	return gulp.src(['./**'], { cwd: dest }) // .+(json|properties|css|js)
		.pipe(pushMii({
			url: pushServiceUrlDMI,
			root: dest,
			remotePath: rootRemotePath + '/v' + version.toString(),
		})).pipe(pushMii({
			url: pushServiceUrlMDI,
			root: dest,
			remotePath: rootRemotePath + '/v' + version.toString(),
		}));;
});


//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//	 													sass     															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//


gulp.task('styles', function () {
	var sass = require('gulp-sass');

	gulp.src('WebContent/Sass/**/*.scss')
		.pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
		.pipe(gulp.dest('WebContent/Sass/'))
});

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//															connect															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

gulp.task('connect', function () {
	return connect.server({
		root: 'WebContent',
		port: 8080,
		middleware: function (connect, opt) {
			return [
				function (req, res, next) {
					// treat POST request like GET during dev
					if (req.headers.referer && req.headers.referer.endsWith('url_config=local')) {
						req.method = 'GET';
					}

					return next();
				}
			];
		},
		livereload: true
	});
});

gulp.task('open', function () {
	gulp.src(__filename)
		.pipe(open({ uri: 'http://localhost:8080/shell' }));
});

gulp.task('serve', function (callback) {
	runSequence(
		'connect',
		'open',
		'watch',
		callback);

});


gulp.task('watch', false, function () {
	gulp.watch(
		'WebContent/Sass/**/*.scss',
		['styles']
	);
});

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//															build															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

buildname.unshift('copy_index', 'copy', 'copy_res', 'ui5preload_shell')
console.log("==================== list of components for build =======================")
console.log(buildname);
gulp.task("build", buildname);

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//															default															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

gulp.task('default', ['build']);
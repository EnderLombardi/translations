"use strict";

var gulp = require('gulp');
var jQuery = require('jquery');
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
var miiHost = ['http://swinsapdi01.ptx.fr.sopra:50000', 'http://dmivie0.eu.airbus.corp:55600'];
var miiUser = ['NG560DB', 'S00DB44'];
var miiPassword = ['pierre248', 'start102'];
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
//														retrieve_translation												//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//


var json2array;
json2array = function(json) {
    var result = [];
    var keys = Object.keys(json);
    console.log("keys:" + keys)
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
};

var findFile, jsFiles, rootDir;
jsFiles = [];

// Retrieve all i18n file and repository
findFile = function(dir)
{
//	console.log('dir:' + dir);
	
    fs.readdirSync(dir).forEach(function(file) {
	    var stat;
	    stat = fs.statSync("" + dir + "/" + file);

	    if (stat.isDirectory()) {
	      return findFile("" + dir + "/" + file);
	    } else if (file.split('.')[0].substring(0, 4) === 'i18n') {
//	    	console.log('filei18n:' + file);
//	    	console.log('filei18nDirectory:' + "" + dir + "/" + file);
	    	return jsFiles.push("" + dir + "/" + file);
	    }
  });
};



gulp.task('retrieve_translation', ['clean'], function () {
	 
	//Synchronous 
	var file = [];
//	TODO : add shell on repository to investigate
	file = fs.readdirSync('../MES/WebContent/components');
	
	//
	for (let i = 0; i < file.length; i++) {
		findFile('./WebContent/components/' + file[i]);
	}
	console.log('findfile:' + jsFiles);
	
	
	for (let i = 0; i < jsFiles.length; i++) {
		console.log("file Reading:" , jsFiles[i]);
		console.log(fs.readFileSync(jsFiles[i], 'utf-8'));
	}
	
	
//	Open JSON local
//	Correspond to step launch service to MI and retrieve database on JSON model

	var string = fs.readFileSync("Translation.json", 'utf-8');
	console.log(string);
	var array = json2array(string);
//	var array = string.toArray();
	console.log(array);
	
	
	
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
		'./Sass/*.svg',
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
		'./components/components/data/selectFilterModel.json',
		'./components/trackingtemplate/styles/trackingtemplatePrint.css',
		'./components/factoryView/images/**',
		'./components/qdc/local/QDC_Data.json'
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
		.pipe(sass({ outputStyle: 'compact' }).on('error', sass.logError))
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

gulp.task('service', function (callback) {
	runSequence(
		'connect',
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
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

var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
var version = {};
[version.major, version.minor, version.batch] = pkg.version.split('-')[0].split('.').map(n => parseInt(n));
version.patch = parseInt(pkg.version.split('-')[1]);
version.toString = function () {
	return [version.major, version.minor, [version.batch, version.patch].map(n => ""+n).join('-')].map(n => ""+n).join('.');
}

var src = './WebContent';
var rootdest = './build';
var dest = rootdest + '/current';

var miiHost = 'http://swinsapdi01.ptx.fr.sopra:50000';
var miiUser = 'S00DB44';
var miiPassword = 'start000';
var miiTransaction = 'XX_MOD1684_MES_Temp%2FTools%2FCreateFile';
var pushServiceUrl = `${ miiHost }/XMII/Illuminator?QueryTemplate=${ miiTransaction }&j_user=${ miiUser }&j_password=${ miiPassword }`;
var rootRemotePath = "WEB://XX_MOD1684_MES_Temp/ui/mes";

//table for build
var component  = [];
var buildname = [];
var ui5preloadtask = '';

//--------------------------------------------------------------------------------------------------------------------------//
//																															//
//                                                         Shell 															//
//																															//
//--------------------------------------------------------------------------------------------------------------------------//

gulp.task('ui5preload_shell', ['clean'], function() {
  return gulp.src([
					'./shell/**.+(js|xml|properties|css|json)',
                    './shell/*/**.+(js|xml|properties|css|json)',
                    '!./shell/dist/**'
                  ], { cwd: src })
          .pipe(gulpif('**/i18n/*.properties', escapeProperties({ type: "properties" })))
          .pipe(ui5preload({base:'./WebContent/shell/', namespace:'airbus.mes.shell'}))
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
		//	console.log(component.length); // return 21
		//	console.log(component);		// return table of name
		//});
		//console.log(component.length); // return 0	

//Synchronous 
		component =  fs.readdirSync('../MES/WebContent/components/');

//Generic
for(let i=0; i<component.length; i++){
	if(component[i] != "shell" || component[i] != "disruptionkpi" ){
	
	//generate list of name ui5preload
	buildname.push('ui5preload_'+component[i]);

	gulp.task('ui5preload_'+component[i]+'', ['clean'], function() {
	  return gulp.src([
						'./WebContent/components/'+component[i]+'/**.+(js|xml|properties|css|json)',
		                './WebContent/components/'+component[i]+'/*/**.+(js|xml|properties|css|json)',
		                '!./WebContent/components/'+component[i]+'/kpi/**',
	                  ])
	        //.pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
		    //.pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
	          .pipe(gulpif('**/i18n/*.properties', escapeProperties({ type: "properties" })))
	          .pipe(ui5preload({base:'./WebContent/components/'+component[i]+'/', namespace:'airbus.mes.'+component[i]}))
	          .pipe(gulp.dest(dest + '/components/'+component[i]));
	     });
	}
}

//Disruption Tracker
gulp.task('ui5preload_disruptionkpi', ['clean'], function() {
		return gulp.src([
						  './WebContent/components/disruptiontracker/kpi/**.+(js|xml|properties|css|json)',
		                  './WebContent/components/disruptiontracker/kpi/*/**.+(js|xml|properties|css|json)',
						  '!./WebContent/components/disruptiontracker/kpi/dist/**'
		                ])

		        .pipe(gulpif('**/i18n/*.properties', escapeProperties({ type: "properties" })))
		        .pipe(ui5preload({base:'./WebContent/components/disruptiontracker/kpi', namespace:'airbus.mes.disruptionkpi'}))
		        .pipe(gulp.dest(dest + '/components/disruptiontracker/kpi'));
});

//--------------------------------------------------------------------------------------------------------------------------//

gulp.task('copy_index', ['clean'], function () {
		return gulp.src('./shell/index_airbus.html', { cwd: src })
			.pipe(rename('./shell/index.html'))
			.pipe(gulp.dest(dest));
});


gulp.task('copy', ['clean'], function () {
		return gulp.src([
			'./shell/config/res_config_prod.properties',
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
			'./components/stationtracker/css/img/**',
			'./components/stationtracker/data/groupModel.json',
			'./components/stationtracker/data/KPIModel.json',
			'./components/disruptions/local/Jigtool_Server.json',
			'./components/disruptions/local/MaterialList_Server.json',
			
		], { cwd: src, cwdbase: true }).pipe(gulp.dest(dest));
});


gulp.task('copy_res', ['clean'], function () {
		return gulp.src([
			'./images/**',
			'./lib/**'
		], { cwd: src, cwdbase: true }).pipe(gulp.dest(rootdest));
});
 

gulp.task('clean', function () {
		return gulp.src(rootdest, { read: false }).pipe(clean());
});


// Push (to current)
gulp.task('push', ['build'], function () {
		return gulp.src(['./**'], { cwd: dest }) // .+(json|properties|css|js)
			.pipe(pushMii({
				url: pushServiceUrl,
				root: dest,
				remotePath: rootRemotePath + '/current',
			}));
});


gulp.task('push_res', ['build'], function () {
		return gulp.src(['./**', '!./current/**'], { cwd: rootdest }) // .+(json|properties|css|js)
			.pipe(pushMii({
				url: pushServiceUrl,
				root: rootdest,
				remotePath: rootRemotePath,
			}));
});


// Bump and push to vX.Y.Z-P
gulp.task('bump_ver', function () {
		// Increase patch number
		version.patch = version.patch + 1;
		console.log("====================     Bump version     =======================")
		console.log("Bump version: " + pkg.version + " => " + version.toString());
		// Regenerate version text
		pkg.version = version.toString();
		// Regenerate package.json
		fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2)+'\n')
});


gulp.task('bump', ['bump_ver', 'build'], function () {
		return gulp.src(['./**'], { cwd: dest }) // .+(json|properties|css|js)
		.pipe(pushMii({
			url: pushServiceUrl,
			root: dest,
			remotePath: rootRemotePath + '/v' + version.toString(),
		}));
});


//table for build
buildname.push('ui5preload_disruptionkpi');
buildname.unshift('copy_index', 'copy', 'copy_res','ui5preload_shell')
console.log("==================== list of components for build =======================")
console.log(buildname);
gulp.task("build", buildname);	 


gulp.task('default', ['build']);
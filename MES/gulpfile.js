"use strict";

var gulp = require('gulp');
var ui5preload = require('gulp-ui5-preload');
//var uglify = require('gulp-uglify');
//var prettydata = require('gulp-pretty-data');
//var gulpif = require('gulp-if');
var clean = require('gulp-clean');

var src = './WebContent';
var dest = './WebContent/build';

// Shell 
gulp.task('ui5preload_shell', ['clean'], function() {
  return gulp.src([
					'./shell/**.+(js|xml|properties|css|json)',
                    './shell/*/**.+(js|xml|properties|css|json)',
                    '!./shell/dist/**'
                  ], { cwd: src })
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/shell/', namespace:'airbus.mes.shell'}))
          .pipe(gulp.dest(dest + '/shell'));
     });

// Disruption
gulp.task('ui5preload_disruption', ['clean'], function() {
  return gulp.src([
					'./WebContent/components/disruptions/**.+(js|xml|properties|css|json)',
                    './WebContent/components/disruptions/*/**.+(js|xml|properties|css|json)',
                    '!./WebContent/components/disruptions/dist/**'
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/disruptions/', namespace:'airbus.mes.disruptions'}))
          .pipe(gulp.dest(dest + '/components/disruptions'));
     });

// Disruption Tracker
gulp.task('ui5preload_disruptiontracker', ['clean'], function() {
  return gulp.src([
					'./WebContent/components/disruptiontracker/**.+(js|xml|properties|css|json)',
                    './WebContent/components/disruptiontracker/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/disruptiontracker/kpi/**'
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/disruptiontracker/', namespace:'airbus.mes.disruptiontracker'}))
          .pipe(gulp.dest(dest + '/components/disruptiontracker'));
     });

//Disruption Tracker
gulp.task('ui5preload_disruptionkpi', ['clean'], function() {
  return gulp.src([
					'./WebContent/components/disruptiontracker/kpi/**.+(js|xml|properties|css|json)',
                    './WebContent/components/disruptiontracker/kpi/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/disruptiontracker/kpi/dist/**'
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/disruptiontracker/kpi', namespace:'airbus.mes.disruptiontracker.kpi'}))
          .pipe(gulp.dest(dest + '/components/disruptiontracker/kpi'));
     });
	 
// Homepage
gulp.task('ui5preload_homepage', ['clean'], function() {
  return gulp.src([
					'./WebContent/components/homepage/**.+(js|xml|properties|css|json)',
                    './WebContent/components/homepage/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/homepage/dist/**'
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/homepage/', namespace:'airbus.mes.homepage'}))
          .pipe(gulp.dest(dest + '/components/homepage'));
     });

// Line Tracker
gulp.task('ui5preload_linetracker', ['clean'], function() {
	return gulp.src([
					'./WebContent/components/linetracker/**.+(js|xml|properties|css|json)',
                    './WebContent/components/linetracker/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/linetracker/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/linetracker/',namespace:'airbus.mes.linetracker'}))
          .pipe(gulp.dest(dest + '/components/linetracker'));
     });	 

// Login
gulp.task('ui5preload_login', ['clean'], function() {
	return gulp.src([
					'./WebContent/components/login/**.+(js|xml|properties|css|json)',
                    './WebContent/components/login/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/login/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/login/', namespace:'airbus.mes.login'}))
          .pipe(gulp.dest(dest + '/components/login'));
     });	 

// Operation Detail
gulp.task('ui5preload_operationdetail', ['clean'], function() {
  return gulp.src([
					'./WebContent/components/operationdetail/**.+(js|xml|properties|css|json)',
                    './WebContent/components/operationdetail/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/operationdetail/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/operationdetail/', namespace:'airbus.mes.operationdetail'}))
          .pipe(gulp.dest(dest + '/components/operationdetail'));
     });	 	 

// Polypoly
gulp.task('ui5preload_polypoly', ['clean'], function() {
  return gulp.src([
					'./WebContent/components/polypoly/**.+(js|xml|properties|css|json)',
                    './WebContent/components/polypoly/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/polypoly/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/polypoly/',namespace:'airbus.mes.polypoly'}))
          .pipe(gulp.dest(dest + '/components/polypoly'));
     });

// Resource Pool
gulp.task('ui5preload_resourcepool', ['clean'], function() {
  return gulp.src([
					'./WebContent/components/resourcepool/**.+(js|xml|properties|css|json)',
                    './WebContent/components/resourcepool/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/resourcepool/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/resourcepool/', namespace:'airbus.mes.resourcepool'}))
          .pipe(gulp.dest(dest + '/components/resourcepool'));
     });	 	 

// Settings
gulp.task('ui5preload_settings', ['clean'], function() {
  return gulp.src([
					'./WebContent/components/settings/**.+(js|xml|properties|css|json)',
                    './WebContent/components/settings/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/settings/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/settings/', namespace:'airbus.mes.settings'}))
          .pipe(gulp.dest(dest + '/components/settings'));
     }); 

// Station Tracker
gulp.task('ui5preload_stationtracker', ['clean'], function() {
  return gulp.src([
					'./WebContent/components/stationtracker/**.+(js|xml|properties|css|json)',
                    './WebContent/components/stationtracker/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/stationtracker/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/stationtracker/', namespace:'airbus.mes.stationtracker'}))
          .pipe(gulp.dest(dest + '/components/stationtracker'));
     });

// Work Tracker
gulp.task('ui5preload_worktracker', ['clean'], function() {
  return gulp.src([
					'./WebContent/components/worktracker/**.+(js|xml|properties|css|json)',
                    './WebContent/components/worktracker/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/worktracker/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/worktracker/', namespace:'airbus.mes.worktracker'}))
          .pipe(gulp.dest(dest + '/components/worktracker'));
     });	 	 

 gulp.task('copy_index', ['clean'], function () {
	return gulp.src(['./shell/index.html'], { cwd: src })
		.pipe(gulp.dest(dest + '/shell'));
 });
 
 gulp.task('copy', ['clean'], function () {
	return gulp.src([
		'./components/homepage/css/margin.css',
		'./images/**',
		'./lib/**',
		'./Sass/global.css',
		'./Sass/*.png',
		'./components/homepage/data/1TileLineHome.json',
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
	//	'./shell/**/*.json',
	//	'./components/**/*.json'
	], { cwd: src, cwdbase: true })
		.pipe(gulp.dest(dest));
 });
 
 gulp.task('clean', function () {
	return gulp.src(dest, { read: false })
		.pipe(clean());
 });
 

// Tasks
gulp.task('build', ['copy_index', 'copy',
					  'ui5preload_shell', 'ui5preload_disruption', 'ui5preload_disruptiontracker', 'ui5preload_disruptionkpi', 'ui5preload_homepage',
					  'ui5preload_linetracker', 'ui5preload_login', 'ui5preload_operationdetail', 'ui5preload_polypoly', 'ui5preload_resourcepool',
					  'ui5preload_settings', 'ui5preload_stationtracker', 'ui5preload_worktracker']);	 

 gulp.task('default', ['build']);
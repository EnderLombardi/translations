// npm install --save-dev gulp-ui5-preload gulp-uglify gulp-pretty-data gulp-if 
var gulp  = require('gulp');
var ui5preload = require('gulp-ui5-preload');
//var uglify = require('gulp-uglify');
//var prettydata = require('gulp-pretty-data');
//var gulpif = require('gulp-if');
 
// Shell 

gulp.task('ui5preload_shell', function(){
  console.log("Shell");
  return gulp.src([
					'./WebContent/shell/**.+(js|xml|properties|css|json)',
                    './WebContent/shell/*/**.+(js|xml|properties|css|json)',
                    '!./WebContent/shell/dist/**'
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/shell/', namespace:'airbus.mes.shell'}))
          .pipe(gulp.dest('./build/shell'));
     });

// Disruption	 
console.log("Disruption");
gulp.task('ui5preload_disruption', function(){
  return gulp.src([
					'./WebContent/components/disruptions/**.+(js|xml|properties|css|json)',
                    './WebContent/components/disruptions/*/**.+(js|xml|properties|css|json)',
                    '!./WebContent/components/disruptions/dist/**'
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/disruptions/', namespace:'airbus.mes.disruptions'}))
          .pipe(gulp.dest('./build/components/disruptions'));
     });

// Disruption Tracker	 
console.log("Disruption Tracker");
gulp.task('ui5preload_disruptiontracker', function(){
  return gulp.src([
					'./WebContent/components/disruptiontracker/**.+(js|xml|properties|css|json)',
                    './WebContent/components/disruptiontracker/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/disruptiontracker/dist/**'
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/disruptiontracker/', namespace:'airbus.mes.disruptiontracker'}))
          .pipe(gulp.dest('./build/components/disruptiontracker'));
     });
	 
// Homepage	
console.log("Homepage");
gulp.task('ui5preload_homepage', function(){
  return gulp.src([
					'./WebContent/components/homepage/**.+(js|xml|properties|css|json)',
                    './WebContent/components/homepage/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/homepage/dist/**'
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/homepage/', namespace:'airbus.mes.homepage'}))
          .pipe(gulp.dest('./build/components/homepage'));
     });

// Line Tracker
console.log("Line Tracker");
 gulp.task('ui5preload_linetracker', function(){
  return gulp.src([
					'./WebContent/components/linetracker/**.+(js|xml|properties|css|json)',
                    './WebContent/components/linetracker/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/linetracker/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/linetracker/',namespace:'airbus.mes.linetracker'}))
          .pipe(gulp.dest('./build/components/linetracker'));
     });	 

// Login
console.log("Login");
 gulp.task('ui5preload_login', function(){
  return gulp.src([
					'./WebContent/components/login/**.+(js|xml|properties|css|json)',
                    './WebContent/components/login/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/login/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/login/', namespace:'airbus.mes.login'}))
          .pipe(gulp.dest('./build/components/login'));
     });	 

// Operation Detail
console.log("Operation Detail");
 gulp.task('ui5preload_operationdetail', function(){
  return gulp.src([
					'./WebContent/components/operationdetail/**.+(js|xml|properties|css|json)',
                    './WebContent/components/operationdetail/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/operationdetail/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/operationdetail/', namespace:'airbus.mes.operationdetail'}))
          .pipe(gulp.dest('./build/components/operationdetail'));
     });	 	 

// Polypoly
console.log("Polypoly");
 gulp.task('ui5preload_polypoly', function(){
  return gulp.src([
					'./WebContent/components/polypoly/**.+(js|xml|properties|css|json)',
                    './WebContent/components/polypoly/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/polypoly/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/polypoly/',namespace:'airbus.mes.polypoly'}))
          .pipe(gulp.dest('./build/components/polypoly'));
     });

// Resource Pool
console.log("Resource Pool");
 gulp.task('ui5preload_resourcepool', function(){
  return gulp.src([
					'./WebContent/components/resourcepool/**.+(js|xml|properties|css|json)',
                    './WebContent/components/resourcepool/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/resourcepool/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/resourcepool/', namespace:'airbus.mes.resourcepool'}))
          .pipe(gulp.dest('./build/components/resourcepool'));
     });	 	 

// Settings
console.log("Settings");
 gulp.task('ui5preload_settings', function(){
  return gulp.src([
					'./WebContent/components/settings/**.+(js|xml|properties|css|json)',
                    './WebContent/components/settings/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/settings/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/settings/', namespace:'airbus.mes.settings'}))
          .pipe(gulp.dest('./build/components/settings'));
     }); 

// Station Tracker
console.log("Station Tracker");
 gulp.task('ui5preload_stationtracker', function(){
  return gulp.src([
					'./WebContent/components/stationtracker/**.+(js|xml|properties|css|json)',
                    './WebContent/components/stationtracker/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/stationtracker/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/stationtracker/', namespace:'airbus.mes.stationtracker'}))
          .pipe(gulp.dest('./build/components/stationtracker'));
     });

// Work Tracker
console.log("Work Tracker");
 gulp.task('ui5preload_worktracker', function(){
  return gulp.src([
					'./WebContent/components/worktracker/**.+(js|xml|properties|css|json)',
                    './WebContent/components/worktracker/*/**.+(js|xml|properties|css|json)',
					'!./WebContent/components/worktracker/dist/**',
                  ])
//          .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify 
//          .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata  
          .pipe(ui5preload({base:'./WebContent/components/worktracker/', namespace:'airbus.mes.worktracker'}))
          .pipe(gulp.dest('./build/components/worktracker'));
     });	 	 

// Tasks
gulp.task('default', ['ui5preload_shell', 'ui5preload_disruption', 'ui5preload_disruptiontracker', 'ui5preload_homepage', 'ui5preload_linetracker',
                      'ui5preload_login', 'ui5preload_operationdetail', 'ui5preload_polypoly', 'ui5preload_resourcepool', 'ui5preload_settings',
					  'ui5preload_stationtracker', 'ui5preload_worktracker']);	 
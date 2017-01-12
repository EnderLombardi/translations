"use strict";

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    
	// Metadata.
//    pkg: grunt.file.readJSON('package.json'),
    
    connect: {
	  server: {
	    options: {
	      port: 8080,
	      keepalive: true,
	      base: 'WebContent',
	      open: {
	    	  target: 'http://localhost:8080/mes/current/shell'
	      }
	    }
	  }
	},
    
    // OpenUI5 Server
    openui5_connect: {
	  server: {
	    options: {
	      appresources: 'build',
	      contextpath: 'mes/'
//	      proxypath: 'sapui5',
//	      proxyOptions: {
//	    	target: 'https://sapui5.hana.ondemand.com/1.36.11',
//	    	prependPath: true
//	      },
//	      cors: {
//	    	origin: '*'
//	      }
	    }
	  }
	}
  
  });
  
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-openui5');
  
  // Default task.
  grunt.registerTask('default', ['openui5_connect']);

};
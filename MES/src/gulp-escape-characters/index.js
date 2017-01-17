'use strict'

var entityConvert = require('../escape-non-ascii-characters'),
    gutil         = require('gulp-util'),
    mapStream     = require('map-stream');

module.exports = function (options) {

  options = options || { type: "html" }

  return mapStream(function (file, cb) {
	  
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new gutil.PluginError('gulp-escape-characters', 'Streaming not supported'));
    }

    var toConvert = String(file.contents);
    var converted = entityConvert[options.type](toConvert);
    
    file.contents = new Buffer(converted);
    cb(null, file);
    
    return;
    
  })
}

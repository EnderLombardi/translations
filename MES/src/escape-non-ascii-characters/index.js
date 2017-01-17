"use strict";

function eachChar(str, fn) {
	str = str.split('');
	for (var i = 0, len = str.length; i < len; i++) {
		str[i] = fn(str[i]);
	}
	return str.join('');
}

function replacer(mode) {

	function getEnt(code) {
		var ent;
		switch (mode) {
		case "css":
			ent = `\\${ code.toString(16) } `;
			break;
		case "html":
			ent = `&#${ code };`
			break;
		case "properties":
			var hexCode = code.toString(16);
			ent = `\\u${ '0'.repeat(4 - hexCode.length) + hexCode  }`;
		default:
			break;
		}
		return ent;
	}

	return function(character) {
		var index = character.charCodeAt(0);
		return (index > 127) ? getEnt(index) : character;
	};

}

function replaceBy(mode) {
	return function(string) {
		return eachChar(string, replacer(mode));
	};
}

module.exports = {
	css: replaceBy('css'),
	html: replaceBy('html'),
	properties: replaceBy('properties')
};

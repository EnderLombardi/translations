"use strict";
jQuery.sap.declare("airbus.mes.acpnglinks.util.Formatter");

airbus.mes.acpnglinks.util.Formatter = {
	/**
	 * Set Visibility to false
	 * 
	 * @param {string}
	 *            sValue : true or false
	 * @returns {boolean} return : true/false
	 */
	toBooleanLeft : function(sValue) {
		if (sValue.toUpperCase() == "NEVER") {
			return false;
		} else {
			return !Boolean(sValue.toUpperCase() == "TRUE");
		}
	},

	/**
	 * Set visibility to true
	 * 
	 * @param {string}
	 *            sValue : true or false
	 * @returns {boolean} return : true/false
	 */
	toBooleanRight : function(sValue) {
		if (sValue.toUpperCase() == "NEVER") {
			return false;
		} else {
			return Boolean(sValue.toUpperCase() == "TRUE");
		}
	},
	
	levelFormat : function(sValue){
		var result = sValue % 5;
		if (sValue!= undefined){	
			return result.toString();
		}else{
			return "0";
		}
	}
};

"use strict";
jQuery.sap.declare("airbus.mes.acpnglinks.util.Formatter");

airbus.mes.acpnglinks.util.Formatter = {
	
	toBooleanLeft : function(sValue) {
	return !Boolean(sValue.toUpperCase() == "TRUE");
	},

	toBooleanRight : function(sValue) {
	return Boolean(sValue.toUpperCase() == "TRUE");
	}
	
};

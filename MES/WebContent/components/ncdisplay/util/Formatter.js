"use strict";
jQuery.sap.declare("airbus.mes.ncdisplay.util.Formatter");

airbus.mes.ncdisplay.util.Formatter = {
	
//	SD-NCDisplay-0060
	showButton : function(sValue) {
		var aAvailableStatus = ["NC", "PNC", "IR"];
		if(sValue !== undefined && aAvailableStatus.indexOf(sValue) !== -1) {
			return true;
		} else {
			return false;
		}
	}
};

"use strict";
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.declare("airbus.mes.stationHandover.util.Formatter");

airbus.mes.stationHandover.util.Formatter = {
		
	isBlocked : function(oEvt) {
		
		var oEvt
		
	},

	translate : function(oEvt) {
		
	return	airbus.mes.stationHandover.oView.getModel("stationHandoverI18n").getProperty(oEvt);		
	
	}

};


"use strict";
jQuery.sap.declare("airbus.mes.calendar.util.BoxDisplayManager");
//Stationtracker box display

airbus.mes.calendar.util.BoxDisplayManager = {

	//---------------------
	//      DisplayTotal
	//---------------------
	totalConstructor : function(oEvent) {
		
		return '<div class="trackerBox greyTotal"><span>' + oEvent.value + '</span></div>';
	},

};

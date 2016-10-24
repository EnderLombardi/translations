"use strict";
 
jQuery.sap.declare("airbus.mes.polypoly.util.Formatter");

airbus.mes.polypoly.util.Formatter = {
		
		isVisible : function() {
//			return airbus.mes.polypoly.oView.getModel("mToggleVisibility").getData().bVisible;
			return !airbus.mes.stationtracker.AssignmentManager.polypolyAffectation;
		},
};
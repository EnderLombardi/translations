"use strict";
 
jQuery.sap.declare("airbus.mes.polypoly.util.Formatter");

airbus.mes.polypoly.util.Formatter = {
		
		isVisible : function() {
//			return airbus.mes.polypoly.oView.getModel("mToggleVisibility").getData().bVisible;
			return !airbus.mes.stationtracker.util.AssignmentManager.polypolyAffectation;
		},
		
		techNameFormat : function(){
			var stationMII = airbus.mes.polypoly.ModelManager.stationMII;
			var nMaxLength = 16;
			var sMask = stationMII;
			var nDispLen = nMaxLength - stationMII.length;
			for(var i = 0; i<nDispLen;i++){
				sMask = sMask.concat("*");
			}
			return sMask
		}
};
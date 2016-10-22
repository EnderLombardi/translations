"use strict";
 
jQuery.sap.declare("airbus.mes.shell.util.Formatter");

airbus.mes.shell.util.Formatter = {
		
		checkCurrentView :function(){
			
			console.log("toto");
		},
		
		stationTrackerStation : function(Station) {
//			sap.ui.getCore().getModel("StationTrackerI18n").getProperty("Station");
			return airbus.mes.shell.oView.getModel("ShellI18n").getProperty("Station") + " " + Station;
		},
		stationTrackerMsn : function(Msn) {
			return airbus.mes.shell.oView.getModel("ShellI18n").getProperty("MSN") + " " + + Msn;
		},
		stationTrackerPlant : function(Plant) {
			return airbus.mes.shell.oView.getModel("ShellI18n").getProperty("Plant") + " " + Plant;
		},
		stationTrackerLine : function(Line) {
			return airbus.mes.shell.oView.getModel("ShellI18n").getProperty("Line") + " " + Line;
		},
		setInformationVisibility : function() {
			if(!airbus.mes.stationtracker.isVisible) {
				return airbus.mes.stationtracker.isVisible;		
			} else {
				return false;
			}
		}		
		
	
};

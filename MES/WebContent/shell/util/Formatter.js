"use strict";

jQuery.sap.declare("airbus.mes.shell.util.Formatter");

airbus.mes.shell.util.Formatter = {

	checkCurrentView : function() {

		console.log("toto");
	},
	setInformationVisibility : function() {
		if (!airbus.mes.stationtracker.isVisible) {
			return airbus.mes.stationtracker.isVisible;
		} else {
			return false;
		}
	},
	stationTrackerStation : function(sStation) {
		if (sStation === "") {
			return "";
		} else {
			return airbus.mes.shell.oView.getModel("ShellI18n").getProperty(
					"Station")
					+ " " + sStation;
		}
	},
	stationTrackerMsn : function(sMsn) {
		if (sMsn === "") {
			return "";
		} else {
			return airbus.mes.shell.oView.getModel("ShellI18n").getProperty(
					"MSN")
					+ " " + sMsn;
		}
	},
	stationTrackerPlant : function(sPlant) {
		if (sPlant === "") {
			return "";
		} else {
			return airbus.mes.shell.oView.getModel("ShellI18n").getProperty(
					"Plant")
					+ " " + sPlant;
		}
	},
	stationTrackerLine : function(sLine) {
		if (sLine === "") {
			return "";
		} else {
			return airbus.mes.shell.oView.getModel("ShellI18n").getProperty(
					"Line")
					+ " " + sLine;
		}
	},
};

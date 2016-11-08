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
	
	getMiiText : function(sID, sParam1, sParam2, sParam3, sParam3, sParam4, sParam5, sParam6, sParam6, sParam7, sParam8, sParam9, sParam10) {
		var sMessage = airbus.mes.shell.oView.getModel("miiI18n").getProperty(sID);
		if(sParam1.constructor === String){
			var aParams = Array.from(arguments).slice(1);
		}else if(sParam1.constructor === Array){
			var aParams = sParam1;
		}
		return jQuery.sap.formatMessage(sMessage, aParams)
	},
	
	getMiiTextFromData : function(data) {
		if(data.hasOwnProperty("Rowsets")){
			data = data.Rowsets.Rowset[0].Row[0];
		}
		var sMessageID = data.Message_ID;
		var aParams = [];
		if(data.hasOwnProperty("Message_ID")){
			for(var property in data){
				if(property != "Message_ID" && property !="Message_Type" && data[property] != ""){
					aParams.push(data[property]);
				}
			}
			this.getMiiText(sMessageID, aParams);
		}else{
			console.log("Parameter data cannot be processed");
		}
	},
};

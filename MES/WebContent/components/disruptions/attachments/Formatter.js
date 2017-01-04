"use strict";

jQuery.sap.declare("airbus.mes.disruptions.attachments.Formatter");

airbus.mes.disruptions.attachments.Formatter = {

	status : {
		"pending" 	: "Pending",
		"closed" 	: "Closed",
		"acknowledged" : "Acknowledged",
		"solved" 	: "Solved",
		"rejected" 	: "Rejected",
		"deleted" 	: "Deleted"
	},
		
	setGravityTexts : function(gravity) {
		
		var property;
		
		switch(gravity) {
		case "1":
			property = airbus.mes.disruptions.attachments.oView.getModel("i18nModel").getProperty("NotBlocked");
			break;
		case "2":
			property = airbus.mes.disruptions.attachments.oView.getModel("i18nModel").getProperty("Disturbed");
			break;
		case "3":
			property = airbus.mes.disruptions.attachments.oView.getModel("i18nModel").getProperty("Blocked");
			break;
		default:
			break;
		}
		return property;
	},


	
	setDisruptionStatuses : function(status){
		return airbus.mes.disruptions.attachments.oView.getModel("i18nModel").getProperty(status);
	},
	isStatusFinal : function(status) {
		if( status === airbus.mes.disruptions.Formatter.status.closed 
	    ||  status === airbus.mes.disruptions.Formatter.status.solved
	    ||  status === airbus.mes.disruptions.Formatter.status.rejected 
	    ||  status === airbus.mes.disruptions.Formatter.status.deleted	){
			return true;
		} else {
			return false;
		}
	}
};

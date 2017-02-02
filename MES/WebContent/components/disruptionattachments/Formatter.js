"use strict";

jQuery.sap.declare("airbus.mes.disruptionattachments.Formatter");

airbus.mes.disruptionattachments.Formatter = {

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
			property = airbus.mes.disruptionattachments.oView.getModel("i18nModel").getProperty("NotBlocked");
			break;
		case "2":
			property = airbus.mes.disruptionattachments.oView.getModel("i18nModel").getProperty("Disturbed");
			break;
		case "3":
			property = airbus.mes.disruptionattachments.oView.getModel("i18nModel").getProperty("Blocked");
			break;
		default:
			break;
		}
		return property;
	},


	
	setDisruptionStatuses : function(status){
		return airbus.mes.disruptionattachments.oView.getModel("i18nModel").getProperty(status);
	},
	setCount : function(){
		var oModel = sap.ui.getCore().getModel("attachDisruption");
		var sPath = this.oPropagatedProperties.oBindingContexts.attachDisruption.sPath;
		var iRowIndex = sPath.split("/")[5];
		var iCount = oModel.oData.Rowsets.Rowset[0].Row[iRowIndex].File.length;
		return iCount;
	}
};

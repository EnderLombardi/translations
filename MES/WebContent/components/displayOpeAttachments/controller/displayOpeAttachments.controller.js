"use strict";

sap.ui.controller("airbus.mes.displayOpeAttachments.controller.displayOpeAttachments", {

	// Get setting from ME/MII and select the good button between operation and work order
	onAfterRendering: function () {

		//todo :will be the configuration received in AppConfManager
		//var sSet = airbus.mes.settings.AppConfManager.getConfiguration("VIEW_ATTACHED_TOOL");
		var sSet = "P";
		switch (sSet) {
			case "O"://operation
				sap.ui.getCore().byId("displayOpeAttachmentsView--operationButton").setSelected(true);
				break;
			case "P"://work order
				sap.ui.getCore().byId("displayOpeAttachmentsView--workOrderButton").setSelected(true);
				break;
			default: //if Null
				break;
		}
	},

	//todo : get user action on the checkbox field
	onSelectLevel: function (oEvent) {

	},

});
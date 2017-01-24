"use strict";

sap.ui.controller("airbus.mes.displayOpeAttachments.controller.displayOpeAttachments", {

	//todo : get user action on the checkbox field
	onSelectLevel: function (oEvent) {
		var paramArray = [], shopOrderBO = undefined, routerBO = undefined, site = undefined, routerStepBO = undefined, previousSet;

		shopOrderBO = airbus.mes.stationtracker.ModelManager.stationInProgress.ShopOrderBO;
		//routerBO = something; TODO
		site = airbus.mes.settings.ModelManager.site;
		routerStepBO = airbus.mes.stationtracker.ModelManager.stationInProgress.RouterStepBO;

		//change operation/wo mode
		previousSet = airbus.mes.displayOpeAttachments.util.ModelManager.sSet;
		switch (previousSet) {
			case "O"://operation
				sap.ui.getCore().byId("displayOpeAttachmentsView--operationButton").setSelected(true);
				airbus.mes.displayOpeAttachments.util.ModelManager.sSet = "P";
				break;
			case "P"://work order
				sap.ui.getCore().byId("displayOpeAttachmentsView--workOrderButton").setSelected(true);
				airbus.mes.displayOpeAttachments.util.ModelManager.sSet = "O";
				break;
			default: //if Null
				break;
		}
		
		//fill the tab
		paramArray.push(shopOrderBO);
		paramArray.push(routerBO);
		paramArray.push(site);
		paramArray.push(routerStepBO);

		airbus.mes.displayOpeAttachments.util.ModelManager.loadDOADetail(paramArray);
	},

});
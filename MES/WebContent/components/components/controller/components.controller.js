"use strict";

sap.ui.controller("airbus.mes.components.controller.components", {

	// Get setting from ME/MII and select the good button between operation and work order
	onAfterRendering: function () {
	},
	
	checkSettingComponents: function () {

		// confirm if we have already check the ME settings
		
		if (airbus.mes.shell.util.navFunctions.jigsAndTools.configME === undefined){
			
			//will be the configuration received in AppConfManager
			
			//var sSet = airbus.mes.settings.AppConfManager.getConfiguration("VIEW_ATTACHED_TOOL");
			var sSet = "P";
			
			//Add value to global variable
			airbus.mes.shell.util.navFunctions.components.configME = sSet;
			
		} else {
			
			// set the global variable
			var sSet = airbus.mes.shell.util.navFunctions.components.configME;
		}
		
		switch (sSet) {
			case "O"://operation
				sap.ui.getCore().byId("componentsView--operationButton").setSelected(true);
				break;
			case "P"://work order
				sap.ui.getCore().byId("componentsiew--workOrderButton").setSelected(true);
				break;
			default: //if Null
				break;
		}
		this.filterJigsTools(sSet);
	},

	//get user action on the checkbox field
	onSelectLevel: function (oEvent) {

		var sId = oEvent.mParameters.selectedIndex;
		switch (sId) {
			case 0://operation button
				this.filterComponents(airbus.mes.components.util.ModelManager.operation);
				break;
			case 1://work order button
				this.filterComponents(airbus.mes.components.util.ModelManager.workOrder);
				break;
			default:
				break;
		}
	},

	//table filter 
	filterComponents: function (sScope) {
		switch (sScope) {
			case airbus.mes.components.util.ModelManager.operation:
				sap.ui.getCore().byId("componentsView--componentsList").getBinding("items").filter(new sap.ui.model.Filter("operationNumber", "EQ", "operation2"));
				break;
			case airbus.mes.components.util.ModelManager.workOrder:
				sap.ui.getCore().byId("componentsView--componentsList").getBinding("items").filter();
				break;
			default:
				break;
		}
	}
}
);

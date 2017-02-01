"use strict";

sap.ui.controller("airbus.mes.jigtools.controller.jigtools", {

	// Get setting from ME/MII and select the good button between operation and work order
	onAfterRendering: function () {
	},
	
	checkSettingJigsTools: function () {

		// confirm if we have already check the ME settings
		
		if (airbus.mes.shell.util.navFunctions.jigsAndTools.configME === undefined){
			
			//will be the configuration received in AppConfManager
			
			//var sSet = airbus.mes.settings.AppConfManager.getConfiguration("VIEW_ATTACHED_TOOL");
			var sSet = "P";
			
			//Add value to global variable
			airbus.mes.shell.util.navFunctions.jigsAndTools.configME = sSet;
			
		} else {
			
			// set the global variable
			var sSet = airbus.mes.shell.util.navFunctions.jigsAndTools.configME;
		}
		
		switch (sSet) {
			case "O"://operation
				sap.ui.getCore().byId("jigtoolsView--operationButton").setSelected(true);
				break;
			case "P"://work order
				sap.ui.getCore().byId("jigtoolsView--workOrderButton").setSelected(true);
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
				this.filterJigsTools(airbus.mes.jigtools.util.ModelManager.operation);
				break;
			case 1://work order button
				this.filterJigsTools(airbus.mes.jigtools.util.ModelManager.workOrder);
				break;
			default:
				break;
		}
	},

	//table filter 
	filterJigsTools: function (sScope) {
		switch (sScope) {
			case airbus.mes.jigtools.util.ModelManager.operation:
				sap.ui.getCore().byId("jigtoolsView--jigToolList").getBinding("items").filter(new sap.ui.model.Filter("routerStep", "EQ", sap.ui.getCore().getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].routerStepBo));
				break;
			case airbus.mes.jigtools.util.ModelManager.workOrder:
				sap.ui.getCore().byId("jigtoolsView--jigToolList").getBinding("items").filter();
				break;
			default:
				break;
		}
	}
}
);

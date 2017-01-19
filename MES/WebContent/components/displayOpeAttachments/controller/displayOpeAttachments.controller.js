"use strict";

sap.ui.controller("airbus.mes.displayOpeAttachments.controller.displayOpeAttachments", {

    // Get setting from ME/MII and select the good button between operation and work order
	onAfterRendering: function () {

		//will be the configuration received in AppConfManager
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
		this.filterDOA(sSet);
	},

    //get user action on the checkbox field
    onSelectLevel: function (oEvent) {

        var sId = oEvent.mParameters.selectedIndex;
        switch (sId) {
            case 0:
                this.filterDOA(airbus.mes.displayOpeAttachments.util.ModelManager.operation);
                break;
            case 1:
                this.filterDOA(airbus.mes.displayOpeAttachments.util.ModelManager.workOrder);
                break;
            default:
                break;
        }
    },

    //table filter 
    filterDOA: function (sScope) {
        switch (sScope) {
            case airbus.mes.displayOpeAttachments.util.ModelManager.operation:
                //todo
                //sap.ui.getCore().byId("displayOpeAttachmentsView--DOATable").getBinding("items").filter(new sap.ui.model.Filter("operation", "EQ", "operation2"));
                break;

            case airbus.mes.displayOpeAttachments.util.ModelManager.workOrder:
                //todo
                //sap.ui.getCore().byId("displayOpeAttachmentsView--DOATable").getBinding("items").filter();
                break;
            default:
                break;
        }
    }

});
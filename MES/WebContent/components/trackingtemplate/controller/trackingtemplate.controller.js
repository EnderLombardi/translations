"use strict";
sap.ui.controller("airbus.mes.trackingtemplate.controller.trackingtemplate",{

	onInit: function () {
		/*
		//this.nav = this.getView().byId("operDetailNavContainer");
		if (airbus.mes.trackingtemplate.status === undefined || airbus.mes.trackingtemplate.status.oView === undefined) {
			sap.ui.getCore().createComponent({
				name: "airbus.mes.trackingtemplate.status",
			});
			this.nav.addPage(airbus.mes.trackingtemplate.status.oView);
		}
		*/
	},
	
	// Get user action on the checkbox field
    onSelectLevel: function (oEvent) {

        var sId = oEvent.mParameters.selectedIndex;
        switch (sId) {
            case 0://operation button
                this.filterTckTemplate(airbus.mes.trackingtemplate.util.ModelManager.operation);
                break;
            case 1://work order button
                this.filterTckTemplate(airbus.mes.trackingtemplate.util.ModelManager.workOrder);
                break;
            default:
                break;
        }
    },
    
    // List filter
    filterTckTemplate: function (sScope) {
        //var idOpe = airbus.mes.trackingtemplate.util.ModelManager.operationData;
        switch (sScope) {
            case airbus.mes.trackingtemplate.util.ModelManager.operation:
                //sap.ui.getCore().byId("ncdisplayView--ncDisplay").getBinding("items").filter(new sap.ui.model.Filter("idOpe", "EQ", idOpe[0].operation_id));
                break;
            case airbus.mes.trackingtemplate.util.ModelManager.workOrder:
                //sap.ui.getCore().byId("ncdisplayView--ncDisplay").getBinding("items").filter();
                break;
            default:
                break;
        }
    },


});
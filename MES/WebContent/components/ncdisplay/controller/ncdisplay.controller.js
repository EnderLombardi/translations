"use strict";
sap.ui.controller("airbus.mes.ncdisplay.controller.ncdisplay", {

    defaultSelectNcDisplay: function () {
        this.filterNcDisplay(airbus.mes.ncdisplay.util.ModelManager.operation);
    },

    //get user action on the checkbox field
    onSelectLevel: function (oEvent) {

        var sId = oEvent.mParameters.selectedIndex;
        switch (sId) {
            case 0://operation button
                this.filterNcDisplay(airbus.mes.ncdisplay.util.ModelManager.operation);
                break;
            case 1://work order button
                this.filterNcDisplay(airbus.mes.ncdisplay.util.ModelManager.workOrder);
                break;
            default:
                break;
        }
    },

    //table filter
    filterNcDisplay: function (sScope) {
        var idOpe = airbus.mes.ncdisplay.util.ModelManager.operationData;
        switch (sScope) {
            case airbus.mes.ncdisplay.util.ModelManager.operation:
                sap.ui.getCore().byId("ncdisplayView--ncDisplay").getBinding("items").filter(new sap.ui.model.Filter("idOpe", "EQ", idOpe[0].operation_id));
                break;
            case airbus.mes.ncdisplay.util.ModelManager.workOrder:
                sap.ui.getCore().byId("ncdisplayView--ncDisplay").getBinding("items").filter();
                break;
            default:
                break;
        }
    }
});

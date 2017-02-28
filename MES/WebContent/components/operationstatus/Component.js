"use strict";

jQuery.sap.require("airbus.mes.operationstatus.util.ModelManager");
jQuery.sap.declare("airbus.mes.operationstatus.Component");

sap.ui.core.UIComponent.extend("airbus.mes.operationstatus.Component", {
    metadata : {
        properties : {},
    }
});

airbus.mes.operationstatus.Component.prototype.createContent = function() {


    if (airbus.mes.operationstatus.oView === undefined) {

        // View on XML
        this.oView = sap.ui.view({
            id : "idStatusView",
            viewName : "airbus.mes.operationstatus.view.status",
            type : "XML",
            height:"auto"
        })
        airbus.mes.operationstatus.oView = this.oView;

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleName : "airbus.mes.operationdetail.i18n.i18n",
         });

        this.oView.setModel(i18nModel, "i18n");

        // Initialize ModelManager and load needed file
        airbus.mes.operationstatus.util.ModelManager.init(sap.ui.getCore());

        return this.oView;
    } else {
        return airbus.mes.operationstatus.oView;
    }

};

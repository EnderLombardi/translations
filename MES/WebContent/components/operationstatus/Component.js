"use strict";
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
            viewName : "airbus.mes.operationstatus.status",
            type : "XML",
            height:"auto"
        })
        airbus.mes.operationstatus.oView = this.oView;

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleName : "airbus.mes.operationdetail.i18n.i18n",
         });

        this.oView.setModel(i18nModel, "i18n");

        return this.oView;
    } else {
        return airbus.mes.operationstatus.oView;
    }

};

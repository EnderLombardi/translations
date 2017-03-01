"use strict";
jQuery.sap.require("airbus.mes.qdc.ModelManager");
jQuery.sap.require("airbus.mes.qdc.util.Formatter");

jQuery.sap.declare("airbus.mes.qdc.Component");

sap.ui.core.UIComponent.extend("airbus.mes.qdc.Component", {
    metadata : {
        properties : {
        },
    }
});

airbus.mes.qdc.Component.prototype.createContent = function() {


    if (airbus.mes.qdc.oView === undefined) {
        // Initialize ModelManager and load needed file
        airbus.mes.qdc.ModelManager.init(sap.ui.getCore());
        
        // View on XML
        this.oView = sap.ui.view({
            id : "idCheckListView",
            viewName : "airbus.mes.qdc.Checklist",
            type : "XML",
            height:"100%"
        })
        airbus.mes.qdc.oView = this.oView;

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleName : "airbus.mes.qdc.i18n.i18n",
         });

        this.oView.setModel(i18nModel, "i18nModel");

        return this.oView;
    } else {
        return airbus.mes.qdc.oView;
    }

};

"use strict";
jQuery.sap.registerModulePath("airbus.mes.operationdetail", "../components/operationdetail");
jQuery.sap.require("airbus.mes.operationdetail.Formatter");
jQuery.sap.require("airbus.mes.operationdetail.ModelManager");
//jQuery.sap.includeStyleSheet("../Sass/global.css");


jQuery.sap.declare("airbus.mes.operationdetail.Component");

sap.ui.core.UIComponent.extend("airbus.mes.operationdetail.Component", {
    metadata : {
        properties : {},
        //global.css already included in components\settings\manifest.json so no need to include it here
    }
});

airbus.mes.operationdetail.Component.prototype.createContent = function() {


    if (airbus.mes.operationdetail.oView === undefined) {
        //        Initialization
        airbus.mes.operationdetail.ModelManager.init(sap.ui.getCore());

        // View on XML
        this.oView = sap.ui.view({
            id : "operationDetailsView",
            viewName : "airbus.mes.operationdetail.operationDetail",
            type : "XML",
            height:"100%"
        })

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl : "../components/operationdetail/i18n/i18n.properties",
         });

        this.oView.setModel(i18nModel, "i18n");

    //    this.oView.setModel(sap.ui.getCore().getModel("reasonCodeModel"), "reasonCodeModel");)
        return this.oView;
    } else {
        return airbus.mes.operationdetail.oView;
    }

};

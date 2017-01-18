"use strict";
jQuery.sap.registerModulePath("airbus.mes.operationdetail.QDC", "../components/operationdetail/QDC");
//jQuery.sap.require("airbus.mes.operationdetail.status.Formatter");
jQuery.sap.require("airbus.mes.operationdetail.QDC.ModelManager");


jQuery.sap.declare("airbus.mes.operationdetail.QDC.Component");

sap.ui.core.UIComponent.extend("airbus.mes.operationdetail.QDC.Component", {
    metadata : {
        properties : {
        	 includes : [ "../components/operationdetail/QDC/css/style.css" ]
        },
        //global.css already included in components\settings\manifest.json so no need to include it here
    }
});

airbus.mes.operationdetail.QDC.Component.prototype.createContent = function() {


    if (airbus.mes.operationdetail.QDC.oView === undefined) {
        // Initialize ModelManager and load needed file
        airbus.mes.operationdetail.QDC.ModelManager.init(sap.ui.getCore());
        
        // View on XML
        this.oView = sap.ui.view({
            id : "idCheckListView",
            viewName : "airbus.mes.operationdetail.QDC.Checklist",
            type : "XML",
            height:"auto"
        })
        airbus.mes.operationdetail.QDC.oView = this.oView;

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleName : "airbus.mes.operationdetail.i18n.i18n",
         });

        this.oView.setModel(i18nModel, "i18n");

        return this.oView;
    } else {
        return airbus.mes.operationdetail.QDC.oView;
    }

};

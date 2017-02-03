"use strict";
jQuery.sap.registerModulePath("airbus.mes.operationdetail", "../components/operationdetail");
jQuery.sap.require("airbus.mes.operationdetail.Formatter");
jQuery.sap.require("airbus.mes.operationdetail.ModelManager");

// instantiate component 
if (jQuery.sap.getObject("airbus.mes.jigtools.Component") === undefined) {
	jQuery.sap.registerModulePath("airbus.mes.jigtools", "../components/jigtools");
	sap.ui.getCore().createComponent({
		name : "airbus.mes.jigtools", 
		site : airbus.mes.settings.ModelManager.site,
	    workOrder : airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].wo_no,
	    operation : sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_no
});
}


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
            bundleName : "airbus.mes.operationdetail.i18n.i18n",
         });

        this.oView.setModel(i18nModel, "i18n");

    //    this.oView.setModel(sap.ui.getCore().getModel("reasonCodeModel"), "reasonCodeModel");)
        return this.oView;
    } else {
        return airbus.mes.operationdetail.oView;
    }

};

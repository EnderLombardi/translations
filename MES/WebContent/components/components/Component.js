"use strict";

jQuery.sap.registerModulePath("airbus.mes.components", "../components/components");
jQuery.sap.require("airbus.mes.components.util.ModelManager");
jQuery.sap.declare("airbus.mes.components.Component");

sap.ui.core.UIComponent.extend("airbus.mes.components.Component", {
	metadata : {
		properties : { },
	}
});

airbus.mes.components.Component.prototype.createContent = function() {

	//Set current work Order and operation
    airbus.mes.components.workOrder = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no;
    airbus.mes.components.operation = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_no;

	if (airbus.mes.components.oView === undefined) {
		
        // Initialize ModelManager and load needed file
        airbus.mes.components.util.ModelManager.init(sap.ui.getCore());
        
		// View on XML
		this.oView = sap.ui.view({
			id : "componentsView",
			viewName : "airbus.mes.components.view.components",
			type : "XML",
			height:"auto"
		})
		airbus.mes.components.oView = this.oView;

		var i18nModel = new sap.ui.model.resource.ResourceModel({ bundleName : "airbus.mes.components.i18n.i18n" });
		this.oView.setModel(i18nModel, "i18nComponentsModel");		
		
		return this.oView;
		
	} else {
		
		return airbus.mes.components.oView;
		
	}
};

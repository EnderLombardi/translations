"use strict";

jQuery.sap.registerModulePath("airbus.mes.components", "../components/components");
jQuery.sap.require("airbus.mes.components.util.ModelManager");
jQuery.sap.declare("airbus.mes.components.Component");
jQuery.sap.require("airbus.mes.components.util.Formatter");

sap.ui.core.UIComponent.extend("airbus.mes.components.Component", {
	metadata : {
		properties : { 
			site : undefined,
			workOrder : undefined,
			operation : undefined,
		},
	}
});

airbus.mes.components.Component.prototype.init = function () {
    // call the init function of the parent
	sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
};

airbus.mes.components.Component.prototype.createContent = function() {

	//Set current work Order and operation
    airbus.mes.components.workOrder = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no;
    airbus.mes.components.operation = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_no;

	if (airbus.mes.components.oView === undefined) {
		
		// View on XML
		this.oView = sap.ui.view({
			id : "componentsView",
			viewName : "airbus.mes.components.view.components",
			type : "XML",
			height:"100%"
		})
		airbus.mes.components.oView = this.oView;

        // Initialize ModelManager and load needed file
        airbus.mes.components.util.ModelManager.init(sap.ui.getCore());
		
		var i18nModel = new sap.ui.model.resource.ResourceModel({ bundleName : "airbus.mes.components.i18n.i18n" });
		this.oView.setModel(i18nModel, "i18nComponentsModel");		
		
		return this.oView;
		
	} else {
		
		return airbus.mes.components.oView;
		
	}
};

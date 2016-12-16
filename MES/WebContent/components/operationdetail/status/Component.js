"use strict";
jQuery.sap.registerModulePath("airbus.mes.operationdetail.status", "../components/operationdetail/status");
//jQuery.sap.require("airbus.mes.operationdetail.status.Formatter");
jQuery.sap.require("airbus.mes.operationdetail.ModelManager");


jQuery.sap.declare("airbus.mes.operationdetail.status.Component");

sap.ui.core.UIComponent.extend("airbus.mes.operationdetail.status.Component", {
	metadata : {
		properties : {},
		includes : [ "../css/progressSlider.css" ]

	}
});

airbus.mes.operationdetail.status.Component.prototype.createContent = function() {


	if (airbus.mes.operationdetail.status.oView === undefined) {
		
		// View on XML
		this.oView = sap.ui.view({
			id : "idStatusView",
			viewName : "airbus.mes.operationdetail.status.status",
			type : "XML",
			height:"auto"
		})
		airbus.mes.operationdetail.status.oView = this.oView;

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/operationdetail/i18n/i18n.properties",
	     });
		
		this.oView.setModel(i18nModel, "i18n");		

		return this.oView;
	} else {
		return airbus.mes.operationdetail.status.oView;
	}

};

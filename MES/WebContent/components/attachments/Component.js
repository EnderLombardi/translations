"use strict";
jQuery.sap.registerModulePath("airbus.mes.attachments", "../components/attachments");
//jQuery.sap.require("airbus.mes.operationdetail.status.Formatter");
//jQuery.sap.require("airbus.mes.operationdetail.ModelManager");


jQuery.sap.declare("airbus.mes.attachments.Component");

sap.ui.core.UIComponent.extend("airbus.mes.attachments.Component", {
	metadata : {
		properties : {},
//		includes : [ "../css/progressSlider.css" ]

	}
});

airbus.mes.attachments.Component.prototype.createContent = function() {


	if (airbus.mes.attachments.oView === undefined) {
		
		// View on XML
		this.oView = sap.ui.view({
			id : "idDisruptionAttachment",
			viewName : "airbus.mes.attachments.disruptionAttachment",
			type : "XML",
			height:"auto"
		})
		airbus.mes.attachments.oView = this.oView;

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/attachments/i18n/i18n.properties",
	     });
		
		this.oView.setModel(i18nModel, "i18n");		
		


		return this.oView;
	} else {
		
		return airbus.mes.attachments.oView;
	}

};

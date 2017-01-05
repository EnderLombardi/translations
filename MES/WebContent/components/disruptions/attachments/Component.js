"use strict";
jQuery.sap.registerModulePath("airbus.mes.disruptions.attachments", "../components/disruptions/attachments");
jQuery.sap.require("airbus.mes.disruptions.attachments.Formatter");
jQuery.sap.require("airbus.mes.disruptions.attachments.ModelManager");


jQuery.sap.declare("airbus.mes.disruptions.attachments.Component");

sap.ui.core.UIComponent.extend("airbus.mes.disruptions.attachments.Component", {
	metadata : {
		properties : {},
//		includes : [ "../css/progressSlider.css" ]

	}
});

airbus.mes.disruptions.attachments.Component.prototype.createContent = function() {


	if (airbus.mes.disruptions.attachments.oView === undefined) {
		
        // Initialize ModelManager and load needed file
        airbus.mes.disruptions.attachments.ModelManager.init(sap.ui.getCore());
        
		// View on XML
		this.oView = sap.ui.view({
			id : "DisruptionAttachmentView",
			viewName : "airbus.mes.disruptions.attachments.disruptionAttachment",
			type : "XML",
			height:"auto"
		})
		airbus.mes.disruptions.attachments.oView = this.oView;

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/disruptions/attachments/i18n/i18n.properties",
	     });
		
		this.oView.setModel(i18nModel, "i18nModel");		
		this.oView.setModel(sap.ui.getCore().getModel("attachDisruption"),    "attachDisruption");


		return this.oView;
	} else {
		
		return airbus.mes.disruptions.attachments.oView;
	}

};

"use strict";
jQuery.sap.require("airbus.mes.disruptionattachments.Formatter");
jQuery.sap.require("airbus.mes.disruptionattachments.ModelManager");


jQuery.sap.declare("airbus.mes.disruptionattachments.Component");

sap.ui.core.UIComponent.extend("airbus.mes.disruptionattachments.Component", {
	metadata : {
		properties : {},
	}
});

airbus.mes.disruptionattachments.Component.prototype.createContent = function() {


	if (airbus.mes.disruptionattachments.oView === undefined) {
		
        // Initialize ModelManager and load needed file
        airbus.mes.disruptionattachments.ModelManager.init(sap.ui.getCore());
        
		// View on XML
		this.oView = sap.ui.view({
			id : "DisruptionAttachmentView",
			viewName : "airbus.mes.disruptionattachments.disruptionAttachment",
			type : "XML",
			height:"auto"
		})
		airbus.mes.disruptionattachments.oView = this.oView;

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/disruptionattachments/i18n/i18n.properties",
	     });
		
		this.oView.setModel(i18nModel, "i18nModel");		
		this.oView.setModel(sap.ui.getCore().getModel("attachDisruption"),    "attachDisruption");


		return this.oView;
	} else {
		
		return airbus.mes.disruptionattachments.oView;
	}

};

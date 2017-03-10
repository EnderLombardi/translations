"use strict";

jQuery.sap.require("airbus.mes.missingParts.util.ModelManager");
jQuery.sap.require("airbus.mes.missingParts.util.Formatter");
jQuery.sap.declare("airbus.mes.missingParts.Component");

sap.ui.core.UIComponent.extend("airbus.mes.missingParts.Component", {
	metadata: {
		properties: {},
	}
});

airbus.mes.missingParts.Component.prototype.createContent = function () {
	if (airbus.mes.missingParts.oView === undefined) {

		// View on XML
		this.oView = sap.ui.view({
			id: "missingPartsView",
			viewName: "airbus.mes.missingParts.view.missingParts",
			type: "XML"
		})

		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleName: "airbus.mes.missingParts.i18n.i18n"
		});

		this.oView.setModel(i18nModel, "i18nmissingPartsModel");
		// Set instant display for busy indicator
		this.oView.setBusyIndicatorDelay(0);

		airbus.mes.missingParts.component = this;
		airbus.mes.missingParts.oView = this.oView;
		//Bind directly on the view avoid to set in the model in the core
		airbus.mes.missingParts.util.ModelManager.init(airbus.mes.missingParts.oView);
		airbus.mes.missingParts.oView.setModel(sap.ui.getCore().getModel("getMissingParts"),"getMissingParts");
		return this.oView;
	} else {
		return airbus.mes.missingParts.oView;
	}

};
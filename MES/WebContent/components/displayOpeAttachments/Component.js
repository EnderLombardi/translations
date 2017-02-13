"use strict";

jQuery.sap.registerModulePath("airbus.mes.displayOpeAttachments", "../components/displayOpeAttachments");

jQuery.sap.require("airbus.mes.displayOpeAttachments.util.ModelManager");
jQuery.sap.require("airbus.mes.displayOpeAttachments.util.Formatter");
jQuery.sap.require("airbus.mes.settings.AppConfManager");

jQuery.sap.declare("airbus.mes.displayOpeAttachments.Component");

sap.ui.core.UIComponent.extend("airbus.mes.displayOpeAttachments.Component", {
	metadata: {
		properties: {
			sSet : undefined,
			phStation: undefined
		},
	}
});

airbus.mes.displayOpeAttachments.Component.prototype.createContent = function () {

	//Set current work Order and operation
	airbus.mes.displayOpeAttachments.productionOrder = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no;
	airbus.mes.displayOpeAttachments.operation = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_no;

	if (airbus.mes.displayOpeAttachments.oView === undefined) {

		// View on XML
		this.oView = sap.ui.view({
			id: "displayOpeAttachmentsView",
			viewName: "airbus.mes.displayOpeAttachments.view.displayOpeAttachments",
			type: "XML"
		})

		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleName: "airbus.mes.displayOpeAttachments.i18n.i18n"
		});

		this.oView.setModel(i18nModel, "i18nDisplayOpeAttachmentsModel");
		
		// Set instant display for busy indicator
		this.oView.setBusyIndicatorDelay(0);

		airbus.mes.displayOpeAttachments.component = this;
		airbus.mes.displayOpeAttachments.oView = this.oView;
		//Bind directly on the view avoid to set in the model in the core
		airbus.mes.displayOpeAttachments.util.ModelManager.init(airbus.mes.displayOpeAttachments.oView);
		return this.oView;
	} else {
		return airbus.mes.displayOpeAttachments.oView;
	}

};
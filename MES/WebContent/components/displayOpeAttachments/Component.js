"use strict";

jQuery.sap.registerModulePath("airbus.mes.displayOpeAttachments", "../components/displayOpeAttachments");
jQuery.sap.require("airbus.mes.displayOpeAttachments.util.ModelManager");

jQuery.sap.declare("airbus.mes.displayOpeAttachments.Component");

sap.ui.core.UIComponent.extend("airbus.mes.displayOpeAttachments.Component", {
	metadata: {
		properties: {},
	}
});

airbus.mes.displayOpeAttachments.Component.prototype.createContent = function () {

	//Set current work Order and operation
    airbus.mes.displayOpeAttachments.productionOrder = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no;
    airbus.mes.displayOpeAttachments.operation = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_no;

	if (airbus.mes.displayOpeAttachments.oView === undefined) {

		// Initialize ModelManager and load needed file
		airbus.mes.displayOpeAttachments.util.ModelManager.init(sap.ui.getCore());

		// View on XML
		this.oView = sap.ui.view({
			id: "displayOpeAttachmentsView",
			viewName: "airbus.mes.displayOpeAttachments.view.displayOpeAttachments",
			type: "XML",
			height: "auto"
		})
		airbus.mes.displayOpeAttachments.oView = this.oView;

		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleName: "airbus.mes.displayOpeAttachments.i18n.i18n"
		});

		this.oView.setModel(i18nModel, "i18nDisplayOpeAttachmentsModel");

		return this.oView;
	} else {
		return airbus.mes.displayOpeAttachments.oView;
	}

};

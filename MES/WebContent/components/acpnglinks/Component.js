"use strict";

jQuery.sap.registerModulePath("airbus.mes.acpnglinks", "../components/acpnglinks");
//jQuery.sap.require("airbus.mes.acpnglinks.util.Formatter");
jQuery.sap.require("airbus.mes.acpnglinks.model.ModelManager");
jQuery.sap.declare("airbus.mes.acpnglinks.Component");

sap.ui.core.UIComponent.extend("airbus.mes.acpnglinks.Component", {
	metadata : {
		properties : { },
	}
});

airbus.mes.acpnglinks.Component.prototype.createContent = function() {

//	Set current work Order and operation
//    airbus.mes.acpnglinks.workOrder = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no;
//    airbus.mes.acpnglinks.operation = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_no;

	if (airbus.mes.acpnglinks.oView === undefined) {
		
        // Initialize ModelManager and load needed file
        airbus.mes.acpnglinks.util.ModelManager.init(sap.ui.getCore());
        
		// View on XML
		this.oView = sap.ui.view({
			id : "acpnglinksView",
			viewName : "airbus.mes.acpnglinks.view.acpnglinks",
			type : "XML",
			height:"auto"
		})
		airbus.mes.acpnglinks.oView = this.oView;

		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleName : "airbus.mes.acpnglinks.i18n.i18n"
	     });
		
		this.oView.setModel(i18nModel, "i18nacpnglinksModel");		
//		this.oView.setModel(sap.ui.getCore().getModel("attachDisruption"),    "attachDisruption");

		return this.oView;
	} else {
		
		return airbus.mes.acpnglinks.oView;
	}

};

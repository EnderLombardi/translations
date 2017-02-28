"use strict";

jQuery.sap.registerModulePath("airbus.mes.userConfirmation", "../components/userConfirmation");
//jQuery.sap.require("airbus.mes.userConfirmation.util.ModelManager");
jQuery.sap.require("airbus.mes.userConfirmation.util.Formatter");
jQuery.sap.declare("airbus.mes.userConfirmation.Component");

sap.ui.core.UIComponent.extend("airbus.mes.userConfirmation.Component", {
	metadata : {
		properties : { 
			site : undefined,
			phStation : undefined,
			workOrder : undefined,
			operation : undefined,
			sSet      : undefined
		},
	}
});


airbus.mes.userConfirmation.Component.prototype.init = function () {
    // call the init function of the parent
	sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
};


airbus.mes.userConfirmation.Component.prototype.createContent = function() {

	if (airbus.mes.userConfirmation.oView === undefined) {
		
		// View on XML
		this.oView = sap.ui.view({
			id : "userConfirmation",
			viewName : "airbus.mes.userConfirmation.view.userConfirmation",
			type : "XML",
			height:"100%"
		})
		airbus.mes.jigtools.oView = this.oView;

		var i18nModel = new sap.ui.model.resource.ResourceModel({ bundleName : "airbus.mes.jigtools.i18n.i18n" });
		this.oView.setModel(i18nModel, "i18nuserConfirmationModel");		

        // Initialize ModelManager and load needed file
//        airbus.mes.userConfirmation.util.ModelManager.init(sap.ui.getCore());		
		
		return this.oView;
		
	} else {
		
		return airbus.mes.userConfirmation.oView;
		
	}
};

"use strict";

jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.base.Event");
jQuery.sap.require("airbus.mes.settings.ModelManager");

// Declare the current Component
jQuery.sap.declare("airbus.mes.settings.Component");

// Extend current Component
sap.ui.core.UIComponent.extend("airbus.mes.settings.Component", {
	manifestUrl : "Component.json",
	metadata : {
		properties : {}
	},
});

// override the createContent function to return user interface
airbus.mes.settings.Component.prototype.createContent = function() {

	airbus.mes.settings.ModelManager.init(this);

	this.oView = sap.ui.view({
		id : "View1",
		viewName : "airbus.mes.settings.FilterPlantData",
		type : "XML",
	})

	return this.oView;
}
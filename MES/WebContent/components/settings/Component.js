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

		properties : {
			textButtonTo : "string",
			buttonAction : "string"
		},
		includes : [ "/MES/components/settings/css/SettingScreen.css" ]
	// array of css and/or javascript files that should be used in the component

	}

});

// override the createContent function to return user interface
airbus.mes.settings.Component.prototype.createContent = function() {

	if (airbus.mes.settings.oView === undefined) {
		airbus.mes.settings.ModelManager.init(this);

		this.oView = sap.ui.view({
			id : "View1",
			viewName : "airbus.mes.settings.FilterPlantData",
			type : "XML",
		})

		airbus.mes.settings.oView = this.oView;

		return this.oView;

	}
};

// override the setTextButtonTo function to return user interface
airbus.mes.settings.Component.prototype.setTextButtonTo = function(sText) {
	this.oView.byId("btn1").setText(sText);
	this.setProperty("textButtonTo", sText);
	return this;
};

// override the setButtonAction function to return user interface
airbus.mes.settings.Component.prototype.buttonAction = function(sText) {
	this.setProperty("buttonAction", sText);
	return this;
};

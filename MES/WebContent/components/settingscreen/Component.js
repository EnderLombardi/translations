jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.base.Event");

// Declare the current Component
jQuery.sap.declare("airbus.mes.settingscreen.Component");

// Extend current Component
sap.ui.core.UIComponent.extend("airbus.mes.settingscreen.Component", {
	manifestUrl : "Component.json",
	metadata : {
		properties : {
		/*
		 * idButton : "string", textButton : "string"
		 */
		}
	}
});

// override the createContent function to return user interface
airbus.mes.settingscreen.Component.prototype.createContent = function() {
	this.oView = sap.ui.view({
		id : "View1",
		viewName : "airbus.mes.settingscreen.FilterPlantData",
		type : "XML",
	})
	return this.oView;
}
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.base.Event");

// Declare the current Component
jQuery.sap.declare("SettingScreenComponent.Component");

// Extend current Component
sap.ui.core.UIComponent.extend("SettingScreenComponent.Component", {
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
SettingScreenComponent.Component.prototype.createContent = function() {
	this.oView = sap.ui.view({
		id : "View1",
		viewName : "SettingScreen.FilterPlantData",
		type : "XML",
	})
	return this.oView;
}
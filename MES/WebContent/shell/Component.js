jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.registerModulePath("airbus.mes.settings","/MES/components/settings");

jQuery.sap.declare("airbus.mes.shell.Component");

sap.ui.core.UIComponent.extend("airbus.mes.shell.Component", {
	
	metadata : {
		properties : {},
		includes : [ "css/shell.css" ] //array of css and/or javascript files that should be used in the component  

	},
	//manifestUrl : "component.json",
	oView:undefined,
});

airbus.mes.shell.Component.prototype.createContent = function() {
	
	//	View on XML
	if (airbus.mes.shell.oView === undefined) {

		this.oView = sap.ui.view({
			id : "globalNavView",
			viewName : "airbus.mes.shell.globalNavigation",
			type : "XML",
			height:"100%"
			
		}).addStyleClass("absoultePosition");

		airbus.mes.shell.oView = this.oView;
		return this.oView;
	}

};


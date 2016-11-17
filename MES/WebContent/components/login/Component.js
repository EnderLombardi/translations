"use strict";

jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.model.resource.ResourceModel");

jQuery.sap.declare("airbus.mes.login.Component");

sap.ui.core.UIComponent.extend("airbus.mes.login.Component", {

metadata : {
//		manifest: "json",
		properties : {},
		includes : [ "../homepage/css/margin.css" ] //array of css and/or javascript files that should be used in the component  
	},
	oView:undefined,
});

airbus.mes.login.Component.prototype.createContent = function() {	
	//	View on XML
	if (airbus.mes.login.oView === undefined) {
		this.oView = sap.ui.view({
			id : "login",
			viewName : "airbus.mes.login.login",
			type : "XML",
			height:"100%"	
		}).addStyleClass("absolutePosition");
		airbus.mes.login.oView = this.oView;
	}
	return this.oView;
};
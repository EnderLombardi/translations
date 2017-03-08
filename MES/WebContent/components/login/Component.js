"use strict";

jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.model.resource.ResourceModel");

jQuery.sap.declare("airbus.mes.login.Component");

sap.ui.core.UIComponent.extend("airbus.mes.login.Component", {

metadata : {
		properties : {}
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
		});
		airbus.mes.login.oView = this.oView;
		this.oView.setModel(sap.ui.getCore().getModel("ResourceUrl"), "ResourceUrl");
	}
	return this.oView;
};
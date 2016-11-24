"use strict";
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.worktracker.util.Formatter");
jQuery.sap.require("airbus.mes.worktracker.util.Functions");
jQuery.sap.require("airbus.mes.worktracker.util.ModelManager");
jQuery.sap.require("airbus.mes.worktracker.custom.ClickText");
jQuery.sap.require("airbus.mes.worktracker.custom.CustomSideNavigation");



jQuery.sap.declare("airbus.mes.worktracker.Component");

sap.ui.core.UIComponent.extend("airbus.mes.worktracker.Component", {
	metadata : {
		properties : {},
		includes : [ "./css/workTracker.css", "./css/sideNavigation.css" ]

	}

});

airbus.mes.worktracker.Component.prototype.createContent = function() {

	if (airbus.mes.worktracker.oView === undefined) {
//		Initialization
		airbus.mes.worktracker.util.ModelManager.init(sap.ui.getCore());
		
		// View on XML
		this.oView = sap.ui.view({
			id : "workTrackerView",
			viewName : "airbus.mes.worktracker.views.home",
			type : "XML",
		})
		
		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/worktracker/i18n/i18n.properties",
	     });
		this.oView.setModel(i18nModel, "i18n");

		this.oView.setModel(sap.ui.getCore().getModel("currentOperatorModel"), "currentOperatorModel");
		this.oView.setModel(sap.ui.getCore().getModel("userOperationsModel"), "userOperationsModel");
		this.oView.setModel(sap.ui.getCore().getModel("UserListModel"), "UserListModel");
		this.oView.setModel(sap.ui.getCore().getModel("reasonCodeModel"), "reasonCodeModel");
		
		airbus.mes.worktracker.oView = this.oView;
		return this.oView;
	} else {
		return airbus.mes.worktracker.oView;
	}
};

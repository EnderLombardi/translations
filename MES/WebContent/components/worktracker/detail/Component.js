jQuery.sap.require("sap.ui.core.UIComponent");

jQuery.sap.declare("airbus.mes.worktracker.detail.Component");

sap.ui.core.UIComponent.extend("airbus.mes.worktracker.detail.Component", {
	metadata : {
		properties : {},
		includes : [ ]

	}

});

airbus.mes.worktracker.detail.Component.prototype.createContent = function() {

	if (airbus.mes.worktracker.detail.oView === undefined) {
		
		// View on XML
		this.oView = sap.ui.view({
			id : "workTrackerOpDetailView",
			viewName : "airbus.mes.worktracker.views.operationDetails",
			type : "XML",
		})
		
		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/worktracker/i18n/i18n.properties",
	    });
		this.oView.setModel(i18nModel, "i18n");

		/*this.oView.setModel(sap.ui.getCore().getModel("currentOperatorModel"), "currentOperatorModel");
		this.oView.setModel(sap.ui.getCore().getModel("userOperationsModel"), "userOperationsModel");
		this.oView.setModel(sap.ui.getCore().getModel("UserListModel"), "UserListModel");
		this.oView.setModel(sap.ui.getCore().getModel("reasonCodeModel"), "reasonCodeModel");*/
		
		airbus.mes.worktracker.detail.oView = this.oView;
		return this.oView;
	}
};

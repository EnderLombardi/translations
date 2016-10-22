jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.resourcepool.util.ModelManager");
jQuery.sap.require("airbus.mes.resourcepool.util.Formatter");

sap.ui.core.UIComponent.extend("airbus.mes.resourcepool.Component", {
	metadata : {
		properties : {},
		includes : [ "./css/page.css" ]

	},
});

airbus.mes.resourcepool.Component.prototype.createContent = function() {
	
	if (airbus.mes.resourcepool.oView === undefined) {
		// Initialization
		airbus.mes.resourcepool.util.ModelManager.init(sap.ui.getCore());
		
		
		// View on XML
		this.oView = sap.ui.view({
			id : "resourcePool",
			viewName : "airbus.mes.resourcepool.views.Main",
			type : "XML",
			height : "100%"

		}).addStyleClass("absolutePosition");
		airbus.mes.resourcepool.oView = this.oView;

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/resourcepool/i18n/i18n.properties",
	     });
		
		// Local Model
		this.oView.setModel(i18nModel, "i18nModel");
		this.oView.setModel(sap.ui.getCore().getModel("groupModel"), "groupModel");

		
		
		return this.oView;

	}

};


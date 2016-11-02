jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.registerModulePath("airbus.mes.disruptions", "../components/disruptions");
//jQuery.sap.require("airbus.mes.disruptions.util.Formatter");
jQuery.sap.require("airbus.mes.disruptions.ModelManager");

jQuery.sap.declare("airbus.mes.operationdetail.createDisruption.Component");

sap.ui.core.UIComponent.extend("airbus.mes.operationdetail.createDisruption.Component", {
	metadata : {
		properties : {},
		includes : [ "../../disruptions/css/createDisruption.css" ]
	// array of css and/or javascript files that should be used in the component

	}

});

airbus.mes.operationdetail.createDisruption.Component.prototype.createContent = function() {
	
	if (airbus.mes.operationdetail.createDisruption.oView === undefined) {
//		Initialization
		airbus.mes.disruptions.ModelManager.init(sap.ui.getCore());
		
		// View on XML
		this.oView = sap.ui.view({
			id : "createDisruptionView",
			viewName : "airbus.mes.disruptions.CreateDisruption",
			type : "XML",
			height:"auto"
		})

		var i18n = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/disruptions/i18n/i18n.properties"
	    });
		this.oView.setModel(i18n, "i18n");	
		airbus.mes.operationdetail.createDisruption.oView = this.oView		
		
		
		//Model for custom data of create disruption
		this.oView.setModel(sap.ui.getCore().getModel("disruptionCustomData"),"disruptionCustomData");
		
		return this.oView;
		
	}
};

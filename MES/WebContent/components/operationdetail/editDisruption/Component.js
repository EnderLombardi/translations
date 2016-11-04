jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.registerModulePath("airbus.mes.disruptions", "../components/disruptions");
jQuery.sap.require("airbus.mes.disruptions.Formatter");
jQuery.sap.require("airbus.mes.disruptions.ModelManager");

jQuery.sap.declare("airbus.mes.operationdetail.editDisruption.Component");

sap.ui.core.UIComponent.extend("airbus.mes.operationdetail.editDisruption.Component", {
	metadata : {
		properties : {},
		includes : [ "../../disruptions/css/createDisruption.css" ]
	// array of css and/or javascript files that should be used in the component

	}

});

airbus.mes.operationdetail.editDisruption.Component.prototype.createContent = function() {
	
	if (airbus.mes.operationdetail.editDisruption.oView === undefined) {
//		Initialization
		airbus.mes.disruptions.ModelManager.init(sap.ui.getCore());
		
		// View on XML
		this.oView = sap.ui.view({
			id : "editDisruptionView",
			viewName : "airbus.mes.disruptions.EditDisruption",
			type : "XML",
			height:"auto"
		})

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/disruptions/i18n/i18n.properties"
	    });
		this.oView.setModel(i18nModel, "i18nModel");	
		airbus.mes.operationdetail.editDisruption.oView = this.oView		
		
		
		//Model for custom data of edit disruption
		this.oView.setModel(sap.ui.getCore().getModel("disruptionCustomData"),"disruptionCustomData");
		
		return this.oView;
		
	}
};

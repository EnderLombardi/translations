jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.registerModulePath("airbus.mes.disruptions", "../components/disruptions");
//jQuery.sap.require("airbus.mes.disruptions.util.Formatter");
//jQuery.sap.require("airbus.mes.disruptions.ModelManager");

jQuery.sap.declare("airbus.mes.operationdetail.viewDisruption.Component");

sap.ui.core.UIComponent.extend("airbus.mes.operationdetail.viewDisruption.Component", {
	metadata : {
		properties : {},
		includes : [ "../../disruptions/css/viewDisruption.css" ]
	// array of css and/or javascript files that should be used in the component

	}

});

airbus.mes.operationdetail.viewDisruption.Component.prototype.createContent = function() {
	
	if (airbus.mes.operationdetail.viewDisruption.oView === undefined) {
//		Initialization
		//airbus.mes.disruptions.ModelManager.init(sap.ui.getCore());
		
		// View on XML
		this.oView = sap.ui.view({
			id : "ViewDisruptionView",
			viewName : "airbus.mes.disruptions.ViewDisruption",
			type : "XML",
			height:"100%"
		})

		var i18n = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/disruptions/i18n/i18n.properties"
	    });
		this.oView.setModel(i18n, "i18n");	
		airbus.mes.operationdetail.viewDisruption.oView = this.oView		
		
		
		/*//Model for disruptions list data in table
		this.oView.setModel(sap.ui.getCore().getModel("disruptionsTrackerModel"),"disruptionsTrackerModel");
		
		//Model for disruptions filter data in ComboBox
		this.oView.setModel(sap.ui.getCore().getModel("disruptionsFilterData"), "disruptionsFilterData");
		
		//Model for disruptions order data in ComboBox
		this.oView.setModel(sap.ui.getCore().getModel("disruptionsOrderData"), "disruptionsOrderData");*/
		
		
		return this.oView;
		
	}
};

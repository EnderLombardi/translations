jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.registerModulePath("airbus.mes.disruptions", "../components/disruptions");
//jQuery.sap.require("airbus.mes.disruptions.util.Formatter");
jQuery.sap.require("airbus.mes.disruptions.ModelManager");
jQuery.sap.includeStyleSheet("../components/operationdetail/css/popup_oprtrDetail.css");

jQuery.sap.declare("airbus.mes.disruptiontracker.detail.Component");



sap.ui.core.UIComponent.extend("airbus.mes.disruptiontracker.detail.Component", {
	metadata : {
		properties : {},
		includes : [ "../../disruptions/css/viewDisruption.css" ]
	// array of css and/or javascript files that should be used in the component

	}

});

airbus.mes.disruptiontracker.detail.Component.prototype.createContent = function() {
	
	if (airbus.mes.disruptiontracker.detail.oView === undefined) {
//		Initialization
		airbus.mes.disruptions.ModelManager.init(sap.ui.getCore());
		
		// View on XML
		this.oView = sap.ui.view({
			id : "disruptionDetailView",
			viewName : "airbus.mes.disruptions.ViewDisruption",
			type : "XML",
			height:"100%"
		})

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/disruptions/i18n/i18n.properties"
	    });
		this.oView.setModel(i18nModel, "i18nModel");	
		airbus.mes.disruptiontracker.detail.oView = this.oView		
		
		
		/*//Model for disruptions list data in table
		this.oView.setModel(sap.ui.getCore().getModel("disruptionsTrackerModel"),"disruptionsTrackerModel");
		
		//Model for disruptions filter data in ComboBox
		this.oView.setModel(sap.ui.getCore().getModel("disruptionsFilterData"), "disruptionsFilterData");
		
		//Model for disruptions order data in ComboBox
		this.oView.setModel(sap.ui.getCore().getModel("disruptionsOrderData"), "disruptionsOrderData");*/
		
		
		return this.oView;
		
	}
};

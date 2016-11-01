jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.registerModulePath("airbus.mes.createDisruption", "../components/disruptions");
jQuery.sap.require("airbus.mes.createDisruption.util.Formatter");
jQuery.sap.require("airbus.mes.createDisruption.ModelManager");

jQuery.sap.declare("airbus.mes.stationtracker.createDisruption.Component");

sap.ui.core.UIComponent.extend("airbus.mes.stationtracker.createDisruption.Component", {
	metadata : {
		properties : {},
		includes : [ "../../disruptions/css/disruptions.css" ]
	// array of css and/or javascript files that should be used in the component

	}

});

airbus.mes.stationtracker.createDisruption.Component.prototype.createContent = function() {
	
	if (airbus.mes.stationtracker.createDisruption.oView === undefined) {
//		Initialization
		airbus.mes.disruptions.ModelManager.init(sap.ui.getCore());
		
		// View on XML
		this.oView = sap.ui.view({
			id : "createDisruptuionView",
			viewName : "airbus.mes.disruptions.CreateDisruption",
			type : "XML",
			height:"100%"
		})

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/disruptions/i18n/i18n.properties"
	     });
		this.oView.setModel(i18nModel, "disruptionsI18n");		
		airbus.mes.stationtracker.createDisruption.oView = this.oView		
		
		
		/*//Model for disruptions list data in table
		this.oView.setModel(sap.ui.getCore().getModel("disruptionsListData"),"disruptionsListData");
		
		//Model for disruptions filter data in ComboBox
		this.oView.setModel(sap.ui.getCore().getModel("disruptionsFilterData"), "disruptionsFilterData");
		
		//Model for disruptions order data in ComboBox
		this.oView.setModel(sap.ui.getCore().getModel("disruptionsOrderData"), "disruptionsOrderData");*/
		
		
		return this.oView;
		
	}
};

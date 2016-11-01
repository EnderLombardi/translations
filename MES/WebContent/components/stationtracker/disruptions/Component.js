jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.registerModulePath("airbus.mes.disruptiontracker", "../components/disruptiontracker");
jQuery.sap.require("airbus.mes.disruptiontracker.util.Formatter");
jQuery.sap.require("airbus.mes.disruptiontracker.ModelManager");

jQuery.sap.declare("airbus.mes.stationtracker.disruptions.Component");

sap.ui.core.UIComponent.extend("airbus.mes.stationtracker.disruptions.Component", {
	metadata : {
		properties : {},
		includes : [ "../../disruptiontracker/css/disruptiontracker.css" ]
	// array of css and/or javascript files that should be used in the component

	}

});

airbus.mes.stationtracker.disruptions.Component.prototype.createContent = function() {
	
	if (airbus.mes.stationtracker.disruptions.oView === undefined) {
//		Initialization
		airbus.mes.disruptiontracker.ModelManager.init(sap.ui.getCore());
		
		// View on XML
		this.oView = sap.ui.view({
			id : "stationTackerDisruptions",
			viewName : "airbus.mes.disruptiontracker.disruptions",
			type : "XML",
			height:"100%"
		})

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/disruptiontracker/i18n/i18n.properties"
	     });
		this.oView.setModel(i18nModel, "disruptiontrackerI18n");		
		airbus.mes.stationtracker.disruptions.oView = this.oView		
		
		
		//Model for disruptions list data in table
		this.oView.setModel(sap.ui.getCore().getModel("disruptionsListData"),"disruptionsListData");
		
		//Model for disruptions filter data in ComboBox
		this.oView.setModel(sap.ui.getCore().getModel("disruptionsFilterData"), "disruptionsFilterData");
		
		//Model for disruptions order data in ComboBox
		this.oView.setModel(sap.ui.getCore().getModel("disruptionsOrderData"), "disruptionsOrderData");
		
		
		return this.oView;
		
	}
};

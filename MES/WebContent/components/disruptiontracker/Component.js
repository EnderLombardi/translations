jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.disruptiontracker.util.Formatter");
jQuery.sap.require("airbus.mes.disruptiontracker.ModelManager");

jQuery.sap.registerModulePath("airbus.mes.disruptions", "../components/disruptions");
jQuery.sap.require("airbus.mes.disruptions.ModelManager");


jQuery.sap.declare("airbus.mes.disruptiontracker.Component");

sap.ui.core.UIComponent.extend("airbus.mes.disruptiontracker.Component", {
	metadata : {
		properties : {},
		includes : [ "./css/disruptiontracker.css" ]
	// array of css and/or javascript files that should be used in the component

	}

});

airbus.mes.disruptiontracker.Component.prototype.createContent = function() {
	
	if (airbus.mes.disruptiontracker.oView === undefined) {
		//	Initialization
		airbus.mes.disruptiontracker.ModelManager.init(sap.ui.getCore());
		airbus.mes.disruptions.ModelManager.init(sap.ui.getCore());
		
		// View on XML
		this.oView = sap.ui.view({
			id : "disruptiontrackerView",
			viewName : "airbus.mes.disruptiontracker.disruptions",
			type : "XML",
		})

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/disruptiontracker/i18n/i18n.properties"
	     });
		this.oView.setModel(i18nModel, "disruptiontrackerI18n");		
		airbus.mes.disruptiontracker.oView = this.oView		
		
		
		//Model for disruptions list data in table
		this.oView.setModel(sap.ui.getCore().getModel("disruptionsTrackerModel"),"disruptionsTrackerModel");
		
		//Model Station Names
		this.oView.setModel(sap.ui.getCore().getModel("plantModel"), "plantModel");
		
		
		return this.oView;
		
	}
};

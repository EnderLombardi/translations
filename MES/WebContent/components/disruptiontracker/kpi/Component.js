jQuery.sap.require("sap.ui.core.UIComponent");
//jQuery.sap.require("airbus.mes.disruptiontracker.kpi.util.Formatter");
jQuery.sap.require("airbus.mes.disruptiontracker.kpi.ModelManager");

jQuery.sap.declare("airbus.mes.disruptiontracker.kpi.Component");

sap.ui.core.UIComponent.extend("airbus.mes.disruptiontracker.kpi.Component", {
	metadata : {
		properties : {},
		includes : [ "./css/disruptionKPI.css" ]
	// array of css and/or javascript files that should be used in the component

	}

});

airbus.mes.disruptiontracker.kpi.Component.prototype.createContent = function() {
	
	if (airbus.mes.disruptiontracker.kpi.oView === undefined) {
//		Initialization
		airbus.mes.disruptiontracker.kpi.ModelManager.init(sap.ui.getCore());
		
		// View on XML
		this.oView = sap.ui.view({
			id : "disruptionKPIView",
			viewName : "airbus.mes.disruptiontracker.kpi.disruptionKPIChart",
			type : "XML",
		})

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/disruptiontracker/kpi/i18n/i18n.properties"
	     });
		this.oView.setModel(i18nModel, "i18n"); 		
		airbus.mes.disruptiontracker.kpi.oView = this.oView	
		
		
		//Model for disruptionKPI Attributes vs Time Lost Chart
		this.oView.setModel(sap.ui.getCore().getModel("TimeLostperAttribute"),"TimeLostperAttribute");
		
		
		
		return this.oView;
	}
};

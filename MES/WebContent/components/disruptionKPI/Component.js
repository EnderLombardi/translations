jQuery.sap.require("sap.ui.core.UIComponent");
//jQuery.sap.require("airbus.mes.disruptiontracker.util.Formatter");
//jQuery.sap.require("airbus.mes.disruptionKPI.ModelManager");

jQuery.sap.declare("airbus.mes.disruptionKPI.Component");

sap.ui.core.UIComponent.extend("airbus.mes.disruptionKPI.Component", {
	metadata : {
		properties : {},
		includes : [ "./css/disruptionKPI.css" ]
	// array of css and/or javascript files that should be used in the component

	}

});

airbus.mes.disruptionKPI.Component.prototype.createContent = function() {
	
	if (airbus.mes.disruptionKPI.oView === undefined) {
//		Initialization
//		airbus.mes.disruptionKPI.ModelManager.init(sap.ui.getCore());
		
		// View on XML
		this.oView = sap.ui.view({
			id : "disruptionKPIView",
			viewName : "airbus.mes.disruptionKPI.disruptionKPIChart",
			type : "XML",
		})

		/*var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/disruptiontracker/i18n/i18n.properties"
	     });
		this.oView.setModel(i18nModel, "disruptiontrackerI18n"); */		
		airbus.mes.disruptionKPI.oView = this.oView	
		
	/*	
		//Model for disruptionKPI Category vs Time Lost Chart
		this.oView.setModel(sap.ui.getCore().getModel("TimeLostperCategory"),"TimeLostperCategory");
		
		//Model for disruptionKPI Time Lost vs Reason Chart
		this.oView.setModel(sap.ui.getCore().getModel("TimeLostperReason"), "TimeLostperReason");
		
		//Model for disruptionKPI Time Lost vs Operation Chart
		this.oView.setModel(sap.ui.getCore().getModel("TimeLostperOperation"), "TimeLostperOperation");
		
		//Model for disruptionKPI Time Lost vs MSN Chart
		this.oView.setModel(sap.ui.getCore().getModel("TimeLostperMSN"), "TimeLostperMSN");
		*/
		return this.oView;
	}
};

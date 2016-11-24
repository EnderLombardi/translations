"use strict";
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.disruptions.ModelManager");
jQuery.sap.require("airbus.mes.disruptions.Formatter");

jQuery.sap.declare("airbus.mes.disruptions.Component");

sap.ui.core.UIComponent.extend("airbus.mes.disruptions.Component", {
	metadata : {
		properties : {},
		includes : [ "./css/viewDisruption.css", "./css/createDisruption.css" ]
	// array of css and/or javascript files that should be used in the component

	}

});

/**
 *
 *
 */
airbus.mes.disruptions.Component.prototype.createContent = function() {
	
	if (airbus.mes.disruptions.oView === undefined) {
//		Initialization
		airbus.mes.disruptions.ModelManager.init(sap.ui.getCore());
		
		this.oView = {};
		
		
		this.oView.viewDisruption = sap.ui.view({
			id : "ViewDisruptionView",
			viewName : "airbus.mes.disruptions.ViewDisruption",
			type : "XML",
			height:"100%"
		});
		
		this.oView.createDisruption = sap.ui.view({
			id : "createDisruptionView",
			viewName : "airbus.mes.disruptions.CreateDisruption",
			type : "XML",
			height:"100%"
		})

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/disruptions/i18n/i18n.properties"
	    });
		
		
		this.oView.viewDisruption.setModel(i18nModel, "i18nModel");
		this.oView.createDisruption.setModel(i18nModel, "i18nModel");
		
		airbus.mes.disruptions.oView = this.oView
		
		// Model for Disruptions details
		this.oView.viewDisruption.setModel(sap.ui.getCore().getModel("operationDisruptionsModel"),"operationDisruptionsModel");
		
		//Model for custom data of create disruption
		this.oView.createDisruption.setModel(sap.ui.getCore().getModel("disruptionCustomData"),"disruptionCustomData");
		
		//Model for custom data of edit disruption
		this.oView.createDisruption.setModel(sap.ui.getCore().getModel("DisruptionDetailModel"),"DisruptionDetailModel");
		
		//Model for Material List
		this.oView.createDisruption.setModel(sap.ui.getCore().getModel("MaterialListModel"),"MaterialListModel");
		
		//Model for JigTool List
		this.oView.createDisruption.setModel(sap.ui.getCore().getModel("JigtoolListModel"),"JigtoolListModel");
		
		return this.oView.viewDisruption;
		
	} else {
		return airbus.mes.disruptions.oView;
	}
};

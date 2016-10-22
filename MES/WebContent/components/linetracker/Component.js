"use strict";

jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.base.Event");
jQuery.sap.require("airbus.mes.linetracker.util.ModelManager");
jQuery.sap.require("airbus.mes.linetracker.util.Formatter");
jQuery.sap.require("airbus.mes.linetracker.util.RoleManager");
// Declare the current Component
jQuery.sap.declare("airbus.mes.linetracker.Component");

// Extend current Component
sap.ui.core.UIComponent.extend("airbus.mes.linetracker.Component", {
	//manifestUrl : "Component.json",
	metadata : {

		properties : {
//			textButtonTo : "string",
//			buttonAction : "string"
		},
		includes : [ "./css/customControl.css", "./css/bcrystal.css", "./css/chart.css", "./css/customcss.css", "./css/global.css", "./css/stationDetail.css"]
	// array of css and/or javascript files that should be used in the component

	}

});

// override the createContent function to return user interface
airbus.mes.linetracker.Component.prototype.createContent = function() {

	if (airbus.mes.linetracker.oView === undefined) {
		airbus.mes.linetracker.util.RoleManager.init(this);
		airbus.mes.linetracker.util.ModelManager.init(this);
		this.oView = sap.ui.view({
			id : "idMainView",
			viewName : "airbus.mes.linetracker.MainView",
			type : "XML",
		})

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/linetracker/i18n/messageBundle.properties",
//	        bundleLocale : "en" automatic defined by parameter sap-language
	     });
		
		this.oView.setModel(i18nModel, "messageBundle");		
//		this.oView.setModel(sap.ui.getCore().getModel("newStationModel"),	"newStationModel");
//		this.oView.setModel(sap.ui.getCore().getModel("newFactoryModel"),	"newFactoryModel");
//		this.oView.setModel(sap.ui.getCore().getModel("newStationModel"),	"newStationModel");
		airbus.mes.linetracker.oView = this.oView;
//		this.factoryView = sap.ui.view({
//			id : "idFactoryView",
//			viewName : "airbus.FactoryView",
//			type : sap.ui.core.mvc.ViewType.XML,
//			height : "98%",
//			width: "100%"
//		});  
		return this.oView;
		

	}
};





// override the setTextButtonTo function to return user interface
/*airbus.mes.settings.Component.prototype.setTextButtonTo = function(sText) {
	this.oView.byId("btn1").setText(sText);
	this.setProperty("textButtonTo", sText);
	airbus.mes.settings.textButtonTo = sText;
	return this;
};

// override the setButtonAction function to return user interface
airbus.mes.settings.Component.prototype.setButtonAction = function(sText) {
	this.setProperty("buttonAction", sText);
	airbus.mes.settings.buttonAction = sText;
	return this;
};*/

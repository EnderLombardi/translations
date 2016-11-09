"use strict";

jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.settings.util.Formatter");
jQuery.sap.require("airbus.mes.settings.GlobalFunction");
jQuery.sap.require("airbus.mes.settings.ModelManager");

jQuery.sap.declare("airbus.mes.settings.Component");

// Pointing out metadata manifest to the application
sap.ui.core.UIComponent.extend("airbus.mes.settings.Component", {

	metadata : {
		manifest : "json",
		properties : {
			textButtonTo : "string",
			buttonAction : "string"
		}
	},

	init : function() {

		// call the init function of the parent
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var oModel2 = sap.ui.getCore().getModel("site");

		oModel2.loadData(this.getMetadata().getManifestEntry("sap.app").dataSources["dataMock_site"].uri, null, false);

		this.oView.setModel(oModel2, "site");

		var oModel3 = new sap.ui.model.json.JSONModel();

		oModel3.loadData(this.getMetadata().getManifestEntry("sap.app").dataSources["dataMock_region"].uri, null,false);

		this.oView.setModel(oModel3, "region");
		//this.oView.setModel(oModel3, "region");

		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "../components/settings/i18n/i18n.properties",
		// bundleLocale : "en" automatic defined by
		// parameter sap-language
		});

		this.oView.setModel(i18nModel, "i18n");
		this.oView.setModel(sap.ui.getCore().getModel("siteModel"), "siteModel");
		this.oView.setModel(sap.ui.getCore().getModel("plantModel"), "plantModel");
		this.oView.setModel(sap.ui.getCore().getModel("program"), "program");
	
		airbus.mes.settings.oView = this.oView;

	},

});

// override the createContent function to return user interface
airbus.mes.settings.Component.prototype.createContent = function() {

	if (airbus.mes.settings.oView === undefined) {
		airbus.mes.settings.ModelManager.init(sap.ui.getCore());
		this.oView = sap.ui.view({
			id : "View1",
			viewName : "airbus.mes.settings.Settings",
			type : "XML",
		})
	
		return this.oView;

	}
};

// override the setTextButtonTo function to return user interface
airbus.mes.settings.Component.prototype.setTextButtonTo = function(sText) {
	this.oView.byId("Back").setText(sText);
	this.setProperty("textButtonTo", sText);
	airbus.mes.settings.textButtonTo = sText;
	return this;
};

// override the setButtonAction function to return user interface
airbus.mes.settings.Component.prototype.setButtonAction = function(sText) {
	this.setProperty("buttonAction", sText);
	airbus.mes.settings.buttonAction = sText;
	return this;
};
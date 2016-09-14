"use strict";

jQuery.sap.declare("airbus.mes.settings.ModelManager")

airbus.mes.settings.ModelManager = {
		
	site : undefined,
	core : undefined,
	urlModel : undefined,
	queryParams : jQuery.sap.getUriParameters(),
	
	init : function(core) {
		
		this.core = core;
		
		core.setModel(new sap.ui.model.json.JSONModel(), "plantModel");
		core.setModel(new sap.ui.model.json.JSONModel(), "siteModel");

		var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "local";
			break;
		case "wsapbpc01.ptx.fr.sopra":
			dest = "sopra";
			break;
		default:
			dest = "airbus";
			break;
		}

		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "/MES/components/settings/config/url_config.properties",
			bundleLocale : dest
		});
		
		airbus.mes.settings.ModelManager.loadSiteModel();

	},
	
	// ************************************************************************************
	getUrlSite : function() {
		var urlSite = this.urlModel.getProperty("urlsitemodel");
		return urlSite;
	},

	loadSiteModel : function() {
		var oViewModel = airbus.mes.settings.ModelManager.core.getModel("siteModel");
		oViewModel.loadData(airbus.mes.settings.ModelManager.getUrlSite(), null, false);
	},

	getUrlPlant : function() {
		var urlSite = this.urlModel.getProperty("urlplantmodel");
		urlSite = urlSite.replace("$site", airbus.mes.settings.ModelManager.site)
		return urlSite;
	},

	loadPlantModel : function() {
		var oViewModel = airbus.mes.settings.ModelManager.core.getModel("plantModel");
		oViewModel.loadData(airbus.mes.settings.ModelManager.getUrlPlant(), null, false);
	},

};
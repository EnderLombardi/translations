"use strict";

var ModelManager = {
	site : undefined,
	queryParams : jQuery.sap.getUriParameters(),
	core : undefined,
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
			bundleUrl : "/MES/components/settingscreen/config/url_config.properties",
			bundleLocale : dest
		});
		ModelManager.loadsiteModel();
		ModelManager.loadPlantModel();

	},
	// ************************************************************************************
	getUrlSite : function() {
		var urlSite = this.urlModel.getProperty("urlsitemodel");
		return urlSite;
	},

	loadsiteModel : function() {
		var oViewModel = this.core.getModel("siteModel");
		oViewModel.loadData(ModelManager.getUrlSite(), null, false);
	},

	getUrlPlant : function() {
		var urlSite = this.urlModel.getProperty("urlplantmodel");
		urlSite = urlSite.replace("$site", ModelManager.site)
		return urlSite;
	},

	loadPlantModel : function() {
		var oViewModel = this.core.getModel("plantModel");
		oViewModel.loadData(ModelManager.getUrlPlant(), null, false);
	},

};
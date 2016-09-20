"use strict";

jQuery.sap.declare("airbus.mes.settings.ModelManager")

airbus.mes.settings.ModelManager = {
	
	site : undefined,
	plant : undefined,
	program : undefined,
	line : undefined,
	station : undefined,
	msn : undefined,
	core : undefined,
	urlModel : undefined,
	user:"ng123",
	current_flag:"X",
	queryParams : jQuery.sap.getUriParameters(),
	
	i18nModel: undefined,
	
	init : function(core) {
		
		this.core = core;
		
		core.setModel(new sap.ui.model.json.JSONModel(), "plantModel");
		core.setModel(new sap.ui.model.json.JSONModel(), "siteModel");
		core.setModel(new sap.ui.model.json.JSONModel(), "langModel");
		core.setModel(new sap.ui.model.json.JSONModel(),"userSettingModel");

		var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "sopra";
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
//        airbus.mes.settings.ModelManager.loadLangModel();
        airbus.mes.settings.ModelManager.loadUserSettingsModel();
        
//  ***************************Define i18nModel**************************************
		this.i18nModel = new sap.ui.model.resource.ResourceModel({
		bundleUrl : "i18n/messageBundle.properties",
		bundleLocale : core.getConfiguration().getLanguage()
	});
	core.setModel(this.i18nModel, "messageBundle");

	},
	
	// ************************************************************************************
	getUrlSite : function() {
		var urlSite = this.urlModel.getProperty("urlsitemodel");
		return urlSite;
	},

	loadSiteModel : function() {
		var oViewModel = this.core.getModel("siteModel");
		oViewModel.loadData(airbus.mes.settings.ModelManager.getUrlSite(), null, false);
	},
	// ********************************************************************************
	getUrlPlant : function() {
		var urlSite = this.urlModel.getProperty("urlplantmodel");
		urlSite = urlSite.replace("$site", airbus.mes.settings.ModelManager.site)
		return urlSite;
	},

	loadPlantModel : function() {
		var oViewModel = airbus.mes.settings.ModelManager.core.getModel("plantModel");
		oViewModel.loadData(airbus.mes.settings.ModelManager.getUrlPlant(), null, false);
	},
	// ********************************************************************************
	getUrlLang:function(){
		var langUrl = this.urlModel.getProperty("urlLanguage");
		return langUrl;
	},
	loadLangModel:function(){
		var oLangModel = this.core.getModel("langModel");
		oLangModel.loadData(airbus.mes.settings.ModelManager.getUrlLang(),null,false);
	},
	// ********************************************************************************
	getUrlUserSetting:function(){
		var urlUserSetting = this.urlModel.getProperty("urlUserSettings");
		urlUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlUserSetting, "$user", airbus.mes.settings.ModelManager.user);
		return urlUserSetting;
		
	},
	loadUserSettingsModel:function(){
		var oUserSettingModel = this.core.getModel("userSettingModel");
		oUserSettingModel.loadData(airbus.mes.settings.ModelManager.getUrlUserSetting(),null,false);
	},
	// ********************************************************************************
	 messageShow : function(text) {
	        sap.m.MessageToast
	        .show(
	        		text,
	                      {
	                             duration : 3000,
	                             width : "25em",
	                             my : "center center",
	                             at : "center center",
	                             of : window,
	                             offset : "0 0",
	                             collision : "fit fit",
	                             onClose : null,
	                             autoClose : true,
	                             animationTimingFunction : "ease",
	                             animationDuration : 1000,
	                             closeOnBrowserNavigation : true
	                      });
	               
	  },
	  // ************************************************************************************
	  getUrlSaveUserSetting:function(){
		  var urlSaveUserSetting = this.urlModel.getProperty("urlSaveUserSetting");
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$user", airbus.mes.settings.ModelManager.user);
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$plant", airbus.mes.settings.ModelManager.plant);
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$program", airbus.mes.settings.ModelManager.program);
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$line", airbus.mes.settings.ModelManager.line);
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$station", airbus.mes.settings.ModelManager.station);
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$msn", airbus.mes.settings.ModelManager.msn);
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$current_flag", airbus.mes.settings.ModelManager.current_flag);
		  return urlSaveUserSetting;
	  },
	  replaceURI : function (sURI, sFrom, sTo) {
			return sURI.replace(sFrom, encodeURIComponent(sTo));
		}

};
//airbus.mes.settings.ModelManager.init(sap.ui.getCore());

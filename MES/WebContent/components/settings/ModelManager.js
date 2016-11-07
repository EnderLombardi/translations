"use strict";

jQuery.sap.declare("airbus.mes.settings.ModelManager")

airbus.mes.settings.ModelManager =  {
	
	site : undefined,
	//plant : undefined,
	program : undefined,
	line : undefined,
	station : undefined,
	msn : undefined,
	prodGroup : "%",
	taktStart : undefined,
	taktEnd : undefined,
	taktDuration : undefined,
	currentMsnSelected : true,
	currentMsnValue : "",
	core : undefined,
	urlModel : undefined,
	current_flag:"X",
	queryParams : jQuery.sap.getUriParameters(),
	
	i18nModel: undefined,
	
	init : function(core) {
		
		this.core = core;
		
		core.setModel(new sap.ui.model.json.JSONModel(), "plantModel");
		core.setModel(new sap.ui.model.json.JSONModel(), "siteModel");
		core.setModel(new sap.ui.model.json.JSONModel(), "program");
		core.setModel(new sap.ui.model.json.JSONModel(), "site");
		
		//core.getModel("plantModel").attachRequestCompleted( airbus.mes.settings.ModelManager.onPlantLoad );
//		core.setModel(new sap.ui.model.json.JSONModel(), "langModel");
//		core.setModel(new sap.ui.model.json.JSONModel(), "userSettingModel");

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
			bundleUrl : "../components/settings/config/url_config.properties",
			bundleLocale : dest
		});

		//Loading of model
		
		this.loadSiteModel();
		//this.loadPlantModel();
        this.loadUserSettingsModel();
        this.getProgram();
        
	},
	
	
	getProgram : function() {
		var urlSite = this.urlModel.getProperty("urlprogram");
		var oViewModel = this.core.getModel("program");
		oViewModel.loadData(urlSite, null, false);
		
	},
	
	onPlantLoad : function() {
		
		airbus.mes.settings.oView.getModel("program").refresh(true);
		
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
		var oViewModel = sap.ui.getCore().getModel("plantModel") ;
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
		//urlUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlUserSetting, "$user", airbus.mes.settings.ModelManager.user);
		return urlUserSetting;
		
	},
	loadUserSettingsModel:function(){
		var oUserSettingModel = sap.ui.getCore().getModel("userSettingModel");
		oUserSettingModel.loadData(airbus.mes.settings.ModelManager.getUrlUserSetting(),null,false);
		
		//Set Data
		oUserSettingModel = this.core.getModel("userSettingModel").getData();  
		this.site = oUserSettingModel.Rowsets.Rowset[0].Row[0].plant;
		this.station = oUserSettingModel.Rowsets.Rowset[0].Row[0].station;
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
		 // urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$user", airbus.mes.settings.ModelManager.user);
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$plant", airbus.mes.settings.ModelManager.site);
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$program", airbus.mes.settings.ModelManager.program);
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$line", airbus.mes.settings.ModelManager.line);
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$station", airbus.mes.settings.ModelManager.station);
		 
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$siteDesc", airbus.mes.settings.ModelManager.siteDesc);
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$lineDesc", airbus.mes.settings.ModelManager.lineDesc);
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$programDesc", airbus.mes.settings.ModelManager.programDesc);
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$stationDesc", airbus.mes.settings.ModelManager.stationDesc);
	
		  if ( airbus.mes.settings.ModelManager.currentMsnSelected  ) {
			  
			  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$msn", "");
					  
		  } else  {
			  
			  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$msn", airbus.mes.settings.ModelManager.msn);
		  
		  }
		  urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$current_flag", airbus.mes.settings.ModelManager.current_flag);
		  	  
		  jQuery.ajax({
				url : urlSaveUserSetting,
				error : function(xhr, status, error) {
					
				},
				success : function(result, status, xhr) {
					
				//	airbus.mes.settings.ModelManager.loadUserSettingsModel()
					airbus.mes.shell.oView.byId("labelMSN").setText(airbus.mes.settings.ModelManager.msn);
					
				}
			});
		  
	  },
	  replaceURI : function (sURI, sFrom, sTo) {
			return sURI.replace(sFrom, encodeURIComponent(sTo));
		}

};

"use strict";

jQuery.sap.declare("airbus.mes.settings.ModelManager")

airbus.mes.settings.ModelManager = {

	site : undefined,
	program : undefined,
	line : undefined,
	station : undefined,
	msn : undefined,
	prodGroup : "%",
	taktStart : undefined,
	taktEnd : undefined,
	taktDuration : undefined,
	plantModelSaved : undefined,
	currentMsnSelected : false, //bBatch1 ? false : true
	currentMsnValue : "",
	core : undefined,
	urlModel : undefined,
	current_flag : "X",
	//queryParams : jQuery.sap.getUriParameters(),

	i18nModel : undefined,

	init : function(core) {

		this.core = core;
	
		airbus.mes.shell.ModelManager.createJsonModel(core,["plantModel","siteModel","program","site"]);

		core.getModel("userSettingModel").attachRequestCompleted(airbus.mes.settings.ModelManager.onUserSettingLoad);
		core.getModel("plantModel").attachRequestCompleted(airbus.mes.settings.ModelManager.onPLantModelLoad);

		// Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.settings.config.url_config");
		 

		// Loading of model

		this.loadSiteModel();
		this.getProgram();
		this.checkLanguage();

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
		oViewModel.loadData(airbus.mes.settings.ModelManager.getUrlSite(),
				null, false);
	},
	// ********************************************************************************
	getUrlPlant : function() {
		var urlSite = this.urlModel.getProperty("urlplantmodel");
		urlSite = urlSite.replace("$site",
				airbus.mes.settings.ModelManager.site)
		return urlSite;
	},

	loadPlantModel : function() {
		var oViewModel = sap.ui.getCore().getModel("plantModel");
		oViewModel.loadData(airbus.mes.settings.ModelManager.getUrlPlant(),
				null, false);
	},
	// ********************************************************************************
	getUrlLang : function() {
		var langUrl = this.urlModel.getProperty("urlLanguage");
		return langUrl;
	},

	loadLangModel : function() {
		var oLangModel = this.core.getModel("langModel");
		oLangModel.loadData(airbus.mes.settings.ModelManager.getUrlLang(),
				null, false);
	},
	// ********************************************************************************
	getUrlUserSetting : function() {
		var urlUserSetting = this.urlModel.getProperty("urlUserSettings");
		// urlUserSetting =
		// airbus.mes.settings.ModelManager.replaceURI(urlUserSetting, "$user",
		// airbus.mes.settings.ModelManager.user);
		return urlUserSetting;

	},
	
	loadUserSettingsModel : function() {
		var oUserSettingModel = sap.ui.getCore().getModel("userSettingModel");
		oUserSettingModel.loadData(airbus.mes.settings.ModelManager
				.getUrlUserSetting(), null, false);

	},
	
	onUserSettingLoad : function() {
		// Apply user settings.
		airbus.mes.settings.oView.getController().getUserSettings();
		airbus.mes.settings.AppConfManager.loadAppConfig();

	},

	// ********************************************************************************
	messageShow : function(text) {
		sap.m.MessageToast.show(text, {
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
	saveUserSetting : function(sLanguage) {
		var urlSaveUserSetting = this.urlModel
				.getProperty("urlSaveUserSetting");
		// urlSaveUserSetting =
		// airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting,
		// "$user", airbus.mes.settings.ModelManager.user);
		urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
				urlSaveUserSetting, "$langage", sLanguage);
		urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
				urlSaveUserSetting, "$plant",
				airbus.mes.settings.ModelManager.site);
		urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
				urlSaveUserSetting, "$program",
				airbus.mes.settings.ModelManager.program);
		urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
				urlSaveUserSetting, "$line",
				airbus.mes.settings.ModelManager.line);
		urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
				urlSaveUserSetting, "$station",
				airbus.mes.settings.ModelManager.station);
		urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
				urlSaveUserSetting, "$siteDesc",
				airbus.mes.settings.ModelManager.siteDesc);
		urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
				urlSaveUserSetting, "$lineDesc",
				airbus.mes.settings.ModelManager.lineDesc);
		urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
				urlSaveUserSetting, "$programDesc",
				airbus.mes.settings.ModelManager.programDesc);
		urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
				urlSaveUserSetting, "$stationDesc",
				airbus.mes.settings.ModelManager.stationDesc);
		urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
				urlSaveUserSetting, "$taktDuration",
				airbus.mes.settings.ModelManager.taktDuration);
		urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
				urlSaveUserSetting, "$taktStart",
				airbus.mes.settings.ModelManager.taktStart);
		urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
				urlSaveUserSetting, "$taktEnd",
				airbus.mes.settings.ModelManager.taktEnd);

		if (airbus.mes.settings.ModelManager.currentMsnSelected) {

			urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
					urlSaveUserSetting, "$msn", "");

		} else {

			urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
					urlSaveUserSetting, "$msn",
					airbus.mes.settings.ModelManager.msn);

		}
		urlSaveUserSetting = airbus.mes.settings.ModelManager.replaceURI(
				urlSaveUserSetting, "$current_flag",
				airbus.mes.settings.ModelManager.current_flag);

		jQuery.ajax({
			url : urlSaveUserSetting,
			async : false,
			error : function(xhr, status, error) {
			},
			success : function(result, status, xhr) {

			}
		});

	},
	replaceURI : function(sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},

	loadLanguage : function() {

		var urlUserSetting = this.urlModel.getProperty("urlUserSettings");

		var oUserSettingModel = new sap.ui.model.json.JSONModel();
		oUserSettingModel.loadData(urlUserSetting, null, false);

		return oUserSettingModel.getProperty("/Rowsets/Rowset/0/Row/0/language");

	},

	checkLanguage : function() {
		// Retrieve the language selector to define default language
		// corresponding to sap-language parameter
		var aItems = airbus.mes.shell.oView.byId("SelectLanguage").getItems();
		var sSapLanguage = sap.ui.getCore().getConfiguration().getLanguage()
				.slice(0, 2);
		// Retrieve connexion language
		var sSaveLanguage = airbus.mes.settings.ModelManager.loadLanguage();

		if (sSaveLanguage != undefined && sSaveLanguage != "---"
				&& sSaveLanguage != "" && sSaveLanguage != null) {

			airbus.mes.shell.oView.getController().updateUrlForLanguage(
					sSaveLanguage);

		} else {

			airbus.mes.settings.ModelManager.saveUserSetting(sSapLanguage);
			airbus.mes.shell.oView.getController().updateUrlForLanguage(
					sSapLanguage);

		}
		
/* the listbox has to be compliant with the language selected */		
		if (sSaveLanguage === undefined || sSaveLanguage === "") {
			sSaveLanguage = sSapLanguage;
		}
		for (var i = 0; i < aItems.length; i++) {
			if (aItems[i].getKey() === sSaveLanguage) {
				airbus.mes.shell.oView.byId("SelectLanguage")
						.setSelectedItemId(aItems[i].getId());
			}
		}

	},

	checkDisplayFirstSetting : function() {

		var oModel = sap.ui.getCore().getModel("userSettingModel");

		if (oModel.getProperty("/Rowsets/Rowset/0/Row")) {

			if (airbus.mes.shell.oView.byId("labelMSN").getText() === "") {
				airbus.mes.shell.oView.getController().navigate();
			}

		}

	},
	
	saveSettingIsCorrect : function() {
		
		 var oModelSetting = sap.ui.getCore().getModel("userSettingModel");
		 var aModel = airbus.mes.settings.ModelManager.plantModelSaved;
		 var aModelSetting = [];
					 
		 if (oModelSetting.getProperty("/Rowsets/Rowset/0/Row/0")) {              
				
			 aModelSetting = sap.ui.getCore().getModel("userSettingModel").oData.Rowsets.Rowset[0].Row[0];
			 
			 if ( aModelSetting.msn === "---" ) {
		
				 aModel = aModel.filter(function (el) {
		               return el.program ===  aModelSetting.program &&
		                      el.line === aModelSetting.line &&
		                      el.station === aModelSetting.station &&
		                      el.Current_MSN === "true"
		             });
				 
				 
			 } else {
				 
				 aModel = aModel.filter(function (el) {
		               return el.program ===  aModelSetting.program &&
		                      el.line === aModelSetting.line &&
		                      el.station === aModelSetting.station &&
		                      el.msn === aModelSetting.msn
		             });				 
			 }
				
	        } else  {
	        console.log("no model userSaveSetting load");
	     }
		 
		 if ( aModel.length === 0 ) {
			 
			 console.log("USEr Save setting dont match with plant = need to resave");
			 return false;
			 
		 } else {
			 
			 console.log("user setting match with the plant = he can back");
			 return true;
		 } 
		
	},
	
	onPLantModelLoad : function () {
		
		 var oModel = sap.ui.getCore().getModel("plantModel");
		
		 if (oModel.getProperty("/Rowsets/Rowset/0/Row")) {              
				
			 airbus.mes.settings.ModelManager.plantModelSaved = sap.ui.getCore().getModel("plantModel").oData.Rowsets.Rowset[0].Row;
				
	        } else  {
	        airbus.mes.settings.ModelManager.plantModelSaved = [];
	        console.log("no plantModelLoad");
	     }
		
	}
	

};

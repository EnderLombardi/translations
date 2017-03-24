"use strict";

jQuery.sap.declare("airbus.mes.settings.util.ModelManager")

airbus.mes.settings.util.ModelManager = {

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
//	currentMsnSelected : false, //bBatch1 ? false : true
	currentMsnValue : "",
	core : undefined,
	urlModel : undefined,
	current_flag : undefined,
	//queryParams : jQuery.sap.getUriParameters(),

	i18nModel : undefined,

	init : function(core) {

		this.core = core;
	
		airbus.mes.shell.ModelManager.createJsonModel(core,["plantModel","siteModel","program","site"]);

		core.getModel("userSettingModel").attachRequestCompleted(airbus.mes.settings.util.ModelManager.onUserSettingLoad);
		core.getModel("plantModel").attachRequestCompleted(airbus.mes.settings.util.ModelManager.onPlantModelLoad);

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
		oViewModel.loadData(airbus.mes.settings.util.ModelManager.getUrlSite(),
				null, false);
	},
	
	getUrlPlant : function(sSite) {
		var urlSite = this.urlModel.getProperty("urlplantmodel");
		urlSite = urlSite.replace("$site", sSite)
		return urlSite;
	},

	loadPlantModel : function(sSite) {
		var oViewModel = sap.ui.getCore().getModel("plantModel");
		oViewModel.loadData(airbus.mes.settings.util.ModelManager.getUrlPlant(sSite), null, false);
	},
	
	getUrlLang : function() {
		var langUrl = this.urlModel.getProperty("urlLanguage");
		return langUrl;
	},
	
	loadLangModel : function() {
		var oLangModel = this.core.getModel("langModel");
		oLangModel.loadData(airbus.mes.settings.util.ModelManager.getUrlLang(),
				null, false);
	},
	// ********************************************************************************
	getUrlUserLang : function() {
		var langUrl = this.urlModel.getProperty("urlUserLanguage");
		return langUrl;
	},
	// ********************************************************************************
	getUserLang : function() {
		var urlUserLanguage = this.getUrlUserLang();
		var lang = "";
		try {
			lang = jQuery.get({ async: false, url: urlUserLanguage }).responseJSON.language
		} catch(e) {
			var urlUserSetting = this.urlModel.getProperty("urlUserSettings");
			var oUserSettingModel = new sap.ui.model.json.JSONModel();
			oUserSettingModel.loadData(urlUserSetting, null, false);
			return oUserSettingModel.getProperty("/Rowsets/Rowset/0/Row/0/language");
		}
		return lang;
	},
	// ********************************************************************************
	setUserLang : function(sLang){
		var urlUserLanguage = this.getUrlUserLang();
		jQuery.ajax({ method: "PUT", url: urlUserLanguage + "&lang="+sLang, async: false })
	},
	// ********************************************************************************
	getUrlUserSetting : function() {
		var urlUserSetting = this.urlModel.getProperty("urlUserSettings");
		// urlUserSetting =
		// airbus.mes.settings.util.ModelManager.replaceURI(urlUserSetting, "$user",
		// airbus.mes.settings.util.ModelManager.user);
		return urlUserSetting;

	},
	
	loadUserSettingsModel : function() {
		var oUserSettingModel = sap.ui.getCore().getModel("userSettingModel");
		oUserSettingModel.loadData(airbus.mes.settings.util.ModelManager
				.getUrlUserSetting(), null, false);

	},
	
	onUserSettingLoad : function() {
		// Apply user settings.
		airbus.mes.settings.oView.getController().getUserSettings();
		airbus.mes.settings.util.AppConfManager.loadAppConfig();

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
		// airbus.mes.settings.util.ModelManager.replaceURI(urlSaveUserSetting,
		// "$user", airbus.mes.settings.util.ModelManager.user);
		urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
				urlSaveUserSetting, "$langage", sLanguage);
		urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
				urlSaveUserSetting, "$plant",
				airbus.mes.settings.util.ModelManager.site);
		urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
				urlSaveUserSetting, "$program",
				airbus.mes.settings.util.ModelManager.program);
		urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
				urlSaveUserSetting, "$line",
				airbus.mes.settings.util.ModelManager.line);
		urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
				urlSaveUserSetting, "$station",
				airbus.mes.settings.util.ModelManager.station);
		urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
				urlSaveUserSetting, "$siteDesc",
				airbus.mes.settings.util.ModelManager.siteDesc);
		urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
				urlSaveUserSetting, "$lineDesc",
				airbus.mes.settings.util.ModelManager.lineDesc);
		urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
				urlSaveUserSetting, "$programDesc",
				airbus.mes.settings.util.ModelManager.programDesc);
		urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
				urlSaveUserSetting, "$stationDesc",
				airbus.mes.settings.util.ModelManager.stationDesc);
		urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
				urlSaveUserSetting, "$taktDuration",
				airbus.mes.settings.util.ModelManager.taktDuration);
		urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
				urlSaveUserSetting, "$taktStart",
				airbus.mes.settings.util.ModelManager.taktStart);
		urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
				urlSaveUserSetting, "$taktEnd",
				airbus.mes.settings.util.ModelManager.taktEnd);

//		if (airbus.mes.settings.util.ModelManager.current_flag === "X") {

//			urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
//					urlSaveUserSetting, "$msn", "");

//		} else {

			urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
					urlSaveUserSetting, "$msn",
					airbus.mes.settings.util.ModelManager.msn);

//		}
		urlSaveUserSetting = airbus.mes.settings.util.ModelManager.replaceURI(
				urlSaveUserSetting, "$current_flag", airbus.mes.settings.util.ModelManager.current_flag);

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
		return this.getUserLang();
//		var urlUserSetting = this.urlModel.getProperty("urlUserSettings");
//
//		var oUserSettingModel = new sap.ui.model.json.JSONModel();
//		oUserSettingModel.loadData(urlUserSetting, null, false);
//
//		return oUserSettingModel.getProperty("/Rowsets/Rowset/0/Row/0/language");

	},

	checkLanguage : function() {
		// Retrieve the language selector to define default language
		// corresponding to sap-language parameter
		var aItems = airbus.mes.shell.oView.byId("SelectLanguage").getItems();
		var sSapLanguage = sap.ui.getCore().getConfiguration().getLanguage()
				.slice(0, 2);
		// Retrieve connexion language
		var sSaveLanguage = airbus.mes.settings.util.ModelManager.loadLanguage();

		if (sSaveLanguage != undefined && sSaveLanguage != "---"
				&& sSaveLanguage != "" && sSaveLanguage != null) {

			airbus.mes.shell.oView.getController().updateUrlForLanguage(
					sSaveLanguage);
			airbus.mes.settings.util.ModelManager.setUserLang(sSaveLanguage)

		} else {

			// airbus.mes.settings.util.ModelManager.saveUserSetting(sSapLanguage);
			// airbus.mes.settings.util.ModelManager.setUserLang(sSapLanguage);
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
		
		var sSite = airbus.mes.settings.util.ModelManager.site;
		var sMSN = airbus.mes.settings.util.ModelManager.msn;
				
		if (!sSite || sSite == "---" || sSite == "undefined"
			|| !sMSN || sMSN == "---" || sMSN == "undefined") {
			airbus.mes.shell.oView.getController().navigate();
		}

	},
	
	saveSettingIsCorrect : function() {
		
		 var oModelSetting = sap.ui.getCore().getModel("userSettingModel");
		 var aModel = airbus.mes.settings.util.ModelManager.plantModelSaved;
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
	
	onPlantModelLoad : function () {
		
		 var oModel = sap.ui.getCore().getModel("plantModel");
		
		 if (oModel.getProperty("/Rowsets/Rowset/0/Row")) {              
				
			 airbus.mes.settings.util.ModelManager.plantModelSaved = sap.ui.getCore().getModel("plantModel").oData.Rowsets.Rowset[0].Row;
			
//			 Check if current MSN is flagged on user settings, if yes, change the MSN to current MSN
			 if(airbus.mes.settings.util.ModelManager.current_flag === "X") {
				 
//				if yes, change to MSN on settings to current MSN
				 airbus.mes.settings.util.ModelManager.msn = airbus.mes.settings.util.ModelManager.retrieveCurrentMSN(airbus.mes.settings.util.ModelManager.plantModelSaved,
					 																 airbus.mes.settings.util.ModelManager.program,
					 															 	 airbus.mes.settings.util.ModelManager.line,
					 															 	airbus.mes.settings.util.ModelManager.station);
			 }
			 
        } else  {
	        airbus.mes.settings.util.ModelManager.plantModelSaved = [];
	        console.log("no plantModelLoad");
	     }
		
	},
	
	retrieveCurrentMSN : function(aModel, sProgram, sLine, sStation) {
        var currentMSN = aModel.filter(function (el) {
            return el.program === sProgram &&
                el.line === sLine &&
                el.station === sStation &&
                el.Current_MSN === "X";
        })[0];	
        if(currentMSN) {
//        	If a current MSN is defined
        	return currentMSN.msn;
        } else {
//			If no current MSN, we return an empty MSN
        	return ""; 
        }
	}
	

};

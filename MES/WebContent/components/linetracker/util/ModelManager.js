"use strict";

jQuery.sap.declare("airbus.mes.linetracker.util.ModelManager");

airbus.mes.linetracker.util.ModelManager = {
	urlModel : undefined,
	//site : undefined,
	program : undefined,
	customLineBO : undefined,
	aTaktAction : ["LOAD_NEXT_MSN","START_OF_ASSEMBLY","END_OF_ASSEMBLY","EMPTY_STATION","UNDO"],
	oView:undefined,
	init : function(core) {
		

		
		var aModel = [ "stationDataModel", // Model for Station Data
		"lineVariantModel", // Model for Line variant Data
		"statusActionModel"
		]
		airbus.mes.shell.ModelManager.createJsonModel(core, aModel);
	    // Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.linetracker.config.url_config");
		

	},

	loadLinetrackerKPI : function() {
		this.loadLineVariantModel();
		this.loadStationDataModel();
		

	},
	/**
	 * BR:SD-PPC-LT-070
	 * Load Station Details in line tracker
	 */
	loadStationDataModel : function() {
		//airbus.mes.shell.busyManager.setBusy(airbus.mes.linetracker.oView, "linetrackerTable");
		airbus.mes.linetracker.oView.setBusyIndicatorDelay(0);
		airbus.mes.linetracker.oView.setBusy(true);
		var oViewModel = sap.ui.getCore().getModel("stationDataModel");
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlstationData"),
			contentType : 'application/json',
			cache : false,
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"customLine" : airbus.mes.linetracker.util.ModelManager.customLineBO,//.split(",")[1],
				"lang" : sap.ui.getCore().byId("globalNavView--SelectLanguage").getSelectedItem().getKey()
			}),

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if (data.stationData) {
					if (data.stationData && !data.stationData[0]) {
						data.stationData = [ data.stationData ];
					}
//					data = airbus.mes.linetracker.util.ModelManager.loadDefaultFlightLogoInStationDataModel(data);
				} else {
					data.stationData = [];
				}
				oViewModel.setData(data);
				// this is required to scroll the Linetracker table. Don't
				// remove/comment
				sap.ui.getCore().byId("idLinetracker--linetrackerTable").rerender();
				airbus.mes.shell.busyManager.unsetBusy(airbus.mes.linetracker.oView, "linetrackerTable");
				airbus.mes.linetracker.oView.setBusy(false);
				//airbus.mes.linetracker.util.ModelManager.loadFlightLogoInStationDataModel(data);
			},

			error : function(error, jQXHR) {
				//airbus.mes.shell.busyManager.unsetBusy(airbus.mes.linetracker.oView, "linetrackerTable");
				airbus.mes.linetracker.oView.setBusy(false);
			}
		});
	},

	/**
	 * BR:SD-PPC-LT-100
	 * Load Line variant names for value help
	 */
	loadLineVariantModel : function() {
		var oViewModel = sap.ui.getCore().getModel("lineVariantModel");
		 //sap.ui.getCore().byId("idLinetracker").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlLineVariant"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"lang" : sap.ui.getCore().byId("globalNavView--SelectLanguage").getSelectedItem().getKey()
			}),

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if(!data.variantNameList[0]){
					data.variantNameList = [data.variantNameList];
				}
				oViewModel.setData(data);
				 //sap.ui.getCore().byId("idLinetracker").setBusy(false);
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
				airbus.mes.shell.ModelManager.messageShow(airbus.mes.linetracker.oView.getModel("i18n").getProperty("couldNotPerformRequestedAction"));
				// sap.ui.getCore().byId("idLinetracker").setBusy(false);
			}
		});
	},

	/**
	 * Get current system date
	 * @returns {string} current system date
	 */
	getCurrentDateFormatted : function() {
		return (new Date()).toISOString().slice(0, 10).replace(/-/g, "");
	},

	/**
	 * function to update the current line selected in user settings model locally.
	 */
	updateLineInUserSettings : function(){
//		var urlCustomLineBOInUserSetting = this.urlModel.getProperty('updatevarianthandle');
		jQuery.ajax({
			url : this.urlModel.getProperty('updatevarianthandle').replace("$customLineBO", airbus.mes.linetracker.util.ModelManager.customLineBO),
			async : true,
			type : 'get',
			contentType : 'application/json',
			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				//if success update settings for user locally in user model.
				airbus.mes.linetracker.util.ModelManager.updateLineInUserSettingsLocally();
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
				airbus.mes.shell.ModelManager.messageShow(airbus.mes.linetracker.oView.getModel("i18n").getProperty("couldNotPerformRequestedAction"));
			}
		})
	},
	/**
	 * to set user settings in local model so that user open this setting when he visits lien tracker next time
	 */
	updateLineInUserSettingsLocally : function(){
		sap.ui.getCore().getModel("userSettingModel").setProperty("/Rowsets/Rowset/0/Row/0/customLineBO",airbus.mes.linetracker.util.ModelManager.customLineBO);
	},
	/**
	 * @param station, msn
	 * set settings variables to corresponding station and msn so that the particular station can be opened from station tracker
	 *  
	 */
	setProgramLineForStationMsn : function(station, msn) {
		/*var arr = sap.ui.getCore().getModel("plantModel").getProperty("/Rowsets/Rowset/0/Row");
		var result = arr.filter(function(o) {
			return o.station == station && o.msn == msn;
		});
		result = result ? result[0] : null; // or undefined
*/		var result = airbus.mes.linetracker.util.ModelManager.getProgramForMsnStation(station, msn);
		airbus.mes.settings.ModelManager.program = result.program;
		airbus.mes.settings.ModelManager.station = result.station;
		airbus.mes.settings.ModelManager.msn = result.msn;
		airbus.mes.settings.ModelManager.line = result.line;
		var oModel = sap.ui.getCore().getModel("userSettingModel");
		oModel.setProperty("/Rowsets/Rowset/0/Row/0/stationDescription",result.stationDescription);
		oModel.setProperty("/Rowsets/Rowset/0/Row/0/msn",result.msn);
		oModel.setProperty("/Rowsets/Rowset/0/Row/0/lineDescription",result.lineDescription);
		oModel.setProperty("/Rowsets/Rowset/0/Row/0/programDescription",result.programDescription);
		oModel.setProperty("/Rowsets/Rowset/0/Row/0/station",result.station);
		oModel.setProperty("/Rowsets/Rowset/0/Row/0/line",result.line);
		oModel.setProperty("/Rowsets/Rowset/0/Row/0/program",result.program);
		oModel.refresh();
		
		
	},
	/**
	 * @param station, msn, action
	 * perform takt action based on the chosen action and reload all the model
	 */
	performTaktAction : function(action){
		var modifiedDateTime = sap.ui.getCore().getModel("statusActionModel").getProperty("/currentMsnModifydDate");
		var msn = sap.ui.getCore().getModel("statusActionModel").getProperty("/msn");
		var status = sap.ui.getCore().getModel("statusActionModel").getProperty("/status");
		if(action===airbus.mes.linetracker.util.ModelManager.aTaktAction[4] && (status==="TO_BE_LOADED" || status==="UN_LOADED")){
			msn = sap.ui.getCore().getModel("statusActionModel").getProperty("/previousMsn");
			modifiedDateTime = sap.ui.getCore().getModel("statusActionModel").getProperty("/previousMsnModifyDate");
		} else if(action===airbus.mes.linetracker.util.ModelManager.aTaktAction[0] && status==="TO_BE_LOADED"){
			msn = sap.ui.getCore().getModel("statusActionModel").getProperty("/nextMsn");
			modifiedDateTime = sap.ui.getCore().getModel("statusActionModel").getProperty("/nextMsnModifyDate");
		}
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urltaktaction"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"lang" : sap.ui.getCore().byId("globalNavView--SelectLanguage").getSelectedItem().getKey(),
				"msn" : msn,
				"station" : sap.ui.getCore().getModel("statusActionModel").getProperty("/station"),
				"action" : action,
				"modifiedDateTime" : modifiedDateTime
			}),

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if(data.success=="true"){
					airbus.mes.linetracker.util.ModelManager.loadStationDataModel();
					if(data.value && (data.value=="ERROR" || data.value=="LOCKED"))
						airbus.mes.shell.ModelManager.messageShow(data.message);
				}else if(data.value && data.value=="LOCKED"){
						airbus.mes.shell.ModelManager.messageShow(data.message);
				}else{
					airbus.mes.shell.ModelManager.messageShow(airbus.mes.linetracker.oView.getModel("i18n").getProperty("couldNotPerformRequestedAction"));
				}
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
				airbus.mes.shell.ModelManager.messageShow(airbus.mes.linetracker.oView.getModel("i18n").getProperty("couldNotPerformRequestedAction"));
			}
		});
	},
	/**
	 * @param msn, status
	 * to add the nextMsn and status from the chosen row to current popover model
	 */
	populateStatusActionModel : function(station, msn, nextMsn, status, previousMsn, nextMsnImageUrl,currentMsnModifydDate,nextMsnModifyDate,previousMsnModifyDate){
		var data = {
			"station":station,
			"msn":msn,
			"nextMsn" : nextMsn,
			"status" : status,
			"previousMsn" : previousMsn,
			"nextMsnImageUrl" : nextMsnImageUrl,
			"currentMsnModifydDate" : currentMsnModifydDate,
			"nextMsnModifyDate" : nextMsnModifyDate,
			"previousMsnModifyDate" : previousMsnModifyDate
		} 
		sap.ui.getCore().getModel("statusActionModel").setData(data);
		sap.ui.getCore().getModel("statusActionModel").refresh();
	},
	getProgramForMsnStation : function(station,msn){
		var arr = sap.ui.getCore().getModel("plantModel").getProperty("/Rowsets/Rowset/0/Row");
		var result = arr.filter(function(o) {
			return o.station == station && o.msn == msn;
		});
		return result = result ? result[0] : null; // or undefined
	},
	loadFlightLogoInStationDataModel : function(data) {
		for(var i=0; i<data.stationData.length;i++){
			var msn = data.stationData[i].msn;
			var nextMsn = data.stationData[i].nextMsn
			var station = data.stationData[i].station		
			data.stationData[i].imageUrl = airbus.mes.linetracker.util.ModelManager.getLogoImageUrl(station, msn, i);	
			//data.stationData[i].nextMsnImageUrl = airbus.mes.linetracker.util.ModelManager.getLogoImageUrl(station, nextMsn);
		}
		return data;
		sap.ui.getCore().getModel("stationDataModel").setData(data);

	},
	getMsnUrl : function(station, msn){
		var oResult = airbus.mes.linetracker.util.ModelManager.getProgramForMsnStation(station, msn);
		var tf;
		//to remove hand from msn if msn exists
		if(msn)
			msn=msn.split("_")[0];
		if(oResult && oResult.TF){
			tf = oResult.TF;
		}
		
		var url = airbus.mes.linetracker.util.ModelManager.urlModel.getProperty("urlAirline_logo");
		url = url.replace("$TF", tf);
		url = url.replace("$Application_ID", "000000000030");
		url = url.replace("$msn", msn);
		return url;
		
	},
	getLogoImageUrl : function(station, msn, index){
		var url = airbus.mes.linetracker.util.ModelManager.getMsnUrl(station, msn);
		var sPath = "/data/"+i+"/imageUrl"
		var imageUrl;
		var defImg = airbus.mes.shell.ModelManager.getResourceUrl('airbus.logo.jpg');
		jQuery.ajax({
			async : true,
			type : 'get',
			url : url,
			contentType : 'application/json',

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				try {
					if (data.Rowsets.Rowset[0].Row[0].airline_logo_url && data.Rowsets.Rowset[0].Row[0].airline_logo_url.length != 0) {
						jQuery.ajax({
							async : false,
							type : 'get',
							url : data.Rowsets.Rowset[0].Row[0].airline_logo_url,
							success : function(newData) {
								imageUrl = data.Rowsets.Rowset[0].Row[0].airline_logo_url;
							},
							error : function() {
								imageUrl = defImg;
							}
						
//						imageUrl = data.Rowsets.Rowset[0].Row[0].airline_logo_url;
					});
						} else {
						imageUrl = defImg;
					}
				} catch (oException) {
					imageUrl = defImg
				}
			},

			error : function(error, jQXHR) {
				imageUrl = airbus.mes.shell.ModelManager.getResourceUrl('airbus.logo.jpg');
			}
		});
		return imageUrl;
	},
	loadDefaultFlightLogoInStationDataModel: function(data){
		for(var i=0; i<data.stationData.length;i++){
			data.stationData[i].imageUrl = airbus.mes.shell.ModelManager.getResourceUrl('airbus.logo.jpg');	
			data.stationData[i].nextMsnImageUrl = airbus.mes.shell.ModelManager.getResourceUrl('airbus.logo.jpg');
		}
		return data;
	}

};

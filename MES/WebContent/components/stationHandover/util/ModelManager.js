"use strict";
jQuery.sap.declare("airbus.mes.stationHandover.util.ModelManager");

airbus.mes.stationHandover.util.ModelManager = {
	urlModel : undefined,
	modeDialog : false,
	aSelectedStartDate : [],
	aSelectedEndDate : [],
	queryParams : jQuery.sap.getUriParameters(),
	i18nModel : undefined,
	filter : {
		"search" : undefined,
		"responsibilityTransferType" : new sap.ui.model.Filter({
			path : "responsibilityTransferType",
			test : function(oValue) {

				if (airbus.mes.stationHandover.util.ModelManager.filter.aType.indexOf(oValue) != -1) {

					return true;
				} else {

					return false;
				}
			}
		}),
		"noTime" : new sap.ui.model.Filter("duration", "NE", "0.000"),
		"selected" : new sap.ui.model.Filter("SELECTED_UI", "EQ", "false"),
		"station" : new sap.ui.model.Filter({
			path : "meOriginPhysicalStation",
			test : function(oValue) {
										
				if ( airbus.mes.stationHandover.util.ModelManager.filter.aStation.indexOf(oValue) != -1 ){
					
					return true;
				} else {
					
					return false;
				}
			}
		}),
		"aType" : [ "NO" ],
		"aStation" : [],
	},

	init : function(core) {

		var aModel = [ "oswModel", "msnModel", "typeModel", "groupModel", "phStation", "optionInsertOsw" , "productionGroup" ]
		airbus.mes.shell.ModelManager.createJsonModel(core, aModel);

		//core.getModel("oswModel").attachRequestCompleted(airbus.mes.stationHandover.util.ModelManager.onOswLoad);

		var dest;

		switch (window.location.hostname) {
		case "localhost":
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
			bundleName : "airbus.mes.stationHandover.config.url_config",
			bundleLocale : dest
		});

		if (dest === "sopra") {

			var oModel = this.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;

			for ( var prop in oModel) {
				if (oModel[prop].slice(-5) != ".json") {
					oModel[prop] += "&j_user=" + Cookies.getJSON("login").user + "&j_password=" + Cookies.getJSON("login").mdp;
				}
			}
		}

	},

	/* *********************************************************************** *
	 *  Replace URL Parameters                                                 *
	 * *********************************************************************** */
	replaceURI : function(sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},

	loadOptionInsertOsw : function() {

		var oViewModel = airbus.mes.stationHandover.oView.getModel("optionInsertOsw");
		var getUrlShifts = this.urlModel.getProperty("urloptioninsertosw");

		oViewModel.loadData(getUrlShifts, null, false);

	},

	loadOsw : function() {

		var oViewModel = airbus.mes.stationHandover.oView.getModel("oswModel");
		var oModelStation = airbus.mes.stationHandover.oView.getModel("phStation");
		var getUrlShifts = this.urlModel.getProperty("urlosw");
		var sPhysicalStationBo =  "WorkCenterBO:" +  airbus.mes.settings.util.ModelManager.site + "," + airbus.mes.settings.util.ModelManager.station;
		
		jQuery.ajax({
			type : 'post',
			url : getUrlShifts,
			contentType : 'application/json',
			async : 'false',
			data : JSON.stringify({
				"site" : airbus.mes.settings.util.ModelManager.site,
				"physicalStationBO" : sPhysicalStationBo,
				"msn" : airbus.mes.settings.util.ModelManager.msn,
				"calculateOWWithResponsibility" : true,
				"calculateOWWithoutResponsibility" : true,
				"calculateLocalOW" : true
			}),

			success : function(data) {

				var sField = "outstandingWorkOrderInfoList";
				var sFieldStep = "outstandingWorkStepInfoList"
				var sOriginStation = "meOriginPhysicalStations";
					
				try {
					
					
					if ( !Array.isArray(data[sField]) ) {
						
						data[sField] = [data[sField]];
						
					} 
					
					data[sField].forEach(function(el){
					
						if ( !Array.isArray(el[sFieldStep]) ) {
							
							el[sFieldStep] = [el[sFieldStep]];
							
						} 					
						
					});
					
					if ( !Array.isArray(data[sOriginStation]) ) {
						
						data[sOriginStation] = [data[sOriginStation]];
						
					}
					
					oModelStation.setData(data[sOriginStation]);
					airbus.mes.stationHandover.util.ModelManager.filter.aStation.push(data[sOriginStation][data[sOriginStation].length - 1].meOriginPhysicalStation);

					oViewModel.setData(data);
					//airbus.mes.calendar.oView.getModel("ressourcePoolModel").refresh(true);
					airbus.mes.stationHandover.util.ModelManager.onOswLoad();
					
					
				} catch (e) {
					oViewModel.setData({});
					console.log("NO osw load problem");
				}

			},

			error : function(error, jQXHR) {
				console.log("NO osw load problem");

			}
		});

		//oViewModel.loadData(getUrlShifts, null, false);

	},

	loadPhStation : function() {

//		try {
//
//			var oModel = airbus.mes.settings.oView.getModel("plantModel").oData.Rowsets.Rowset[0].Row;
//			var oModelStation = airbus.mes.stationHandover.oView.getModel("phStation");
//			var oContext = airbus.mes.settings.util.ModelManager;
//			var oModelManager = airbus.mes.stationHandover.util.ModelManager;
//			var aPhStation = [];
//			var aModel = oModel.filter(function(el) {
//
//				return el.msn === oContext.msn
//
//			});
//			// select a planned takt start date/time strictly smaller than the planned start date/time by setting
//			aModel.forEach(function(el) {
//
//				if (new Date(el.Takt_Start) < new Date(oContext.taktStart)) {
//
//					el.sDate = Date.parse(new Date(el.Takt_Start));
//					aPhStation.push(el);
//
//				}
//
//			});
//			
//			// oCurrent.sDate = Date.parse(new Date(oCurrent.Takt_Start))
//			//aPhStation.push(oCurrent);
//			aPhStation = aPhStation.sort(airbus.mes.shell.util.Formatter.fieldComparator([ 'sDate' ]));
//			//As a default, the physical station with the biggest planned start date/time should be selected.
//			oModelManager.filter.aStation.push(aPhStation[aPhStation.length - 1].station);
//			oModelStation.setData(aPhStation);
//			console.log(aPhStation);
//
//		} catch (e) {
//
//			console.log("No Ph station load bug problem")
//		}

	},

	onOswLoad : function() {

		var oViewModel = airbus.mes.stationHandover.oView.getModel("oswModel");
		
		try {

			var aModel = oViewModel.oData.outstandingWorkOrderInfoList;
			var aSelected = [];
			airbus.mes.stationHandover.util.ModelManager.copyOfModel = JSON.parse(JSON.stringify(oViewModel.oData));
			//Create tree of for manage selection of tree
			aModel.forEach(function(el, indice) {
				
				aSelected = [];
				
				aModel[indice].outstandingWorkStepInfoList.forEach(function(al, indice1) {
					
					al.SELECTED_UI = al.selected;
					aSelected.push(al.selected);
					
				})
				
				// That mean all child are not selected so the parent need to be unselect
				if ( aSelected.indexOf("false") > -1 ) {
					
					el.SELECTED_UI = "false";
					el.selected = "false";
					
				} else {
					
					el.SELECTED_UI = "true";
					el.selected = "true";

				}
								
			})

			airbus.mes.stationHandover.oView.getController().applyMyFilter();
			
		} catch (e) {

			console.log("Error");

		}
	},

	loadType : function() {

		var oViewModel = airbus.mes.stationHandover.oView.getModel("typeModel");
		var getUrl = this.urlModel.getProperty("urltype");

		oViewModel.loadData(getUrl, null, false);
		oViewModel.refresh();

	},

	loadGroup : function() {

		var oViewModel = airbus.mes.stationHandover.oView.getModel("groupModel");
		var getUrl = this.urlModel.getProperty("urlgroup");

		oViewModel.loadData(getUrl, null, false);
		oViewModel.refresh();

	},

	getMsn : function() {

		var aMsn = airbus.mes.settings.oView.byId("selectMSN").getItems();
		var aModel = [];
		var oViewModel = airbus.mes.stationHandover.oView.getModel("msnModel");

		aMsn.forEach(function(el) {

			aModel.push({
				"msn" : el.mProperties.text,
				"key" : el.mProperties.key,
			})
		})

		oViewModel.setData(aModel);
		oViewModel.refresh();
	},
	
	saveOsw : function() {
		
		var oModel = airbus.mes.stationHandover.oView.getModel("oswModel").oData;
		var urlsave  = this.urlModel.getProperty("urlsave");
		var sPhysicalStationBo =  "WorkCenterBO:" +  airbus.mes.settings.util.ModelManager.site + "," + airbus.mes.settings.util.ModelManager.station;
		var sSelectedType = sap.ui.getCore().byId("insertOsw--selectMode").getSelectedKey();
		var sProductionGroup = airbus.mes.stationHandover.oView.getModel("productionGroup").getProperty("/Rowsets/Rowset/0/Row/0/PROD_GROUP");
		var sTime = sap.ui.getCore().byId("insertOsw--TimePicker");
		var sTimeDate = sap.ui.getCore().byId("insertOsw--calendar");
		var sDate = "";
		var dDate = "";
		
		if ( sSelectedType != "P" ) {
			
			dDate = new Date(sTimeDate.getSelectedDates()[0].mProperties.startDate);
			dDate.setHours(sTime.getDateValue().getHours());
			dDate.setMinutes(sTime.getDateValue().getMinutes());
			dDate.setSeconds(sTime.getDateValue().getSeconds());

			sDate = airbus.mes.shell.util.Formatter.dDate2sDate(dDate);
			
		}
//		
//		console.log(JSON.stringify({
//				"site" : airbus.mes.settings.util.ModelManager.site,
//				"physicalStationBO" : sPhysicalStationBo,
//				"msn" : airbus.mes.settings.util.ModelManager.msn,
//				"productionGroup" : sProductionGroup,
//				"manualDate" : sDate,
//				'insertType' : sap.ui.getCore().byId("insertOsw--selectMode").getSelectedKey(),
//				'outstandingWorkOrderInfoList' : oModel.outstandingWorkOrderInfoList,
//			}));
		
		jQuery.ajax({
			type : 'post',
			url : urlsave,
			contentType : 'application/json',
			async : 'false',
			data : JSON.stringify({
				"site" : airbus.mes.settings.util.ModelManager.site,
				"physicalStationBO" : sPhysicalStationBo,
				"msn" : airbus.mes.settings.util.ModelManager.msn,
				"productionGroup" : sProductionGroup,
				"manualDate" : sDate,
				'insertType' : sap.ui.getCore().byId("insertOsw--selectMode").getSelectedKey(),
				'outstandingWorkOrderInfoList' : oModel.outstandingWorkOrderInfoList,
			}),

			success : function(data) {

				try {
					
					airbus.mes.shell.oView.getController().renderStationHandover();
					airbus.mes.stationHandover.insertOsw.close();
					
					if (airbus.mes.stationtracker != undefined ) {
						
						if ( nav.getCurrentPage().sId === "stationTrackerView") {
							airbus.mes.stationtracker.oswDialog.close();
							airbus.mes.shell.oView.getController().renderStationTracker();	
						}
						
					}
					
					if ( data.message === "S" ) {
	                    sap.m.MessageToast.show(airbus.mes.stationHandover.oView.getModel("stationHandoverI18n").getProperty("success"));					
					} else {
	                    sap.m.MessageToast.show(airbus.mes.stationHandover.oView.getModel("stationHandoverI18n").getProperty("error"));						
					}
					
				} catch (e) {

					console.log("NO ressource pool load");
				}

			},

			error : function(error, jQXHR) {
				console.log("NO ressource pool load");

			}
		});
	},
	
	loadProductionGroup: function () {

        var oData = airbus.mes.settings.util.ModelManager;
        var geturlstationtracker = this.urlModel.getProperty('urlproductiongroup');
		var oViewModel = airbus.mes.stationHandover.oView.getModel("productionGroup");

        geturlstationtracker = airbus.mes.shell.ModelManager.replaceURI(geturlstationtracker, "$station", oData.station);
        geturlstationtracker = airbus.mes.shell.ModelManager.replaceURI(geturlstationtracker, "$plant", oData.site);
        
        oViewModel.loadData(geturlstationtracker, null, true);

    },
   
};

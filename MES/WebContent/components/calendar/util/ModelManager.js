"use strict";
jQuery.sap.declare("airbus.mes.calendar.util.ModelManager");

airbus.mes.calendar.util.ModelManager = {
	urlModel : undefined,
	i18nModel : undefined,

	init : function(core) {

		var aModel = [ "ressourcePoolModel", "calendarshiftsModel", "calendarTrackerModel" ]
		airbus.mes.shell.ModelManager.createJsonModel(core, aModel);

		//core.getModel("testModel").attachRequestCompleted(airbus.mes.calendar.util.ModelManager.toto);
		core.getModel("calendarshiftsModel").attachRequestCompleted(airbus.mes.calendar.util.ModelManager.onShiftsLoad);
		core.getModel("ressourcePoolModel").attachRequestCompleted(airbus.mes.calendar.util.ModelManager.onRessourcePoolLoad);

		// Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.calendar.config.url_config");

	},

	/* *********************************************************************** *
	 *  Replace URL Parameters                                                 *
	 * *********************************************************************** */
	replaceURI : function(sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},

	loadShifts : function() {

		var oViewModelshift = airbus.mes.calendar.oView.getModel("calendarshiftsModel");
		var getUrlShifts = this.urlModel.getProperty("urlshifts");
		var oData = airbus.mes.settings.ModelManager;
		var reqResult = "";
		getUrlShifts = airbus.mes.calendar.util.ModelManager.replaceURI(getUrlShifts, "$site", oData.site);
		getUrlShifts = airbus.mes.calendar.util.ModelManager.replaceURI(getUrlShifts, "$station", oData.station);
		getUrlShifts = airbus.mes.calendar.util.ModelManager.replaceURI(getUrlShifts, "$msn", oData.msn);

		oViewModelshift.loadData(getUrlShifts, null, false);

		reqResult = airbus.mes.shell.util.Formatter.getMiiMessageType(oViewModelshift.oData);

		switch (reqResult) {
		case "S":
			break;
		case "E":
			sap.m.MessageToast.show("Error : " + airbus.mes.shell.util.Formatter.getMiiTextFromData(oViewModelshift.oData));
			break;
		default:
		}

	},

	onShiftsLoad : function() {

		var GroupingBoxingManager = airbus.mes.calendar.util.GroupingBoxingManager;
		GroupingBoxingManager.parseShift();
	},

	loadCalendarTracker : function() {

		var oData = airbus.mes.settings.ModelManager;
		var oViewModel = airbus.mes.calendar.oView.getModel("calendarTrackerModel");
		var geturlcalendartracker = this.urlModel.getProperty('urlCalendaroperation');
		//Format need to be same format at Ph_Station in table Z_RESOURCE_POOL_ASSIGNMENT 
		var sPhysicalStationBo =  "WorkCenterBO:" + oData.site + "," + oData.station;
		jQuery.ajax({
			type : 'post',
			url : geturlcalendartracker,
			contentType : 'application/json',
			async : 'true',
			data : JSON.stringify({
				"site" : oData.site,
				"physicalStationBO" : sPhysicalStationBo,
				"msn" : oData.msn,
				
			}),

			success : function(data) {
				
				try {
					// In reste service if there is only one response data.resourcePoolList is type of object expected array 
					if ( !Array.isArray(data.userCalendarDisplayData) ) {
						
						var oData = data.userCalendarDisplayData;
						
						data.userCalendarDisplayData = [oData];
						
					}
			
					console.log(data);
					oViewModel.setData(data);
					airbus.mes.calendar.util.ModelManager.onCalendarTrackerLoad();
		
				} catch (e) {
					console.log("NO calendar data load");
						oViewModel.setData([]);
					airbus.mes.calendar.util.ModelManager.onCalendarTrackerLoad();
					
				}

			},

			error : function(error, jQXHR) {
				
				if ( error.responseText != undefined ) {
					
					sap.m.MessageToast.show("Error : " + error.responseText);
					
				}
				console.log("NO calendar data load");

			}
		});	
	
	},

	onCalendarTrackerLoad : function() {

		var GroupingBoxingManager = airbus.mes.calendar.util.GroupingBoxingManager;

		GroupingBoxingManager.computeCalendarHierarchy();

	},

	loadRessourcePool : function() {

		var oViewModel = airbus.mes.calendar.oView.getModel("ressourcePoolModel");
		var geturlRessourcePool = this.urlModel.getProperty('urlRessourcePoolModel');
		
		jQuery.ajax({
			type : 'post',
			url : geturlRessourcePool,
			contentType : 'application/json',
			async : 'false',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"phStation" : airbus.mes.settings.ModelManager.station	               
			}),

			success : function(data) {

				try {
					// In reste service if there is only one response data.resourcePoolList is type of object expected array 
					if ( !Array.isArray(data.resourcePoolList) ) {
						
						var oData = data.resourcePoolList;
						
						data.resourcePoolList = [oData];
						
					}
					
					data.resourcePoolList.unshift({
						"id" : "ALL",
						"description" : "ALL",
					});

					oViewModel.setData(data);
					airbus.mes.calendar.oView.getModel("ressourcePoolModel").refresh(true);

				} catch (e) {

					var oData = {"resourcePoolList" : []}
					oData.resourcePoolList.unshift({
						"id" : "ALL",
						"description" : "ALL",
					});
					oViewModel.setData(data);
					airbus.mes.calendar.oView.getModel("ressourcePoolModel").refresh(true);
					console.log("NO ressource pool load");
				}

			},

			error : function(error, jQXHR) {
				console.log("NO ressource pool load");

			}
		});

	},
};

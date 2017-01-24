"use strict";
jQuery.sap.declare("airbus.mes.calendar.util.ModelManager");

airbus.mes.calendar.util.ModelManager = {
       urlModel : undefined,
       queryParams : jQuery.sap.getUriParameters(),
       i18nModel : undefined,

       
       init : function(core) {
    	  
    	   var aModel = ["ressourcePoolModel" ,"calendarshiftsModel","calendarTrackerModel"]
    	   airbus.mes.shell.ModelManager.createJsonModel(core,aModel);
           
    	   //core.getModel("testModel").attachRequestCompleted(airbus.mes.calendar.util.ModelManager.toto);
           core.getModel("calendarshiftsModel").attachRequestCompleted(airbus.mes.calendar.util.ModelManager.onShiftsLoad);
           core.getModel("calendarTrackerModel").attachRequestCompleted(airbus.mes.calendar.util.ModelManager.onCalendarTrackerLoad);
           core.getModel("ressourcePoolModel").attachRequestCompleted(airbus.mes.calendar.util.ModelManager.onRessourcePoolLoad);
                
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
			bundleName : "airbus.mes.calendar.config.url_config",
			bundleLocale : dest
		});

		if (dest === "sopra") {

			var oModel = this.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;

			for ( var prop in oModel) {
				if (oModel[prop].slice(-5) != ".json") {
					oModel[prop] += "&j_user=" + Cookies.getJSON("login").user
							+ "&j_password=" + Cookies.getJSON("login").mdp;
				}
			}
		}

		this.loadRessourcePool();

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

	        geturlcalendartracker = airbus.mes.calendar.util.ModelManager.replaceURI(geturlcalendartracker, "$site", oData.site);
	        geturlcalendartracker = airbus.mes.calendar.util.ModelManager.replaceURI(geturlcalendartracker, "$station", oData.station);
	        geturlcalendartracker = airbus.mes.calendar.util.ModelManager.replaceURI(geturlcalendartracker, "$msn", oData.msn);
	        geturlcalendartracker = airbus.mes.calendar.util.ModelManager.replaceURI(geturlcalendartracker, "$productionGroup", oData.prodGroup);
	       // geturlcalendartracker = airbus.mes.calendar.util.ModelManager.replaceURI(geturlcalendartracker, "$user", airbus.mes.calendar.util.AssignmentManager.userSelected);
	        //console.log(geturlcalendartracker);
	     	
	        oViewModel.loadData(geturlcalendartracker, null, true);

	    },
	    
	    onCalendarTrackerLoad : function() {

	        var GroupingBoxingManager = airbus.mes.calendar.util.GroupingBoxingManager;

	        GroupingBoxingManager.computeCalendarHierarchy();

	        airbus.mes.shell.busyManager.unsetBusy(airbus.mes.calendar.oView);

	    },
	    
	    loadRessourcePool : function() {

	        var oData = airbus.mes.settings.ModelManager;
	        var oViewModel = airbus.mes.calendar.oView.getModel("ressourcePoolModel");
	        var geturlRessourcePool = this.urlModel.getProperty('urlRessourcePoolModel');
	        
	        oViewModel.loadData(geturlRessourcePool, null, true);
	    	
	    },
	    
	    onRessourcePoolLoad : function() {

	        var aModel = airbus.mes.calendar.oView.getModel("ressourcePoolModel");

	        if (aModel.getProperty("/Rowsets/Rowset/0/Row")) {

	            aModel.oData.Rowsets.Rowset[0].Row.unshift({
	                "RESSOURCE_ID" : "ALL",
	                "RESSOURCE_DESC" : "ALL",
	            });

	            aModel.oData.Rowsets.Rowset[0].Row = aModel.oData.Rowsets.Rowset[0].Row.reduce(function(field, e1){
	                var matches = field.filter(function(e2){return e1.RESSOURCE_ID === e2.RESSOURCE_ID});
	                if (matches.length === 0){
	                    field.push(e1);
	                }return field;
	            }, []);

	            airbus.mes.calendar.oView.getModel("ressourcePoolModel").refresh(true);

	        } else {
	            console.log("NO ressource pool load");
	        }

	    },
	    
	  
};

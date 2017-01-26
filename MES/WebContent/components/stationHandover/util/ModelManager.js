"use strict";
jQuery.sap.declare("airbus.mes.stationHandover.util.ModelManager");

airbus.mes.stationHandover.util.ModelManager = {
       urlModel : undefined,
       queryParams : jQuery.sap.getUriParameters(),
       i18nModel : undefined,

       
       init : function(core) {
    	  
    	   var aModel = ["testModel"]
    	   airbus.mes.shell.ModelManager.createJsonModel(core,aModel);
           
           //core.getModel("stationHandovershiftsModel").attachRequestCompleted(airbus.mes.stationHandover.util.ModelManager.onShiftsLoad);
                
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
					oModel[prop] += "&j_user=" + Cookies.getJSON("login").user
							+ "&j_password=" + Cookies.getJSON("login").mdp;
				}
			}
		}
		
		this.loadTest();
	},
	
	/* *********************************************************************** *
	 *  Replace URL Parameters                                                 *
	 * *********************************************************************** */
	replaceURI : function(sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},
	
	 loadTest : function() {

	        var oViewModel = airbus.mes.stationHandover.oView.getModel("testModel");
	        var getUrlShifts = this.urlModel.getProperty("urltest");
	        var oData = airbus.mes.settings.ModelManager;
	       
	        oViewModel.loadData(getUrlShifts, null, false);

	 },
	    
	    onShiftsLoad : function() {

	        var GroupingBoxingManager = airbus.mes.stationHandover.util.GroupingBoxingManager;
	        GroupingBoxingManager.parseShift();
	    },
	  	  	    
	  
};

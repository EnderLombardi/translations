"use strict";
jQuery.sap.declare("airbus.mes.calendar.ModelManager");

airbus.mes.calendar.ModelManager = {
       urlModel : undefined,
       queryParams : jQuery.sap.getUriParameters(),
       i18nModel : undefined,

       
       init : function(core) {
    	  
    	   var aModel = ["testModel"]
    	   
    	   airbus.mes.shell.ModelManager.createJsonModel(core,aModel);
    	   this.settings = airbus.mes.settings.ModelManager;
           
          // core.getModel("stationTrackerRModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onStationTrackerLoad);
        
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
			bundleName : "airbus.mes.stationtracker.config.url_config",
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


	},


	
};

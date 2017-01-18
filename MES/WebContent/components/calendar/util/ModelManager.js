"use strict";
jQuery.sap.declare("airbus.mes.calendar.util.ModelManager");

airbus.mes.calendar.util.ModelManager = {
       urlModel : undefined,
       queryParams : jQuery.sap.getUriParameters(),
       i18nModel : undefined,

       
       init : function(core) {
    	  
    	   var aModel = ["testModel"]
    	   airbus.mes.shell.ModelManager.createJsonModel(core,aModel);
           
    	   core.getModel("testModel").attachRequestCompleted(airbus.mes.calendar.util.ModelManager.toto);
        
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

		//this.loadExample();

	},
	
	loadExample : function() {

		var geturlAffectation = this.urlModel.getProperty('urlaffectation');
		var oViewModel = airbus.mes.calendar.oView.getModel("testModel");
		oViewModel.loadData(geturlAffectation, null, false);

	},
	
	toto : function() {
		
		
		
	}


	
};

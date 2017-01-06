"use strict";
jQuery.sap.declare("airbus.mes.disruptions.attachments.ModelManager")
airbus.mes.disruptions.attachments.ModelManager = {
		urlModel : undefined,
		queryParams : jQuery.sap.getUriParameters(),
		
		i18nModel: undefined,
				
		init : function(core) {
			
	    	   var aModel = ["attachDisruption"]; // Model having list of attachments for disruptions
	    	                 
	    	   
	    	   airbus.mes.shell.ModelManager.createJsonModel(core,aModel);
		
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
				bundleUrl : "../components/disruptions/attachments/config/url_config.properties",
				bundleLocale : dest
			});
			
			if (  dest === "sopra" ) {

				var oModel = airbus.mes.disruptions.attachments.ModelManager.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;
					
				for (var prop in oModel) {
					if (oModel[prop].slice(-5) != ".json" ) {
					oModel[prop] += "&j_user=" + Cookies.getJSON("login").user + "&j_password="  + Cookies.getJSON("login").mdp; 
					}
				}
			}
							
			// TODO DEPLACE this in shell controller and when service is ok remove all of this function
			this.attachmentDisruptions();		
			//this.loadUserSettings();
			
//			var i18nModel = new sap.ui.model.resource.ResourceModel({
//	            bundleUrl : "./i18n/i18n.properties",
//	         });
//			
//			core.setModel(i18nModel, "ShellI18n");
			
//			var MIIi18nModel = new sap.ui.model.resource.ResourceModel({
//	            bundleUrl : "./i18n/mii_i18n.properties",
//	         });
//			core.setModel(MIIi18nModel, "miiI18n");
		},
		
		attachmentDisruptions : function() {
			
			var oViewModel = sap.ui.getCore().getModel("attachDisruption");
			oViewModel.loadData(this.urlModel.getProperty("attachmentDisruption"), null, false);
		
		},
}

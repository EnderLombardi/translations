"use strict";
jQuery.sap.declare("airbus.mes.disruptions.attachments.ModelManager")
airbus.mes.disruptions.attachments.ModelManager = {
		urlModel : undefined,
		
		i18nModel: undefined,
				
		init : function(core) {
			
    	   var aModel = ["attachDisruption"]; // Model having list of attachments for disruptions
	    	                 
	    	   
    	   airbus.mes.shell.ModelManager.createJsonModel(core,aModel);
		
			// Handle URL Model
			this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.disruptions.attachments.config.url_config");
							
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

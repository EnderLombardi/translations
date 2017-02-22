"use strict";
jQuery.sap.declare("airbus.mes.qdc.ModelManager")
airbus.mes.qdc.ModelManager = {
		urlModel : undefined,
		
		i18nModel: undefined,
				
		init : function(core) {
			
    	   var aModel = ["QDCModel"]; // Model having list of attachments for disruptions
	    	                 
	    	   
    	   airbus.mes.shell.ModelManager.createJsonModel(core,aModel);
		
			// Handle URL Model
			this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.qdc.config.url_config");
							
			// TODO DEPLACE this in shell controller and when service is ok remove all of this function
			this.loadQDCModel();
		},
		
		loadQDCModel: function() {
			
			var oViewModel = sap.ui.getCore().getModel("QDCModel");
			oViewModel.loadData(this.urlModel.getProperty("QDCModelData"), null, false);
		
		},
		
		loadQDCData : function(){
			var rep = jQuery.ajax({
				async : false,
				url : this.urlModel.getProperty('QDCDataurl'),
				type : 'POST',
			});
			return JSON.parse(rep.responseText);
		},
}

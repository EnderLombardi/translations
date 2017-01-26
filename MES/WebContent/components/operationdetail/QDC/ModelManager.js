"use strict";
jQuery.sap.declare("airbus.mes.operationdetail.QDC.ModelManager")
airbus.mes.operationdetail.QDC.ModelManager = {
		urlModel : undefined,
		
		i18nModel: undefined,
				
		init : function(core) {
			
    	   var aModel = ["QDCModel"]; // Model having list of attachments for disruptions
	    	                 
	    	   
    	   airbus.mes.shell.ModelManager.createJsonModel(core,aModel);
		
			// Handle URL Model
			this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.operationdetail.QDC.attachments.config.url_config");
							
			// TODO DEPLACE this in shell controller and when service is ok remove all of this function
			this.loadQDCModel();	
		},
		
		loadQDCModel: function() {
			
			var oViewModel = sap.ui.getCore().getModel("QDCModel");
			oViewModel.loadData(this.urlModel.getProperty("QDCModelData"), null, false);
		
		},
}

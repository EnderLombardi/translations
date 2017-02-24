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
			this.loadQDCData();
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
				data : JSON.stringify({
					"Site" : "FNZ1",
					"st_langu" : airbus.mes.shell.RoleManager.profile.connectedUser.Language,
					"st_Application_Id" : "MES",
					"st_work_order" : sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no,
					"st_work_order_oper" : sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_id
					
				}),
			});
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(JSON.parse(rep.responseText))
			sap.ui.getCore().setModel(oModel,"GetQDCDataModel")
		},
}

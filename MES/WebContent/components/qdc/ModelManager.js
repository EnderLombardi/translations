"use strict";
jQuery.sap.declare("airbus.mes.qdc.ModelManager")
airbus.mes.qdc.ModelManager = {
	urlModel : undefined,

	i18nModel : undefined,

	init : function(core) {

		var aModel = [ "QDCModel" ]; // Model having list of attachments for disruptions

		airbus.mes.shell.ModelManager.createJsonModel(core, aModel);

		// Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.qdc.config.url_config");
		this.loadQDCModel();
		this.loadQDCData();
		this.loadQACheckModel();
	},

	loadQDCModel : function() {

		var oViewModel = sap.ui.getCore().getModel("QDCModel");
		oViewModel.loadData(this.urlModel.getProperty("QDCModelData"), null, false);

	},

	loadQDCData : function() {
		var rep = jQuery.ajax({
			async : false,
			url : this.urlModel.getProperty('QDCDataurl'),
			type : 'POST',
			data : JSON.stringify({
				"Site" : sap.ui.getCore().getModel("userSettingModel").oData.Rowsets.Rowset[0].Row[0].site,
				"st_langu" : airbus.mes.shell.RoleManager.profile.connectedUser.Language,
				"st_Application_Id" : "MES",
				"st_work_order" : sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no,
				"st_work_order_oper" : sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_id

			}),
		});
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(JSON.parse(rep.responseText))
		sap.ui.getCore().setModel(oModel, "GetQDCDataModel")
	},
	
	loadQACheckModel : function(){
		var rep = jQuery.ajax({
			async : false,
			url : this.urlModel.getProperty('QACheckurl'),
			type : 'POST',
			data : JSON.stringify({
				"site":"FNZ1",
				"userBOList":["UserBO:FNZ1,NG56D2A"],
				"sfcStepBOList":["SFCStepBO:SFCRouterBO:SFCRoutingBO:SFCBO:FNZ1,11016372-0258,RouterBO:FNZ1,11016372-F212.18470.000,U,A,1,30"],
				"mode":"assignment"

			}),
		});		
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(JSON.parse(rep.responseText))
		sap.ui.getCore().setModel(oModel, "QACheckModel")
	}
}

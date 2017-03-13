"use strict";
jQuery.sap.declare("airbus.mes.qdc.util.ModelManager")
airbus.mes.qdc.util.ModelManager = {
	urlModel : undefined,

	i18nModel : undefined,

	init : function(core) {

		var aModel = [ "QDCModel", "GetQDCDataModel" ]; // Model having list of attachments for
										// disruptions

		airbus.mes.shell.ModelManager.createJsonModel(core, aModel);

		// Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.qdc.config.url_config");
	},

	loadQDCModel : function() {

		var oViewModel = sap.ui.getCore().getModel("QDCModel");
		oViewModel.loadData(this.urlModel.getProperty("QDCModelData"), null, false);

	},

	loadQDCData : function() {
        var url = this.urlModel.getProperty('QDCDataurl');
//      Param.1=$Site&Param.2=$st_langu&Param.3=$st_Application_Id&Param.4=$st_work_order&Param.5=$st_work_order_oper
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$Site", airbus.mes.settings.ModelManager.site);
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$st_langu", airbus.mes.shell.RoleManager.profile.connectedUser.Language);
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$st_Application_Id", "MES");		
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$st_work_order", sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no);        
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$st_work_order_oper", sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_id);
        
		jQuery.ajax({
			url : url,
			type : 'POST',
			async : true,

			success : function(data) {
				sap.ui.getCore().getModel("GetQDCDataModel").setData(data);

				airbus.mes.qdc.oView.getController().enableButtons();

			},
			error : function(error, jQXHR) {
				console.log(error);

			}
		});

	},

	loadQACheckModel : function() {
		var site = sap.ui.getCore().getModel("userSettingModel").oData.Rowsets.Rowset[0].Row[0].site;
		var sUser = airbus.mes.shell.RoleManager.profile.connectedUser.IllumLoginName;
		var sfcStepRef = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref;
		jQuery.ajax({
			url : this.urlModel.getProperty('QACheckurl'),
			type : 'POST',
			async : true,
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : site,
				"userBOList" : [ "UserBO:" + site + "," + sUser ],
				"sfcStepBOList" : [ sfcStepRef ],
				"mode" : "assignment"

			}),
			success : function(data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(data)
				sap.ui.getCore().setModel(oModel, "QACheckModel")
			},
			error : function(error, jQXHR) {
				console.log(error);

			}
		});

	}
}

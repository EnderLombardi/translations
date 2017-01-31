"use strict";
jQuery.sap.declare("airbus.mes.jigtools.util.ModelManager")

airbus.mes.jigtools.util.ModelManager = {

	urlModel : undefined,
	
	// variable for filter
	productionOrder : "P",
	operation : "O",

//	variable for operation
	workOrder : undefined,
		
	badgeReader:undefined,
	brOnMessageCallBack:function (data) {},

	init : function(core) {

		this.core = core;

		this.workOrder = airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].wo_no;		
		
	    // Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.jigtools.config.url_config");
		
		//"jigToolsConfigModel", 
		airbus.mes.shell.ModelManager.createJsonModel(core,["jigToolsWorkOrderDetail"]);
		this.loadjigToolsWorkOrderDetail();
		
	},

	//load
	loadjigToolsWorkOrderDetail : function() {
		var ddata;
		var that = this;
        var oViewModel = sap.ui.getCore().getModel("jigToolsWorkOrderDetail");
//        airbus.mes.stationtracker.oView.byId("boxTaktAdherenceRight").setBusy(true);
        jQuery.ajax({
            type : 'post',
            url : this.urlModel.getProperty("jigToolsWorkOrderDetail"),
            contentType : 'application/json',
            data : JSON.stringify({
                "site" : "FNZ1", //airbus.mes.settings.ModelManager.site,
                "shopOrder" : "112307" //this.workOrder
            }),

            success : function(data) {
                if(typeof data == "string"){
                	that.ddata = data;
                    data = JSON.parse(data);
                }
                oViewModel.setData(data);
//                airbus.mes.stationtracker.oView.byId("boxTaktAdherenceRight").setBusy(false);
            },

            error : function(error, jQXHR) {
                console.log(error);
//                airbus.mes.stationtracker.oView.byId("boxTaktAdherenceRight").setBusy(false);

            }
        });
		
//		var oModel = sap.ui.getCore().getModel("jigToolsWorkOrderDetail");
//		oModel.loadData(this.getjigToolsWorkOrderDetail(), null, false);
	},
	
	//get 
//	getjigToolsWorkOrderDetail : function() {
//		var url = this.urlModel.getProperty("jigToolsWorkOrderDetail");
//		url = airbus.mes.shell.ModelManager.replaceURI(url, "$site", airbus.mes.settings.ModelManager.site);
//		return url;
//	},
	


	
};

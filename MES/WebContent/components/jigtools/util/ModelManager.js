"use strict";
jQuery.sap.declare("airbus.mes.jigtools.util.ModelManager")

airbus.mes.jigtools.util.ModelManager = {

	urlModel : undefined,
	
	// variable for filter
	productionOrder : "P",
	operation : "O",

//	variable for operation
	site      : undefined,
	workOrder : undefined,
		

	init : function(core) {

		this.core = core;

		this.setProperties();		
		
	    // Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.jigtools.config.url_config");
		
		//"jigToolsConfigModel", 
		airbus.mes.shell.ModelManager.createJsonModel(core,["jigToolsWorkOrderDetail"]);
		this.loadjigToolsWorkOrderDetail();
		
	},

	//load
	loadjigToolsWorkOrderDetail : function() {
		
		this.workOrder = airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].wo_no;
		
        var oViewModel = sap.ui.getCore().getModel("jigToolsWorkOrderDetail");
//        airbus.mes.stationtracker.oView.byId("boxTaktAdherenceRight").setBusy(true);
        jQuery.ajax({
            type : 'post',
            url : this.urlModel.getProperty("jigToolsWorkOrderDetail"),
            contentType : 'application/json',
            data : JSON.stringify({
                "site" : airbus.mes.jigtools.oView.getController().getOwnerComponent().getSite(),
                "shopOrder" : airbus.mes.jigtools.oView.getController().getOwnerComponent().getWorkOrder()
            }),

            success : function(data) {
                if(typeof data == "string"){
                    data = JSON.parse(data);
                }
                oViewModel.setData(data);
            },

            error : function(error, jQXHR) {
                console.log(error);
            }
        });
		
	},
	setProperties : function() {
		this.site = airbus.mes.settings.ModelManager.site;
		this.workOrder = airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].wo_no;
	},

	
};

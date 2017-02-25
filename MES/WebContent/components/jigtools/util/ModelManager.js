"use strict";
jQuery.sap.declare("airbus.mes.jigtools.util.ModelManager")

airbus.mes.jigtools.util.ModelManager = {

	urlModel : undefined,
	
	// variable for filter
	workOrder : "P",
	operation : "O",

//	variable for operation
//	site      : undefined,
//	workOrder : undefined,
		

	init : function(core) {

		this.core = core;

	    // Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.jigtools.config.url_config");
		
		//"jigToolsConfigModel", 
		airbus.mes.shell.ModelManager.createJsonModel(core,["jigToolsWorkOrderDetail"]);
		this.loadjigToolsWorkOrderDetail();
		
	},

	//load
	loadjigToolsWorkOrderDetail : function() {
		
        var oViewModel = sap.ui.getCore().getModel("jigToolsWorkOrderDetail");

        jQuery.ajax({
            type : 'post',
            async : false,
            url : this.urlModel.getProperty("jigToolsWorkOrderDetail"),
            contentType : 'application/json',
            data : JSON.stringify({
                "site" : airbus.mes.jigtools.oView.getController().getOwnerComponent().getSite(),
                "shopOrder" : airbus.mes.jigtools.oView.getController().getOwnerComponent().getWorkOrder()
            }),

            success : function(data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                if (typeof data != "object" || data === null) {
                	/* In case the tool list is empty, we receive "null" */
                	data = { toolInfoList : [] };
                }
                data.toolInfoList = data.toolInfoList || [];
                if (!Array.isArray(data.toolInfoList)) {
                	/* In case the tool list contain one element, we receive an object */
                    data.toolInfoList = [ data.toolInfoList ];
                }
                oViewModel.setData(data);
                oViewModel.refresh();
            },

            error : function(error, jQXHR) {
                console.log(error);
            }
        });
		
	},
	
};

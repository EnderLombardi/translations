"use strict";
jQuery.sap.declare("airbus.mes.jigtools.util.ModelManager")

airbus.mes.jigtools.util.ModelManager = {

	urlModel : undefined,
	
//  constant for for filter
	workOrder : "P",
	operation : "O",

	/**
	 * Initialize all model for the component
	 * 
	 * @param {object} core object level to bind model
	 */
	init : function(core) {

		this.core = core;

//      Define configuration
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.jigtools.config.url_config");
		
//		Define and load model 
		airbus.mes.shell.ModelManager.createJsonModel(core,["jigToolsWorkOrderDetail"]);
		this.loadjigToolsWorkOrderDetail();
		
	},

	/**
	 * Load the tool model by calling the corresponding service  
	 */
	loadjigToolsWorkOrderDetail : function() {
		
//		Retrieve the tool model
		try {
			var oViewModel = sap.ui.getCore().getModel("jigToolsWorkOrderDetail");
		} catch(oException) {
			console.log("error when getting tool model");
		}
        
//      Launch the service 
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
 //					In case the tool list is empty, we receive "null"
                	data = { toolInfoList : [] };
                }
                data.toolInfoList = data.toolInfoList || [];
                if (!Array.isArray(data.toolInfoList)) {
//					In case the tool list contain one element, we receive an object
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

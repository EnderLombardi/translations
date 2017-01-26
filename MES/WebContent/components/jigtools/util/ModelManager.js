"use strict";
jQuery.sap.declare("airbus.mes.jigtools.util.ModelManager")

airbus.mes.jigtools.util.ModelManager = {

	urlModel : undefined,
	currentOperator : {
		'fname' : undefined,
		'lname' : undefined,
		'user_id' : undefined,
		'image' : undefined
	},
	
	// variable for filter
	productionOrder : "P",
	operation : "O",
	
	badgeReader:undefined,
	brOnMessageCallBack:function (data) {},

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
		var oModel = sap.ui.getCore().getModel("jigToolsWorkOrderDetail");
		oModel.loadData(this.getjigToolsWorkOrderDetail(), null, false);
	},
	
	//get 
	getjigToolsWorkOrderDetail : function() {
		var url = this.urlModel.getProperty("jigToolsWorkOrderDetail");
		url = airbus.mes.shell.ModelManager.replaceURI(url, "$site", airbus.mes.settings.ModelManager.site);
		return url;
	},
	


	
};

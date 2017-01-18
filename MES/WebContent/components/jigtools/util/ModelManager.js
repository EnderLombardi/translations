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
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {

		this.core = core;

		var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "local";
			break;
		case "wsapbpc01.ptx.fr.sopra":
			dest = "sopra";
			break;
		default:
			dest = "airbus";
			break;
		}

		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleName : "airbus.mes.jigtools.config.url_config",
			bundleLocale : dest
		});
		
		if ( dest === "sopra" ) {

			var oModel = this.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;
				
			for (var prop in oModel) {
				if (oModel[prop].slice(-5) != ".json" ) {
				oModel[prop] += "&j_user=" + Cookies.getJSON("login").user + "&j_password="  + Cookies.getJSON("login").mdp; 
				}
			}
		}
		
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

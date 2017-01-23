"use strict";
jQuery.sap.declare("airbus.mes.components.util.ModelManager")

airbus.mes.components.util.ModelManager = {

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
			bundleName : "airbus.mes.components.config.url_config",
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
		
		//"componentsConfigModel", 
		airbus.mes.shell.ModelManager.createJsonModel(core,["componentsWorkOrderDetail"]);
		this.loadcomponentsWorkOrderDetail();
	},

	//load
	loadcomponentsWorkOrderDetail : function() {
		var oModel = sap.ui.getCore().getModel("componentsWorkOrderDetail");
		oModel.loadData(this.getcomponentsWorkOrderDetail(), null, false);
	},
	
	//get 
	getcomponentsWorkOrderDetail : function() {
		var url = this.urlModel.getProperty("componentsWorkOrderDetail");
		url = airbus.mes.shell.ModelManager.replaceURI(url, "$site", airbus.mes.settings.ModelManager.site);
		return url;
	},
};

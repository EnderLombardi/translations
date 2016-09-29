"use strict";

jQuery.sap.declare("airbus.mes.worktracker.ModelManager")

airbus.mes.worktracker.util.ModelManager = {
	
	
	urlModel : undefined,
	site:"CHES",
	operation:"50000111-1-0-0001",
	
	queryParams : jQuery.sap.getUriParameters(),
	
	
	
	init : function(core) {
		
		this.core = core;
		
		core.setModel(new sap.ui.model.json.JSONModel(), "singleOperation");
		

		var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "sopra";
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
			bundleUrl : "../components/worktracker/config/url_config.properties",
			bundleLocale : dest
		});

	},
	
	// ************************************************************************************
	/*getUrlSingleOperation : function() {
		var urlSingleOperation = this.urlModel.getProperty("startSingleOperation");
		
		return urlSingleOperation;
	},

	loadSiteModel : function() {
		var oViewModel = this.core.getModel("singleOperation");
		oViewModel.loadData(airbus.mes.worktracker.util.ModelManager.getUrlSingleOperation(), null, false);
	},*/
	// ********************************************************************************
	
	 getUrlSingleOperation:function(){
		  var urlSingleOperation = this.urlModel.getProperty("startSingleOperation");
		  urlSingleOperation = airbus.mes.worktracker.util.ModelManager.replaceURI(urlSingleOperation, "$site", airbus.mes.worktracker.util.ModelManager.site);
		  urlSingleOperation = airbus.mes.worktracker.util.ModelManager.replaceURI(urlSingleOperation, "$operation", airbus.mes.worktracker.util.ModelManager.operation);
		  
		  return urlSaveUserSetting;
	  },
	  replaceURI : function (sURI, sFrom, sTo) {
			return sURI.replace(sFrom, encodeURIComponent(sTo));
		}


};
airbus.mes.worktracker.util.ModelManager.init(sap.ui.getCore());

"use strict";

jQuery.sap.declare("airbus.mes.worktracker.util.ModelManager")

airbus.mes.worktracker.util.ModelManager = {
	
	
	urlModel : undefined,
	sfc:undefined,
	operation:undefined,
	
	queryParams : jQuery.sap.getUriParameters(),
	
	
	
	init : function(core) {
		
		this.core = core;
		
	/*	core.setModel(new sap.ui.model.json.JSONModel(), "singleOperation");*/
		

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
			bundleUrl : "../worktracker/config/url_config.properties",
			bundleLocale : dest
		});

	},
	// ********************************************************************************
	 messageShow : function(text) {
	        sap.m.MessageToast
	        .show(
	        		text,
	                      {
	                             duration : 3000,
	                             width : "25em",
	                             my : "center center",
	                             at : "center center",
	                             of : window,
	                             offset : "0 0",
	                             collision : "fit fit",
	                             onClose : null,
	                             autoClose : true,
	                             animationTimingFunction : "ease",
	                             animationDuration : 1000,
	                             closeOnBrowserNavigation : true
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
		  urlSingleOperation = airbus.mes.worktracker.util.ModelManager.replaceURI(urlSingleOperation, "$operation", airbus.mes.worktracker.util.ModelManager.operation);
		  urlSingleOperation = airbus.mes.worktracker.util.ModelManager.replaceURI(urlSingleOperation, "$SFC", airbus.mes.worktracker.util.ModelManager.sfc);
		  
		  return urlSingleOperation;
	  },
	  replaceURI : function (sURI, sFrom, sTo) {
			return sURI.replace(sFrom, encodeURIComponent(sTo));
		}


};
airbus.mes.worktracker.util.ModelManager.init(sap.ui.getCore());

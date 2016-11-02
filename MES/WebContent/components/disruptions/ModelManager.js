"use strict";

jQuery.sap.declare("airbus.mes.disruptions.ModelManager")

airbus.mes.disruptions.ModelManager = {


	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {

		this.core = core;

		var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "local";
			break;
		default:
			dest = "local";
			break;
		}

		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "../components/disruptions/config/url_config.properties",
			bundleLocale : dest
		});

		this.core.setModel(new sap.ui.model.json.JSONModel(), "disruptionCustomData");
		this.core.setModel(new sap.ui.model.json.JSONModel(), "DisruptionDetail");
		
		this.loadDisruptionCustomData();

	},
	
	/***************************************************************************
	 * Replace URL Parameters
	 **************************************************************************/
	replaceURI : function(sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},

	/***************************************************************************
	 * Set the Models for Custom Data of create Disruption
	 **************************************************************************/
	loadDisruptionCustomData : function() {
		var oModel = sap.ui.getCore().getModel("disruptionCustomData");
		oModel.loadData(this.getDisruptionCustomData(), null, false);
	},
	getDisruptionCustomData : function() {
		var urlCustomData = this.urlModel.getProperty("urlCustomData");
		urlCustomData = airbus.mes.operationdetail.ModelManager.replaceURI(
				urlCustomData, "$site", "CHES");
		urlCustomData = airbus.mes.operationdetail.ModelManager.replaceURI(
				urlCustomData, "$station", "STATION40");
		return urlCustomData;

	},
	loadDisruptionsByOperation: function(operation) {
		var oViewModel = sap.ui.getCore().getModel("DisruptionDetail");
		
		var getDiruptionsURL = this.urlModel.getProperty("getDiruptionsURL");
		
		getDiruptionsURL = getDiruptionsURL.replace('$Site', airbus.mes.settings.ModelManager.site);
		getDiruptionsURL = getDiruptionsURL.replace('$Operation', operation);
		
		oViewModel.loadData(this.urlModel.getProperty("getDiruptionsURL"), null, false);
	}
};


	
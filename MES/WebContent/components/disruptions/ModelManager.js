"use strict";

jQuery.sap.declare("airbus.mes.disruptions.ModelManager")

airbus.mes.disruptions.ModelManager = {


	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {

		this.core = core;
		
		core.setModel(new sap.ui.model.json.JSONModel(), "operationDisruptionsModel");
			

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
	 * Set the Models for Custom Data of create Disruption
	 **************************************************************************/
	loadDisruptionCustomData : function() {
		var oModel = sap.ui.getCore().getModel("disruptionCustomData");
		oModel.loadData(this.getDisruptionCustomData(), null, false);
	},
	getDisruptionCustomData : function() {
		var urlCustomData = this.urlModel.getProperty("urlCustomData");
		urlCustomData = airbus.mes.shell.ModelManager.replaceURI(
				urlCustomData, "$site", airbus.mes.settings.ModelManager.site);
		urlCustomData = airbus.mes.shell.ModelManager.replaceURI(
				urlCustomData, "$station", airbus.mes.settings.ModelManager.station);
		return urlCustomData;

	},
	
	
	/******************************************
	 * Generic Function to get URL for to get Disruptions 
	 * with filters or no filters
	 */
	getDisruptionsURL: function(oFilters) {
		var getDiruptionsURL = this.urlModel.getProperty("getDiruptionsURL");
		
		getDiruptionsURL = getDiruptionsURL.replace('$Site', airbus.mes.settings.ModelManager.site);
		getDiruptionsURL = getDiruptionsURL.replace('$Status', "ALL");
		getDiruptionsURL = getDiruptionsURL.replace('$Resource', "");
		

		if(oFilters.operation != undefined && oFilters.operation != "")
			getDiruptionsURL = getDiruptionsURL.replace('$Operation', oFilters.operation);
		else
			getDiruptionsURL = getDiruptionsURL.replace('$Operation', "");
		
		getDiruptionsURL = getDiruptionsURL.replace('$SFC', "");
		getDiruptionsURL = getDiruptionsURL.replace('$OperationRevision', "");
		getDiruptionsURL = getDiruptionsURL.replace('$SignalFlag', "");
		getDiruptionsURL = getDiruptionsURL.replace('$FromDate', "");
		getDiruptionsURL = getDiruptionsURL.replace('$ToDate', ""); 
		
		if(oFilters.station != undefined && oFilters.station != "")
			getDiruptionsURL = getDiruptionsURL.replace('$WorkCenter', oFilters.station);
		else
			getDiruptionsURL = getDiruptionsURL.replace('$WorkCenter', "");
		
		getDiruptionsURL = getDiruptionsURL.replace('$userGroup', "");
		getDiruptionsURL = getDiruptionsURL.replace('$MessageType', "");
		
		return getDiruptionsURL;
	},
	
	
	/********************************************
	 * Load Disruptions for a single operation
	 */
	loadDisruptionsByOperation: function(operation){
		var oViewModel = sap.ui.getCore().getModel("operationDisruptionsModel");
		
		var getDisruptionsURL = airbus.mes.disruptions.ModelManager.getDisruptionsURL({
			"operation": operation
		});
		
		oViewModel.loadData(getDisruptionsURL, null, false);
	},
	
	/********************************
	 * Create Disruption service
	 */
	
	getURLCreateDisruption : function(){
		var urlCreateDisruption = this.urlModel.getProperty("urlCreateDisruption");
		return urlCreateDisruption;
	},
	createDisruption : function(messageType,messageSubject,messageBody,payloadData) {
		jQuery.ajax({
			async : true,
			cache : false,
			url : this.getURLCreateDisruption(),
			type : 'POST',
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.3" : messageType,
				"Param.4" : messageSubject,
				"Param.5" : messageBody,
				"Param.6" : airbus.mes.disruptions.Formatter.json2xml({
					payloadAttributelist : payloadData
					})
			},
			success : function(data, textStatus, jqXHR) {
				var rowExists = data.Rowsets.Rowset;
				if (rowExists != undefined) {
					if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {

						this.messageShow(data.Rowsets.Rowset[0].Row[0].Message);
					} else {
						this.messageShow("Error in Success");
					}
				} else {
					if (data.Rowsets.FatalError) {
						this.messageShow(data.Rowsets.FatalError);
					} else {
						this.messageShow("Success");
					}
				}

			},
			error : function() {
				this.messageShow("Error in Error")
				
			}

		});

	},
	
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
               
  }

};


	

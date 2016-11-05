"use strict";

jQuery.sap.declare("airbus.mes.disruptions.ModelManager")

airbus.mes.disruptions.ModelManager = {

	urlModel : undefined,
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {

		this.core = core;

		core.setModel(new sap.ui.model.json.JSONModel(), "operationDisruptionsModel");
		core.setModel(new sap.ui.model.json.JSONModel(), "commentsModel");
	
		sap.ui.getCore().getModel("operationDisruptionsModel").attachRequestCompleted(airbus.mes.disruptions.ModelManager.onOperationDisruptionsLoad);
		sap.ui.getCore().getModel("commentsModel").attachRequestCompleted(airbus.mes.disruptions.ModelManager.onCommentsLoad);

		core.setModel(new sap.ui.model.json.JSONModel(),
		"DisruptionModel");

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

		this.urlModel = new sap.ui.model.resource.ResourceModel(
				{
					bundleUrl : "../components/disruptions/config/url_config.properties",
					bundleLocale : dest
				});

		this.core.setModel(new sap.ui.model.json.JSONModel(),
				"disruptionCustomData");
		
		this.core.setModel(new sap.ui.model.json.JSONModel(), "disruptionCategoryModel")

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
		urlCustomData = airbus.mes.shell.ModelManager.replaceURI(urlCustomData,
				"$site", airbus.mes.settings.ModelManager.site);
		urlCustomData = airbus.mes.shell.ModelManager.replaceURI(urlCustomData,
				"$station", airbus.mes.settings.ModelManager.station);
		return urlCustomData;

	},
	
	
	/***************************************************************************
	 * Set the Models for Category of Disruption Creation
	 **************************************************************************/
	loadDisruptionCategory : function() {
		var oModel = sap.ui.getCore().getModel("disruptionCategoryModel");
		oModel.loadData(this.getDisruptionCategory(), null, false);
	},
	getDisruptionCategory : function() {
		var urlCustomCategory = this.urlModel.getProperty("urlCustomCategory");
		urlCustomCategory = airbus.mes.shell.ModelManager.replaceURI(urlCustomCategory,
				"$site", airbus.mes.settings.ModelManager.site);
		urlCustomCategory = airbus.mes.shell.ModelManager.replaceURI(urlCustomCategory,
				"$station", airbus.mes.settings.ModelManager.station);
		return urlCustomCategory;

	},

	/***************************************************************************
	 * Generic Function to get URL for to get Disruptions with filters or no
	 * filters
	 */
	getDisruptionsURL : function(oFilters) {
		var getDiruptionsURL = this.urlModel.getProperty("getDiruptionsURL");

		getDiruptionsURL = getDiruptionsURL.replace('$Site',
				airbus.mes.settings.ModelManager.site);
		getDiruptionsURL = getDiruptionsURL.replace('$Status', "ALL");
		getDiruptionsURL = getDiruptionsURL.replace('$Resource', "");

		if (oFilters.operation != undefined && oFilters.operation != "")
			getDiruptionsURL = getDiruptionsURL.replace('$Operation',
					oFilters.operation);
		else
			getDiruptionsURL = getDiruptionsURL.replace('$Operation', "");

		getDiruptionsURL = getDiruptionsURL.replace('$SFC', "");
		getDiruptionsURL = getDiruptionsURL.replace('$OperationRevision', "");
		getDiruptionsURL = getDiruptionsURL.replace('$SignalFlag', "");
		getDiruptionsURL = getDiruptionsURL.replace('$FromDate', "");
		getDiruptionsURL = getDiruptionsURL.replace('$ToDate', "");

		if (oFilters.station != undefined && oFilters.station != "")
			getDiruptionsURL = getDiruptionsURL.replace('$WorkCenter',
					oFilters.station);
		else
			getDiruptionsURL = getDiruptionsURL.replace('$WorkCenter', "");

		getDiruptionsURL = getDiruptionsURL.replace('$userGroup', "");
		getDiruptionsURL = getDiruptionsURL.replace('$MessageType', "");

		return getDiruptionsURL;
	},

	/***************************************************************************
	 * Load Disruptions for a single operation
	 */
	loadDisruptionsByOperation : function(operation) {
		
//		airbus.mes.operationdetail.oView.setBusy(true); //Set Busy Indicator 
		
		var oViewModel = sap.ui.getCore().getModel("operationDisruptionsModel");

		var getDisruptionsURL = airbus.mes.disruptions.ModelManager
				.getDisruptionsURL({
					"operation" : operation
				});

		oViewModel.loadData(getDisruptionsURL, null, false);
		
		
	},
	
	/**************************************************************************
	 * After Disruptions related to a operation is loaded
	 */
	onOperationDisruptionsLoad: function(){
		airbus.mes.disruptions.ModelManager.loadComments();
	},
	
	/*************************************************************************
	 * Load Comments for all the disruptions of an operation
	 */
	loadComments: function(){
		var oModel = sap.ui.getCore().getModel("commentsModel");
		oModel.loadData("../components/disruptions/local/commentsModel.json", null, false);
	},
	
	/**************************************************************************
	 * After Comments is loaded
	 */
	onCommentsLoad: function(){
		
		/* Set filter for Comments on all the disruptions */
		airbus.mes.operationdetail.viewDisruption.oView.getController().applyFiltersOnComments();
	
		airbus.mes.operationdetail.oView.setBusy(false); //Set Busy Indicator false
	},
	

	/***************************************************************************
	 * Create Disruption service
	 */

	getURLCreateDisruption : function() {
		airbus.mes.operationdetail.oView.setBusy(true); //Set Busy Indicator
		var urlCreateDisruption = this.urlModel
				.getProperty("urlCreateDisruption");
		return urlCreateDisruption;
	},

	createDisruption : function(messageType, messageSubject, messageBody,
			payloadData) {
		jQuery
				.ajax({
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
						airbus.mes.operationdetail.oView.setBusy(false); //Remove Busy Indicator
						var rowExists = data.Rowsets.Rowset;
						if (rowExists != undefined) {
							if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {
								airbus.mes.shell.ModelManager.messageShow(data.Rowsets.Rowset[0].Row[0].Message);
							} else if (data.Rowsets.Rowset[0].Row[0].Message_Type == "E"){
								if(data.Rowsets.Rowset[0].Row[0].Message === undefined)
									airbus.mes.shell.ModelManager.messageShow(airbus.mes.operationdetail.createDisruption.oView.getModel("i18nModel").getProperty("DisruptionNotSaved"));
								else
									airbus.mes.shell.ModelManager.messageShow(data.Rowsets.Rowset[0].Row[0].Message)	
							}
						} else {
							if (data.Rowsets.FatalError) {
								airbus.mes.shell.ModelManager.messageShow(data.Rowsets.FatalError);
							}
						}

					},

			error : function() {
				airbus.mes.operationdetail.oView.setBusy(false); //Remove Busy Indicator
				airbus.mes.shell.ModelManager.messageShow(airbus.mes.operationdetail.createDisruption.oView.getModel("i18nModel").getProperty("DisruptionNotSaved"));
				
			}

		});

	},

	escalateDisruption : function(msgRef) {
		var sMessageSuccess = "Escalation Successful";
		var flag_success;

		jQuery
				.ajax({
					url : this.getUrlOnEscalate(),
					data : {
						"Param.1" : msgRef
					},
					async : false,
					error : function(xhr, status, error) {
						airbus.mes.shell.ModelManager
								.messageShow(sMessageError);
						flag_success = false

					},
					success : function(result, status, xhr) {
						if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
							airbus.mes.shell.ModelManager
									.messageShow(sMessageSuccess);
							flag_success = true;
						} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
							flag_success = false;
						} else {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
							flag_success = true;
						}

					}
				});
	},

	/***************************************************************************
	 * Get URL on Escalate Button
	 **************************************************************************/
	getUrlOnEscalate : function() {

		var urlOnEscalate = this.urlModel.getProperty("urlOnEscalate");
		return urlOnEscalate;
	},
	
	
	
	/***************************************************************************
	 * Add Comment
	 **************************************************************************/
	addComment : function(oComment) {
		var sMessageSuccess = "Comment Added Successfully";
		var flag_success;

		jQuery
				.ajax({
					url : this.getUrlOnAddComment(),
					data : {
						"Param.1" : airbus.mes.settings.ModelManager.site,
						"Param.2" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
						"Param.3" : oComment.MessageRef,
						"Param.4" : oComment.Comment
					},
					error : function(xhr, status, error) {
						airbus.mes.shell.ModelManager
								.messageShow(sMessageError);
						flag_success = false

					},
					success : function(result, status, xhr) {
						if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
							airbus.mes.shell.ModelManager
									.messageShow(sMessageSuccess);
							flag_success = true;
						} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
							flag_success = false;
						} else {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
							flag_success = true;
						}
						
						// Add Comment to Model
						if(flag_success){
							var oModel = sap.ui.getCore().getModel("commentsModel");
							oModel.getProperty("/Rowsets/Rowset/0/Row").push(oComment);
							oModel.refresh();
						}

					}
				});		
		
	},
	
	/***************************************************************************
	 * Get URL on Add Comment
	 **************************************************************************/
	getUrlOnAddComment : function() {

		var urlOnAddComment = this.urlModel.getProperty("urlOnAddComment");
		return urlOnAddComment;
	},
};

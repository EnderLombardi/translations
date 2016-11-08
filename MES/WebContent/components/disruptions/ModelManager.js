"use strict";

jQuery.sap.declare("airbus.mes.disruptions.ModelManager")

airbus.mes.disruptions.ModelManager = {

	urlModel : undefined,
	queryParams : jQuery.sap.getUriParameters(),
	
	init : function(core) {

		this.core = core;

		core.setModel(new sap.ui.model.json.JSONModel(),
				"operationDisruptionsModel");

		sap.ui
				.getCore()
				.getModel("operationDisruptionsModel")
				.attachRequestCompleted(
						airbus.mes.disruptions.ModelManager.onOperationDisruptionsLoad);

		core.setModel(new sap.ui.model.json.JSONModel(),
				"DisruptionDetailModel");

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

		this.core.setModel(new sap.ui.model.json.JSONModel(),
				"disruptionCategoryModel");

		sap.ui
				.getCore()
				.getModel("disruptionCustomData")
				.attachRequestCompleted(
						airbus.mes.disruptions.ModelManager.onDisruptionCustomDataLoad);

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
	 * After Custom data for disruption is loaded
	 **************************************************************************/
	onDisruptionCustomDataLoad : function() {

		airbus.mes.operationdetail.oView.setBusy(false); // Set Busy Indicator false
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
		urlCustomCategory = airbus.mes.shell.ModelManager.replaceURI(
				urlCustomCategory, "$site",
				airbus.mes.settings.ModelManager.site);
		urlCustomCategory = airbus.mes.shell.ModelManager.replaceURI(
				urlCustomCategory, "$station",
				airbus.mes.settings.ModelManager.station);
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

		airbus.mes.operationdetail.oView.setBusy(true); // Set Busy Indicator

		var oViewModel = sap.ui.getCore().getModel("operationDisruptionsModel");

		var getDisruptionsURL = airbus.mes.disruptions.ModelManager
				.getDisruptionsURL({
					"operation" : operation
				});

		oViewModel.loadData(getDisruptionsURL, null, false);

	},

	/***************************************************************************
	 * After Disruptions related to a operation is loaded
	 */
	onOperationDisruptionsLoad : function() {

		/* Set filter for Comments on all the disruptions */
		airbus.mes.operationdetail.viewDisruption.oView.getController()
				.applyFiltersOnComments();

		airbus.mes.operationdetail.oView.setBusy(false); // Set Busy
		// Indicator false
	},

	/***************************************************************************
	 * Create Disruption service
	 */

	getURLCreateDisruption : function() {
		airbus.mes.operationdetail.oView.setBusy(true); // Set Busy Indicator
		var urlCreateDisruption = this.urlModel
				.getProperty("urlCreateDisruption");
		return urlCreateDisruption;
	},

	createDisruption : function(messageHandle, messageType, messageSubject,
			messageBody, payloadData) {

		jQuery
				.ajax({
					async : true,
					cache : false,
					url : this.getURLCreateDisruption(),
					type : 'POST',
					data : {
						"Param.1" : airbus.mes.settings.ModelManager.site,
						/*
						 * "Param.2" :
						 * sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
						 */
						"Param.2" : "NG000524",
						"Param.3" : messageType,
						"Param.4" : messageSubject,
						"Param.5" : messageBody,
						"Param.6" : airbus.mes.shell.ModelManager.json2xml({
							payloadAttributelist : payloadData,
							"Param.7" : messageHandle
						})
					},
					success : function(data, textStatus, jqXHR) {
						airbus.mes.operationdetail.oView.setBusy(false); // Remove
						// Busy
						// Indicator
						var rowExists = data.Rowsets.Rowset;
						if (rowExists != undefined) {
							if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {
								airbus.mes.shell.ModelManager
										.messageShow(data.Rowsets.Rowset[0].Row[0].Message);
								// navigate to View Disruption after message
								// success
								sap.ui
										.getCore()
										.byId(
												"operationDetailsView--operDetailNavContainer")
										.to(
												airbus.mes.operationdetail.viewDisruption.oView
														.getId());
								// load disruption Model again for new message
								var operationBO = sap.ui.getCore().getModel(
										"operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
								airbus.mes.disruptions.ModelManager
										.loadDisruptionsByOperation(operationBO);

							} else if (data.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
								if (data.Rowsets.Rowset[0].Row[0].Message === undefined)
									airbus.mes.shell.ModelManager
											.messageShow(airbus.mes.operationdetail.createDisruption.oView
													.getModel("i18nModel")
													.getProperty(
															"DisruptionNotSaved"));
								else
									airbus.mes.shell.ModelManager
											.messageShow(data.Rowsets.Rowset[0].Row[0].Message)
							}
						} else {
							if (data.Rowsets.FatalError) {
								airbus.mes.shell.ModelManager
										.messageShow(data.Rowsets.FatalError);
							}
						}

					},

					error : function() {
						airbus.mes.operationdetail.oView.setBusy(false); // Remove
						// Busy
						// Indicator
						airbus.mes.shell.ModelManager
								.messageShow(airbus.mes.operationdetail.createDisruption.oView
										.getModel("i18nModel").getProperty(
												"DisruptionNotSaved"));

					}

				});

	},
	
	/***************************************************************************
	 * Create Disruption service
	 */

	getURLUpdateDisruption : function() {
		airbus.mes.operationdetail.oView.setBusy(true); // Set Busy Indicator
		var urlUpdateDisruption = this.urlModel
				.getProperty("urlUpdateDisruption");
		return  urlUpdateDisruption;
	},

	updateDisruption : function(sMessageRef,sReason,sResponsibleGroup,sRootCause,iTimeLost,dFixedByTime,sComment,iGravity) {

		jQuery
				.ajax({
					async : true,
					cache : false,
					url : this.getURLUpdateDisruption(),
					type : 'POST',
					data : {
						"Param.1" : airbus.mes.settings.ModelManager.site,
						"Param.2" : sMessageRef,
						"Param.3" : sReason,
						"Param.4" : sResponsibleGroup,
						"Param.5" : sRootCause,
						"Param.6" : iTimeLost,
						"Param.7" : dFixedByTime,
						"Param.8" : sComment,
						"Param.9" : iGravity
					},
					success : function(data, textStatus, jqXHR) {
						
						// Remove Busy Indicator
						airbus.mes.operationdetail.oView.setBusy(false);
						
						//Message handling
						var rowExists = data.Rowsets.Rowset;
						if (rowExists != undefined) {
							if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {
								airbus.mes.shell.ModelManager
										.messageShow(data.Rowsets.Rowset[0].Row[0].Message);
								
								// navigate to View Disruption after message
								// success
								sap.ui
										.getCore()
										.byId(
												"operationDetailsView--operDetailNavContainer")
										.to(
												airbus.mes.operationdetail.viewDisruption.oView
														.getId());
								
								// load disruption Model again for updated message
								var operationBO = sap.ui.getCore().getModel(
										"operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
								airbus.mes.disruptions.ModelManager
										.loadDisruptionsByOperation(operationBO);

							} else if (data.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
								if (data.Rowsets.Rowset[0].Row[0].Message === undefined)
									airbus.mes.shell.ModelManager
											.messageShow(airbus.mes.operationdetail.createDisruption.oView
													.getModel("i18nModel")
													.getProperty(
															"DisruptionNotUpdated"));
								else
									airbus.mes.shell.ModelManager
											.messageShow(data.Rowsets.Rowset[0].Row[0].Message)
							}
						} else {
							if (data.Rowsets.FatalError) {
								airbus.mes.shell.ModelManager
										.messageShow(data.Rowsets.FatalError);
							}
						}

					},

					error : function() {
						airbus.mes.operationdetail.oView.setBusy(false); // Remove
						// Busy
						// Indicator
						airbus.mes.shell.ModelManager
								.messageShow(airbus.mes.operationdetail.createDisruption.oView
										.getModel("i18nModel").getProperty(
												"DisruptionNotSaved"));

					}

				});

	},

	/***************************************************************************
	 * Get URL to Escalate Disruption
	 **************************************************************************/
	getUrlOnEscalate : function() {

		var urlOnEscalate = this.urlModel.getProperty("urlOnEscalate");
		return urlOnEscalate;
	},
	/***************************************************************************
	 * Escalate Disruption Service
	 **************************************************************************/
	escalateDisruption : function(msgRef, i18nModel) {
		var sMessageSuccess = i18nModel.getProperty("successfulEscalation");
		var sMessageError   = i18nModel.getProperty("tryAgain");
		var flag_success;

		jQuery.ajax({
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
		
		
		return flag_success;
	},

	/***************************************************************************
	 * Get URL to Acknowledge Disruption
	 **************************************************************************/
	getUrlToAckDisruption : function() {

		var urlToAckDisruption = this.urlModel
				.getProperty("urlToAckDisruption");
		return urlToAckDisruption;
	},

	/***************************************************************************
	 * Acknowledge Disruption
	 **************************************************************************/
	ackDisruption : function(dateTime, msgRef, comment, i18nModel) {

		var sMessageSuccess = i18nModel.getProperty("successfulAcknowledge");
		var sMessageError   = i18nModel.getProperty("tryAgain");
		var flag_success;

		jQuery.ajax({
			url : this.getUrlToAckDisruption(),
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sap.ui.getCore().getModel(
						"userSettingModel").getProperty(
						"/Rowsets/Rowset/0/Row/0/user"),
				"Param.3" : msgRef,
				"Param.4" : comment,
				"Param.5" : dateTime
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
		return flag_success;
	},
	

	/***************************************************************************
	 * Get URL to Mark Solved Disruption
	 **************************************************************************/
	getUrlToMarkSolvedDisruption : function() {

		var urlToAckDisruption = this.urlModel.getProperty("urlToMarkSolvedDisruption");
		return urlToMarkSolvedDisruption;
	},
	
	/***************************************************************************
	 * Mark Solved Disruption
	 **************************************************************************/
	markSolvedDisruption : function(msgRef, comment, i18nModel) {

		var sMessageSuccess = i18nModel.getProperty("successSolved");
		var sMessageError   = i18nModel.getProperty("tryAgain");
		var flag_success;

		jQuery.ajax({
			url : this.getUrlToMarkSolvedDisruption(),
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : msgRef,
				"Param.3" : comment
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
		
		return flag_success;
	},


	/***************************************************************************
	 * Get URL to Add Comment
	 **************************************************************************/
	getUrlToAddComment : function() {
		var urlToAddComment = this.urlModel.getProperty("urlToAddComment");
		return urlToAddComment;
		;
	},

	/***************************************************************************
	 * Add Comment service
	 **************************************************************************/
	addComment : function(oComment) {
		var sMessageSuccess = "Comment Added Successfully";
		var sMessageError   = i18nModel.getProperty("tryAgain");
		var flag_success;

		jQuery
				.ajax({
					url : this.getUrlToAddComment(),
					data : {
						"Param.1" : airbus.mes.settings.ModelManager.site,
						"Param.2" : sap.ui.getCore().getModel(
								"userSettingModel").getProperty(
								"/Rowsets/Rowset/0/Row/0/user"),
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
						if (flag_success) {
							var oModel = sap.ui.getCore().getModel(
									"operationDisruptionsModel");
							oModel.getProperty("/Rowsets/Rowset/1/Row").push(
									oComment);
							oModel.refresh();
						}

					}
				});

	},

	/***************************************************************************
	 * Get URL to Close Disruption
	 **************************************************************************/
	getUrlToCloseDisruption : function() {

		var urlToCloseDisruption = this.urlModel
				.getProperty("urlToCloseDisruption");
		return urlToCloseDisruption;
	},

	/***************************************************************************
	 * Close Disruption Service
	 **************************************************************************/
	closeDisruption : function(msgRef, comment, timeLost, i18nModel) {

		var sMessageSuccess = i18nModel.getProperty("successClosed");
		var sMessageError   = i18nModel.getProperty("tryAgain");
		var flag_success;

		jQuery.ajax({
			url : this.getUrlToCloseDisruption(),
			async:false,
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sap.ui.getCore().getModel(
						"userSettingModel").getProperty(
						"/Rowsets/Rowset/0/Row/0/user"),
				"Param.3" : msgRef,
				"Param.4" : comment,
				"Param.5" : timeLost
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

			}
		});
		
		return flag_success;
	},

	/***************************************************************************
	 * Get URL to Reject Disruption
	 **************************************************************************/
	getUrlToRejectDisruption : function() {
		var urlToDisruptionComment = this.urlModel
				.getProperty("urlToRejectDisruption");
		return urlToDisruptionComment;
	},
	/***************************************************************************
	 * Reject Disruption Service
	 **************************************************************************/
	rejectDisruption : function(comment, msgref, i18nModel) {

		var sMessageSuccess = i18nModel.getProperty("successReject");
		var sMessageError   = i18nModel.getProperty("tryAgain");
		var flag_success;

		jQuery.ajax({
			url : this.getUrlToRejectDisruption(),
			async: false,
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sap.ui.getCore().getModel(
						"userSettingModel").getProperty(
						"/Rowsets/Rowset/0/Row/0/user"),
				"Param.3" : msgref,
				"Param.4" : comment
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

			}
		});
		
		return flag_success
	},
};

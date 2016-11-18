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
			dest = "airbus";
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

		if (dest === "sopra") {

			var oModel = this.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;

			for ( var prop in oModel) {
				if (oModel[prop].slice(-5) != ".json") {
					oModel[prop] += "&j_user=" + Cookies.getJSON("login").user
							+ "&j_password=" + Cookies.getJSON("login").mdp;
				}
			}
		}

		this.core.setModel(new sap.ui.model.json.JSONModel(),
				"disruptionCustomData");

		this.core.setModel(new sap.ui.model.json.JSONModel(),
				"disruptionCategoryModel");

		// Material List Model
		this.core.setModel(new sap.ui.model.json.JSONModel(),
				"MaterialListModel");

		sap.ui
				.getCore()
				.getModel("disruptionCustomData")
				.attachRequestCompleted(
						airbus.mes.disruptions.ModelManager.onDisruptionCustomDataLoad);
		sap.ui
				.getCore()
				.getModel("disruptionCategoryModel")
				.attachRequestCompleted(
						airbus.mes.disruptions.ModelManager.onLoadDisruptionCategory);

	},

	/***************************************************************************
	 * Load Category and custom Data
	 */

	loadData : function() {

		airbus.mes.operationdetail.oView.setBusy(true); // Set Busy Indicator
														// true
		this.loadDisruptionCategory();
		this.loadDisruptionCustomData();
		this.loadMaterialList();

	},

	/***************************************************************************
	 * Set the Models for Custom Data of create Disruption
	 **************************************************************************/
	loadDisruptionCustomData : function() {
		var oModel = sap.ui.getCore().getModel("disruptionCustomData");
		oModel.loadData(this.getDisruptionCustomData());
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

		airbus.mes.operationdetail.oView.setBusy(false); // Set Busy
		// Indicator false
	},

	/***************************************************************************
	 * Set the Models for Category of Disruption Creation
	 **************************************************************************/
	loadDisruptionCategory : function() {
		var oModel = sap.ui.getCore().getModel("disruptionCategoryModel");
		oModel.loadData(this.getDisruptionCategory());
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

	onLoadDisruptionCategory : function() {

		airbus.mes.disruptions.oView.createDisruption.oController
				.setDataForEditDisruption();
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
					oFilters.operation.split(",")[1]);
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

		oViewModel.loadData(getDisruptionsURL);

	},

	/***************************************************************************
	 * After Disruptions related to a operation is loaded
	 */
	onOperationDisruptionsLoad : function() {

		/* Set filter for Comments on all the disruptions */
		airbus.mes.disruptions.oView.viewDisruption.oController
				.applyFiltersOnComments();

		airbus.mes.operationdetail.oView.setBusy(false); // Set Busy
															// Indicator false
	},

	/***************************************************************************
	 * Load Material List for create/update disruption
	 */

	getURLMaterialList : function() {
		var urlMaterialList = this.urlModel.getProperty("urlMaterialList");
		return urlMaterialList;
	},

	/***************************************************************************
	 * Load Disruptions for a single operation
	 */
	loadMaterialList : function() {

		var oViewModel = sap.ui.getCore().getModel("MaterialListModel");

		var getMaterialListURL = airbus.mes.disruptions.ModelManager
				.getURLMaterialList();

		oViewModel.loadData(getMaterialListURL);

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
						/* "Param.2" : "NG42E7A", */
						"Param.2" : sap.ui.getCore().getModel(
								"userSettingModel").getProperty(
								"/Rowsets/Rowset/0/Row/0/user"),
						"Param.3" : messageType,
						"Param.4" : messageSubject,
						"Param.5" : messageBody,
						"Param.6" : airbus.mes.shell.ModelManager.json2xml({
							payloadAttributelist : payloadData
						}),
						"Param.7" : messageHandle

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
								
								// navigate to View Disruption after success message
								sap.ui.getCore().byId("operationDetailsView--operDetailNavContainer").back();
								

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
		return urlUpdateDisruption;
	},

	updateDisruption : function(sMessageRef, sReason, sResponsibleGroup,
			sRootCause, iTimeLost, dFixedByTime, sComment, iGravity) {

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

						// Message handling
						var rowExists = data.Rowsets.Rowset;
						if (rowExists != undefined) {
							if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {
								airbus.mes.shell.ModelManager
										.messageShow(data.Rowsets.Rowset[0].Row[0].Message);

								// Navigate to View Disruption after message
								// success
								sap.ui
										.getCore()
										.byId(
												"operationDetailsView--operDetailNavContainer")
										.back();

								// Load disruption Model again for updated
								// message
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
		var sMessageError = i18nModel.getProperty("tryAgain");
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
		var sMessageError = i18nModel.getProperty("tryAgain");
		var flag_success;

		jQuery
				.ajax({
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

		var urlToAckDisruption = this.urlModel
				.getProperty("urlToMarkSolvedDisruption");
		return urlToMarkSolvedDisruption;
	},

	/***************************************************************************
	 * Mark Solved Disruption
	 **************************************************************************/
	markSolvedDisruption : function(msgRef, comment, i18nModel) {

		var sMessageSuccess = i18nModel.getProperty("successSolved");
		var sMessageError = i18nModel.getProperty("tryAgain");
		var flag_success;

		jQuery
				.ajax({
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
	addComment : function(oComment, i18nModel) {
		var sMessageSuccess = i18nModel.getProperty("commentSuccessful");
		var sMessageError = i18nModel.getProperty("tryAgain");

		jQuery
				.ajax({
					url : this.getUrlToAddComment(),
					data : {
						"Param.1" : airbus.mes.settings.ModelManager.site,
						"Param.2" : oComment.Comments,
						"Param.3" : sap.ui.getCore().getModel(
								"userSettingModel").getProperty(
								"/Rowsets/Rowset/0/Row/0/user"),
						"Param.4" : oComment.MessageRef
						
					},
					error : function(xhr, status, error) {
						airbus.mes.shell.ModelManager
								.messageShow(sMessageError);

					},
					success : function(result, status, xhr) {
						var flag_success = false;

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
		var sMessageError = i18nModel.getProperty("tryAgain");
		var flag_success;

		jQuery
				.ajax({
					url : this.getUrlToCloseDisruption(),
					async : false,
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
	rejectDisruption : function(comment, msgref, sMessageSuccess, i18nModel) {
		var sMessageError = i18nModel.getProperty("tryAgain");
		var flag_success;

		jQuery
				.ajax({
					url : this.getUrlToRejectDisruption(),
					async : false,
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
	}
};

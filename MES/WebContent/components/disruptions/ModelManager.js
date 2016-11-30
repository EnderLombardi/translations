"use strict";

jQuery.sap.declare("airbus.mes.disruptions.ModelManager")

airbus.mes.disruptions.ModelManager = {

	createEditFlag : false,
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
		
		// Jigtool List Model
		this.core.setModel(new sap.ui.model.json.JSONModel(),
				"JigtoolListModel");

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

		airbus.mes.disruptions.oView.viewDisruption.setBusy(true); // Set Busy Indicator
														// true
		this.loadDisruptionCategory();
		this.loadDisruptionCustomData();
		this.loadMaterialList();
		this.loadJigtoolList();

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

		airbus.mes.disruptions.oView.viewDisruption.setBusy(false); // Set Busy Indicator false
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
		var getDisruptionsURL = this.urlModel.getProperty("getDiruptionsURL");

		getDisruptionsURL = getDisruptionsURL.replace('$Site',
				airbus.mes.settings.ModelManager.site);
		getDisruptionsURL = getDisruptionsURL.replace('$Status', "ALL");
		getDisruptionsURL = getDisruptionsURL.replace('$Resource', "");

		if (oFilters.operation != undefined && oFilters.operation != "")
			getDisruptionsURL = getDisruptionsURL.replace('$Operation',
					oFilters.operation.split(",")[1]);
		else
			getDisruptionsURL = getDisruptionsURL.replace('$Operation', "");

		if (oFilters.sfc != undefined && oFilters.sfc != "")
			getDisruptionsURL = getDisruptionsURL.replace('$SFC',
					oFilters.sfc);
		else
			getDisruptionsURL = getDisruptionsURL.replace('$SFC',"");
		
		getDisruptionsURL = getDisruptionsURL.replace('$OperationRevision', "");
		getDisruptionsURL = getDisruptionsURL.replace('$SignalFlag', "");
		getDisruptionsURL = getDisruptionsURL.replace('$FromDate', "");
		getDisruptionsURL = getDisruptionsURL.replace('$ToDate', "");

		if (oFilters.station != undefined && oFilters.station != "")
			getDisruptionsURL = getDisruptionsURL.replace('$WorkCenter',
					"WorkCenterBO:" + 								// WorkCenter BO
					airbus.mes.settings.ModelManager.site + "," + 
					oFilters.station);
		else
			getDisruptionsURL = getDisruptionsURL.replace('$WorkCenter', "");

		getDisruptionsURL = getDisruptionsURL.replace('$userGroup', "");
		getDisruptionsURL = getDisruptionsURL.replace('$MessageType', "");
		getDisruptionsURL = getDisruptionsURL.replace('$User',sap.ui.getCore().getModel(
		"userSettingModel").getProperty(
		"/Rowsets/Rowset/0/Row/0/user"));
		return getDisruptionsURL;
	},

	/***************************************************************************
	 * Load Disruptions for a single operation
	 */
	loadDisruptionsByOperation : function(operation,sSfc) {

		airbus.mes.operationdetail.oView.setBusy(true); // Set Busy Indicator

		var oViewModel = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel");

		var getDisruptionsURL = airbus.mes.disruptions.ModelManager
				.getDisruptionsURL({
					"operation" : operation,
					"sfc"		: sSfc
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
		

		if (nav.getCurrentPage().sId == "stationTrackerView" && airbus.mes.disruptions.ModelManager.createEditFlag) {
			
			airbus.mes.disruptions.ModelManager.checkDisruptionStatus(airbus.mes.disruptions.oView.viewDisruption
				.getModel("operationDisruptionsModel"));
		}
		airbus.mes.disruptions.ModelManager.createEditFlag =false;
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
	 * Load Jigtool List for create/update disruption
	 */

	getURLJigtoolList : function() {
		var urlJigtoolList = this.urlModel.getProperty("urlJigtoolList");
		return urlJigtoolList;
	},

	/***************************************************************************
	 * Load Disruptions for a single operation
	 */
	loadJigtoolList : function() {

		var oViewModel = sap.ui.getCore().getModel("JigtoolListModel");

		var getJigtoolListURL = airbus.mes.disruptions.ModelManager
				.getURLJigtoolList();

		oViewModel.loadData(getJigtoolListURL);

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
								

								// load disruption Model again for new message
								var operationBO = sap.ui.getCore().getModel(
										"operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo; 
								var sSfcBO = sap.ui.getCore().getModel(
								"operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc; 
								airbus.mes.disruptions.ModelManager
										.loadDisruptionsByOperation(operationBO,sSfcBO);
								
								// navigate to View Disruption after success message
								sap.ui.getCore().byId("operationDetailsView--operDetailNavContainer").back();
								
								airbus.mes.disruptions.ModelManager.createEditFlag =true;
								

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
						} else if (data.Rowsets.FatalError) {
							airbus.mes.shell.ModelManager.messageShow(data.Rowsets.FatalError);
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

		var currentPage = nav.getCurrentPage().getId();
		
		// Remove Busy Indicator
		if(currentPage == "stationTrackerView")
			airbus.mes.operationdetail.oView.setBusy(true); // Set Busy Indicator
		
		else if(currentPage == "disruptiontrackerView")
			airbus.mes.disruptiontracker.oView.setBusy(true); // Set Busy Indicator
		
		var urlUpdateDisruption = this.urlModel
				.getProperty("urlUpdateDisruption");
		return urlUpdateDisruption;
	},

	updateDisruption : function(sMessageRef, sReason, sResponsibleGroup,
			sRootCause, iTimeLost, dFixedByTime, sComment, iGravity,dPromisedDate) {

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
						"Param.9" : iGravity,
						"Param.10": sap.ui.getCore().getModel(
						"userSettingModel").getProperty(
						"/Rowsets/Rowset/0/Row/0/user"),
						"Param.11": dPromisedDate
						
					},
					success : function(data, textStatus, jqXHR) {

						var currentPage = nav.getCurrentPage().getId();
						
						// Remove Busy Indicator
						if(currentPage == "stationTrackerView")
							airbus.mes.operationdetail.oView.setBusy(false);
						
						else if(currentPage == "disruptiontrackerView")
							airbus.mes.disruptiontracker.oView.setBusy(false);

						// Message handling
						var rowExists = data.Rowsets.Rowset;
						if (rowExists != undefined) {
							if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {
								airbus.mes.shell.ModelManager
										.messageShow(data.Rowsets.Rowset[0].Row[0].Message);

								
								if(currentPage == "stationTrackerView") {
									
									// Load disruption Model again for updated message
									var operationBO = sap.ui.getCore().getModel(
											"operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
									var sSfcBO = sap.ui.getCore().getModel(
									"operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc;
									airbus.mes.disruptions.ModelManager
											.loadDisruptionsByOperation(operationBO,sSfcBO);
									

									
									sap.ui.getCore().byId("operationDetailsView--operDetailNavContainer").back();
									
								} else if(currentPage == "disruptiontrackerView") {
									airbus.mes.disruptions.ModelManager.updateDisruptionModel();
									airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;
									sap.ui.getCore().byId("disruptionDetailPopup--disruptDetailNavContainer").back();

								}

								airbus.mes.disruptions.ModelManager.createEditFlag =true;
								

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
						} else if (data.Rowsets.FatalError) {
								airbus.mes.shell.ModelManager.messageShow(data.Rowsets.FatalError);
							
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
	
	updateDisruptionModel : function() {
		
		var oModel = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel");
		
		var disruptionModel = oModel.getProperty("/Rowsets/Rowset/0/Row/0");		
		
		disruptionModel.Reason = sap.ui.getCore().byId("createDisruptionView--selectreason").getSelectedKey();

		
		if(sap.ui.getCore().byId("createDisruptionView--selectResponsible").getSelectedItem()) {
			disruptionModel.ResponsibleGroupDesc = sap.ui.getCore().byId("createDisruptionView--selectResponsible").getSelectedItem().getText();
			disruptionModel.ResponsibleGroup = sap.ui.getCore().byId("createDisruptionView--selectResponsible").getSelectedKey();
		}
		
		disruptionModel.RootCause = sap.ui.getCore().byId("createDisruptionView--selectRootCause").getSelectedKey();
		
		disruptionModel.TimeLost = sap.ui.getCore().byId("createDisruptionView--timeLost").getValue();
		
		disruptionModel.RequiredFixBy = sap.ui.getCore().byId("createDisruptionView--expectedDate").getValue() + " " 
								+ sap.ui.getCore().byId("createDisruptionView--expectedTime").getValue();
		
		disruptionModel.PromisedDateTime = sap.ui.getCore().byId("createDisruptionView--promisedDate").getValue() + " " 
									+ sap.ui.getCore().byId("createDisruptionView--promisedTime").getValue();
		

		var sComment = sap.ui.getCore().byId("createDisruptionView--comment").getValue();
		var currDate = new Date();
		var date = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();

		var oComment = {
				"Action" : airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("comment"),
				"Comments" : sComment,
				"Counter" : "",
				"Date" : date,
				"MessageRef" : disruptionModel.MessageRef,
				"UserFullName" : ( sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " +
						   sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase() )
		};
		
		var commentModel = oModel.getProperty("/Rowsets/Rowset/1/Row");
		
		commentModel.push(oComment);
		
		oModel.refresh();
		
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
		var flagSuccess;

		jQuery
				.ajax({
					url : this.getUrlOnEscalate(),
					data : {
						"Param.1" : airbus.mes.settings.ModelManager.site,
						"Param.2" : msgRef
					},
					async : false,
					error : function(xhr, status, error) {
						airbus.mes.shell.ModelManager
								.messageShow(sMessageError);
						flagSuccess = false

					},
					success : function(result, status, xhr) {
						if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
							airbus.mes.shell.ModelManager
									.messageShow(sMessageSuccess);
							flagSuccess = true;
								
						} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
							flagSuccess = false;
						} else {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
							flagSuccess = true;
							
							if(nav.getCurrentPage().getId() == "disruptiontrackerView")
								airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;
						}

					}
				});

		return flagSuccess;
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
		var flagSuccess;

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
						flagSuccess = false

					},
					success : function(result, status, xhr) {
						if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
							airbus.mes.shell.ModelManager
									.messageShow(sMessageSuccess);
							flagSuccess = true;
							
						} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
							flagSuccess = false;
						} else {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
							flagSuccess = true;
							
							if(nav.getCurrentPage().getId() == "disruptiontrackerView")
								airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;
						}

					}
				});
		return flagSuccess;
	},

	/***************************************************************************
	 * Get URL to Mark Solved Disruption
	 **************************************************************************/
	getUrlToMarkSolvedDisruption : function() {

		var urlToMarkSolvedDisruption = this.urlModel
				.getProperty("urlToMarkSolvedDisruption");
		return urlToMarkSolvedDisruption;
	},

	/***************************************************************************
	 * Mark Solved Disruption
	 **************************************************************************/
	markSolvedDisruption : function(msgRef, comment, i18nModel) {

		var sMessageSuccess = i18nModel.getProperty("successSolved");
		var sMessageError = i18nModel.getProperty("tryAgain");
		var flagSuccess;

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
						flagSuccess = false

					},
					success : function(result, status, xhr) {
						if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
							airbus.mes.shell.ModelManager
									.messageShow(sMessageSuccess);
							flagSuccess = true;
							
						} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
							flagSuccess = false;
						} else {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
							flagSuccess = true;
							
							if(nav.getCurrentPage().getId() == "disruptiontrackerView")
								airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;
						}

					}
				});

		return flagSuccess;
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
						var flagSuccess = false;

						if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
							airbus.mes.shell.ModelManager
									.messageShow(sMessageSuccess);
							flagSuccess = true;
						} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
							flagSuccess = false;
						} else {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
							flagSuccess = true;
						}

						// Add Comment to Model
						if (flagSuccess) {
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
		var flagSuccess;

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
						flagSuccess = false

					},
					success : function(result, status, xhr) {
						if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
							airbus.mes.shell.ModelManager
									.messageShow(sMessageSuccess);
							flagSuccess = true;
							
						} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
							flagSuccess = false;
						} else {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
							flagSuccess = true;
							
							if(nav.getCurrentPage().getId() == "disruptiontrackerView")
								airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;
						}

					}
				});

		return flagSuccess;
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
		var flagSuccess;

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
						flagSuccess = false

					},
					success : function(result, status, xhr) {
						if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
							airbus.mes.shell.ModelManager
									.messageShow(sMessageSuccess);
							flagSuccess = true;
							
						} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
							flagSuccess = false;
						} else {
							airbus.mes.shell.ModelManager
									.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
							flagSuccess = true;
							
							if(nav.getCurrentPage().getId() == "disruptiontrackerView")
								airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;
						}

					}
				});

		return flagSuccess
	},
	
	// Change text of status in progress tab if any blocking disruption still open (not closed)
	checkDisruptionStatus : function(operationDisruptionsModel) {
		var aDisruption = operationDisruptionsModel.getProperty("/Rowsets/Rowset/0/Row");
		if(aDisruption === undefined)
			return;
		
		var sStatus = null;
		
		var modelRefresh = false;
		
		
		// Check if any blocking disruption still open (not closed)
		for(var i = 0; i < aDisruption.length; i++){
			if (aDisruption[i].Gravity == 3 && aDisruption[i].Status != airbus.mes.disruptions.Formatter.status.closed) {
				sStatus = airbus.mes.operationdetail.Formatter.status.blocked;
				break;
			}
		}
		
		// Set status = blocking
		if(sStatus != null){
			sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].status = sStatus;
			modelRefresh = true;
		} else if(sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].status == airbus.mes.operationdetail.Formatter.status.blocked) {
			// Set status = In Progess if blocked earlier	
			sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].status =  airbus.mes.operationdetail.Formatter.status.active;
				
				modelRefresh = true;
			
		}
	
		// Refresh model
		if(modelRefresh == true){
			sap.ui.getCore().getModel("operationDetailModel").refresh();
		}
	}
};

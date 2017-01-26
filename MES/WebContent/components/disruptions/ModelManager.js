"use strict";

jQuery.sap.declare("airbus.mes.disruptions.ModelManager")

airbus.mes.disruptions.ModelManager = {

	createEditFlag : false,
	urlModel : undefined,

	gravity_temp: undefined, // A variable to store the value of gravity temporarily of newly created or edited disruptions to access in ajax response
	
	customDataLoaded: 0,

	init : function(core) {

		this.core = core;
		core.setModel(new sap.ui.model.json.JSONModel(), "AttachmentList");
		airbus.mes.shell.ModelManager.createJsonModel(core,["operationDisruptionsModel",
		                                                    "DisruptionDetailModel",
		                                                    "disruptionCustomData",
		                                                    "disruptionCategoryModel",
		                                                    "MaterialListModel", // Material List Model
		                                                    "JigtoolListModel", // Jigtool List Model
		                                                    ]);

		sap.ui.getCore().getModel("operationDisruptionsModel").attachRequestCompleted(airbus.mes.disruptions.ModelManager.onOperationDisruptionsLoad);

		
		// Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.disruptions.config.url_config");

		
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

	
	/***********************************
	 * Set busy for disruptions pop-up
	 ***********************************/
	setBusy: function(){
		switch (nav.getCurrentPage().getId()) {
		
		case "stationTrackerView":
			sap.ui.getCore().byId("operationDetailPopup--operationDetailPopUp").setBusyIndicatorDelay(0);
			sap.ui.getCore().byId("operationDetailPopup--operationDetailPopUp").setBusy(true);
			break;
		case "disruptiontrackerView":
			sap.ui.getCore().byId("disruptionDetailPopup--disruptionDetailPopUp").setBusyIndicatorDelay(0);
			sap.ui.getCore().byId("disruptionDetailPopup--disruptionDetailPopUp").setBusy(true);
			break;
		default: break;
		}
	},
	
	/**************************************
	 * Un-Set busy for disruptions pop-up
	 **************************************/
	unSetBusy: function(){
		switch (nav.getCurrentPage().getId()) {
		
		case "stationTrackerView":
			sap.ui.getCore().byId("operationDetailPopup--operationDetailPopUp").setBusy(false);
			break;
		case "disruptiontrackerView":
			sap.ui.getCore().byId("disruptionDetailPopup--disruptionDetailPopUp").setBusy(false);
			break;
		default: break;
		}
	},
	

	/***************************************************************************
	 * Load Category and custom Data
	 */

	loadData : function() {

		// Set Busy Indicator
		switch (nav.getCurrentPage().getId()) {
		
		case "stationTrackerView":
			sap.ui.getCore().byId("operationDetailPopup--operationDetailPopUp").setBusyIndicatorDelay(0);
			sap.ui.getCore().byId("operationDetailPopup--operationDetailPopUp").setBusy(true)
			break;
		case "disruptiontrackerView":
			sap.ui.getCore().byId("disruptionDetailPopup--disruptionDetailPopUp").setBusyIndicatorDelay(0);
			sap.ui.getCore().byId("disruptionDetailPopup--disruptionDetailPopUp").setBusy(true)
			break;
		}
		
		airbus.mes.disruptions.ModelManager.customDataLoaded = 0; // Important

		this.loadDisruptionCategory();
		this.loadDisruptionCustomData();
		this.loadMaterialList();
		this.loadJigtoolList();
		this.AttachmentListModel();
	},

	/***************************************************************************
	 * Set the Models for Custom Data of create Disruption
	 **************************************************************************/
	loadDisruptionCustomData : function() {
		var oModel = sap.ui.getCore().getModel("disruptionCustomData");
		oModel.loadData(this.getDisruptionCustomDataURL());
	},
	getDisruptionCustomDataURL : function() {
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
		airbus.mes.disruptions.ModelManager.customDataLoaded++;
		if(airbus.mes.disruptions.ModelManager.customDataLoaded==2){


			/**
			 * call setdataForEditDisruptionFunction using DisruptionDetail view MES
			 * V1.5
			 */
			if (sap.ui.Device.system.desktop) {
				airbus.mes.disruptions.oView.disruptionDetail.oController.setDisruptionDetailData();
			}else{
				airbus.mes.disruptions.oView.createDisruption.oController.setDataForEditDisruption();
			}
			

			// Un-Set Busy Indicator
			switch (nav.getCurrentPage().getId()) {
			
			case "stationTrackerView":
				sap.ui.getCore().byId("operationDetailPopup--operationDetailPopUp").setBusy(false)
				break;
			case "disruptiontrackerView":
				sap.ui.getCore().byId("disruptionDetailPopup--disruptionDetailPopUp").setBusy(false)
				break;
			}
		}
	},

	/***************************************************************************
	 * Set the Models for Category of Disruption Creation
	 **************************************************************************/
	loadDisruptionCategory : function() {
		var oModel = sap.ui.getCore().getModel("disruptionCategoryModel");
		oModel.loadData(this.getDisruptionCategoryURL());
	},
	getDisruptionCategoryURL : function() {
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

		airbus.mes.disruptions.ModelManager.customDataLoaded++;
		if(airbus.mes.disruptions.ModelManager.customDataLoaded==2){
			
			
			/**
			 * call setdataForEditDisruptionFunction using DisruptionDetail view MES
			 * V1.5
			 */
			if (sap.ui.Device.system.desktop) {
				airbus.mes.disruptions.oView.disruptionDetail.oController.setDisruptionDetailData();
			}else{
				airbus.mes.disruptions.oView.createDisruption.oController.setDataForEditDisruption();
			}
			

			// Un-Set Busy Indicator
			switch (nav.getCurrentPage().getId()) {
			
			case "stationTrackerView":
				sap.ui.getCore().byId("operationDetailPopup--operationDetailPopUp").setBusy(false)
				break;
			case "disruptiontrackerView":
				sap.ui.getCore().byId("disruptionDetailPopup--disruptionDetailPopUp").setBusy(false)
				break;
			}
		}
	},

	/***************************************************************************
	 * Generic Function to get URL for to get Disruptions with filters or no
	 * filters
	 */
	getDisruptionsURL : function(oFilters) {
		var getDisruptionsURL = airbus.mes.disruptions.ModelManager.urlModel
				.getProperty("getDiruptionsURL");

		getDisruptionsURL = getDisruptionsURL.replace('$Site',
				airbus.mes.settings.ModelManager.site);
		getDisruptionsURL = getDisruptionsURL.replace('$Status', "ALL");
		getDisruptionsURL = getDisruptionsURL.replace('$Resource', "");

		if (oFilters.operation != undefined && oFilters.operation != "")
			getDisruptionsURL = getDisruptionsURL.replace('$Operation',
					oFilters.operation.split(",")[1]);
		else
			getDisruptionsURL = getDisruptionsURL.replace('$Operation', "");

		if (oFilters.sfc_step_ref != undefined && oFilters.sfc_step_ref != "")
			getDisruptionsURL = getDisruptionsURL.replace('$SFCStepRef',
					oFilters.sfc_step_ref);
		else
			getDisruptionsURL = getDisruptionsURL.replace('$SFCStepRef', "");

		getDisruptionsURL = getDisruptionsURL.replace('$OperationRevision', "");
		getDisruptionsURL = getDisruptionsURL.replace('$SignalFlag', "");
		getDisruptionsURL = getDisruptionsURL.replace('$FromDate', "");
		getDisruptionsURL = getDisruptionsURL.replace('$ToDate', "");

		if (oFilters.station != undefined && oFilters.station != "")
			getDisruptionsURL = getDisruptionsURL.replace('$WorkCenter',
					"WorkCenterBO:" + // WorkCenter BO
					airbus.mes.settings.ModelManager.site + ","
							+ oFilters.station);
		else
			getDisruptionsURL = getDisruptionsURL.replace('$WorkCenter', "");

		getDisruptionsURL = getDisruptionsURL.replace('$userGroup', "");
		getDisruptionsURL = getDisruptionsURL.replace('$MessageType', "");
		getDisruptionsURL = getDisruptionsURL.replace('$User', sap.ui.getCore()
				.getModel("userSettingModel").getProperty(
						"/Rowsets/Rowset/0/Row/0/user"));

		if (oFilters.msn != undefined && oFilters.msn != "")
			getDisruptionsURL = getDisruptionsURL.replace('$MSN', oFilters.msn);
		else
			getDisruptionsURL = getDisruptionsURL.replace('$MSN', "");

		return getDisruptionsURL;
	},

	/***************************************************************************
	 * Load Disruptions for a single operation
	 */
	loadDisruptionsByOperation : function(operation, sSfcStepRef) {

		airbus.mes.operationdetail.oView.setBusy(true); // Set Busy Indicator

		var oViewModel = airbus.mes.disruptions.oView.viewDisruption
				.getModel("operationDisruptionsModel");

		var getDisruptionsURL = airbus.mes.disruptions.ModelManager
				.getDisruptionsURL({
					"operation" : operation,
					"sfc_step_ref" : sSfcStepRef
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

		if (nav.getCurrentPage().sId == "stationTrackerView"
				&& airbus.mes.disruptions.ModelManager.createEditFlag) {

			airbus.mes.disruptions.ModelManager
					.checkDisruptionStatus(airbus.mes.disruptions.oView.viewDisruption
							.getModel("operationDisruptionsModel"));
		}
		airbus.mes.disruptions.ModelManager.createEditFlag = false;
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

	createDisruption : function(messageHandle, messageType, messageSubject, messageBody, payloadData ) {

		// Set Busy Indicator
		airbus.mes.disruptions.ModelManager.setBusy();
		
		
		airbus.mes.disruptions.ModelManager.gravity_temp = payloadData[0].payload[8].value; // Store gravity to access in ajax response
		
		jQuery.ajax({
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
						"Param.7" : messageHandle,
						// gravity
						"Param.8" : payloadData[0].payload[8].value,
						"Param.9": sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/sfc"),
						"Param.10": sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/operation_bo").split(",")[1],  //Operation number
						"Param.11": "DEFAULT"

					},
					success : function(data, textStatus, jqXHR) {
						// Un-Set Busy Indicator
						airbus.mes.disruptions.ModelManager.unSetBusy();
						
						var rowExists = data.Rowsets.Rowset;
						if (rowExists != undefined) {
							if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {
								airbus.mes.shell.ModelManager
										.messageShow(data.Rowsets.Rowset[0].Row[0].Message);

								// load disruption Model again for new message
								var operationBO = sap.ui.getCore().getModel(
										"operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
								var sSfcStepRef = sap.ui.getCore().getModel(
										"operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref;
								airbus.mes.disruptions.ModelManager
										.loadDisruptionsByOperation(
												operationBO, sSfcStepRef);
								// Refresh station tracker
								airbus.mes.shell.oView.getController()
										.renderStationTracker();


								// navigate to View Disruption after success message
								sap.ui.getCore().byId("operationDetailsView--operDetailNavContainer").back();
								
								airbus.mes.disruptions.ModelManager.createEditFlag =true;
								
								if(airbus.mes.disruptions.ModelManager.gravity_temp == "3"){ // if blocking disruption created
									// set paused value in operation detail model
									sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].paused = "---";
									sap.ui.getCore().getModel("operationDetailModel").refresh();
								}
								

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
							airbus.mes.shell.ModelManager
									.messageShow(data.Rowsets.FatalError);
						}

						airbus.mes.shell.util.navFunctions.disruptionButtons.create
								.setEnabled(true);
						airbus.mes.shell.util.navFunctions.disruptionButtons.cancel
								.setEnabled(true);

					},

					error : function() {
						// Un-Set Busy Indicator
						airbus.mes.disruptions.ModelManager.unSetBusy();
						
						airbus.mes.shell.ModelManager
								.messageShow(airbus.mes.operationdetail.createDisruption.oView
										.getModel("i18nModel").getProperty(
												"DisruptionNotSaved"));

						airbus.mes.shell.util.navFunctions.disruptionButtons.create
								.setEnabled(true);
						airbus.mes.shell.util.navFunctions.disruptionButtons.cancel
								.setEnabled(true);

					}

				});

	},

	/***************************************************************************
	 * Create Disruption service
	 */

	getURLUpdateDisruption : function() {

		var currentPage = nav.getCurrentPage().getId();

		// Remove Busy Indicator
		if (currentPage == "stationTrackerView")
			airbus.mes.operationdetail.oView.setBusy(true); // Set Busy
															// Indicator

		else if (currentPage == "disruptiontrackerView")
			airbus.mes.disruptiontracker.oView.setBusy(true); // Set Busy
																// Indicator

		var urlUpdateDisruption = this.urlModel
				.getProperty("urlUpdateDisruption");
		return urlUpdateDisruption;
	},

	updateDisruption : function(sMessageRef, sReason, sResponsibleGroup, iTimeLost, dFixedByTime, sComment, iGravity, dPromisedDate) {

		// Set Busy Indicator
		airbus.mes.disruptions.ModelManager.setBusy();
		

		airbus.mes.shell.util.navFunctions.disruptionButtons.update.setEnabled(false);
		airbus.mes.shell.util.navFunctions.disruptionButtons.cancel.setEnabled(false);
		
		
		airbus.mes.disruptions.ModelManager.gravity_temp = dPromisedDate; // Store gravity to access in ajax response

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
						//"Param.5" : sRootCause,[MES v1.5]
						"Param.6" : iTimeLost,
						"Param.7" : dFixedByTime,
						"Param.8" : sComment,
						"Param.9" : iGravity,
						"Param.10": sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
						"Param.11": dPromisedDate,
						"Param.12": sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/sfc"),
						"Param.13": sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/operation_bo").split(",")[1],  //Operation number
						"Param.14": "DEFAULT"
					},
					success : function(data, textStatus, jqXHR) {

						var currentPage = nav.getCurrentPage().getId();

						// Un-Set Busy Indicator
						airbus.mes.disruptions.ModelManager.unSetBusy();

						// Message handling
						var rowExists = data.Rowsets.Rowset;
						if (rowExists != undefined) {
							if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {
								airbus.mes.shell.ModelManager
										.messageShow(data.Rowsets.Rowset[0].Row[0].Message);

								if (currentPage == "stationTrackerView") {

									// Load disruption Model again for updated
									// message
									var operationBO = sap.ui.getCore()
											.getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
									var sSfcStepRef = sap.ui.getCore()
											.getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref;
									airbus.mes.disruptions.ModelManager
											.loadDisruptionsByOperation(
													operationBO, sSfcStepRef);
									// Refresh station tracker
									airbus.mes.shell.oView.getController()
											.renderStationTracker();

									sap.ui
											.getCore()
											.byId(
													"operationDetailsView--operDetailNavContainer")
											.back();

								} else if (currentPage == "disruptiontrackerView") {
									airbus.mes.disruptions.ModelManager
											.updateDisruptionModel();
									airbus.mes.disruptiontracker.oView
											.getController().disruptionTrackerRefresh = true;
									sap.ui
											.getCore()
											.byId(
													"disruptionDetailPopup--disruptDetailNavContainer")
											.back();

								}

								airbus.mes.disruptions.ModelManager.createEditFlag =true;
								
								if(airbus.mes.disruptions.ModelManager.gravity_temp == "3"){ // if disruption is set to blocking
									// set paused value in operation detail model
									sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].paused = "---";
									sap.ui.getCore().getModel("operationDetailModel").refresh();
								}


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
							airbus.mes.shell.ModelManager
									.messageShow(data.Rowsets.FatalError);

						}

						airbus.mes.shell.util.navFunctions.disruptionButtons.update
								.setEnabled(true);
						airbus.mes.shell.util.navFunctions.disruptionButtons.cancel
								.setEnabled(true);

					},

					error : function() {
						airbus.mes.operationdetail.oView.setBusy(false); // Remove
						// Busy
						// Indicator
						airbus.mes.shell.ModelManager
								.messageShow(airbus.mes.operationdetail.createDisruption.oView
										.getModel("i18nModel").getProperty(
												"DisruptionNotSaved"));

						airbus.mes.shell.util.navFunctions.disruptionButtons.update
								.setEnabled(true);
						airbus.mes.shell.util.navFunctions.disruptionButtons.cancel
								.setEnabled(true);

					}

				});

	},

	updateDisruptionModel : function() {

		var oModel = airbus.mes.disruptions.oView.viewDisruption
				.getModel("operationDisruptionsModel");

		var disruptionModel = oModel.getProperty("/Rowsets/Rowset/0/Row/0");

		disruptionModel.Reason = sap.ui.getCore().byId(
				"createDisruptionView--selectreason").getSelectedKey();

		if (sap.ui.getCore().byId("createDisruptionView--selectResponsible")
				.getSelectedItem()) {
			disruptionModel.ResponsibleGroupDesc = sap.ui.getCore().byId(
					"createDisruptionView--selectResponsible")
					.getSelectedItem().getText();
			disruptionModel.ResponsibleGroup = sap.ui.getCore().byId(
					"createDisruptionView--selectResponsible").getSelectedKey();
		}

		disruptionModel.RootCause = sap.ui.getCore().byId(
				"createDisruptionView--selectRootCause").getSelectedKey();

		disruptionModel.TimeLost = sap.ui.getCore().byId(
				"createDisruptionView--timeLost").getValue();

		disruptionModel.RequiredFixBy = sap.ui.getCore().byId(
				"createDisruptionView--expectedDate").getValue()
				+ " "
				+ sap.ui.getCore().byId("createDisruptionView--expectedTime")
						.getValue();

		disruptionModel.PromisedDateTime = sap.ui.getCore().byId(
				"createDisruptionView--promisedDate").getValue()
				+ " "
				+ sap.ui.getCore().byId("createDisruptionView--promisedTime")
						.getValue();

		var sComment = sap.ui.getCore().byId("createDisruptionView--comment")
				.getValue();
		var currDate = new Date();
		var date = currDate.getFullYear() + "-" + currDate.getMonth() + "-"
				+ currDate.getDate();

		var oComment = {
			"Action" : airbus.mes.disruptions.oView.viewDisruption.getModel(
					"i18nModel").getProperty("comment"),
			"Comments" : sComment,
			"Counter" : "",
			"Date" : date,
			"MessageRef" : disruptionModel.MessageRef,
			"UserFullName" : (sap.ui.getCore().getModel("userDetailModel")
					.getProperty("/Rowsets/Rowset/0/Row/0/first_name")
					.toLowerCase()
					+ " " + sap.ui.getCore().getModel("userDetailModel")
					.getProperty("/Rowsets/Rowset/0/Row/0/last_name")
					.toLowerCase())
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

							if (nav.getCurrentPage().getId() == "disruptiontrackerView")
								airbus.mes.disruptiontracker.oView
										.getController().disruptionTrackerRefresh = true;
						}

					}
				});

		if (flagSuccess) {

			// Refresh station tracker
			airbus.mes.shell.oView.getController().renderStationTracker();

		}

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

							if (nav.getCurrentPage().getId() == "disruptiontrackerView")
								airbus.mes.disruptiontracker.oView
										.getController().disruptionTrackerRefresh = true;
						}

					}
				});

		if (flagSuccess) {

			// Refresh station tracker
			airbus.mes.shell.oView.getController().renderStationTracker();

		}

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
						"Param.2" : sap.ui.getCore().getModel("userSettingModel")
										.getProperty("/Rowsets/Rowset/0/Row/0/user"),
						"Param.3" : msgRef,
						"Param.4" : comment
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

							if (nav.getCurrentPage().getId() == "disruptiontrackerView")
								airbus.mes.disruptiontracker.oView
										.getController().disruptionTrackerRefresh = true;
						}

					}
				});

		if (flagSuccess) {

			// Refresh station tracker
			airbus.mes.shell.oView.getController().renderStationTracker();

		}

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
		//var flagSuccess;

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
						airbus.mes.shell.ModelManager.messageShow(sMessageError);
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

							if (nav.getCurrentPage().getId() == "disruptiontrackerView")
								airbus.mes.disruptiontracker.oView
										.getController().disruptionTrackerRefresh = true;
						}

					}
				});

		if (flagSuccess) {

			// Refresh station tracker
			airbus.mes.shell.oView.getController().renderStationTracker();

		}

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
	rejectDisruption : function(comment, msgref, sStatus, sMessageSuccess, i18nModel) {
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
						"Param.4" : comment,
						"Param.5" : sStatus
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

							if (nav.getCurrentPage().getId() == "disruptiontrackerView")
								airbus.mes.disruptiontracker.oView
										.getController().disruptionTrackerRefresh = true;
						}

					}
				});

		if (flagSuccess) {

			// Refresh station tracker
			airbus.mes.shell.oView.getController().renderStationTracker();

		}

		return flagSuccess
	},

	/***************************************************************************
	 * Get URL to Delete/ Revoke Disruption
	 **************************************************************************/
	getUrlDeleteDisruption: function(){
		var urlToDisruptionComment = this.urlModel.getProperty("urlDeleteDisruption");
		return urlToDisruptionComment;
	},
	
	
	/***************************************************************************
	 * Get URL to Refuse Disruption
	 **************************************************************************/
	getUrlToRefuseDisruption : function() {
		var urlToDisruptionComment = this.urlModel
				.getProperty("urlToRefuseDisruption");
		return urlToDisruptionComment;
	},

	/***************************************************************************
	 * Reject Disruption Service
	 **************************************************************************/
	refuseDisruption : function(comment, msgref, sMessageSuccess, i18nModel) {
		var sMessageError = i18nModel.getProperty("tryAgain");
		var flagSuccess;

		jQuery
				.ajax({
					url : this.getUrlToRefuseDisruption(),
					async : false,
					data : {
						"Param.1" : airbus.mes.settings.ModelManager.site,
						"Param.2" : msgref,
						"Param.3" : comment,
						"Param.4" : sap.ui.getCore().getModel(
								"userSettingModel").getProperty(
								"/Rowsets/Rowset/0/Row/0/user")
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

							if (nav.getCurrentPage().getId() == "disruptiontrackerView")
								airbus.mes.disruptiontracker.oView
										.getController().disruptionTrackerRefresh = true;
						}

					}
				});

		if (flagSuccess) {
			// Refresh station tracker
			airbus.mes.shell.oView.getController().renderStationTracker();
		}
		return flagSuccess
	},

	// Change text of status in progress tab if any blocking disruption still
	// open (not closed)
	checkDisruptionStatus : function(operationDisruptionsModel) {
		var aDisruption = operationDisruptionsModel
				.getProperty("/Rowsets/Rowset/0/Row");
		var sStatus = null;
		
		if(aDisruption === undefined || aDisruption == null) {
			return;
		}

		// Check if any blocking disruption still open (not closed)
		for (var i = 0; i < aDisruption.length; i++) {
			if (aDisruption[i].Gravity == 3
					&& !airbus.mes.disruptions.Formatter
							.isStatusFinal(aDisruption[i].Status)) {
				sStatus = airbus.mes.disruptions.Formatter.opStatus.blocked;
				break;
			}
		}

		// Set status = blocking
		if (sStatus != null) {
			sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].status = sStatus;
		} else if(sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].status == airbus.mes.operationdetail.Formatter.status.blocked) {
			// Set status = In Progess if blocked earlier	
			
			//	Set the previous status
			sStatus = airbus.mes.stationtracker.GroupingBoxingManager.computeStatus(sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].state,
																													sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].paused, 
																													sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].previously_start );
			
			// calculate status of operation
			if (sStatus == "0")
				sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].status = airbus.mes.disruptions.Formatter.opStatus.completed;
			else if (sStatus == "2")
				sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].status = airbus.mes.disruptions.Formatter.opStatus.active;
			else if (sStatus === "3")
				sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].status = airbus.mes.disruptions.Formatter.opStatus.paused;
			else if (sStatus === "1")
				sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].status = airbus.mes.disruptions.Formatter.opStatus.notStarted;
		}

		// Refresh model
		sap.ui.getCore().getModel("operationDetailModel").refresh();
	},
	/***************************************************************************
	 * Attachment Model in disruption
	 **************************************************************************/	
	
	AttachmentListModel : function(){
		var oViewModel = sap.ui.getCore().getModel("AttachmentList");
		oViewModel.loadData(this.urlModel.getProperty("ListOfAttachment"), null, false);
	},
	
};

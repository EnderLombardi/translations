"use strict";

jQuery.sap.declare("airbus.mes.disruptions.ModelManager")

airbus.mes.disruptions.ModelManager = {

	sCurrentViewId:undefined,
	createEditFlag : false,
    createViewMode : undefined,  // (Values: Create, Edit) To check if create disruption view is called in edit more or creation mode
	urlModel : undefined,
	

	init : function(core) {
		
        if(this.core) return; 
		
        this.core = core;
		core.setModel(new sap.ui.model.json.JSONModel(), "AttachmentList");

		airbus.mes.shell.ModelManager.createJsonModel(core, [ "operationDisruptionsModel", "DisruptionDetailModel", "disruptionCategoryModel",
			"MaterialListModel", // Material List Model
			"JigtoolListModel", // Jigtool List Model
			"disruptionRsnRespGrp", // model for reason and responsible group
			"disruptionResolverModel" // Model for resolver name
		]);

		/***********************************************************************
		 * Attach request complete methods
		 **********************************************************************/
		sap.ui.getCore().getModel("operationDisruptionsModel").attachRequestCompleted(airbus.mes.disruptions.ModelManager.onOperationDisruptionsLoad);
		sap.ui.getCore().getModel("disruptionCategoryModel").attachRequestCompleted(airbus.mes.disruptions.ModelManager.onLoadDisruptionCategory);
		sap.ui.getCore().getModel("disruptionRsnRespGrp").attachRequestCompleted(airbus.mes.disruptions.ModelManager.onLoadDisruptionRsnRespGrp);
		sap.ui.getCore().getModel("disruptionResolverModel").attachRequestCompleted(airbus.mes.disruptions.ModelManager.onLoadDisruptionResolver);

		// Handle URL Model
		jQuery.sap.registerModulePath("airbus.mes.disruptions.config.url_config", "../components/disruptions/config/url_config");
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.disruptions.config.url_config");

	},

	/***************************************************************************
	 * Generic Function to get URL for to get Disruptions with filters or no
	 * filters
	 */
	getDisruptionsURL : function(oFilters) {
		var getDisruptionsURL = airbus.mes.disruptions.ModelManager.urlModel.getProperty("getDiruptionsURL");

		getDisruptionsURL = getDisruptionsURL.replace('$Site', airbus.mes.settings.ModelManager.site);
		getDisruptionsURL = getDisruptionsURL.replace('$Status', "ALL");
		getDisruptionsURL = getDisruptionsURL.replace('$Resource', "");

		if (oFilters.operation != undefined && oFilters.operation != "")
			getDisruptionsURL = getDisruptionsURL.replace('$Operation', oFilters.operation.split(",")[1]);
		else
			getDisruptionsURL = getDisruptionsURL.replace('$Operation', "");

		if (oFilters.sfc_step_ref != undefined && oFilters.sfc_step_ref != "")
			getDisruptionsURL = getDisruptionsURL.replace('$SFCStepRef', oFilters.sfc_step_ref);
		else
			getDisruptionsURL = getDisruptionsURL.replace('$SFCStepRef', "");

		getDisruptionsURL = getDisruptionsURL.replace('$OperationRevision', "");
		getDisruptionsURL = getDisruptionsURL.replace('$SignalFlag', "");
		getDisruptionsURL = getDisruptionsURL.replace('$FromDate', "");
		getDisruptionsURL = getDisruptionsURL.replace('$ToDate', "");

		if (oFilters.station != undefined && oFilters.station != "")
			getDisruptionsURL = getDisruptionsURL.replace('$WorkCenter', "WorkCenterBO:" + // WorkCenter
			// BO
			airbus.mes.settings.ModelManager.site + "," + oFilters.station);
		else
			getDisruptionsURL = getDisruptionsURL.replace('$WorkCenter', "");

		getDisruptionsURL = getDisruptionsURL.replace('$userGroup', "");
		getDisruptionsURL = getDisruptionsURL.replace('$MessageType', "");
		getDisruptionsURL = getDisruptionsURL.replace('$User', sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"));

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

		airbus.mes.operationdetail.oView.setBusyIndicatorDelay(0);
		airbus.mes.operationdetail.oView.setBusy(true); // Set Busy Indicator

		var oViewModel = sap.ui.getCore().getModel("operationDisruptionsModel");

		var getDisruptionsURL = airbus.mes.disruptions.ModelManager.getDisruptionsURL({
			"operation" : operation,
			"sfc_step_ref" : sSfcStepRef
		});

		oViewModel.loadData(getDisruptionsURL);

	},

	/***************************************************************************
	 * After Disruptions related to a operation is loaded
	 */
	onOperationDisruptionsLoad : function() {

		// Reset in hard the model of the view otherwise its not Re-Binded...
		var oView = airbus.mes.disruptionslist.oView;

		/* Set filter for Comments on all the disruptions */
		oView.oController.applyFiltersOnComments();

		// Un-Set Busy
		airbus.mes.operationdetail.oView.setBusy(false);

		if (nav.getCurrentPage().sId == "stationTrackerView" && airbus.mes.disruptions.ModelManager.createEditFlag) {

			airbus.mes.disruptions.ModelManager.checkDisruptionStatus(airbus.mes.disruptionslist.oView.getModel("operationDisruptionsModel"));
		}
		airbus.mes.disruptions.ModelManager.createEditFlag = false;
	},

	/***************************************************************************
	 * Set the Models for Category of Disruption Creation
	 **************************************************************************/
	loadDisruptionCategory : function() {
		var url = airbus.mes.disruptions.ModelManager.getDisruptionCategoryURL();
		sap.ui.getCore().getModel("disruptionCategoryModel").loadData(url);
	},
	getDisruptionCategoryURL : function() {
		var urlCustomCategory = this.urlModel.getProperty("urlGetCategory");
		urlCustomCategory = airbus.mes.shell.ModelManager.replaceURI(urlCustomCategory, "$site", airbus.mes.settings.ModelManager.site);
		urlCustomCategory = airbus.mes.shell.ModelManager.replaceURI(urlCustomCategory, "$station", airbus.mes.settings.ModelManager.station);

		// Get user to which operation is affected else current logged in user
		// In Edit Mode originator field will contain Issuer
		var sIssuer = "";
		if (this.createViewMode == "Create") {
			sIssuer = this.getIssuer();
			urlCustomCategory = airbus.mes.shell.ModelManager.replaceURI(urlCustomCategory, "f", sIssuer);
		} else {
			sIssuer = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/OriginatorID");
			urlCustomCategory = airbus.mes.shell.ModelManager.replaceURI(urlCustomCategory, "$userbo", sIssuer);
		}

		return urlCustomCategory;

	},

	onLoadDisruptionCategory : function() {
		var oView = sap.ui.getCore().byId(airbus.mes.disruptions.ModelManager.sCurrentViewId);

		// Un-Set Busy Indicator
		oView.setBusy(false);
	},

	/***************************************************************************
	 * Load Step2 model for create disruption screen (Reason and Responsible
	 * Group)
	 **************************************************************************/
	getRsnResponsibleGrpURL : function(sMsgType) {
		var urlGetRsnResponsibleGrp = this.urlModel.getProperty("urlGetRsnResponsibleGrp");
		urlGetRsnResponsibleGrp = airbus.mes.shell.ModelManager.replaceURI(urlGetRsnResponsibleGrp, "$site", airbus.mes.settings.ModelManager.site);
		urlGetRsnResponsibleGrp = airbus.mes.shell.ModelManager.replaceURI(urlGetRsnResponsibleGrp, "$station", airbus.mes.settings.ModelManager.station);
		urlGetRsnResponsibleGrp = airbus.mes.shell.ModelManager.replaceURI(urlGetRsnResponsibleGrp, "$messageType", sMsgType);
		return urlGetRsnResponsibleGrp;

	},

	onLoadDisruptionRsnRespGrp : function() {
		var oView = sap.ui.getCore().byId(airbus.mes.disruptions.ModelManager.sCurrentViewId);

		// Un-Set Busy's
		oView.byId("selectreason").setBusy(false);
		oView.byId("selectResponsibleGrp").setBusy(false);

	},

	/***************************************************************************
	 * Load Step3 model for create disruption screen (Resolver Names for a
	 * Resolver Group)
	 **************************************************************************/
	getResolverModelURL : function(sResolverGroup) {
		var urlGetRsnResponsibleGrp = this.urlModel.getProperty("urlGetResolver");
		urlGetRsnResponsibleGrp = airbus.mes.shell.ModelManager.replaceURI(urlGetRsnResponsibleGrp, "$site", airbus.mes.settings.ModelManager.site);
		urlGetRsnResponsibleGrp = airbus.mes.shell.ModelManager.replaceURI(urlGetRsnResponsibleGrp, "$group", sResolverGroup);
		return urlGetRsnResponsibleGrp;

	},

	onLoadDisruptionResolver : function() {
		var oView = sap.ui.getCore().byId(airbus.mes.disruptions.ModelManager.sCurrentViewId);

		// Un-Set Busy's
		oView.byId("selectResolver").setBusy(false);
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

		var getMaterialListURL = airbus.mes.disruptions.ModelManager.getURLMaterialList();

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

		var getJigtoolListURL = airbus.mes.disruptions.ModelManager.getURLJigtoolList();

		oViewModel.loadData(getJigtoolListURL);

	},
	/***************************************************************************
	 * Create Disruption service
	 */

	getURLCreateDisruption : function() {
		var urlCreateDisruption = this.urlModel.getProperty("urlCreateDisruption");
		return urlCreateDisruption;
	},

	createDisruption : function(messageHandle, messageType, messageBody, payloadData) {

		// Set Busy Indicator
		sap.ui.core.BusyIndicator.show(0);

		jQuery.ajax({
			async : true,
			cache : false,
			url : this.getURLCreateDisruption(),
			type : 'POST',
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.3" : messageType,
				/* "Param.4" : "abc", */
				"Param.5" : messageBody,
				"Param.6" : airbus.mes.shell.ModelManager.json2xml({
					payloadAttributelist : payloadData
				}),
				"Param.7" : messageHandle,
				"Param.8" : payloadData[0].payload[8].value, // gravity
				"Param.9" : sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/sfc"),
				// Operation number
				"Param.10" : sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/operation_bo").split(",")[1],
				"Param.11" : "DEFAULT"

			},
			success : function(data, textStatus, jqXHR) {
				// Un-Set Busy Indicator
				sap.ui.core.BusyIndicator.hide(0);

				var rowExists = data.Rowsets.Rowset;
				if (rowExists != undefined) {
					if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {
						airbus.mes.shell.ModelManager.messageShow(airbus.mes.createdisruption.oView.getModel("i18nModel").getProperty("DisruptCreateSuccess"));

						// load disruption Model again for new message
						airbus.mes.disruptions.ModelManager.createEditFlag = true;
						var operationBO = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
						var sSfcStepRef = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref;

						airbus.mes.disruptions.ModelManager.loadDisruptionsByOperation(operationBO, sSfcStepRef);

						// Refresh station tracker
						airbus.mes.shell.oView.getController().renderStationTracker();

						// navigate to View Disruption after success message
						sap.ui.getCore().byId("operationDetailsView--operDetailNavContainer").back();

						// If blocking disruption created
						if (payloadData[0].payload[8].value == "3") {
							// set paused value in operation detail model
							sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].paused = "---";
							sap.ui.getCore().getModel("operationDetailModel").refresh();
						}

					} else if (data.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
						if (data.Rowsets.Rowset[0].Row[0].Message === undefined)
							airbus.mes.shell.ModelManager.messageShow(i18nModel.getProperty("DisruptionNotSaved"));

						else
							airbus.mes.shell.ModelManager.messageShow(data.Rowsets.Rowset[0].Row[0].Message)
					}
				} else if (data.Rowsets.FatalError) {
					airbus.mes.shell.ModelManager.messageShow(data.Rowsets.FatalError);
				}

			},

			error : function() {
				// Un-Set Busy Indicator
				sap.ui.core.BusyIndicator.hide(0);

				airbus.mes.shell.ModelManager.messageShow(airbus.mes.createdisruption.oView.getModel("i18nModel").getProperty("DisruptionNotSaved"));

			}

		});

	},

	/***************************************************************************
	 * Create Disruption service
	 */

	getURLUpdateDisruption : function() {
		var urlUpdateDisruption = this.urlModel.getProperty("urlUpdateDisruption");
		return urlUpdateDisruption;
	},

	updateDisruption : function(sMessageRef, sReason, sResponsibleGroup, iTimeLost, dFixedByTime, sComment, iGravity, dPromisedDate) {

		// Set Busy Indicator
		sap.ui.core.BusyIndicator.show(0);

		jQuery.ajax({
			async : true,
			cache : false,
			url : this.getURLUpdateDisruption(),
			type : 'POST',
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sMessageRef,
				"Param.3" : sReason,
				"Param.4" : sResponsibleGroup,
				// "Param.5" : sRootCause,[MES v1.5]
				"Param.6" : iTimeLost,
				"Param.7" : dFixedByTime,
				"Param.8" : sComment,
				"Param.9" : iGravity,
				"Param.10" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.11" : dPromisedDate,
				"Param.12" : sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/sfc"),
				"Param.13" : sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/operation_bo").split(",")[1], // Operation
				// number
				"Param.14" : "DEFAULT"
			},
			success : function(data, textStatus, jqXHR) {

				// Un-Set Busy Indicator
				sap.ui.core.BusyIndicator.hide(0);

				// Message handling
				var rowExists = data.Rowsets.Rowset;
				if (rowExists != undefined) {
					if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {
						airbus.mes.shell.ModelManager.messageShow(data.Rowsets.Rowset[0].Row[0].Message);

						var currentPage = nav.getCurrentPage().getId();

						if (currentPage == "stationTrackerView") {

							// Load disruption Model again for updated message
							airbus.mes.disruptions.ModelManager.createEditFlag = true;
							var operationBO = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
							var sSfcStepRef = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref;
							airbus.mes.disruptions.ModelManager.loadDisruptionsByOperation(operationBO, sSfcStepRef);

							// Refresh station tracker
							airbus.mes.shell.oView.getController().renderStationTracker();

							sap.ui.getCore().byId("operationDetailsView--operDetailNavContainer").back();

						} else if (currentPage == "disruptiontrackerView") {
							airbus.mes.disruptions.ModelManager.updateDisruptionModel();
							airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;
							sap.ui.getCore().byId("disruptionDetailPopup--disruptDetailNavContainer").back();

						}

						// If disruption is set to blocking
						if (iGravity == "3") {
							// set paused value in operation detail model
							sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].paused = "---";
							sap.ui.getCore().getModel("operationDetailModel").refresh();
						}

					} else if (data.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
						if (data.Rowsets.Rowset[0].Row[0].Message === undefined)
							airbus.mes.shell.ModelManager.messageShow(airbus.mes.createdisruption.oView.getModel("i18nModel").getProperty(
								"DisruptionNotUpdated"));
						else
							airbus.mes.shell.ModelManager.messageShow(data.Rowsets.Rowset[0].Row[0].Message)
					}
				} else if (data.Rowsets.FatalError) {
					airbus.mes.shell.ModelManager.messageShow(data.Rowsets.FatalError);
				}

			},

			error : function() {
				// Un-Set Busy Indicator
				sap.ui.core.BusyIndicator.hide(0);
				
				airbus.mes.shell.ModelManager
					.messageShow(airbus.mes.createdisruption.oView.getModel("i18nModel").getProperty("DisruptionNotSaved"));

			}

		});

	},

	updateDisruptionModel : function() {

		var oModel = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel");

		var disruptionModel = oModel.getProperty("/Rowsets/Rowset/0/Row/0");

		disruptionModel.Reason = sap.ui.getCore().byId("createDisruptionView--selectreason").getSelectedKey();

		if (sap.ui.getCore().byId("createDisruptionView--selectResponsibleGrp").getSelectedItem()) {
			disruptionModel.ResponsibleGroupDesc = sap.ui.getCore().byId("createDisruptionView--selectResponsibleGrp").getSelectedItem().getText();
			disruptionModel.ResponsibleGroup = sap.ui.getCore().byId("createDisruptionView--selectResponsibleGrp").getSelectedKey();
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
			"UserFullName" : (sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " + sap.ui
				.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase())
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
	escalateDisruption : function(msgRef, sComment, i18nModel) {

		jQuery.ajax({
			url : this.getUrlOnEscalate(),
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : msgRef,
				"Param.3" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.4" : sComment
			},
			type : 'POST',
			error : function(xhr, status, error) {

				airbus.mes.disruptions.__enterCommentDialogue.setBusy(false);
				airbus.mes.disruptions.func.tryAgainError(i18nModel);

			},
			success : function(result, status, xhr) {
				airbus.mes.disruptions.__enterCommentDialogue.setBusy(false);
				
				if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") { // Error
					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);

				} else { // Success
					airbus.mes.disruptions.__enterCommentDialogue.close();
					airbus.mes.shell.ModelManager.messageShow(i18nModel.getProperty("successfulEscalation"));

					// load again disruptions data
					if (nav.getCurrentPage().getId() == "stationTrackerView") {
						var operationBO = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
						var sSfcStepRef = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref;

					} else if (nav.getCurrentPage().getId() == "disruptiontrackerView") {
						var operationBO = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].Operation;
						var sSfcStepRef = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].SfcStepBO;
					}
					airbus.mes.disruptions.ModelManager.loadDisruptionsByOperation(operationBO, sSfcStepRef);
					
					// Refresh station tracker
					if (nav.getCurrentPage().getId() == "stationtrackerView")
						airbus.mes.shell.oView.getController().renderStationTracker();

					// Set Refresh disruption tracker flag
					else if (nav.getCurrentPage().getId() == "disruptiontrackerView")
						airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;

				}
			}
		});
	},

	/***************************************************************************
	 * Get URL to Acknowledge Disruption
	 **************************************************************************/
	getUrlToAckDisruption : function() {

		var urlToAckDisruption = this.urlModel.getProperty("urlToAckDisruption");
		return urlToAckDisruption;
	},

	/***************************************************************************
	 * Acknowledge Disruption
	 **************************************************************************/
	ackDisruption : function(dateTime, msgRef, comment, i18nModel) {

		jQuery
			.ajax({
				url : this.getUrlToAckDisruption(),
				data : {
					"Param.1" : airbus.mes.settings.ModelManager.site,
					"Param.2" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
					"Param.3" : msgRef,
					"Param.4" : comment,
					"Param.5" : dateTime
				},
				error : function(xhr, status, error) {
					if (!airbus.mes.disruptions.func.isSupportTeamViaDestop()) {
						airbus.mes.disruptions.__enterAckCommentDialogue.setBusy(false);
					}
					airbus.mes.disruptions.func.tryAgainError(i18nModel);
				},
				success : function(result, status, xhr) {

					if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") { // Error
						airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);

					} else { // Success
						var sMessageSuccess = i18nModel.getProperty("successfulAcknowledge");
						airbus.mes.shell.ModelManager.messageShow(sMessageSuccess);

						// load again disruptions data
						if (!airbus.mes.disruptions.func.isSupportTeamViaDestop()) {

							airbus.mes.disruptions.__enterAckCommentDialogue.setBusy(false);
							airbus.mes.disruptions.__enterAckCommentDialogue.close();

							if (nav.getCurrentPage().getId() == "stationTrackerView") {
								var operationBO = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
								var sSfcStepRef = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref;

							} else if (nav.getCurrentPage().getId() == "disruptiontrackerView") {
								var operationBO = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].Operation;
								var sSfcStepRef = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].SfcStepBO;
							}
							airbus.mes.disruptions.ModelManager.loadDisruptionsByOperation(operationBO, sSfcStepRef);

							// Set Refresh disruption tracker flag
							if (nav.getCurrentPage().getId() == "disruptiontrackerView")
								airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;

						} else {
							airbus.mes.shell.util.navFunctions.disruptionTracker();
						}
					}

				}
			});
	},

	/***************************************************************************
	 * Get URL to Mark Solved Disruption
	 **************************************************************************/
	getUrlToMarkSolvedDisruption : function() {

		var urlToMarkSolvedDisruption = this.urlModel.getProperty("urlToMarkSolvedDisruption");
		return urlToMarkSolvedDisruption;
	},

	/***************************************************************************
	 * Mark Solved Disruption
	 **************************************************************************/
	markSolvedDisruption : function(msgRef, comment, i18nModel) {

		jQuery.ajax({
			url : this.getUrlToMarkSolvedDisruption(),
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.3" : msgRef,
				"Param.4" : comment
			},
			error : function(xhr, status, error) {

				airbus.mes.disruptions.__enterCommentDialogue.setBusy(false);
				airbus.mes.disruptions.func.tryAgainError(i18nModel);

			},
			success : function(result, status, xhr) {
				airbus.mes.disruptions.__enterCommentDialogue.setBusy(false);
				
				if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") { // Error
					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);

				} else { // Success
					airbus.mes.disruptions.__enterCommentDialogue.close();
					
					var sMessageSuccess = i18nModel.getProperty("successSolved");
					airbus.mes.shell.ModelManager.messageShow(sMessageSuccess);

					// load again disruptions data
					if (nav.getCurrentPage().getId() == "stationTrackerView") {
						var operationBO = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
						var sSfcStepRef = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref;

					} else if (nav.getCurrentPage().getId() == "disruptiontrackerView") {
						var operationBO = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].Operation;
						var sSfcStepRef = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].SfcStepBO;
					}
					airbus.mes.disruptions.ModelManager.loadDisruptionsByOperation(operationBO, sSfcStepRef);
					
					// Refresh station tracker
					if (nav.getCurrentPage().getId() == "stationtrackerView")
						airbus.mes.shell.oView.getController().renderStationTracker();

					// Set Refresh disruption tracker flag
					else if (nav.getCurrentPage().getId() == "disruptiontrackerView")
						airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;

				}
			}
		});
	},

	/***************************************************************************
	 * Get URL to Add Comment
	 **************************************************************************/
	getUrlToAddComment : function() {
		var urlToAddComment = this.urlModel.getProperty("urlToAddComment");
		return urlToAddComment;
	},

	/***************************************************************************
	 * Add Comment service
	 **************************************************************************/
	addComment : function(sComment, msgRef, i18nModel) {

		// Set Busy
		airbus.mes.operationdetail.oView.setBusyIndicatorDelay(0);
		airbus.mes.operationdetail.oView.setBusy(true);

		jQuery.ajax({
			url : this.getUrlToAddComment(),
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sComment,
				"Param.3" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.4" : msgRef

			},
			error : function(xhr, status, error) {
				airbus.mes.operationdetail.oView.setBusy(false);
				airbus.mes.disruptions.func.tryAgainError(i18nModel);

			},
			success : function(result, status, xhr) {
				airbus.mes.operationdetail.oView.setBusy(false);

				if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message)

				} else {					
					var sMessageSuccess = i18nModel.getProperty("commentSuccessful");
					airbus.mes.shell.ModelManager.messageShow(sMessageSuccess);
					
					// load again disruptions data
					if (nav.getCurrentPage().getId() == "stationTrackerView") {
						var operationBO = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
						var sSfcStepRef = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref;

					} else if (nav.getCurrentPage().getId() == "disruptiontrackerView") {
						var operationBO = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].Operation;
						var sSfcStepRef = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].SfcStepBO;
					}
					airbus.mes.disruptions.ModelManager.loadDisruptionsByOperation(operationBO, sSfcStepRef);
/*
					// Add Comment to Model
					var currDate = new Date();
					var date = currDate.getFullYear() + "-" + ('0' + (currDate.getMonth() + 1)).slice(-2) + "-" + ('0' + currDate.getDate()).slice(-2);
					var oComment = {
						"Action" : i18nModel.getProperty("comment"),
						"Comments" : sComment,
						"Counter" : "",
						"Date" : date,
						"MessageRef" : msgRef,
						"UserFullName" : (sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase()
							+ " " + sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase())
					};

					var oModel = sap.ui.getCore().getModel("operationDisruptionsModel");
					oModel.getProperty("/Rowsets/Rowset/1/Row").push(oComment);
					oModel.refresh();*/
				}

			}
		});

	},

	/***************************************************************************
	 * Get URL to Close Disruption
	 **************************************************************************/
	getUrlToCloseDisruption : function() {

		var urlToCloseDisruption = this.urlModel.getProperty("urlToCloseDisruption");
		return urlToCloseDisruption;
	},

	/***************************************************************************
	 * Close Disruption Service
	 **************************************************************************/
	/*closeDisruption : function(msgRef, comment, timeLost, i18nModel) {

		var sMessageSuccess = i18nModel.getProperty("successClosed");
		var flagSuccess;

		jQuery.ajax({
			url : this.getUrlToCloseDisruption(),
			async : false,
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.3" : msgRef,
				"Param.4" : comment,
				"Param.5" : timeLost
			},
			error : function(xhr, status, error) {
				airbus.mes.disruptions.func.tryAgainError();
				flagSuccess = false

			},
			success : function(result, status, xhr) {
				if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
					airbus.mes.shell.ModelManager.messageShow(sMessageSuccess);
					flagSuccess = true;

				} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
					flagSuccess = false;
				} else {
					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
					flagSuccess = true;

					if (nav.getCurrentPage().getId() == "disruptiontrackerView")
						airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;
				}

			}
		});

		if (flagSuccess) {

			// Refresh station tracker
			airbus.mes.shell.oView.getController().renderStationTracker();

		}

		return flagSuccess;
	},*/

	/***************************************************************************
	 * Get URL to Reject Disruption
	 **************************************************************************/
	getUrlToRejectDisruption : function() {
		var urlToDisruptionComment = this.urlModel.getProperty("urlToRejectDisruption");
		return urlToDisruptionComment;
	},

	/***************************************************************************
	 * Reject Disruption Service
	 **************************************************************************/
	rejectDisruption : function(comment, msgref, sStatus, i18nModel) {

		jQuery.ajax({
			url : this.getUrlToRejectDisruption(),
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"),
				"Param.3" : msgref,
				"Param.4" : comment,
				"Param.5" : sStatus
			},
			error : function(xhr, status, error) {

				airbus.mes.disruptions.__enterCommentDialogue.setBusy(false);
				airbus.mes.disruptions.func.tryAgainError(i18nModel);

			},
			success : function(result, status, xhr) {
				airbus.mes.disruptions.__enterCommentDialogue.setBusy(false);
				
				if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") { // Error
					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);

				} else { // Success
					airbus.mes.disruptions.__enterCommentDialogue.close();
					
					var sMessageSuccess = i18nModel.getProperty("successReject");
					airbus.mes.shell.ModelManager.messageShow(sMessageSuccess);

					// load again disruptions data
					if (nav.getCurrentPage().getId() == "stationTrackerView") {
						var operationBO = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
						var sSfcStepRef = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref;

					} else if (nav.getCurrentPage().getId() == "disruptiontrackerView") {
						var operationBO = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].Operation;
						var sSfcStepRef = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].SfcStepBO;
					}
					airbus.mes.disruptions.ModelManager.loadDisruptionsByOperation(operationBO, sSfcStepRef);
					
					// Refresh station tracker
					if (nav.getCurrentPage().getId() == "stationtrackerView")
						airbus.mes.shell.oView.getController().renderStationTracker();

					// Set Refresh disruption tracker flag
					else if (nav.getCurrentPage().getId() == "disruptiontrackerView")
						airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;

				}
			}
		});
	},

	/***************************************************************************
	 * Get URL to Delete/ Revoke Disruption
	 **************************************************************************/
	getUrlDeleteDisruption : function() {
		var urlToDisruptionComment = this.urlModel.getProperty("urlDeleteDisruption");
		return urlToDisruptionComment;
	},

	/***************************************************************************
	 * Get URL to Refuse Disruption
	 **************************************************************************/
	getUrlToRefuseDisruption : function() {
		var urlToDisruptionComment = this.urlModel.getProperty("urlToRefuseDisruption");
		return urlToDisruptionComment;
	},

	/***************************************************************************
	 * Reject Disruption Service
	 **************************************************************************/
	refuseDisruption : function(comment, msgref, i18nModel) {

		jQuery.ajax({
			url : this.getUrlToRefuseDisruption(),
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : msgref,
				"Param.3" : comment,
				"Param.4" : sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user")
			},
			error : function(xhr, status, error) {
				airbus.mes.disruptions.func.tryAgainError(i18nModel);

			},
			success : function(result, status, xhr) {
				if (result.Rowsets.Rowset[0].Row[0].Message_Type != undefined && result.Rowsets.Rowset[0].Row[0].Message_Type == "E") { // Error
					airbus.mes.shell.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);

				} else { // Success
					
					var sMessageSuccess = i18nModel.getProperty("successRefused");
					airbus.mes.shell.ModelManager.messageShow(sMessageSuccess);

					// load again disruptions data
					if (nav.getCurrentPage().getId() == "stationTrackerView") {
						var operationBO = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
						var sSfcStepRef = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref;

					} else if (nav.getCurrentPage().getId() == "disruptiontrackerView") {
						var operationBO = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].Operation;
						var sSfcStepRef = airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0].SfcStepBO;
					}
					airbus.mes.disruptions.ModelManager.loadDisruptionsByOperation(operationBO, sSfcStepRef);
					
					// Refresh station tracker
					if (nav.getCurrentPage().getId() == "stationtrackerView")
						airbus.mes.shell.oView.getController().renderStationTracker();

					// Set Refresh disruption tracker flag
					else if (nav.getCurrentPage().getId() == "disruptiontrackerView")
						airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = true;

				}

			}
		});
	},

	// Change text of status in progress tab if any blocking disruption still
	// open (not closed)
	checkDisruptionStatus : function(operationDisruptionsModel) {
		var aDisruption = operationDisruptionsModel.getProperty("/Rowsets/Rowset/0/Row");
		var sStatus = null;

		if (aDisruption === undefined || aDisruption == null) {
			return;
		}

		// Check if any blocking disruption still open (not closed)
		for (var i = 0; i < aDisruption.length; i++) {
			if (aDisruption[i].Gravity == 3 && !airbus.mes.disruptions.Formatter.isStatusFinal(aDisruption[i].Status)) {
				sStatus = airbus.mes.disruptions.Formatter.opStatus.blocked;
				break;
			}
		}

		// Set status = blocking
		if (sStatus != null) {
			sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].status = sStatus;
		} else if (sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].status == airbus.mes.operationdetail.Formatter.status.blocked) {
			// Set status = In Progress if blocked earlier

			// Set the previous status
			sStatus = airbus.mes.stationtracker.util.GroupingBoxingManager.computeStatus(
				sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].state,
				sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].paused,
				sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].previously_start);

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
	 * Get the issuer of the disruption
	 */
	getIssuer : function() {
			// Check if generic User, "Generic users are starting with SH*."
			var sUser =	((sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user")).substring(0,2) == "SH")?
		    //then send operator of operation as issuer
			(sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/USER_BO").split(",")[1]):
			//Else Current logged in user for a real user as Issuer
			(sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"));  
       
	 // If generic user and no operator assigned, prompt for username
		if	(sUser==undefined) 
			sUser=airbus.mes.shell.oView.getController().goToMyProfile();
		    
		else
		return sUser;
	},

	/***************************************************************************
	 * Attachment Model in disruption
	 **************************************************************************/

	AttachmentListModel : function() {
		var oViewModel = sap.ui.getCore().getModel("AttachmentList");
		oViewModel.loadData(this.urlModel.getProperty("ListOfAttachment"), null, false);
	},

};

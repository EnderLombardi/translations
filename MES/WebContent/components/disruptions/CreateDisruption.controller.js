"use strict";

sap.ui.controller("airbus.mes.disruptions.CreateDisruption", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf airbus.mes.components.disruptions.CreateDisruption
	 */
	/*
	 * onInit : function() { // this.loadDisruptionCustomData();
	 * this.addParent(this.selectTree, undefined); },
	 */
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf airbus.mes.components.disruptions.CreateDisruption
	 */
	// onBeforeRendering: function() {
	//
	// },
	onInit : function() {

		/*
		 * this.getView().byId("selectreason").setSelectedKey();
		 * this.getView().byId("selectResponsibleGrp").setSelectedKey();
		 * this.getView().byId("selectOriginator").setSelectedKey(); if
		 * (!sap.ui.Device.system.desktop) { this.setEnabledSelectBox(true,
		 * false, false, false); }
		 */
		this.getView().byId("timeLost").setPlaceholder(airbus.mes.disruptions.Formatter.getConfigTimeFullUnit());
	},

	// *******************on change of item in the ComboBox

	onSelectionChange : function(oEvt) {
		var id = oEvt.getSource().getId().split("--")[1];

		switch (id) {

		case "selectFivemCategory": // +V1.5
			// Apply filter
			var aFilters = [];
			var sCateoryKey = this.getView().byId("selectFivemCategory").getSelectedKey();
			aFilters.push(new sap.ui.model.Filter("CATEGORY_CLASS", sap.ui.model.FilterOperator.EQ, sCateoryKey));
			this.getView().byId("selectCategory").getBinding("items").filter(aFilters);
			this.getView().byId("selectCategory").setSelectedKey();

		case "selectCategory":

			if (airbus.mes.disruptions.ModelManager.createViewMode == "Edit")
				airbus.mes.disruptions.ModelManager.createViewMode = "Update";

			// Avoid un-necessary AJAX call
			if (this.getView().byId("selectCategory").getSelectedKey() == "") {
				this.afterRsnRespGrpModelLoad();
				break;
			}

			airbus.mes.disruptions.ModelManager.loadRsnResponsibleGrp(this.getView().byId("selectCategory").getSelectedKey());
			break;

		case "selectResponsibleGrp": // +V1.5

			if (airbus.mes.disruptions.ModelManager.createViewMode == "Edit")
				airbus.mes.disruptions.ModelManager.createViewMode = "Update";

			this.getView().byId("selectResolver").setSelectedKey();

			// Avoid un-necessary AJAX call
			if (this.getView().byId("selectResponsibleGrp").getSelectedKey() == "") {
				this.afterResolverModelLoad();
				break;
			}

			airbus.mes.disruptions.ModelManager.loadResolverModel(this.getView().byId("selectResponsibleGrp").getSelectedKey());
			break;

		case "selectreason":
			// Do nothing

			/*
			 * // Apply filter var aFilters = []; var sReason =
			 * this.getView().byId("selectreason").getSelectedKey();
			 * aFilters.push(new sap.ui.model.Filter("REASON",
			 * sap.ui.model.FilterOperator.EQ, sReason));
			 * this.getView().byId("selectRootCause").getBinding("items")
			 * .filter(aFilters) // Enable field
			 * this.getView().byId("selectRootCause").setEnabled(true);
			 */
			break;
			
		default:
		}

	},

	/***************************************************************************
	 * After Reason and Responsible group is loaded
	 */
	afterRsnRespGrpModelLoad : function() {
		var oView = this.getView();

		if (airbus.mes.disruptions.ModelManager.createViewMode == "Create" || airbus.mes.disruptions.ModelManager.createViewMode == "Update") {
			oView.byId("selectreason").setSelectedKey();
			oView.byId("selectResponsibleGrp").setSelectedKey();

			if (oView.byId("selectCategory").getSelectedKey() == "") {
				oView.byId("selectreason").setEnabled(false);
				oView.byId("selectResponsibleGrp").setEnabled(false);
			} else {
				oView.byId("selectreason").setEnabled(true);
				oView.byId("selectResponsibleGrp").setEnabled(true);
			}

			// Disable and empty Resolver name field +V1.5
			oView.byId("selectResolver").setEnabled(false);
			oView.byId("selectResolver").setSelectedKey();
		} else if (airbus.mes.disruptions.ModelManager.createViewMode == "Edit") {

			var oModel = oView.getModel("DisruptionDetailModel");

			// Set Responsible Group
			oView.byId("selectResponsibleGrp").setSelectedKey(oModel.getProperty("/ResponsibleGroup"));

			// Set Reason
			var sReason = oModel.getProperty("/Reason");
			oView.byId("selectreason").setSelectedKey(sReason);

			// -V1.5 ==> No Root cause required
			/*
			 * // Apply filter for Root Cause var aFilters = [];
			 * aFilters.push(new sap.ui.model.Filter("REASON",
			 * sap.ui.model.FilterOperator.EQ, sReason));
			 * oView.byId("selectRootCause").getBinding("items")
			 * .filter(aFilters) // Set Root Cause
			 * oView.byId("selectRootCause")
			 * .setSelectedKey(oModel.getProperty("/RootCause"));
			 */
		}
	},

	/***************************************************************************
	 * V1.5 - After Resolver names model is loaded
	 */
	afterResolverModelLoad : function() {
		var oView = this.getView();

		if (airbus.mes.disruptions.ModelManager.createViewMode == "Create" || airbus.mes.disruptions.ModelManager.createViewMode == "Update") {

			if (oView.byId("selectResponsibleGrp").getSelectedKey() == "")
				oView.byId("selectResolver").setEnabled(false);
			else
				oView.byId("selectResolver").setEnabled(true);
		} else if (airbus.mes.disruptions.ModelManager.createViewMode == "Edit") {

			var oModel = oView.getModel("DisruptionDetailModel");

			// Set Resolver Name
			oView.byId("selectResolver").setSelectedKey(oModel.getProperty("/ResolverID"));
		}
	},

	/***************************************************************************
	 * Settings to be done in parallel to load model when screen called in edit
	 * mode.
	 **************************************************************************/
	editPreSettings : function() {
		var oView = this.getView();

		if (oView.getModel("DisruptionDetailModel").getData() != undefined) {

			// fill select boxes on edit screen
			var oModel = oView.getModel("DisruptionDetailModel");

			// Set Gravity
			oView.byId("gravity").setSelectedKey(oModel.getProperty("/Gravity"));

			// Set Time Lost
			oView.byId("timeLost").setValue(airbus.mes.disruptions.Formatter.timeMillisecondsToConfig(oModel.getProperty("/TimeLost")));

			// Set Status and Description
			oView.byId("status").setValue(oModel.getProperty("/Status"));
			// oView.byId("description").setValue(oModel.getProperty("/Description")); -V1.5

			// Empty Comment
			oView.byId("comment").setValue();

			// If opened by support team from disruption tracker - V1.5
			if (sap.ui.Device.system.desktop && nav.getPreviousPage().sId == "disruptiontrackerView") {
				oView.byId("escalationLevel").setValue(oModel.getProperty("/EscalationLevel"));
			}

			var oMatInp = oView.byId("materials");
			var oJiginp = oView.byId("jigtools");

			var aMatArray = oModel.oData.Materials.split(",");
			var aJigArray = oModel.oData.JigTools.split(",");

			var aMatTokens = [];
			var aJigTokens = [];

			for ( var i in aMatArray) {

				if (aMatArray[i] !== "") {

					var loMatToken = new sap.m.Token({
						text : aMatArray[i],
						editable : false,
					});

					aMatTokens.push(loMatToken)

				}
			}

			oMatInp.setTokens(aMatTokens);
			if (this._materialListDialog != undefined) {
				this._materialListDialog.close();
			}

			for ( var j in aJigArray) {

				if (aJigArray[j] != "") {
					var loJigToken = new sap.m.Token({
						text : aJigArray[j],
						editable : false,
					});

					aJigTokens.push(loJigToken)

				}
			}

			oJiginp.setTokens(aJigTokens);
			if (this.jigToolSelectDialog != undefined) {

				this.jigToolSelectDialog.close()

			}

			/*******************************************************************
			 * Disable/Enable inputs according to * Originator/Resolution Group *
			 ******************************************************************/
			var origFlag = oModel.getProperty("/OriginatorFlag");
			var resFlag = oModel.getProperty("/ResponsibleFlag");

			if (origFlag != "X" && resFlag == "X") {
				this.resolutionGroupSettings();
			} else if (origFlag == "X" && resFlag == "X") {
				this.bothGroupSettings()
			} else {
				this.originatorGroupSettings();
			}
		}

		// promised date has to be visible while editing
		oView.byId("promisedDateLabel").setVisible(true);
		oView.byId("promisedDate").setVisible(true);
		oView.byId("promisedTime").setVisible(true);
	},

	/***************************************************************************
	 * Called after Disruption Category model is loaded. To fill the catroy,
	 * originaotr and 5-M Category fields
	 */
	editDisruptionSettings : function() {
		var oView = this.getView();

		if (oView.getModel("DisruptionDetailModel").getData() != undefined) {

			var oModel = oView.getModel("DisruptionDetailModel");

			// V1.5 - Set 5M-Category
			oView.byId("selectFivemCategory").setSelectedKey(oModel.getProperty("/CategoryClass"));

			// Set Message Category (Object)
			oView.byId("selectCategory").setSelectedKey(oModel.getProperty("/MessageType"));

			// Set Originator
			oView.byId("selectOriginator").setSelectedKey(oModel.getProperty("/OriginatorGroup"));
		}
	},

	/***************************************************************************
	 * Create Disruption
	 */
	// get selected jig Tools
	getSelectedJIgTool : function() {
		var getTokens = sap.ui.getCore().byId("createDisruptionView--jigtools").getTokens();
		var result;
		getTokens.forEach(function(entry) {
			if (result == undefined)
				result = entry.getText();
			else
				result = result + "," + entry.getText();
		});
		return result;
	},
	// get selected jig Tools
	getSelectedMaterials : function() {
		var getTokens = sap.ui.getCore().byId("createDisruptionView--materials").getTokens();
		var result;
		getTokens.forEach(function(entry) {
			if (result == undefined)
				result = entry.getText();
			else
				result = result + "," + entry.getText();
		});
		return result;
	},

	onCreateDisruption : function() {

		var oView = airbus.mes.disruptions.oView.createDisruption;
		var validationFlag = oView.getController().checkExpectedDate();
		if (validationFlag == false) {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsaryExpectedDateTime"));
			return;
		}

		var sJigtools = oView.getController().getSelectedJIgTool();
		if (sJigtools == undefined) {
			sJigtools = ""
		}

		var sMaterials = oView.getController().getSelectedMaterials();
		if (sMaterials == undefined) {
			sMaterials = ""
		}

		var oController = oView.getController();

		// some mandatory fields need to be filled before
		// creating a disruption.
		var bInputMissing = oController.validateDisruptionInput(oView);
		if (bInputMissing == false)
			return;

		var sCategory = oView.byId("selectCategory").getSelectedKey();
		// var sRootCause = oView.byId("selectRootCause").getSelectedKey();
		var sComment = airbus.mes.disruptions.Formatter.actions.create + oView.byId("comment").getValue();

		// Get handle for the selected disruption custom data row
		// hanlde is a unique for Custom Data
		var sPathReason = oView.byId("selectreason").getSelectedItem().getBindingInfo("key").binding.getContext().sPath
		var sHandle = oView.getModel("disruptionRsnRespGrp").getProperty(sPathReason).HANDLE;

		// Create a JSON for payload attributes
		var aModelData = []

		var oJson = {
			"payload" : [
				{
					"attribute" : "OPERATION_BO",
					"value" : sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/operation_bo"),
				},
				{
					"attribute" : "WORKORDER",
					"value" : sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/wo_no"),
				},
				{
					"attribute" : "SFC_BO",
					"value" : "SFCBO:" + airbus.mes.settings.ModelManager.site + ","
						+ sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/sfc"),
				}, {
					"attribute" : "SFC_STEP_BO",
					"value" : sap.ui.getCore().getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/sfc_step_ref"),
				}, /*
					 * { "attribute" : "DESCRIPTION", "value" :
					 * oView.byId("description").getValue() },
					 */{
					"attribute" : "REASON",
					"value" : oView.byId("selectreason").getSelectedKey()
				}, {
					"attribute" : "TIME_LOST",
					"value" : airbus.mes.disruptions.Formatter.timeToMilliseconds(oView.byId("timeLost").getValue())
				}, {
					"attribute" : "REQD_FIX_BY",
					"value" : oView.byId("expectedDate").getValue() + " " + oView.byId("expectedTime").getValue()
				}, {
					"attribute" : "GRAVITY",
					"value" : oView.byId("gravity").getSelectedKey()
				}, {
					"attribute" : "STATUS",
					"value" : airbus.mes.disruptions.Formatter.status.pending
				}, /*
					 * { "attribute" : "ROOT_CAUSE", "value" :
					 * oView.byId("selectRootCause").getSelectedKey() },
					 */{
					"attribute" : "MSN",
					"value" : airbus.mes.settings.ModelManager.msn
				}, {
					"attribute" : "RESPONSIBLE_GROUP",
					"value" : oView.byId("selectResponsibleGrp").getSelectedKey()
				}, {
					"attribute" : "ORIGINATOR_GROUP",
					"value" : oView.byId("selectOriginator").getSelectedKey()
				}, {
					"attribute" : "WORK_CENTER_BO",
					"value" : "WorkCenterBO:" + airbus.mes.settings.ModelManager.site + "," + airbus.mes.settings.ModelManager.station
				}, {
					"attribute" : "MATERIALS",
					"value" : sMaterials
				}, {
					"attribute" : "JIG_TOOLS",
					"value" : sJigtools
				}, {
					"attribute" : "ISSUER", // V1.5
					"value" : airbus.mes.disruptions.ModelManager.getIssuer()
				}, {
					"attribute" : "FIVEM_CATEGORY", // V1.5
					"value" : oView.byId("selectFivemCategory").getSelectedKey()
				}, {
					"attribute" : "RESOLVER", // V1.5
					"value" : oView.byId("selectResolver").getSelectedKey()
				}, {
					"attribute" : "LINE",
					"value" : airbus.mes.settings.ModelManager.line
				}, ]

		}
		aModelData.push(oJson);

		// var sDescription = oView.byId("description").getValue(); -V1.5
		// message subject is passed as description because

		airbus.mes.disruptions.ModelManager.createDisruption(sHandle, sCategory, sComment, aModelData);
	},

	/***************************************************************************
	 * Validate inputs while creating/updating disruption
	 */
	validateDisruptionInput : function(oView) {
		/*
		 * if (oView.byId("description").getValue() == "") {
		 * airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsaryDescription"));
		 * return false; } else
		 */
		if (oView.byId("selectCategory").getSelectedKey() == "") {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsaryCategory"));
			return false;
		} else if (oView.byId("selectreason").getSelectedKey() == "") {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsaryReason"));
			return false;
		} else if (oView.byId("selectResponsibleGrp").getSelectedKey() == "") {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsaryResponsible"));
			return false;
		} else if (oView.byId("selectOriginator").getSelectedKey() == "") {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsaryOriginator"));
			return false;
		} else if (oView.byId("expectedDate").getValue() == "" || oView.byId("expectedTime").getValue() == "") {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsaryExpectedDateTime"));
			return false;
		} else {
			return true;
		}
	},
	checkExpectedDate : function() {
		var oView = airbus.mes.disruptions.oView.createDisruption;

		var expectedTime = oView.byId("expectedTime").getValue();
		var openDate = oView.byId("openDate").getValue();
		var openTime = oView.byId("openTime").getValue();
		var expectedDate = oView.byId("expectedDate").getValue();
		if (expectedTime == "") {
			var openDateTime = new Date(openDate);
			var expectedDateTime = new Date(expectedDate);

		} else {
			var openDateTime = new Date(openDate + " " + openTime);
			var expectedDateTime = new Date(expectedDate + " " + expectedTime);
		}

		if (openDateTime > expectedDateTime) {

			var flagProceed = false;

		}
		return flagProceed;

	},

	/***************************************************************************
	 * For originator - update will be done for Comment, Reason, Responsible
	 * Group, Time lost , Expected date/time and Root Cause.
	 */
	onUpdateDisruption : function() {
		var oView = airbus.mes.disruptions.oView.createDisruption;

		var sMessageRef = oView.getModel("DisruptionDetailModel").getProperty("/MessageRef")
		var sReason = oView.byId("selectreason").getSelectedKey();
		var sResponsibleGroup = oView.byId("selectResponsibleGrp").getSelectedKey();

		// -[MES V1.5] root cause removed
		// var sRootCause = oView.byId("selectRootCause").getSelectedKey();

		var iTimeLost = airbus.mes.disruptions.Formatter.timeToMilliseconds(oView.byId("timeLost").getValue());
		var dFixedByTime = oView.byId("expectedDate").getValue() + " " + oView.byId("expectedTime").getValue();
		var sComment = airbus.mes.disruptions.Formatter.actions.edit + oView.byId("comment").getValue();
		var iGravity = oView.byId("gravity").getSelectedKey();
		var dPromisedTime = oView.byId("promisedDate").getValue() === "" ? "" : oView.byId("promisedDate").getValue() + " "
			+ oView.byId("promisedTime").getValue();
		// call update service
		airbus.mes.disruptions.ModelManager.updateDisruption(sMessageRef, sReason, sResponsibleGroup, iTimeLost, dFixedByTime, sComment, iGravity,
			dPromisedTime);// [MES V1.5]root cause removed

	},
	/**
	 * MES V1.5 when user belong to Both originator and resolver group
	 */
	bothGroupSettings : function() {
		this.getView().byId("selectFivemCategory").setEnabled(false);
		this.getView().byId("selectCategory").setEnabled(false);
		this.getView().byId("selectreason").setEnabled(true);
		this.getView().byId("selectResponsibleGrp").setEnabled(true);
		this.getView().byId("selectOriginator").setEnabled(false);
		this.getView().byId("description").setEnabled(false);
		this.getView().byId("promisedDate").setEnabled(true);
		this.getView().byId("promisedTime").setEnabled(true);
		this.getView().byId("expectedDate").setEnabled(true);
		this.getView().byId("expectedTime").setEnabled(true);
		this.getView().byId("gravity").setEnabled(true);
		this.getView().byId("timeLost").setEnabled(false);
		this.getView().byId("materials").setEnabled(false);
		this.getView().byId("jigtools").setEnabled(false);
		this.getView().byId("selectResolver").setEnabled(true);
	},
	resolutionGroupSettings : function() {
		var oView = this.getView();

		oView.byId("selectFivemCategory").setEnabled(false);
		oView.byId("selectCategory").setEnabled(false);
		oView.byId("selectreason").setEnabled(false);
		// oView.byId("selectRootCause").setEnabled(true); //-V1.5
		oView.byId("selectResponsibleGrp").setEnabled(true);
		oView.byId("selectOriginator").setEnabled(false);
		oView.byId("description").setEnabled(false);
		oView.byId("promisedDate").setEnabled(true);
		oView.byId("promisedTime").setEnabled(true);
		oView.byId("expectedDate").setEnabled(false);
		oView.byId("expectedTime").setEnabled(false);
		oView.byId("gravity").setEnabled(false);
		oView.byId("timeLost").setEnabled(false);
		oView.byId("materials").setEnabled(false);
		oView.byId("jigtools").setEnabled(false);
		// this.getView().byId("selectResolver").setEnabled(false); // +V1.5
	},

	originatorGroupSettings : function() {
		var oView = this.getView();

		oView.byId("selectFivemCategory").setEnabled(false);
		oView.byId("selectCategory").setEnabled(false);
		oView.byId("selectreason").setEnabled(true);
		// oView.byId("selectRootCause").setEnabled(true); //-V1.5
		oView.byId("selectResponsibleGrp").setEnabled(true);
		oView.byId("selectOriginator").setEnabled(false);
		oView.byId("description").setEnabled(false);
		oView.byId("promisedDate").setEnabled(false);
		oView.byId("promisedTime").setEnabled(false);
		oView.byId("expectedDate").setEnabled(true);
		oView.byId("expectedTime").setEnabled(true);
		oView.byId("gravity").setEnabled(true);
		oView.byId("timeLost").setEnabled(false);
		oView.byId("materials").setEnabled(false);
		oView.byId("jigtools").setEnabled(false);
		oView.byId("selectResolver").setEnabled(true); // +V1.5
	},

	createDisruptionSettings : function() {
		var oView = this.getView();

		oView.byId("selectFivemCategory").setEnabled(true);
		oView.byId("selectCategory").setEnabled(true);
		oView.byId("selectreason").setEnabled(false);
		// oView.byId("selectRootCause").setEnabled(false); //-V1.5
		oView.byId("selectResponsibleGrp").setEnabled(false);
		oView.byId("selectResolver").setEnabled(false); // +V1.5
		oView.byId("selectOriginator").setEnabled(true);
		oView.byId("description").setEnabled(true);
		oView.byId("timeLost").setEnabled(true);
		oView.byId("expectedDate").setEnabled(true);
		oView.byId("expectedTime").setEnabled(true);
		oView.byId("gravity").setEnabled(true);
		oView.byId("timeLost").setEnabled(true);
		oView.byId("materials").setEnabled(true);
		oView.byId("jigtools").setEnabled(true);

		// Set opening and expected date time
		var oDate = new Date();
		oView.byId("openDate").setDateValue(oDate);
		oView.byId("openTime").setDateValue(oDate);
		oView.byId("expectedDate").setDateValue(oDate);
		oView.byId("expectedTime").setDateValue(oDate);

		// at the time of creation promised date would be invisible
		oView.byId("promisedDateLabel").setVisible(false);
		oView.byId("promisedDate").setVisible(false);
		oView.byId("promisedTime").setVisible(false);

		// Set Status
		oView.byId("status").setValue(oView.getModel("i18n").getProperty("Pending"));

	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf airbus.mes.components.disruptions.CreateDisruption
	 */
	/*
	 * onAfterRendering : function() { },
	 */

	/*
	 * onCloseCreateDisruption : function() {
	 * airbus.mes.stationtracker.operationDetailPopup.close();
	 * airbus.mes.shell.oView.getController() .renderStationTracker(); },
	 */

	onCancelCreateDisruption : function() {

		var currentPage = nav.getCurrentPage().getId();

		var oOperDetailNavContainer;

		if (currentPage == "stationTrackerView")
			oOperDetailNavContainer = sap.ui.getCore().byId("operationDetailsView--operDetailNavContainer");

		else if (currentPage == "disruptiontrackerView")
			oOperDetailNavContainer = sap.ui.getCore().byId("disruptionDetailPopup--disruptDetailNavContainer");

		oOperDetailNavContainer.back();
	},

	/***************************************************************************
	 * Reset all the fields of Form create disruption
	 */
	resetAllFields : function() {
		var oView = this.getView();

		oView.byId("selectFivemCategory").setSelectedKey();

		oView.byId("selectCategory").setSelectedKey();

		oView.byId("selectCategory").getBinding("items").filter();

		oView.byId("selectreason").setSelectedKey();
		oView.byId("selectResponsibleGrp").setSelectedKey();
		oView.byId("selectResolver").setSelectedKey(); // +V1.5
		oView.byId("selectOriginator").setSelectedKey();
		// oView.byId("selectRootCause").setSelectedKey(); // MES V1.5
		// root cause Removed
		oView.byId("gravity").setSelectedKey();
		oView.byId("timeLost").setValue();
		oView.byId("comment").setValue();
		// oView.byId("description").setValue(); V1.5 description
		// no longer needed

		oView.byId("materials").destroyTokens();
		oView.byId("jigtools").destroyTokens();
	},

	/***************************************************************************
	 * requesting material list to select on create disruption
	 **************************************************************************/
	onMaterialValueHelpRequest : function() {
		if (!this._materialListDialog) {

			this._materialListDialog = sap.ui.xmlfragment("airbus.mes.disruptions.fragment.MaterialList", this);

			this.getView().addDependent(this._materialListDialog);

		}

		this._materialListDialog.open();
	},

	/***************************************************************************
	 * Adds new free text Material along with quantity to the list
	 */
	addNewMaterialToList : function() {

		if (sap.ui.getCore().byId("customMaterial").getValue() != "") {

			/*
			 * var oNewMaterial = { "Material" : sap.ui.getCore().byId(
			 * "customMaterial").getValue() }
			 * 
			 * oModelData.push(oNewMaterial); oModelData.splice(0, 0,
			 * oNewMaterial); sap.ui.getCore().getModel("MaterialListModel")
			 * .refresh();
			 * 
			 * var oNewMaterialItem = sap.ui.getCore().byId(
			 * "materialList").getItems()[0];
			 * oNewMaterialItem.getContent()[0].getContent()[0]
			 * .getItems()[1].getItems()[1] .setValue(sap.ui.getCore().byId(
			 * "customMaterialQty").getValue());
			 * sap.ui.getCore().byId("materialList")
			 * .setSelectedItem(oNewMaterialItem, true);
			 */

			// make an Item to add in the list. var
			var oMaterialItem = new sap.m.CustomListItem({
				content : new sap.ui.layout.Grid({
					defaultSpan : "L12 M12 S12",
					content : new sap.m.HBox({
						justifyContent : "SpaceBetween",
						alignContent : "SpaceBetween",
						alignItems : "Center",
						items : [ new sap.m.Title({
							textAlign : "Center",
							level : "H3",
							text : sap.ui.getCore().byId("customMaterial").getValue()
						}), new sap.m.VBox({
							width : "20%",
							items : [ new sap.m.Label({
								text : this.getView().getModel("i18nModel").getProperty("Quantity")
							}), new sap.m.Input({
								type : "Number",
								width : "80%",
								value : sap.ui.getCore().byId("customMaterialQty").getValue()
							}).addStyleClass("inputQty") ]
						}) ]
					})
				})

			}).addStyleClass("customListItemPadding")
			// *
			// add item in starting of the Material List
			sap.ui.getCore().byId("materialList").insertItem(oMaterialItem, 0);

			// by default select this item
			sap.ui.getCore().byId("materialList").setSelectedItem(oMaterialItem, true);

		}

	},

	/***************************************************************************
	 * show selected material list to user in create disruption view
	 **************************************************************************/
	handleSelectMaterialList : function(oEvent) {

		var aSelectedItems = sap.ui.getCore().byId("materialList").getSelectedItems();

		/*
		 * remove all token already present in the MultiInput the already
		 * selected tokens will be selected in the MaterialList Dialog already
		 * so there will be no chance of data loss
		 */
		sap.ui.getCore().byId("createDisruptionView--materials").removeAllTokens();
		sap.ui.getCore().byId("createDisruptionView--materials").setValue();

		// for each Item add token to MaterialInput
		aSelectedItems.forEach(function(item, index) {
			// if any selected item doesnt contain qty
			// set it to 1.
			if (item.getContent()[0].getContent()[0].getItems()[1].getItems()[1].getValue() == "")
				item.getContent()[0].getContent()[0].getItems()[1].getItems()[1].setValue(1);
			var oToken = new sap.m.Token({
				key : item.getContent()[0].getContent()[0].getItems()[0].getText(),
				text : item.getContent()[0].getContent()[0].getItems()[0].getText() + "("
					+ item.getContent()[0].getContent()[0].getItems()[1].getItems()[1].getValue() + ")"

			});
			sap.ui.getCore().byId("createDisruptionView--materials").addToken(oToken);
		});

		this._materialListDialog.close();
	},

	/***************************************************************************
	 * On token change in MultiInput field directly, we need to restrict it
	 **************************************************************************/

	onMaterialTokenChange : function() {
		this.onMaterialValueHelpRequest();
	},

	handleCancelMaterialList : function() {
		this._materialListDialog.close();
	},

	/***************************************************************************
	 * on click of value help request in jig and tools
	 * 
	 */
	onJigToolValueHelpRequest : function() {
		if (!this.jigToolSelectDialog) {

			this.jigToolSelectDialog = sap.ui.xmlfragment("airbus.mes.disruptions.fragment.Jigtool", this);

			this.getView().addDependent(this.jigToolSelectDialog);

		}
		this.jigToolSelectDialog.open();

	},
	/***************************************************************************
	 * Adds new free jig tool along with quantity to the list
	 */
	addNewJigToolToList : function() {

		// var oModelData = sap.ui.getCore().getModel(
		// "MaterialListModel").getProperty(
		// "/MaterialList");

		if (sap.ui.getCore().byId("customJigTool").getValue() != "") {

			// make an Item to add in the list.

			var oJigToolItem = new sap.m.CustomListItem({
				content : new sap.ui.layout.Grid({
					defaultSpan : "L12 M12 S12",
					content : new sap.m.HBox({
						justifyContent : "SpaceBetween",
						alignContent : "SpaceBetween",
						alignItems : "Center",
						items : [ new sap.m.Title({
							textAlign : "Center",
							level : "H3",
							text : sap.ui.getCore().byId("customJigTool").getValue()
						}), new sap.m.VBox({
							width : "20%",
							items : [ new sap.m.Label({
								text : this.getView().getModel("i18nModel").getProperty("Quantity")
							}), new sap.m.Input({
								type : "Number",
								width : "80%",
								value : sap.ui.getCore().byId("jigToolQty").getValue()
							}).addStyleClass("inputQty") ]
						}) ]
					})
				})

			}).addStyleClass("customListItemPadding")
			// *
			// add item in starting of the Material List
			sap.ui.getCore().byId("jigToolList").insertItem(oJigToolItem, 0);

			// by default select this item
			sap.ui.getCore().byId("jigToolList").setSelectedItem(oJigToolItem, true);

		}

	},

	
	/***************************************************************************
	 * on click cancel value help jigTool Box
	 * 
	 */
	onjigToolValueHelpCancel : function() {
		this.jigToolSelectDialog.close();

	},

	
	/***************************************************************************
	 * on click ok value help jigTool Box
	 * 
	 */
	onjigToolValueHelpOk : function(oEvt) {
		var aSelectedItems = sap.ui.getCore().byId("jigToolList").getSelectedItems();

		/*
		 * remove all token already present in the MultiInput the already
		 * selected tokens will be selected in the MaterialList Dialog already
		 * so there will be no chance of data loss
		 */
		sap.ui.getCore().byId("createDisruptionView--jigtools").removeAllTokens();
		sap.ui.getCore().byId("createDisruptionView--jigtools").setValue();

		// for each Item add token to MaterialInput
		aSelectedItems.forEach(function(item, index) {
			// if any selected item doesnt contain qty
			// set it to 1.
			if (item.getContent()[0].getContent()[0].getItems()[1].getItems()[1].getValue() == "")
				item.getContent()[0].getContent()[0].getItems()[1].getItems()[1].setValue(1);
			var oToken = new sap.m.Token({
				key : item.getContent()[0].getContent()[0].getItems()[0].getText(),
				text : item.getContent()[0].getContent()[0].getItems()[0].getText() + "("
					+ item.getContent()[0].getContent()[0].getItems()[1].getItems()[1].getValue() + ")"

			});
			sap.ui.getCore().byId("createDisruptionView--jigtools").addToken(oToken);
		});

		this.jigToolSelectDialog.close();
	},
	onJigToolTokenChange : function() {
		this.onJigToolValueHelpRequest();
	},

	
	

	/***************************************************************************
	 * From Disruption Detail Screen - Hide Comment Box to Add Comments
	 */
	onEditDisruption : function() {
		this.getView().byId("commentBox").setVisible(true);

	},
	/***************************************************************************
	 * From Disruption Detail Screen - Hide Comment Box to Add Comments
	 * 
	 * @param {object}
	 *            oEvt take event triggering control as an input
	 */
	hideCommentBox : function(oEvt) {
		this.getView().byId("commentBox").setVisible(false);
	},

	/***************************************************************************
	 * From Disruption Detail Screen - Submit Disruption Comment
	 * 
	 * @param {object}
	 *            oEvt take event triggering control as an input
	 */
	submitComment : function(oEvt) {

		var status = oEvt.getSource().getBindingContext("operationDisruptionsModel").getObject("Status");

		if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {

			sap.m.MessageToast.show(this.getView().getModel("i18nModel").getProperty("cannotComment"));

			return;
		}

		var path = oEvt.getSource().sId;

		var msgRef = oEvt.getSource().getBindingContext("operationDisruptionsModel").getObject("MessageRef");

		var listnum = path.split("-");
		listnum = listnum[listnum.length - 1];

		var sComment = airbus.mes.disruptions.Formatter.actions.comment
			+ this.getView().byId(this.getView().sId + "--commentArea-" + this.getView().sId + "--disrptlist-" + listnum).getValue();

		var currDate = new Date();
		var date = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();

		var oComment = {
			"Action" : this.getView().getModel("i18nModel").getProperty("comment"),
			"Comments" : sComment,
			"Counter" : "",
			"Date" : date,
			"MessageRef" : msgRef,
			"UserFullName" : (sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " + sap.ui
				.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase())
		};

		var i18nModel = airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel");

		// Call Add comment Service
		airbus.mes.disruptions.ModelManager.addComment(oComment, i18nModel);

		this.getView().byId(this.getView().sId + "--commentArea-" + this.getView().sId + "--disrptlist-" + listnum).setValue("");
	},

	onNavBack : function() {
		nav.back();
		airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel();
	},
	/**
	 * ON acknowledge disruption from disruption detail page from dekstop MES
	 * MESV1.5
	 * 
	 * @param {object}
	 *            oEvt object of control
	 */
	onAckDisruption : function(oEvt) {
		if (this.getView().byId("promisedDate").getValue() == "" || this.getView().byId("promisedTime").getValue() == "") {
			airbus.mes.shell.ModelManager.messageShow(this.getView().getModel("i18nModel").getProperty("emptyPromiseDate"));
			return;
		}

		var sMessageRef = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/MessageRef");
		// this.getView().byId("promisedDate").setDateValue(new Date());

		var date = this.getView().byId("promisedDate").getValue();

		var obDate = new Date(date);

		// Validate Promised Date Time
		if (obDate == "Invalid Date" || date.length != 10) {
			airbus.mes.shell.ModelManager.messageShow(this.getView().getModel("i18nModel").getProperty("invalidDateError"));

			return;
		}

		// Calculate Promised Date Time
		var time = this.getView().byId("promisedTime").getValue();

		if (time == "")
			time = "00:00:00";

		var dateTime = date + " " + time;

		var comment = airbus.mes.disruptions.Formatter.actions.acknowledge + this.getView().byId("comment").getValue();

		// Call to Acknowledge Disruption
		var bSuccess = airbus.mes.disruptions.ModelManager.ackDisruption(dateTime, sMessageRef, comment);
		
		if (bSuccess) {
            
            this.getView().getModel("DisruptionDetailModel").setProperty("/Status",airbus.mes.disruptions.Formatter.status.acknowledged);
            
            var currDate = new Date();
            var commentDate = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
            
            var oComment = {
                          "Action" : this.getView().getModel("i18nModel").getProperty("acknowledge"),
                          "Comments" : comment,
                          "Counter" : "",
                          "Date" : commentDate,
                          "MessageRef" : sMessageRef,
                          "UserFullName" : ( sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " +
                                                        sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase() )
            };
            this.getView().getModel("DisruptionDetailModel").getProperty("/comments").push(oComment);
            this.getView().getModel("DisruptionDetailModel").setProperty("/Status",airbus.mes.disruptions.Formatter.status.acknowledged);
            this.getView().getModel("DisruptionDetailModel").setProperty("/PromisedDateTime",dateTime);
            this.getView().getModel("DisruptionDetailModel").refresh();
     }

	},
	/***************************************************************************
	 * Reject the Disruption MESV1.5
	 * 
	 * @param {object}
	 *            oEvt object of control
	 */
	onRejectDisruption : function(oEvt) {
		var i18nModel = this.getView().getModel("i18nModel");
		if (this.getView().byId("comment").getValue() == "") {
			sap.m.MessageToast.show(i18nModel.getProperty("plsEnterComment"));
			return;
		} else {
			var sComment = airbus.mes.disruptions.Formatter.actions.reject + this.getView().byId("comment").getValue();
		}
		var sMessageRef = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/MessageRef");
		var sStatus = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/Status");
		var sMessage = i18nModel.getProperty("successReject");
		airbus.mes.disruptions.ModelManager.rejectDisruption(sComment, sMessageRef, sStatus, sMessage, i18nModel);
		/*
		 * if (isSuccess) {
		 * 
		 * sap.ui.getCore().getModel("DisruptionDetailModel").setProperty("/Status",airbus.mes.disruptions.Formatter.status.rejected)
		 * 
		 * var currDate = new Date(); var date = currDate.getFullYear() + "-" +
		 * currDate.getMonth() + "-" + currDate.getDate();
		 * 
		 * var oComment = { "Action" :
		 * airbus.mes.disruptiondetail.oView.getModel("i18nModel").getProperty("reject"),
		 * "Comments" : sComment, "Counter" : "", "Date" : date, "MessageRef" :
		 * sMessageRef, "UserFullName" :
		 * (sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " +
		 * sap.ui
		 * .getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase()) };
		 * this.getView().getModel("DisruptionDetailModel").getProperty("/comments").push(oComment);
		 * 
		 * this.getView().getModel("DisruptionDetailModel").refresh(); }
		 */

	},
	/***************************************************************************
	 * solve the Disruption MESV1.5
	 * 
	 * @param {object}
	 *            oEvt object of control
	 */
	onMarkSolvedDisruption : function(oEvt) {
		var i18nModel = this.getView().getModel("i18nModel");
		if (this.getView().byId("comment").getValue() == "") {
			sap.m.MessageToast.show(i18nModel.getProperty("plsEnterComment"));
			return;
		} else {
			this.sComment = airbus.mes.disruptions.Formatter.actions.solve + this.getView().byId("comment").getValue();
		}
		var sMessageRef = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/MessageRef");
		// Call to Mark Solved Disruption
		airbus.mes.disruptions.ModelManager.markSolvedDisruption(sMessageRef, this.sComment, i18nModel);

	},
	/***************************************************************************
	 * Refuse the Disruption MESV1.5
	 * 
	 * @param {object}
	 *            oEvt object of control
	 */
	onRefuseDisruption : function() {
		var i18nModel = this.getView().getModel("i18nModel");

		if (this.getView().byId("comment").getValue() == "") {
			sap.m.MessageToast.show(i18nModel.getProperty("plsEnterComment"));
			return;
		} else {
			this.sComment = airbus.mes.disruptions.Formatter.actions.refuse + this.getView().byId("comment").getValue();
		}

		var sMessageRef = sap.ui.getCore().getModel("DisruptionDetailModel").getProperty("/MessageRef");
		var sMessage = i18nModel.getProperty("successRefuse");
		// Call Disruption Service
		airbus.mes.disruptions.ModelManager.refuseDisruption(this.sComment, sMessageRef, sMessage, i18nModel);
	},
	/**
	 * MES V1.5 
	 * support team can only update resolver group and resolver
	 */
	onUpdateDisruptionbySupportTeam:function(){
		
		
	}

});

"use strict";
sap.ui.core.mvc.Controller.extend("airbus.mes.disruptions.createDisruptions", {

	/***************************************************************************
	 * Set the Models for Category of Disruption Creation
	 **************************************************************************/
	loadDisruptionCategory : function() {
		/*var oView = this.getView();

		// Set Busy's
		oView.byId("selectCategory").setBusyIndicatorDelay(0);
		oView.byId("selectCategory").setBusy(true);*/
		
		var url = airbus.mes.disruptions.ModelManager.getDisruptionCategoryURL();
		sap.ui.getCore().getModel("disruptionCategoryModel").loadData(url);
	},
	
	/***************************************************************************
	 * Load Step2 model for create disruption screen (Reason and Responsible
	 * Group)
	 **************************************************************************/
	loadRsnResponsibleGrp : function(sMsgType) {
		var oView = this.getView();

		// Set Busy's
		oView.byId("selectAttribute").setBusyIndicatorDelay(0);
		oView.byId("selectAttribute").setBusy(true);
		oView.byId("selectResponsibleGrp").setBusyIndicatorDelay(0);
		oView.byId("selectResponsibleGrp").setBusy(true);

		var url = airbus.mes.disruptions.ModelManager.getRsnResponsibleGrpURL(sMsgType)
		sap.ui.getCore().getModel("disruptionRsnRespGrp").loadData(url);
	},

	// ****** On change of item in the ComboBox ******//
	onSelectionChange : function(oEvt) {
		var id = oEvt.getSource().getId().split("--")[1];

		var oView = this.getView();

		switch (id) {

		case "selectFivemCategory": // +V1.5
			// Apply filter
			var aFilters = [];
			var sCateoryKey = this.getView().byId("selectFivemCategory").getSelectedKey();
			aFilters.push(new sap.ui.model.Filter("CATEGORY_CLASS", sap.ui.model.FilterOperator.EQ, sCateoryKey));
			oView.byId("selectCategory").getBinding("items").filter(aFilters);
			oView.byId("selectCategory").setSelectedKey();
			oView.byId("selectCategory").setEnabled(true);
			
			break;
			
		case "selectCategory":

			oView.byId("selectAttribute").setSelectedKey();
			oView.byId("selectResponsibleGrp").setSelectedKey();

			if (oView.byId("selectCategory").getSelectedKey() == "") {
				oView.byId("selectAttribute").setEnabled(false);
				oView.byId("selectResponsibleGrp").setEnabled(false);
			} else {
				oView.byId("selectAttribute").setEnabled(true);
				oView.byId("selectResponsibleGrp").setEnabled(true);
			}

			// Avoid un-necessary ajax call
			if (oView.byId("selectCategory").getSelectedKey() == "") {
				break;
			}
			
			this.loadRsnResponsibleGrp(oView.byId("selectCategory").getSelectedKey());
			break;
			
		case "selectAttribute":
			var sPath = oEvt.getSource().getSelectedItem().getBindingContext("disruptionRsnRespGrp").getPath()+"/DEFAULT_RESOLVER_GROUP";
			if(sap.ui.getCore().getModel("disruptionRsnRespGrp").getProperty(sPath)!='---' && sap.ui.getCore().getModel("disruptionRsnRespGrp").getProperty(sPath)!='NA'){
				sap.ui.getCore().getModel("DisruptionDetailModel").setProperty("/responsibleGroup",sap.ui.getCore().getModel("disruptionRsnRespGrp").getProperty(sPath));
				sap.ui.getCore().getModel("DisruptionDetailModel").refresh();
			} else{
				sap.ui.getCore().getModel("DisruptionDetailModel").setProperty("/responsibleGroup","");
			}
			
			break;

		case "selectResponsibleGrp": // +V1.5

			oView.byId("selectResolver").setSelectedKey();

			if (oView.byId("selectResponsibleGrp").getSelectedKey() == ""){
				oView.byId("selectResolver").setEnabled(false);
			} else {
				oView.byId("selectResolver").setEnabled(true);
			}
			
			// Avoid un-necessary ajax call
			if (oView.byId("selectResponsibleGrp").getSelectedKey() == "") {
				break;
			}

			this.loadResolverModel(oView.byId("selectResponsibleGrp").getSelectedKey());
			break;
			
		default:
		}

	},


	/***************************************************************************
	 * Settings to be done in parallel to load model when screen called in edit
	 * mode.
	 **************************************************************************/
	editPreSettings : function() {
		var oView = this.getView();

		if (oView.getModel("DisruptionDetailModel").getData() != undefined) {

			
			var oModel = oView.getModel("DisruptionDetailModel");
			
			var oData = [];
			if(oModel.oData.jigTools != ""){
				var aJigTools = oModel.oData.jigTools.split(",");
				$.each(aJigTools, function(key, value){
					var jigtool  = value.split("(")[0];
					var quantity = value.split("(")[1].replace(")", "");
					oData.push({"jigtool": jigtool, "quantity": quantity});
				});
			}
			sap.ui.getCore().getModel("JigtoolListModel").setData(oData);
			
			oData = [];
			if(oModel.oData.materials != ""){
				var materials = oModel.oData.materials.split(",");
				$.each(materials, function(key, value){
					var material = value.split("(")[0];
					var quantity = value.split("(")[1].replace(")", "");
					oData.push({"material": material, "quantity": quantity});
				});
			}
			sap.ui.getCore().getModel("MaterialListModel").setData(oData);
			
			sap.ui.getCore().getModel("JigtoolListModel").refresh();
			sap.ui.getCore().getModel("MaterialListModel").refresh();
		}		
	},

	createDisruptionSettings : function() {
		var oView = this.getView();

		oView.byId("selectFivemCategory").setEnabled(true);
		oView.byId("selectCategory").setEnabled(false);
		oView.byId("selectAttribute").setEnabled(false);
		oView.byId("selectResponsibleGrp").setEnabled(false);
		oView.byId("timeLost").setEnabled(true);
		oView.byId("expectedDate").setEnabled(true);
		oView.byId("expectedTime").setEnabled(true);
		oView.byId("gravity").setEnabled(true);
		oView.byId("materials").setEnabled(true);
		oView.byId("jigtools").setEnabled(true);

		// Set opening and expected date time
		var oDate = new Date();
		oView.byId("openDate").setDateValue(oDate);
		oView.byId("openTime").setDateValue(oDate);
		oView.byId("expectedDate").setDateValue(oDate);
		oView.byId("expectedTime").setDateValue(oDate);

		oView.byId("timeLost").setValue("");
		
		// Make editabe new fields
		if(this.getView().sId == "createDisruptionView"){
			this.getView().byId("bomItem").setEnabled(true);
			this.getView().byId("area").setEnabled(true);
			this.getView().byId("plan").setEnabled(true);
			this.getView().byId("ribs").setEnabled(true);
			this.getView().byId("view").setEnabled(true);
			this.getView().byId("stringer").setEnabled(true);
			this.getView().byId("stringer_rail").setEnabled(true);
		}

	},
	
	/**
	 * MES V1.5 when user belong to Both originator and resolver group
	 */
	bothGroupSettings : function() {
		this.getView().byId("selectFivemCategory").setEnabled(false);
		this.getView().byId("selectCategory").setEnabled(false);
		this.getView().byId("selectAttribute").setEnabled(true);
		this.getView().byId("selectResponsibleGrp").setEnabled(true);
		this.getView().byId("expectedDate").setEnabled(true);
		this.getView().byId("expectedTime").setEnabled(true);
		this.getView().byId("gravity").setEnabled(true);
		this.getView().byId("timeLost").setEnabled(false);
		this.getView().byId("materials").setEnabled(true);
		this.getView().byId("jigtools").setEnabled(true);

		if(this.getView().byId("selectResolver")){
			this.getView().byId("selectResolver").setEnabled(true);
		}
		
		// Make non-Editable new fields
		if(this.getView().sId == "createDisruptionView"){
			this.getView().byId("bomItem").setEnabled(true);
			this.getView().byId("area").setEnabled(true);
			this.getView().byId("plan").setEnabled(true);
			this.getView().byId("ribs").setEnabled(true);
			this.getView().byId("view").setEnabled(true);
			this.getView().byId("stringer").setEnabled(true);
			this.getView().byId("stringer_rail").setEnabled(true);
			
		}
	},
	resolutionGroupSettings : function() {
		var oView = this.getView();

		oView.byId("selectFivemCategory").setEnabled(false);
		oView.byId("selectCategory").setEnabled(false);
		oView.byId("selectAttribute").setEnabled(false);
		oView.byId("selectResponsibleGrp").setEnabled(true);
		oView.byId("expectedDate").setEnabled(false);
		oView.byId("expectedTime").setEnabled(false);
		oView.byId("gravity").setEnabled(false);
		oView.byId("timeLost").setEnabled(false);
		oView.byId("materials").setEnabled(false);
		oView.byId("jigtools").setEnabled(false);
		if(this.getView().byId("selectResolver")){
			this.getView().byId("selectResolver").setEnabled(true);
		}
		
		// Make non-Editable new fields
		if(this.getView().sId == "createDisruptionView"){
			this.getView().byId("bomItem").setEnabled(false);
			this.getView().byId("area").setEnabled(false);
			this.getView().byId("plan").setEnabled(false);
			this.getView().byId("ribs").setEnabled(false);
			this.getView().byId("view").setEnabled(false);
			this.getView().byId("stringer").setEnabled(false);
			this.getView().byId("stringer_rail").setEnabled(false);
			
		}
	},

	originatorGroupSettings : function() {
		var oView = this.getView();

		oView.byId("selectFivemCategory").setEnabled(false);
		oView.byId("selectCategory").setEnabled(false);
		oView.byId("selectAttribute").setEnabled(true);
		oView.byId("selectResponsibleGrp").setEnabled(true);
		oView.byId("expectedDate").setEnabled(true);
		oView.byId("expectedTime").setEnabled(true);
		oView.byId("gravity").setEnabled(true);
		oView.byId("timeLost").setEnabled(false);
		oView.byId("materials").setEnabled(true);
		oView.byId("jigtools").setEnabled(true);
		if(this.getView().byId("selectResolver")){
			this.getView().byId("selectResolver").setEnabled(true);
		}
		
		// Make non-Editable new fields
		if(this.getView().sId == "createDisruptionView"){
			this.getView().byId("bomItem").setEnabled(true);
			this.getView().byId("area").setEnabled(true);
			this.getView().byId("plan").setEnabled(true);
			this.getView().byId("ribs").setEnabled(true);
			this.getView().byId("view").setEnabled(true);
			this.getView().byId("stringer").setEnabled(true);
			this.getView().byId("stringer_rail").setEnabled(true);
			
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
			if (result == undefined){
				result = entry.getText();
			} else {
				result = result + "," + entry.getText();
			}
		});
		return result;
	},
	// get selected materials
	getSelectedMaterials : function() {
		var getTokens = sap.ui.getCore().byId("createDisruptionView--materials").getTokens();
		var result;
		getTokens.forEach(function(entry) {
			if (result == undefined) {
				result = entry.getText();
			} else {
				result = result + "," + entry.getText();
			}
		});
		return result;
	},
	/***********************
	 * value in time lost should't be greater than four
	 * Mesv1.5 defect correction
	 */
	liveChangeTimeLost:function(oEvt){
		
		if(oEvt.getParameters().value.length == 4){
			this.sValue = oEvt.getSource().getValue();
			return;
		}
		if(oEvt.getParameters().value.length >4){
			airbus.mes.shell.ModelManager.messageShow(this.getView().getModel("i18nModel").getProperty("fourDigitsOnly"));
			oEvt.getSource().setValue(this.sValue);
			return;
		}
	},
	onCreateDisruption : function() {
		
		var oView = airbus.mes.createdisruption.oView;
		var validationFlag = oView.getController().checkExpectedDate();
		if (validationFlag == false) {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsaryExpectedDateTime"));
			return;
		}

		
		var oController = oView.getController();

		// Some mandatory fields need to be filled before
		// creating a disruption.
		var bInputMissing = oController.validateDisruptionInput(oView);
		if (bInputMissing == false){
			return;
		}
				
		// Create a JSON for Payload attributes and make a call in ModelManager
		oController.createDisruption("");	
		
	},
	createDisruption:function(reportAndCloseFlag){

		var oView = airbus.mes.createdisruption.oView;
		var sCategory = oView.byId("selectCategory").getSelectedKey();
		var sBomItem  = oView.byId("bomItem").getValue();
		
		// BOM Item is mandatory if Object is PART
		if(sCategory.indexOf("PART") > -1  && sBomItem == ""){
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("BoMMandatory"));
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
		// Get handle for the selected disruption custom data row
		// Hanlde is a unique for Custom Data
		 var sHandle = "";
		if(oView.byId("selectAttribute").getSelectedItem()){
			var sPathReason = oView.byId("selectAttribute").getSelectedItem().getBindingInfo("key").binding.getContext().sPath
			sHandle = oView.getModel("disruptionRsnRespGrp").getProperty(sPathReason).HANDLE;
		}
		
		var sComment = airbus.mes.disruptions.Formatter.actions.create + oView.byId("comment").getValue();
		var severity = oView.byId("gravity").getSelectedKey();

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
				}, {
					"attribute" : "REASON",
					"value" : oView.byId("selectAttribute").getSelectedKey()
				}, {
					"attribute" : "TIME_LOST",
					"value" : airbus.mes.disruptions.Formatter.timeToMilliseconds(oView.byId("timeLost").getValue())
				}, {
					"attribute" : "REQD_FIX_BY",
					"value" : oView.byId("expectedDate").getValue() + " " + oView.byId("expectedTime").getValue()
				}, {
					"attribute" : "GRAVITY",
					"value" : severity
				}, {
					"attribute" : "STATUS",
					"value" : airbus.mes.disruptions.Formatter.status.pending
				}, {
					"attribute" : "MSN",
					"value" : airbus.mes.settings.ModelManager.msn
				}, {
					"attribute" : "RESPONSIBLE_GROUP",
					"value" : oView.byId("selectResponsibleGrp").getSelectedKey()
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
					"attribute" : "LINE",
					"value" : airbus.mes.settings.ModelManager.line
				}, {
					"attribute" : "AREA",
					"value" : oView.byId("area").getValue()
				}, {
					"attribute" : "PLAN",
					"value" : oView.byId("plan").getValue()
				}, {
					"attribute" : "BOM_ITEM",
					"value" : sBomItem
				}, {
					"attribute" : "RIBS",
					"value" : oView.byId("ribs").getValue()
				}, {
					"attribute" : "VIEW",
					"value" : oView.byId("view").getValue()
				}, {
					"attribute" : "STRINGER",
					"value" : oView.byId("stringer").getValue()
				}, {
					"attribute" : "STRINGER_RAIL",
					"value" : oView.byId("stringer_rail").getValue()
				}, {
					"attribute" : "AC_PROGRAM",
					"value" : airbus.mes.settings.ModelManager.program
				} ]

		}
		aModelData.push(oJson);
		airbus.mes.disruptions.ModelManager.createDisruption(sHandle, sCategory, sComment, aModelData, severity, reportAndCloseFlag);

	},

	/***************************************************************************
	 * Validate inputs while creating/updating disruption
	 */
	validateDisruptionInput : function(oView) {
		if (oView.byId("selectFivemCategory").getSelectedKey() == "") {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("Compulsary5M"));
			return false;
		} else if (oView.byId("selectCategory").getSelectedKey() == "") {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsaryCategory"));
			return false;
		} else if (oView.byId("selectAttribute").getSelectedKey() == "") {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsaryReason"));
			return false;
		} else if (oView.byId("selectResponsibleGrp").getSelectedKey() == "") {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsaryResponsible"));
			return false;
		} else if (oView.byId("expectedDate").getValue() == "" || oView.byId("expectedTime").getValue() == "") {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsaryExpectedDateTime"));
			return false;
		} else {
			return true;
		}
	},
	checkExpectedDate : function() {
		var oView = this.getView();

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
		var oView = airbus.mes.createdisruption.oView;

		var sMessageRef = oView.getModel("DisruptionDetailModel").getProperty("/messageRef")
		var sReason = oView.byId("selectAttribute").getSelectedKey();
		var sResponsibleGroup = oView.byId("selectResponsibleGrp").getSelectedKey();

		var iTimeLost = airbus.mes.disruptions.Formatter.timeToMilliseconds(oView.byId("timeLost").getValue());
		var dFixedByTime = oView.byId("expectedDate").getValue() + " " + oView.byId("expectedTime").getValue();
		var sComment = airbus.mes.disruptions.Formatter.actions.edit + oView.byId("comment").getValue();
		var iGravity = oView.byId("gravity").getSelectedKey();
		var dPromisedTime = oView.byId("promisedDate").getValue() === "" ? "" : oView.byId("promisedDate").getValue() + " "
			+ oView.byId("promisedTime").getValue();
		
		var sJigtools = oView.getController().getSelectedJIgTool();
		if (sJigtools == undefined) {
			sJigtools = ""
		}

		var sMaterials = oView.getController().getSelectedMaterials();
		if (sMaterials == undefined) {
			sMaterials = ""
		}
		
		var oJson = {
			"payload" : [
				{
					"attribute" : "MATERIALS",
					"value" : sMaterials
				}, {
					"attribute" : "JIG_TOOLS",
					"value" : sJigtools
				},
				{
					"attribute" : "AREA",
					"value" : oView.byId("area").getValue()
				},
				 {
					"attribute" : "PLAN",
					"value" : oView.byId("plan").getValue()
				}, {
					"attribute" : "BOM_ITEM",
					"value" : oView.byId("bomItem").getValue()
				}, {
					"attribute" : "RIBS",
					"value" : oView.byId("ribs").getValue()
				}, {
					"attribute" : "VIEW",
					"value" : oView.byId("view").getValue()
				}, {
					"attribute" : "STRINGER",
					"value" : oView.byId("stringer").getValue()
				}, {
					"attribute" : "STRINGER_RAIL",
					"value" : oView.byId("stringer_rail").getValue()
				} ]

		}
		
		airbus.mes.createdisruption.oView.oController.sendAttachedDocument(sMessageRef);
		
		var sStatus = sap.ui.getCore().getModel("DisruptionDetailModel").oData.status;
		
		// call update service
		airbus.mes.disruptions.ModelManager.updateDisruption(sMessageRef, sReason, sResponsibleGroup, iTimeLost, dFixedByTime, sComment, iGravity, sStatus,
			dPromisedTime,oJson);// [MES V1.5]root cause removed

		


		

	},


	/*****************************
	 * Close create disruption screen
	 */
	onCancelCreateDisruption : function() {

		var currentPage = nav.getCurrentPage().getId();

		var oOperDetailNavContainer;

		if (currentPage == "stationTrackerView"){
			oOperDetailNavContainer = sap.ui.getCore().byId("operationDetailsView--operDetailNavContainer");
		}

		else if (currentPage == "disruptiontrackerView"){
			oOperDetailNavContainer = sap.ui.getCore().byId("disruptionDetailPopUp--disruptDetailNavContainer");
		}

		oOperDetailNavContainer.back();
	},

	/***************************************************************************
	 * Reset all the fields of Form create disruption
	 */
	resetAllFields : function() {
		this.getView().byId("selectCategory").getBinding("items").filter();
	},

	/***************************************************************************
	 * requesting material list to select on create disruption
	 **************************************************************************/
	onMaterialValueHelpRequest : function() {
			
		if(this._materialListDialog){
			this.getView().removeDependent(this.jigToolSelectDialog);
		}
		
		var id = sap.ui.getCore().byId("materialListSelectDialog");
		if(id){
			id.destroy();
		}

		this._materialListDialog = sap.ui.xmlfragment("airbus.mes.disruptions.fragment.MaterialList", this);

		this.getView().addDependent(this._materialListDialog);


		this._materialListDialog.open();
	},

	/***************************************************************************
	 * Adds new free text Material along with quantity to the list
	 */
	addNewMaterialToList : function() {

		if (sap.ui.getCore().byId("customMaterial").getValue() != "") {
			
			var oData = {"material": sap.ui.getCore().byId("customMaterial").getValue(), "quantity": sap.ui.getCore().byId("customMaterialQty").getValue()};
			sap.ui.getCore().getModel("MaterialListModel").oData.push(oData);
			sap.ui.getCore().getModel("MaterialListModel").refresh();
			sap.ui.getCore().byId("customMaterial").setValue("");
		}

	},

	/***************************************************************************
	 * show selected material list to user in create disruption view
	 **************************************************************************/
	handleSelectMaterialList : function(oEvent) {

		/*var aSelectedItems = sap.ui.getCore().byId("materialList").getSelectedItems();

		// for each Item add token to MaterialInput
		var aToken = [];
		aSelectedItems.forEach(function(item, index) {
			// if any selected item doesnt contain qty
			// set it to 1.
			if (item.getContent()[0].getContent()[0].getItems()[1].getItems()[1].getValue() == "") {
				item.getContent()[0].getContent()[0].getItems()[1].getItems()[1].setValue(1);
			}
			aToken.push(
				item.getContent()[0].getContent()[0].getItems()[0].getText() + "("
					+ item.getContent()[0].getContent()[0].getItems()[1].getItems()[1].getValue() + ")"
			);
			
		});
		
		sap.ui.getCore().getModel("DisruptionDetailModel").oData.materials= aToken;
		sap.ui.getCore().getModel("DisruptionDetailModel").refresh();*/
		this._materialListDialog.close();
	},

	/***************************************************************************
	 * F4 help for material list
	 **************************************************************************/
	handleCancelMaterialList : function() {
		this._materialListDialog.close();
	},

	/***************************************************************************
	 * on click of value help request in jig and tools
	 * 
	 */
	onJigToolValueHelpRequest : function() {
			
		if(this._materialListDialog){
			this.getView().removeDependent(this.jigToolSelectDialog);
		}
			
		var id = sap.ui.getCore().byId("jigToolSelectDialog");
		if(id){
			id.destroy();
		}
			
		this.jigToolSelectDialog = sap.ui.xmlfragment("airbus.mes.disruptions.fragment.Jigtool", this);

		this.getView().addDependent(this.jigToolSelectDialog);

		this.jigToolSelectDialog.open();

	},
	/***************************************************************************
	 * Adds new free jig tool along with quantity to the list
	 */
	addNewJigToolToList : function() {

		if (sap.ui.getCore().byId("customJigTool").getValue() != "") {

			var oData = {"jigtool": sap.ui.getCore().byId("customJigTool").getValue(), "quantity": sap.ui.getCore().byId("jigToolQty").getValue()};
			sap.ui.getCore().getModel("JigtoolListModel").oData.push(oData);
			sap.ui.getCore().getModel("JigtoolListModel").refresh();
			sap.ui.getCore().byId("customJigTool").setValue("");

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
	 * @param {object}
	 *            oEvt take event triggering control as an input
	 */
	onjigToolValueHelpOk : function(oEvt) {
		/*var aSelectedItems = sap.ui.getCore().byId("jigToolList").getSelectedItems();

		// for each Item add token to MaterialInput
		var aToken = [];
		aSelectedItems.forEach(function(item, index) {
			// if any selected item doesnt contain qty
			// set it to 1.
			if (item.getContent()[0].getContent()[0].getItems()[1].getItems()[1].getValue() == ""){
				item.getContent()[0].getContent()[0].getItems()[1].getItems()[1].setValue(1);
			}
			aToken.push(item.getContent()[0].getContent()[0].getItems()[0].getText() + "("
					+ item.getContent()[0].getContent()[0].getItems()[1].getItems()[1].getValue() + ")"
			);
			
		});
		sap.ui.getCore().getModel("DisruptionDetailModel").oData.jigTools= aToken;
		sap.ui.getCore().getModel("DisruptionDetailModel").refresh();*/
		this.jigToolSelectDialog.close();
	},

	onJigToolTokenChange : function() {
		this.onJigToolValueHelpRequest();
	},
	
	
	removeJigTool: function(oEvt){
		var sPath = oEvt.getSource().getBindingContext("JigtoolListModel").sPath;
		var deletedRowIndex = sPath.split("/").slice(-1).pop();
		sap.ui.getCore().getModel("JigtoolListModel").oData.splice(deletedRowIndex, 1);
		sap.ui.getCore().getModel("JigtoolListModel").refresh();
	},
	
	
	removeMaterial: function(oEvt){
		var sPath = oEvt.getSource().getBindingContext("MaterialListModel").sPath;
		var deletedRowIndex = sPath.split("/").slice(-1).pop();
		sap.ui.getCore().getModel("MaterialListModel").oData.splice(deletedRowIndex, 1);
		sap.ui.getCore().getModel("MaterialListModel").refresh();
	},
	
	/*************************
	 * MES v1.5
	 * On create and close button click
	 */
	onCreateAndCloseDisruption:function(){
		var oView = airbus.mes.createdisruption.oView;
		if(!oView.byId("timeLost").getValue()){
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsarytimeLost"));
			return false;
		} else if (oView.byId("selectFivemCategory").getSelectedKey() == "") {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("Compulsary5M"));
			return false;
		} else if (oView.byId("selectCategory").getSelectedKey() == "") {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsaryCategory"));
			return false;
		} else if (oView.byId("selectAttribute").getSelectedKey() == "") {
			airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("CompulsaryReason"));
			return false;
		}
		
		oView.oController.createDisruption( "X");
		
		return true;
	}
});

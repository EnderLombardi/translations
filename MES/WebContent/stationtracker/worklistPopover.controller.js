"use strict";

sap.ui.controller("mes_aos_gui.viewWorkList", {
	/**
	 * showOptions: function(){ if (tp2.isOpen()) {tp2.close();}
	 * else{tp2.open(sap.ui.core.Popup.Dock.BeginCenter,
	 * sap.ui.core.Popup.Dock.EndCenter);} }
	 * 
	 * Called when a controller is instantiated and its View
	 * controls (if available) are already created. Can be used
	 * to modify the View before it is displayed, to bind event
	 * handlers and do other one-time initialization.
	 * 
	 * @memberOf pocaos.viewWorkList
	 */
	onInit : function() {
		
		jQuery.sap.require("sap.m.MessageBox");
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked
	 * before the controller's View is re-rendered (NOT before
	 * the first rendering! onInit() is used for that one!).
	 * 
	 * @memberOf pocaos.viewWorkList
	 */
	onBeforeRendering : function() {

	},

	/**
	 * Called when the View has been rendered (so its HTML is
	 * part of the document). Post-rendering manipulations of
	 * the HTML could be done here. This hook is the same one
	 * that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf pocaos.viewWorkList
	 */
	onAfterRendering : function() {
		
	},

	/**
	 * Called when the Controller is destroyed. Use this one to
	 * free resources and finalize activities.
	 * 
	 * @memberOf pocaos.viewWorkList
	 */
	onExit : function() {

	},

	f_id : "",

	onUnplannedImport : function(oEvent) {
		console.log("toto");
		
		
		
		
	},
	
	onUnplannedClose : function() {
		
		
	},	
	
	
	
	/** The dialog used when disruption button is clicked. */
	disruptionDialog : undefined,
	confirmationDialog : undefined,
	confirmationDialogMessage : undefined,
	andonDialog : undefined,
	operationInfoDialog : undefined,
	
	/**
	 * Call ModelManager.setpartialconfirmation and save a confirmationpartial
	 * 
	 * @param{Object} oEvt, 
	 * @returns 
	 */
	saveconfirmationFragment : function(oEvt) {

		var sPath = oEvt.getSource().getBindingContext().getPath();

		var model = sap.ui.getCore().getModel("WorkListModel");
		// var ctx = oEvt.getSource().getBindingContext();

		// sap.ui.getCore().byId("spanMsg").setText("");

		if (sap.ui.getCore().byId("username").getValue() == "") {

			ModelManager.messageShow(ModelManager.i18nModel.getProperty("UsernameNotBlank"));

		} else if (sap.ui.getCore().byId("password").getValue() == "") {

			ModelManager.messageShow(ModelManager.i18nModel.getProperty("PasswordNotBlank"));

		} else {

			
			var sPassword = sap.ui.getCore().byId("password").getValue();
			var sOperation = model.getProperty(sPath + "/operation");
			var sWorkOrder = model.getProperty(sPath + "/workOrder");
			var sMsn = ModelManager.context.msn;
			var sReasonCode = sap.ui.getCore().byId("ReasonCodePicker").getSelectedKey();
			var sLogon = sap.ui.getCore().byId("username").getValue();
			var sReasonText = sap.ui.getCore().byId("comments").getValue();
			var sRueck = model.getProperty(sPath + "/RUECK");
			var sDuration = model.getProperty(sPath + "/duration");
			
			if (sap.ui.getCore().byId("slider").getVisible()) {
				var sTypeConf = "";
				var sProgress = sap.ui.getCore().byId("slider").getValue();
			} else {
				var sTypeConf = "X";
				var sProgress = 100;
			}

			ModelManager.setpartialconfirmation(
					sPassword,sOperation,
					sWorkOrder,sMsn,sReasonCode,
					sProgress,sTypeConf,sLogon,
					sReasonText,"",sRueck,sDuration);
		}
					
		

	},
	
	/**
	 * Remove message and icon from DialogConfirmation.fragment.js
	 */
	oDialogClosingMessage : function() {
		sap.ui.getCore().byId("oDialogClose").removeAllContent();
		sap.ui.getCore().byId("oDialogClose").close();

	},
	
	/**
	 * Display actual % of slider progress confirmation.fragment.js
	 */
	livechange : function() {

		var sSlider = sap.ui.getCore().byId("slider").getValue();
		sap.ui.getCore().byId("percent_box").setText(sSlider);

		;
	},
	
	/**
	 * Close confirmation.fragment.js on clicking “close” button
	 */
	closeoBtnCancel : function() {
		sap.ui.getCore().byId("oDialog1").close();
	},
	
	/**
	 * Open operation info dialog
	 * 
	 * @param{Object} Oevt ,MouseEvent
	 * @param{String} sPathFilter, path of current operation selected 
	 * 
	 */
	operationInfoFragment : function(oEvt, sPathFilter) {
		if(sPathFilter==""){
			var sPath = oEvt.getSource().oPropagatedProperties.oBindingContexts.WorkListModel.sPath;
		}else{
			var sPath = sPathFilter;
		}
		ModelManager.sInfoPopupPath = sPath;
		
		
		if (!this.operationInfoDialog) {
			this.operationInfoDialog = sap.ui.xmlfragment("mes_aos_gui.OperationInfo", this);
		}
		;

		if (ModelManager.bUnplanned) {
			this.operationInfoDialog.setModel(sap.ui.getCore().getModel("WorkListUnplannedModel"));

		} else if (ModelManager.bPopupWorkList) {
			this.operationInfoDialog.setModel(sap.ui.getCore().getModel("WorkListModel"));

		}
		this.operationInfoDialog.bindElement(sPath);
		this.operationInfoDialog.open();
	},
	
	/**
	 * Close operation info dialog
	 */
	closeOperationInfoDialog : function() {
		this.operationInfoDialog.close()
	},
	
	/**
	 * Call ModelManager.setStatus and send to mii new status of operation
	 */
	AcknOperationInfoDialog : function() {
		var sPath = ModelManager.sInfoPopupPath;

		if (ModelManager.bUnplanned) {
			var model = sap.ui.getCore().getModel("WorkListUnplannedModel");

		} else if (ModelManager.bPopupWorkList) {
			var model = sap.ui.getCore().getModel("WorkListModel");
		}
		var sWorkOrder = model.getProperty(sPath + "/workOrder");
		var sOperation = model.getProperty(sPath + "/operation");
		var sAcpng_Status = model.getProperty(sPath + "/ACPnG_Status");
		var sAcpngStartDate = "";
		var sAcpngEndDate = "";
		
		var sGroup = sap.ui.getCore().getModel("GroupingGanttModel").oData.Rowsets.Rowset[0].Row[sap.ui.getCore().byId("ganttGrouping").getSelectedKey()-1].groupingInternal;	
		var sBox = sap.ui.getCore().getModel("BoxingGanttModel").oData.Rowsets.Rowset[0].Row[sap.ui.getCore().byId("ganttBoxing").getSelectedKey()-1].boxingInternal;
		var sIdBox = ModelManager.box_id;
		var sIdGroup = ModelManager.group_id;

		var modelLength = model.oData.Rowsets.Rowset[0].Row.length;
		
		var maxStat = 0;
		var sNewACPnG_Status = "";
		
		if(sAcpng_Status === "1"){
			sAcpng_Status = "2";
			model.setProperty(sPath + "/ACPnG_Status","2");
			
		}else if(sAcpng_Status === "2"){
			sAcpng_Status = "1";
			model.setProperty(sPath + "/ACPnG_Status","1");
			
		}
		
		ModelManager.setStatus(sWorkOrder,sOperation,sAcpng_Status,sAcpngStartDate,sAcpngEndDate);
	},
	
	/**
	 * Open confirmation.fragment.js in total mode or partial
	 * 
	 * @param{Object/Boolean} oEvt , give the path of current operation clicked
	 * @param{Boolean} partial, permit to know if we have to display partial or toal confirmation 
	 * @param{String/Boolean} sPath , give the path of current operation clicked
	 */
	confirmationFragment : function(oEvt, partial, sPath) {

		sap.ui.getCore().byId("tooltipbtn").close();
		if (!this.confirmationDialog) {
			this.confirmationDialog = sap.ui.jsfragment("Confirmation", this);
		}
		;

		if (!this.confirmationDialogMessage) {
			this.confirmationDialogMessage = sap.ui.jsfragment("DialogConfirmation", this);
		}

		if (oEvt) {
			var sPath = oEvt.getSource().getBindingContext().getPath();
		}
		;
		if (sPath) {
			var sPath = sPath;
		}
		;

		var model = sap.ui.getCore().getModel("WorkListModel");
		/*
		 * var progress = model.getProperty(sPath +
		 * "/PROGRESS");
		 */
		var prgs = parseInt(model.getProperty(sPath + "/progress"));
		var durtn = parseInt(model.getProperty(sPath + "/duration"));
		var progress = Math.round((prgs * 100) / durtn);
		sap.ui.getCore().byId("slider").setValue(parseFloat(progress));
		sap.ui.getCore().byId("percent_box").setText(progress);
		sap.ui.getCore().byId("password").setValue("");
		sap.ui.getCore().byId("username").setValue("");
		sap.ui.getCore().byId("slider").setVisible(partial);
		/*
		 * Start:adjustment for reason code in partial
		 * confirmation
		 */
		sap.ui.getCore().byId("ReasonCodePicker").setValue("");
		sap.ui.getCore().byId("comments").setValue("");
		sap.ui.getCore().byId("ReasonCodePicker").setVisible(partial);
		sap.ui.getCore().byId("ReasonCode").setVisible(partial);
		sap.ui.getCore().byId("comments").setVisible(partial);
		/*
		 * End:adjustment for reason code in partial
		 * confirmation
		 */
		sap.ui.getCore().byId("percent_box").setVisible(partial);
		sap.ui.getCore().byId("pcent").setVisible(partial);

		this.confirmationDialog.setModel(sap.ui.getCore().getModel("WorkListModel"));
		this.confirmationDialog.bindElement(sPath);
		this.confirmationDialog.open();

	},
	
	/**
	 * Open Disruption.fragment.js
	 * 
	 * @param{Object} oEvt , give the path of current operation clicked
	 */
	disruptionFragment : function(oEvt) {
		
		sap.ui.getCore().byId("tooltipbtn").close();

		var sPath = oEvt.getSource().getBindingContext().getPath();

		if (!this.disruptionDialog) {
			this.disruptionDialog = sap.ui.jsfragment("Disruption", this);
			this.disruptionDialog.setModel(sap.ui.getCore().getModel("WorkListModel"));
		}

		sap.ui.getCore().byId("CarrouselDisruption").setActivePage();
		
		this.disruptionDialog.bindElement(sPath);

		this.disruptionDialog.open();

	},

	/**
	 * Call ModelManager.setdisruption and save/modify a disruption
	 */
	saveDisruption : function() {
		var model = sap.ui.getCore().getModel("WorkListModel");
		var ctx = this.getBindingContext();
		var vornr = model.getProperty("operation", ctx);
		var aufnr = model.getProperty("workOrder", ctx);
		var oIndexCarousel = sap.ui.getCore().byId("CarrouselDisruption").getActivePage();
		oIndexCarousel = oIndexCarousel.substring(oIndexCarousel.search("-"));
		var model2 = sap.ui.getCore().getModel("DisruptionModel");	
		var ctx2 = sap.ui.getCore().byId("TimesLostSelect" + oIndexCarousel).getBindingContext();;
		var sUserName = model2.getProperty("raisedOn", ctx2);
		
		var raised_by = RoleManager.userIdentified.login;
		var raised_on = model2.getProperty("raisedOn", ctx2);
			
			
		
		var ltxa1 = model2.getProperty("ltxa1", ctx2);
		var oGuid = model2.getProperty("guid_32", ctx2);
		
		var oSavecategory = sap.ui.getCore().byId("CategSelect" + oIndexCarousel).getSelectedItem().getText();
		var oSaveReason = sap.ui.getCore().byId("ReasonSelect" + oIndexCarousel).getSelectedItem().getText();
		var oSaveRootCause = sap.ui.getCore().byId("RootCauseSelect" + oIndexCarousel).getSelectedItem().getText();
		var oSaveDescription = sap.ui.getCore().byId("DescriptionSelect" + oIndexCarousel).getValue();
		var oSaveTimesLost = sap.ui.getCore().byId("TimesLostSelect" + oIndexCarousel).getText();
		var bAndonIsRaised = model2.getProperty("andonId", ctx2);
		var sStatusAndon = sap.ui.getCore().byId("categorieAndon" + oIndexCarousel).getSelectedKey();
		var sLevelAndon = sap.ui.getCore().byId("levelAndon" + oIndexCarousel).getSelectedKey();
		var sResponsibleAndon = sap.ui.getCore().byId("teamembersAndon" + oIndexCarousel).getValue();
		var sDueAndon = sap.ui.getCore().byId("dueDateAndon" + oIndexCarousel).getDateValue().toLocaleDateString();
		if( sap.ui.getCore().byId("completationDateAndon" + oIndexCarousel).getDateValue() != null){
		var sCompletionDateAndon = sap.ui.getCore().byId("completationDateAndon" + oIndexCarousel).getDateValue().toLocaleDateString();
		}
		var oAndonIsSet = sap.ui.getCore().byId("request" + oIndexCarousel);
		
		if(oAndonIsSet.getPressed() === true && sCompletionDateAndon === null){
			ModelManager.messageShow(ModelManager.i18nModel.getProperty("CompletionDate"));
			return 0;
		}	
		
		var aufnr0 = aufnr;
		while (aufnr0.length < 12) {
			aufnr0 = '0' + aufnr0;
		}
		;
		if(!oGuid)
			oGuid="";
		if (bAndonIsRaised === "---") {
			bAndonIsRaised = "";
		}
		if ((oAndonIsSet.getPressed() === true && oAndonIsSet.getEnabled() === true) /**|| (oAndonIsSet.getPressed() === true && oAndonIsSet.getEnabled() === true)*/) {
				bAndonIsRaised = "creation";
		}
	
		
		ModelManager.setdisruption(oSavecategory, oSaveReason, oSaveRootCause, oSaveDescription, vornr, aufnr0,
				oSaveTimesLost, raised_by, raised_on, ltxa1, oGuid,bAndonIsRaised, sStatusAndon,sLevelAndon,
				sResponsibleAndon, sDueAndon, sCompletionDateAndon);

		sap.ui.getCore().byId("DisruptionDialog").close();

	},

	/**
	 * Delete the current disruption
	 */
	deleteDisruption : function() {

		var oIndexCarousel = sap.ui.getCore().byId("CarrouselDisruption").getActivePage();
		oIndexCarousel = oIndexCarousel.substring(oIndexCarousel.search("-"));
		var oGuid_context = sap.ui.getCore().byId("TimesLostSelect" + oIndexCarousel).getBindingContext();
		var oGuid = sap.ui.getCore().getModel("DisruptionModel").getProperty("guid_32", oGuid_context);

		ModelManager.deletedisruption(oGuid);

		sap.ui.getCore().byId("DisruptionDialog").close();

	},
	
	/**
	 * Reset default value of gantt dropdown
	 */
	reLoad : function(oEvt) {
		
		sap.ui.getCore().byId("StatusFilterDropDown").setSelectedIndex(0);
		sap.ui.getCore().byId("GroupingDropDown").setSelectedIndex(0);
		ModelManager.user = "";
		
	},
	
	/**
	 * Fire filter status and user of worklist.
	 * 
	 * @returns {sap.ui.model.Filter}
	 */
	filterBox : function() {
		// ModelManager.wrkListUserFilter = oEvt.getSource().getSelectedKey();
		var filterOnStatus = /*sap.ui.getCore().byId("StatusFilterDropDown").getSelectedKey()*/ "All";
		var filterOnUser = /*sap.ui.getCore().byId("UserFilterDropDown").getSelectedItem().getKey()*/ "ALL_USERS";
		var aMyFilter = [];

		var filteruser = new sap.ui.model.Filter({
			path : "user",
			test : function(value) {

				return value.split(",").some(function(el) {
					return el === filterOnUser.toUpperCase();
				})

			}
		});

		var filterstatus = new sap.ui.model.Filter({
			path : "status",
			test : function(value) {
				// XXX TOFIX data should be separte by ,
				return value.split(",").some(function(el) {
					console.log(el,filterOnStatus);
					return el === filterOnStatus.toUpperCase();
					
				})

			}
		});

		if (filterOnUser != "ALL_USERS" && ModelManager.bUnplanned === false) {
			aMyFilter.push(filteruser);
		}
		if (filterOnStatus != "All") {
			aMyFilter.push(filterstatus);
		}
		if (aMyFilter.length > 0) {
			sap.ui.getCore().byId("viewWorkList").byId("myList").getBinding("items").filter(new sap.ui.model.Filter(aMyFilter, true));
		} else {
			sap.ui.getCore().byId("viewWorkList").byId("myList").getBinding("items").filter();
		}
		if (ModelManager.bPopupWorkList) {
			var sGroup = "dynamicCompetecy";	
			var sBox = "dynamicOperation";
			var sIdBox = ModelManager.box_id;
			var sIdGroup = ModelManager.group_id;
			
			
			
			var oFilterGroup = new sap.ui.model.Filter(sGroup,"EQ",sIdGroup);			
			var oFilterBox = new sap.ui.model.Filter(sBox,"EQ",sIdBox);		
			var oFilterResch = new sap.ui.model.Filter("dynamicReschedStartDate","NE","---");
			
			aMyFilter.push(oFilterGroup,oFilterBox);
			aMyFilter.push(oFilterResch);
			
			if(ModelManager.oCurrentGanttOpInfo.sched_type === "I"){
			
			var oFilterAvlDate = new sap.ui.model.Filter("AVL_StartDateTime","NE","---");
			aMyFilter.push(oFilterAvlDate);
				
			}
			
			
			
			
			sap.ui.getCore().byId("viewWorkList").byId("myList").getBinding("items").filter(new sap.ui.model.Filter(aMyFilter, true));
		}
		sap.ui.getCore().getModel("WorkListModel").refresh(true);
		
	},
	/**
	 * Fire the sorter when picking a value in the combobox worklist 
	 * 
	 * @returns {sap.ui.model.Sorter}
	 */
	changeGrouping : function(oEvt) {
		
		//var aModelToTest = sap.ui.getCore().getModel("GroupingWorkListModel").oData.Group;
		
//		if (aModelToTest.some(function(el) {
//
//			return el.groupingInternal === ModelManager.group_type;
//
//		})) {
//
//			ModelManager.group_parameter = ModelManager.group_type;
//
//		} else {
//			ModelManager.group_parameter = sap.ui.getCore().getModel("GroupingWorkListModel").oData.Group[0].groupingInternal;
//
//		}
		
		if(oEvt){
		ModelManager.group_parameter = oEvt.getSource().getSelectedKey();
		}
			
		sap.ui.getCore().byId("viewWorkList").byId("myList").bindAggregation('items', {
			path : "WorkListModel>/Rowsets/Rowset/0/Row",
			template : sap.ui.getCore().byId("viewWorkList").byId("sorterList"),
			sorter : [ new sap.ui.model.Sorter({
				path : "dynamicCompetecy",
				descending : false,
				group : true,
			}), new sap.ui.model.Sorter({
				path : 'index',
				descending : false
			}) ]
		});

		sap.ui.getCore().byId("viewWorkList").getController().filterBox();
		
		//ModelManager.loadModelWorkList();

	},

	/**
	 * Fire when the user open the worklist pop-up if the worklist contain only one operation
	 * it open the operation info pop-up
	 */
	checkOperationNumberFiltered : function() {
		if (sap.ui.getCore().byId("viewWorkList").byId("myList").getBinding("items").getLength()==1){
			var sPath = sap.ui.getCore().byId("viewWorkList").byId("myList").getBinding("items").getContexts()[0].getPath();
			sap.ui.getCore().byId("viewWorkList").getController().operationInfoFragment("",sPath);
		}
	},
	
	/**
	 * Launch TouchNgo application regardding the workOrder and number of operation
	 */
	launchTng : function(oEvt) {
		
		var oModel = sap.ui.getCore().getModel("WorkListModel")
		var sPath = oEvt.getSource().getBindingContext().sPath;
		var sWorkOrder = oModel.getProperty(sPath + "/workOrder");
		var sOperation = oModel.getProperty(sPath + "/operation");
		
		var oLink = "touchngo" + ModelManager.tAndGoLink + "://openpage/operation?workorder=" + sWorkOrder + "&operation="
				+ sOperation;
		window.open(oLink, "_blank")
	},


	
	/**
	 * Hide / Show Operations in Unplanned Activities WorkList Popup {Selected+Disabled CheckBoxes}
	 * 
	 * @param
	 * @returns 
	 */
	maskCheckedOp : function(evt) {
		if (evt.getSource().getPressed()){
			var oFilterBox = new sap.ui.model.Filter("manuallyInserted","EQ","0");		
			sap.ui.getCore().byId("viewWorkList").byId("myList").getBinding("items").filter(oFilterBox);
		}else{
			sap.ui.getCore().byId("viewWorkList").byId("myList").getBinding("items").filter();
		}
	},
	
	/**
	 * Fire when the user clicl on close of the insert activities in gantt popup
	 *  
	 */
	closeIIGDialog : function(oEvt) {
		sap.ui.getCore().byId("IIGDialog").close();
	},
	
	/**
	 * Fire when a user press confirm in insert activites in gantt popup,
	 * Permit to prepare data for the inserting data in mass in mii service 
	 *  
	 *  @param{STRING} sValue, Value of current current BOX/GROUP TYPE
	 *  @param{STRING} aGroup, corresponding table of BOX/GROUP type name and BOX/GROUP type name for mii service
	 *  @param{STRING} sInsertField, BOX/GROUP type name of current field of mii service
	 *  @param{STRING} sInsertValue, Value to insert in current field of mii service
	 *  
	 *  @return{STRING} Myvalue, current value of box/group Id
	 */
	findCorrepondingType : function(sValue,aGroup,sInsertField,sInsertValue,sDefaultValue){
	var Myvalue = sDefaultValue;
	 aGroup.forEach(function(el){
		if(el.dynamic === sValue && el.insert === sInsertField ){
			Myvalue =  sInsertValue;
					
		}
	})
	return Myvalue;
	},
	
	/**
	 * Fire when a user press confirm in insert activites in gantt popup,
	 * call ModelManager and mii service too insert activities in gantt in
	 *  
	 */	
	confirmIIGDialog : function() {
		var that = this;
		var sGroupType = ModelManager.group_type;
		var sBoxType = ModelManager.box_type;
		var sGroupId = sap.ui.getCore().byId("IIGgroupIdComboBox").getSelectedItem().getText();
		var sBoxId = sap.ui.getCore().byId("InputInsertBoxing").getValue();
		var aCPP = "";
		var sCPP = "";	 
		var sCPPId = "";
		if(sap.ui.getCore().byId("IIGDP1").getSelectedDates()[0] != undefined){
		var sNewDate = ShiftManager.closestShift(sap.ui.getCore().byId("IIGDP1").getSelectedDates()[0].mProperties.startDate);
		}else{
		ModelManager.messageShow(ModelManager.i18nModel.getProperty("SelectNewDate"));	
		return 0;
		}
		
		var aGroupType = [{"dynamic" : "dynamicCompetecy" , "insert" : "COMPETENCY"},
		                  {"dynamic" : "dynamicAVL_Line" , "insert" : "AVL_LINE"},
		                  {"dynamic" : "dynamicATA" , "insert" : "ATA"},
		                  {"dynamic" : "dynamicFamilyTarget" ,"insert" : "FAMILY_TARGET"},
		                  {"dynamic" : "dynamicCPP_Cluster" , "insert" : "CPP_CLUSTER"},
		                  {"dynamic" : "dynamicAVL_Path2" , "insert" : "AVL_PATH2"},                       
		                   ];
		
		var aBoxType = [{"dynamic" : "dynamicOperation" , "insert" : "OPE_DYNAMIC"},
			            {"dynamic" : "dynamicWorkOrder" , "insert" : "WO_DYNAMIC"},
			            {"dynamic" : "dynamicWorkPackage" ,"insert" : "WORK_PACKAGE"},
			            {"dynamic" : "dynamicCPP_Cluster" ,"insert" : "CPP_CLUSTER"},
			            {"dynamic" : "dynamicAVL_Path1" , "insert" : "AVL_PATH1"},                             
			            ];
		

	if (sGroupType === "dynamicCPP_Cluster") {
			aCPP = aGroupType;
			sCPP = sGroupType
			sCPPId = sGroupId;
		} else {
			aCPP = aBoxType;
			sCPP = sBoxType;
			sCPPId = sBoxId;
		}
		var aOperationInsert = [];
		
		ModelManager.aOpToInsert.forEach( function(el){
			aOperationInsert.push({
				"AUFNR" : el.workOrder,
			    "VORNR" : el.operation,
			    "ZZDATEDC" : el.start.slice(0,10),
			    "ZZHEUREDC" : el.start.slice(-8),
			    "ZZDATEFC" : el.end.slice(0,10),
			    "ZZHEUREFC" : el.end.slice(-8),
			    "MANUALLY_INSERTED" : "1",
			    "ATA" : that.findCorrepondingType(sGroupType,aGroupType,"ATA",sGroupId,el.dynamicATA),
			    "AVL_LINE" : that.findCorrepondingType(sGroupType,aGroupType,"AVL_LINE",sGroupId,el.dynamicAVL_Line),
			    "AVL_PATH2" : that.findCorrepondingType(sGroupType,aGroupType,"AVL_PATH2",sGroupId,el.dynamicAVL_Path2),
			    "CPP_CLUSTER" : that.findCorrepondingType(sCPP,aCPP,"CPP_CLUSTER",sCPPId,el.dynamicCPP_Cluster),
			    "COMPETENCY" : that.findCorrepondingType(sGroupType,aGroupType,"COMPETENCY",sGroupId,el.dynamicCompetecy),
			    "FAMILY_TARGET" : that.findCorrepondingType(sGroupType,aGroupType,"FAMILY_TARGET",sGroupId,el.dynamicFamilyTarget),
			    "WORK_PACKAGE" : that.findCorrepondingType(sBoxType,aBoxType,"WORK_PACKAGE",sBoxId,el.dynamicWorkPackage),
			    "WO_DYNAMIC" : that.findCorrepondingType(sBoxType,aBoxType,"WO_DYNAMIC",sBoxId,el.dynamicWorkOrder),
			    "OPE_DYNAMIC" : that.findCorrepondingType(sBoxType,aBoxType,"OPE_DYNAMIC",sBoxId,el.dynamicOperation),
			    "AVL_PATH1" : that.findCorrepondingType(sBoxType,aBoxType,"AVL_PATH1",sBoxId,el.dynamicAVL_Path1),
						
			})
		});
		console.log(aOperationInsert);
		aOperationInsert.sort(util.Formatter.fieldComparator(['ZZDATEDC', 'ZZHEUREDC' , 'AUFNR' , 'VORNR' ]));
		sap.ui.getCore().byId("IIGDialog").close();
		sNewDate = ModelManager.transformRescheduleDate(ShiftManager.shifts[sNewDate].getStartDate());
		ModelManager.insertInGantt(aOperationInsert,sNewDate,sGroupId)
	
	},
	
	/**
	 * Open InsertInGantt.fragment.xml
	 * 
	 * @return{Object} oIIGDialog, new sap.m.Dialog
	 */	
	openIIGDialog : function(){
		if (!this.oIIGDialog)
			this.oIIGDialog = sap.ui.xmlfragment("pocaos.InsertInGantt", sap.ui.getCore().byId("viewWorkList").getController());
		
		var oModel = sap.ui.getCore().getModel("WorkListUnplannedModel").oData;
		ModelManager.aOpToInsert = ModelManager.aOpToInsert.filter(function(el){
			return el.selected === true && el.manuallyInserted === "0";
		});
		
		if (ModelManager.aOpToInsert.length === 0 ){
			ModelManager.messageShow(ModelManager.i18nModel.getProperty("SelectOperation"))
		}else{
			this.oIIGDialog.open();
			var oMin = ModelManager.aOpToInsert[0];
			var sSchedStart = "~";
			var sSchedEnd = "-";
			var sReschedStart = "~";
			var sReschedEnd = "-";
			var nDuration = parseInt(ModelManager.aOpToInsert[0].duration);
			var nProgress = parseInt(ModelManager.aOpToInsert[0].progress);
			
			for (var i = 0; i < ModelManager.aOpToInsert.length ; ++i){
				if (ModelManager.aOpToInsert[i].workOrder < oMin.workOrder){
					oMin = ModelManager.aOpToInsert[i];
				}else if (ModelManager.aOpToInsert[i].workOrder == oMin.workOrder){
					if (ModelManager.aOpToInsert[i].operation < oMin.operation){
						oMin = ModelManager.aOpToInsert[i];
					};
				};
				
				if (ModelManager.aOpToInsert[i].start < sSchedStart && ModelManager.aOpToInsert[i].start != "---")
					sSchedStart = ModelManager.aOpToInsert[i].start;
				if (ModelManager.aOpToInsert[i].end > sSchedEnd && ModelManager.aOpToInsert[i].sSchedEnd != "---")
					sSchedEnd = ModelManager.aOpToInsert[i].end;
				if (ModelManager.aOpToInsert[i].ACPnG_ReschStartDate< sReschedStart && ModelManager.aOpToInsert[i].ACPnG_ReschStartDate != "---")
					sReschedStart = ModelManager.aOpToInsert[i].ACPnG_ReschStartDate;
				if (ModelManager.aOpToInsert[i].ACPnG_ReschEndDate > sReschedEnd && ModelManager.aOpToInsert[i].ACPnG_ReschEndDate != "---")
					sReschedEnd = ModelManager.aOpToInsert[i].ACPnG_ReschEndDate;
				nDuration = nDuration + parseInt(ModelManager.aOpToInsert[i].duration);
				nProgress = nProgress + parseInt(ModelManager.aOpToInsert[i].progress);
			};
			
			var sBoxType = oMin[ModelManager.box_type];
			var nPercent = Math.round((nProgress * 100) / nDuration);
			
			sSchedStart = util.Formatter.dateInfoPop(sSchedStart);
			sSchedEnd = util.Formatter.dateInfoPop(sSchedEnd);
			sReschedStart = util.Formatter.dateInfoPop(sReschedStart);
			sReschedEnd = util.Formatter.dateInfoPop(sReschedEnd);
			

			if (ModelManager.box_type === "dynamicCPP_Cluster" && ModelManager.group_type === "dynamicCPP_Cluster") {
				sap.ui.getCore().byId("IIGButton").setEnabled(false);

			}

			if (sSchedStart === "~") {
				sSchedStart = "";
			}
			if (sSchedEnd === "-") {
				sSchedEnd = "";
			}
			if (sReschedStart === "~") {
				sReschedStart = "";
			}
			if (sSchedStart === "-") {
				sSchedStart = "";
			}
						
			sap.ui.getCore().byId("InputInsertBoxing").setValue(sBoxType);
			sap.ui.getCore().byId("insertGanttTitle").setText(sBoxType + " [" + nPercent + "%]");
			sap.ui.getCore().byId("IIGrescheduleStart").setText(sSchedStart);
			sap.ui.getCore().byId("IIGrescheduleEnd").setText(sSchedEnd);
			sap.ui.getCore().byId("IIGrescheduleStartAcpng").setText(sReschedStart);
			sap.ui.getCore().byId("IIGrescheduleEndAcpng").setText(sReschedEnd);
			
			
			
			var a = [];
			sap.ui.getCore().byId("IIGgroupIdComboBox").getBinding("items").filter(new sap.ui.model.Filter({
				path : "groupId",
				test : function(value) {
					if (a.indexOf(value) == -1) {
						a.push(value)
						return true;
					} else
						return false;
				}
			}));

			if (sap.ui.getCore().byId("IIGgroupIdComboBox").getItems().some(function(el) {
				return el.getText() === "Manually_Inserted";

			})) {
			} else {
				sap.ui.getCore().byId("IIGgroupIdComboBox").addItem(new sap.ui.core.Item({
					text : "Manually_Inserted",
					key : "Manually_Inserted"
				}));
			}
			
			sap.ui.getCore().byId("IIGgroupIdComboBox").setSelectedItem((sap.ui.getCore().byId("IIGgroupIdComboBox").getSelectableItems()[(sap.ui.getCore().byId("IIGgroupIdComboBox").getSelectableItems().length-1)]))
		};
	},
	
	/**
	 * Update ModelManager.aOpToInsert array to put in only operation selected to insert in gantt
	 * 
	 * @return{Array} ModelManager.aOpToInsert,
	 */	
	checkBoxSelected : function()
	{
	
		var sPath = this.getBindingContext().sPath;	
		var oModel  = sap.ui.getCore().getModel("WorkListUnplannedModel");
		var oCurrentItem = oModel.getProperty(sPath);
		var fIndex = oModel.oData.Rowsets.Rowset[0].Row.indexOf(oCurrentItem);
		

		if (ModelManager.aOpToInsert.length === 0) {
			if(oCurrentItem.selected === true){
				
				oCurrentItem.selected = false;
				ModelManager.aOpToInsert.push(oCurrentItem);
				
			}else{
				
				oCurrentItem.selected = true;
				ModelManager.aOpToInsert.push(oCurrentItem);
			}
			
		} else {
			ModelManager.aOpToInsert.forEach(function(el, indice) {
				
				if (oCurrentItem.selected === true && oCurrentItem === el) {
					oCurrentItem.selected = false;
					ModelManager.aOpToInsert.splice(indice,1);
					
				} else if (oCurrentItem.selected === false) {
					
					oCurrentItem.selected = true;
					ModelManager.aOpToInsert.push(oCurrentItem);
					
				}
			})
		}
// if (oCurrentItem.selected === true) {
//			oCurrentItem.selected = false;
//			delete ModelManager.aOpToInsert[fIndex]; 
//		} else {
//			oCurrentItem.selected = true;
//			ModelManager.aOpToInsert[fIndex] = oCurrentItem;
//		}
		
	},
	
	/**
	 * Fire when the user click on close button in disruption dialog
	 */	
	closeDisruption : function() {
	
		sap.ui.getCore().byId("DisruptionDialog").close();

	},
	
	/**
	 * Fire when the user click on Disruption button it hide the remove button for the first disruption
	 */	
	hideRemoveDisruption : function() {
		
		sap.ui.getCore().byId("RemoveDisruptionBtn").setEnabled(false);	
		
	},
	
	/**
	 * Fire when the user change page in carrousel and display the popup correctly regarding if an andon
	 * is selected or if we are one the first page of carrousel 
	 */	
	pageDisruptionChange : function() {

		if (sap.ui.getCore().byId("CarrouselDisruption").getActivePage().split("-")[2] === "0") {
			sap.ui.getCore().byId("RemoveDisruptionBtn").setEnabled(false);
		} else {
			sap.ui.getCore().byId("RemoveDisruptionBtn").setEnabled(true);
		}

		var oIndexCarousel = sap.ui.getCore().byId("CarrouselDisruption").getActivePage();
		oIndexCarousel = oIndexCarousel.substring(oIndexCarousel.search("-"));
		var oAndonClicked = sap.ui.getCore().byId("MatrixAndon" + oIndexCarousel).getVisible();
		
	},
	
	infoPop : function(oEvt) {
		if(ModelManager.bPopupWorkList || ModelManager.bUnplanned){
			this.operationInfoFragment(oEvt,"");								
		}
	}
	
	
	
	
});

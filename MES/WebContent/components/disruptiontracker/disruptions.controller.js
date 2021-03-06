"use strict";
sap.ui.controller("airbus.mes.disruptiontracker.disruptions", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf table.table
	 */
	disruptionTrackerRefresh : undefined,
	onInit : function() {
		// if the page is not busy
		if (airbus.mes.shell.oView.byId('refreshTime').setBusyIndicatorDelay(0)) {
			airbus.mes.shell.oView.byId('refreshTime').setEnabled(true);
		}
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf table.table
	 */
	onAfterRendering : function() {

	},

	onBackPress : function() {
		nav.back();
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf table.table
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf table.table
	 */
	// onAfterRendering: function() {
	//
	// },
	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf table.table
	 */
	// onExit: function() {
	//
	// },
	/***************************************************************************
	 * Filter disruptions
	 */
	filterByStation : function(oEvent) {
		airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.station = this.getView().byId("stationComboBox").getSelectedKey();
		
		if(oEvent.getSource().getId() == "disruptiontrackerView--stationComboBox"){
			
			var oFilters = [];
			
			if (this.getView().byId("stationComboBox").getSelectedKey() == " " || this.getView().byId("stationComboBox").getSelectedKey() == "") {
				oFilters.push(new sap.ui.model.Filter("station", "EQ", "DISPLAY_NO_MSN"));
			} else {

				// When Station is selected on Model Loading
				oFilters.push(new sap.ui.model.Filter("station", "EQ", airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.station));
				oFilters.push(new sap.ui.model.Filter({
	                path: "msn",
	                test: function (oValue) {
	                    if (oValue == "---") {
	                        return false;
	                    }
	                    return true;
	                }
	            }));
			}
			

			var msnBox = this.getView().byId("msnComboBox");
			
			// Apply filters
			msnBox.getBinding("items").filter(oFilters);

			// Add item All into MSN ComboBox
			var msnItemAll = new sap.ui.core.Item();
			msnItemAll.setKey = "";
			msnItemAll.setText(this.getView().getModel("disruptiontrackerI18n").getProperty("All") + " MSN");
			msnBox.insertItem(msnItemAll, 0);
			
			// Clear MSN ComboBox when Station is changed
			msnBox.setSelectedKey("");
		}

		airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.msn = this.getView().byId("msnComboBox").getSelectedKey();

		airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel();

	},
	
	/***************************************************************************
	 * Table Settings Sorter And Filter
	 * 
	 * @param oEvent
	 */
	filterDisruptions : function(oEvent) {
		
		var sStatus = this.getView().byId("statusComboBox").getSelectedKey().toUpperCase();
		var sResoGroup = this.getView().byId("resolutionGroupBox").getSelectedKey();
		var sSeverity = this.getView().byId("severityComboBox").getSelectedKey();
		var sEscLevel = this.getView().byId("esclationLevelBox").getSelectedKey();
		var sCategory = this.getView().byId("disruptionCategoryBox").getSelectedKey();	
		var sReason = this.getView().byId("disruptionReasonBox").getSelectedKey();

//		var aFilters = [];
//		var oBinding = this.getView().byId("disruptionsTable").getBinding("rows");
		

		this.getView().byId("categoryColfilter").setFilterOperator("EQ");
		this.getView().byId("categoryColfilter").filter(sCategory);
		this.getView().byId("reasonColfilter").setFilterOperator("EQ");
		this.getView().byId("reasonColfilter").filter(sReason);
		this.getView().byId("gravityColfilter").setFilterOperator("EQ");
        this.getView().byId("gravityColfilter").filter(sSeverity);
		this.getView().byId("statusColfilter").setFilterOperator("EQ");
		this.getView().byId("statusColfilter").filter(sStatus);
		this.getView().byId("resolutionGroupColfilter").setFilterOperator("EQ");
		this.getView().byId("resolutionGroupColfilter").filter(sResoGroup);
		this.getView().byId("escalationColfilter").setFilterOperator("EQ");
		this.getView().byId("escalationColfilter").filter(sEscLevel);
		
		
//		if (sStatus != ""){
//			aFilters.push(new sap.ui.model.Filter("status", "EQ", sStatus));
//		}
//		if (sResoGroup != "")	{
//			aFilters.push(new sap.ui.model.Filter("responsibleGroup", "EQ", sResoGroup));
//		}
//		if(sSeverity != ""){
//			aFilters.push(new sap.ui.model.Filter("severity", "EQ", sSeverity));
//		}
//		if(sEscLevel != ""){
//			aFilters.push(new sap.ui.model.Filter("escalationLevel", "EQ", sEscLevel));
//		}
//		if(sCategory != ""){
//		
//			aFilters.push(new sap.ui.model.Filter("category", "EQ", sCategory));
//	}
//		
//		if(sReason != ""){
//			aFilters.push(new sap.ui.model.Filter("reason", "EQ", sReason));
//		}
//        
//		oBinding.filter(aFilters);

	},

	/***************************************************************************
	 * Open Operation Detail PopUp on table item click
	 * 
	 * @param {object}
	 *            oEvt control as an argument to this event
	 */
	onTableClick : function(oEvt) {
		var sSelectionMode = oEvt.getSource().getSelectionMode();
		if(sSelectionMode === "None"){
			return false;
		}
		
		//Remove clear all selections
		this.getView().byId("disruptionsTable").clearSelection();

		// set data of the selected row to Data Model
		// binding context changed as table used is sap.ui.table
		if(oEvt.getParameters().rowBindingContext === undefined){
			return false;
		}
		var sPath = oEvt.getParameters().rowBindingContext.getPath();
		var disruptionData = sap.ui.getCore().getModel("disruptionsTrackerModel").getProperty(sPath);
		
		sap.ui.core.BusyIndicator.show(0);
		
		jQuery.ajax({
			type : 'post',
			url : airbus.mes.disruptions.ModelManager.urlModel.getProperty("getDisruptionDetailsURL"),
			contentType : 'application/json',
			cache : false,
			data : JSON.stringify({
				"site" : airbus.mes.settings.util.ModelManager.site,
				"messageRef": disruptionData.messageRef
			}),

			success : function(data) {
				
  				if(data.disruptionComments && data.disruptionComments[0] == undefined){
  					data.disruptionComments = [data.disruptionComments];
  				}
				
  				// Call detail screen
  				if (sap.ui.Device.system.desktop && data.responsibleFlag == "X" /*&& disruptionData.originatorFlag != "X"*/) {
  					airbus.mes.shell.util.navFunctions.disruptionsDetailScreen(data);
  					
  				} else{
					var aDisruptions = [];
					if (data) {
						if (data && !data[0]) {

			  				
							data.expanded="true"; //Set panel expanded by default
							data.disruptionTracker="true";
							aDisruptions = [ data ];
						}
					}
					// Set Data in Model 
					sap.ui.getCore().getModel("operationDisruptionsModel").setData(aDisruptions);

					
					// Create Pop-Up as a fragment
					if (airbus.mes.disruptiontracker.detailPopUp === undefined) {

						airbus.mes.disruptiontracker.detailPopUp = sap.ui.xmlfragment("disruptionDetailPopUp", "airbus.mes.disruptiontracker.disruptionDetailPopUp",
							airbus.mes.disruptiontracker.oView.getController());

						airbus.mes.disruptiontracker.oView.addDependent(airbus.mes.disruptiontracker.detailPopUp);
					}

					// Add View Disruptions view to pop-up navigation container
					airbus.mes.disruptiontracker.oView.oController.nav = sap.ui.getCore().byId("disruptionDetailPopUp--disruptDetailNavContainer");
					airbus.mes.shell.util.navFunctions.viewDisruptionsList(airbus.mes.disruptiontracker.oView.oController.nav, 0);
					
					airbus.mes.disruptiontracker.detailPopUp.open();
  				}

  				sap.ui.core.BusyIndicator.hide(0);
			},

			error : function(error, jQXHR) {
  				sap.ui.core.BusyIndicator.hide(0);
			}

		});

	},

	/***************************************************************************
	 * Disruption Close Pop-Up Functions
	 */
	onCloseDisruptnDetailPopUp : function(oEvt) {
		airbus.mes.disruptiontracker.detailPopUp.close();
	},

	afterCloseDisruptnDetailPopUp : function() {

		// Empty Model
		sap.ui.getCore().getModel("operationDisruptionsModel").setData();

		if (airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh == true) {
			airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel();
			airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = false;
		}
		// Resume the Refresh timer when the Pop-Up is opened
		airbus.mes.shell.AutoRefreshManager.resumeRefresh();
	},

	onNavigate : function() {

		if (this.nav.getCurrentPage().sId == "createDisruptionView") {
			sap.ui.getCore().byId("disruptionDetailPopUp--btnUpdateDisruption").setVisible(false);
			sap.ui.getCore().byId("disruptionDetailPopUp--btnCancelDisruption").setVisible(false);
		}
	},

	afterNavigate : function() {

		if (this.nav.getCurrentPage().sId == "createDisruptionView") {
			sap.ui.getCore().byId("disruptionDetailPopUp--btnUpdateDisruption").setVisible(true);
			sap.ui.getCore().byId("disruptionDetailPopUp--btnCancelDisruption").setVisible(true);
		}
	},


	/**
	 * Export Disruption Data to excel [MES V1.5] [SD-SP1604983-EXT-005]
	 */
	handleSelectedRowExcelExport : function() {
		var oTable = this.getView().byId("disruptionsTable");
		var aIndices = oTable.getSelectedIndices();
		if(aIndices == ""){
			airbus.mes.shell.ModelManager.messageShow(this.getView().getModel("disruptiontrackerI18n").getProperty("notableSelect"));
			return;
		}
		var aContexts = [];
		for(var i=0;i<aIndices.length;i++){
			aContexts.push( oTable.getContextByIndex(aIndices[i]));
		}

		var aItems = aContexts.map(function(oEvent) {
			return oEvent.getObject();
		});
		this.jsonToCSVConvertor(aItems, "Disruption Data");

	},

	
	getColumnNameInList : function (){
		var oModel  = this.getView().getModel("disruptiontrackerI18n");
		
		var sHeader = oModel.getProperty("operation") + ',' + 
					  oModel.getProperty("workOrder") + ',' +
					  oModel.getProperty("object") + ',' +
					  oModel.getProperty("attribute") + ',' +
					  oModel.getProperty("originator") + ',' +
					  oModel.getProperty("openDate") + ',' +
					  oModel.getProperty("severity") + ',' +
					  oModel.getProperty("status") + ',' +
					  oModel.getProperty("solution") + ',' +
					  oModel.getProperty("resolutionGroup") + ',' +
					  oModel.getProperty("resolver") + ',' +
					  oModel.getProperty("expectedResolutionDate") + ',' +
					  oModel.getProperty("escalation") + ',' +
					  oModel.getProperty("dateofescalation") + ',' +
					  oModel.getProperty("resolverafterescalation") + ',' +
					  oModel.getProperty("timeToGetFix") + ',' +
					  oModel.getProperty("timeLost") + ',' +
					  oModel.getProperty("dateofanswer") + ',' +
					  oModel.getProperty("originatorGroup");
		return sHeader;
	},

	jsonToCSVConvertor : function(JSONData, ReportTitle) {
		
		var CSV = '';

		
		// Get File Header
		CSV = this.getColumnNameInList() + '\r\n';


		// If JSONData is not an object then JSON.parse will parse the JSON
		// string in an Object
		var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
		
		// loop to extract each row
		for (var i = 0; i < arrData.length; i++) {
			var row = arrData[i].workOrder + ',' + airbus.mes.disruptiontracker.Formatter.setOperationText(arrData[i].operation).toString() + ',' + arrData[i].category
				+ ',' + arrData[i].reason + ','  + arrData[i].originatorName + ',' + arrData[i].openDateTime + ','
				+ airbus.mes.disruptiontracker.Formatter.setGravityText(arrData[i].severity) + ',' + arrData[i].status + ','+ airbus.mes.disruptions.Formatter.formatComment(arrData[i].solution) + ',' + arrData[i].responsibleGroupDesc + ','
				+ arrData[i].resolverName + ',' + arrData[i].requiredFixBy + ','
				+ this.getView().getModel("disruptiontrackerI18n").getProperty("level") + " " + arrData[i].escalationLevel + ',' + arrData[i].escalationDateTime + ',' + arrData[i].escalationGroup + ',' + airbus.mes.disruptiontracker.Formatter.timeMillisecondsToConfig(arrData[i].openDuration) + ',' 
				+ airbus.mes.disruptiontracker.Formatter.timeMillisecondsToConfig(arrData[i].timeLost) + ',' + arrData[i].dateOfAnswer + ',' + arrData[i].originatorGroupDesc ;

			// add a line break after each row
			CSV += row + '\r\n';
		}

		if (CSV == '') {
			alert("Invalid data");
			return;
		}

		// this trick will generate a temp "a" tag
		var link = document.createElement("a");
		link.id = "lnkDwnldLnk";

		// this part will append the anchor tag and remove it after automatic
		// click
		document.body.appendChild(link);

		var csv = CSV;
		var blob = new Blob([ csv ], {
			type : 'text/csv'
		});
		var csvUrl = window.URL.createObjectURL(blob);
		var filename = 'Disruption Data.csv';
		$("#lnkDwnldLnk").attr({
			'download' : filename,
			'href' : csvUrl
		});

		$('#lnkDwnldLnk')[0].click();
		document.body.removeChild(link);

	},
	onPersoalisationButtonPressed : function() {

		this._oTPC.openDialog();
	},
	
	/**
	 * Set Roles for type of Table Column
	 */
	setSelectionMode : function(bAuthorized){
    	if(bAuthorized === true ){
    	return "MultiToggle"
    	} else { 
    	return "None"
    	}

	},

});

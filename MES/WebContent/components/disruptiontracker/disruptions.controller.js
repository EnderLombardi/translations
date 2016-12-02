"use strict";
sap.ui.controller("airbus.mes.disruptiontracker.disruptions", {
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf table.table
*/
	disruptionTrackerRefresh : false,
	disruptionsCustomDataFlag : undefined,
	onInit: function() {
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf table.table
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf table.table
*/
	onAfterRendering: function() {
		var oSorter = new sap.ui.model.Sorter("OpeningTime", true);

		// sorting based on opening time
		this.getView().byId("disruptiontrackerView--disruptionsTable").getBinding("items").sort(oSorter);
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf table.table
*/
//	onExit: function() {
//
//	},
	
	/************************************
	 * Filter disruptions
	 */
	filterByStation: function(oEvent){
		airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.station = this.getView().byId("stationComboBox").getSelectedKey();  
		airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel();
	},
	/*filterByResolutionGroup:function(oEvent){
		sValue = oEvent.getSource().getSelectedKey();
		if (sValue != "") {
			this.getView().byId("disruptionsTable").getBinding("items").filter(
					new sap.ui.model.Filter("ResponsibleGroup", "EQ", sValue));
		}
	},*/
	
	filterDisruptions: function(oEvent){
		var sStatus = this.getView().byId("statusComboBox").getSelectedKey();
		var sResoGroup = this.getView().byId("resolutionGroupBox").getSelectedKey();
		var aFilters = [];
        var oBinding = this.byId("disruptionsTable").getBinding("items");

		if (sStatus != " ")
			aFilters.push(new sap.ui.model.Filter("Status","EQ", sStatus));
		if (sResoGroup != "")
			aFilters.push(new sap.ui.model.Filter("ResponsibleGroup", "EQ", sResoGroup));
            
		oBinding.filter(aFilters);
        airbus.mes.disruptiontracker.ModelManager.fixNoDataRow();// Remove last column
	},
	
	/***********************************************
	 * Open fragment for table setting options
	 */	
	onDisruptionTableSettings: function(oEvent){
		if (!this.tableSettingsDialogue) {
			this.tableSettingsDialogue = 
				sap.ui.xmlfragment("airbus.mes.disruptiontracker.tableSettings", this);
			this.getView().addDependent(this.tableSettingsDialogue);
		}
		this.tableSettingsDialogue.open();
	},
	
	/***************************************
	 * Apply selected settings on table
	 */
	onTableSettingsConfirm: function(oEvent){
		
	    var mParams = oEvent.getParameters();
	     // apply sorter
	    var aSorters = [];
	    var sPath = mParams.sortItem.getKey();
	    var bDescending = mParams.sortDescending;
	    aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
	    this.getView().byId("disruptionsTable").getBinding("items").sort(aSorters);
	},
	
	/**********************************
	 * Call Disruption KPI charts 
	 */	
	onPressDisruptionKPI: function(oEvent){
		 var sStation = this.getView().byId("stationComboBox").getSelectedKey();
		// sap.ui.core.BusyIndicator.show(0);
		 airbus.mes.shell.util.navFunctions.disruptionKPI(sStation);
	//	airbus.mes.disruptiontracker.kpi.ModelManager.loadDisruptionKPIModel(sStation);
		
	},
	
	onNavBack: function(oEvent){
		nav.back();
	},

	/*****************************************************
	 * Open Operation Detail PopUp on table item click
	 */	
	onTableClick: function(oEvt){
				
		//create Pop-Up as a fragment 
		if (airbus.mes.disruptiontracker.detailPopUp === undefined) {

		    airbus.mes.disruptiontracker.detailPopUp = sap.ui.xmlfragment("disruptionDetailPopup",
		                 "airbus.mes.disruptiontracker.disruptionDetailPopup", airbus.mes.disruptiontracker.oView.getController());

		    airbus.mes.disruptiontracker.oView.addDependent(airbus.mes.disruptiontracker.detailPopUp);
		}
		
		//Add View Disruptions view to pop-up navigation container
		this.nav = sap.ui.getCore().byId("disruptionDetailPopup--disruptDetailNavContainer");
		
		airbus.mes.shell.util.navFunctions.disruptionsDetail(this.nav,
			0, // Report Disruption Button
			0, // Create Button
			sap.ui.getCore().byId("disruptionDetailPopup--btnUpdateDisruption"), // Update Button
			sap.ui.getCore().byId("disruptionDetailPopup--btnCancelDisruption")	// Cancel Button	
		);
		
		var disruptionData = {
				   "Rowsets":{
					      "Rowset":[
					         {
					            "Row":[oEvt.getSource().getBindingContext("disruptionsTrackerModel").getObject()]
					         },
					         {
								"Row" : []
					         }
					      ]
					   }
					};
		
		var aComments=sap.ui.getCore().getModel("disruptionsTrackerModel").getData().Rowsets.Rowset[1].Row;
		var sCurrMessageRef = oEvt.getSource().getBindingContext("disruptionsTrackerModel").getObject().MessageRef;
		
		aComments.find(function(el){ 
			if(el.MessageRef == sCurrMessageRef) 
				disruptionData.Rowsets.Rowset[1].Row.push(el); 
		}); 
		
		airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").setData(disruptionData);
		
		this.disruptionsCustomDataFlag = false;
		
		airbus.mes.disruptiontracker.detailPopUp.open();

		//Set Expanded by Default
		sap.ui.getCore().byId("ViewDisruptionView").getContent()[0].getContent()[1].getItems()[0].getContent()[0].setExpandable(false);
		
		this.nav.to(airbus.mes.disruptions.oView.viewDisruption.getId());

        // Pause the Refresh timer till the Pop-Up is opened
        //airbus.mes.shell.AutoRefreshManager.pauseRefresh();
		//this.getView().byId('refreshTime').setVisible(false);			--commented by MJ
		airbus.mes.shell.oView.byId('refreshTime').setVisible(false);					// ++ MJ
		//this.getView().byId('refreshTime').setVisible(false);		
	},
	
	/**************************************
	 * Disruption Close Pop-Up Functions 
	 */
	onCloseDisruptnDetailPopUp: function(oEvt){
		airbus.mes.disruptiontracker.detailPopUp.close();
	},
	
	afterCloseDisruptnDetailPopUp: function(){
			
		// Reset Expandable
		sap.ui.getCore().byId("ViewDisruptionView").getContent()[0].getContent()[1].getItems()[0].getContent()[0].setExpandable(true);
		
		// Empty Model
		airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").setData();
		
		if(airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh == true) {
			airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel();
			airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = false;
		}
        // Resume the Refresh timer when the Pop-Up is opened
        airbus.mes.shell.AutoRefreshManager.resumeRefresh();
	},
	
	onNavigate : function() {
		
		if(this.nav.getCurrentPage().sId == "createDisruptionView" ){
			sap.ui.getCore().byId("disruptionDetailPopup--btnUpdateDisruption").setVisible(false);
			sap.ui.getCore().byId("disruptionDetailPopup--btnCancelDisruption").setVisible(false);
		}
	},
	
	afterNavigate : function() {
		
		if(this.nav.getCurrentPage().sId == "createDisruptionView" ){
			sap.ui.getCore().byId("disruptionDetailPopup--btnUpdateDisruption").setVisible(true);
			sap.ui.getCore().byId("disruptionDetailPopup--btnCancelDisruption").setVisible(true);

			/***************************************************
			 * Load Disruption Custom Data
			 **************************************************/
			if (!this.disruptionsCustomDataFlag){
				airbus.mes.disruptions.ModelManager.loadData();
				this.disruptionsCustomDataFlag = true;
			} else {
				airbus.mes.disruptions.oView.createDisruption.oController.setDataForEditDisruption();
			}
		}
	}
});

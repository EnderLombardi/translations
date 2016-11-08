sap.ui.controller("airbus.mes.disruptiontracker.disruptions", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf table.table
*/
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
//	onAfterRendering: function() {
//
//	},

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
		airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel({
			"station": this.getView().byId("stationComboBox").getSelectedItem()
		});
	},
	filterByResolutionGroup:function(oEvent){
		sValue = oEvent.getSource().getSelectedKey();
		if (sValue != "") {
			this.getView().byId("disruptionsTable").getBinding("items").filter(
					new sap.ui.model.Filter("ResponsibleGroup", "EQ", sValue));
		}
	},
	
	filterDisruptions: function(oEvent){
		var sValue = this.getView().byId("statusComboBox").getSelectedKey();

        var oBinding = this.byId("disruptionsTable").getBinding("items");
        
        if(sValue != "")
        	oBinding.filter(new sap.ui.model.Filter("Status", "EQ", sValue));
        else
        	oBinding.filter([]);
        
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
		var oView = this.getView();
	    var oTable = oView.byId("disruptionsTable");

	    var mParams = oEvent.getParameters();
	    var oBinding = oTable.getBinding("items");

	     // apply sorter
	    var aSorters = [];
	    var sPath = mParams.sortItem.getKey();
	    var bDescending = mParams.sortDescending;
	    aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
	    oBinding.sort(aSorters);
	},
	
	/**********************************
	 * Call Disruption KPI charts 
	 */	
	onPressDisruptionKPI: function(oEvent){
		airbus.mes.shell.util.navFunctions.disruptionKPI();
		
	},
	
	onNavBack: function(oEvent){
		nav.back();
	},
	

	/*****************************************************
	 * Open Operation Detail Popup on table item click
	 */	
	
	onTableClick: function(){
		//create popup as a fragment 

		/*if (airbus.mes.disruptiontracker.operationDetailPopup === undefined) {

		    airbus.mes.disruptiontracker.operationDetailPopup = sap.ui.xmlfragment("disruptionDetailPopUp",
		                 "airbus.mes.disruptiontracker.detail.operationDetailPopup", airbus.mes.disruptiontracker.oView
		                               .getController());

		    airbus.mes.disruptiontracker.oView.addDependent(airbus.mes.disruptiontracker.operationDetailPopup);


		} 
		airbus.mes.disruptiontracker.operationDetailPopup.open();
		//Create component for popup
		this.nav = sap.ui.getCore().byId("disruptionDetailPopUp--disruptDetailNavContainer");

		if (airbus.mes.disruptiontracker.detail === undefined || airbus.mes.disruptiontracker.detail.oView === undefined) {
			jQuery.sap.registerModulePath("airbus.mes.disruptiontracker.detail", "../components/disruptiontracker/detail");
			sap.ui.getCore().createComponent({
				name : "airbus.mes.disruptiontracker.detail",
			});
			
			this.nav.addPage(airbus.mes.disruptiontracker.detail.oView);
		}
		
		this.nav.to(airbus.mes.disruptiontracker.detail.oView.getId()); */

		
	}
	

});

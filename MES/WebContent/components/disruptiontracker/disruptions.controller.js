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
        
        if(sStatus != "")
        	aFilters.push(new sap.ui.model.Filter("Status", "EQ", sStatus));
        
        if(sResoGroup != "")
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
		airbus.mes.shell.util.navFunctions.disruptionKPI();
		
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
		                 "airbus.mes.disruptiontracker.detail.disruptionDetailPopup", airbus.mes.disruptiontracker.oView
		                               .getController());

		    airbus.mes.disruptiontracker.oView.addDependent(airbus.mes.disruptiontracker.detailPopUp);


		}
		
		airbus.mes.disruptiontracker.detailPopUp.open();
		
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
					            "Row":[
					               oEvt.getSource().getBindingContext("disruptionsTrackerModel").getObject()
					            ]
					         }
					      ]
					   }
					};
		
		sap.ui.getCore().getModel("operationDisruptionsModel").setData(disruptionData);
		sap.ui.getCore().byId("__panel1-ViewDisruptionView--disrptlist-0").setExpanded(true);
		sap.ui.getCore().byId("__panel1-ViewDisruptionView--disrptlist-0-CollapsedImg").setVisible(false);
		
		
		this.nav.to(airbus.mes.disruptions.oView.viewDisruption.getId());
		
	},
	
	
	/**************************************
	 * Disruption Close Pop-Up Functions 
	 */
	onCloseDisruptnDetailPopUp: function(){
		this.afterCloseDisruptnDetailPopUp()
		airbus.mes.disruptiontracker.detailPopUp.close();
	},
	
	afterCloseDisruptnDetailPopUp: function(){
				
		sap.ui.getCore().byId("__panel1-ViewDisruptionView--disrptlist-0").setExpanded(false);
		sap.ui.getCore().byId("__panel1-ViewDisruptionView--disrptlist-0-CollapsedImg").setVisible(true);
		

		var disruptionData = {
				   "Rowsets":{
					      "Rowset":[
					         {
					            "Row":[]
					         }
					      ]
					   }
					};
		sap.ui.getCore().getModel("operationDisruptionsModel").setData(disruptionData);
	}
	

});

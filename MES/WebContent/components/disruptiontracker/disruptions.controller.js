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
	
	filterByStatus: function(oEvent){
		var sValue = this.getView().byId("statusComboBox").getSelectedKey();

        var oBinding = this.byId("disruptionsTable").getBinding("items");
        
        if(sValue != "")
        	oBinding.filter([new sap.ui.model.Filter("Status", "EQ", sValue)]);
        else
        	oBinding.filter([]);
        
        airbus.mes.disruptiontracker.ModelManager.fixNoDataRow();// Remove last column
	},
	
	
	
	/**********************************
	 * Call Disruption KPI charts 
	 */	
	onPressDisruptionKPI: function(oEvent){
		airbus.mes.shell.util.navFunctions.disruptionKPI();
		
	},
	
	onNavBack: function(oEvent){
		nav.back();
	}

});

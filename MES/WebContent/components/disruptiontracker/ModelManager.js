"use strict";
jQuery.sap.declare("airbus.mes.disruptiontracker.ModelManager")
airbus.mes.disruptiontracker.ModelManager = {
	oDisruptionFilter: {},

	init : function(core) {
		core.setModel(new sap.ui.model.json.JSONModel(), "disruptionsTrackerModel");//Model having disruptions tracker data
		core.getModel("disruptionsTrackerModel").attachRequestCompleted(airbus.mes.disruptiontracker.ModelManager.onDisruptionsLoad);
	},
	
	loadDisruptionTrackerModel : function() {
		
		var oFilters = airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter;
		airbus.mes.disruptiontracker.oView.setBusy(true); //Set Busy Indicator
		var oViewModel = sap.ui.getCore().getModel("disruptionsTrackerModel");
		var getDisruptionsURL = airbus.mes.disruptions.ModelManager.getDisruptionsURL(oFilters);
		oViewModel.loadData(getDisruptionsURL);
		
		if(oFilters.station != undefined && oFilters.station != ""){
			airbus.mes.disruptiontracker.oView.byId("stationComboBox").setSelectedKey(oFilters.station);
		} else {
			airbus.mes.disruptiontracker.oView.byId("stationComboBox").setSelectedKey("");
		}
		if(oFilters.msn != undefined && oFilters.msn != ""){
			airbus.mes.disruptiontracker.oView.byId("msnComboBox").setSelectedKey(oFilters.msn);
		} else {
			airbus.mes.disruptiontracker.oView.byId("msnComboBox").setSelectedKey("");
		}
	},
	
	onDisruptionsLoad: function(){

		airbus.mes.disruptiontracker.ModelManager.fixNoDataRow();
		
		// Apply filter on Resolution Group Filter Box
		var aTemp = [];	
		sap.ui
		.getCore()
		.byId("disruptiontrackerView--resolutionGroupBox")
		.getBinding("items")
		.filter(new sap.ui.model.Filter({
		    path: "ResponsibleGroup",
		    test: function(oValue) {
				if (aTemp.indexOf(oValue) == -1) {
					aTemp.push(oValue);
					return true;
				} else {
					return false;
				}
		    }
		  }));


		// Add option "ALL"
		var a = sap.ui.getCore().byId("disruptiontrackerView--resolutionGroupBox");
		var item = new sap.ui.core.Item();
		item.setKey="";
		item.setText("All");
		a.addItem(item);
		
		
		// Apply filter on MSN Filter Box
		var aMSNval = [];			
		if(airbus.mes.disruptiontracker.oView.byId("stationComboBox").getSelectedKey() == ""){
		sap.ui
		.getCore()
		.byId("disruptiontrackerView--msnComboBox")
		.getBinding("items")
		.filter(new sap.ui.model.Filter({
		    path: "msn",
		    test: function(oValue) {
				if (aMSNval.indexOf(oValue) == -1) {
					aMSNval.push(oValue);
					return true;
				} 
				else if(oValue == "---")
					return false;
				else {
					return false;
				}
		    }
		  }));
		}
		
		else {
			// When Station is selected on Model Loading
			sap.ui
			.getCore()
			.byId("disruptiontrackerView--msnComboBox")
			.getBinding("items")
			.filter(new sap.ui.model.Filter(
				"station","EQ", airbus.mes.disruptiontracker.oView.byId("stationComboBox").getSelectedKey()));
		}
		// when no station is selected on Model Loading

		airbus.mes.disruptiontracker.oView.setBusy(false); //Remove Busy Indicator
	},
	
	fixNoDataRow: function(){
		var noDataRow = document.getElementById("disruptiontrackerView--disruptionsTable-nodata-text");
		if(noDataRow != undefined){
			var colCount = airbus.mes.disruptiontracker.oView.byId("disruptionsTable").getColCount();

			// Set Col Span
			noDataRow.colSpan = colCount - 1;
		}
	}
}

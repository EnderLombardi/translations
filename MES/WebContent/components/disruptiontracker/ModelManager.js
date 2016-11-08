//"use strict";
jQuery.sap.declare("airbus.mes.disruptiontracker.ModelManager")
airbus.mes.disruptiontracker.ModelManager = {
	urlModel : undefined,
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {
		
		core.setModel(new sap.ui.model.json.JSONModel(), "disruptionsTrackerModel");//Model having disruptions tracker data
		core.getModel("disruptionsTrackerModel").attachRequestCompleted(airbus.mes.disruptiontracker.ModelManager.onDisruptionsLoad);
		
		
	},
	
	loadDisruptionTrackerModel : function(oFilters) {
		
		airbus.mes.disruptiontracker.oView.setBusy(true); //Set Busy Indicator
		
		var oViewModel = sap.ui.getCore().getModel("disruptionsTrackerModel");
		
		var getDisruptionsURL = airbus.mes.disruptions.ModelManager.getDisruptionsURL(oFilters);
		
		oViewModel.loadData(getDisruptionsURL, null, false);
		
		if(oFilters.station != undefined && oFilters.station != ""){
			airbus.mes.disruptiontracker.oView.byId("stationComboBox").setSelectedKey(oFilters.station);
		}
		else{
			airbus.mes.disruptiontracker.oView.byId("stationComboBox").setSelectedKey("");
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
		    	if(aTemp.indexOf(oValue) == -1)
		    		{
		    		aTemp.push(oValue);
		    		return true;
		    		}
		    	
		    	else{
		    		return false;
		    	}
		    }
		  }));
		
		
		
		
		
		
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

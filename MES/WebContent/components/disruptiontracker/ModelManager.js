//"use strict";
jQuery.sap.declare("airbus.mes.disruptiontracker.ModelManager")
airbus.mes.disruptiontracker.ModelManager = {
	urlModel : undefined,
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {
		
		core.setModel(new sap.ui.model.json.JSONModel(), "disruptionsTrackerModel");//Model having disruptions tracker data
		
	},
	
	loadDisruptionTrackerModel : function(oFilters) {
		
		var oViewModel = sap.ui.getCore().getModel("disruptionsTrackerModel");
		
		var getDisruptionsURL = airbus.mes.disruptions.ModelManager.getDisruptionsURL(oFilters);
		
		oViewModel.loadData(getDisruptionsURL, null, false);
		
		//TODO: Attach on load model event
		document.getElementById("disruptiontrackerView--disruptionsTable-nodata-text").colSpan = "1";

	}
	
}

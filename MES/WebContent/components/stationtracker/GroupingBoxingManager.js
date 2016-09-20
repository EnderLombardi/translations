jQuery.sap.declare("airbus.mes.stationtracker.GroupingBoxingManager")
airbus.mes.stationtracker.GroupingBoxingManager = {
	
	operationHierarchy : {},
	
	
	groupingBoxing : function(sGroup,sBoxing) {

		airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy = {};
		var oHierachy = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy;
		var oModel = sap.ui.getCore().getModel("stationTrackerModel");
		
		if(oModel.getProperty("/Rowsets/Rowset/0/Row")){              
			
			oModel = sap.ui.getCore().getModel("stationTrackerModel").oData.Rowsets.Rowset[0].Row;
			
        } else  {
        	
        	console.log("no Data for station tracker");
        }
		
		oModel.forEach(function(el){
			
			if ( !oHierachy[el[sGroup]] ) {
				
				oHierachy[el[sGroup]] = {};
			}
			
			if ( !oHierachy[el[sGroup]][el.ata] ) {
				
				oHierachy[el[sGroup]][el.ata] = {};
			}
			
			if ( !oHierachy[el[sGroup]][el.ata][el[sBoxing]] ) {
				
				oHierachy[el[sGroup]][el.ata][el[sBoxing]] = [];
			}
			
			var oOperation = {
					
					"progress" : el.progress,
					"startDate" : el.startDate,
					"endDate" : el.endDate,
			}
			
			oHierachy[el[sGroup]][el.ata][el[sBoxing]].push(oOperation)
			
		})
		
	},
	
}
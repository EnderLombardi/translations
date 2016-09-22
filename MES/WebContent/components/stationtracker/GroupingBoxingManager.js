jQuery.sap.declare("airbus.mes.stationtracker.GroupingBoxingManager")
airbus.mes.stationtracker.GroupingBoxingManager = {
	
	operationHierarchy : {},
	showInitial : false,
	
	jsDateFromDayTimeStr : function(day) {
		
		// return day for IE not working. - 1 on month because 00 = january
		
		return new Date(day.slice(0,4),day.slice(5,7)-1,day.slice(8,10),day.slice(11,13),day.slice(14,16),day.slice(17,19));
		
	},
	
	transformRescheduleDate : function(oDate) {
		var today = oDate;
		var aDate = [];
		
		var sYear = today.getFullYear();
		var sMounth = today.getMonth() + 1;
		var sDay = today.getDate();
		var sSecond =  today.getSeconds();
		var sMinute =  today.getMinutes();
		var sHour =  today.getHours();
	
		aDate.push(sMounth,sDay,sHour,sMinute,sSecond);
		aDate.forEach(function(el,indice){
			if(el<10){aDate[indice] = "0" + el;}
		})
				
		
			var FullTodayDate = sYear + "-" + aDate[0] + "-" + aDate[1] + " " + aDate[2] + ":" +  aDate[3] + ":" + aDate[4];
		
		return FullTodayDate;
	},
	
		
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
			
			if ( !oHierachy[el[sGroup]][el.avlLine] ) {
				
				oHierachy[el[sGroup]][el.avlLine] = {};
			}
			
			if ( !oHierachy[el[sGroup]][el.avlLine][el[sBoxing]] ) {
				
				oHierachy[el[sGroup]][el.avlLine][el[sBoxing]] = [];
			}
			
			var oOperation = {
					
					"criticalPath" : el.criticalPath,
					"progress" : el.progress,
					"avlStartDate" : el.avlStartDate,
					"avlEndDate" : el.avlEndDate,
					"progress" : el.progress,
					"startDate" : el.startDate,
					"endDate" : el.endDate,
			}
			
			oHierachy[el[sGroup]][el.avlLine][el[sBoxing]].push(oOperation)
			
		})
		
	},
	
}
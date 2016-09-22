jQuery.sap.declare("airbus.mes.stationtracker.GroupingBoxingManager")
airbus.mes.stationtracker.GroupingBoxingManager = {
	
	operationHierarchy : {},
	showInitial : false,
	//XXX MEHDI TODO
	group : "" ,
	box : "",
		
		
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
					
					"operationId" : el.operationId,
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
	
	parseOperation : function(sGroup,sBox) {
		
		
		
		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
		
		GroupingBoxingManager.groupingBoxing(sGroup,sBox);
		
		var oModel = GroupingBoxingManager.operationHierarchy;
		aElements2 = []
		aBox = [];
		for( var i in oModel ) { 
			
			//Creation of gantt groups
			var oRecheduleGroup = {
					"open": true,
					"key": airbus.mes.stationtracker.AssignmentManager.idName(i),
					"label" : i,
					"children":[],
			}
				
			aElements2.push(oRecheduleGroup);
			var fGroupIndex = aElements2.indexOf(oRecheduleGroup);
			
			//Creation of initial avl line of the current group
			if (GroupingBoxingManager.showInitial) {
						
			var oInitialGroup = {
											
					"key": "I_" + airbus.mes.stationtracker.AssignmentManager.idName(i),
					"initial":"Initial plan",
			}
							
			aElements2[fGroupIndex].children.unshift(oInitialGroup);
			
			}
			
			for ( var a in oModel[i] ) {
				
				//Creation of avl line of the current group
				var fIndex = aElements2.indexOf(oRecheduleGroup);
				var ochild = {
						
						"hours" : "6.0hrs",
						"subname" : "JJ",
						"name" : "JAE J.",
						"avalLine" : a,
						"key": airbus.mes.stationtracker.AssignmentManager.idName(i) + "_" + airbus.mes.stationtracker.AssignmentManager.idName(a),
				}
				aElements2[fIndex].children.push(ochild);
			
				//Creation data wich represent boxs rescheduling and initial
				for ( var e in oModel[i][a]) {

					var aStartDateRescheduling = [];
					var aEndDateRescheduling = [];
					var aStartDateInitial = [];
					var aEndDateInitial = [];
					var sProgress = "";
					var fCriticalPath = 0;		

					oModel[i][a][e].forEach( function( el ) { 
						
						aStartDateRescheduling.push(Date.parse(GroupingBoxingManager.jsDateFromDayTimeStr(el.startDate)));
						aEndDateRescheduling.push(Date.parse(GroupingBoxingManager.jsDateFromDayTimeStr(el.endDate)));
						aStartDateInitial.push(Date.parse(GroupingBoxingManager.jsDateFromDayTimeStr(el.avlStartDate)));
						aEndDateInitial.push(Date.parse(GroupingBoxingManager.jsDateFromDayTimeStr(el.avlEndDate)));
						sProgress = el.progress;
						fCriticalPath = el.criticalPath;
						sOperationId = el.operationId;
						
					} )
					
					var oOperationRescheduling = {
						
							"criticalPath": fCriticalPath,
							"type":"R",
							"text" : sOperationId,
							"section_id" : 	airbus.mes.stationtracker.AssignmentManager.idName(i) + "_" + airbus.mes.stationtracker.AssignmentManager.idName(a),
							"progress" : sProgress,
							"start_date" : GroupingBoxingManager.transformRescheduleDate(new Date(Math.min.apply(null,aStartDateRescheduling))),
							"end_date" : GroupingBoxingManager.transformRescheduleDate(new Date(Math.max.apply(null,aEndDateRescheduling))),
					}
					
					if (GroupingBoxingManager.showInitial) {
					
					var oOperationInitial = {
						
						"type":"I",
						"text" : sOperationId,
						"section_id" : 	"I_" + airbus.mes.stationtracker.AssignmentManager.idName(i),
						"progress" : sProgress,
						"start_date" : GroupingBoxingManager.transformRescheduleDate(new Date(Math.min.apply(null,aStartDateInitial))),
						"end_date" :GroupingBoxingManager.transformRescheduleDate(new Date(Math.max.apply(null,aEndDateInitial))),
					}
					
					aBox.push(oOperationInitial);
					
					}
					
					aBox.push(oOperationRescheduling);
					
				}
			}
			
		}
		
		 scheduler.matrix['timeline'].y_unit_original = aElements2;
		 scheduler.callEvent("onOptionsLoad", []);
		 
	     scheduler.init(sap.ui.getCore().byId("stationTrackerView").getId() + "--test" ,  new Date(2014,5,30),"timeline");
	     scheduler.clearAll();
	     
	     scheduler.parse(aBox,"json");
		
	}
	
}
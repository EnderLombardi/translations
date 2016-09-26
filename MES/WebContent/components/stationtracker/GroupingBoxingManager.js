jQuery.sap.declare("airbus.mes.stationtracker.GroupingBoxingManager")
airbus.mes.stationtracker.GroupingBoxingManager = {
	
	operationHierarchy : {},
	showInitial : false,
	//XXX MEHDI TODO
	group : "competency" ,
	box : "operationId",
	
	
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
			
			if ( sGroup === "avlLine") {				
			// permit to create only one folder when avl Line is selected.	
				var ssGroup = "AvlLine";
				
			} else {				
			// otherwise create dynamic group.	
				var ssGroup = el[sGroup]
			}
			
			if ( !oHierachy[ssGroup] ) {
				
				oHierachy[ssGroup] = {};
			}
			
			if ( !oHierachy[ssGroup][el.avlLine] ) {
				
				oHierachy[ssGroup][el.avlLine] = {};
			}
			
			if ( !oHierachy[ssGroup][el.avlLine][el[sBoxing]] ) {
				
				oHierachy[ssGroup][el.avlLine][el[sBoxing]] = [];
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
			
			oHierachy[ssGroup][el.avlLine][el[sBoxing]].push(oOperation)
			
		})
		
	},
	
	parseOperation : function(sGroup,sBox) {
		
		
		
		var oGroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
		var oFormatter = airbus.mes.stationtracker.util.Formatter
		
		oGroupingBoxingManager.groupingBoxing(sGroup,sBox);
		
		var oModel = oGroupingBoxingManager.operationHierarchy;
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
			if (oGroupingBoxingManager.showInitial) {
						
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
						
						aStartDateRescheduling.push(Date.parse(oFormatter.jsDateFromDayTimeStr(el.startDate)));
						aEndDateRescheduling.push(Date.parse(oFormatter.jsDateFromDayTimeStr(el.endDate)));
						aStartDateInitial.push(Date.parse(oFormatter.jsDateFromDayTimeStr(el.avlStartDate)));
						aEndDateInitial.push(Date.parse(oFormatter.jsDateFromDayTimeStr(el.avlEndDate)));
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
							"start_date" : oFormatter.transformRescheduleDate(new Date(Math.min.apply(null,aStartDateRescheduling))),
							"end_date" : oFormatter.transformRescheduleDate(new Date(Math.max.apply(null,aEndDateRescheduling))),
					}
					
					if (oGroupingBoxingManager.showInitial) {
					
					var oOperationInitial = {
						
						"type":"I",
						"text" : sOperationId,
						"section_id" : 	"I_" + airbus.mes.stationtracker.AssignmentManager.idName(i),
						"progress" : sProgress,
						"start_date" : oFormatter.transformRescheduleDate(new Date(Math.min.apply(null,aStartDateInitial))),
						"end_date" :oFormatter.transformRescheduleDate(new Date(Math.max.apply(null,aEndDateInitial))),
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
	     
	     scheduler.xy.scroll_width=20;
	     scheduler.parse(aBox,"json");
		
	}
	
}
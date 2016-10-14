jQuery.sap.declare("airbus.mes.stationtracker.GroupingBoxingManager")
airbus.mes.stationtracker.GroupingBoxingManager = {
	
	operationHierarchy : {},
	shiftHierarchy : {},
	shiftNoBreakHierarchy: [],
	showInitial : false,
	//XXX MEHDI TODO
	group : "CPP_CLUSTER" ,
	box : "OPERATION_ID",
	// Group use for special case compute
	specialGroup : "WORKORDER_ID",
	
	parseShift : function()  {
		
	// Tree Shift Model	
	var oHierachy = airbus.mes.stationtracker.GroupingBoxingManager.shiftHierarchy = {};
	var oModelShift = sap.ui.getCore().getModel("shiftsModel");
	var oFormatter = airbus.mes.stationtracker.util.Formatter;
	
	if(oModelShift.getProperty("/Rowsets/Rowset/0/Row")){              
		
		oModelShift = sap.ui.getCore().getModel("shiftsModel").oData.Rowsets.Rowset[0].Row;
		
    } else  {
    	
    	console.log("no shift Data for station tracker");
    };	
	
	oModelShift.forEach(function(el) {
		
		if ( !oHierachy[el.day] ) {
			
			oHierachy[el.day] = {};
		}
		if ( !oHierachy[el.day][el.shiftID] ) {
			
			oHierachy[el.day][el.shiftID] = [];
		}
		
		
		var oShift = {
				
				"beginDateTime" : oFormatter.jsDateFromDayTimeStr(el.beginDateTime),
				"endDateTime" : oFormatter.jsDateFromDayTimeStr(el.endDateTime),
		};
		
		oHierachy[el.day][el.shiftID].push(oShift);
	});
	// Shift Model (without breaks)
	var oHierachy2 = airbus.mes.stationtracker.GroupingBoxingManager.shiftNoBreakHierarchy = [];
	var oFormatter = airbus.mes.stationtracker.util.Formatter;

		for( var i in oHierachy ) { 
			for ( var a in oHierachy[i] ) {
				
				//Creation data wich represent boxs rescheduling and initial
					var aStartDate = [];
					var aEndDate = [];	

					oHierachy[i][a].forEach( function( el ) { 
						
						aStartDate.push(Date.parse(el.beginDateTime));
						aEndDate.push(Date.parse(el.endDateTime));
						
					} )
					
					var oShift = {
						
							"day": i,
							"shiftName":a,
							"StartDate" : new Date(Math.min.apply(null,aStartDate)),
							"EndDate" : new Date(Math.max.apply(null,aEndDate)),
					
					}
					oHierachy2.push(oShift);
			}
			
		};
	},
	
	groupingBoxing : function(sGroup,sBoxing) {
		
		airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy = {};
//		var oHierachy = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy;
		var oModel = sap.ui.getCore().getModel("stationTrackerRModel");
		var oModelI = sap.ui.getCore().getModel("stationTrackerIModel");
		
		// check if model full or not
		if(oModel.getProperty("/Rowsets/Rowset/0/Row")){              
			
			oModel = sap.ui.getCore().getModel("stationTrackerRModel").oData.Rowsets.Rowset[0].Row;
			
        } else  {
        	oModel = []
        	console.log("no Rescheduled operation load");
        }
		
		if(oModelI.getProperty("/Rowsets/Rowset/0/Row")){              
			
			oModelI = sap.ui.getCore().getModel("stationTrackerIModel").oData.Rowsets.Rowset[0].Row;
			
        } else  {
        	
        	oModelI = [];
        	console.log("no Initial operation load");
        }
		if ( airbus.mes.stationtracker.GroupingBoxingManager.showInitial ) {
			
			this.computeOperationHierarchy(oModelI,sGroup,sBoxing,"I");
			this.computeOperationHierarchy(oModel,sGroup,sBoxing);
		} else {
			
			this.computeOperationHierarchy(oModel,sGroup,sBoxing);
		}
		
	},
	
	computeOperationHierarchy : function(oModel,sGroup,sBoxing,sInitial) {
		
		var oHierachy = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy;
		var oFormatter = airbus.mes.stationtracker.util.Formatter;
		var oShiftManager = airbus.mes.stationtracker.ShiftManager;
		var aItems = airbus.mes.stationtracker.oView.byId("selectProductionGroup").getSelectedKeys();
		
		oModel.forEach(function(el){
			
			if ( sGroup === "avlLine") {				
			// permit to create only one folder when avl Line is selected.	
				var ssGroup = "AvlLine";
				
			} else {				
			// otherwise create dynamic group.	
				var ssGroup = el[sGroup]
			}
			
			// permit to create initial AVL line
			if (sInitial) {
				
				var ssAvLine = "I_" +  el.AVL_LINE;
			} else {
				
				var ssAvLine = el.AVL_LINE;
			}
		
			//if ( airbus.mes.stationtracker.ShiftManager.dayDisplay ) {
			//permit to DO THE boxing on the only corresponding shift selected in day mode
			var oShift = airbus.mes.stationtracker.ShiftManager.shifts[airbus.mes.stationtracker.ShiftManager.closestShift(oFormatter.jsDateFromDayTimeStr(el.START_TIME))]; 
			//console.log(oShift);
						
			var ssBox = el[sBoxing] + "_" + oShift.day + "-" + oShift.shiftName;
			
		
//			} else {
//				
//				var ssBox = el[sBoxing];
//				
//			}
			
			
//			if (sInitial) {
//				
//				var sInitial = "initial";
//			} else {
//				
//				var sInitial  = "reschedule";
//			}
//			
			if ( !oHierachy[ssGroup] ) {
				
				oHierachy[ssGroup] = {};
			}
			
			if ( !oHierachy[ssGroup][ssAvLine] ) {
				
				oHierachy[ssGroup][ssAvLine] = {};
			}
			
			if ( !oHierachy[ssGroup][ssAvLine][ssBox] ) {
				
				oHierachy[ssGroup][ssAvLine][ssBox] = [];
			}
			
//			Check curren production group corresponds to production group filter 			
			if(!aItems.includes(el.PROD_GROUP)){
				return;
			}
			
			
			var oOperation = {
										
					"shopOrder" : el.WORKORDER_ID, // workOrder
					"shopOrderDescription": el.WORKORDER_DESCRIPTION,
					"operationId" : el.OPERATION_ID,
					"operationDescription" : el.OPERATION_DESCRIPTION,
					"totalDuration": el.DURATION,
					"progress" : el.PROGRESS,
					//"certification": el.certification,
					"startDate" : el.START_TIME,
					"endDate" : el.END_TIME,
					"status": el.STATE,
					//"disruptions": el.disruptions,
					"andons": el.ANDONS,
					"routingMaturityAssessment": el.ROUTING_MATURITY_ACCESSMENT,
					//"ata": el.ata,
					//"familyTarget": el.familyTarget,
					"cppCluster" : el.CPP_CLUSTER,
					//"workPackage" : el.workPackage,
					//"avlPath1": el.avlPath1,
					//"avlPath2": el.avlPath2,
					"criticalPath" : el.CRITICAL_PATH,
					//"avlStartDate" : el.avlStartDate,
					//"avlEndDate" : el.avlEndDate,
					"avlLine": el.AVL_LINE,
					"productionGroup":el.PROD_GROUP,
					//"competency": el.competency,
					//"rescheduledStarDate": el.rescheduledStarDate,
					//"rescheduledEndDate": el.rescheduledEndDate,
					//"rescheduledLine": el.rescheduledLine,
					//"initial" : sInitial,
					
			};
			
			oHierachy[ssGroup][ssAvLine][ssBox].push(oOperation)
			
		})
		
	},
	
	parseOperation : function(sGroup,sBox) {
		
		
		var t0 = performance.now();
		
	
		var oGroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
		var oFormatter = airbus.mes.stationtracker.util.Formatter;
		
		oGroupingBoxingManager.groupingBoxing(sGroup,sBox);
		
	    var oModelAffectation = sap.ui.getCore().getModel("affectationModel");
		var oModel = oGroupingBoxingManager.operationHierarchy;
		aElements2 = []
		aBox = [];
		//for( var i in oModel ) 
		
		Object.keys(oModel).forEach(function(key,index) { 
			
			//Creation of gantt groups
			//chexk if it is avl Initial or rechedule
						
			var oRecheduleGroup = {
					
					"open": true,
					"key": airbus.mes.stationtracker.AssignmentManager.idName(key),
					"label" : key,
					"children":[],
			}
				
			aElements2.push(oRecheduleGroup);
			var fGroupIndex = aElements2.indexOf(oRecheduleGroup);
			
			
			//Creation of initial avl line of the current group
//			if (oGroupingBoxingManager.showInitial) {
						
//			var oInitialGroup = {
//											
//					"key": "I_" + airbus.mes.stationtracker.AssignmentManager.idName(i),
//					"initial":"Initial plan",
//			}
							
//			aElements2[fGroupIndex].children.unshift(oInitialGroup);
			
		//	}
			
			//for ( var a in oModel[key] ) 
			Object.keys(oModel[key]).forEach(function(key1,index) {
				
				//Creation of avl line of the current group
				var fIndex = aElements2.indexOf(oRecheduleGroup);
				
				if ( key1.slice(0,2) === "I_" ) {
					
					var oInitialGroup = {
								
							"key": "I_" + airbus.mes.stationtracker.AssignmentManager.idName(key) + "_" + airbus.mes.stationtracker.AssignmentManager.idName(key1),
							"initial":"Initial plan",
						}
				
					aElements2[fGroupIndex].children.unshift(oInitialGroup);
						
					} else {
				
				
				var ochild = {
						
						"hours" : "6.0hrs",
						"subname" : "JJ",
						"name" : "JAE J.",
						"avlLine" : key1,
						"key": airbus.mes.stationtracker.AssignmentManager.idName(key) + "_" + airbus.mes.stationtracker.AssignmentManager.idName(key1),
				}
				aElements2[fIndex].children.push(ochild);
					}
				//Creation data wich represent boxs rescheduling and initial
				//for ( var e in oModel[key][key1]) 
					Object.keys(oModel[key][key1]).forEach(function(key2,index) {

					var aStartDateRescheduling = [];
					var aEndDateRescheduling = [];
					var aStartDateInitial = [];
					var aEndDateInitial = [];
					var aDisruptions = [];
					var aAndons = [];
					var aTotalDuration = [];
					
					var sProgress = "";
					var fCriticalPath = 0;		
					var sOperationDescription = "";
					var sStatus = "";
				;
					
					oModel[key][key1][key2].forEach( function( el ) { 
						
						aStartDateRescheduling.push(Date.parse(oFormatter.jsDateFromDayTimeStr(el.startDate)));
						aEndDateRescheduling.push(Date.parse(oFormatter.jsDateFromDayTimeStr(el.endDate)));
						//aStartDateInitial.push(Date.parse(oFormatter.jsDateFromDayTimeStr(el.avlStartDate)));
						//aEndDateInitial.push(Date.parse(oFormatter.jsDateFromDayTimeStr(el.avlEndDate)));
						aDisruptions.push(el.disruptions);
						aAndons.push(el.andons);
						aTotalDuration.push( el.totalDuration );
						
						sProgress = el.progress;
						fCriticalPath = el.criticalPath;
						sOperationDescription = el.sBox;
						sStatus = el.status;
						
						if ( sBox === oGroupingBoxingManager.specialGroup) {
							
							sOperationDescription = el.shopOrderDescription;
							
						}
						
						if ( sBox === "OPERATION_ID") {
							
							sOperationDescription = el.operationDescription;
							
						}
						
						sOperationId = el.operationId;
						
					} )
					
					if (  key1.slice(0,2) === "I_" ) {
						var oOperationInitial = {
								
								"box" : key2,
								"group" : key,
								"avlLine" : key1,
								"type":"I",
								"text" : sOperationDescription,
								"section_id" : 	"I_" + airbus.mes.stationtracker.AssignmentManager.idName(key) + "_" + airbus.mes.stationtracker.AssignmentManager.idName(key1),
								"progress" : sProgress,
								"start_date" : new Date(Math.min.apply(null,aStartDateRescheduling)),
								"end_date" : oFormatter.sizeMin(new Date(Math.max.apply(null,aEndDateRescheduling)),new Date(Math.min.apply(null,aStartDateRescheduling))),
							}
						
						aBox.push(oOperationInitial);
						
					} else {
					
					var oOperationRescheduling = {
							
							"status" : sStatus,
							"totalDuration" : (aTotalDuration.reduce(function(pv, cv) { return pv + cv; }, 0))/aTotalDuration.length, 
							"box" : key2,
							"avlLine" : key1,
							"group" : key,
							"andon" : Math.max.apply(null,aAndons),
							"blocked" : Math.max.apply(null,aDisruptions),
							"criticalPath": fCriticalPath,
							"type":"R",
							"text" : sOperationDescription,
							"section_id" : 	airbus.mes.stationtracker.AssignmentManager.idName(key) + "_" + airbus.mes.stationtracker.AssignmentManager.idName(key1),
							"progress" : sProgress,
							"start_date" : new Date(Math.min.apply(null,aStartDateRescheduling)),
							"end_date" :  oFormatter.sizeMin(new Date(Math.max.apply(null,aEndDateRescheduling)),new Date(Math.min.apply(null,aStartDateRescheduling))),
						}
					
					aBox.push(oOperationRescheduling);
					
					}
//					if (oGroupingBoxingManager.showInitial) {
//					
//					var oOperationInitial = {
//						
//						"type":"I",
//						"text" : sOperationDescription,
//						"section_id" : 	"I_" + airbus.mes.stationtracker.AssignmentManager.idName(i),
//						"progress" : sProgress,
//						"start_date" : new Date(Math.min.apply(null,aStartDateInitial)),
//						"end_date" : new Date(Math.max.apply(null,aEndDateInitial)),
//					}
//					
//					aBox.push(oOperationInitial);
					
				//	}
					
					
					
				})
			})
			
		})
		
		var t1 = performance.now();
		console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
		
		scheduler.matrix['timeline'].y_unit_original = aElements2;
		scheduler.callEvent("onOptionsLoad", []);
		var ShiftManager = airbus.mes.stationtracker.ShiftManager;
		
		if (ShiftManager.current_Date != undefined) {
			scheduler.init(sap.ui.getCore().byId("stationTrackerView").getId() + "--test", new Date(
					ShiftManager.currentFullDate), "timeline");
		} else {
			scheduler.init(sap.ui.getCore().byId("stationTrackerView").getId() + "--test", new Date("04/10/2016"),
					"timeline");
		};
		
		scheduler.clearAll();
		scheduler.deleteMarkedTimespan();
		// Display all marker
	    airbus.mes.stationtracker.ShiftManager.addMarkedShifts();
	    
	    if ( airbus.mes.stationtracker.ShiftManager.dayDisplay ) {
	    
	    airbus.mes.stationtracker.ShiftManager.ShiftMarkerID = scheduler.addMarkedTimespan({  
			start_date: airbus.mes.stationtracker.ShiftManager.ShiftSelectedStart,
			end_date: airbus.mes.stationtracker.ShiftManager.ShiftSelectedEnd,
		    css:   "shiftCss",
		});
	    
	    }
	    
	    scheduler.xy.scroll_width=20;
	    scheduler.parse(aBox,"json");
	    
	}
	
}

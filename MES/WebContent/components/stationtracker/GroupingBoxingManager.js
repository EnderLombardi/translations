jQuery.sap.declare("airbus.mes.stationtracker.GroupingBoxingManager")
airbus.mes.stationtracker.GroupingBoxingManager = {
	
	operationHierarchyDelay : {},
	operationHierarchy : {},
	shiftHierarchy : {},
	shiftNoBreakHierarchy: [],
	shiftBreakHierarchy: [],
	showInitial : false,
//	Define start and end date of the scheduler
	minDate: undefined,
	maxDate: undefined,
	
	group : "COMPETENCY" ,
	box : "OPERATION_ID",
	// Group use for special case compute
	specialGroup : "WORKORDER_ID",
	
	parseShift : function()  {
		
	// Tree Shift Model	
	var oHierachy = airbus.mes.stationtracker.GroupingBoxingManager.shiftHierarchy = {};
	var aShiftBreak = airbus.mes.stationtracker.GroupingBoxingManager.shiftBreakHierarchy = [];
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
				"shiftName" : el.shiftName,
				"StartDate" : oFormatter.jsDateFromDayTimeStr(el.beginDateTime),
				"EndDate" : oFormatter.jsDateFromDayTimeStr(el.endDateTime),
		};
		
		oHierachy[el.day][el.shiftID].push(oShift);
		aShiftBreak.push(oShift);
		
	});
	// Shift Model (without breaks)
	var oHierachy2 = airbus.mes.stationtracker.GroupingBoxingManager.shiftNoBreakHierarchy = [];
	var oFormatter = airbus.mes.stationtracker.util.Formatter;

	
		for( var i in oHierachy ) { 
			for ( var a in oHierachy[i] ) {
				
				//Creation data which represent boxes rescheduling and initial
					var aStartDate = [];
					var aEndDate = [];
					var shiftName = "";

					oHierachy[i][a].forEach( function( el ) { 
						
						aStartDate.push(Date.parse(el.StartDate));
						aEndDate.push(Date.parse(el.EndDate));
						shiftName = el.shiftName;
					} )
					
					var startDate = new Date(Math.min.apply(null,aStartDate));
					var endDate = new Date(Math.max.apply(null,aEndDate));
					
					var oShift = {
							"shiftName" : shiftName,
							"day": i,
							"shiftID":a,
							"StartDate" : new Date(Math.min.apply(null,aStartDate)),
							"EndDate" : new Date(Math.max.apply(null,aEndDate)),
					
					}
					oHierachy2.push(oShift);
					
					this.fillStartDate(startDate);
					this.fillEndDate(endDate);
			}
			
		};
	},
	
	fillStartDate : function(oStartDate){
		if(this.minDate === undefined) {
			this.minDate = oStartDate;
			
		} else if (this.minDate > oStartDate) {
			this.minDate = oStartDate;
			
		}
	},

	fillEndDate : function(oEndDate){
		if(this.maxDate === undefined) {
			this.maxDate = oEndDate;
			
		} else if (this.maxDate < oEndDate) {
			this.maxDate = oEndDate;
			
		}
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
		var oHierarchyDelay = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchyDelay;
		var oFormatter = airbus.mes.stationtracker.util.Formatter;

		oModel.forEach(function(el){
	
			if ( sGroup === "AVL_LINE") {				
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
					
			//permit to DO THE boxing on the only corresponding shift selected in day mode
			if ( airbus.mes.stationtracker.ShiftManager.closestShift(oFormatter.jsDateFromDayTimeStr(el.START_TIME)) != -1 ) {
			
				var oShift = airbus.mes.stationtracker.ShiftManager.shifts[airbus.mes.stationtracker.ShiftManager.closestShift(oFormatter.jsDateFromDayTimeStr(el.START_TIME))]; 
			
			} else {
				
				console.log("operation is not in the shift");
				var oShift = "";
				
			}
						
			var ssBox = el[sBoxing] + "_"  + el["WORKORDER_ID"] + "_" + oShift.day + "-" + oShift.shiftName;
						
			if ( !oHierachy[ssGroup] ) {
				
				oHierachy[ssGroup] = {};
				oHierarchyDelay[ssGroup]= {};
			}
			
			if ( !oHierachy[ssGroup][ssAvLine] ) {
				
				oHierachy[ssGroup][ssAvLine] = {};
				oHierarchyDelay[ssGroup][ssAvLine] = { "progress" : 0 ,"duration" : 0 };
			}
			
			if ( !oHierachy[ssGroup][ssAvLine][ssBox] ) {
				
				oHierachy[ssGroup][ssAvLine][ssBox] = [];
				
			}
			
////			Check curren production group corresponds to production group filter 			
//			if(!aItems.includes(el.PROD_GROUP)){
//				return;
//			}
			
			var sPaused = "0";
			// Operation is active	

			if (  el.PAUSED === "false") {
				
				var sPaused = "2";
			}
					
			// Operation is not started
			if ( el.PAUSED === "---" ) {
				
				var sPaused = "1";
				
				// Operation is pause	
				if ( el.PAUSED === "---" && el.PROGRESS != "0" ) {
					
					var sPaused = "3";
				}	
			
			}
									
			// Operation Completed
			if ( el.STATE === "C" ) {
				
				var sPaused = "0";
			}	
				
			var oOperation = {
										
					"WORKORDER_ID" : el.WORKORDER_ID, // workOrder
					"WORKORDER_DESCRIPTION": el.WORKORDER_DESCRIPTION,
					"OPERATION_ID" : el.OPERATION_ID,
					"OPERATION_DESCRIPTION" : el.OPERATION_DESCRIPTION,
					"DURATION": el.DURATION,
					"PROGRESS" : el.PROGRESS,
					//"certification": el.certification,
					"START_TIME" : el.START_TIME,
					"END_TIME" : el.END_TIME,
					"STATE": el.STATE,
					//"disruptions": el.disruptions,
					"ANDONS": el.ANDONS,
					"RMA_STATUS_COLOR": el.RMA_STATUS_COLOR,
					"paused" : sPaused,
					//"ata": el.ata,
					//"familyTarget": el.familyTarget,
					"CPP_CLUSTER" : el.CPP_CLUSTER,
					"WORK_PACKAGE" : el.WORK_PACKAGE,
					//"avlPath1": el.avlPath1,
					//"avlPath2": el.avlPath2,
					"CRITICAL_PATH" : el.CRITICAL_PATH,
					//"avlStartDate" : el.avlStartDate,
					//"avlEndDate" : el.avlEndDate,
					"AVL_LINE": el.AVL_LINE,
					"PROD_GROUP":el.PROD_GROUP,
					"SFC_STEP_REF":el.SFC_STEP_REF,
					"SHOP_ORDER_BO":el.SHOP_ORDER_BO,
					"PP_STATION":el.PP_STATION,
					"OPERATION_BO": el.OPERATION_BO
					//"competency": el.competency,
					//"rescheduledStarDate": el.rescheduledStarDate,
					//"rescheduledEndDate": el.rescheduledEndDate,
					//"rescheduledLine": el.rescheduledLine,
					//"initial" : sInitial,
					
		
					
			};
			
			oHierachy[ssGroup][ssAvLine][ssBox].push(oOperation)
			
			if ( oFormatter.jsDateFromDayTimeStr(el.END_TIME) < new Date() ) {
						
				oHierarchyDelay[ssGroup][ssAvLine].duration += el.DURATION;
				
			}
			
			oHierarchyDelay[ssGroup][ssAvLine].progress += el.PROGRESS;	
			
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
			
			Object.keys(oModel[key]).forEach(function(key1,index) {
				
				//Creation of avl line of the current group
				var fIndex = aElements2.indexOf(oRecheduleGroup);
				
				if ( key1.slice(0,2) === "I_" ) {
					
					var oInitialGroup = {
							"group" : key,
							"avlLine" : key1,
							"key": "I_" + airbus.mes.stationtracker.AssignmentManager.idName(key) + "_" + airbus.mes.stationtracker.AssignmentManager.idName(key1),
							"initial": "<i>As Planned</i>",
						}
				
				// find index of initial avl line in the current group corresponding to the reschedule avlLine	
					var fIndex = aElements2[fGroupIndex].children.map(function(x) {return x.avlLine; }).indexOf(key1.slice(2)); 
					if (fIndex >= 0 )	 {
				
				// Add in aElements2 the initial avlLine just before the rescheduled corresponding avl to have the correct display order
					aElements2[fGroupIndex].children.splice(fIndex, 0, oInitialGroup );
					} else {
					
						console.log( "no avlLine initial corresponding to RESCHEDULED AVLlINE,avline inserted first");
						aElements2[fGroupIndex].children.splice(0, 0, oInitialGroup );
					}
				} else {
				
				
				var ochild = {
						"group" : key,
						"rescheduled" : "R",			
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
					var sPaused = [];
					
					var fProgress = 0;
					var fDuration = 0;
									
					var sShopOrderDescription = "";
					var sWORKORDER_ID = "";
					var sOperationDescription = "";
					var sOperationId = "";
					var sRoutingMaturityAssessment = "";
					var fCriticalPath = 0;		
					var sOperationDescription = "";
					var sStatus = "";
					var sRmaStatus = "";
					
				;
					
					oModel[key][key1][key2].forEach( function( el ) { 
						
						//Store in array value needed to be compare in case of boxing
						aStartDateRescheduling.push(Date.parse(oFormatter.jsDateFromDayTimeStr(el.START_TIME)));
						aEndDateRescheduling.push(Date.parse(oFormatter.jsDateFromDayTimeStr(el.END_TIME)));
						aDisruptions.push(el.disruptions);
						aAndons.push(el.ANDONS);
						aTotalDuration.push( el.DURATION );
						sPaused.push(el.paused);
						
						fProgress += parseFloat(el.PROGRESS);
						fDuration += parseFloat(el.DURATION);
									
						sShopOrderDescription = el.WORKORDER_DESCRIPTION;
						sShopOrder = el.WORKORDER_ID;
						sOperationDescription = el.OPERATION_DESCRIPTION;
						sOperationId = el.OPERATION_ID;
						fCriticalPath = el.CRITICAL_PATH;
						sOperationDescription = el.sBox;
						sStatus = el.STATE;
						sRmaStatus = el.RMA_STATUS_COLOR
					

						
						if ( sBox === oGroupingBoxingManager.specialGroup) {
							
							sOperationDescription = el.WORKORDER_DESCRIPTION;
							
						}
						
						if ( sBox === "OPERATION_ID") {
							
							sOperationDescription = el.OPERATION_DESCRIPTION;
							
						}
						
						sOperationId = el.OPERATION_ID;
						
					} )
					
					if (  key1.slice(0,2) === "I_" ) {
						var oOperationInitial = {
								
								"operationId" : sOperationId,
								"operationDescription" : sOperationDescription,
								"shopOrder" : sShopOrder,
								"rmaStatus" : sRmaStatus,
								"shopOrderDescription" : sShopOrderDescription,
								// This is the real value of boxing 
								"realValueBox" : key2.split("_")[0],
								"box" : key2,
								"group" : key,
								"avlLine" : key1,
								"type":"I",
								"text" : sOperationDescription,
								"section_id" : 	"I_" + airbus.mes.stationtracker.AssignmentManager.idName(key) + "_" + airbus.mes.stationtracker.AssignmentManager.idName(key1),
								"progress" : fProgress.toString(),
								"start_date" : new Date(Math.min.apply(null,aStartDateRescheduling)),
								"end_date" : oFormatter.sizeMin(new Date(Math.max.apply(null,aEndDateRescheduling)),new Date(Math.min.apply(null,aStartDateRescheduling))),
							}
						
						aBox.push(oOperationInitial);
						
					} else {
					
						var oOperationRescheduling = {
							
							"operationId" : sOperationId,
							"operationDescription" : sOperationDescription,
							"shopOrder" : sShopOrder,
							"shopOrderDescription" : sShopOrderDescription,
							"rmaStatus" : sRmaStatus,
							"paused" : Math.max.apply(null,sPaused),
							"status" : sStatus,
							"totalDuration" : fDuration.toString(), 
							// This is the real value of boxing 
							"realValueBox" : key2.split("_")[0],
							"box" : key2,
							"avlLine" : key1,
							"group" : key,
							"andon" : Math.max.apply(null,aAndons),
							"blocked" : Math.max.apply(null,aDisruptions),
							"criticalPath": fCriticalPath,
							"type":"R",
							"text" : sOperationDescription,
							"section_id" : 	airbus.mes.stationtracker.AssignmentManager.idName(key) + "_" + airbus.mes.stationtracker.AssignmentManager.idName(key1),
							"progress" : fProgress.toString(),
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
//						"START_TIME" : sProgress,
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
			scheduler.init( airbus.mes.stationtracker.oView.byId("stationtracker").getId() , new Date( ShiftManager.currentFullDate), "timeline");
		} else if ( airbus.mes.stationtracker.ShiftManager.closestShift(new Date()) != -1 ){
			
			var fShiftIndex = airbus.mes.stationtracker.ShiftManager.closestShift(new Date());
			scheduler.init( airbus.mes.stationtracker.oView.byId("stationtracker").getId() ,airbus.mes.stationtracker.ShiftManager.shifts[fShiftIndex].StartDate , "timeline");		
		
		} else{
			
			scheduler.init(airbus.mes.stationtracker.oView.byId("stationtracker").getId(), airbus.mes.stationtracker.ShiftManager.shifts[airbus.mes.stationtracker.ShiftManager.shifts.length -1 ].StartDate , "timeline");
			
		};
		
		scheduler.clearAll();
		scheduler.deleteMarkedTimespan();
		// Display all marker
	    airbus.mes.stationtracker.ShiftManager.addMarkedShifts();
	    

	    if (airbus.mes.stationtracker.ShiftManager.dayDisplay) {
			airbus.mes.stationtracker.oView.getController().changeShift();
		}
	    scheduler.xy.scroll_width=20;
	    airbus.mes.stationtracker.oView.byId("stationtracker").setBusy(false);
	    scheduler.parse(aBox,"json");
	    
	
	    
	}
	
}

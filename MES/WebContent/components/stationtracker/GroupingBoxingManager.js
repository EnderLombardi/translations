"use strict";

jQuery.sap.declare("airbus.mes.stationtracker.GroupingBoxingManager")
airbus.mes.stationtracker.GroupingBoxingManager	 = {
	
	operationHierarchyDelay : {},
	operationHierarchy : {},
	shiftHierarchy : {},
	shiftNoBreakHierarchy: [],
	shiftBreakHierarchy: [],
	showInitial : false,
//	Define start and end date of the scheduler
	minDate: undefined,
	maxDate: undefined,
	
	//Default value grouping boxing
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
		oModelShift.forEach(function(el) {
		
				el.day = el.day.replace(/-/g,"");
			
		})
	
    } else  { 	
    console.log("no shift Data for station tracker");
    oModelShift = [];
    }
	
	oModelShift.forEach(function(el) {
		
		if ( !oHierachy[el.day] ) {
			
			oHierachy[el.day] = {};
		}
		if ( !oHierachy[el.day][el.shiftName + el.day] ) {
			
			oHierachy[el.day][el.shiftName + el.day] = [];
		}
		
		var oShift = {
				"shiftName" : el.shiftName,
				"StartDate" : oFormatter.jsDateFromDayTimeStr(el.beginDateTime),
				"EndDate" : oFormatter.jsDateFromDayTimeStr(el.endDateTime),
		};
		
		oHierachy[el.day][el.shiftName + el.day].push(oShift);
		aShiftBreak.push(oShift);
		
	});
	// Shift Model (without breaks)
	var oHierachy2 = airbus.mes.stationtracker.GroupingBoxingManager.shiftNoBreakHierarchy = [];
	
		for( var i in oHierachy ) { 
			for ( var a in oHierachy[i] ) {
				
				//Creation data which represent boxes rescheduling and initial
					var aStartDate = [];
					var aEndDate = [];
					var shiftName = "";

					oHierachy[i][a].forEach( function( el ) { 
						
						aStartDate.push(Date.parse(el.StartDate ));
						aEndDate.push(Date.parse(el.EndDate ));
						shiftName = el.shiftName;
					} );
					
					var startDate = new Date(Math.min.apply(null,aStartDate));
					var endDate = new Date(Math.max.apply(null,aEndDate));
					
					var oShift = {
							"shiftName" : shiftName,
							"day": i,
							"shiftID":a,
							"StartDate" : new Date(Math.min.apply(null,aStartDate)),
							"EndDate" : new Date(Math.max.apply(null,aEndDate)),
					
					};
					oHierachy2.push(oShift);
					
					// Permit to define the range of datepicker selection day
					this.fillStartDate(startDate);
					this.fillEndDate(endDate);
			}
			
		}
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

		var aModel = sap.ui.getCore().getModel("stationTrackerRModel");
		var aModelI = sap.ui.getCore().getModel("stationTrackerIModel");
		
		// check if model full or not
		if (aModel.getProperty("/Rowsets/Rowset/0/Row")) {              
			
			aModel = sap.ui.getCore().getModel("stationTrackerRModel").oData.Rowsets.Rowset[0].Row;
			
        } else  {
        aModel = [];
        console.log("no Rescheduled operation load");
        }
		
		if(aModelI.getProperty("/Rowsets/Rowset/0/Row")){              
			
			aModelI = sap.ui.getCore().getModel("stationTrackerIModel").oData.Rowsets.Rowset[0].Row;
			
        } else  {	
        aModelI = [];
        console.log("no Initial operation load");
        }
		//if ( airbus.mes.stationtracker.GroupingBoxingManager.showInitial ) {
			
			
			this.computeOperationHierarchy(aModelI,sGroup,sBoxing,"I");
			this.computeOperationHierarchy(aModel,sGroup,sBoxing);
			
		//} else {
			
		//	this.computeOperationHierarchy(aModel,sGroup,sBoxing);
		//}
		
	},
	
	computeOperationHierarchy : function(oModel,sGroup,sBoxing,sInitial) {
		
		var oHierachy = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy;
		var oHierarchyDelay = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchyDelay;
		var oFormatter = airbus.mes.stationtracker.util.Formatter;

		oModel.forEach(function(el){
			
			var ssAvLine;
			var ssGroup;
			var oShift;
			
			if ( sGroup === "AVL_LINE") {				
			// permit to create only one folder when avl Line is selected.	
				ssGroup = "AvlLine";	
			} else {				
			// otherwise create dynamic group.	
				ssGroup = el[sGroup];
			}
			
			// permit to create initial AVL line
			if (sInitial) {
				ssAvLine = "I_" +  el.AVL_LINE 	+ "_" + el.SKILLS;
			} else {
				ssAvLine = el.AVL_LINE + "_" + el.SKILLS;
			}
					
			//permit to DO THE boxing on the only corresponding shift selected in day mode
			if ( airbus.mes.stationtracker.ShiftManager.closestShift(oFormatter.jsDateFromDayTimeStr(el.START_TIME)) != -1 ) {
				oShift = airbus.mes.stationtracker.ShiftManager.shifts[airbus.mes.stationtracker.ShiftManager.closestShift(oFormatter.jsDateFromDayTimeStr(el.START_TIME))]; 
			} else {
				console.log("operation is not in the shift");
				oShift = "";
			}
						
			var ssBox = el[sBoxing] + "_"  + el["WORKORDER_ID"] + "_" + oShift.shiftID;
						
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
			
			var sStatus = "0";
			var fOSW = "0";
			var fRMA = "0";
			var sUnplanned = "0";

			
			// Operation is active	
			if (  el.PAUSED === "false") {
				sStatus = "2";
			}		
			// Operation is not started
			if ( el.PAUSED === "---" ) {
				sStatus = "1";
				// Operation is pause	
				if ( el.PAUSED === "---" && el.PREVIOUSLY_STARTED === "true" ) {
						sStatus = "3";
					}	
			}				
			// Operation Completed
			if ( el.STATE === "C" ) {
				sStatus = "0";
			}
			//Opened Blocking and Escalated disruption
			if ( el.DISRUPTION === "D1") {
				sStatus = "4";
			}
			//Opened Blocking disruption
			if ( el.DISRUPTION === "D2") {
				sStatus = "5";
			}
			//Solved Blocking and Escalated disruption
			if ( el.DISRUPTION === "D3") {
				sStatus = "6";
			}
			//Solved Blocking disruption
			if ( el.DISRUPTION === "D4") {
				sStatus = "7";
			}
			//andon
			/*if ( el.DISRUPTION === "B") {
				sStatus = "99";
			}*/
			// Operation is from OSW
			if ( el.EXECUTION_STATION_SOURCE[0] === "3" ) {
				fOSW = "3";
			}
			// Operation is from unplanned
			if ( el.EXECUTION_STATION_SOURCE[0] === "1" ) {
				sUnplanned = "1";
			}
			// Maturity
			if ( el.RMA_STATUS_COLOR != "---" ) {
				fRMA = "1";		
			}
				
			var oOperation = {		
					
					"WORKORDER_ID" : el.WORKORDER_ID, // workOrder
					"WORKORDER_DESCRIPTION": el.WORKORDER_DESCRIPTION,
					"OPERATION_ID" : el.OPERATION_ID,
					"OPERATION_DESCRIPTION" : el.OPERATION_DESCRIPTION,
					"DURATION": el.DURATION,
					"PROGRESS" : el.PROGRESS,
					"SFC" : el.SFC,//"certification": el.certification,
					"START_TIME" : el.START_TIME,
					"END_TIME" : el.END_TIME,
					"STATE": el.STATE,
					"ANDONS": el.ANDONS,
					"RMA_STATUS_COLOR": fRMA,
					"status" : sStatus,
					"ISUNPLANNED" : sUnplanned,
					"CPP_CLUSTER" : el.CPP_CLUSTER,
					"WORK_PACKAGE" : el.WORK_PACKAGE,
					"CRITICAL_PATH" : el.CRITICAL_PATH,
					"EXECUTION_STATION_SOURCE" : fOSW,
					"AVL_LINE": el.AVL_LINE,
					"PROD_GROUP":el.PROD_GROUP,
					"SFC_STEP_REF":el.SFC_STEP_REF,
					"SHOP_ORDER_BO":el.SHOP_ORDER_BO,
					"PP_STATION":el.PP_STATION,
					"OPERATION_BO": el.OPERATION_BO,
					"SKILLS" : el.SKILLS,
					"PREVIOUSLY_STARTED" : el.PREVIOUSLY_STARTED,
					"DISRUPTION" : el.DISRUPTION,
					"OSW" : el.OSW,
					"ERP_SYSTEM" : el.ERP_SYSTEM,
					"PAUSED" : el.PAUSED
			
			};
			
			
			oHierachy[ssGroup][ssAvLine][ssBox].push(oOperation);
			
			if ( oFormatter.jsDateFromDayTimeStr(el.END_TIME) < new Date() ) {		
				oHierarchyDelay[ssGroup][ssAvLine].duration += parseFloat(el.DURATION);
			}
			oHierarchyDelay[ssGroup][ssAvLine].progress += parseFloat(el.PROGRESS);	
		});
	},
	
	parseOperation : function(sGroup,sBox) {		
//		var t0 = performance.now();	not used
		var oGroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
		var oFormatter = airbus.mes.stationtracker.util.Formatter;
		
		oGroupingBoxingManager.groupingBoxing(sGroup,sBox);
		
	    //var oModelAffectation = sap.ui.getCore().getModel("affectationModel");
		var oModel = oGroupingBoxingManager.operationHierarchy;
		var aElements2 = [];
		var aBox = [];
		//for( var i in oModel ) 
		
		Object.keys(oModel).forEach(function(key,index) { 
			
			//Creation of Gantt groups
			//Check if it is AVL Initial or Rechedule
						
			var oRecheduleGroup = {
					
					"open": true,
					"key": airbus.mes.stationtracker.AssignmentManager.idName(key),
					"label" : key,
					"children":[],
			};
				
			aElements2.push(oRecheduleGroup);
			var fGroupIndex = aElements2.indexOf(oRecheduleGroup);
	
			Object.keys(oModel[key]).sort().forEach(function(key1){
						
				//Creation of avl line of the current group
				var fIndex = aElements2.indexOf(oRecheduleGroup);
			
				if ( key1.slice(0,2) === "I_" &&  airbus.mes.stationtracker.GroupingBoxingManager.showInitial ) {
					
					var oInitialGroup = {
							"group" : key,
							"avlLine" : key1,
							"key": "I_" + airbus.mes.stationtracker.AssignmentManager.idName(key) + "_" + airbus.mes.stationtracker.AssignmentManager.idName(key1),
							"initial": "<i>As Planned</i>",
						};
				
				// find index of initial avl line in the current group corresponding to the reschedule avlLine	
					fIndex = aElements2[fGroupIndex].children.map(function(x) {return x.avlLine; }).indexOf(key1.slice(2)); 
					if (fIndex >= 0 )	 {
				
				// Add in aElements2 the initial avlLine just before the rescheduled corresponding avl to have the correct display order
					aElements2[fGroupIndex].children.splice(fIndex, 0, oInitialGroup );
					} else {
					
						console.log( "no avlLine initial corresponding to RESCHEDULED AVLlINE,avline inserted first");
						aElements2[fGroupIndex].children.splice(0, 0, oInitialGroup );
					}
				} 
				
				
				if ( key1.slice(0,2) != "I_" ) {
				
				var ochild = {
						"group" : key,
						"rescheduled" : "R",			
						"avlLine" : key1,
						"key": airbus.mes.stationtracker.AssignmentManager.idName(key) + "_" + airbus.mes.stationtracker.AssignmentManager.idName(key1),
				};
				aElements2[fIndex].children.push(ochild);
					}
				//Creation data wich represent boxs rescheduling and initial
				//for ( var e in oModel[key][key1]) 
					Object.keys(oModel[key][key1]).forEach(function(key2,index) {

					var aStartDateRescheduling = [];
					var aEndDateRescheduling = [];
//					var aStartDateInitial = [];	not used
//					var aEndDateInitial = []; not used
					var aDisruptions = [];
					var aAndons = [];
					var aTotalDuration = [];
					var aStatus = [];
					var aOSW = [];
					var aRMAStatus = [];
					var aUnplanned = [];
					
					var fProgress = 0;
					var fDuration = 0;
									
					var sShopOrderDescription = "";
//					var sWORKORDER_ID = "";	not used
					var sOperationDescription = "";
					var sOperationId = "";
//					var sRoutingMaturityAssessment = ""; not used
					var fCriticalPath = 0;		
					var sStatus = "";
					var sShopOrder = "";
					var sSfcStep = "";
					var sProdGroup = "";
										
					oModel[key][key1][key2].forEach( function( el ) { 
						
						//Store in array value needed to be compare in case of boxing
						aStartDateRescheduling.push(Date.parse(oFormatter.jsDateFromDayTimeStr(el.START_TIME)));
						aEndDateRescheduling.push(Date.parse(oFormatter.jsDateFromDayTimeStr(el.END_TIME)));
						aDisruptions.push(el.disruptions);
						aAndons.push(el.ANDONS);
						aTotalDuration.push( el.DURATION );
						aStatus.push(el.status);
						aOSW.push(el.EXECUTION_STATION_SOURCE);
						aRMAStatus.push(el.RMA_STATUS_COLOR);
						aUnplanned.push(el.ISUNPLANNED);
						
						fProgress += parseFloat(el.PROGRESS);
						fDuration += parseFloat(el.DURATION);
									
						sShopOrderDescription = el.WORKORDER_DESCRIPTION;
						sShopOrder = el.WORKORDER_ID;
						sOperationDescription = el.OPERATION_DESCRIPTION;
						sOperationId = el.OPERATION_ID;
						fCriticalPath = el.CRITICAL_PATH;
						sOperationDescription = el.sBox;
						sStatus = el.STATE;
						sSfcStep = el.SFC_STEP_REF;
						sProdGroup = el.PROD_GROUP;
						
						if ( sBox === oGroupingBoxingManager.specialGroup) {
							
							sOperationDescription = el.WORKORDER_DESCRIPTION;
							
						}
						
						if ( sBox === "OPERATION_ID") {
							
							sOperationDescription = el.OPERATION_DESCRIPTION;
							
						}
						
						sOperationId = el.OPERATION_ID;
						
					} );
					
					if (  key1.slice(0,2) === "I_" &&  airbus.mes.stationtracker.GroupingBoxingManager.showInitial ) {
						
						var oOperationInitial = {
								
								"sSfcStep" : sSfcStep,
								"operationId" : sOperationId,
								"operationDescription" : sOperationDescription,
								"shopOrder" : sShopOrder,
//								"rmaStatus" : Math.max.apply(null,aRMAStatus),
								"shopOrderDescription" : sShopOrderDescription,
								// This is the real value of boxing 
								"realValueBox" : key2.split("_")[0],
								"box" : key2,
								"group" : key,
								"avlLine" : key1,
								"type":"I",
								"text" : sOperationDescription,
								"section_id" : 	"I_" + airbus.mes.stationtracker.AssignmentManager.idName(key) + "_" + airbus.mes.stationtracker.AssignmentManager.idName(key1),
								"totalDuration" : fDuration.toString(), 
								"progress" : fProgress.toString(),
								"start_date" : new Date(Math.min.apply(null,aStartDateRescheduling)),
								"end_date" : oFormatter.sizeMin(new Date(Math.max.apply(null,aEndDateRescheduling)),new Date(Math.min.apply(null,aStartDateRescheduling))),
							};
						
						aBox.push(oOperationInitial);
						
					} 
					
					if  ( key1.slice(0,2) != "I_" )
					{
					
						var oOperationRescheduling = {
								
							"isUnplanned" :  Math.max.apply(null,aUnplanned),
							"ProdGroup" : sProdGroup,	
							"sSfcStep" : sSfcStep,
							"operationId" : sOperationId,
							"operationDescription" : sOperationDescription,
							"shopOrder" : sShopOrder,
							"shopOrderDescription" : sShopOrderDescription,
							"rmaStatus" : Math.max.apply(null,aRMAStatus),
							"status" : Math.max.apply(null,aStatus),
							"OSW" : Math.max.apply(null,aOSW),
							// This is real value from backend
							"state" : sStatus,
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
						};
					
					aBox.push(oOperationRescheduling);
					
					}
					
				});
			});
			
		});
		
		//var t1 = performance.now();
		//console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
		
		scheduler.matrix['timeline'].y_unit_original = aElements2;
		scheduler.callEvent("onOptionsLoad", []);
		var ShiftManager = airbus.mes.stationtracker.ShiftManager;
		
		if ( ShiftManager.current_Date != undefined) {
		
			if ( airbus.mes.stationtracker.ShiftManager.closestShift( ShiftManager.currentFullDate ) != -1 ){
				
				scheduler.init( airbus.mes.stationtracker.oView.byId("stationtracker").getId() , new Date( ShiftManager.currentFullDate), "timeline");
			
			} else {
				
				scheduler.init(airbus.mes.stationtracker.oView.byId("stationtracker").getId(), airbus.mes.stationtracker.ShiftManager.shifts[airbus.mes.stationtracker.ShiftManager.shifts.length -1 ].StartDate , "timeline");
				
			}
						
		} else if ( airbus.mes.stationtracker.ShiftManager.closestShift(new Date()) != -1 ){
			
			var fShiftIndex = airbus.mes.stationtracker.ShiftManager.closestShift(new Date());
			scheduler.init( airbus.mes.stationtracker.oView.byId("stationtracker").getId() ,airbus.mes.stationtracker.ShiftManager.shifts[fShiftIndex].StartDate , "timeline");		
		
		} else {
			
			scheduler.init(airbus.mes.stationtracker.oView.byId("stationtracker").getId(), airbus.mes.stationtracker.ShiftManager.shifts[airbus.mes.stationtracker.ShiftManager.shifts.length -1 ].StartDate , "timeline");
			
		}
		
		scheduler.clearAll();
		scheduler.deleteMarkedTimespan();
		// Display all marker
	    airbus.mes.stationtracker.ShiftManager.addMarkedShifts();
	    scheduler.xy.scroll_width=20;
	    airbus.mes.stationtracker.oView.byId("stationtracker").setBusy(false);
	    scheduler.parse(aBox,"json");
	}
	
};

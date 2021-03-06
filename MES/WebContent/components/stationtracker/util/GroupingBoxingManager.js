"use strict";

jQuery.sap.declare("airbus.mes.stationtracker.util.GroupingBoxingManager")
airbus.mes.stationtracker.util.GroupingBoxingManager	 = {
	
	constante :  "*@#&~^",
	operationHierarchyDelay : {},
	operationDateIHierarchy : {},
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
	var oHierachy = airbus.mes.stationtracker.util.GroupingBoxingManager.shiftHierarchy = {};
	var aShiftBreak = airbus.mes.stationtracker.util.GroupingBoxingManager.shiftBreakHierarchy = [];
	var oModelShift = sap.ui.getCore().getModel("shiftsModel");
	var oFormatter = airbus.mes.stationtracker.util.Formatter;
	
	if(oModelShift.getProperty("/Rowsets/Rowset/0/Row")){              
		
		oModelShift = sap.ui.getCore().getModel("shiftsModel").oData.Rowsets.Rowset[0].Row;
//		oModelShift.forEach(function(el) {
//		
//				el.day = el.day.replace(/-/g,"");
//			
//		})
	
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
	var oHierachy2 = airbus.mes.stationtracker.util.GroupingBoxingManager.shiftNoBreakHierarchy = [];
	
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
			this.minDate = oStartDate.setHours(0,0,0);
			
		} else if (this.minDate > oStartDate) {
			this.minDate = oStartDate.setHours(0,0,0);
			
		}
	},

	fillEndDate : function(oEndDate){
		if(this.maxDate === undefined) {
			this.maxDate = oEndDate.setHours(0,0,0);
			
		} else if (this.maxDate < oEndDate) {
			this.maxDate = oEndDate.setHours(0,0,0);
			
		}
	},
	
	groupingBoxing : function(sGroup,sBoxing) {
		
		airbus.mes.stationtracker.util.GroupingBoxingManager.operationHierarchy = {};

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
		//if ( airbus.mes.stationtracker.util.GroupingBoxingManager.showInitial ) {
			
			this.computeOperationHierarchy(aModelI,sGroup,sBoxing,"I");
			this.computeOperationHierarchy(aModel,sGroup,sBoxing);
			
		//} else {
			
		//	this.computeOperationHierarchy(aModel,sGroup,sBoxing);
		//}
		
	},
	
	computeOperationHierarchy : function(oModel,sGroup,sBoxing,sInitial) {
		
		var oHierachy = airbus.mes.stationtracker.util.GroupingBoxingManager.operationHierarchy;
		var oHierarchyDelay = airbus.mes.stationtracker.util.GroupingBoxingManager.operationHierarchyDelay;
		var oFormatter = airbus.mes.stationtracker.util.Formatter;
		var oHierarchyI = airbus.mes.stationtracker.util.GroupingBoxingManager.operationDateIHierarchy;
		var sCstSplit = airbus.mes.stationtracker.util.GroupingBoxingManager.constante;
		var sTaktStart = new Date(airbus.mes.settings.util.ModelManager.taktStart);
		var sTaktEnd = new Date(airbus.mes.settings.util.ModelManager.taktEnd);

		
		oModel.forEach(function(el){
			
			var ssAvLine;
			var ssGroup;
			var oShift;
			var sIdOpe;
			var sID = el.OPERATION_ID + el.WORKORDER_ID;
			
			//Create operationDateIHierarch permit to store on one operation the date rescheduled and initial
			if ( !oHierarchyI[sID] ){
				
				oHierarchyI[sID] = {};
			}
			
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
				oHierarchyI[sID].startI = el.START_TIME;
				oHierarchyI[sID].endI = el.END_TIME;				

			} else {
				ssAvLine = el.AVL_LINE + "_" + el.SKILLS;
				oHierarchyI[sID].start = el.START_TIME;
				oHierarchyI[sID].end = el.END_TIME;				
			}
					
			//permit to DO THE boxing on the only corresponding shift selected in day mode
			if ( airbus.mes.stationtracker.util.ShiftManager.closestShift(oFormatter.jsDateFromDayTimeStr(el.START_TIME)) != -1 ) {
				oShift = airbus.mes.stationtracker.util.ShiftManager.shifts[airbus.mes.stationtracker.util.ShiftManager.closestShift(oFormatter.jsDateFromDayTimeStr(el.START_TIME))]; 
			} else {
				console.log("operation is not in the shift");
				oShift = "";
			}
						
			
			// Permit to define the Box in the hierarchy in boxing = operation we want one box = one operation
			if ( sBoxing === "OPERATION_ID") {
				// Permit when boxing in operation to create one box for one operation : 
				//the couple GROUPING WORKORDER_ID + BOXING OPERATION_ID is unique 
				// in avl Line 
					sIdOpe = "WORKORDER_ID";
					
				} else {
				// Permit when boxing to create one box for several operation
					sIdOpe  = sBoxing;
					
				}
			// This is the name of the box where will be put all operation
			var ssBox = el[sBoxing] + sCstSplit  + el[sIdOpe] + sCstSplit + oShift.shiftID;

						
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
			var sStop = "0";
			var fRMA = "0";
			var sUnplanned = "0";
			var FREEZE_TRACKING_TEMPLATE = false;
			var FROZEN_FITTED_PARTS = false;			
			var sBlock = "0";
			var sStatus2 = airbus.mes.stationtracker.util.GroupingBoxingManager.computeStatus(el.STATE, el.PAUSED, el.PREVIOUSLY_STARTED );			

			sStatus = airbus.mes.stationtracker.util.GroupingBoxingManager.computeStatus(el.STATE, el.PAUSED, el.PREVIOUSLY_STARTED );
			//store the status start/paused/confirm/complete
				
			//Opened disruption Escalated red
			if ( el.DISRUPTION === "D1") {
				sStatus = "8";
			}
			//Open disruption yellow
			if ( el.DISRUPTION === "D2") {
				sStatus = "7";
			}
			//Answered Escalated red Hatch
			if ( el.DISRUPTION === "D3") {
				sStatus = "6";
			}
			//Answered yellow hatch
			if ( el.DISRUPTION === "D4") {
				sStatus = "5";
			}
			//All disruptions are solved green hatch
			if ( el.DISRUPTION === "D5") {
				sStatus = "4";
			}
			// if operation is not active and add disruption it should be display in yellow even if the disruption is escalated
			if ( sStatus2 === "1" && sStatus >= "4" ) {
				
				sStatus = "7";
			}
			// Operation is from OSW
			if ( el.EXECUTION_STATION_SOURCE[0] === "3" ) {
				fOSW = "3";
			}
			// Operation is from OSW ACPng
			if ( el.EXECUTION_STATION_SOURCE[0] === "4" ) {
				fOSW = "4";
			}
			// Operation is from unplanned
			if ( el.EXECUTION_STATION_SOURCE[0] === "1" ) {
				sUnplanned = "1";
			}
			// Maturity
			if ( el.RMA_STATUS_COLOR != "---" ) {
				fRMA = "1";		
			}
//			// Check if there is any blocking disruption - (not Closed and deleted)
			if ( el.BLOCKING_DISRUPTION === "true") {
				sBlock = "1";
			}
			if ( el.STOP === "true") {
				sStop = "1";				
			}

			if(el.FREEZE_TRACKING_TEMPLATE === "true") {
				FREEZE_TRACKING_TEMPLATE = true;
			} else {
				FREEZE_TRACKING_TEMPLATE = false;
			}

			if(el.FROZEN_FITTED_PARTS === "true") {
				FROZEN_FITTED_PARTS = true;
			} else {
				FROZEN_FITTED_PARTS = false;
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
					"status2" : sStatus2,
					"BLOCKING_DISRUPTION" : sBlock,
					"ISUNPLANNED" : sUnplanned,
					"CPP_CLUSTER" : el.CPP_CLUSTER,
					"WORK_PACKAGE" : el.WORK_PACKAGE,
					"CRITICAL_PATH" : el.CRITICAL_PATH,
					"EXECUTION_STATION_SOURCE" : fOSW,
					"AVL_LINE": el.AVL_LINE,
					"PROD_GROUP":el.PROD_GROUP,
					"SFC_STEP_REF":el.SFC_STEP_REF,
					"SHOP_ORDER_BO":el.SHOP_ORDER_BO,
					"USER_BO":el.USER_BO,
					"PP_STATION":el.PP_STATION,
					"WORK_CENTER" : el.WORK_CENTER,
					"OPERATION_BO": el.OPERATION_BO,
					"SKILLS" : el.SKILLS,
					"PREVIOUSLY_STARTED" : el.PREVIOUSLY_STARTED,
					"DISRUPTION" : el.DISRUPTION,
					"OSW" : el.OSW,
					"ERP_SYSTEM" : el.ERP_SYSTEM,
					"PAUSED" : el.PAUSED,
					"NUMBER_OF_EMPLOYEES" : el.NUMBER_OF_EMPLOYEES,
					//"SFC_STEP_REF" : el.SFC_STEP_REF
					"FAMILY_AVL_GROUPING" : el.FAMILY_AVL_GROUPING,
					"FAMILY_AVL_BOXING" : el.FAMILY_AVL_BOXING,
					"ROUTERSTEPBO" : el.ROUTER_STEP_BO,
					"ACPNG_STATUS" : el.ACPNG_STATUS,
					"STOP" : sStop,
					"FREEZE_TRACKING_TEMPLATE" : FREEZE_TRACKING_TEMPLATE,
					"FROZEN_FITTED_PARTS" : FROZEN_FITTED_PARTS					
										
			};
			
			
			oHierachy[ssGroup][ssAvLine][ssBox].push(oOperation);
			// User to comput delay of operation take only operation wiwh are contain in the takt
			// Check if we have takt time
			if ( sTaktStart instanceof Date  && sTaktEnd instanceof Date ) {
				if ( new Date(el.START_TIME) >=  sTaktStart &&  new Date(el.START_TIME) <  sTaktEnd ) {
					if ( oFormatter.jsDateFromDayTimeStr(el.END_TIME) < new Date() ) {		
						oHierarchyDelay[ssGroup][ssAvLine].duration += parseFloat(el.DURATION);
					}
					oHierarchyDelay[ssGroup][ssAvLine].progress += parseFloat(el.PROGRESS);
								
				}
			}
		});
	},
	
	parseOperation : function(sGroup,sBox) {		
//		var t0 = performance.now();	not used
		var oGroupingBoxingManager = airbus.mes.stationtracker.util.GroupingBoxingManager;
		var oFormatter = airbus.mes.stationtracker.util.Formatter;
		var sCstSplit = airbus.mes.stationtracker.util.GroupingBoxingManager.constante;

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
					"key": airbus.mes.stationtracker.util.AssignmentManager.idName(key),
					"label" : key,
					"children":[],
			};
				
			aElements2.push(oRecheduleGroup);
			var fGroupIndex = aElements2.indexOf(oRecheduleGroup);
	
			Object.keys(oModel[key]).sort().forEach(function(key1){
						
				//Creation of avl line of the current group
				var fIndex = aElements2.indexOf(oRecheduleGroup);
			
				if ( key1.slice(0,2) === "I_" &&  airbus.mes.stationtracker.util.GroupingBoxingManager.showInitial ) {
					
					var oInitialGroup = {
							"group" : key,
							"avlLine" : key1,
							"key": "I_" + airbus.mes.stationtracker.util.AssignmentManager.idName(key) + "_" + airbus.mes.stationtracker.util.AssignmentManager.idName(key1),
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
						"key": airbus.mes.stationtracker.util.AssignmentManager.idName(key) + "_" + airbus.mes.stationtracker.util.AssignmentManager.idName(key1),
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
					var aAcpngStatus = [];
					var aStatus2 = [];
					var aIsBlocked = [];
					var aStop = [];
					
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
					var sPaused = "";
					var sPreviouslyStarted = "";
					var sRouterStepBo = "";
					var sDisruption = "";
					var bFreezeTrackingTemplateCompute = false;
					
					
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
						aAcpngStatus.push(el.ACPNG_STATUS);
						aStatus2.push(el.status2);
						aIsBlocked.push(el.BLOCKING_DISRUPTION);
						aStop.push(el.STOP);
						bFreezeTrackingTemplateCompute = el.FREEZE_TRACKING_TEMPLATE || bFreezeTrackingTemplateCompute;
						
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
						sPaused = el.PAUSED;
						sPreviouslyStarted = el.PREVIOUSLY_STARTED;
						
						sRouterStepBo = el.ROUTER_STEP_BO;
						sDisruption   = el.DISRUPTION;
						
						if ( sBox === oGroupingBoxingManager.specialGroup) {
							
							sOperationDescription = el.WORKORDER_DESCRIPTION;
							
						}
						
						if ( sBox === "OPERATION_ID") {
							
							sOperationDescription = el.OPERATION_DESCRIPTION;
							
						}
						
						sOperationId = el.OPERATION_ID;
						
					} );
					
					if (  key1.slice(0,2) === "I_" &&  airbus.mes.stationtracker.util.GroupingBoxingManager.showInitial ) {
						
						var oOperationInitial = {
								
								"sSfcStep" : sSfcStep,
								"operationId" : sOperationId,
								"operationDescription" : sOperationDescription,
								"shopOrder" : sShopOrder,
//								"rmaStatus" : Math.max.apply(null,aRMAStatus),
								"shopOrderDescription" : sShopOrderDescription,
								// This is the real value of boxing 
								"realValueBox" : key2.split(sCstSplit)[0],
								"box" : key2,
								"group" : key,
								"avlLine" : key1,
								"type":"I",
								"text" : sOperationDescription,
								"section_id" : 	"I_" + airbus.mes.stationtracker.util.AssignmentManager.idName(key) + "_" + airbus.mes.stationtracker.util.AssignmentManager.idName(key1),
								"totalDuration" : fDuration.toString(), 
								"progress" : fProgress.toString(),
								"start_date" : new Date(Math.min.apply(null,aStartDateRescheduling)),
								"end_date" : oFormatter.sizeMin(new Date(Math.max.apply(null,aEndDateRescheduling)),new Date(Math.min.apply(null,aStartDateRescheduling))),
								//-------------------------------------------
								"ProdGroup" : sProdGroup,	
								"criticalPath": fCriticalPath,
								"state" : sStatus,
								"paused" : sPaused,
								"previouslyStarted" : sPreviouslyStarted,
								"routerStepBo": sRouterStepBo,
								"disruption": sDisruption,
								"freezeTrackingTemplate" : bFreezeTrackingTemplateCompute
								//"isUnplanned" :  Math.max.apply(null,aUnplanned),
								//"andon" : Math.max.apply(null,aAndons),
								//"blocked" : Math.max.apply(null,aDisruptions),
								//"status" : Math.max.apply(null,aStatus),
								//"OSW" : Math.max.apply(null,aOSW),
								//------------------------------------------------
						
						};
						
						aBox.push(oOperationInitial);
						
					} 
					
					if  ( key1.slice(0,2) != "I_" ) {

					
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
							"realValueBox" : key2.split(sCstSplit)[0],
							"box" : key2,
							"avlLine" : key1,
							"group" : key,
							"andon" : Math.max.apply(null,aAndons),
							"blocked" : Math.max.apply(null,aDisruptions),
							"criticalPath": fCriticalPath,
							"type":"R",
							"text" : sOperationDescription,
							"section_id" : 	airbus.mes.stationtracker.util.AssignmentManager.idName(key) + "_" + airbus.mes.stationtracker.util.AssignmentManager.idName(key1),
							"progress" : fProgress.toString(),
							"start_date" : new Date(Math.min.apply(null,aStartDateRescheduling)),
							"end_date" :  oFormatter.sizeMin(new Date(Math.max.apply(null,aEndDateRescheduling)),new Date(Math.min.apply(null,aStartDateRescheduling))),
							"paused" : sPaused,
							"previouslyStarted" : sPreviouslyStarted,
							"routerStepBo": sRouterStepBo,	
							"aAcpngStatus": Math.max.apply(null,aAcpngStatus),
							"status2" : Math.max.apply(null,aStatus2),
							"isBlocked" : Math.max.apply(null,aIsBlocked),
							"stop" : Math.max.apply(null,aStop),
							"freezeTrackingTemplate" : bFreezeTrackingTemplateCompute
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
		var ShiftManager = airbus.mes.stationtracker.util.ShiftManager;
		
		if ( ShiftManager.current_Date != undefined) {
		
			if ( airbus.mes.stationtracker.util.ShiftManager.closestShift( ShiftManager.currentFullDate ) != -1 ){
				
				scheduler.init( airbus.mes.stationtracker.oView.byId("stationtracker").getId() , new Date( ShiftManager.currentFullDate), "timeline");
			
			} else {
				
				scheduler.init(airbus.mes.stationtracker.oView.byId("stationtracker").getId(), airbus.mes.stationtracker.util.ShiftManager.shifts[airbus.mes.stationtracker.util.ShiftManager.shifts.length -1 ].StartDate , "timeline");
				
			}
						
		} else if ( airbus.mes.stationtracker.util.ShiftManager.closestShift(new Date()) != -1 ){
			
			var fShiftIndex = airbus.mes.stationtracker.util.ShiftManager.closestShift(new Date());
			scheduler.init( airbus.mes.stationtracker.oView.byId("stationtracker").getId() ,airbus.mes.stationtracker.util.ShiftManager.shifts[fShiftIndex].StartDate , "timeline");		
		
		} else {
			
			scheduler.init(airbus.mes.stationtracker.oView.byId("stationtracker").getId(), airbus.mes.stationtracker.util.ShiftManager.shifts[airbus.mes.stationtracker.util.ShiftManager.shifts.length -1 ].StartDate , "timeline");
			
		}
		
		scheduler.clearAll();
		scheduler.deleteMarkedTimespan();
		// Display all marker
	    airbus.mes.stationtracker.util.ShiftManager.addMarkedShifts();
		// Update combobox of shift and display the selection of shift
		airbus.mes.stationtracker.util.ModelManager.selectMyShift();
	   
		scheduler.xy.scroll_width=20;
	    scheduler.parse(aBox,"json");
	    airbus.mes.shell.busyManager.unsetBusy(airbus.mes.stationtracker.oView, "stationtracker");
	},
	computeStatus : function(sState, sPaused, sPreviouslyStarted){
		var sStatus = "";
		
		// Operation is active	
		if (  sPaused === "false") {
			sStatus = "2";
		}		
		// Operation is not started
		if ( sPaused === "---" ) {
			sStatus = "1";
			// Operation is pause	
			if ( sPaused === "---" && sPreviouslyStarted === "true" ) {
					sStatus = "3";
				}	
		}				
		// Operation Completed
		if ( sState === "C" ) {
			sStatus = "0";
		}
		return sStatus;
	}
	
};

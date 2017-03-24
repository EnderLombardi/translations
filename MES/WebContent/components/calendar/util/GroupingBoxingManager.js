"use strict";

jQuery.sap.declare("airbus.mes.calendar.util.GroupingBoxingManager")
airbus.mes.calendar.util.GroupingBoxingManager	 = {
	
	constante :  "*@#&~^",
	operationHierarchy : {},
	shiftHierarchy : {},
	total : {},
	shiftNoBreakHierarchy: [],
	shiftBreakHierarchy: [],
//	Define start and end date of the scheduler
	minDate: undefined,
	maxDate: undefined,
		
	parseShift : function()  { 
		
	// Tree Shift Model	
	var oHierachy = airbus.mes.calendar.util.GroupingBoxingManager.shiftHierarchy = {};
	var aShiftBreak = airbus.mes.calendar.util.GroupingBoxingManager.shiftBreakHierarchy = [];
	var oModelShift = airbus.mes.calendar.oView.getModel("calendarshiftsModel");
	var oFormatter = airbus.mes.calendar.util.Formatter;
	
	if(oModelShift.getProperty("/Rowsets/Rowset/0/Row")){              
		
		oModelShift = airbus.mes.calendar.oView.getModel("calendarshiftsModel").oData.Rowsets.Rowset[0].Row;
	
    } else  { 	
    console.log("no shift Data for station tracker");
    oModelShift = [];
    }
	
	oModelShift.forEach(function(el) {
		
		if ( airbus.mes.calendar.util.ShiftManager.shiftIdSelected === "ALL" || airbus.mes.calendar.util.ShiftManager.shiftIdSelected === el.resourcePoolId 
			|| airbus.mes.calendar.util.ShiftManager.taktDisplay || airbus.mes.calendar.util.ShiftManager.dayDisplay) {

		
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
		
		}
	
	});

	// Shift Model (without breaks)
	var oHierachy2 = airbus.mes.calendar.util.GroupingBoxingManager.shiftNoBreakHierarchy = [];
	
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

	computeCalendarHierarchy : function() {
		
		var oHierachy = airbus.mes.calendar.util.GroupingBoxingManager.operationHierarchy = {};
		var oFormatter = airbus.mes.calendar.util.Formatter;
		var sCstSplit = airbus.mes.calendar.util.GroupingBoxingManager.constante;
		var oModel =  airbus.mes.calendar.oView.getModel("calendarTrackerModel");
		var aElements2 = [];
		var aBox = [];
		var sPoolId = airbus.mes.calendar.util.ShiftManager.shiftIdSelected;
		var oTotal = airbus.mes.calendar.util.GroupingBoxingManager.totalHierarchy = {"line":{},};		
		var aShifts = airbus.mes.calendar.util.ShiftManager.shifts;
		var fTotalUser = 0;
		//Day or shift mode step is on day
		if ( airbus.mes.calendar.util.ShiftManager.shiftDisplay || airbus.mes.calendar.util.ShiftManager.dayDisplay) {
			
			var fStep = 3600000;
			
		} else {
			 var sTime = airbus.mes.calendar.util.Formatter.jsDateFromDayTimeStr(airbus.mes.settings.util.ModelManager.taktEnd) - airbus.mes.calendar.util.Formatter.jsDateFromDayTimeStr(airbus.mes.settings.util.ModelManager.taktStart)
		        // Takt is over one day
		        if ( Math.abs(sTime) > 86400000 ) {
			        // Takt is over one day step is done by day
					var fStep = 86400000;

		        } else  {
			        // Takt is over one day step is done by hour
					var fStep = 3600000;

		        }
			
		}
		//===============
		// check if model full or not
		//===============	
		if (oModel.getProperty("/userCalendarDisplayData")) {              	
			oModel = oModel.oData.userCalendarDisplayData;	
        } else  {
        	oModel = [];
        	console.log("no Holidays operation load");
        }		
		//===============
		//Compute hierarchy by group and user		
		//===============	
		oModel.forEach(function(el){
			// Filtering on ressource POOL
			if ( el.resourcePoolId === sPoolId || sPoolId === "ALL" ) {
				// Home based
				if ( el.loanedFrom === "false" && el.loanedTo === "false" ) {
					
					var sName = airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("HomeBased");
					
				} else {
					// loanedFrom 
					if ( el.loanedFrom === "true" ) {
						
						var sName = airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("LoanedFrom");
					// loanedTo 	
					} else {
						
						var sName = airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("LoanedTo");
			
					}
				}
					
				if ( !oHierachy[sName] ) {
					
					oHierachy[sName] = {};
				}
				if ( !oHierachy[sName][el.userId + sCstSplit + el.firstName + sCstSplit +  el.lastName + sCstSplit + sName ] ) {
					
					oHierachy[sName][ el.userId + sCstSplit + el.firstName + sCstSplit +  el.lastName + sCstSplit + sName ] = [];
				}
				
				oHierachy[sName][ el.userId + sCstSplit + el.firstName + sCstSplit +  el.lastName + sCstSplit + sName].push(el);
					
			}
		})
		//===============
		//Compute aElements2 creation of group	
		//===============	
		Object.keys(oHierachy).forEach(function(group,index1) { 
		
			var oGroup = {
					
					"key": airbus.mes.calendar.util.Formatter.idName(group),
					"label" : group,
					"children":[],
			}
			
			aElements2.push(oGroup);
			
			//===============
			//Compute aElements2 creation of line	
			//===============
			Object.keys(oHierachy[group]).forEach(function(line,index2) {
				
				var aData = line.split(sCstSplit);				
				
				var oLine = {
					"lastName" : aData[2],
					"firstName" : aData[1],
					"ng" : aData[0],
					"group" : group,
					"avlLine" : line,
					"key": airbus.mes.calendar.util.Formatter.idName(line)
				};
				
				if ( group != airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("LoanedTo") ) {
					
					fTotalUser++;
				}
				
				aElements2[index1].children.push(oLine);
				//===============
				//Compute aBox creation of box	
				//===============		
				oHierachy[group][line].forEach( function(el) {
				
					var oBox = {
						"loaned" : el.LOANED,
						"diversion" : el.DIVERSION,
						"validated" : el.validated,
						"section_id" : airbus.mes.calendar.util.Formatter.idName(line),
						"start_date" : new Date(oFormatter.jsDateFromDayTimeStr(el.startdDateTime)),
						"end_date" : new Date(oFormatter.jsDateFromDayTimeStr(el.endDateTime)),
					};
					
					aBox.push(oBox);
					//===============
					//Compute object wich represent the all the total box to create loaned to does not need to be use	
					//===============	
					if ( el.loanedTo != "true" ) {
						//if (  Math.abs(oBox.start_date -  oBox.end_date) >= fStep ) {
						       
							// Check if we are in day mode or not if we are day the scale is on a day otherwise on the hours
							if ( fStep === 86400000 ) {
								//we will check on the begining of the day
								//workers partially available dunring time frame is considered as not that why we reset the startdate at the begining of the day		
								var fStartDate = new Date(oFormatter.jsDateFromDayTimeStr(el.startdDateTime)).setHours(0, 0, 0);
								//workers partially available dunring time frame is considered as not that why we set the enDdate at the end of the current days 	
								var fEndDate = new Date(oFormatter.jsDateFromDayTimeStr(el.endDateTime)-1).setHours(24,0,0) 
								
							} else {
								// we will chekc on the begining of the hours
								//workers partially available dunring time frame is considered as not that why we reset the startdate at the begining of the hours	
								var fStartDate = new Date(oFormatter.jsDateFromDayTimeStr(el.startdDateTime)).setMinutes(0,0,0);
								//workers partially available dunring time frame is considered as not that why we set the enDdate at the end of the current hours 	
								var fEndDate = new Date(oFormatter.jsDateFromDayTimeStr(el.endDateTime)-1).setMinutes(60,0,0);

							}
							
							while( fStartDate < fEndDate ) {
								//Check if the startDate + the step is less than the end Date => that mean between my start date and end date i have one step of one hour begining/day at 0min0sec
								if (fStartDate + fStep <= fEndDate ) {
									
									var fId = fStartDate;
									var sLineId = line+fId;

									if (oTotal[fId] === undefined) {
										oTotal[fId] = 0;	
									}
									//Permit to does not count the doublon of absence
									if ( oTotal.line[sLineId] === undefined ) {
										oTotal.line[sLineId] = 0;								
									}
									oTotal.line[sLineId] += 1;
									oTotal[fId] += 1;
									fStartDate += fStep;
									
									if ( oTotal.line[sLineId] > 1 ) {
										oTotal[fId]--;								
									}
									
								} else {
									
									fStartDate += fStep;
								}	
							}
						}
					//}			
				});
		
			});
	
		});
		//===============
		//Compute total line group and line creation	
		//===============
		
		// If no box that mean no plan absence dont display the line with box of total
		if (aBox.length != 0 ) {
			aElements2.push({				
					"key": airbus.mes.calendar.util.Formatter.idName("total"),
					"label" : airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("total"),
					"children":[{
						"lastName" : "",					
						"group" : airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("total"),
						"key": "total1",
					}],
			});
			//===============
			//Compute aBox creation of box for Total line
			//===============
			
			// We will parse the frame of the start of the shift and the end and compute all box where are not present a worker and display 0
			// we can increase the perf in parssing only the real shift date
			if ( fStep === 86400000 ) {
				//we will check on the begining of the day
				var dStart = aShifts[0].StartDate.setHours(0, 0, 0).valueOf();
				
			} else {
				// we will chekc on the begining of the hours
				var dStart = aShifts[0].StartDate.setMinutes(0, 0).valueOf();
	
			}
				var dEnd = aShifts[aShifts.length-1].EndDate.setMinutes(0, 0).valueOf();
				
				while( dStart < dEnd ) {
					if ( oTotal[dStart] === undefined ) {
						aBox.push({
							"total" : true,
							"value" : fTotalUser,
							"section_id" : "total1",
							"start_date" : new Date(dStart),
							"end_date" : new Date(dStart+fStep),
						})					
						dStart += fStep;
						
					} else {
						
						dStart += fStep;
			
					}
				}
				// Add in the aBox the box corresponding to the worker absence
			for (var i in oTotal) {
				
				aBox.push({
					"total" : true,
					"value" : fTotalUser - oTotal[i],
					"section_id" : "total1",
					"start_date" : new Date(parseFloat(i)),
					"end_date" : new Date(parseFloat(i) + fStep),
				})
				
			}
		}
		calendar.matrix['timeline'].y_unit_original = aElements2;
		calendar.callEvent("onOptionsLoad", []);
		var ShiftManager = airbus.mes.calendar.util.ShiftManager;
		
		var ShiftManager = airbus.mes.calendar.util.ShiftManager;
		var oShiftSelection = airbus.mes.calendar.util.ShiftManager.shifts.filter(function(el){return el.day === airbus.mes.calendar.util.ShiftManager.dShiftBeforeSelection});
		//When filtering on ressourcePool reselect the shift corresponding of the date selected in the calendar.
		if  ( airbus.mes.calendar.util.ShiftManager.bSelection && oShiftSelection.length > 0 ) {
		
			calendar.init( airbus.mes.calendar.oView.byId("calendar").getId() , oShiftSelection[0].StartDate, "timeline");
		
		} else if ( ShiftManager.shifts.length != 0 ) {
				
				if ( ShiftManager.current_Date != undefined) {
				
					if ( ShiftManager.closestShift( ShiftManager.currentFullDate ) != -1 ){
						
						calendar.init( airbus.mes.calendar.oView.byId("calendar").getId() , new Date( ShiftManager.currentFullDate), "timeline");
					
					} else {
						
						calendar.init(airbus.mes.calendar.oView.byId("calendar").getId(), ShiftManager.shifts[ShiftManager.shifts.length -1 ].StartDate , "timeline");
						
					}
								
				} else if ( ShiftManager.closestShift(new Date()) != -1 ){
					
					var fShiftIndex = ShiftManager.closestShift(new Date());
					calendar.init( airbus.mes.calendar.oView.byId("calendar").getId() ,ShiftManager.shifts[fShiftIndex].StartDate , "timeline");		
				
				} else {
					
					calendar.init(airbus.mes.calendar.oView.byId("calendar").getId(), ShiftManager.shifts[ShiftManager.shifts.length - 1 ].StartDate , "timeline");
					
				}		
			} else {
				// No shift is present in the ressource pool => nothing to display
				calendar.matrix['timeline'].y_unit_original = [];
				aBox = [];
				calendar.callEvent("onOptionsLoad", []);
			}
		
		calendar.clearAll();
		calendar.deleteMarkedTimespan();
		// Display all marker
	    airbus.mes.calendar.util.ShiftManager.addMarkedShifts();
		airbus.mes.calendar.oView.getController().UpdateDateSwipe();		
		calendar.xy.scroll_width=20;
	    calendar.parse(aBox,"json");
	    calendar.openAllSections();
        airbus.mes.shell.busyManager.unsetBusy(airbus.mes.calendar.oView);

		},
	
};

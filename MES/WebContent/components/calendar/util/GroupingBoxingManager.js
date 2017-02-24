"use strict";

jQuery.sap.declare("airbus.mes.calendar.util.GroupingBoxingManager")
airbus.mes.calendar.util.GroupingBoxingManager	 = {
	
	constante :  "*@#&~^",
	operationHierarchy : {},
	shiftHierarchy : {},
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

	computeCalendarHierarchy : function() {
		
		var oHierachy = airbus.mes.calendar.util.GroupingBoxingManager.operationHierarchy = {};
		var oFormatter = airbus.mes.calendar.util.Formatter;
		var sCstSplit = airbus.mes.calendar.util.GroupingBoxingManager.constante;
		var oModel =  airbus.mes.calendar.oView.getModel("calendarTrackerModel");
		var aElements2 = [];
		var aBox = [];
		var sPoolId = airbus.mes.calendar.util.ShiftManager.shiftIdSelected;
	
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
						
						var sName = airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("LoadedTo");
			
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
					
					aBox.push(oBox)
				
				});
		
			});
	
		});
		
		calendar.matrix['timeline'].y_unit_original = aElements2;
		calendar.callEvent("onOptionsLoad", []);
		var ShiftManager = airbus.mes.calendar.util.ShiftManager;
		
		// Use the previous start date and test if it is in shift hierearchy otherwise take last shift of the shift collection
//		if  ( airbus.mes.calendar.util.ShiftManager.taktDisplay ) {
//			
//			calendar.updateView();
			
	//	} else {
			
			if ( ShiftManager.shifts.length != 0 ) {
				
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
	//	} 
		
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

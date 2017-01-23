"use strict";

jQuery.sap.declare("airbus.mes.calendar.util.GroupingBoxingManager")
airbus.mes.calendar.util.GroupingBoxingManager	 = {
	
	constante :  "*@#&~^",
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
		
		var oHierachy = airbus.mes.calendar.util.GroupingBoxingManager.operationHierarchy;
		var oFormatter = airbus.mes.calendar.util.Formatter;
		var sCstSplit = airbus.mes.calendar.util.GroupingBoxingManager.constante;
		var oModel =  airbus.mes.calendar.oView.getModel("calendarTrackerModel");
		var aElements2 = [];
		var aBox = [];
		//===============
		// check if model full or not
		//===============	
		if (oModel.getProperty("/Response")) {              	
			oModel = oModel.oData.Response;	
        } else  {
        	oModel = [];
        	console.log("no Holidays operation load");
        }		
		//===============
		//Compute hierarchy by group and user		
		//===============	
		oModel.forEach(function(el){
	
			// Home based
			if ( el.LOANED_FROM === "null" && el.LOADED_TO === "null" ) {
				
				var sName = airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("HomeBased");
				
			} else {
				// LOANED_FROM 
				if ( el.LOANED_FROM === "true" ) {
					
					var sName = airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("LoanedFrom");
				// LOADED_TO 	
				} else {
					
					var sName = airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("LoadedTo");
		
				}
			}
				
			if ( !oHierachy[sName] ) {
				
				oHierachy[sName] = {};
			}
			if ( !oHierachy[sName][el.USER + sCstSplit + el.FIRST_NAME + sCstSplit +  el.LAST_NAME + sCstSplit + sName ] ) {
				
				oHierachy[sName][ el.USER + sCstSplit + el.FIRST_NAME + sCstSplit +  el.LAST_NAME + sCstSplit + sName ] = [];
			}
			
			oHierachy[sName][ el.USER + sCstSplit + el.FIRST_NAME + sCstSplit +  el.LAST_NAME + sCstSplit + sName].push(el);
					
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
						"validated" : el.VALIDATED,
						"section_id" : airbus.mes.calendar.util.Formatter.idName(line),
						"start_date" : new Date(oFormatter.jsDateFromDayTimeStr(el.START_DATE_TIME)),
						"end_date" : new Date(oFormatter.jsDateFromDayTimeStr(el.END_DATE_TIME)),
					};
					
					aBox.push(oBox)
				
				});
		
			});
	
		});

		
		
		
		
		
		
		
//		var aElements2 = [ // original hierarhical array to display
//			{key:10, label:"Web Testing Dep.", open: true, children: [
//				{key:20, label:"Elizabeth Taylor"},
//				{key:30, label:"Managers",  children: [
//					{key:40, label:"John Williams"},
//					{key:50, label:"David Miller"}
//				]},
//				{key:60, label:"Linda Brown"},
//				{key:70, label:"George Lucas"}
//			]},
//			{key:110, label:"Human Relations Dep.", open:true, children: [
//				{key:80, label:"Kate Moss"},
//				{key:90, label:"Dian Fossey"}
//			]}
//		];
		
//	var aBox  = [
//			{ start_date: "2014-06-30 09:00", end_date: "2014-06-30 12:00", text:"Task A-12458", section_id:20},
//			{ start_date: "2014-06-30 10:00", end_date: "2014-06-30 16:00", text:"Task A-89411", section_id:20},
//			{ start_date: "2014-06-30 10:00", end_date: "2014-06-30 14:00", text:"Task A-64168", section_id:20},
//			{ start_date: "2014-06-30 16:00", end_date: "2014-06-30 17:00", text:"Task A-46598", section_id:20},
//			
//			{ start_date: "2014-06-30 12:00", end_date: "2014-06-30 20:00", text:"Task B-48865", section_id:40},
//			{ start_date: "2014-06-30 14:00", end_date: "2014-06-30 16:00", text:"Task B-44864", section_id:40},
//			{ start_date: "2014-06-30 16:30", end_date: "2014-06-30 18:00", text:"Task B-46558", section_id:40},
//			{ start_date: "2014-06-30 18:30", end_date: "2014-06-30 20:00", text:"Task B-45564", section_id:40},
//			
//			{ start_date: "2014-06-30 08:00", end_date: "2014-06-30 12:00", text:"Task C-32421", section_id:50},
//			{ start_date: "2014-06-30 14:30", end_date: "2014-06-30 16:45", text:"Task C-14244", section_id:50},
//			
//			{ start_date: "2014-06-30 09:20", end_date: "2014-06-30 12:20", text:"Task D-52688", section_id:60},
//			{ start_date: "2014-06-30 11:40", end_date: "2014-06-30 16:30", text:"Task D-46588", section_id:60},
//			{ start_date: "2014-06-30 12:00", end_date: "2014-06-30 18:00", text:"Task D-12458", section_id:60}
//		];
		
		
		calendar.matrix['timeline'].y_unit_original = aElements2;
		calendar.callEvent("onOptionsLoad", []);
		var ShiftManager = airbus.mes.calendar.util.ShiftManager;
		
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
		
		calendar.clearAll();
		airbus.mes.calendar.oView.getController().UpdateDateSwipe();		
		calendar.xy.scroll_width=20;
        airbus.mes.shell.busyManager.unsetBusy(airbus.mes.calendar.oView);
	    calendar.parse(aBox,"json");
	    calendar.openAllSections();
	   },
	
};

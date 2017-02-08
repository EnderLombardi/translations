"use strict";

jQuery.sap.declare("airbus.mes.calendar.util.ShiftManager");

airbus.mes.calendar.util.ShiftManager = {
    
	firstTimelineStart : undefined,
	updateShift : true,
	
	dayDisplay : false,
	taktDisplay : false,
	shiftDisplay :true,
	fSwipe: false,
	//Variables for shift combobox Day/Shit view
	BoxSelected : 0,
	ShiftSelected : "ALL",
	selectFirstShift : false,
	//Array where is stock Id of marker display on the gantt
	ShiftMarkerID :[],
	
	shiftIdSelected : "ALL",
	sIndexCombobox : 0,
	current_shift : undefined,
	currentShiftStart : undefined,
	current_Date : undefined,
	currentFullDate : undefined,
	currentShiftEnd : undefined,
	currentShiftIndex : undefined,
	currentFullDateSwipping : undefined,
	fDraging : false,
	GroupDelayed : [],
	GroupGantt : {},
	OperationAvlDoublon : {},
	swiping : false,
	NumberDelayedBox : undefined,
	changeShift: true, //Airbus Defect #262 - Shift selection is not kept when changing date
	
	
	/** Variable to permit apply the round minutes for the axis of gantt chart */
	step : 0,

	
	// local tab for rescheduling
	rescheduledTasks : [],
		
	/** Default date format for parsing. */
	dateFormat : "%Y-%m-%d %H:%i", // String

	/** Declared shifts. */
	shifts : undefined, // ShiftItem[]

	/**
	 * Returns a bounded version of given method.
	 */
	// Function bounded( String )
	bounded : function(method) {
		return this[method].bind(this);
	},

	/**
	 * Initialize the shift manager, which allows to call other shift methods or
	 * attach them to calendar events.
	 * 
	 * @param _shifts
	 *            the collection of shifts parsed by UI5 from back-end
	 */
	// void init( ShiftItem[] )
	init : function(_shifts) {

		this.firstTimelineStart = true;

		if (!_shifts) {
			// correct a bug on UI 5 v1.28 (S32) which sends back an undefined
			// variable in case it is empty
			this.shifts = [];
		} else {
			this.shifts = _shifts;
		}
		
	},

	/**
	 * Formatter to parse dates from XML (from string to Date)
	 */
	// Date dateFormatter(String)
	dateFormatter : undefined, // initialized later
	// String date2log(Date)
	date2log : undefined, // initialized later
	// Date jsDateFromDayTimeStr(String, String)
	jsDateFromDayTimeStr : function(day) {
		
		return new Date(day.slice(0,4),day.slice(5,7)-1,day.slice(8,10),day.slice(11,13),day.slice(14,16),day.slice(17,19));
		
	},

	/**
	 * Compute the index in the shifts collection of the closest shift, which
	 * ends after the given date. If nothing is found, return -1.
	 * 
	 * @param date
	 * @returns {Number}
	 */
	closestShift : function(date) {
		
		var iMed;

		if (this.shifts.length === 0)
			return -1;
		
		var iMin = 0,
			iMax = this.shifts.length - 1,
			iMed;
	
		var dCurr, dPrev;
		
		// this is for dichotomic search
		while (true) {
			
			iMed = Math.floor(iMin + ((iMax-iMin) / 2));
			
			dCurr = this.shifts[iMed].EndDate;
			dPrev = iMed > 0 ? this.shifts[iMed-1].EndDate : undefined;
			
			if (dCurr <= date) {
				// Very important, condition is less than *or equal*
				// to take next shift at the end.
				if (iMed === iMax) {
					return -1;
				} else {
					iMin = iMed + 1;
				}
			} else if (dPrev === undefined) {
				break;
			} else if (date < dPrev) {
				iMax = iMed - 1;
			} else {
				break;
			}
		}
		
//		//Airbus Defect #262 - Shift selection is not kept when changing date
//		if(!airbus.mes.calendar.util.ShiftManager.changeShift){
//			var flag = false;
//
//			/********
//			 * First search in backward direction
//			 * because there is a possibility that Dichomatic search result in Shift other than first shift of the day
//			 */
//			for(var i = iMed;; i--){
//				if(this.shifts[i].EndDate >= date && this.shifts[i].shiftName == airbus.mes.calendar.util.ShiftManager.current_shift.shiftName)
//				{ iMed = i; flag= true;	break; }
//				else if(this.shifts[i].EndDate < date)
//					break;
//			}
//			
//			/********
//			 * Then search in forward direction
//			 */
//			if(!flag)
//			for(var i = iMed;; i++){
//				if(this.shifts[i].EndDate >= date && this.shifts[i].shiftName == airbus.mes.calendar.util.ShiftManager.current_shift.shiftName)
//				{ iMed = i;	break; }
//				else if(this.shifts[i].EndDate < date)
//					break;
//			}
//		}
//		// End of Airbus Defect #262
		
		return iMed;
	},

	/**
	 * Compute the title to display in the timeline header.
	 * 
	 * @param dateStart
	 *            the beginning of the timeline (currently being displayed)
	 * @param dateEnd
	 *            the end of the timeline (currently being displayed)
	 * @returns {String}
	 */
	// String timelineHeaderDate(Date, Date)
	timelineHeaderTitle : function(dateStart, dateEnd) {
		// compute the closest shift after dateStart
		var t = this.closestShift(dateStart);
		// title = day of date start + shift description
		return calendar.templates.day_date(dateStart)
				+ (t >= 0 ? (" - " + this.shifts[t].shiftName) : "");
	},

	/**
	 * From the given date, compute the start of the timeline. Usually, the
	 * start of the timeline is at the start of the closest shift. However, due
	 * to the fact that internally, the calendar always calls the
	 * timeline_start each time it must refresh the view, we have to do the same
	 * "hack" as in original timeline method, which is to send back the max of
	 * (day_start + x_step * x_start) and the result of the closest shift
	 * operation. In other words, if the x_start is at 16:00 and the closest
	 * shift is before (at 15:30 for example), the date return is 16:00.
	 * 
	 * @param date
	 * @returns {Date}
	 */
	// Date timelineStart(Date)
	timelineStart : function(date) {
		return this.adjustcalendarXStart(date);
	},

	/**
	 * Add one step to the timeline. It is equivalent to press previous or next
	 * buttons in the header of the timeline. The method is redefined to
	 * navigate between shifts instead of days. So, previous or next shift start
	 * date are sent back. Again, we need to keep the semantic of the original
	 * method, that's why we adjust the x_start value according to the date
	 * computed.
	 * 
	 * @param date
	 * @param step
	 * @param mode
	 * @returns {Date}
	 */
	// Date timelineAddStep(Date, int, String)
	timelineAddStep : function(date, step, mode) {
		
		
//		var oFormatter = airbus.mes.calendar.util.util.Formatter;	not used
		if (this.shifts.length === 0)
		return calendar.date.add_timeline_old(date, step, mode);

		var c = this.closestShift(airbus.mes.calendar.util.ShiftManager.currentShiftStart);

		if ( this.dayDisplay ) {
		
					
				var a = c; 
				var dNewShift;
				
				while (!dNewShift) {
				
				if ( a >= this.shifts.length) {
					dhtmlx.message({
						id: "lastShiftDHTMLX",
						text: airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("LastShiftReached"),
						expire: 2000
					});
					return date;
					
					}
				if (a < 0) {
					dhtmlx.message({
						id: "firstShiftDHTMLX",
						text: airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("FirstShiftReached"),
						expire: 2000
					});
					return date;
				} 
					if ( this.shifts[c].day === this.shifts[a].day ) {
						
						a = a + step ;
						
					} else {
						
						dNewShift = this.shifts[a].StartDate; 

//						Feedback the date to the date picker 
						this.setCalendarDate(dNewShift);
						
						return dNewShift;
					}
				}
				
			
		} else {
					
		if (c < 0) {
			c = this.shifts.length - 1; // take last shift
		}
		if (c + step >= this.shifts.length) {
			dhtmlx.message({
				id: "lastShiftDHTMLX",
				text: airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("LastShiftReached"),
				expire: 2000
			});
			return this.shifts[c].StartDate;
		}
		if (c + step < 0) {
			dhtmlx.message({
				id: "firstShiftDHTMLX",
				text: airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("FirstShiftReached"),
				expire: 2000
			});
			return date;
		}

		}
			
		var d = calendar.date.copy(this.shifts[c + step].StartDate);
			
				
		this.currentFullDateSwipping = d;
		
		this.step = 0;
		
		
//		Feedback the date to the date picker 
       this.setCalendarDate(d);
		
		return d;

	},
	setCalendarDate : function (oDate){
		var oCalendar = sap.ui.getCore().byId("datePickerFragment--oCalendar");
		if(oCalendar && oCalendar.getAggregation("selectedDates")[0]) {
			oCalendar.getAggregation("selectedDates")[0].setStartDate(oDate);			
		}
	},
	/**
	 * Provide the end date of the previous shift rounded to the nearest
	 * timeline cell.
	 * 
	 * @param date
	 * @returns {Date}
	 */
	// Date endOfPreviousShift( Date )
	endOfPreviousShift : function(date) {
		var c = this.closestShift(date) - 1;

		if (c < 0) {
			dhtmlx.message({ id: "firstShiftDHTMLX", text: airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("FirstShiftReached"), expire: 2000 });
			return (this.shifts[0].StartDate); // take first shift
		}

		var d = this.roundDate(this.shifts[c].EndDate);

		// if the shift ends at a round date, remove x_step minutes
		if (d.valueOf() === (this.shifts[c].EndDate).valueOf()) {
			d = calendar.date.add(d, -calendar.matrix.timeline.x_step,"minute");
		}

		return d;

	},

	
	/**
	 * Rounds the given date to the lowest or highest unit. For example, if
	 * x_step = 30 and date is 16:35, it will return 16:30 (low) or 17:00
	 * (high).
	 * 
	 * @param {Date}
	 *            date, the date the round
	 * @param {int}
	 *            up, up=0 for lower bound or up=1 for upper bound
	 * @returns {Date}
	 */
	roundDate : function(date, up) {
		
		up = up ? up : 0;
		var d = calendar.date.copy(date);

		if ((d.getMinutes() * 60 + d.getSeconds())
				% (calendar.matrix.timeline.x_step * 60) !== 0) {
			d.setMinutes(calendar.matrix.timeline.x_step
					* (Math.floor((d.getMinutes() * 60 + d.getSeconds())
							/ (calendar.matrix.timeline.x_step * 60))
							+ up));
			d.setSeconds(0);
		}

		return d;

	},

	/**
	 * Adjust the x_start value of calendar timeline matrix. This is necessary
	 * in order not to break existing behaviour of the timeline.
	 * 
	 * @param date
	 */
	adjustcalendarXStart : function(date) {

		// XXX probably better with Math.floor, still I keep it like that
		// because i'm afraid of the shifts ending at 11:59:59.
		// Maybe that's unnecessary (to be evaluated)
//		if ( !this.firstTimelineStart ) {
//			calendar.matrix.timeline.x_start = Math.round((date.getHours() * 60 + date.getMinutes()) / calendar.matrix.timeline.x_step);
//		};
		
		// /////////////////////////////////////////////////
		// Recalculate X_SIZE to display X Intervals
		// /////////////////////////////////////////////////
		calendar.xy.scroll_width=20;
		
		var c = this.closestShift(new Date(date));
		if ( c === -1 ){ return date; }
		this.current_shift = this.shifts[c];
		this.current_day = this.shifts[c].day;
		this.current_Date = this.shifts[c].StartDate;
		this.currentShiftStart = this.shifts[c].StartDate;
		this.currentShiftEnd = this.shifts[c].EndDate;
		this.currentFullDate = this.shifts[c].StartDate;
		this.currentShiftIndex = c;
		
		var currMotn = this.current_Date.getMonth() + 1;
		if (currMotn<10) {currMotn = "0"+currMotn;}
		var curDay = this.current_Date.getDate();
		if (curDay<10) {curDay = "0"+curDay;}
		this.current_Date = this.current_Date.getFullYear()+"-"	+currMotn+"-"+curDay;	
		
//		var nb_int = calendar.matrix.timeline.x_length; not used
//		var end_int_date; not used
//		var w_int = 0; not used
//		var previous_shift_end; not used
//		var shift_begin = date; not used
//		var shift_end = this.shifts[c].EndDate; not used
		
		if ( this.shiftDisplay ) {
		
		    calendar.matrix.timeline.x_size = Math.ceil((new Date(this.shifts[c].EndDate) - new Date(this.shifts[c].StartDate))/1000/60/30);
	
		    var date = new Date(this.shifts[c].StartDate).setMinutes(0);
    
		    return new Date( date );
		    
		}
		
		/** Display all the shift of current day */ 
		if ( this.dayDisplay ) {
		
						
			calendar.matrix.timeline.x_size = 0;
			var a = c;
			var b =  c;
			
			/** search EnDate of the Day of the current shift */ 
			while (!fEndDate) {
				
			if ( a < this.shifts.length ) {	
				if ( this.shifts[a].day === this.current_day ) {
					
					a += 1 ;
				} else {
					
					var fEndDate = Date.parse(new Date(this.shifts[a-1].EndDate));
					
				}
				
			} else {
			
				var fEndDate = Date.parse(new Date(this.shifts[this.shifts.length - 1].EndDate));
				
			} }
			/** search StartDate of the Day of the current shift */ 
			while (!fStartDate) {
			
			if ( b >= 0) {
						
				if ( this.shifts[b].day === this.current_day ) {
					
					b -= 1 ;
					} else {
					
						var fStartDate =  Date.parse(new Date(this.shifts[b+1].StartDate));
						this.current_shift = this.shifts[b+1];
							}
				
					} else {
				
				var fStartDate =  Date.parse(new Date(this.shifts[0].StartDate));
				this.current_shift = this.shifts[0];
				}
			}
			
//			/** Permit to know how many time is hidden by the ignore timeline and add timeline.x_size necessary to display real axis 
//			    lenght of a day */
//			var fTotalMS = 0;
//			
//			for ( var i = b; i < a -2; i += 1) {
//					
//				fTotalMS += this.shifts[i+2].StartDate - this.shifts[i + 1].EndDate;
//				
//			}
			/**Compute the number of 1hour step needed to display all the time between start and day of the current day */ 
		    calendar.matrix.timeline.x_size += Math.ceil((new Date(fEndDate) - new Date(fStartDate))/1000/60/60);
		   // calendar.matrix.timeline.x_size += Math.ceil(fTotalMS/1000/60/60);

			return new Date (new Date ( fStartDate ).setMinutes(0));
		    
			}
		

		if ( airbus.mes.calendar.util.ShiftManager.taktDisplay ) {
			
			var dEndDate=airbus.mes.calendar.util.Formatter.jsDateFromDayTimeStr(airbus.mes.settings.ModelManager.taktEnd);
			var dStartDate=airbus.mes.calendar.util.Formatter.jsDateFromDayTimeStr(airbus.mes.settings.ModelManager.taktStart);
			
			calendar.matrix.timeline.x_size = 0;
			 
	        var sTime = airbus.mes.calendar.util.Formatter.jsDateFromDayTimeStr(airbus.mes.settings.ModelManager.taktEnd) - airbus.mes.calendar.util.Formatter.jsDateFromDayTimeStr(airbus.mes.settings.ModelManager.taktStart)
	       
	        // Takt is over one day
	        if ( Math.abs(sTime) > 86400000 ) {
		        // Takt is over one day step is done by day
	        	calendar.matrix.timeline.x_size += Math.ceil((dEndDate - dStartDate)/1000/60/60/24);
				return dStartDate.setHours(0);
	        	
	        } else  {
		        // Takt is over one day step is done by hour
	        	calendar.matrix.timeline.x_size += Math.ceil((dEndDate - dStartDate)/1000/60/60);
				return dStartDate;
	        	
	        }
			

		}
		
	},

	/**
	 * Is the given date part of the timeline (in other words, is it inside a
	 * shift)?
	 * 
	 * @param date
	 * @returns {Boolean}
	 */
	isDateIgnored : function (date) {

		if (this.shifts.length === 0)
			return false;
		
		var iMin = 0,
			iMax = this.shifts.length - 1,
			iMed;
		
		var d1, d2;
		
		// this is for dichotomic search
		while (true) {
			
			iMed = Math.floor(iMin + ((iMax-iMin) / 2));
			
			// Round date to the previous bound (based on x_step)
			// This means, if d1 = 16:18 and step = 15 min, d1 => 16:15
			d1 = this.roundDate(this.shifts[iMed].StartDate, 0);
			// Round date to the next bound (based on x_step)
			// This means, if d2 = 16:18 and step = 15 min, d2 => 16:30
			d2 = this.roundDate(this.shifts[iMed].EndDate, 1);
			
			if (d1 > date) {
				if (iMin === iMed) {
			//		 calendar.matrix.timeline.x_size += 1; 
					return true;
				} else {
					iMax = iMed - 1;
				}
			} else if (d2 <= date) {
				// Very important, condition is less than *or equal*
				// to not show the next 15 minutes in case a shift
				// ends at 19:15 for example.
				if (iMed === iMax) {
				//	calendar.matrix.timeline.x_size += 1; 
					return true;
				} else {
					iMin = iMed + 1;
				}
			} else {
				return false;
			}			
			
		}
		
	},
	
	/**
	 * Mark dates between shifts so that we have a visual indicator of the
	 * non-worked periods. This method directly register non-worked period in
	 * the calendar.
	 */
	addMarkedShifts : function() {

		var aShiftBreak = airbus.mes.calendar.util.GroupingBoxingManager.shiftBreakHierarchy;
		
		if (this.shifts.length === 0)
			return; // do nothing
		
		var d1, d2, d3, d4, d6, d7, d8, d9;
		
		d2 = aShiftBreak[0].StartDate;
		d1 = calendar.date.copy(d2);
		d1.setMinutes(d1.getMinutes() - calendar.matrix.timeline.x_size
				* calendar.matrix.timeline.x_step);

		calendar.addMarkedTimespan({
			start_date : d1,
			css : "offtime"
		});

		// pause time
		for (var index = 0; index < aShiftBreak.length - 1; ++index) {
			// Display the border of the start pause of the shift
			d1 = aShiftBreak[index].EndDate;
			// Display the border of the end pause of the shift
			d2 = aShiftBreak[index + 1].StartDate;
			calendar.addMarkedTimespan({
				start_date : d1,
				end_date : d2,
				css : "offtime"
			});
		}
	
		// start and end of shift
		for (var index = 0; index < this.shifts.length - 1; ++index) {
			
			// Display the border of the start shift
			d3 = this.shifts[index].StartDate;
			d4 = calendar.date.copy(d3);
			// +5 for see the border (Two different dates)
			d4.setMinutes(d4.getMinutes() + 5);
			calendar.addMarkedTimespan({
				start_date : d3,
				end_date : d4,
				css : "begin_shifht"
			});
			
			//after the first step
			if (index > 0){
				// If different date show border of the start shift
				//EndDate of current shift
				d8 =  this.shifts[index].EndDate;
				//StartDate of next shift
				d9 = this.shifts[index+1].StartDate;
				//console.log("d8 :"+  (d8.getTime() + 1000) +" ou " + d8);
				//console.log("d9 :"+  d9.getTime() +" ou " + d9);
				if((d8.getTime() + 1000) != d9.getTime()){
					calendar.addMarkedTimespan({
						start_date : d8,
						end_date : d9,
						css : "end_shifht"
					});
				}
			}
		}
		
		
		
		
		//A quoi sert ce code ??
		//
		//		d1 = aShiftBreak[aShiftBreak.length - 1].EndDate;
		//		
		//		d2 = calendar.date.copy(d1);
		//		d2.setMinutes(d2.getMinutes() + calendar.matrix.timeline.x_size * calendar.matrix.timeline.x_step);
		//		calendar.addMarkedTimespan({
		//			start_date : d1,
		//			end_date : d2,
		//			css : "offtime"
		//		});
		//		
		//		d3 = this.shifts[this.shifts.length - 1].StartDate;
		//		d4 = calendar.date.copy(d3);
		//		d4.setMinutes(d4.getMinutes() + 5);
		//		calendar.addMarkedTimespan({
		//			start_date : d3,
		//			end_date : d4,
		//			css : "begin_shifht"
		//		});
		
		// Add maker for takt time
		var d6 = airbus.mes.calendar.util.Formatter.jsDateFromDayTimeStr(airbus.mes.settings.ModelManager.taktStart);
		d6.setMinutes(d6.getMinutes() + 5);
		
		calendar.addMarkedTimespan({
			start_date : airbus.mes.calendar.util.Formatter.jsDateFromDayTimeStr(airbus.mes.settings.ModelManager.taktStart),
			end_date : d6,
			css : "taktMarker"
		});
		
		var d7 = airbus.mes.calendar.util.Formatter.jsDateFromDayTimeStr(airbus.mes.settings.ModelManager.taktEnd);
		d7.setMinutes(d7.getMinutes() + 5);
		
		calendar.addMarkedTimespan({
			start_date : airbus.mes.calendar.util.Formatter.jsDateFromDayTimeStr(airbus.mes.settings.ModelManager.taktEnd),
			end_date : d7,
			css : "taktMarker"
		});
	},
	
	/**
	 * Update view of calendar with the previous selected Date or rescheduling
	 * Date
	 * 
	 * @param {STRING}
	 *            sPreviousDate, date to pass to the function,
	 */
	updateMyGanttPreviousShift : function(sPreviousDate) {
		
		calendar.updateView(new Date(sPreviousDate));
		
	},
	
	/**
	 * Add update of shift selection when swiping in calendar of the initial event of calendar
	 */
	next : function(e, t) {
		
		if ( !airbus.mes.calendar.util.ShiftManager.taktDisplay ) {

        calendar.setCurrentView(calendar.date.add(calendar.date[calendar._mode + "_start"](calendar._date), t || 1, calendar._mode));

		}
    },
	/**
	 * 
	 * 
	 *  
	 */
	// Swipe function 
	timelineSwip : function (side) {
//		XXX : keep needed later
//		var oFormatter = airbus.mes.calendar.util.util.Formatter;
		
//		var oFormatter = airbus.mes.calendar.util.util.Formatter;
//		
//		this.step = -1;
//		var step;
//		var dNewDate;
//
//		if (side === "right") {
//			step = calendar.matrix.timeline.x_step;
//			dNewDate =  Date.parse(calendar._min_date) + step*1000*60;
//		} else {
//			step = -calendar.matrix.timeline.x_step;
//		}

//		var ndate = calendar.date.add(calendar.date.timeline_start(calendar._min_date), step, "minute");

//		if (side === "left" && this.isDateIgnored(ndate)) {
//			ndate = this.endOfPreviousShift(ndate);
//		} else if (side === "right" && ndate > oFormatter.jsDateFromDayTimeStr(this.shifts[this.shifts.length-1].EndDate)) {
//			dhtmlx.message({ id: "lastShiftDHTMLX", text: "Last Shift Reached", expire: 2000 });
//			return 
//		}
//		this.fSwipe = true;
//		
//		this.step = -1;
//		var step;
//		var dNewDate;
//
//		if (side === "right") {
//			step = calendar.matrix.timeline.x_step;
//			dNewDate =  Date.parse(calendar._min_date) + step*1000*60;
//		} else {
//			step = -calendar.matrix.timeline.x_step;
//		}
//
////		var ndate = calendar.date.add(calendar.date.timeline_start(calendar._min_date), step, "minute");
//
////		if (side === "left" && this.isDateIgnored(ndate)) {
////			ndate = this.endOfPreviousShift(ndate);
////		} else if (side === "right" && ndate > oFormatter.jsDateFromDayTimeStr(this.shifts[this.shifts.length-1].EndDate)) {
////			dhtmlx.message({ id: "lastShiftDHTMLX", text: "Last Shift Reached", expire: 2000 });
////			return 
////		}
//		this.fSwipe = true;
////		
////		&& this.isDateIgnored(dNewDate)
//		if ( side === "right"  ) {
//			
//			//this.adjustcalendarXStart(new Date(dNewDate));
//		&& this.isDateIgnored(dNewDate)
//		if ( side === "right"  ) {
			
			//this.adjustcalendarXStart(new Date(dNewDate));
//			calendar.setCurrentView(new Date(dNewDate));
//			
//		} 
		
	
		
		
		//ndate = this.adjustcalendarXStart(ndate);
//		this.currentFullDateSwipping = ndate;
		
//		calendar.setCurrentView(ndate);

	},
	

}

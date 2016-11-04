"use strict";

jQuery.sap.declare("airbus.mes.stationtracker.ShiftManager");

airbus.mes.stationtracker.ShiftManager = {
    
	firstTimelineStart : undefined,
	
	dayDisplay : undefined,
	shiftDisplay :true,
	fSwipe: false,
	//Variables for shift combobox Day/Shit view
	BoxSelected : 0,
	ShiftSelected : {},
	//Array where is stock Id of marker display on the gantt
	ShiftMarkerID :[],
	
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
	 * attach them to Scheduler events.
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
				return iMed;
			} else if (date < dPrev) {
				iMax = iMed - 1;
			} else {
				return iMed;
			}			
			
		}
		
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
		return scheduler.templates.day_date(dateStart)
				+ (t >= 0 ? (" - " + this.shifts[t].shiftName) : "");
	},

	/**
	 * From the given date, compute the start of the timeline. Usually, the
	 * start of the timeline is at the start of the closest shift. However, due
	 * to the fact that internally, the scheduler always calls the
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
		return this.adjustSchedulerXStart(date);
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
		
		
		var oFormatter = airbus.mes.stationtracker.util.Formatter;
		if (this.shifts.length === 0)
		return scheduler.date.add_timeline_old(date, step, mode);

		var c = this.closestShift(airbus.mes.stationtracker.ShiftManager.currentShiftStart);

		if ( this.dayDisplay ) {
		
					
				var a = c; 
				var dNewShift;
				
				while (!dNewShift) {
				
				if ( a >= this.shifts.length)
					{
					dhtmlx.message({
						id: "lastShiftDHTMLX",
						text: "Last Shift Reached",
						expire: 2000
					});
					return date;
					
					}
				if (a < 0) {
					dhtmlx.message({
						id: "firstShiftDHTMLX",
						text: "First Shift Reached",
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
				text: "Last Shift Reached",
				expire: 2000
			});
			return date;
		}
		if (c + step < 0) {
			dhtmlx.message({
				id: "firstShiftDHTMLX",
				text: "First Shift Reached",
				expire: 2000
			});
			return date;
		}

		}
			
		var d = scheduler.date.copy(this.shifts[c + step].StartDate);
			
				
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
			dhtmlx.message({ id: "firstShiftDHTMLX", text: "First Shift Reached", expire: 2000 });
			return (this.shifts[0].StartDate); // take first shift
		}

		var d = this.roundDate(this.shifts[c].EndDate);

		// if the shift ends at a round date, remove x_step minutes
		if (d.valueOf() === (this.shifts[c].EndDate).valueOf()) {
			d = scheduler.date.add(d, -scheduler.matrix.timeline.x_step,"minute");
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
		var d = scheduler.date.copy(date);

		if ((d.getMinutes() * 60 + d.getSeconds())
				% (scheduler.matrix.timeline.x_step * 60) !== 0) {
			d.setMinutes(scheduler.matrix.timeline.x_step
					* (Math.floor((d.getMinutes() * 60 + d.getSeconds())
							/ (scheduler.matrix.timeline.x_step * 60))
							+ up));
			d.setSeconds(0);
		}

		return d;

	},

	/**
	 * Adjust the x_start value of scheduler timeline matrix. This is necessary
	 * in order not to break existing behaviour of the timeline.
	 * 
	 * @param date
	 */
	adjustSchedulerXStart : function(date) {

		// XXX probably better with Math.floor, still I keep it like that
		// because i'm afraid of the shifts ending at 11:59:59.
		// Maybe that's unnecessary (to be evaluated)
//		if ( !this.firstTimelineStart ) {
//			scheduler.matrix.timeline.x_start = Math.round((date.getHours() * 60 + date.getMinutes()) / scheduler.matrix.timeline.x_step);
//		};
		
		// /////////////////////////////////////////////////
		// Recalculate X_SIZE to display X Intervals
		// /////////////////////////////////////////////////
		var c = this.closestShift(new Date(date));
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
		
		var nb_int = scheduler.matrix.timeline.x_length;
		var end_int_date;
		var w_int = 0;
		var previous_shift_end;
		var shift_begin = date;
		var shift_end = this.shifts[c].EndDate;
		
		if ( this.shiftDisplay ) {
		
		    scheduler.matrix.timeline.x_size = Math.ceil((new Date(this.shifts[c].EndDate) - new Date(this.shifts[c].StartDate))/1000/60/30);
	
		    var date = new Date(this.shifts[c].StartDate).setMinutes(0);

//			Manage display of selected shift
			var oSelectShift = sap.ui.getCore().byId("stationTrackerView--selectShift");
			var oShiftManager = airbus.mes.stationtracker.ShiftManager;
			oSelectShift.setSelectedKey(oShiftManager.shifts[oShiftManager.currentShiftIndex].shiftName);
		    
		    return new Date( date );
		    
		}
		
		/** Display all the shift of current day */ 
		if ( this.dayDisplay ) {
		
						
			scheduler.matrix.timeline.x_size = 0;
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
			
			if ( b > 0) {
						
				if ( this.shifts[b].day === this.current_day ) {
					
					b -= 1 ;
					} else {
					
						var fStartDate =  Date.parse(new Date(this.shifts[b+1].StartDate));
						this.current_shift = this.shifts[b+1];
							}
				
					}
			else {
				
				var fStartDate =  Date.parse(new Date(this.shifts[b].StartDate));
				this.current_shift = this.shifts[b];
				}
			}
			
			/** Permit to know how many time is hidden by the ignore timeline and add timeline.x_size necessary to display real axis 
			    lenght of a day */
			var fTotalMS = 0;
			
			for ( var i = b; i < a -2; i += 1) {
					
				fTotalMS += this.shifts[i+2].StartDate - this.shifts[i + 1].EndDate;
				
			}
			/**Compute the number of 1hour step needed to display all the time between start and day of the current day */ 
		    scheduler.matrix.timeline.x_size += Math.ceil((new Date(fEndDate) - new Date(fStartDate))/1000/60/60);
		    scheduler.matrix.timeline.x_size += Math.ceil(fTotalMS/1000/60/60);
		    	
			return new Date (new Date ( fStartDate ).setMinutes(0));
		    
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
			//		 scheduler.matrix.timeline.x_size += 1; 
					return true;
				} else {
					iMax = iMed - 1;
				}
			} else if (d2 <= date) {
				// Very important, condition is less than *or equal*
				// to not show the next 15 minutes in case a shift
				// ends at 19:15 for example.
				if (iMed === iMax) {
				//	scheduler.matrix.timeline.x_size += 1; 
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
	 * the scheduler.
	 */
	addMarkedShifts : function() {

		var aShiftBreak = airbus.mes.stationtracker.GroupingBoxingManager.shiftBreakHierarchy;
		
		if (this.shifts.length === 0)
			return; // do nothing
		
		var d1, d2, d3, d4, d5;
		
		d2 = aShiftBreak[0].StartDate;
		d1 = scheduler.date.copy(d2);
		d1.setMinutes(d1.getMinutes() - scheduler.matrix.timeline.x_size
				* scheduler.matrix.timeline.x_step);

		scheduler.addMarkedTimespan({
			start_date : d1,
			end_date : d2,
			css : "offtime"
		});

		for (var index = 0; index < aShiftBreak.length - 1; ++index) {
			d1 = aShiftBreak[index].EndDate;
			d2 = aShiftBreak[index + 1].StartDate;
			scheduler.addMarkedTimespan({
				start_date : d1,
				end_date : d2,
				css : "offtime"
			});
			
		}
	
		for (var index = 0; index < this.shifts.length - 1; ++index) {
			
			d3 = this.shifts[index].StartDate;
			d4 = scheduler.date.copy(d3);
			d4.setMinutes(d4.getMinutes() + 5);
			scheduler.addMarkedTimespan({
				start_date : d3,
				end_date : d4,
				css : "begin_shifht"
			});
		}

		d1 = aShiftBreak[aShiftBreak.length - 1].EndDate;
		d2 = scheduler.date.copy(d1);
		d2.setMinutes(d2.getMinutes() + scheduler.matrix.timeline.x_size
				* scheduler.matrix.timeline.x_step);
		scheduler.addMarkedTimespan({
			start_date : d1,
			end_date : d2,
			css : "offtime"
		});
		d3 = this.shifts[this.shifts.length - 1].StartDate;
		d4 = scheduler.date.copy(d3);
		d4.setMinutes(d4.getMinutes() + 5);
		scheduler.addMarkedTimespan({
			start_date : d3,
			end_date : d4,
			css : "begin_shifht"
		});

	},
	
	/**
	 * Update view of scheduler with the previous selected Date or rescheduling
	 * Date
	 * 
	 * @param {STRING}
	 *            sPreviousDate, date to pass to the function,
	 */
	updateMyGanttPreviousShift : function(sPreviousDate) {
		
		scheduler.updateView(new Date(sPreviousDate));
		
	},
	/**
	 * 
	 * 
	 *  
	 */
	// Swipe function 
	timelineSwip : function (side) {
//		XXX : keep needed later
//		var oFormatter = airbus.mes.stationtracker.util.Formatter;
		
//		var oFormatter = airbus.mes.stationtracker.util.Formatter;
//		
//		this.step = -1;
//		var step;
//		var dNewDate;
//
//		if (side === "right") {
//			step = scheduler.matrix.timeline.x_step;
//			dNewDate =  Date.parse(scheduler._min_date) + step*1000*60;
//		} else {
//			step = -scheduler.matrix.timeline.x_step;
//		}

//		var ndate = scheduler.date.add(scheduler.date.timeline_start(scheduler._min_date), step, "minute");

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
//			step = scheduler.matrix.timeline.x_step;
//			dNewDate =  Date.parse(scheduler._min_date) + step*1000*60;
//		} else {
//			step = -scheduler.matrix.timeline.x_step;
//		}
//
////		var ndate = scheduler.date.add(scheduler.date.timeline_start(scheduler._min_date), step, "minute");
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
//			//this.adjustSchedulerXStart(new Date(dNewDate));
//		&& this.isDateIgnored(dNewDate)
//		if ( side === "right"  ) {
			
			//this.adjustSchedulerXStart(new Date(dNewDate));
//			scheduler.setCurrentView(new Date(dNewDate));
//			
//		} 
		
	
		
		
		//ndate = this.adjustSchedulerXStart(ndate);
//		this.currentFullDateSwipping = ndate;
		
//		scheduler.setCurrentView(ndate);

	},
	

}

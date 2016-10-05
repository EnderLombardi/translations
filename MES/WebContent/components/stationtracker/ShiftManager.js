//"use strict";
jQuery.sap.declare("airbus.mes.stationtracker.ShiftManager")
airbus.mes.stationtracker.ShiftManager  = {
    
	firstTimelineStart : undefined,
	
	dayDisplay : undefined,
	shiftDisplay :true,
	fSwipe: false,
	truc : 0,
	//Variables for shift combobox Day view
	BoxSelected : 0,
	ShiftSelected : undefined,
	ShiftSelectedStart : undefined,
	ShiftSelectedEnd : undefined,
	//
	current_shift : undefined,
	currentShiftStart : undefined,
	current_Date : undefined,
	currentFullDate : undefined,
	currentShiftEnd : undefined,
	currentShiftStart : undefined,
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
	 * Compute the index in the shifts collection of the closest shift, which
	 * * ends after the given date. If nothing is found, return -1.
	 * 
	 * @param {Object}
	 *            ev - box selected
	 * @param {string}
	 *            ev.group_id - group id of selected box
	 * @param {string}
	 *            ev.box_id - box id of selected box
	 * @param {date}
	 *            ev.start_date - start date id of selected box
	 * @returns {MessageToast}
	 */
	saveReschedule : function(ev,bComputeShift) {
		
		if(ModelManager.sNewGroup==="Manually_Inserted")
			ModelManager.sManuallyInserted="yes";
		else
			ModelManager.sManuallyInserted="";
		
		if(bComputeShift){
		var sNewStartDate = this.shifts[this.closestShift(ev.start_date)].getStartDate();
		this.currentFullDate = sNewStartDate;
		}else{
		var sNewStartDate = ev.start_date;
		}
		
		sNewStartDate = ModelManager.transformRescheduleDate(sNewStartDate);
		
		ModelManager.setRescheduling(ev.group_id,ev.boxid,sNewStartDate,ev.init_groupId);
					
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
		
		// return day for IE not working. - 1 on month because 00 = january
		
		return new Date(day.slice(0,4),day.slice(5,7)-1,day.slice(8,10),day.slice(11,13),day.slice(14,16),day.slice(17,19));
		
		// return this.dateFormatter(day + " " + time);
	},

	/**
	 * Compute the index in the shifts collection of the closest shift, which
	 * ends after the given date. If nothing is found, return -1.
	 * 
	 * @param date
	 * @returns {Number}
	 */
	// int closestShift(Date)
	closestShift : function(date) {
		var oFormatter = airbus.mes.stationtracker.util.Formatter;

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
		var oFormatter = airbus.mes.stationtracker.util.Formatter;
//	
//		var d2 = new Date(date);
//		var startDate = d2;
//	 Compute start date according to 'old' timeline_start implementation
//		 var startDate =
//		 scheduler.date.add(scheduler.date.day_start(d2),scheduler.matrix.timeline.x_step
//		 * scheduler.matrix.timeline.x_start,
//		 scheduler.matrix.timeline.x_unit);

//		if (this.shifts.length === 0) {
//			//
//			startDate.setMinutes(0);
//			return startDate;
//		}

//		// Compute closest shift
//		var c = this.closestShift(d2);
//		if (c < 0) {
//			c = this.shifts.length - 1; // take last shift
//		}
		// send a copy in case the scheduler does some computation on it :)
//		var shiftStart = scheduler.date.copy(oFormatter.jsDateFromDayTimeStr(this.shifts[c].StartDate));

//		if ( this.firstTimelineStart ) {
//			shiftStart = this.adjustSchedulerXStart(shiftStart);
//			this.firstTimelineStart = false;
//		}

//		this.step += 1;
//		
//		if(this.step === 2){
//			
//					if (startDate.getMinutes() != 0 || startDate.getMinutes() != 30) {
//						startDate.setMinutes(0);
//						}
//		
//					if (shiftStart.getMinutes() != 0 || shiftStart.getMinutes() != 30) {
//						shiftStart.setMinutes(0);
//						}
//					this.step = 0;
//					}
//				
//		if (!this.fDraging) {
//			// return which one is the highest
//			return (shiftStart > startDate) ? shiftStart : startDate;
//		
//		}else {
//			
//			return startDate;

//		}
		
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
		
		airbus.mes.stationtracker.ShiftManager.BoxSelected = 0;	
//		sap
		var oFormatter = airbus.mes.stationtracker.util.Formatter;
		if (this.shifts.length === 0)
		return scheduler.date.add_timeline_old(date, step, mode);

		var c = this.closestShift(new Date(date));

		if ( this.dayDisplay ) {
		
					
				var a = c; 
				
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
						
						var dNewShift = this.shifts[a].StartDate; 
						this.adjustSchedulerXStart(dNewShift);
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
		
		d = this.adjustSchedulerXStart(d);
		this.step = 0;
		return d;

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
		var oFormatter = airbus.mes.stationtracker.util.Formatter;

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
	// Date roundDate( Date )
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
	// void adjustSchedulerXStart( Date )
	adjustSchedulerXStart : function(date) {
		var oFormatter = airbus.mes.stationtracker.util.Formatter;

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
		this.current_shift = this.shifts[c].shiftName;
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
		this.current_Date = this.current_Date.getFullYear()+"-"	+currMotn+"-"+curDay	
		
		var nb_int = scheduler.matrix.timeline.x_length;
		var end_int_date;
		var w_int = 0;
		var previous_shift_end;
		var shift_begin = date;
		var shift_end = this.shifts[c].EndDate;
		
//		while ( w_int < nb_int && c <= this.shifts.length - 1 ) {
//			if (previous_shift_end
//					&&  Math.floor((shift_begin - previous_shift_end)/1000) < scheduler.matrix.timeline.x_step * 60)
//				{
//				w_int -= 1;
//				};
//			var diff = {} ;
//			var tmp = shift_end - shift_begin;
//			tmp = Math.floor(tmp/1000);             // Nombre de secondes entre
//													// les 2 dates
//		    diff.sec = tmp % 60;                    // Extraction du nombre de
//													// secondes
//		    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie
//													// entière)
//		    diff.min = tmp % 60;                    // Extraction du nombre de
//													// minutes
//		    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures
//													// (entières)
//		    diff.hour = tmp % 24;                   // Extraction du nombre
//													// d'heures
//		    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
//		    diff.day = tmp;
//			
//		    var w_int_left = Math.round(diff.day * 24*(60/scheduler.matrix.timeline.x_step) + diff.hour * (60/scheduler.matrix.timeline.x_step) + diff.min / scheduler.matrix.timeline.x_step);
//		    if (w_int + w_int_left < nb_int) {
//		    	w_int += w_int_left;
//		    	c+= 1;
//		    	if (c <= this.shifts.length - 1) {
//		    	previous_shift_end	= shift_end;
//		    	shift_begin = oFormatter.jsDateFromDayTimeStr(this.shifts[c].StartDate);
//				shift_end = oFormatter.jsDateFromDayTimeStr(this.shifts[c].EndDate);
//		    	};
//		    } else {
//		    	var w_int_end = nb_int - w_int;
//		    	end_int_date = new Date(shift_begin.getTime() + w_int_end*scheduler.matrix.timeline.x_step*60000);
//		    	w_int += w_int_left; 
//		    };
//		};
//		
//		if (w_int < nb_int) {
//			date = new Date(date.getTime() - scheduler.matrix.timeline.x_step*60000);
//			this.adjustSchedulerXStart(date);
//			return date;
//		} else {
//		var tmp = end_int_date - date; 
//	    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les
//												// 2 dates
//	    diff.sec = tmp % 60;                    // Extraction du nombre de
//												// secondes
//	    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie
//												// entière)
//	    diff.min = tmp % 60;                    // Extraction du nombre de
//												// minutes
//	    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
//	    diff.hour = tmp % 24;                   // Extraction du nombre d'heures
//	    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
//	    diff.day = tmp;
//	    
//	    scheduler.matrix.timeline.x_size = Math.round(diff.day *24*(60/scheduler.matrix.timeline.x_step) + diff.hour *(60/scheduler.matrix.timeline.x_step) + diff.min / scheduler.matrix.timeline.x_step );
//	    return date;
//	    
//		};

//		if ( this.firstTimelineStart ) {
//			date  = oFormatter.jsDateFromDayTimeStr(this.shifts[c].StartDate);
//			this.firstTimelineStart = false;
//		};
//		
		if (this.fSwipe) {

			this.truc += 1;
			
			if (this.truc === 2) {
				
				this.truc = 0;
				this.fSwipe = false;
				return new Date(date);
			}

		}
			
		if ( this.shiftDisplay ) {
		
	    scheduler.matrix.timeline.x_size = Math.floor((new Date(this.shifts[c].EndDate) - new Date(this.shifts[c].StartDate))/1000/60/30);
	   
	    return new Date( this.shifts[c].StartDate );
	    
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
							}
				
					}
			else {
				
				var fStartDate =  Date.parse(new Date(this.shifts[b].StartDate));
				
				}
			}
			
			/** Permit to add + 1 on  scheduler.matrix.timeline.x_size for each hour non worker between the start and end of the
			the current day */
			for ( var i = fStartDate; i <= fEndDate; i += 1000*60*60 ) {
				
				this.isDateIgnored(new Date(i));
				
			}
			/**Compute the number of 1hour step needed to display all the time between start and day of the current day */ 
		    scheduler.matrix.timeline.x_size += Math.floor((new Date(fEndDate) - new Date(fStartDate))/1000/60/60);
		   
			return new Date ( fStartDate );
		    
			}
		
	},

	/**
	 * Is the given date part of the timeline (in other words, is it inside a
	 * shift)?
	 * 
	 * @param date
	 * @returns {Boolean}
	 */
	// boolean isDateIgnored(Date)
	isDateIgnored : function (date) {
		var oFormatter = airbus.mes.stationtracker.util.Formatter;

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
					 scheduler.matrix.timeline.x_size += 1; 
					return true;
				} else {
					iMax = iMed - 1;
				}
			} else if (d2 <= date) {
				// Very important, condition is less than *or equal*
				// to not show the next 15 minutes in case a shift
				// ends at 19:15 for example.
				if (iMed === iMax) {
					scheduler.matrix.timeline.x_size += 1; 
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
	// void addMarkedShifts( )
	addMarkedShifts : function() {
		var oFormatter = airbus.mes.stationtracker.util.Formatter;

		if (this.shifts.length === 0)
			return; // do nothing
		
		var d1, d2, d3, d4, d5;
		
		var d2 = this.shifts[0].StartDate;
		var d1 = scheduler.date.copy(d2);
		d1.setMinutes(d1.getMinutes() - scheduler.matrix.timeline.x_size
				* scheduler.matrix.timeline.x_step);

		scheduler.addMarkedTimespan({
			start_date : d1,
			end_date : d2,
			css : "offtime"
		});

		for (var index = 0; index < this.shifts.length - 1; ++index) {
			d1 = this.shifts[index].EndDate;
			d2 = this.shifts[index + 1].StartDate;
			scheduler.addMarkedTimespan({
				start_date : d1,
				end_date : d2,
				css : "offtime"
			});
			d3 = this.shifts[index].StartDate;
			d4 = scheduler.date.copy(d3);
			d4.setMinutes(d4.getMinutes() + 5);
			scheduler.addMarkedTimespan({
				start_date : d3,
				end_date : d4,
				css : "begin_shifht"
			});
		}

		d1 = his.shifts[this.shifts.length - 1].EndDate;
		d2 = scheduler.date.copy(d1);
		d2.setMinutes(d2.getMinutes() + scheduler.matrix.timeline.x_size
				* scheduler.matrix.timeline.x_step);
		scheduler.addMarkedTimespan({
			start_date : d1,
			end_date : d2,
			css : "offtime"
		});
		d3 = his.shifts[this.shifts.length - 1].StartDate;
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
	
//	/**
//	 * Parse the WorkListModel and some the progress and duration (IM) of each operation in the same group.
//	 * at the end it divide this number by 100 to transform it in hour.
//	 * If the selected group in gantt is AVL_Line,it call the computeAvlDoublon function to know if an operation
//	 * is in several group,if it the case the duration and progress are divided by the number of different group where is
//	 * the operation.
//	 *  
//	 */
//	computeDelayedHour : function() {
//		
//		this.GroupGantt = {};
//				
//		if (ModelManager.group_type === "dynamicAVL_Line") {
//
//			var aModel = sap.ui.getCore().getModel("WorkListAVLModel").oData.Rowsets.Rowset[0].Row;
//			ShiftManager.computeAvlDoublon();
//
//		} else {
//
//			var aModel = sap.ui.getCore().getModel("WorkListModel").oData.Rowsets.Rowset[0].Row;
//		}
//	
//		aModel.reduce(function(a, b, c) {
//
//		
//		
//			if (ModelManager.group_type === "dynamicAVL_Line") {
//				var fAvlDivider = ShiftManager.OperationAvlDoublon[b.workOrder + "/" + b.operation].nb;
//			} else {
//
//				var fAvlDivider = 1;
//			}
//
//			var sGroup = ModelManager.group_type;
//
//			if (sGroup === "dynamicAVL_Line") {
//
//				sGroup = "AVL_Line2";
//
//			}
//
//			if ( b.dynamicReschedStartDate != "---" ){
//				
//				if (!ShiftManager.GroupGantt[b[sGroup]]) {
//					ShiftManager.GroupGantt[b[sGroup]] = [{"progress" : 0 , "duration" : 0}];				
//				}
//							
//				ShiftManager.GroupGantt[b[sGroup]][0].progress += parseFloat(b.progress) / 100 / fAvlDivider;
//				if ( b.AVL_EndDateTime != "---" ) {
//					if( ShiftManager.jsDateFromDayTimeStr(b.AVL_EndDateTime) < new Date() )
//					ShiftManager.GroupGantt[b[sGroup]][0].duration += parseFloat(b.duration) / 100 / fAvlDivider;
//				}
//			}
//		})
//		
//		scheduler.updateView();
//	},

	/**
	 * Parse the WorkListModel and some the total of different group where is present the workorder/operation in case
	 * of AVL_Line group selected in gantt.
	 *  
	 */
	// Swipe function 
	timelineSwip : function (side) {
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



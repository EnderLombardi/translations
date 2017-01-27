"use strict";

sap.ui.controller("airbus.mes.calendar.controller.calendar", {
	
    onInit: function() {
        //if the page is not busy
        if (airbus.mes.shell.oView.byId('refreshTime').setBusyIndicatorDelay(0)){
            airbus.mes.shell.oView.byId('refreshTime').setEnabled(true);
        }
    },
    
    onBackPress : function(){
        nav.back();
    },
	
	 /***************************************************************************
     * Display the calendar in view mode "Shift" only on shift is represented
     * and the step of calendar is set to 30min
     *
     ****************************************************************************/
    onShiftPress : function() {

        airbus.mes.calendar.util.ShiftManager.shiftDisplay = true;
        airbus.mes.calendar.util.ShiftManager.dayDisplay = false;

        calendar.matrix['timeline'].x_unit = 'minute';
        calendar.matrix['timeline'].x_step = 30;
        calendar.matrix['timeline'].x_date = '%H:%i';
        calendar.templates.timeline_scale_date = function(date) {
            var func = calendar.date.date_to_str(calendar.matrix['timeline'].x_date);
            return func(date);
        };
        calendar.config.preserve_length = true;
        for (var i = 0; i < $("select[class='selectBoxStation']").length; i++) {
            $("select[class='selectBoxStation']").eq(i).remove();
        }

        calendar.updateView();

    },

    /***************************************************************************
     * Display the calendar in view mode "Day" all shift of the day are represented
     * and the step of calendar is set to 60min
     *
     ****************************************************************************/
    onDayPress : function() {

        airbus.mes.calendar.util.ShiftManager.shiftDisplay = false;
        airbus.mes.calendar.util.ShiftManager.dayDisplay = true;

        calendar.matrix['timeline'].x_unit = 'minute';
        calendar.matrix['timeline'].x_step = 60;
        calendar.matrix['timeline'].x_date = '%H:%i';

        calendar.templates.timeline_scale_date = function(date) {
            var func = calendar.date.date_to_str(calendar.matrix['timeline'].x_date);
            return func(date);
        };
        calendar.config.preserve_length = true;

        // Need this to update selected view and dont brake the behaviour of overflowtoolbar not needed if use Toolbar
        airbus.mes.calendar.oView.byId("buttonViewMode").rerender();
        airbus.mes.calendar.oView.byId("buttonViewMode").setSelectedKey("day");
       
        calendar.updateView();
    },
    
    /***************************************************************************
     * Display the calendar in view mode "Takt" all shift of the day are represented
     * and the step of calendar is set to 60min if takt < one day and step is
     * one day if takt is over one day
     *
     ****************************************************************************/
    onTaktPress : function() {

        airbus.mes.calendar.util.ShiftManager.shiftDisplay = false;
        airbus.mes.calendar.util.ShiftManager.dayDisplay = false;
        airbus.mes.calendar.util.ShiftManager.taktDisplay = true;
        
        var sTime = airbus.mes.calendar.util.Formatter.jsDateFromDayTimeStr(airbus.mes.settings.ModelManager.taktEnd) - airbus.mes.calendar.util.Formatter.jsDateFromDayTimeStr(airbus.mes.settings.ModelManager.takStart)
       
        // Takt is over one day
        if ( Math.abs(sTime) > 86400000 ) {
        	
        	calendar.matrix['timeline'].x_unit = 'day';
            calendar.matrix['timeline'].x_step = 1;
            calendar.matrix['timeline'].x_date = "%d/%m/%Y";
        		
        } else {
        	 
            calendar.matrix['timeline'].x_unit = 'minute';
            calendar.matrix['timeline'].x_step = 60;
            calendar.matrix['timeline'].x_date = '%H:%i';

        }

        calendar.templates.timeline_scale_date = function(date) {
            var func = calendar.date.date_to_str(calendar.matrix['timeline'].x_date);
            return func(date);
        };
        calendar.config.preserve_length = true;

        // Need this to update selected view and dont brake the behaviour of overflowtoolbar not needed if use Toolbar
        airbus.mes.calendar.oView.byId("buttonViewMode").rerender();
        airbus.mes.calendar.oView.byId("buttonViewMode").setSelectedKey("takt");
       
        calendar.updateView();
        

    },
    
	 datePick : function() {
	        if(airbus.mes.calendar.oView.datePicker === undefined){
	            airbus.mes.calendar.oView.datePicker = sap.ui.xmlfragment("calendardatePickerFragment","airbus.mes.calendar.fragments.datePickerFragment", airbus.mes.calendar.oView.getController());
	            airbus.mes.calendar.oView.addDependent(airbus.mes.calendar.oView.datePicker);
	        }
	        airbus.mes.calendar.oView.datePicker.openBy(airbus.mes.calendar.oView.byId("calendardateButton"));
	        
	        airbus.mes.calendar.oView.oCalendar = airbus.mes.calendar.oView.datePicker.getContent()[0];
	    },
	    
	    onSelectToday : function(){
	        airbus.mes.calendar.oView.oCalendar.removeAllSelectedDates();
	        airbus.mes.calendar.oView.oCalendar.displayDate(new Date());
	        airbus.mes.calendar.oView.oCalendar.addSelectedDate(new sap.ui.unified.DateRange({startDate: new Date()}));
	        airbus.mes.calendar.oView.getController().dateSelected();
	    },
	    /***************************************************************************
	     * Update the scheduler view When selected a new Date in the Date picker check also
	     * if the date selected is not in the shift hierarchy it display no shift exist
	     * 
	     * @returns {Obejct} Message Toast
	     *
	     ****************************************************************************/
	    dateSelected : function(){
//	        Check if current selected date corresponds to range of shift date
	        var dSeletectedDate = airbus.mes.calendar.oView.oCalendar.getSelectedDates()[0].getStartDate();
	        if(dSeletectedDate < airbus.mes.calendar.util.GroupingBoxingManager.minDate || dSeletectedDate > airbus.mes.calendar.util.GroupingBoxingManager.maxDate ) {
//	            If we are out of range, we display a message and don't close the date picker
	        	sap.m.MessageToast.show(airbus.mes.calendar.oView.getModel("calendarI18n").getProperty("noShiftExist"));
	        } else {
	            // Reselect the date in shift hierarchy to select the good date
	            var dDataSelected = airbus.mes.calendar.oView.oCalendar.getSelectedDates()[0].getStartDate();
	            var sYear = dDataSelected.getFullYear();
	            var sMounth = dDataSelected.getMonth() + 1;
	            var sDay = dDataSelected.getDate();

	            if ( sMounth < 10 ) {

	                sMounth = "0" + sMounth

	            }
	            sDay = dDataSelected.getDate();

	            if ( sDay < 10 ) {

	                sDay = "0" + sDay

	            }
	            // Search in the shift hierarshy the first date of first shift of the current date
	            var sDate = sYear.toString() + sMounth.toString()  + sDay.toString();
	            if(airbus.mes.calendar.util.GroupingBoxingManager.shiftHierarchy[sDate] === undefined){
	                sap.m.MessageToast.show(airbus.mes.calendar.oView.getModel("StationTrackerI18n").getProperty("noShiftExist"));            	
	            	return;
	            }
	    
	            // We feed the calendar with the new selected date
	            airbus.mes.calendar.oView.getController().updateDateLabel(airbus.mes.calendar.oView.oCalendar);
	            airbus.mes.calendar.oView.datePicker.close();
	            		            	
	            var sDateId = Object.keys( airbus.mes.calendar.util.GroupingBoxingManager.shiftHierarchy[sDate] )[0];
	            var dStartDate = airbus.mes.calendar.util.GroupingBoxingManager.shiftHierarchy[sDate][sDateId][0].StartDate;

	            calendar.updateView(dStartDate);
	        }
	    },
	    /***************************************************************************
	     * Update the value of date in top of calendar View when picking new date
	     * in date picker fragment 
	     *
	     ****************************************************************************/
	    updateDateLabel : function(oCalendar){
	        var oFormatddMMyyy = sap.ui.core.format.DateFormat.getInstance({pattern: "dd MMM yyyy", calendarType: sap.ui.core.CalendarType.Gregorian});
	        var oText = airbus.mes.calendar.oView.byId("dateLabel");
	        var aSelectedDates = oCalendar.getSelectedDates();
	        var oDate;
	        if (aSelectedDates.length > 0 ) {
	            oDate = aSelectedDates[0].getStartDate();
	            oText.setText(oFormatddMMyyy.format(oDate));
	        } else {
	            oText.setValue("No Date Selected");
	        }
	    },
	    /***************************************************************************
	     * Update the value of date in top of calendar View when picking
	     * swiping in gantt or on the first display
	     ****************************************************************************/
	    UpdateDateSwipe : function() {
	    	var oDate = new Date($("#calendar--calendar")[0].children[0].children[0].textContent.split("-")[0]);
	    	var oFormatddMMyyy = sap.ui.core.format.DateFormat.getInstance({pattern : "dd MMM yyyy",calendarType : sap.ui.core.CalendarType.Gregorian
	     });
	     var oText = airbus.mes.calendar.oView.byId("dateLabel");
	     oText.setText(oFormatddMMyyy.format(oDate));	
	    }, 
	    /***************************************************************************
	     * Filter the calendar by ressource Pool
	     *
	     ****************************************************************************/
	    filterByRessourcePool : function(oEvt) {
	    	
	    	airbus.mes.calendar.util.GroupingBoxingManager.computeCalendarHierarchy();
	    	
	    }
	
});

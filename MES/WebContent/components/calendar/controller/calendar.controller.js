"use strict";

sap.ui.controller("airbus.mes.calendar.controller.calendar", {
	
	onAfterRendering : function() {
		
		var jqToolbar = $(airbus.mes.calendar.oView.byId('toolbarcalendar').getDomRef());
        var jqStationTracker = $(airbus.mes.calendar.oView.byId('calendar').getDomRef());
        jqStationTracker.css('top', jqToolbar.offset().top);
		
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
	
	 datePick : function() {
	        if(airbus.mes.calendar.datePicker === undefined){
	            airbus.mes.calendar.datePicker = sap.ui.xmlfragment("calendardatePickerFragment","airbus.mes.calendar.fragments.datePickerFragment", airbus.mes.calendar.oView.getController());
	            airbus.mes.calendar.oView.addDependent(airbus.mes.calendar.datePicker);
	        }
	        airbus.mes.calendar.datePicker.openBy(airbus.mes.calendar.oView.byId("calendardateButton"));
	    },
	    
	    onSelectToday : function(){
	        airbus.mes.calendar.datePicker.removeAllSelectedDates();
	        airbus.mes.calendar.datePicker.displayDate(new Date());
	        airbus.mes.calendar.datePicker.addSelectedDate(new sap.ui.unified.DateRange({startDate: new Date()}));
	        airbus.mes.calendar.oView.getController().dateSelected();
	    },

	    dateSelected : function(){
//	        Check if current selected date corresponds to range of shift date
	        var dSeletectedDate = airbus.mes.calendar.datePicker.getSelectedDates()[0].getStartDate();
	        if(dSeletectedDate < airbus.mes.calendar.util.GroupingBoxingManager.minDate || dSeletectedDate > airbus.mes.calendar.util.GroupingBoxingManager.maxDate ) {
//	            If we are out of range, we display a message and don't close the date picker
	            sap.m.MessageToast.show("Selected date out of range");
	        } else {
	            // Reselect the date in shift hierarchy to select the good date
	            var dDataSelected = airbus.mes.calendar.datePicker.getSelectedDates()[0].getStartDate();
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
	            airbus.mes.calendar.oView.getController().updateDateLabel(airbus.mes.calendar.datePicker);
	            airbus.mes.calendar.datePicker.close();
	            	
	            	
	            var sDateId = Object.keys( airbus.mes.calendar.util.GroupingBoxingManager.shiftHierarchy[sDate] )[0];
	            var dStartDate = airbus.mes.calendar.util.GroupingBoxingManager.shiftHierarchy[sDate][sDateId][0].StartDate;

	            airbus.mes.calendar.util.ShiftManager.changeShift = false; //Airbus Defect #262 - Shift selection is not kept when changing date
	            calendar.updateView(dStartDate);
	            //airbus.mes.calendar.util.ShiftManager.selectFirstShift = true; //Airbus Defect #262 - Shift selection is not kept when changing date
	            airbus.mes.calendar.util.ModelManager.selectMyShift();
	            airbus.mes.calendar.util.ShiftManager.changeShift = true; //Airbus Defect #262 - Shift selection is not kept when changing date
	        }
	    },
	
});

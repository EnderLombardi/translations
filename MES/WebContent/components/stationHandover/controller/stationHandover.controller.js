"use strict";

sap.ui.controller("airbus.mes.stationHandover.controller.stationHandover", {
	
    onInit: function() {
//        //if the page is not busy
//        if (airbus.mes.shell.oView.byId('refreshTime').setBusyIndicatorDelay(0)){
//            airbus.mes.shell.oView.byId('refreshTime').setEnabled(true);
//        }
    
    },
    
    onBackPress : function(){
        nav.back();
    },
	
	
	 /***************************************************************************
     * Display the stationHandover in view mode "Shift" only on shift is represented
     * and the step of stationHandover is set to 30min
     *
     ****************************************************************************/
    onShiftPress : function() {

        airbus.mes.stationHandover.util.ShiftManager.shiftDisplay = true;
        airbus.mes.stationHandover.util.ShiftManager.dayDisplay = false;

        stationHandover.matrix['timeline'].x_unit = 'minute';
        stationHandover.matrix['timeline'].x_step = 30;
        stationHandover.matrix['timeline'].x_date = '%H:%i';
        stationHandover.templates.timeline_scale_date = function(date) {
            var func = stationHandover.date.date_to_str(stationHandover.matrix['timeline'].x_date);
            return func(date);
        };
        stationHandover.config.preserve_length = true;
        for (var i = 0; i < $("select[class='selectBoxStation']").length; i++) {
            $("select[class='selectBoxStation']").eq(i).remove();
        }

        stationHandover.updateView();

    },

});

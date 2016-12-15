"use strict";

jQuery.sap.declare("airbus.mes.shell.busyManager");

airbus.mes.shell.busyManager =  {
		
		//active spinner
		setBusy_Polypoly : function () {
            setTimeout(function() {
			    airbus.mes.polypoly.oView.setBusy(true);
		    }, 0);
        },

        //unactive spinner
        unsetBusy_Polypoly : function () {
            setTimeout(function() {
			    airbus.mes.polypoly.oView.setBusy(false);
		    }, 0);
        },

        //unactive spinner 15 sec after to avoid infinite spinner
        avoidInfiniteBusy_Polypoly : function () {
            setTimeout(function() {
			    airbus.mes.polypoly.oView.setBusy(false);
		    }, 15000);
        },
}
"use strict";

jQuery.sap.declare("airbus.mes.shell.busyManager");

airbus.mes.shell.busyManager =  {
		
        //active spinner
		setBusy : function (view, id) {
            setTimeout(function() { //setTimeout is a trick to permit setBusy to be effective, without it's not working
                if (!id){
			        view.setBusy(true);
                } else {
                    view.byId(id).setBusy(true);
                }
		    }, 0);
        },

        unsetBusy : function (view, id) {
            setTimeout(function() {
			    if (!id){
			        view.setBusy(false);
                } else {
                    view.byId(id).setBusy(false);
                }
		    }, 0);
        },

}
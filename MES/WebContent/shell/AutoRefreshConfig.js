"use strict";

jQuery.sap.declare("airbus.mes.shell.AutoRefreshConfig");

airbus.mes.shell.AutoRefreshConfig =  {
		
		mesRefreshActive : { 
				"value" : true //Automatic app refresh
			},

		base : {
				"timer":180 , 
				"useraction" : true 
			},

		stationTrackerView : { 
				"timer":180 , 
				"useraction" : true 
			},

		disruptiontrackerView : { 
				"timer":180 , 
				"useraction" : true 
			},
			
		disruptionKPIView : {
				"timer":120 , 
				"useraction" : false 
			}		
}
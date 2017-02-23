"use strict";

jQuery.sap.declare("airbus.mes.shell.AutoRefreshConfig");

airbus.mes.shell.AutoRefreshConfig = {

	// time to add if user action
	addtime : {
		"addtime" : 60
	},

	/*//Automatic app refresh
	mesRefreshActive : { 
			"value" : true 
		},
	
	// If not specified automatic refresh time
	base : {
				"timer":180 
		},*/

	////////////////////////////////////////////////////////////////////////	
	//  base : {														  //
	//		"timer":		default time for refresh page				  //
	//		"useraction" :  If one takes into account the user action 	  //
	//		"area" : 		function refresh zone						  //
	//	},																  //
	////////////////////////////////////////////////////////////////////////
	stationTrackerView : {
		"timer" : undefined,
		"useraction" : true,
		"area" : function() {
			return airbus.mes.shell.oView.getController().renderStationTracker()
		}
	},

	disruptiontrackerView : {
		"timer" : undefined,
		"useraction" : true,
		"area" : function() {
			return airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel();
		}
	},

	disruptionKPIView : {
		"timer" : undefined,
		"useraction" : false,
		"area" : function() {
			return airbus.mes.disruptionkpi.ModelManager.loadDisruptionKPIModel();
		}
	},

	idLinetracker : {
		"timer" : undefined,
		"useraction" : false,
		"area" : function() {
			return airbus.mes.linetracker.util.ModelManager.loadLinetrackerKPI();
		}
	},
	calendar : {
		"timer" : 180,
		"useraction" : false,
		"area" : function() {
			return airbus.mes.shell.oView.getController().renderCalendarTracker();
		}

	},
	stationHandoverView : {
		"timer" : 180,
		"useraction" : false,
		"area" : function() {
			return airbus.mes.shell.oView.getController().stationHandover();
		}

	}
}

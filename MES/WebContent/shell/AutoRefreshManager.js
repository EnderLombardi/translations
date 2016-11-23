"use strict";

jQuery.sap.declare("airbus.mes.shell.AutoRefreshManager");

airbus.mes.shell.AutoRefreshManager =  {
	
		
	autoRefresh: undefined,
	
	/**************************************************
	 * Set Refresh Interval based on configuration
	 */
	setInterval: function(viewName){
		
		var station = airbus.mes.settings.ModelManager.station;
		var defaultKey = "MES_REFRESH_DEF_VAL";
		
		switch(viewName){
		
		case "STATION_TRACKER":
			
			/**********************************************
			 * Set Window Interval
			 */
			this.autoRefresh = window.setInterval(
				airbus.mes.shell.oView.oController.renderStationTracker(),		// API reference 
				
				parseInt(
					airbus.mes.settings.AppConfManager.getConfiguration(		// Set interval time from configuration
						"REFRESH_STATION_TRACKER_"+station,		// Primary Key
						defaultKey							 	// Default Key
					)
				)*60000
			);
			break;
			
		case "DISRUPTION_TRACKER":
			
			/**********************************************
			 * Set Window Interval
			 */
			this.autoRefresh = window.setInterval(
				airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel(),	// API reference 
				
				parseInt(
					airbus.mes.settings.AppConfManager.getConfiguration(				// Set interval time from configuration
						"REFRESH_DISRUPTION_TRACKER_"+station,		// Primary Key
						defaultKey								 	// Default Key
					)
				)*60000
			);
			break;
			
			
		case "DISRUPTION_KPI":
			
			/**********************************************
			 * Set Window Interval
			 */
			this.autoRefresh = window.setInterval(
				airbus.mes.disruptiontracker.kpi.ModelManager.loadDisruptionKPIModel(),	// API reference 
				
				parseInt(
					airbus.mes.settings.AppConfManager.getConfiguration(				// Set interval time from configuration
						"REFRESH_DISRUPTION_KPI_"+station,		// Primary Key
						defaultKey							 	// Default Key
					)
				)*60000
			);
			break;

		}
		
	},
	
	
	clearInterval: function(){
		clearInterval(this.autoRefresh)
	}
	
}
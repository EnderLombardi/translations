"use strict";

jQuery.sap.declare("airbus.mes.shell.AutoRefreshManager");

airbus.mes.shell.AutoRefreshManager =  {
	
		
	autoRefresh: undefined,
	
	refreshInterval: undefined,
	
	viewName: undefined,	
	
	defaultKey : "MES_REFRESH_DEF_VAL",
	
	/**************************************************
	 * Set Refresh Interval based on configuration
	 */
	setInterval: function(viewName){
		
		var station = airbus.mes.settings.ModelManager.station;
		
		
		if(!viewName)
			viewName = nav.getCurrentPage().getId();
		
		this.viewName = viewName;
		
		switch(viewName){
		
		case "stationTrackerView":
			
			/**********************************************
			 * Set Window Interval
			 */
			this.refreshInterval = parseInt(
				airbus.mes.settings.AppConfManager.getConfiguration(		// Get interval time from configuration
					"REFRESH_STATION_TRACKER_"+station,		// Primary Key
					this.defaultKey							// Default Key
				), 10										// radix 10
			)*60000;
			
			//this.autoRefresh = window.setInterval(airbus.mes.shell.oView.oController.renderStationTracker, this.refreshInterval);
			
			break;
			
		case "disruptiontrackerView":
			
			/**********************************************
			 * Set Window Interval
			 */
			this.refreshInterval = parseInt(
				airbus.mes.settings.AppConfManager.getConfiguration(		// Get interval time from configuration
					"REFRESH_DISRUPTION_TRACKER_"+station,	// Primary Key
					this.defaultKey							// Default Key
				), 10										// radix 10
			)*60000;
			
			//this.autoRefresh = window.setInterval(airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel, this.refreshInterval);
			
			break;
			
			
		case "disruptionKPIView":
			
			/**********************************************
			 * Set Window Interval
			 */
			this.refreshInterval = parseInt(
				airbus.mes.settings.AppConfManager.getConfiguration(		// Get interval time from configuration
					"REFRESH_DISRUPTION_KPI_"+station,		// Primary Key
					this.defaultKey							// Default Key
				), 10										// radix 10
			)*60000;
			
			//this.autoRefresh = window.setInterval(airbus.mes.disruptiontracker.kpi.ModelManager.loadDisruptionKPIModel, this.refreshInterval);
			
			break;
		default : 
			
			
		}		
	},
	
	
	clearInterval: function(){
		clearInterval(this.autoRefresh)
	},
	

	pauseRefresh:function(){
		this.clearInterval();
	},
	
	resumeRefresh:function(){
		
	}
}

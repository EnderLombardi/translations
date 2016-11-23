"use strict";

jQuery.sap.declare("airbus.mes.shell.AutoRefreshManager");

airbus.mes.shell.AutoRefreshManager =  {
	
		
	autoRefresh: undefined,
	
	refreshInterval: undefined,
	
	refreshAPI: undefined,	
	
	defaultKey : "MES_REFRESH_DEF_VAL",
	
	/**************************************************
	 * Set Refresh Interval based on configuration
	 */
	setInterval: function(viewName){
		
		var station = airbus.mes.settings.ModelManager.station;
		
		
		if(!viewName)
			viewName = nav.getCurrentPage().getId();
		
		switch(viewName){
		
		case "stationTrackerView":
			
			/**********************************************
			 * Set Window Interval
			 */
			this.refreshAPI = airbus.mes.shell.oView.oController.renderStationTracker;
			this.refreshInterval = parseInt(
				airbus.mes.settings.AppConfManager.getConfiguration(		// Get interval time from configuration
					"REFRESH_STATION_TRACKER_"+station,		// Primary Key
					this.defaultKey							// Default Key
				)
			)*60000;
			break;
			
		case "disruptiontrackerView":
			
			/**********************************************
			 * Set Window Interval
			 */
			this.refreshAPI = airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModelr;
			this.refreshInterval = parseInt(
				airbus.mes.settings.AppConfManager.getConfiguration(		// Get interval time from configuration
					"REFRESH_DISRUPTION_TRACKER_"+station,	// Primary Key
					this.defaultKey							// Default Key
				)
			)*60000;
			break;
			
			
		case "disruptionKPIView":
			
			/**********************************************
			 * Set Window Interval
			 */
			this.refreshAPI = airbus.mes.disruptiontracker.kpi.ModelManager.loadDisruptionKPIModel;
			this.refreshInterval = parseInt(
				airbus.mes.settings.AppConfManager.getConfiguration(		// Get interval time from configuration
					"REFRESH_DISRUPTION_KPI_"+station,		// Primary Key
					this.defaultKey							// Default Key
				)
			)*60000;
			break;

		}
		
		
//		window.setInterval(this.autoRefreshAPI, this.refreshInterval);
//		
//		
//		
//		
//		window.setInterval(this.autoRefreshAPI, this.refreshInterval);
//		
//		
//		
//		
//		window.setInterval(this.autoRefreshAPI, this.refreshInterval);
		
		
		
	},
	
	autoRefreshAPI: function(){
		this.autoRefresh();
	},
	
	
	clearInterval: function(){
		clearInterval(this.autoRefresh)
	},
	

	pauseRefresh:function(){
		this.clearInterval();
	}
}

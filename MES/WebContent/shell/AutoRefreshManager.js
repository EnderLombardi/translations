"use strict";

jQuery.sap.declare("airbus.mes.shell.AutoRefreshManager");

airbus.mes.shell.AutoRefreshManager =  {
	
		
	autoRefresh: undefined,
	
	autoRefreshAPI: function(){},
	
	autoRefreshTimerFunc: undefined,
 
	viewName: undefined,	

	refreshInterval: undefined,
	lastRefreshTime: undefined,
	pauseTime: undefined,
	
	remianinTimeRefresher: undefined,
	
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
			
			this.autoRefreshAPI = airbus.mes.shell.oView.oController.renderStationTracker;
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
			
			this.autoRefreshAPI = airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel;
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
			
			this.autoRefreshAPI = airbus.mes.disruptiontracker.kpi.ModelManager.loadDisruptionKPIModel;
			//this.autoRefresh = window.setInterval(airbus.mes.disruptiontracker.kpi.ModelManager.loadDisruptionKPIModel, this.refreshInterval);
			
			break;
		default : 
			
			
		}
		
		this.autoRefreshTimerFunc = window.setInterval(this.autoRefreshTimer, this.refreshInterval);
		this.lastRefreshTime = 0;
		
	},
	
	
	clearInterval: function(){
		clearInterval(this.autoRefresh);
		clearInterval(this.autoRefreshTimerFunc);
	},
	

	pauseRefresh:function(){
		var d = new Date();
		this.pauseTime = d.getTime();		
		
		this.clearInterval();
	},
	

	resumeRefresh:function(){
		
		var remainingTime = this.refreshInterval - ( this.pauseTime - this.lastRefreshTime );
		
		this.remianinTimeRefresher = window.setInterval(
				function () {
					airbus.mes.shell.AutoRefreshManager.autoRefreshAPI(),
					clearInterval(airbus.mes.shell.AutoRefreshManager.remianinTimeRefresher);
					airbus.mes.shell.AutoRefreshManager.setInterval(airbus.mes.shell.AutoRefreshManager.viewName);
				},
				remainingTime
		);
		
	},
	
	autoRefreshTimer: function(){
		var d = new Date();
		this.lastRefreshTime = d.getTime();
	}
}

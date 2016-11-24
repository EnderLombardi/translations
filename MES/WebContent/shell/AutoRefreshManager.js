"use strict";

jQuery.sap.declare("airbus.mes.shell.AutoRefreshManager");

airbus.mes.shell.AutoRefreshManager =  {
	
		
	autoRefresh: undefined,
	
	autoRefreshAPI: function(){},
 
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
			)*1000;
			
			this.autoRefreshAPI = airbus.mes.shell.oView.oController.renderStationTracker;
			//this.autoRefresh = setInterval(airbus.mes.shell.oView.oController.renderStationTracker, this.refreshInterval);
			
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
			)*1000;
			
			this.autoRefreshAPI = airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel;
			//this.autoRefresh = setInterval(airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel, this.refreshInterval);
			
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
			)*1000;
			
			this.autoRefreshAPI = airbus.mes.disruptiontracker.kpi.ModelManager.loadDisruptionKPIModel;
			//this.autoRefresh = setInterval(airbus.mes.disruptiontracker.kpi.ModelManager.loadDisruptionKPIModel, this.refreshInterval);
			
			break;
		default : 
			
			
		}
		
		this.autoRefresh = setInterval(this.autoRefreshFunc, this.refreshInterval);
		this.lastRefreshTime = 0;
		
	},
	
	
	clearInterval: function(){
		clearInterval(airbus.mes.shell.AutoRefreshManager.autoRefresh);
	},
	

	pauseRefresh:function(){
		var d = new Date();
		this.pauseTime = d.getTime();		
		
		this.clearInterval();
	},
	

	resumeRefresh:function(){
		
		var remainingTime = this.refreshInterval - ( this.pauseTime - this.lastRefreshTime );
		
		remainingTime = remainingTime < 60000 ? 60000 : remainingTime;
		
		this.remianinTimeRefresher = setInterval(
				function () {
					airbus.mes.shell.AutoRefreshManager.autoRefreshAPI(),
					clearInterval(airbus.mes.shell.AutoRefreshManager.remianinTimeRefresher);
					airbus.mes.shell.AutoRefreshManager.setInterval(airbus.mes.shell.AutoRefreshManager.viewName);
				},
				remainingTime
		);
		
	},
	
	autoRefreshFunc: function(){
		
		// Store last refresh time
		var d = new Date();
		this.lastRefreshTime = d.getTime();
		
		// Call Auto Refresh API
		airbus.mes.shell.AutoRefreshManager.autoRefreshAPI()
		
	}
}

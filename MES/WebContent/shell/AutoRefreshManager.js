"use strict";

jQuery.sap.declare("airbus.mes.shell.AutoRefreshManager");

airbus.mes.shell.AutoRefreshManager =  {
	
	autoRefresh: undefined,
	
	autoRefreshAPI: function(){},
 
	viewName: undefined,	
	pauseTime: undefined,
	remainingTimeRefresher: undefined,
	refreshInterval: undefined,
	lastRefreshTime: undefined,
	lastRefreshTime2: undefined,
	pauseRefreshTime: undefined,
	globalRefreshTime : undefined,
	customRefreshTime : undefined,
	initDate : undefined,
	nowDate : undefined,
	timer : 0,
	
	defaultKey : "MES_REFRESH_DEF_VAL",
	
	/**
	*  Set Refresh Interval based on configuration
	*/
	
	setInterval: function(viewName){
		
		if(!airbus.mes.settings.AppConfManager._getConfiguration("MES_REFRESH_ACTIVE")){
			airbus.mes.shell.AutoRefreshManager.clearInterval();
			return;
		}
		
		var station = airbus.mes.settings.ModelManager.station;
		
		//get view name
		if(!viewName) viewName = nav.getCurrentPage().getId();
		this.viewName = viewName;
		
		switch(viewName){
			case "stationTrackerView":
				// value to decrease the timer show in the station tracker view
				// Get interval time from configuration (Primary Key, Default Key, radix 10)
				this.refreshInterval = parseInt(
						airbus.mes.settings.AppConfManager.getConfiguration("REFRESH_STATION_TRACKER_"+station, this.defaultKey), 10 
					);
				break;			
			case "disruptiontrackerView":
				this.refreshInterval = parseInt(
						airbus.mes.settings.AppConfManager.getConfiguration("REFRESH_DISRUPTION_TRACKER_"+station,this.defaultKey), 10														// radix 10
					);
				break;	
			case "disruptionKPIView":			
				this.refreshInterval = parseInt(
						airbus.mes.settings.AppConfManager.getConfiguration("REFRESH_DISRUPTION_KPI_"+station,this.defaultKey), 10														// radix 10
					);
				break;
			default:
		}
		
		// init function
		airbus.mes.shell.AutoRefreshManager.lastRefreshTimefct();
		airbus.mes.shell.AutoRefreshManager.dateNow();

		//this.autoRefreshAPI = airbus.mes.shell.oView.oController.renderStationTracker;
			
		// Button refresh
		this.autoRefresh = window.setInterval(function refreshTime(){
			
			var sVal = airbus.mes.shell.AutoRefreshManager; 
			//Difference in second between the two dates
			sVal.timer=Math.floor((sVal.dateNow()-sVal.lastRefreshTime2)/1000);
			//console.log(sVal.timer);
			
			if(sVal.timer < 60 ){
				airbus.mes.shell.oView.byId('refreshTime').setText(" Last Refresh : " + sVal.timer + "s");
			} else {
				airbus.mes.shell.oView.byId('refreshTime').setText(" Last Refresh : >" + Math.trunc(sVal.timer/60) + "min");
			}
			//refresh when times are equal
			if(sVal.timer%sVal.refreshInterval == 0 && sVal.timer !=0) {
				//change last Refresh Time 
				sVal.lastRefreshTimefct();
				//refresh
				airbus.mes.shell.oView.getController().renderStationTracker();
	            }
			sVal.timer++;
	    }, 1000);
						
		//this.autoRefresh = setInterval(this.autoRefreshFunc, this.refreshInterval);
		this.lastRefreshTime = 0;
	},
	
	///////////////////////////////////////////////////////////////////////////////////
	
	//Stops processing at regular intervals
	clearInterval: function(){
		clearInterval(airbus.mes.shell.AutoRefreshManager.autoRefresh);
	},
	
	// Date of last refresh time
	lastRefreshTimefct: function(){
		var sd = new Date();
		this.lastRefreshTime2 = sd.getTime();
		//console.log(" last Refresh Time : " + this.lastRefreshTime2);
		return this.lastRefreshTime2;
	},
	
	// Instant Date 
	dateNow: function(){
		var now = new Date();
		this.nowDate = now.getTime();
		//console.log(" Now Time : " + this.nowDate);
		return this.nowDate;
	},
	
	// if user action add 60s at the refresh time before refresh
	customTime: function() 	{
		return ( Math.floor( ((sVal.dateNow()-sVal.lastRefreshTime2)/1000)<60) ? 60 : (sVal.dateNow()-sVal.lastRefreshTime2)/1000 );
	},
	
	///////////////////////////////////////////////////////////////////////////////////
	
	pauseRefresh:function(){
		var d = new Date();
		this.pauseTime = d.getTime();	
		console.log(" pause date : " + this.pauseTime);
		this.clearInterval();
	},
	
	resumeRefresh:function(){
		// global time - time before pause
		var remainingTime = this.refreshInterval - ( this.pauseTime - this.lastRefreshTime );
		// If the remaining time is very small
		remainingTime = remainingTime < 60000 ? 60000 : remainingTime;
		
		this.remainingTimeRefresher = setInterval(
				function () {
					airbus.mes.shell.AutoRefreshManager.autoRefreshAPI(),
					clearInterval(airbus.mes.shell.AutoRefreshManager.remainingTimeRefresher);
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

"use strict";
jQuery.sap.declare("airbus.mes.disruptionkpi.ModelManager")
airbus.mes.disruptionkpi.ModelManager = {
	urlModel : undefined,
	
	oFilters:{
		line: "",
		station: "",
		msn: "",
		startDateTime: "",
		endDateTime: "",
		timeUnit: "Minutes"
	},
	
	//sStaion: "",

	init : function(core) {

		 airbus.mes.shell.ModelManager.createJsonModel(core,["TimeLostperAttribute","ParetoChartModel"]);
		
	    // Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.disruptionkpi.config.url_config");
		
	},
	
	
	setPreSelectionCriteria: function(){
	    
	    // Remove filters for Station Multi-Combo box
	    this.removeDuplicateStations();   
		if(sap.ui.getCore().byId("disruptiontrackerView--stationComboBox").getSelectedKey() == ""){
			this.oFilters.station= airbus.mes.settings.ModelManager.station;
		} else{
			this.oFilters.station= sap.ui.getCore().byId("disruptiontrackerView--stationComboBox").getSelectedKey();
		}
		
		this.removeDuplicateMSNs();
		this.oFilters.msn= sap.ui.getCore().byId("disruptiontrackerView--msnComboBox").getSelectedKey();
		
		this.oFilters.startDateTime= "";
		sap.ui.getCore().byId("disruptionKPIView--endDateTime").setDateValue(new Date());
		this.oFilters.endDateTime= sap.ui.getCore().byId("disruptionKPIView--endDateTime").getDateValue();
		
		// Line
		sap.ui.getCore().byId("disruptionKPIView--lineComboBox").setSelectedKey(this.oFilters.line);
		
		// Station
		sap.ui.getCore().byId("disruptionKPIView--stationComboBox").removeAllSelectedItems();
		sap.ui.getCore().byId("disruptionKPIView--stationComboBox").addSelectedKeys(this.oFilters.station);
		
		// Time Unit
		sap.ui.getCore().byId("disruptionKPIView--timeUnit").setSelectedKey(this.oFilters.timeUnit);
	},
	
	
	setTaktStartTime: function() {

		sap.ui.getCore().byId("disruptionKPIView--startDateTime").setBusy(true); //Set Busy Indicator
		
		jQuery.ajax({
			async: false, // Data for charts is filtered on date selection in service hence start time is needed first
			type : 'post',
			url : this.urlModel.getProperty("getTaktStartTime"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site": airbus.mes.settings.ModelManager.site,
				"station": airbus.mes.settings.ModelManager.station,
				"msn": airbus.mes.settings.ModelManager.msn
				
			}),

			success : function(data) {
				var dateTime = new Date(data.startTime);
				airbus.mes.disruptionkpi.ModelManager.oFilters.startDateTime = dateTime;
				airbus.mes.disruptionkpi.oView.byId("startDateTime").setDateValue(dateTime);
				sap.ui.getCore().byId("disruptionKPIView--startDateTime").setBusy(false); //Set Busy Indicator
			},

			error : function(error, jQXHR) {
				console.log(error);
				sap.ui.getCore().byId("disruptionKPIView--startDateTime").setBusy(false); //Set Busy Indicator

			}
		});
		
	},
	
	
	loadDisruptionKPIModel : function() {
		
		sap.ui.getCore().byId("disruptionKPIView--idParettoCategoryReason").setBusyIndicatorDelay(0);
		sap.ui.getCore().byId("disruptionKPIView--idParettoCategoryReason").setBusy(true); //Set Busy Indicator
		sap.ui.getCore().byId("disruptionKPIView--vizFrame3").setBusyIndicatorDelay(0);
		sap.ui.getCore().byId("disruptionKPIView--vizFrame3").setBusy(true); //Set Busy Indicator
		sap.ui.getCore().byId("disruptionKPIView--vizFrame4").setBusyIndicatorDelay(0);
		sap.ui.getCore().byId("disruptionKPIView--vizFrame4").setBusy(true); //Set Busy Indicator
		
		var oViewModel = sap.ui.getCore().getModel("TimeLostperAttribute");
		
		var oParetoModel = sap.ui.getCore().getModel("ParetoChartModel");
				
		var line="";
		var aStations=[];
		var startTime="";
		var untilTime="";
		
		line = sap.ui.getCore().byId("disruptionKPIView--lineComboBox").getSelectedItem().getKey();
		
		aStations = sap.ui.getCore().byId("disruptionKPIView--stationComboBox").getSelectedKeys();
		
		startTime = sap.ui.getCore().byId("disruptionKPIView--startDateTime").getValue();
		
		untilTime = sap.ui.getCore().byId("disruptionKPIView--endDateTime").getValue();
		
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("getDisruptionKPIURL"),
			contentType : 'application/json',
			data : JSON.stringify({
				"line" : line == "All"? "" : line,
				"site" : airbus.mes.settings.ModelManager.site,
				"stations" : aStations,
				"startTime": startTime, //"2016-04-04T12:03:03",
				"untilTime": untilTime, //"2016-04-04T12:03:03"
			}),

			success : function(data) {
				if(!data.operation) {
					data.operation = [{"name":airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("noData"), "value":"0"}];

					//airbus.mes.shell.ModelManager.messageShow(airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("noDataFound"));
				};
				if(!data.msn) {
					data.msn = [{"name":airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("noData"), "value":"0"}];
					
					//airbus.mes.shell.ModelManager.messageShow(airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("noDataFound"));
				}
				
				/*to avoid array inconsistency.. as the service dosent return an array [] when only one value pair has to be returned*/
				if(!data.msn[0]){
					data.msn = [data.msn];
				}
				if(!data.operation[0]){
					data.operation = [data.operation];
				}
				oViewModel.setData(data);
				oViewModel.refresh();
				
				sap.ui.getCore().byId("disruptionKPIView--vizFrame3").setBusy(false); //Remove Busy Indicator
				sap.ui.getCore().byId("disruptionKPIView--vizFrame4").setBusy(false); //Remove Busy Indicator
			},

			error : function(error, jQXHR) {
				console.log(error);
				sap.ui.getCore().byId("disruptionKPIView--vizFrame3").setBusy(false); //Remove Busy Indicator
				sap.ui.getCore().byId("disruptionKPIView--vizFrame4").setBusy(false); //Remove Busy Indicator

			}
		});
		
		
		// Get data for Category Reason / Time Lost PAreto Chart
				
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("getParetoKPIURL"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site": airbus.mes.settings.ModelManager.site,
				"line": line == "All"? "" : line,
				"stations": aStations,
				"startTime": startTime, //"2016-04-04T12:03:03",
				"untilTime": untilTime, //"2016-04-04T12:03:03"
				"lang": sap.ui.getCore().byId("globalNavView--SelectLanguage").getSelectedKey()
				
			}),

			success : function(chartData) {
				
				if(!chartData.data) {
					chartData = { "data":[] };
					var json = {"categoryReason":"","timeLost":"0","totalDisruption":airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("noData"),"cumulativePercentage":"0"};
					
					chartData.data.push(json);
					chartData.data.push(json);

					//airbus.mes.shell.ModelManager.messageShow(airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("noDataFound"));
				};
				
				/*to avoid array inconsistency.. as the service doesn't return an array [] when only one value pair has to be returned*/
				if(!chartData.data[0]){
					chartData.data = [chartData.data];
				}

				oParetoModel.setData(chartData);		
				oParetoModel.refresh();
				
				sap.ui.getCore().byId("disruptionKPIView--idParettoCategoryReason").setBusy(false); //Set Busy Indicator
				
			},

			error : function(error, jQXHR) {
				console.log(error);
				sap.ui.getCore().byId("disruptionKPIView--idParettoCategoryReason").setBusy(false); //Set Busy Indicator

			}
		});
	},

	
	/***********************************************************
	 * Remove duplicates value from the filter selection boxes
	***********************************************************/
	removeDuplicates: function(){
	    /*********** Filter for Line **************/
	    var aFilters = [];
	    var aTemp = [];
	    var duplicatesFilter = new sap.ui.model.Filter({
	        path: "line",
	        test: function (value) {
	            if (aTemp.indexOf(value) == -1) {
	                aTemp.push(value)
	                return true;
	            } else {
	                return false;
	            }
	        }
	    });
	
	    aFilters.push(duplicatesFilter);
	
	    //aFilters.push(new sap.ui.model.Filter("program", "EQ", airbus.mes.settings.ModelManager.program)); // Filter on selected A/C Program
	
	    var lineBox = sap.ui.getCore().byId("disruptionKPIView--lineComboBox")
	    
	    lineBox.getBinding("items").filter(new sap.ui.model.Filter(aFilters, true));
	
	    var lineItemAll = new sap.ui.core.Item();
	    lineItemAll.setKey("All");
	    lineItemAll.setText(airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("All") +
	    	" " +
	    	airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("Lines"));
	    lineBox.insertItem(lineItemAll, 0);
	},
	
	
	removeDuplicateStations: function(){
		/*********** Filter for Station **************/
	    var aFilters = [];
	    
	    if(airbus.mes.disruptionkpi.ModelManager.oFilters.line != "All")
	    	aFilters.push(new sap.ui.model.Filter("line", "EQ", airbus.mes.disruptionkpi.ModelManager.oFilters.line)); // Filter on selected Line
        
        var aTemp = [];
        var duplicatesFilter = new sap.ui.model.Filter({
            path: "station",
            test: function (value) {
                if (aTemp.indexOf(value) == -1) {
                    aTemp.push(value)
                    return true;
                } else {
                    return false;
                }
            }
        });

        aFilters.push(duplicatesFilter);
        
        sap.ui.getCore().byId("disruptionKPIView--stationComboBox").getBinding("items").filter(new sap.ui.model.Filter(aFilters, true));
	},
	
	removeDuplicateMSNs: function(){
		/*********** Filter for MSN **************/
	  /*  var aFilters = [];
	    var aStations = sap.ui.getCore().byId("disruptionKPIView--stationComboBox").getSelectedKeys();
	    
	    if(aStations.length == 0 && airbus.mes.disruptionkpi.ModelManager.oFilters.line != "All"){
	    	aFilters.push(new sap.ui.model.Filter("line", "EQ", airbus.mes.disruptionkpi.ModelManager.oFilters.line)); // Filter on selected Line
	    }
        
        var aTemp = [];
        var duplicatesFilter = new sap.ui.model.Filter({
            parts: [{path: "msn"},
                    {path:"station"}],                    
            test: function (msn, station) {
            	if(aStations.length &&  aStations.indexOf(station) == -1){
        			return false;
        			
        			
            	} else if (aTemp.indexOf(msn) == -1) {
                    aTemp.push(msn)
                    return true;
                } else {
                    return false;
                }
            }
        });

        aFilters.push(duplicatesFilter);
        
        sap.ui.getCore().byId("disruptionKPIView--msnComboBox").getBinding("items").filter(new sap.ui.model.Filter(aFilters, true));*/
		
	}
	


}
"use strict";
jQuery.sap.declare("airbus.mes.disruptionkpi.ModelManager")
airbus.mes.disruptionkpi.ModelManager = {
	urlModel : undefined,
	
	oFilters:{
		line: "",
		station: "",
		startDateTime: "",
		endDateTime: "",
		timeUnit: "Minutes"
	},
	
	//sStaion: "",

	init : function(core) {

		 airbus.mes.shell.ModelManager.createJsonModel(core,["TimeLostperAttribute","ParetoChartModel"]);
	//	 airbus.mes.shell.ModelManager.createJsonModel(core,["ParetoChartModel"]);
		
	    // Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.disruptionkpi.config.url_config");
	},
	
	
	setPreSelectionCriteria: function(){
		
		sap.ui.getCore().byId("disruptionKPIView--endDateTime").setDateValue(new Date());
		
		this.oFilters = {
			line: airbus.mes.settings.ModelManager.line,
			station: airbus.mes.settings.ModelManager.station,
			startDateTime: "",
			endDateTime: sap.ui.getCore().byId("disruptionKPIView--endDateTime").getDateValue()
		};
		
		// Line
		sap.ui.getCore().byId("disruptionKPIView--lineComboBox").setSelectedKey(this.oFilters.line);
		
		// Station
		sap.ui.getCore().byId("disruptionKPIView--stationComboBox").removeAllSelectedItems()
		sap.ui.getCore().byId("disruptionKPIView--stationComboBox").addSelectedKeys(this.oFilters.station);
		
		// Period of Time
		/*if(this.oFilters.startDateTime ==""){
			sap.ui.getCore().byId("disruptionKPIView--startDateTime").setDateValue();
			this.oFilters.startDateTime = sap.ui.getCore().byId("disruptionKPIView--startDateTime").getDateValue();
			this.oFilters.endDateTime   = sap.ui.getCore().byId("disruptionKPIView--endDateTime").getDateValue();
		}else{
			sap.ui.getCore().byId("disruptionKPIView--startDateTime").setDateValue(this.oFilters.startDateTime);
			sap.ui.getCore().byId("disruptionKPIView--endDateTime").setDateValue(this.oFilters.endDateTime);
		}*/

		// Time Unit
		sap.ui.getCore().byId("disruptionKPIView--timeUnit").setSelectedKey(this.oFilters.timeUnit);
		
		//this.loadDisruptionKPIModel();
	},
	
	loadDisruptionKPIModel : function() {
		sap.ui.getCore().byId("disruptionKPIView--idParettoCategoryReason").setBusy(true); //Set Busy Indicator
		sap.ui.getCore().byId("disruptionKPIView--vizFrame3").setBusy(true); //Set Busy Indicator
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
				"line" : line,
				"site" : airbus.mes.settings.ModelManager.site,
				"stations" : aStations,
				
			}),

			success : function(data) {
				/*to avoid array inconsistency.. as the service dosent return an array [] when only one value pair has to be returned*/
				if(!data.msn[0]){
					data.msn = [data.msn];
				}
				if(!data.operation[0]){
					data.operation = [data.operation];
				}
				oViewModel.setData(data);
				sap.ui.getCore().byId("disruptionKPIView--vizFrame3").setBusy(false); //Remove Busy Indicator
				sap.ui.getCore().byId("disruptionKPIView--vizFrame4").setBusy(false); //Remove Busy Indicator
			},

			error : function(error, jQXHR) {
				console.log(error);
				sap.ui.getCore().byId("disruptionKPIView--vizFrame3").setBusy(false); //Remove Busy Indicator
				sap.ui.getCore().byId("disruptionKPIView--vizFrame4").setBusy(false); //Remove Busy Indicator
				/*airbus.mes.stationtracker.oView.byId("boxSLBEfficiecy").setBusy(false);
				airbus.mes.stationtracker.oView.byId("boxLabourEfficiency").setBusy(false);*/

			}
		});
		
		oViewModel.refresh();
		
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("getParetoKPIURL"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site": airbus.mes.settings.ModelManager.site,
				"line": line,
				"stations": aStations,
				"startTime": startTime, //"2016-04-04T12:03:03",
				"untilTime": untilTime //"2016-04-04T12:03:03"
				
			}),

			success : function(data) {
				oParetoModel.setData(data);
				sap.ui.getCore().byId("disruptionKPIView--idParettoCategoryReason").setBusy(false); //Set Busy Indicator
			},

			error : function(error, jQXHR) {
				console.log(error);
				sap.ui.getCore().byId("disruptionKPIView--idParettoCategoryReason").setBusy(false); //Set Busy Indicator

			}
		});
		
		oParetoModel.refresh();
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
	
	    aFilters.push(new sap.ui.model.Filter("program", "EQ", airbus.mes.settings.ModelManager.program)); // Filter on selected A/C Program
	
	    var lineBox = sap.ui.getCore().byId("disruptionKPIView--lineComboBox")
	    
	    lineBox.getBinding("items").filter(new sap.ui.model.Filter(aFilters, true));
	
	    var lineItemAll = new sap.ui.core.Item();
	    lineItemAll.setKey("All");
	    lineItemAll.setText(airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("All") +
	    	" " +
	    	airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("Lines"));
	    lineBox.insertItem(lineItemAll, 0);
	    
	    

	    /*********** Filter for Station **************/
	    var aFilters = [];
	    
	    if(airbus.mes.disruptionkpi.ModelManager.oFilters.line != "All")
	    	aFilters.push(new sap.ui.model.Filter("line", "EQ", airbus.mes.disruptionkpi.ModelManager.oFilters.line)); // Filter on selected Line
        
	    var aFilters = [];
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
	}


}
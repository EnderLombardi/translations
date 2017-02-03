"use strict";
jQuery.sap.declare("airbus.mes.disruptionkpi.ModelManager")
airbus.mes.disruptionkpi.ModelManager = {
	urlModel : undefined,
	
	oFilters:{
		line: airbus.mes.settings.ModelManager.line,
		station: airbus.mes.settings.ModelManager.station,
		station: airbus.mes.settings.ModelManager.station,
		startDateTime: "",
		endDateTime: "",
		timeUnit: "Minutes"
	},
	
	//sStaion: "",

	init : function(core) {

		 airbus.mes.shell.ModelManager.createJsonModel(core,["TimeLostperAttribute"]);
		
	    // Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.disruptionkpi.config.url_config");
	},
	
	
	setPreSelectionCriteria: function(){
		
		// Line
		sap.ui.getCore().byId("disruptionKPIView--lineComboBox").setSelectedKey(this.oFilters.line);
		
		// Station
		sap.ui.getCore().byId("disruptionKPIView--stationComboBox").removeAllSelectedItems()
		sap.ui.getCore().byId("disruptionKPIView--stationComboBox").addSelectedKeys(this.oFilters.station);
		
		// Period of Time
		if(this.oFilters.startDateTime ==""){
			sap.ui.getCore().byId("disruptionKPIView--startDateTime").setDateValue();
			sap.ui.getCore().byId("disruptionKPIView--endDateTime").setDateValue(new Date());
			this.oFilters.startDateTime = sap.ui.getCore().byId("disruptionKPIView--startDateTime").getDateValue();
			this.oFilters.endDateTime   = sap.ui.getCore().byId("disruptionKPIView--endDateTime").getDateValue();
		}else{
			sap.ui.getCore().byId("disruptionKPIView--startDateTime").setDateValue(this.oFilters.startDateTime);
			sap.ui.getCore().byId("disruptionKPIView--endDateTime").setDateValue(this.oFilters.endDateTime);
		}

		// Time Unit
		sap.ui.getCore().byId("disruptionKPIView--timeUnit").setSelectedKey(this.oFilters.timeUnit);
	},
	
	
	/*getKPIData : function() {
		var urlCategoryData = this.urlModel.getProperty("getDisruptionKPIURL");
		urlCategoryData = airbus.mes.shell.ModelManager.replaceURI(urlCategoryData,"$site", airbus.mes.settings.ModelManager.site);
		urlCategoryData = airbus.mes.shell.ModelManager.replaceURI(urlCategoryData,"$station", this.sStation);
		return urlCategoryData;
	},*/
	
	loadDisruptionKPIModel : function() {
		airbus.mes.disruptionkpi.oView.setBusy(true); //Set Busy Indicator
		var oViewModel = sap.ui.getCore().getModel("TimeLostperAttribute");
		var station="";
		var msn="";
		var status="";
		var resolutionGroup="";
		if(sap.ui.getCore().byId("disruptiontrackerView--stationComboBox") && sap.ui.getCore().byId("disruptiontrackerView--stationComboBox").getSelectedItem()){
			station = sap.ui.getCore().byId("disruptiontrackerView--stationComboBox").getSelectedItem().getKey();
		}
		if(sap.ui.getCore().byId("disruptiontrackerView--msnComboBox") && sap.ui.getCore().byId("disruptiontrackerView--msnComboBox").getSelectedItem()){
			msn = sap.ui.getCore().byId("disruptiontrackerView--msnComboBox").getSelectedItem().getKey();
		}
		if(sap.ui.getCore().byId("disruptiontrackerView--statusComboBox") && sap.ui.getCore().byId("disruptiontrackerView--statusComboBox").getSelectedItem()){
			status = sap.ui.getCore().byId("disruptiontrackerView--statusComboBox").getSelectedItem().getKey();
		}
		if(sap.ui.getCore().byId("disruptiontrackerView--resolutionGroupBox") && sap.ui.getCore().byId("disruptiontrackerView--resolutionGroupBox").getSelectedItem()){
			resolutionGroup = sap.ui.getCore().byId("disruptiontrackerView--resolutionGroupBox").getSelectedItem().getKey();
		}
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("getDisruptionKPIURL"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"station" : station,
				"msn" : msn,
				"resolutionGroup" : resolutionGroup,
				"status" : status
				
			}),

			success : function(data) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				/*to avoid array inconsistency.. as the service dosent return an array [] when only one value pair has to be returned*/
				if(!data.msn[0]){
					data.msn = [data.msn];
				}
				if(!data.category[0]){
					data.category = [data.category];
				}
				if(!data.operation[0]){
					data.operation = [data.operation];
				}
				if(!data.reason[0]){
					data.reason = [data.reason];
				}
				oViewModel.setData(data);
				airbus.mes.disruptionkpi.oView.setBusy(false);
				/*airbus.mes.stationtracker.oView.byId("boxSLBEfficiecy").setBusy(false);
				airbus.mes.stationtracker.oView.byId("boxLabourEfficiency").setBusy(false);*/
			},

			error : function(error, jQXHR) {
				console.log(error);
				airbus.mes.disruptionkpi.oView.setBusy(false);
				/*airbus.mes.stationtracker.oView.byId("boxSLBEfficiecy").setBusy(false);
				airbus.mes.stationtracker.oView.byId("boxLabourEfficiency").setBusy(false);*/

			}
		});
		oViewModel.refresh();
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
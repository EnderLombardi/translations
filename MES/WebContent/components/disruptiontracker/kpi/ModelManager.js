"use strict";
jQuery.sap.declare("airbus.mes.disruptiontracker.kpi.ModelManager")
airbus.mes.disruptiontracker.kpi.ModelManager = {
	urlModel : undefined,
	
	//sStaion: "",

	init : function(core) {

		 airbus.mes.shell.ModelManager.createJsonModel(core,["TimeLostperAttribute"]);
		
	    // Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.disruptiontracker.kpi.config.url_config");
	},
	
	/*getKPIData : function() {
		var urlCategoryData = this.urlModel.getProperty("getDisruptionKPIURL");
		urlCategoryData = airbus.mes.shell.ModelManager.replaceURI(urlCategoryData,"$site", airbus.mes.settings.ModelManager.site);
		urlCategoryData = airbus.mes.shell.ModelManager.replaceURI(urlCategoryData,"$station", this.sStation);
		return urlCategoryData;
	},*/
	
	loadDisruptionKPIModel : function() {
		airbus.mes.disruptiontracker.kpi.oView.setBusy(true); //Set Busy Indicator
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
				airbus.mes.disruptiontracker.kpi.oView.setBusy(false);
				/*airbus.mes.stationtracker.oView.byId("boxSLBEfficiecy").setBusy(false);
				airbus.mes.stationtracker.oView.byId("boxLabourEfficiency").setBusy(false);*/
			},

			error : function(error, jQXHR) {
				console.log(error);
				airbus.mes.disruptiontracker.kpi.oView.setBusy(false);
				/*airbus.mes.stationtracker.oView.byId("boxSLBEfficiecy").setBusy(false);
				airbus.mes.stationtracker.oView.byId("boxLabourEfficiency").setBusy(false);*/

			}
		});
		oViewModel.refresh();
	}
}

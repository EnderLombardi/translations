"use strict";
jQuery.sap.declare("airbus.mes.disruptiontracker.kpi.ModelManager")
airbus.mes.disruptiontracker.kpi.ModelManager = {
	urlModel : undefined,
	queryParams : jQuery.sap.getUriParameters(),
	
	sStaion: "",

	init : function(core) {
		core.setModel(new sap.ui.model.json.JSONModel(), "TimeLostperAttribute");
		
	/*	core.getModel("TimeLostperAttribute").attachRequestCompleted(function(){
			airbus.mes.disruptiontracker.kpi.oView.setBusy(false); 
		});*/
		
	    core.setModel(new sap.ui.model.resource.ResourceModel({bundleName:"airbus.mes.disruptiontracker.kpi.i18n.i18n",bundleLocale:"en"}),"i18n");

		var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "local";
			break;
		default:
			dest = "airbus";
			break;
		}
		
		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel(
				{
					bundleUrl : "../components/disruptiontracker/kpi/config/url_config.properties",
					bundleLocale : dest
				});

		if (dest === "sopra") {

			var oModel = this.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;

			for ( var prop in oModel) {
				if (oModel[prop].slice(-5) != ".json") {
					oModel[prop] += "&j_user=" + Cookies.getJSON("login").user
							+ "&j_password=" + Cookies.getJSON("login").mdp;
				}
			}
		}
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

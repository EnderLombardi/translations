"use strict";
jQuery.sap.declare("airbus.mes.disruptiontracker.ModelManager");
airbus.mes.disruptiontracker.ModelManager = {
	oDisruptionFilter: {},
	
	init : function(core) {
		//Model having disruptions tracker data
		airbus.mes.shell.ModelManager.createJsonModel(core,["disruptionsTrackerModel"]);
		core.getModel("disruptionsTrackerModel").attachRequestCompleted(airbus.mes.disruptiontracker.ModelManager.onDisruptionsLoad);
	},
	
	loadDisruptionTrackerModel : function() {
		var oFilters = airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter;
		
		//Set Busy Indicator
		airbus.mes.disruptiontracker.oView.byId("disruptionsTable").setBusyIndicatorDelay(0);
		airbus.mes.disruptiontracker.oView.byId("disruptionsTable").setBusy(true);

		var oViewModel = sap.ui.getCore().getModel("disruptionsTrackerModel");

		var site = airbus.mes.settings.ModelManager.site;
		var workCenterBO = "";
		var msnNumber = "";
		
		if(oFilters.station != undefined && oFilters.station != ""){
			workCenterBO = "WorkCenterBO:" + airbus.mes.settings.ModelManager.site + "," + oFilters.station;
		}
		
		if(oFilters.msn != undefined && oFilters.msn != ""){
			msnNumber = oFilters.msn;
		}
		
		jQuery.ajax({
			type : 'post',
			url : airbus.mes.disruptions.ModelManager.urlModel.getProperty("getDisruptionsURL"),
			contentType : 'application/json',
			cache : false,
			data : JSON.stringify({
				"site" : site,
				"workCenterBO": workCenterBO,
				"operationNo" : "",
				"sfcStepBO": "",
				"msnNumber": msnNumber,
				"forMobile": false
			}),

			success : function(data) {
				
				var aDisruptions = [];
				if (data.disruptionListDetails) {
					if (data.disruptionListDetails && !data.disruptionListDetails[0]) {
						aDisruptions = [ data.disruptionListDetails ];
					} else{
						aDisruptions = data;
					}
				}
				
				oViewModel.setData(aDisruptions);
				
				//Set Busy Indicator
				airbus.mes.disruptiontracker.oView.byId("disruptionsTable").setBusy(false);
			},

			error : function(error, jQXHR) {
				//Set Busy Indicator
				airbus.mes.disruptiontracker.oView.byId("disruptionsTable").setBusy(false);
			}

		});
		
		/*var oFilters = airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter;
		
		//Set Busy Indicator
		airbus.mes.disruptiontracker.oView.byId("disruptionsTable").setBusyIndicatorDelay(0);
		airbus.mes.disruptiontracker.oView.byId("disruptionsTable").setBusy(true);

		var oViewModel = sap.ui.getCore().getModel("disruptionsTrackerModel");
		var getDisruptionsURL = airbus.mes.disruptions.ModelManager.getDisruptionsURL(oFilters);
		oViewModel.loadData(getDisruptionsURL);
		
		if(oFilters.station != undefined && oFilters.station != ""){
			airbus.mes.disruptiontracker.oView.byId("stationComboBox").setSelectedKey(oFilters.station);
		} else {
			airbus.mes.disruptiontracker.oView.byId("stationComboBox").setSelectedKey("");
		}
		if(oFilters.msn != undefined && oFilters.msn != ""){
			airbus.mes.disruptiontracker.oView.byId("msnComboBox").setSelectedKey(oFilters.msn);
		} else {
			airbus.mes.disruptiontracker.oView.byId("msnComboBox").setSelectedKey("");
		}*/
	},
	
	onDisruptionsLoad: function(){
		
		// Apply filter on Resolution Group Filter Box
		var aTemp = [];	
		sap.ui
		.getCore()
		.byId("disruptiontrackerView--resolutionGroupBox")
		.getBinding("items")
		.filter(new sap.ui.model.Filter({
		    path: "ResponsibleGroup",
		    test: function(oValue) {
				if (aTemp.indexOf(oValue) == -1) {
					aTemp.push(oValue);
					return true;
				} else {
					return false;
				}
		    }
		  }));

		
		var resGroupItemAll = new sap.ui.core.Item();
		resGroupItemAll.setKey("");
		resGroupItemAll.setText(airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("All")
			+ " " + airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("resolutionGroup"));
		
		var resGroupBox = sap.ui.getCore().byId("disruptiontrackerView--resolutionGroupBox");
		resGroupBox.insertItem(resGroupItemAll,0);
		
		//Remove Busy Indicator
		airbus.mes.disruptiontracker.oView.byId("disruptionsTable").setBusy(false);
	}
}

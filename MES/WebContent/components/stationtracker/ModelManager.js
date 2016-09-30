//"use strict";
jQuery.sap.declare("airbus.mes.stationtracker.ModelManager")
airbus.mes.stationtracker.ModelManager = {
		urlModel : undefined,
		queryParams : jQuery.sap.getUriParameters(),
		
		i18nModel: undefined,
				
		init : function(core) {
			
			
			core.setModel(new sap.ui.model.json.JSONModel(), "WorkListModel");	
			core.setModel(new sap.ui.model.json.JSONModel(), "stationTrackerModel"); // Station tracker model
			core.setModel(new sap.ui.model.json.JSONModel(), "shiftsModel"); // Shifts model
			
			core.getModel("stationTrackerModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onStationTrackerLoad);
			core.getModel("shiftsModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onShiftsLoad);


			var dest;

			switch (window.location.hostname) {
			case "localhost":
				dest = "local";
				break;
			case "wsapbpc01.ptx.fr.sopra":
				dest = "sopra";
				break;
			default:
				dest = "airbus";
				break;
			}

			if (this.queryParams.get("url_config")) {
				dest = this.queryParams.get("url_config");
			}

			this.urlModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl : "../components/stationtracker/config/url_config.properties",
				bundleLocale : dest
			});
//			this.i18nModel = new sap.ui.model.resource.ResourceModel({
//				bundleUrl : "i18n/messageBundle.properties",
//				bundleLocale : core.getConfiguration().getLanguage()
//			});
//			core.setModel(this.i18nModel, "messageBundle");
						
		},
				
		loadStationTracker : function() {
			var oViewModel = sap.ui.getCore().getModel("stationTrackerModel");
			oViewModel.loadData(this.urlModel.getProperty("urlstationtracker"), null, false);
		},	
		onStationTrackerLoad : function() {
			
			var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
		
			GroupingBoxingManager.parseOperation(GroupingBoxingManager.group,GroupingBoxingManager.box);
			
		},
		loadShifts : function() {
			var oViewModelshift = sap.ui.getCore().getModel("shiftsModel");
			oViewModelshift.loadData(this.urlModel.getProperty("urlshifts"), null, false);
		},	
		onShiftsLoad : function() {
			
			var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
			GroupingBoxingManager.parseShift();
		},
		
		
		
}
airbus.mes.stationtracker.ModelManager.init(sap.ui.getCore());

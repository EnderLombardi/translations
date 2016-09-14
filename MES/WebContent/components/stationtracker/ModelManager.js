"use strict";
var Station_Scheduler= Scheduler.getSchedulerInstance(); 
var DailyTeam_Scheduler= Scheduler.getSchedulerInstance(); 
var ModelManager = {
		urlModel : undefined,
		queryParams : jQuery.sap.getUriParameters(),
		
		i18nModel: undefined,
				
		init : function(core) {
			
			
				
			core.setModel(new sap.ui.model.json.JSONModel(),"stationTrackerModel");
						
			core.getModel("stationTrackerModel").attachRequestCompleted(ModelManager.fnOnStationTrackerLoad);
			
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
				bundleUrl : "config/url_config.properties",
				bundleLocale : dest
			});
//			this.i18nModel = new sap.ui.model.resource.ResourceModel({
//				bundleUrl : "i18n/messageBundle.properties",
//				bundleLocale : core.getConfiguration().getLanguage()
//			});
//			core.setModel(this.i18nModel, "messageBundle");
						
		},
				
		fnLoadStationTracker : function() {
			var oViewModel = sap.ui.getCore().getModel("stationTrackerModel");
			oViewModel.loadData(this.urlModel.getProperty("stationTrackerModel"), null, false);
		},	
		
		fnOnStationTrackerLoad : function() {
			
			var oModel = sap.ui.getCore().getModel("stationTrackerModel").oData.Rowsets.Rowset[0].Row;
			var jsonData = [];
			var elements = [];
			
			
			for (var index = 0; index < oModel.length; ++index) {

				// Add something to the beginning of the id in
				// case the ID is empty
				var section = oModel[index].groupId;
				//var subsection = "_sub_" + bindArray[index].mProperties.subsection_id;
																
				if (elements.some(function(el) {
					return el.key ===  section + oModel[index].schedType
				})) {
				} else {

					elements.push({
						"key" : section + 'I',
						"label" : oModel[index].schedType
			
					}); //

					elements.push({
						"key" : section + 'R',
						"label" : ''
					});

				}

			}
			
			
			for ( index = 0; index < oModel.length; ++index) {

				if(oModel[index].start != "---"){
				
					jsonData.push({

						"start_date" : oModel[index].start,
						"end_date" : oModel[index].end,
						"section_id" : oModel[index].groupId + oModel[index].schedType,
						"text" : oModel[index].boxId,
						"progress" : oModel[index].progress,
						"desc" : oModel[index].boxId + "[" + oModel[index].progress + "%]",
						color : oModel[index].schedType === 'I' ? "#b7b7b7" :"#8dd1e0",
						readonly : oModel[index].schedType === 'I' ? true : false,
						
					});

				}
			}

			// ==========
			// Initialize
			// ==========

			scheduler.createTimelineView({
				name : "timeline",
				render : "bar",
				x_unit : "minute",
				x_date : "%H:%i",
				x_step : 30,
				x_size : 18,
				x_start : 0,
				x_length : 18,
				second_scale : {
					x_unit : "day",
					x_date : "%F %d"
				},
				y_unit : elements,
				y_property : "section_id",
			
			});

		
			scheduler.init(sap.ui.getCore().byId("dhtmlx").getId() + "--test", new Date("2016-07-07"), "timeline");
			scheduler.clearAll();
			scheduler.parse(jsonData, "json");
			scheduler.xy.scroll_width = 20;
			scheduler.updateView();
			
		},
		
}
ModelManager.init(sap.ui.getCore());

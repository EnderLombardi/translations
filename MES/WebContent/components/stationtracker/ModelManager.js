//"use strict";
jQuery.sap.declare("airbus.mes.stationtracker.ModelManager")
airbus.mes.stationtracker.ModelManager = {
		urlModel : undefined,
		queryParams : jQuery.sap.getUriParameters(),
		
		i18nModel: undefined,
				
		init : function(core) {
			
			
				
			core.setModel(new sap.ui.model.json.JSONModel(),"stationTrackerModel");
						
			core.getModel("stationTrackerModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onStationTrackerLoad);
			
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
				bundleUrl : "/MES/components/stationtracker/config/url_config.properties",
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
			
			airbus.mes.stationtracker.GroupingBoxingManager.groupingBoxing("workOrderId","operationId");
			
			var oModel = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy;
			aElements2 = []
			aBox = [];
			
			for( var i in oModel ) { 
				
				var oparent = {
						
						"key":i,
						"children":[],
				}
				aElements2.push(oparent);
				
				for ( var a in oModel[i] ) {
					
					var fIndex = aElements2.indexOf(oparent);
					var ochild = {
							
							"key": i + "_" + a,
					}
					aElements2[fIndex].children.push(ochild);
					
					for ( var e in oModel[i][a]) {
						
						var fIndexOperation = aElements2[fIndex].children.indexOf(ochild);
						oOperation = {
								
								"section_id" : 	i + "_" + a,
								"startDate" : oModel[i][a][e][fIndexOperation].startDate,
								"endDate" : oModel[i][a][e][fIndexOperation].endDate,
						}
						
						aBox.push(oOperation);
						
					}
				}
				
			}
			
			
			
			
			elements = [ // original hierarhical array to display
	                        {key:10, label:"FUEL ACTIVITIES", open: true, children: [
	                                                                                 
	                        {key:"F1" , name:"Jae J.", subname:"JJ", hours:'6.0hs'},
	                        {key:"F2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
	                        {key:"F3", name:"Steve S.", subname:"SS", hours:'3.0hs'},
	                        ]},
	                         {key:105, label:"ELEC ACTIVITIES", open:true, children: [
	                      
	                         {key:"F1", name:"Jae J.", subname:"JJ", hours:'6.0hs'},
	                         {key:"E2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
	                         {key:"E3", name:"Steve S.", subname:"SS", hours:'3.0hs'},                                                    
	                         ]},
	                         {key:115, label:"MEC ACTIVITIES", open:true, children: [
	                                                                                                     
	                         {key:"M1", name:"Jae J.", subname:"JJ", hours:'6.0hs'},
	                         {key:"M2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
	                         {key:"M3", name:"Steve S.", subname:"SS", hours:'3.0hs'},
	                         ]},
	                         {key:120, label:"FLY ACTIVITIES", open:true, children: [
	                     
	                         {key:"A1", name:"Jae J.", subname:"JJ", hours:'6.0hs'},
	                         {key:"A2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
	                         {key:"A3", name:"Steve S.", subname:"SS", hours:'3.0hs'},
	                         ]},
	           ];


		 scheduler.matrix['timeline'].y_unit_original = elements;
		 scheduler.callEvent("onOptionsLoad", []);
		 
	     scheduler.init(sap.ui.getCore().byId("stationTrackerView").getId() + "--test" ,  new Date(2014,5,30),"timeline");
	     scheduler.clearAll();
	     
	     scheduler.parse([
	                       
	{ start_date: "2014-06-30 09:00", end_date: "2014-06-30 12:00", text:"Task A-12458", section_id:"I1" , type:"I" , progress:50, text:"WO1 OP30",},
	{ start_date: "2014-06-30 12:00", end_date: "2014-06-30 14:00", text:"Task A-89411", section_id:"I1" , type:"I" , available : "ok",},
	{ start_date: "2014-06-30 10:00", end_date: "2014-06-30 14:00", text:"Task A-64168",  section_id:"I1" , type:"I" , progress:50, text:"WO1 OP30",},
	{ start_date: "2014-06-30 16:00", end_date: "2014-06-30 17:00", text:"Task A-46598",  section_id:"I1" , type:"I" , progress:50, text:"WO1 OP30", },

	                       
	                       
	     { start_date: "2014-06-30 09:00", end_date: "2014-06-30 12:00", text:"Task A-12458", section_id:"F1" , type:"R" , progress:50, text:"WO1 OP30",},
	     { start_date: "2014-06-30 12:00", end_date: "2014-06-30 14:00", text:"Task A-89411", section_id:"F2" , type:"R" , available : "ok", cp:"1"},
	     { start_date: "2014-06-30 10:00", end_date: "2014-06-30 14:00", text:"Task A-64168",  section_id:"F3" , type:"R" , progress:50, text:"WO1 OP30",cp:"1"},
	     { start_date: "2014-06-30 16:00", end_date: "2014-06-30 17:00", text:"Task A-46598",  section_id:"F1" , type:"R" , progress:50, text:"WO1 OP40", },
	     

	     { start_date: "2014-06-30 12:00", end_date: "2014-06-30 20:00", text:"Task B-48865",  section_id:"I2" , type:"I" , progress:50, text:"WO1 OP30",},
	     { start_date: "2014-06-30 14:00", end_date: "2014-06-30 16:00", text:"Task B-44864",  section_id:"I2" , type:"I" , progress:50, text:"WO1 OP30",},
	     { start_date: "2014-06-30 16:30", end_date: "2014-06-30 18:00", text:"Task B-46558",  section_id:"I2" , type:"I" , progress:50, text:"WO1 OP30",},
	     { start_date: "2014-06-30 18:30", end_date: "2014-06-30 20:00", text:"Task B-45564",  section_id:"I2" , type:"I" , progress:50, text:"WO1 OP30",},
	     
	     
	     { start_date: "2014-06-30 12:00", end_date: "2014-06-30 20:00", text:"Task B-48865",  section_id:"E1" , type:"R" , progress:50, text:"WO1 OP30",},
	     { start_date: "2014-06-30 14:00", end_date: "2014-06-30 16:00", text:"Task B-44864",  section_id:"E2" , type:"R" , progress:50, text:"WO1 OP30",cp:"1"},
	     { start_date: "2014-06-30 16:30", end_date: "2014-06-30 18:00", text:"Task B-46558",  section_id:"E3" , type:"R" , progress:50, text:"WO1 OP30",},
	     { start_date: "2014-06-30 18:30", end_date: "2014-06-30 20:00", text:"Task B-45564",  section_id:"E3" , type:"R" , progress:50, text:"WO1 OP30",},
	     
	     
	     { start_date: "2014-06-30 08:00", end_date: "2014-06-30 12:00", text:"Task C-32421",  section_id:"I3" , type:"I" , progress:50, text:"WO1 OP30",},
	     { start_date: "2014-06-30 14:30", end_date: "2014-06-30 16:45", text:"Task C-14244",  section_id:"I3" , type:"I" , progress:50, text:"WO1 OP30",},
	     
	     { start_date: "2014-06-30 08:00", end_date: "2014-06-30 12:00", text:"Task C-32421",  section_id:"M1" , type:"R" , progress:50, text:"WO1 OP30",cp:"1"},
	     { start_date: "2014-06-30 14:30", end_date: "2014-06-30 16:45", text:"Task C-14244",  section_id:"M2" , type:"R" , progress:50, text:"WO1 OP30",},
	     

	     { start_date: "2014-06-30 09:20", end_date: "2014-06-30 12:20", text:"Task D-52688",  section_id:"I4" , type:"I" , progress:50, text:"WO1 OP30",},
	     { start_date: "2014-06-30 11:40", end_date: "2014-06-30 16:30", text:"Task D-46588",  section_id:"I4" , type:"I" , progress:50, text:"WO1 OP30",},
	     { start_date: "2014-06-30 12:00", end_date: "2014-06-30 18:00", text:"Task D-12458",  section_id:"I4" , type:"I" , progress:50, text:"WO1 OP30",},
	     
	     { start_date: "2014-06-30 09:20", end_date: "2014-06-30 12:20", text:"Task D-52688",  section_id:"A1" , type:"R" , progress:50, text:"WO1 OP30",cp:"1"},
	     { start_date: "2014-06-30 11:40", end_date: "2014-06-30 16:30", text:"Task D-46588",  section_id:"A2" , type:"R" , progress:50, text:"WO1 OP30",},
	     { start_date: "2014-06-30 12:00", end_date: "2014-06-30 18:00", text:"Task D-12458",  section_id:"A3" , type:"R" , progress:50, text:"WO1 OP30",}
	                  ],"json");
	     
	     
	     
			
		},
		
}
airbus.mes.stationtracker.ModelManager.init(sap.ui.getCore());

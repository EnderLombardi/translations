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
			
			var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
			aElements2 = []
			aBox = [];
			
			GroupingBoxingManager.groupingBoxing("competency","operationId");

			var oModel = GroupingBoxingManager.operationHierarchy;
			
			for( var i in oModel ) { 
				
				//Creation of gantt groups
				var oRecheduleGroup = {
						"open": true,
						"key":i,
						"children":[],
				}
					
				aElements2.push(oRecheduleGroup);
				var fGroupIndex = aElements2.indexOf(oRecheduleGroup);
				
				//Creation of initial avl line of the current group
				if (GroupingBoxingManager.showInitial) {
							
				var oInitialGroup = {
												
						"key": "I_" + i,
						"initial":"Initial plan",
				}
								
				aElements2[fGroupIndex].children.unshift(oInitialGroup);
				
				}
				
				for ( var a in oModel[i] ) {
					
					//Creation of avl line of the current group
					var fIndex = aElements2.indexOf(oRecheduleGroup);
					var ochild = {
							
							"hours" : "6.0hrs",
							"subname" : "JJ",
							"name" : "JAE J.",
							"avalLine" : a,
							"key": i + "_" + a,
					}
					aElements2[fIndex].children.push(ochild);
					var aStartDateRescheduling = [];
					var aEndDateRescheduling = [];
					var aStartDateInitial = [];
					var aEndDateInitial = [];
					var sProgress = "";
					var fCriticalPath = 0;					
					
					//Creation data wich represent boxs rescheduling and initial
					for ( var e in oModel[i][a]) {
						
						oModel[i][a][e].forEach( function( el ) { 
							
							aStartDateRescheduling.push(Date.parse(GroupingBoxingManager.jsDateFromDayTimeStr(el.startDate)));
							aEndDateRescheduling.push(Date.parse(GroupingBoxingManager.jsDateFromDayTimeStr(el.endDate)));
							aStartDateInitial.push(Date.parse(GroupingBoxingManager.jsDateFromDayTimeStr(el.avlStartDate)));
							aEndDateInitial.push(Date.parse(GroupingBoxingManager.jsDateFromDayTimeStr(el.avlEndDate)));
							sProgress = el.progress;
							fCriticalPath = el.criticalPath;
							
						} )
						
						var oOperationRescheduling = {
							
								"criticalPath": fCriticalPath,
								"type":"R",
								"text" : "WO1 OP30",
								"section_id" : 	i + "_" + a,
								"progress" : sProgress,
								"start_date" : GroupingBoxingManager.transformRescheduleDate(new Date(Math.min.apply(null,aStartDateRescheduling))),
								"end_date" : GroupingBoxingManager.transformRescheduleDate(new Date(Math.max.apply(null,aEndDateRescheduling))),
						}
						
						if (GroupingBoxingManager.showInitial) {
						
						var oOperationInitial = {
							
							"type":"I",
							"text" : "WO1 OP30",
							"section_id" : 	"I_" + i,
							"progress" : sProgress,
							"start_date" : GroupingBoxingManager.transformRescheduleDate(new Date(Math.min.apply(null,aStartDateInitial))),
							"end_date" :GroupingBoxingManager.transformRescheduleDate(new Date(Math.max.apply(null,aEndDateInitial))),
						}
						
						aBox.push(oOperationInitial);
						
						}
						
						aBox.push(oOperationRescheduling);
						
					}
				}
				
			}
			
		
			
			
//			elements = [ // original hierarhical array to display
//	                        {key:10, label:"FUEL ACTIVITIES", open: true, children: [
//	                                                                                 
//	                        {key:"F1" , name:"Jae J.", subname:"JJ", hours:'6.0hs'},
//	                        {key:"F2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
//	                        {key:"F3", name:"Steve S.", subname:"SS", hours:'3.0hs'},
//	                        ]},
//	                         {key:105, label:"ELEC ACTIVITIES", open:true, children: [
//	                      
//	                         {key:"F1", name:"Jae J.", subname:"JJ", hours:'6.0hs'},
//	                         {key:"E2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
//	                         {key:"E3", name:"Steve S.", subname:"SS", hours:'3.0hs'},                                                    
//	                         ]},
//	                         {key:115, label:"MEC ACTIVITIES", open:true, children: [
//	                                                                                                     
//	                         {key:"M1", name:"Jae J.", subname:"JJ", hours:'6.0hs'},
//	                         {key:"M2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
//	                         {key:"M3", name:"Steve S.", subname:"SS", hours:'3.0hs'},
//	                         ]},
//	                         {key:120, label:"FLY ACTIVITIES", open:true, children: [
//	                     
//	                         {key:"A1", name:"Jae J.", subname:"JJ", hours:'6.0hs'},
//	                         {key:"A2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
//	                         {key:"A3", name:"Steve S.", subname:"SS", hours:'3.0hs'},
//	                         ]},
//	           ];


		 scheduler.matrix['timeline'].y_unit_original = aElements2;
		 scheduler.callEvent("onOptionsLoad", []);
		 
	     scheduler.init(sap.ui.getCore().byId("stationTrackerView").getId() + "--test" ,  new Date(2014,5,30),"timeline");
	     scheduler.clearAll();
	     
	     scheduler.parse(aBox
//	    		 [
//	                       
//	{ start_date: "2014-06-30 09:00", end_date: "2014-06-30 12:00", text:"Task A-12458", section_id:"I1" , type:"I" , progress:50, text:"WO1 OP30",},
//	{ start_date: "2014-06-30 12:00", end_date: "2014-06-30 14:00", text:"Task A-89411", section_id:"I1" , type:"I" , available : "ok",},
//	{ start_date: "2014-06-30 10:00", end_date: "2014-06-30 14:00", text:"Task A-64168",  section_id:"I1" , type:"I" , progress:50, text:"WO1 OP30",},
//	{ start_date: "2014-06-30 16:00", end_date: "2014-06-30 17:00", text:"Task A-46598",  section_id:"I1" , type:"I" , progress:50, text:"WO1 OP30", },
//
//	                       
//	                       
//	     { start_date: "2014-06-30 09:00", end_date: "2014-06-30 12:00", text:"Task A-12458", section_id:"F1" , type:"R" , progress:50, text:"WO1 OP30",},
//	     { start_date: "2014-06-30 12:00", end_date: "2014-06-30 14:00", text:"Task A-89411", section_id:"F2" , type:"R" , available : "ok", cp:"1"},
//	     { start_date: "2014-06-30 10:00", end_date: "2014-06-30 14:00", text:"Task A-64168",  section_id:"F3" , type:"R" , progress:50, text:"WO1 OP30",cp:"1"},
//	     { start_date: "2014-06-30 16:00", end_date: "2014-06-30 17:00", text:"Task A-46598",  section_id:"F1" , type:"R" , progress:50, text:"WO1 OP40", },
//	     
//
//	     { start_date: "2014-06-30 12:00", end_date: "2014-06-30 20:00", text:"Task B-48865",  section_id:"I2" , type:"I" , progress:50, text:"WO1 OP30",},
//	     { start_date: "2014-06-30 14:00", end_date: "2014-06-30 16:00", text:"Task B-44864",  section_id:"I2" , type:"I" , progress:50, text:"WO1 OP30",},
//	     { start_date: "2014-06-30 16:30", end_date: "2014-06-30 18:00", text:"Task B-46558",  section_id:"I2" , type:"I" , progress:50, text:"WO1 OP30",},
//	     { start_date: "2014-06-30 18:30", end_date: "2014-06-30 20:00", text:"Task B-45564",  section_id:"I2" , type:"I" , progress:50, text:"WO1 OP30",},
//	     
//	     
//	     { start_date: "2014-06-30 12:00", end_date: "2014-06-30 20:00", text:"Task B-48865",  section_id:"E1" , type:"R" , progress:50, text:"WO1 OP30",},
//	     { start_date: "2014-06-30 14:00", end_date: "2014-06-30 16:00", text:"Task B-44864",  section_id:"E2" , type:"R" , progress:50, text:"WO1 OP30",cp:"1"},
//	     { start_date: "2014-06-30 16:30", end_date: "2014-06-30 18:00", text:"Task B-46558",  section_id:"E3" , type:"R" , progress:50, text:"WO1 OP30",},
//	     { start_date: "2014-06-30 18:30", end_date: "2014-06-30 20:00", text:"Task B-45564",  section_id:"E3" , type:"R" , progress:50, text:"WO1 OP30",},
//	     
//	     
//	     { start_date: "2014-06-30 08:00", end_date: "2014-06-30 12:00", text:"Task C-32421",  section_id:"I3" , type:"I" , progress:50, text:"WO1 OP30",},
//	     { start_date: "2014-06-30 14:30", end_date: "2014-06-30 16:45", text:"Task C-14244",  section_id:"I3" , type:"I" , progress:50, text:"WO1 OP30",},
//	     
//	     { start_date: "2014-06-30 08:00", end_date: "2014-06-30 12:00", text:"Task C-32421",  section_id:"M1" , type:"R" , progress:50, text:"WO1 OP30",cp:"1"},
//	     { start_date: "2014-06-30 14:30", end_date: "2014-06-30 16:45", text:"Task C-14244",  section_id:"M2" , type:"R" , progress:50, text:"WO1 OP30",},
//	     
//
//	     { start_date: "2014-06-30 09:20", end_date: "2014-06-30 12:20", text:"Task D-52688",  section_id:"I4" , type:"I" , progress:50, text:"WO1 OP30",},
//	     { start_date: "2014-06-30 11:40", end_date: "2014-06-30 16:30", text:"Task D-46588",  section_id:"I4" , type:"I" , progress:50, text:"WO1 OP30",},
//	     { start_date: "2014-06-30 12:00", end_date: "2014-06-30 18:00", text:"Task D-12458",  section_id:"I4" , type:"I" , progress:50, text:"WO1 OP30",},
//	     
//	     { start_date: "2014-06-30 09:20", end_date: "2014-06-30 12:20", text:"Task D-52688",  section_id:"A1" , type:"R" , progress:50, text:"WO1 OP30",cp:"1"},
//	     { start_date: "2014-06-30 11:40", end_date: "2014-06-30 16:30", text:"Task D-46588",  section_id:"A2" , type:"R" , progress:50, text:"WO1 OP30",},
//	     { start_date: "2014-06-30 12:00", end_date: "2014-06-30 18:00", text:"Task D-12458",  section_id:"A3" , type:"R" , progress:50, text:"WO1 OP30",}
//	                  ]
	    		 ,"json");
	     
	     
	     
			
		},
		
}
airbus.mes.stationtracker.ModelManager.init(sap.ui.getCore());

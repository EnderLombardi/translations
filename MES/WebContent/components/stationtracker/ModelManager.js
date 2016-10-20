//"use strict";
jQuery.sap.declare("airbus.mes.stationtracker.ModelManager")
airbus.mes.stationtracker.ModelManager = {
		urlModel : undefined,
		queryParams : jQuery.sap.getUriParameters(),
		
		i18nModel: undefined,
				
		init : function(core) {
			
			

			core.setModel(new sap.ui.model.json.JSONModel(),"WorkListModel");	
			core.setModel(new sap.ui.model.json.JSONModel(),"stationTrackerRModel"); // Station tracker model reschedule line
			core.setModel(new sap.ui.model.json.JSONModel(),"stationTrackerIModel"); // Station tracker model initial line
			core.setModel(new sap.ui.model.json.JSONModel(),"shiftsModel"); // Shifts model
			core.setModel(new sap.ui.model.json.JSONModel(),"affectationModel"); 
			core.setModel(new sap.ui.model.json.JSONModel(),"unPlannedModel"); // Unplanned model
			core.setModel(new sap.ui.model.json.JSONModel(),"groupModel");	// Unplanned Filter Model			
			core.setModel(new sap.ui.model.json.JSONModel(),"OSWModel"); // OutStanding Work model
			core.setModel(new sap.ui.model.json.JSONModel(),"stationTrackerShift");	//Shifts for station tracker
			core.setModel(new sap.ui.model.json.JSONModel(),"KPI");	//KPI
			core.setModel(new sap.ui.model.json.JSONModel(),"productionGroupModel"); // production Group model
			
			core.getModel("stationTrackerRModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onStationTrackerLoad);
			core.getModel("stationTrackerIModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onStationTrackerLoad);
			core.getModel("shiftsModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onShiftsLoad);
			core.getModel("affectationModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onAffectationLoad);
			
			core.getModel("unPlannedModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onUnPlannedLoad);
			core.getModel("OSWModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onOWSLoad);
			
		
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
						
			// TODO DEPLACE this in shell controller and when service is ok remove all of this function
			this.loadFilterUnplanned();		
			this.loadProductionGroup();
			
//			var i18nModel = new sap.ui.model.resource.ResourceModel({
//	            bundleUrl : "./i18n/i18n.properties",
//	         });
//			core.setModel(i18nModel, "StationTrackerI18n");
						
		},
				
		loadAffectation : function() {
			
			var oData = airbus.mes.settings.ModelManager;
			var geturlAffectation = this.urlModel.getProperty('urlaffectation');			
			
			geturlAffectation = airbus.mes.stationtracker.ModelManager.replaceURI(geturlAffectation, "$site", oData.site);
			geturlAffectation = airbus.mes.stationtracker.ModelManager.replaceURI(geturlAffectation, "$station", oData.station);
			geturlAffectation = airbus.mes.stationtracker.ModelManager.replaceURI(geturlAffectation, "$msn", oData.msn);
			
			var oViewModel = sap.ui.getCore().getModel("affectationModel");
			oViewModel.loadData(geturlAffectation, null, false);
		
		},
		
		onAffectationLoad : function() {
			
			airbus.mes.stationtracker.AssignmentManager.computeAffectationHierarchy();
				
		},
		
		loadStationTracker : function(sType) {
				
				var oData = airbus.mes.settings.ModelManager;
				
				var geturlstationtracker = this.urlModel.getProperty('urlstationtrackeroperation');			
				
				geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$site", oData.site);
				geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$station", oData.station);
				geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$msn", oData.msn);
				geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$operationType", sType);
				geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$productionGroup", "%");
				

				switch (sType) {
				case "R":
					var oViewModel = sap.ui.getCore().getModel("stationTrackerRModel");
					break;
				case "I":
					var oViewModel = sap.ui.getCore().getModel("stationTrackerIModel");
		
					break;
				case "U":
					var oViewModel = sap.ui.getCore().getModel("unPlannedModel");
		
					break;
				case "O":
					var oViewModel = sap.ui.getCore().getModel("OSWModel");
		
					break;
		
				}
						
				oViewModel.loadData(geturlstationtracker , null, false);				
			
		},	
		
		onStationTrackerLoad : function() {
			
			var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
		
			GroupingBoxingManager.parseOperation(GroupingBoxingManager.group,GroupingBoxingManager.box);
			
			airbus.mes.stationtracker.ModelManager.selectMyShift();
			
		},

		onUnPlannedLoad : function() {
			
			//var oData = sap.ui.getCore().getModel("unPlannedModel").getData();
			var oModel = sap.ui.getCore().getModel("unPlannedModel");
			
			if(!oModel.getProperty("/Rowsets/Rowset/0/Row")){              

	        	oModel = []
	        	console.log("no Unplanned operation load");
	        	
	        }
			
		},
		
		
		onOWSLoad : function() {
			
			var oModel = sap.ui.getCore().getModel("OSWModel");
			
			if(!oModel.getProperty("/Rowsets/Rowset/0/Row")){              

	        	oModel = []
	        	console.log("no Unplanned operation load");
	        	
	        }
			
				
		},
		
//		loadUnplanned : function() {
//			
//			var oViewModel = sap.ui.getCore().getModel("unPlannedModel");
//			oViewModel.loadData(this.urlModel.getProperty("urlstationtrackerunplannedactivities") , null, false);		
//			airbus.mes.stationtracker.ModelManager.Unplanned = oViewModel;
//		},	
		loadFilterUnplanned : function() {
			var oViewModel = sap.ui.getCore().getModel("groupModel");
			oViewModel.loadData(this.urlModel.getProperty("urlgroupmodel") , null, false);		
			airbus.mes.stationtracker.ModelManager.filterUnplanned = oViewModel;

		},		
		loadOSW : function(){
			var oViewModel = sap.ui.getCore().getModel("OSWModel");
			oViewModel.loadData(this.urlModel.getProperty("urlOSW") , null, false);		
			airbus.mes.stationtracker.ModelManager.OSW = oViewModel;			
			
		},
		loadProductionGroup : function() {
			
			var oData = airbus.mes.settings.ModelManager;
			var geturlstationtracker = this.urlModel.getProperty('urlproductiongroup');			
			
			geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$station", "PHYS_ST_IP4"/*oData.station*/);
			geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$plant", "FNZ1"/*oData.plant*/);

			var oViewModel = sap.ui.getCore().getModel("productionGroupModel");
			oViewModel.loadData(geturlstationtracker , null, false);		
			airbus.mes.stationtracker.ModelManager.ProductionGroup = oViewModel;
			
		},			
		loadKPI : function() {
			var oViewModel = sap.ui.getCore().getModel("KPI");
			oViewModel.loadData(this.urlModel.getProperty("urlKPI") , null, false);		
			airbus.mes.stationtracker.ModelManager.KPI = oViewModel;
			
		},		
		selectMyShift : function()
		{
			//stationTrackerShift model
			var oView = airbus.mes.stationtracker.oView;
			var options = airbus.mes.stationtracker.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.ShiftManager.current_day];
			var modelarray = [];
			var i = 0;
			for (var prop in options) {
	        // skip loop if the property is from prototype
		        if(!options.hasOwnProperty(prop)) continue;
		        
		        var element = {};
		        element.id = i;
		        element.value = prop;
		        element.visible = airbus.mes.stationtracker.ShiftManager.dayDisplay;
		        modelarray.push(element);
		        i++;
		    }
			
			oView.getModel("stationTrackerShift").setData( modelarray );
			oView.getModel("stationTrackerShift").refresh();
			airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(0);
			airbus.mes.stationtracker.oView.byId("selectShift").fireChange(0)
			
//			Manage date of date picker
//			Retrieve text on div dhx_cal_date and split to keep only the date			
			var oDate = new Date($("div[class='dhx_cal_date']").contents()[0].data.split("-")[0]);
			var oDatePicker = airbus.mes.stationtracker.oView.byId("DatePicker");
			oDatePicker.setDateValue(oDate);
//			TODO : date formatter
			oDatePicker.setValueFormat("dd-MM-yyyy");

		},
		onStationTrackerLoad : function() {
			
			var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
		
			GroupingBoxingManager.parseOperation(GroupingBoxingManager.group,GroupingBoxingManager.box);
			
			airbus.mes.stationtracker.ModelManager.selectMyShift();
			
		},				
		loadShifts : function() {
			var oViewModelshift = sap.ui.getCore().getModel("shiftsModel");
			oViewModelshift.loadData(this.urlModel.getProperty("urlshifts"), null, false);
		},	
		onShiftsLoad : function() {
			
			var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
			GroupingBoxingManager.parseShift();
		},
		
		
		replaceURI : function (sURI, sFrom, sTo) {
				return sURI.replace(sFrom, encodeURIComponent(sTo));
			},
		getUrlReschedulingService : function() {
//			  get Url of the service
			  var urlReschedulingService = this.urlModel.getProperty("urlReschedulingService");
//			  Set input parameter for the service
//			  TODO : the service is not yet defined
			  urlReschedulingService = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$user", airbus.mes.settings.ModelManager.user);
			  return urlReschedulingService;
		},
		sendRescheduleRequest : function(oEvent) {
            jQuery.ajax({
                url: airbus.mes.stationtracker.ModelManager.getUrlReschedulingService(),
                error:function(xhr,status,error){
                      airbus.mes.settings.ModelManager.messageShow("Couldn't Save Changes");
                      that.navigate(oEvent);
                      //window.location.pathname = "/MES/WebContent/components/stationtracker/index.html";
                },
                success:function(result,status,xhr){
                      // window.location.href = url;
                      airbus.mes.settings.ModelManager.messageShow("Settings Saved Successfully");
                      that.navigate(oEvent);
                      //window.location.pathname = "/MES/WebContent/components/stationtracker/index.html";

                }
         });
       },
 
       
       openOperationPopOver : function( id ) {
    	   
    	   /*jQuery.sap.require("sap.m.MessageBox");
    	   
    	   sap.m.MessageBox.alert("Hello");*/
    	   
    	   if ( airbus.mes.stationtracker.operationDetailPopover === undefined ) {
				
				airbus.mes.stationtracker.operationDetailPopover = sap.ui.xmlfragment("operationDetailPopover","airbus.mes.stationtracker.operationDetailPopover", airbus.mes.stationtracker.oView.getController());
				airbus.mes.stationtracker.operationDetailPopover.addStyleClass("alignTextLeft");
				airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.operationDetailPopover);		
			}
			
    	   airbus.mes.stationtracker.operationDetailPopover.open();

			/*if ( airbus.mes.stationtracker.operationPopover === undefined ) {
				
				airbus.mes.stationtracker.operationPopover = sap.ui.xmlfragment("operationPopover","airbus.mes.stationtracker.operationPopover", airbus.mes.stationtracker.oView.getController());
				airbus.mes.stationtracker.operationPopover.addStyleClass("alignTextLeft");
				airbus.mes.stationtracker.operationPopover.setModel(sap.ui.getCore().getModel("WorkListModel"), "WorkListModel");
				airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.operationPopover);		
			}
			
			var oNavCon = sap.ui.getCore().byId("operationPopover--navOperatorContainer");
			var oMasterPage = sap.ui.getCore().byId("operationPopover--master");
			oNavCon.to(oMasterPage);
			oNavCon.currentPageIsTopPage();
			var oOperationPopover = sap.ui.getCore().byId("operationPopover--operationPopoverID");
			var oModel = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy[scheduler.getEvent(id).group][scheduler.getEvent(id).avlLine][scheduler.getEvent(id).box];
			
			// Set data in Model WorkList 
			airbus.mes.stationtracker.operationPopover.getModel("WorkListModel").setData(oModel);
			airbus.mes.stationtracker.operationPopover.getModel("WorkListModel").refresh();

			airbus.mes.stationtracker.operationPopover.open();	*/

    	   
       },
       
       openWorkListPopover : function( id ) {
    	 
    	   if ( airbus.mes.stationtracker.worklistPopover === undefined ) {
				
				airbus.mes.stationtracker.worklistPopover = sap.ui.xmlfragment("worklistPopover","airbus.mes.stationtracker.worklistPopover", airbus.mes.stationtracker.oView.getController());
				airbus.mes.stationtracker.worklistPopover.addStyleClass("alignTextLeft");
				airbus.mes.stationtracker.worklistPopover.setModel(sap.ui.getCore().getModel("WorkListModel"), "WorkListModel");
				airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().getModel("groupModel").getData()), "groupModel");
				airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.worklistPopover);
					
			}
			
			airbus.mes.stationtracker.worklistPopover.OSW = false;
			airbus.mes.stationtracker.worklistPopover.unPlanned = false;
			
			sap.ui.getCore().byId("worklistPopover--myList").bindAggregation('items', {
				path : "WorkListModel>/",
				template : sap.ui.getCore().byId("worklistPopover--sorterList"),
				sorter : [ new sap.ui.model.Sorter({
					// Change this value dynamic
					path : 'WORKORDER_ID',
					descending : false,
					group : true,
				}), new sap.ui.model.Sorter({
					path : 'index',
					descending : false
				}) ]
			});	
			
			var oModel = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy[scheduler.getEvent(id).group][scheduler.getEvent(id).avlLine][scheduler.getEvent(id).box];
			
//			if ( oModel.length === 1 ) {
//				
//				airbus.mes.stationtracker.ModelManager.openOperationPopOver(id);
//				return;
//			}
			
			if (oModel && oModel.length > 0 && oModel) {
				oModel = airbus.mes.stationtracker.util.Formatter.sortWorkList(oModel);
			}		
					
			airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(oModel),"WorkListModel");
			airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").refresh(true);
			// delay because addDependent will do a async rerendering and the popover will immediately close without it
			airbus.mes.stationtracker.worklistPopover.open();	
    	   
       },
       
       OpenWorkList : function( id ) {
    	
    	  switch(airbus.mes.stationtracker.GroupingBoxingManager.box){
			case "OPERATION_ID" : 
//				//Boxing operation, we display the operation list
				airbus.mes.stationtracker.ModelManager.openOperationPopOver(id);
				break;
				
			case "WORKORDER_ID" :	
				//Boxing Work order, we display the worklist list								
				
				airbus.mes.stationtracker.ModelManager.openWorkListPopover(id);
				
				break;
       	
    	  }
       }
}

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
			core.setModel(new sap.ui.model.json.JSONModel(),"filterUnplannedModel");	// Unplanned Filter Model			
			core.setModel(new sap.ui.model.json.JSONModel(),"OSWModel"); // OutStanding Work model
			core.setModel(new sap.ui.model.json.JSONModel(),"stationTrackerShift");	//Shifts for station tracker
			core.setModel(new sap.ui.model.json.JSONModel(),"KPI");	//KPI
			
			core.getModel("stationTrackerRModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onStationTrackerLoad);
			core.getModel("stationTrackerIModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onStationTrackerLoad);
			core.getModel("shiftsModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onShiftsLoad);
			core.getModel("affectationModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onAffectationLoad);
			
			
			core.setModel(new sap.ui.model.json.JSONModel(),"productionGroupModel"); // production Group model
	

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
			this.loadUnplanned();		
			this.loadFilterUnplanned();		
			this.loadOSW();
			this.loadProductionGroup();
			
//			this.i18nModel = new sap.ui.model.resource.ResourceModel({
//				bundleUrl : "i18n/messageBundle.properties",
//				bundleLocale : core.getConfiguration().getLanguage()
//			});
//			core.setModel(this.i18nModel, "messageBundle");
						
		},
				
		loadAffectation : function() {
			var oViewModel = sap.ui.getCore().getModel("affectationModel");
			oViewModel.loadData(this.urlModel.getProperty("urlaffectation"), null, false);
		
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

		loadUnplanned : function() {
			
			var oViewModel = sap.ui.getCore().getModel("unPlannedModel");
			oViewModel.loadData(this.urlModel.getProperty("urlstationtrackerunplannedactivities") , null, false);		
			airbus.mes.stationtracker.ModelManager.Unplanned = oViewModel;
		},	
		loadFilterUnplanned : function() {
			var oViewModel = sap.ui.getCore().getModel("filterUnplannedModel");
			oViewModel.loadData(this.urlModel.getProperty("urlfilterunplanned") , null, false);		
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
			
			//oView.setMoairbus.mes.stationtracker.oViewdel(new sap.ui.model.json.JSONModel(modelarray),"stationTrackerShift");
			
			var toolbarDateId = airbus.mes.stationtracker.oView.byId("toolbarDate").sId;
			$("div[id="+toolbarDateId+"]").contents().remove();
			$("div[id="+toolbarDateId+"]").append($("div[class='dhx_cal_date']").contents().clone());
			
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
			
			
			
		}		
}

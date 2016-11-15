"use strict";
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.declare("airbus.mes.stationtracker.ModelManager");
airbus.mes.stationtracker.ModelManager = {
       urlModel : undefined,
       queryParams : jQuery.sap.getUriParameters(),

       i18nModel : undefined,
       operationType : undefined,

       firstTime : undefined,
       
       init : function(core) {

              core.setModel(new sap.ui.model.json.JSONModel(), "operationDetailModel");// Model having operation detail
              core.setModel(new sap.ui.model.json.JSONModel(), "WorkListModel");
              core.setModel(new sap.ui.model.json.JSONModel(), "stationTrackerRModel"); // Station tracker model  // reschedule line
              core.setModel(new sap.ui.model.json.JSONModel(), "stationTrackerIModel"); // Station tracker model// initial line
              core.setModel(new sap.ui.model.json.JSONModel(), "shiftsModel"); // Shifts// model
              core.setModel(new sap.ui.model.json.JSONModel(), "affectationModel");
              core.setModel(new sap.ui.model.json.JSONModel(), "unPlannedModel"); // Unplanned// // model
              core.setModel(new sap.ui.model.json.JSONModel(), "groupModel"); // Unplanned      // Filter// Model
              core.setModel(new sap.ui.model.json.JSONModel(), "OSWModel"); // OutStanding// Work      // model
              core.setModel(new sap.ui.model.json.JSONModel(), "stationTrackerShift"); // Shifts// for/ station// tracker
              core.setModel(new sap.ui.model.json.JSONModel(), "KPI"); // KPI
              core.setModel(new sap.ui.model.json.JSONModel(), "productionGroupModel"); // production Group model
              core.setModel(new sap.ui.model.json.JSONModel(), "ressourcePoolModel"); // Resource// poolModel
              core.setModel(new sap.ui.model.json.JSONModel(), "groupModel"); // Unplanned// Filter// Model

              core.getModel("stationTrackerRModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onStationTrackerLoad);
              core.getModel("stationTrackerIModel").attachRequestCompleted( airbus.mes.stationtracker.ModelManager.onStationTrackerLoad);
              core.getModel("shiftsModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onShiftsLoad);
              core.getModel("affectationModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onAffectationLoad);
              core.getModel("unPlannedModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onUnPlannedLoad);
              core.getModel("OSWModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onOWSLoad);

              var dest;

              switch (window.location.hostname) {
              case "localhost":
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

              // TODO DEPLACE this in shell controller and when service is ok remove
              // all of this function
             this.loadShifts();
              airbus.mes.stationtracker.ShiftManager.init(airbus.mes.stationtracker.GroupingBoxingManager.shiftNoBreakHierarchy);
              this.loadFilterUnplanned();
              this.loadProductionGroup();
              this.loadRessourcePool();
              this.loadKPI();

       
//              Refresh the model 
//                var that = this;
//              	if(this.firstTime !== true) {
//              	setInterval(function()
//              			{	
//              				console.log("Refresh");
//              				airbus.mes.stationtracker.ModelManager.init(core);
//              		    }, 10000);
//              	that.firstTime = true;
//              	}
       
       },
       
       setLineAssignment : function(sSite, sStation, sMSN, sUserID, sShiftName, sDay, sLine, sSkill, sMyUserID, sModeAssignment, bQACheck) {
    	   var seturlLineAssignment = this.urlModel.getProperty('urlsetlineassignment');
    	   seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$site", sSite);
    	   seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$station", sStation);
    	   seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$msn", sMSN);
    	   seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$userid", sUserID);
    	   seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$shiftName", sShiftName);
    	   seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$day", sDay);
    	   seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$line", sLine);
    	   seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$skill", sSkill);
    	   seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$myuserid", sMyUserID);
    	   seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$mode", sModeAssignment);
    	   seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$qacheck", bQACheck);
    	   
 	   
    	   $.ajax({
   			url : seturlLineAssignment,
   			cache : false,
   			success : function(data, textStatus, jqXHR) {
   				//TODO handle Warning QA
   				if(airbus.mes.shell.util.Formatter.getMiiMessageType(data) == "E"){
   					sap.m.MessageToast.show(airbus.mes.shell.util.Formatter.getMiiTextFromData(data));
   				} else if(data.message == "W"){
   					var checkQAModel = new sap.ui.model.json.JSONModel();
   					checkQAModel.setData(data.Rowsets.Rowset[1]);
   					if (!airbus.mes.stationtracker.checkQAPopUp) {
   						airbus.mes.stationtracker.checkQAPopUp = sap.ui.xmlfragment("airbus.mes.stationtracker.checkQAPopUp", airbus.mes.stationtracker.oView.getController());
   					}
   					airbus.mes.stationtracker.checkQAPopUp.setModel(checkQAModel, "checkQAModel");
   					airbus.mes.stationtracker.checkQAPopUp.setModel(airbus.mes.stationtracker.oView.getModel("StationTrackerI18n"),"StationTrackerI18n");
   					airbus.mes.stationtracker.checkQAPopUp.open();
   				} else if (data.message == "S"){
   					airbus.mes.shell.globalNavigation.renderStationTracker();
   					airbus.mes.stationtracker.oPopoverPolypoly.close();
   				}
   			},
   		});
       },
              
       loadAffectation : function() {

              var oData = airbus.mes.settings.ModelManager;
              var geturlAffectation = this.urlModel.getProperty('urlaffectation');

              geturlAffectation = airbus.mes.stationtracker.ModelManager.replaceURI(geturlAffectation, "$site", oData.site);
              geturlAffectation = airbus.mes.stationtracker.ModelManager.replaceURI(geturlAffectation, "$station",
                           oData.station);
              geturlAffectation = airbus.mes.stationtracker.ModelManager.replaceURI(geturlAffectation, "$msn", oData.msn);

              var oViewModel = sap.ui.getCore().getModel("affectationModel");
              oViewModel.loadData(geturlAffectation, null, false);

       },

       onAffectationLoad : function() {

              var oModel = sap.ui.getCore().getModel("affectationModel");

              if (oModel.getProperty("/Rowsets/Rowset/0/Row")) {

                     oModel = sap.ui.getCore().getModel("affectationModel").oData.Rowsets.Rowset[0].Row;

              } else {
                     // oModel.oData.Rowsets.Rowset[0].Row = [];
                     console.log("no affectationModel load");
              }
              airbus.mes.stationtracker.AssignmentManager.computeAffectationHierarchy();

       },

       loadStationTracker : function(sType) {

              var oData = airbus.mes.settings.ModelManager;
              this.operationType = sType;

              var geturlstationtracker = this.urlModel.getProperty('urlstationtrackeroperation');
              geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$site",oData.site);
              geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$station", oData.station);
              geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$msn", oData.msn);
              geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$operationType", sType);
              geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$productionGroup", airbus.mes.settings.ModelManager.prodGroup);
              geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$user",
                           airbus.mes.stationtracker.AssignmentManager.userSelected);
              
              var oViewModel;
              switch (sType) {
              case "R":
                     oViewModel = sap.ui.getCore().getModel("stationTrackerRModel");
                     break;
              case "I":
                     oViewModel = sap.ui.getCore().getModel("stationTrackerIModel");
                     break;
              case "U":
                     oViewModel = sap.ui.getCore().getModel("unPlannedModel");
                     break;
              case "O":
                     oViewModel = sap.ui.getCore().getModel("OSWModel");
                     break;

              }

              oViewModel.loadData(geturlstationtracker, null, false);

       },
       computeStatus : function(aModel) {

    	   aModel.forEach(function(el){

//			TODO : factorize this computation 
//			Developped too on ModelManager.js
			var sStatus = "0";
			// Operation is active	

			if (  el.PAUSED === "false") {
				
				sStatus = "2";
			}
					
			// Operation is not started
			if ( el.PAUSED === "---" ) {
				
				sStatus = "1";
				
				// Operation is pause	
				if ( el.PAUSED === "---" && el.PROGRESS != "0" ) {
					
					sStatus = "3";
				}	
			
			}
									
			// Operation Completed
			if ( el.STATE === "C" ) {
				
				sStatus = "0";
			}	
				
			el.status = sStatus;
		});
        
    		
	   },
       setOSW : function(aItem) {

              console.log(airbus.mes.stationtracker.util.Formatter.json2xml({
                     SFC_Step : {
                           item : aItem
                     }
              }));

       },

       onUnPlannedLoad : function() {

              var aModel = sap.ui.getCore().getModel("unPlannedModel");

              if (!aModel.getProperty("/Rowsets/Rowset/0/Row")) {

            	  	aModel = [];
                     console.log("no Unplanned operation load");

              } else {
            	  
            	  aModel = aModel.getProperty("/Rowsets/Rowset/0/Row")
              }
              
//      		 Compute status for Unplanned and OSW Model
              airbus.mes.stationtracker.ModelManager.computeStatus(aModel);
              
       },

       onOWSLoad : function() {

              var aModel = sap.ui.getCore().getModel("OSWModel");

              if (!aModel.getProperty("/Rowsets/Rowset/0/Row")) {

            	  aModel = [];
                     console.log("no OWS operation load");

              } else {
            	  
            	  aModel = aModel.getProperty("/Rowsets/Rowset/0/Row")
              }
//      		 Compute status for Unplanned and OSW Model
              airbus.mes.stationtracker.ModelManager.computeStatus(aModel);     

       },

       loadFilterUnplanned : function() {
              var oViewModel = sap.ui.getCore().getModel("groupModel");
              oViewModel.loadData(this.urlModel.getProperty("urlgroupmodel"), null, false);
              airbus.mes.stationtracker.ModelManager.filterUnplanned = oViewModel;

       },
       loadRessourcePool : function() {
              var oViewModel = sap.ui.getCore().getModel("ressourcePoolModel");
              oViewModel.loadData(this.urlModel.getProperty("urlressourcepool"), null, false);

       },
       loadProductionGroup : function() {

              var oData = airbus.mes.settings.ModelManager;
              var geturlstationtracker = this.urlModel.getProperty('urlproductiongroup');

              geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$station", oData.station );
              geturlstationtracker = airbus.mes.stationtracker.ModelManager.replaceURI(geturlstationtracker, "$plant", oData.site );

              var oViewModel = sap.ui.getCore().getModel("productionGroupModel");
              oViewModel.loadData(geturlstationtracker, null, false);
              airbus.mes.stationtracker.ModelManager.ProductionGroup = oViewModel;

       },
       loadKPI : function() {
              var oViewModel = sap.ui.getCore().getModel("KPI");
              oViewModel.loadData(this.urlModel.getProperty("urlKPI"), null, false);
              airbus.mes.stationtracker.ModelManager.KPI = oViewModel;

       },

       /**
       * Used to update data of shift combobox regarding the day of the gantt
       * 
       */
       selectMyShift : function() {
              // stationTrackerShift model
              var oView = airbus.mes.stationtracker.oView;
              var options = airbus.mes.stationtracker.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.ShiftManager.current_day];
              var modelarray = [];
              var sShiftName = "";
              var i = 0;
              for ( var prop in options) {
                     // skip loop if the property is from prototype
                     if (!options.hasOwnProperty(prop))
                           continue;

                     airbus.mes.stationtracker.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.ShiftManager.current_day][prop]
                                  .forEach(function(key1, index) {

                                         sShiftName = airbus.mes.stationtracker.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.ShiftManager.current_day][prop][index].shiftName;

                                  });

                     var element = {};
                     element.value = prop;
                     element.visible = airbus.mes.stationtracker.ShiftManager.dayDisplay;
                     element.shiftName = sShiftName;
                     element.day = airbus.mes.stationtracker.ShiftManager.current_shift.day;
                     element.shiftID = prop;
                     modelarray.push(element);

              }

              oView.getModel("stationTrackerShift").setData(modelarray);
              oView.getModel("stationTrackerShift").refresh();

              if (airbus.mes.stationtracker.ShiftManager.dayDisplay) {

                     airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftName = airbus.mes.stationtracker.ShiftManager.current_shift.shiftName;
                     airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftID = airbus.mes.stationtracker.ShiftManager.current_shift.shiftID;
                     airbus.mes.stationtracker.ShiftManager.ShiftSelected.day = airbus.mes.stationtracker.ShiftManager.current_shift.day;
                     airbus.mes.stationtracker.ShiftManager.ShiftSelected.StartDate =        airbus.mes.stationtracker.ShiftManager.current_shift.StartDate; 
              
                     airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftID);
                     airbus.mes.stationtracker.oView.byId("selectShift").fireChange(0);

              }

              if (airbus.mes.stationtracker.ShiftManager.shiftDisplay) {

                     airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftName = airbus.mes.stationtracker.ShiftManager.current_shift.shiftName;
                     airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftID = airbus.mes.stationtracker.ShiftManager.current_shift.shiftID;
                     airbus.mes.stationtracker.ShiftManager.ShiftSelected.day = airbus.mes.stationtracker.ShiftManager.current_shift.day;
                     airbus.mes.stationtracker.ShiftManager.ShiftSelected.StartDate = airbus.mes.stationtracker.ShiftManager.current_shift.StartDate; 
                 
                    
                     airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftID);
                     scheduler.updateView(airbus.mes.stationtracker.ShiftManager.ShiftSelected.StartDate);
                    
              }

              var oDate = new Date($("div[class='dhx_cal_date']").contents()[0].data.split("-")[0]);
              var oFormatddMMyyy = sap.ui.core.format.DateFormat.getInstance({pattern: "dd MMM yyyy", calendarType: sap.ui.core.CalendarType.Gregorian});
              var oText = airbus.mes.stationtracker.oView.byId("dateLabel");
              oText.setText(oFormatddMMyyy.format(oDate));

       },
       onStationTrackerLoad : function() {

              var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;

              GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);

              airbus.mes.stationtracker.ModelManager.selectMyShift();

       },
       loadShifts : function() {
             
    	   	  var oViewModelshift = sap.ui.getCore().getModel("shiftsModel");
              var getUrlShifts = this.urlModel.getProperty("urlshifts");
              var oData = airbus.mes.settings.ModelManager;
              var reqResult = "";
              getUrlShifts = airbus.mes.stationtracker.ModelManager.replaceURI(getUrlShifts, "$site", oData.site );
              getUrlShifts = airbus.mes.stationtracker.ModelManager.replaceURI(getUrlShifts, "$station", oData.station );
              getUrlShifts = airbus.mes.stationtracker.ModelManager.replaceURI(getUrlShifts, "$msn", oData.msn );
              
              oViewModelshift.loadData(getUrlShifts, null, false);
              
              reqResult = airbus.mes.shell.util.Formatter.getMiiMessageType(oViewModelshift.oData);
              
  				switch( reqResult ){
  				case "S":
  					break;
  				case "E":
  					sap.m.MessageToast.show("Error : " + airbus.mes.shell.util.Formatter.getMiiTextFromData( oViewModelshift.oData ));
  				
  					break;
  				}	
                           
       },
       onShiftsLoad : function() {

              var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
              GroupingBoxingManager.parseShift();
       },

       replaceURI : function(sURI, sFrom, sTo) {
              return sURI.replace(sFrom, encodeURIComponent(sTo));
       },
       getUrlReschedulingService : function() {
              // get Url of the service
              var urlReschedulingService = this.urlModel.getProperty("urlReschedulingService");
              // Set input parameter for the service
              // TODO : the service is not yet defined
              urlReschedulingService = airbus.mes.settings.ModelManager.replaceURI(urlSaveUserSetting, "$user",
                           airbus.mes.settings.ModelManager.user);
              return urlReschedulingService;
       },
       sendRescheduleRequest : function(oEvent) {
              jQuery.ajax({
                     url : airbus.mes.stationtracker.ModelManager.getUrlReschedulingService(),
                     error : function(xhr, status, error) {
                           airbus.mes.settings.ModelManager.messageShow("Couldn't Save Changes");
                           that.navigate(oEvent);
                           // window.location.pathname =
                           // "/MES/WebContent/components/stationtracker/index.html";
                     },
                     success : function(result, status, xhr) {
                           // window.location.href = url;
                           airbus.mes.settings.ModelManager.messageShow("Settings Saved Successfully");
                           that.navigate(oEvent);
                           // window.location.pathname =
                           // "/MES/WebContent/components/stationtracker/index.html";

                     }
              });
       },

       openWorkListPopover : function(id) {

    	   	  var elModel;
    	   	  var elOverallModel = {};
    	   	  var aOverallModel = [];
    	   	  var fAllDuration = 0;
    	   	  var fAllProgress = 0;
    	   	  var fNumberEl = 0;
    	   	  
//    	   	  Check if there is only one operation on the worklist
//    	   	  If yes, open the operation list
    	   	  var aModel = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy[scheduler.getEvent(id).group][scheduler
                                                                                                                         .getEvent(id).avlLine][scheduler.getEvent(id).box];

              if (aModel.length === 1) {
				
	      		   airbus.mes.stationtracker.ModelManager.openOperationDetailPopup(aModel);
     			   return;
              }
   
              if (airbus.mes.stationtracker.worklistPopover === undefined) {

                     airbus.mes.stationtracker.worklistPopover = sap.ui.xmlfragment("worklistPopover", "airbus.mes.stationtracker.worklistPopover", airbus.mes.stationtracker.oView.getController());
                     airbus.mes.stationtracker.worklistPopover.addStyleClass("alignTextLeft");
//                     airbus.mes.stationtracker.worklistPopover.setModel(sap.ui.getCore().getModel("WorkListModel"), "WorkListModel");
//                     airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().getModel("groupModel").getData()), "groupModel");
                     airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.worklistPopover);
              }

              airbus.mes.stationtracker.worklistPopover.OSW = false;
              airbus.mes.stationtracker.worklistPopover.unPlanned = false;
//            Keep the array list of operation to ease the click action on the operation
              airbus.mes.stationtracker.worklistPopover.aModel = aModel;

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

              if (aModel && aModel.length > 0 && aModel) {
                     aModel = airbus.mes.stationtracker.util.Formatter.sortWorkList(aModel);
              }
              
//            Manage model on worklist
//            Overall progress model
              aModel.forEach(function(elModel){
//            	  TODO
//            	  elOverallModel.STATE =???
//            	  elOverallModel.andons = ???
            	  fNumberEl = fNumberEl + 1;
            	  fAllDuration = fAllDuration + elModel.DURATION;
            	  fAllProgress = fAllProgress + elModel.PROGRESS;            	  

            	  elOverallModel.WORKORDER_ID = elModel.WORKORDER_ID;
            	  elOverallModel.WORKORDER_DESCRIPTION = elModel.WORKORDER_DESCRIPTION;              
              });

        	  elOverallModel.OPERATION_ID = "";
        	  elOverallModel.OPERATION_DESCRIPTION = "";
        	  elOverallModel.DURATION = Math.floor(fAllDuration / fNumberEl);
        	  elOverallModel.PROGRESS = Math.floor(fAllProgress / fNumberEl);  
        	  aOverallModel.push(elOverallModel);

              airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(aOverallModel), "WorkListOverallModel");
              airbus.mes.stationtracker.worklistPopover.getModel("WorkListOverallModel").refresh(true);
        	  
//            Operation model  
              airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(aModel), "WorkListModel");
              airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").refresh(true);

//            Overall Progress is only display on worklist
              sap.ui.getCore().byId("worklistPopover--overallProgress").setVisible(true);         
              
              // delay because addDependent will do a async rerendering and the
              // popover will immediately close without it
              airbus.mes.stationtracker.worklistPopover.open();

       },

       OpenWorkList : function(id) {

              switch (airbus.mes.stationtracker.GroupingBoxingManager.box) {
              case "OPERATION_ID":
                     // Boxing operation, we display the operation list
                     var aModel = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy[scheduler.getEvent(id).group][scheduler
                                                                                                                                .getEvent(id).avlLine][scheduler.getEvent(id).box];
     
                	 airbus.mes.stationtracker.ModelManager.openOperationDetailPopup(aModel);
                     break;

              case "WORKORDER_ID":
                     // Boxing Work order, we display the worklist list
                     airbus.mes.stationtracker.ModelManager.openWorkListPopover(id);
                     break;

              }

       },
       /***************************************************************************
       * open operation detail popup containing progress slider
       **************************************************************************/
       openOperationDetailPopup : function(aModel) {
              if (airbus.mes.stationtracker.operationDetailPopup === undefined) {

                     airbus.mes.stationtracker.operationDetailPopup = sap.ui.xmlfragment("operationDetailPopup",
                                  "airbus.mes.stationtracker.fragments.operationDetailPopup", airbus.mes.stationtracker.oView
                                                .getController());
                     airbus.mes.stationtracker.operationDetailPopup.setModel(sap.ui.getCore().getModel("operationDetailModel"),
                                  "operationDetailModel");

                     airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.operationDetailPopup);
 
              }

             
              // calculate status of operation
              var sStatus;
              if (aModel[0].status == "0")
                     sStatus = "COMPLETED";
              else if (aModel[0].status == "2")
                     sStatus = "IN_WORK";
              else if (aModel[0].status === "3")
                     sStatus = "IN_QUEUE";
              else if (aModel[0].status === "1")
                     sStatus = "NOT_STARTED";
              
              // progress calculation
              var progress;
              if(parseInt(aModel[0].DURATION) === 0)
            	  progress = 0;
              else
            	 progress = aModel[0].PROGRESS / parseInt(aModel[0].DURATION) * 100; 
              var oOperModel = {
                     "Rowsets" : {
                           "Rowset" : [ {
                                  "Row" : [ {
                                         "sfc" : aModel[0].WORKORDER_ID,
                                         "sfc_step_ref" : aModel[0].SFC_STEP_REF,
                                         "operation_bo" : aModel[0].OPERATION_BO,
                                         "operation_no" : aModel[0].OPERATION_BO.split(",")[1],
                                         "operation_desc" : aModel[0].OPERATION_DESCRIPTION,
                                         "material_description": aModel[0].WORKORDER_DESCRIPTION,
                                         "operation_revision" : aModel[0].SFC_STEP_REF.split(",")[5],
                                         "wo_no" : aModel[0].SHOP_ORDER_BO.split(",")[1],
                                         "workcenter" : aModel[0].PP_STATION.split(",")[1],
                                         "status" : sStatus,
                                         "progress" : parseInt(progress),
                                         "progress_new" : parseInt(progress),
                                         "time_spent" : airbus.mes.stationtracker.util.Formatter.msToTime(aModel[0].PROGRESS),
                                         "planned_start_time" : "TimeUnavailable",
                                         "planned_end_time" : "TimeUnavailable",
                                         "original_start_time" : aModel[0].START_TIME,
                                         "original_end_time" : aModel[0].END_TIME,
                                         "cpp_cluster": aModel[0].CPP_CLUSTER,
                                         "work_package": aModel[0].WORK_PACKAGE
                                  } ]
                           } ]
                     }
              };


              if (airbus.mes.operationdetail === undefined) {
                     jQuery.sap.registerModulePath("airbus.mes.operationdetail", "../components/operationdetail");
                     this.oOperationDetailComp = sap.ui.getCore().createComponent({
                           name : "airbus.mes.operationdetail",
                           id : "operationDetailComponent"
                     });
                     airbus.mes.operationdetail.oView = this.oOperationDetailComp.oView;
                     airbus.mes.operationdetail.parentId = airbus.mes.stationtracker.operationDetailPopup.sId;
              }
              airbus.mes.stationtracker.operationDetailPopup.open();
              airbus.mes.operationdetail.oView.placeAt(airbus.mes.stationtracker.operationDetailPopup.sId + "-scrollCont");

              airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").setData(oOperModel);
              airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").refresh();
              sap.ui.getCore().getModel("operationDetailModel").setData(oOperModel);
              sap.ui.getCore().getModel("operationDetailModel").refresh();

       },
       OpenReschedule : function(id) {

//    	  
    	  var aGroup = [];
    	   
// 	   	  Check if we are on operation grouping
//    	  SD-PPC-ST-386
    	  if (airbus.mes.stationtracker.GroupingBoxingManager.box !== 'OPERATION_ID') {
    		  return false;
    	  }
        	
    	  var aOperationHierachy = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy;
 	   	  var aModel = aOperationHierachy[scheduler.getEvent(id).group][scheduler.getEvent(id).avlLine][scheduler.getEvent(id).box];


// 	   	  Define all group
 	   	  for (var oTmpOperationHierarchy in aOperationHierachy) {
 	   		  aGroup.push(oTmpOperationHierarchy);
 	   		  
 	   	  }
 	   	  
 	   	  if (airbus.mes.stationtracker.ReschedulePopover === undefined) {
              airbus.mes.stationtracker.ReschedulePopover = sap.ui.xmlfragment("ReschedulePopover",
                      "airbus.mes.stationtracker.Reschedule", airbus.mes.stationtracker.oView.getController());
              
               airbus.mes.stationtracker.ReschedulePopover.addStyleClass("alignTextLeft");
               
               airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.ReschedulePopover);
         }		
//        Model for the current operation
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(aModel);
          airbus.mes.stationtracker.ReschedulePopover.setModel(oModel, "RescheduleModel");
          
          oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(aGroup);
          airbus.mes.stationtracker.ReschedulePopover.setModel(oModel, "RescheduleGroupModel");
 	   	  
           airbus.mes.stationtracker.ReschedulePopover.open();           
           
       }
};


jQuery.sap.require("airbus.mes.stationtracker.util.Formatter");

sap.ui.controller("airbus.mes.stationtracker.stationtracker", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf components.stationtracker.stationtracker
	 */
		onInit: function() {
//			Retrieve all value of Production Group
			var oModel = airbus.mes.stationtracker.ModelManager.ProductionGroup;
			var aProdGroup = oModel.getData().Rowsets.Rowset[0].Row;
			var aItems = [];

			// Check if model is load ,create empty model if no data
			if(!oModel.getProperty("/Rowsets/Rowset/0/Row")){              
				
		    	console.log("No production group available");
		    	oModel.oData.Rowsets.Rowset[0].Row = [];
		    	aProdGroup = [];
			}
			
			
			for (var i = 0; i < aProdGroup.length; i++) {
				aItems.push(aProdGroup[i].PROD_GROUP);
			}
		},
	/**
	 * Similar to onBeforeRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf components.stationtracker.stationtracker
	 */
		onBeforeRendering: function() {
		},
	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf components.stationtracker.stationtracker
	 */
	onAfterRendering : function() {
		// Capture the open/close panel event
		airbus.mes.stationtracker.oView.byId('kpi_header').attachExpand(resizeGantt);
		// Set instant display for busy indicator
	    airbus.mes.stationtracker.oView.byId("stationtracker").setBusyIndicatorDelay(0);

		// First run on init
		if (typeof airbus.mes.stationtracker.cachedGanttTop === 'undefined'){
			resizeGantt();
		}else{
			$(airbus.mes.stationtracker.oView.byId('stationtracker').getDomRef())
				.css('top', airbus.mes.stationtracker.cachedGanttTop);
		}
		
		// Place the Gantt under the Toolbar
		function resizeGantt(){
			setTimeout(function(){
				var jqToolbar = $(airbus.mes.stationtracker.oView.byId('toolbarstationtracker').getDomRef());
				var jqStationTracker = $(airbus.mes.stationtracker.oView.byId('stationtracker').getDomRef());
				airbus.mes.stationtracker.cachedGanttTop = jqToolbar.offset().top;
				jqStationTracker.css('top', jqToolbar.offset().top);
			}, 0);
		}

	},
	onProductionGroupPress : function(oEvent){
		if ( airbus.mes.stationtracker.productionGroupPopover === undefined ) {
			
			var oView = airbus.mes.stationtracker.oView;
			airbus.mes.stationtracker.productionGroupPopover = sap.ui.xmlfragment("productionGroupPopover","airbus.mes.stationtracker.productionGroupPopover", airbus.mes.stationtracker.oView.getController());
			airbus.mes.stationtracker.productionGroupPopover.addStyleClass("alignTextLeft");
			oView.addDependent(airbus.mes.stationtracker.productionGroupPopover);
			
			airbus.mes.stationtracker.productionGroupPopover.setModel(sap.ui.getCore().getModel("productionGroupModel"), "productionGroupModel");
		
		}

		var temp = [];
		var binding = sap.ui.getCore().byId("productionGroupPopover--myList").getBinding("items");
//		path correspond to relatif path after binding, here absolute path is /Rowsets/Rowset/0/Row			
		var Filter = new sap.ui.model.Filter({ path : "PROD_GROUP",
									           test : function(value) {
									                     if (temp.indexOf(value) == -1) {
									                            temp.push(value);
									                            return true;
									                     } else {
									                            return false;
									                     }
									              }
												});	
		
		binding.filter(Filter);				
		
		// delay because addDependent will do a async rerendering and the popover will immediately close without it
		var oButton = oEvent.getSource();
		jQuery.sap.delayedCall(0, this, function () {
			airbus.mes.stationtracker.productionGroupPopover.openBy(oButton);	
		});		
	},
	onTeamPress : function(oEvent) {

		var bindingContext = oEvent.getSource().getBindingContext();
		// open team popover fragment		 
		if (!this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("airbus.mes.stationtracker.teamPopover", this);
			this._oPopover.addStyleClass("alignTextLeft");
			this.getView().addDependent(this._oPopover);
		}
		this._oPopover.openBy(oEvent.getSource());

	},

	onShiftPress : function() {
		
	
		airbus.mes.stationtracker.ShiftManager.shiftDisplay = true;
		airbus.mes.stationtracker.ShiftManager.dayDisplay = false;
		
		scheduler.matrix['timeline'].x_unit = 'minute';
		scheduler.matrix['timeline'].x_step = 30;
		//scheduler.matrix['timeline'].x_size = 18;
		//scheduler.matrix['timeline'].x_length = 18;
		//scheduler.matrix['timeline'].x_start = 0,
		scheduler.matrix['timeline'].x_date = '%H:%i';
		scheduler.templates.timeline_scale_date = function(date) {
			var func = scheduler.date.date_to_str(scheduler.matrix['timeline'].x_date);
			return func(date);
		};
		scheduler.config.preserve_length = true;
		//scheduler.updateView(airbus.mes.stationtracker.ShiftManager.currentShiftStart);
		/* Delete Selection box when shift */
		for (var i = 0; i < $("select[class='selectBoxStation']").length; i++) {
			$("select[class='selectBoxStation']").eq(i).remove();
		}
		
		airbus.mes.stationtracker.ShiftManager.ShiftMarkerID.forEach(function(el){
			
			scheduler.deleteMarkedTimespan(el);
		
		})
		
		airbus.mes.stationtracker.oView.byId("selectShift").setEnabled(false);
		airbus.mes.stationtracker.oView.byId("selectShift").fireChange(0);
		//scheduler.updateView();
	},

	onDayPress : function() {
	
//		scheduler.addMarkedTimespan({  
//			start_date: airbus.mes.stationtracker.ShiftManager.ShiftSelectedStart,
//			end_date: airbus.mes.stationtracker.ShiftManager.ShiftSelectedEnd,
//		    css:   "shiftCss",
//		});
				
		airbus.mes.stationtracker.ShiftManager.shiftDisplay = false;
		airbus.mes.stationtracker.ShiftManager.dayDisplay = true;
		
		scheduler.matrix['timeline'].x_unit = 'minute';
		scheduler.matrix['timeline'].x_step = 60;
		//scheduler.matrix['timeline'].x_start = 0;
		//scheduler.matrix['timeline'].x_size = 18;
		//scheduler.matrix['timeline'].x_length = 18;
		scheduler.matrix['timeline'].x_date = '%H:%i';
		
		scheduler.templates.timeline_scale_date = function(date) {
			var func = scheduler.date.date_to_str(scheduler.matrix['timeline'].x_date);
			return func(date);
		};
		scheduler.config.preserve_length = true;
		//scheduler.updateView(airbus.mes.stationtracker.ShiftManager.currentShiftStart);
		
		// Need this to update selected view and dont brake the behaviour of overflowtoolbar not needed if use Toolbar
		airbus.mes.stationtracker.oView.byId("buttonViewMode").rerender();
		airbus.mes.stationtracker.oView.byId("buttonViewMode").setSelectedKey("day");
		
		airbus.mes.stationtracker.oView.byId("selectShift").setEnabled(true);
		airbus.mes.stationtracker.ModelManager.selectMyShift();
	},

	onInitialPlanPress : function() {

		// XX TO REDEFINE
		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;

		if (airbus.mes.stationtracker.GroupingBoxingManager.showInitial) {

			airbus.mes.stationtracker.GroupingBoxingManager.showInitial = false;
			GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);
		
			
		} else {

			airbus.mes.stationtracker.GroupingBoxingManager.showInitial = true;
			//If model is allready load I dont call back the service
			if ( !sap.ui.getCore().getModel("stationTrackerIModel").getProperty("/Rowsets/Rowset/0/Row") ) {
				
				airbus.mes.stationtracker.ModelManager.loadStationTracker("I");
				
			} else {
			
			GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);
			
		
			}
			
		}
	},

	onCPPress : function() {

		if (airbus.mes.stationtracker.AssignmentManager.CpPress === false) {

			scheduler.templates.event_class = function(start, end, ev) {

				if (ev.criticalPath != undefined) {

					return "operationCP";

				} else {

					return "grey";
				}

			};

			airbus.mes.stationtracker.AssignmentManager.CpPress = true;
			scheduler.updateView();

		} else {

			scheduler.templates.event_class = function(start, end, ev) {

				return "grey";

			};

			airbus.mes.stationtracker.AssignmentManager.CpPress = false;
			scheduler.updateView();

		}
	},
	onPolypolyOpen: function(oEvent) {
		
		airbus.mes.shell.util.navFunctions.polypoly();
		
	},
	
	onResourcePoolOpen: function(oEvt){
		airbus.mes.shell.util.navFunctions.resourcePool();
	},


	onUnplannedPress : function(oEvent) {
		if ( airbus.mes.stationtracker.worklistPopover === undefined ) {
			
			airbus.mes.stationtracker.worklistPopover = sap.ui.xmlfragment("worklistPopover","airbus.mes.stationtracker.worklistPopover", airbus.mes.stationtracker.oView.getController());
			airbus.mes.stationtracker.worklistPopover.addStyleClass("alignTextLeft");
			airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.worklistPopover);
			airbus.mes.stationtracker.worklistPopover.setModel(sap.ui.getCore().getModel("groupModel"),"groupModel");
				
			airbus.mes.stationtracker.worklistPopover.setBusyIndicatorDelay(0);
					
		}
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
		
//		global variable to manage display on worklist
		airbus.mes.stationtracker.worklistPopover.unPlanned = true;
		airbus.mes.stationtracker.worklistPopover.OSW = false;		
	
		var oModel = sap.ui.getCore().getModel("unPlannedModel");

		//Changed the data of the worklist by unplannned model
		airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(oModel.oData.Rowsets.Rowset[0].Row),"WorkListModel");
		airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").refresh(true);

//      Overall Progress is only display on worklist
        sap.ui.getCore().byId("worklistPopover--overallProgress").setVisible(false);         
		
		// delay because addDependent will do a async rerendering and the popover will immediately close without it
		jQuery.sap.delayedCall(0, this, function () {
//			airbus.mes.stationtracker.worklistPopover.openBy(oButton);	
			airbus.mes.stationtracker.worklistPopover.open();	

		});		
	},
	
	onOSWPress : function(oEvent) {
		
		if ( airbus.mes.stationtracker.worklistPopover === undefined ) {
			
			var oView = airbus.mes.stationtracker.oView;
			airbus.mes.stationtracker.worklistPopover = sap.ui.xmlfragment("worklistPopover","airbus.mes.stationtracker.worklistPopover", airbus.mes.stationtracker.oView.getController());
			airbus.mes.stationtracker.worklistPopover.addStyleClass("alignTextLeft");
			airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.worklistPopover);
			airbus.mes.stationtracker.worklistPopover.setModel(sap.ui.getCore().getModel("groupModel"),"groupModel");
					
			airbus.mes.stationtracker.worklistPopover.setBusyIndicatorDelay(0);
		}
		sap.ui.getCore().byId("worklistPopover--myList").bindAggregation('items', {
			path : "WorkListModel>/",
			template : sap.ui.getCore().byId("worklistPopover--sorterList"),
			sorter : []
		});
		
		
		airbus.mes.stationtracker.worklistPopover.unPlanned = true;
		airbus.mes.stationtracker.worklistPopover.OSW = true;	
		
		var oModel = sap.ui.getCore().getModel("OSWModel");

		//Changed the data of the worklist by OSW model
		airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(oModel.oData.Rowsets.Rowset[0].Row),"WorkListModel");
		airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").refresh(true);

//      Overall Progress is only display on worklist
        sap.ui.getCore().byId("worklistPopover--overallProgress").setVisible(false);         
		
		
		// delay because addDependent will do a async rerendering and the popover will immediately close without it
		var oButton = oEvent.getSource();
		jQuery.sap.delayedCall(0, this, function () {
//			airbus.mes.stationtracker.worklistPopover.openBy(oButton);	
			airbus.mes.stationtracker.worklistPopover.open();	

		});				
		
	},
	onProdGroupSelFinish : function(oEvent) {
		
//		Filter the stationtracker model with current production group
		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
	    var sProdGroup = airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("ProductionGroup") + " : ";
	    var sProdGroupMii = "";
	     
	    
//	    If no Production group have been selected 
//	    Or all production group have been selected
		if(sap.ui.getCore().byId("productionGroupPopover--myList").getSelectedItems().length === 0 
	    || sap.ui.getCore().byId("productionGroupPopover--myList").getSelectedItems().length === sap.ui.getCore().byId("productionGroupPopover--myList").getItems().length ){

//			We write All instead of concatenantion of production group
			sProdGroup += airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("StatusAll");
			
			airbus.mes.settings.ModelManager.prodGroup ="%";
			
		} else {
			sap.ui.getCore().byId("productionGroupPopover--myList").getSelectedItems().forEach(function(el){
				
				sProdGroup += el.mProperties.label + ",";
				sProdGroupMii += el.mProperties.label + "','";
			}); 
			sProdGroup = sProdGroup.slice(0,-1);
			airbus.mes.settings.ModelManager.prodGroup = sProdGroupMii.slice(0,-3);
				
		}

		
		airbus.mes.stationtracker.oView.byId("ProductionButton").setText(sProdGroup);

		airbus.mes.stationtracker.ModelManager.loadStationTracker("R");
		airbus.mes.stationtracker.ModelManager.loadStationTracker("I");
		airbus.mes.stationtracker.ModelManager.loadStationTracker("U");		
		airbus.mes.stationtracker.ModelManager.loadStationTracker("O");		
				
	},
	
	changeGroup : function() {

		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;

		GroupingBoxingManager.group = sap.ui.getCore().byId("stationTrackerView").byId("selectGroup").getSelectedKey();
		GroupingBoxingManager.box = sap.ui.getCore().byId("stationTrackerView").byId("selectBox").getSelectedKey();

		GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);
		// Need render for display marked shift 
		scheduler.updateView();
	},

	changeBox : function() {

		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;

		GroupingBoxingManager.group = sap.ui.getCore().byId("stationTrackerView").byId("selectGroup").getSelectedKey();
		GroupingBoxingManager.box = sap.ui.getCore().byId("stationTrackerView").byId("selectBox").getSelectedKey();

		GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);
		// Need render for display marked shift 
		//scheduler.updateView();

	},
	onReschedulePress : function(oEvent) {
		
		var oNavCon = sap.ui.getCore().byId("operationPopover--navOperatorContainer");
		var oReschedulePage = sap.ui.getCore().byId("operationPopover--Reschedule");
		var oOperationPopover = sap.ui.getCore().byId("operationPopover--operationPopoverID");
		oOperationPopover.setContentWidth("750px");
		oOperationPopover.setContentHeight("640px");
		oNavCon.to(oReschedulePage);
	},
	onPartialPress: function(oEvent) {
		
		var oNavCon = sap.ui.getCore().byId("operationPopover--navOperatorContainer");
		var oConfirmOperationPage = sap.ui.getCore().byId("operationPopover--confirmOperation");
		var oOperationPopover = sap.ui.getCore().byId("operationPopover--operationPopoverID");
		oOperationPopover.setContentWidth("750px");
		oOperationPopover.setContentHeight("400px");
		oNavCon.to(oConfirmOperationPage);
	},
	onTotalPress: function(oEvent) {
		
		var oNavCon = sap.ui.getCore().byId("operationPopover--navOperatorContainer");
		var oConfirmOperationTotalPage = sap.ui.getCore().byId("operationPopover--confirmOperationTotal");
		var oOperationPopover = sap.ui.getCore().byId("operationPopover--operationPopoverID");
		oOperationPopover.setContentWidth("455px");
		oOperationPopover.setContentHeight("455px");
		oNavCon.to(oConfirmOperationTotalPage);
	
	},
	onNavBack : function (oEvent) {
		var oNavCon = sap.ui.getCore().byId("operationPopover--navOperatorContainer");
		var oOperationPopover = sap.ui.getCore().byId("operationPopover--operationPopoverID");
		oOperationPopover.setContentHeight("395px");	
		oOperationPopover.setContentWidth("770px");
		oNavCon.back();
	},
	onCloseWorklist: function (oEvent) {
		var oOperationPopover = sap.ui.getCore().byId("operationPopover--operationPopoverID");
		oOperationPopover.close();
	},
	onRescheduleConfirm : function(oEvent) {
//		Retrieve selected date
		var oDate = sap.ui.getCore().byId("ReschedulePopover--DP1").getAggregation("selectedDates")[0].getStartDate();
		
//		Retrieve selected group
		var sGroup = sap.ui.getCore().byId("ReschedulePopover--SelectedGroup").getSelectedKey();
		
//		Call rescheduling service
//		TODO
		
//		Close Popup
		onCloseDialog(oEvent);
		
	},
	/**
	 * Fire when the user click on Import of unplanned pop-up or OSW pop-up  
	 *
	 *  @return{STRING} Myvalue, current value of box/group Id
	 */
	onUnplannedImport : function() {

		var oList = sap.ui.getCore().byId("worklistPopover--myList"); //TODO : change access to list
		var aPath = oList.getSelectedContextPaths();
		var aSFC_Step = [];
		
		aPath.forEach(function(el) {
		
			aSFC_Step.push(airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").getProperty(el).SFC_STEP_REF);
			
		});
		
		airbus.mes.stationtracker.ModelManager.setOSW(aSFC_Step);
		
	},
	
	onUnplannedClose : function(oEvent) {
		
		airbus.mes.stationtracker.worklistPopover.unPlanned = false;
		airbus.mes.stationtracker.worklistPopover.OSW = false;			
		airbus.mes.stationtracker.worklistPopover.close();
		
	},	

	changeShift : function(Oevt) {
			
		var sPath = airbus.mes.stationtracker.oView.byId("selectShift").getSelectedIndex();
		var oModel = airbus.mes.stationtracker.oView.getModel("stationTrackerShift").getProperty("/" + sPath);
	
		airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftName = oModel.shiftName;
		airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftID = oModel.shiftID;
		airbus.mes.stationtracker.ShiftManager.ShiftSelected.day = oModel.day;

		if ( airbus.mes.stationtracker.ShiftManager.dayDisplay ) {
				
		var intervals = airbus.mes.stationtracker.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.ShiftManager.current_day][airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftID];
				
		
		airbus.mes.stationtracker.ShiftManager.ShiftSelected.StartDate = intervals[0].StartDate;
		airbus.mes.stationtracker.ShiftManager.ShiftSelected.EndDate = intervals[intervals.length - 1].EndDate;
		// remove previous marker
		airbus.mes.stationtracker.ShiftManager.ShiftMarkerID.forEach(function(el){
				
			scheduler.deleteMarkedTimespan(el);
		
		});
		
		airbus.mes.stationtracker.ShiftManager.ShiftMarkerID.push(scheduler.addMarkedTimespan({  
			//get startdate of first shift maybe need to get only the shift day before the current to avoid issue perf?
			start_date: airbus.mes.stationtracker.ShiftManager.shifts[0].StartDate,
			end_date: airbus.mes.stationtracker.ShiftManager.ShiftSelected.StartDate,
			css:   "shiftCss",
			
		}));
		
		airbus.mes.stationtracker.ShiftManager.ShiftMarkerID.push(scheduler.addMarkedTimespan({  

			start_date: airbus.mes.stationtracker.ShiftManager.ShiftSelected.EndDate,
			//get enddate of last shift maybe need to get only the shift day before the current to avoid issue perf?
			end_date: airbus.mes.stationtracker.ShiftManager.shifts[airbus.mes.stationtracker.ShiftManager.shifts.length-1].EndDate,
			css:   "shiftCss",
			
		}));
		
			scheduler.updateView();
		}
		
		// this is permit to display same shift when clicking from day to shift display.
		if ( airbus.mes.stationtracker.ShiftManager.shiftDisplay ) {
			
			scheduler.updateView(airbus.mes.stationtracker.ShiftManager.ShiftSelected.StartDate);
			airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftID);
		}	
		
		
	},
	
	changeGroupWorkList : function(oEvent) {
		// TOSEE if we can get ID by better way
		sap.ui.getCore().byId("worklistPopover--myList").bindAggregation('items', {
			path : "WorkListModel>/",
			template : sap.ui.getCore().byId("worklistPopover--sorterList"),
			sorter : [ new sap.ui.model.Sorter({
				// Change this value dynamic
				path : oEvent.getSource().getSelectedKey(), //oEvt.getSource().getSelectedKey();
				descending : false,
				group : true,
			}), new sap.ui.model.Sorter({
				path : 'index',
				descending : false
			}) ]
		});
		
	},
	

/////////////////////////////////////////////////////////////////////////////////////////////////
	/**
     * Fire the sorter when picking a value in the combobox worklist 
      * 
      * @returns {sap.ui.model.Sorter}
     */
     changeGrouping : function(oEvt) {
           
           var aModelToTest = airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").oData;
           
           sap.ui.getCore().byId("myList").bindAggregation('items', {
                  path : "/Rowsets/Rowset/0/Row",
                  template : sap.ui.getCore().byId("sorterList"),
                  sorter : [ new sap.ui.model.Sorter({
                         path :  "/", //ModelManager.group_parameter,
                         descending : false,
                         group : true,
                  }), new sap.ui.model.Sorter({
                         path : 'index',
                         descending : false
                  }) ]
           });
     },

////////////////////////////

/**
     * Sort worklist according to business rule.
     * 
      * Rule in detail: the operations shall be grouped by WO. These WO groups
     * shall be sorted using the start date/time of their box in the Gantt, then
     * using the schedule start date/time and then numerical order, ascending
     * order. Within one group of operations belonging to the same WO,
     * operations shall be sorted by ascending operation number.
     * 
      * @param oWorkList
     */
     sortWorkList : function(oWorkList) {
           var oWL2 = [];
           var oWOList = [];
           var i;

           // Sort by WO number (to group operations with same WO)
           // Also group by operation, because the sort order is kept for
           // operations
           oWorkList.sort(this.fieldComparator([ 'WORKORDER_ID',
                         'OPERATION_ID' ]));

           // Constitute a table of WO groups with operations associated
           // The group object has template bellow.
           var currentWO = {
        		  shopOrder : undefined,
                  dynamicStartDate : undefined,
                  scheduledStartDate : undefined,
                  operationsID : [],
           };

           for (i = 0; i < oWorkList.length; i++) {
                  if (currentWO.shopOrder !== oWorkList[i].shopOrder) {

                         if (currentWO.operationsID.length > 0) {
                                oWOList.push(currentWO);
                         }

                         currentWO = {
                        		shopkOrder : oWorkList[i].shopOrder,
                                startDate : oWorkList[i].startDate,
//                                scheduledStartDate : oWorkList[i].start,
                                operationsID : [ oWorkList[i] ],
                         };

                  } else {

                         if (oWorkList[i].startDate < currentWO.startDate) {
                                currentWO.startDate = oWorkList[i].startDate;
                         }

//                         if (oWorkList[i].start < currentWO.scheduledStartDate) {
//                                currentWO.scheduledStartDate = oWorkList[i].start;
//                         }

                         currentWO.operationsID.push(oWorkList[i]);

                  }
           }

           oWOList.push(currentWO);

           // Sort each groups (Work Orders)
           // The operations inside each groups should still be in the same order
           // (ascending order preserved)
           oWOList.sort(this.fieldComparator([ 'startDate', 'WORKORDER_ID' ]));

           // Flatten worklist (take operations of each groups)
           oWL2 = oWOList.reduce(function(prev, curr) {
                  return prev.concat(curr.operationsID);
           }, []);

           // Keep the index, for stable sorting on WorkList screen (as sorter is
           // also used for grouping)
           oWL2.forEach(function(el, i) {
                  el.index = i;
           });

           return oWL2;
     },

//////////////////////////////////////

/**
     * Returns a comparator function on the provided fields, in the provided
     * order of priority, to be used for example by an Array.sort() function.
     * 
      * @param {Array}
     *            fields, Array of object
     * @returns {Function} comparator
     */
     fieldComparator : function(fields) {
           return function(a, b) {
                  return fields.map(function(o) {
                         var dir = 1;
                         if (o[0] === '-') {
                                dir = -1;
                                o = o.substring(1);
                         }
                         if (a[o] > b[o])
                                return dir;
                         if (a[o] < b[o])
                                return -(dir);
                         return 0;
                  }).reduce(function firstNonZeroValue(p, n) {
                         return p ? p : n;
                  }, 0);
           };
     },
     onChangeFilter : function(oEvent){
         var aMyFilter = [];    	 
         var sStatus;
         
//    	 Check the current value of the filter status
    	 if(oEvent.getSource().getSelectedKey() === "StatusAll") {
//			if status ALL, we have to remove all filter
    		 sap.ui.getCore().byId("worklistPopover--myList").getBinding("items").filter();    	
    		 
    	 } else {
//    		 we apply the a filter
    		 switch (oEvent.getSource().getSelectedKey()) {
    			 case "StatusStarted":
    				 sStatus = "2";
    				 break;
    			 case "StatusNotStarted":
    				 sStatus = "1";
    				 break;
    		     case "StatusConfirmed":
    			     sStatus = "0";
       				 break;
    		 }
    		 var oFilterStatus = new sap.ui.model.Filter("status","EQ",sStatus);        
             aMyFilter.push(oFilterStatus);
             sap.ui.getCore().byId("worklistPopover--myList").getBinding("items").filter(new sap.ui.model.Filter(aMyFilter, true));    		 
    	 }
    	 
     },
     
     ClosePolyPoly : function(oEvent){
    	 
 		this.onCloseDialog(oEvent);
 		airbus.mes.stationtracker.AssignmentManager.polypolyAffectation = false; 
 		
     },
     
     deleteLineAssignment : function(){
    	 airbus.mes.stationtracker.AssignmentManager.handleLineAssignment("D", false);
     },
     
 	getI18nValue : function(sKey) {
	    return this.getView().getModel("StationTrackerI18n").getProperty(sKey);
	},

	selectUser : function(oEvt) {
		
		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
		var oSelected = oEvt.getSource().getSelectedItem().mProperties;
		var aModel = sap.ui.getCore().getModel("affectationModel").oData.Rowsets.Rowset[0].Row;
		
		if (oSelected.key != "All User") {
		
			airbus.mes.stationtracker.AssignmentManager.userSelected = oSelected.key;
			airbus.mes.stationtracker.ModelManager.loadStationTracker("I");		
			airbus.mes.stationtracker.ModelManager.loadStationTracker("R");		
			
		} else {
			
			airbus.mes.stationtracker.AssignmentManager.userSelected = "%";
			airbus.mes.stationtracker.ModelManager.loadStationTracker("I");		
			airbus.mes.stationtracker.ModelManager.loadStationTracker("R");		
			
		}
			
	},
	showDisruption : function(oEvent){
		
		airbus.mes.shell.util.navFunctions.disruptionTracker();
	},
	
	/**
     * Change the date of scheduler
     */
	changeDay : function(oEvt) {
		
		scheduler.updateView(oEvt.getSource().getDateValue());
		airbus.mes.stationtracker.ModelManager.selectMyShift();
	},
	
	/**
     * Collapse or display KPI
     */
	hideKPI : function() {
	
		var oPanel = airbus.mes.stationtracker.oView.byId("kpi_header");
		var bIsExpanded = oPanel.getExpanded();
		
		if ( bIsExpanded ) {
			airbus.mes.stationtracker.oView.byId("hideKPI").setIcon("sap-icon://show");
			airbus.mes.stationtracker.oView.byId("hideKPI").setText(airbus.mes.stationtracker.oView.getController().getI18nValue("ShowKPIS"));
		} else {
			airbus.mes.stationtracker.oView.byId("hideKPI").setIcon("sap-icon://hide");
			airbus.mes.stationtracker.oView.byId("hideKPI").setText(airbus.mes.stationtracker.oView.getController().getI18nValue("HideKPIS"));
		}
		
		oPanel.setExpanded(!bIsExpanded);

	},
	/**
     * Action on fragment worklist
     */		
	operationWorkListClick : function(oEvent) {
		
		console.log(oEvent);
		
//		Retrieve corresponding operation
//		Format of attribute displayValue is WorkOrderId Name separated by space
		var sWorkOrder_id = oEvent.getSource().getParent().getAggregation("items")[0].getDisplayValue().split(" ")[0];
		
//		Format of attribute displayValue2 is OperationId space process calculation 
		var sOperation_id = oEvent.getSource().getParent().getAggregation("items")[0].getDisplayValue2().split(" ")[0];
		
//		We have to scan operationHierarchie to retrieve the corresponding item on the Model
		var aModel = airbus.mes.stationtracker.worklistPopover.aModel;

		aModel = aModel.filter(function (el) {
			  return el.OPERATION_ID ===  sOperation_id &&
			       	 el.WORKORDER_ID === sWorkOrder_id;
			}); 

//		Call the operation list popup
		airbus.mes.stationtracker.ModelManager.openOperationDetailPopup(aModel);
		
	},
	
	
	/**
     * function about date picker fragment
     */	
	
	//Fired when Calendar Button is clicked
	//Open datePicker XML fragment
	datePick : function() {
		if(airbus.mes.stationtracker.datePicker === undefined){
			airbus.mes.stationtracker.datePicker = sap.ui.xmlfragment("datePickerFragment","airbus.mes.stationtracker.datePickerFragment", airbus.mes.stationtracker.oView.getController());
			airbus.mes.stationtracker.oView.oCalendar = airbus.mes.stationtracker.datePicker.getContent()[0];
		}
		airbus.mes.stationtracker.datePicker.openBy(airbus.mes.stationtracker.oView.byId("dateButton"));
	},
	
	onSelectToday : function(){
		airbus.mes.stationtracker.oView.oCalendar.removeAllSelectedDates();
		airbus.mes.stationtracker.oView.oCalendar.displayDate(new Date());
		airbus.mes.stationtracker.oView.oCalendar.addSelectedDate(new sap.ui.unified.DateRange({startDate: new Date()}));
		airbus.mes.stationtracker.oView.getController().dateSelected();
	},
	
	dateSelected : function(){
//		Check if current selected date corresponds to range of shift date
		var dSeletectedDate = airbus.mes.stationtracker.oView.oCalendar.getSelectedDates()[0].getStartDate();
		if(dSeletectedDate < airbus.mes.stationtracker.GroupingBoxingManager.minDate
		  || dSeletectedDate > airbus.mes.stationtracker.GroupingBoxingManager.maxDate ) {
//			If we are out of range, we display a message and don't close the date picker
			sap.m.MessageToast.show("Selected date out of range");
		} else {
//			We feed the scheduler with the new selected date
			airbus.mes.stationtracker.oView.getController().updateDateLabel(airbus.mes.stationtracker.oView.oCalendar);
			airbus.mes.stationtracker.datePicker.close();
			scheduler.updateView(airbus.mes.stationtracker.oView.oCalendar.getSelectedDates()[0].getStartDate());
			airbus.mes.stationtracker.ModelManager.selectMyShift();
		}
	},
	
	updateDateLabel : function(oCalendar){
		var oFormatddMMyyy = sap.ui.core.format.DateFormat.getInstance({pattern: "dd MMM yyyy", calendarType: sap.ui.core.CalendarType.Gregorian});
		var oText = airbus.mes.stationtracker.oView.byId("dateLabel");
		var aSelectedDates = oCalendar.getSelectedDates();
		var oDate;
		if (aSelectedDates.length > 0 ) {
			oDate = aSelectedDates[0].getStartDate();
			oText.setText(oFormatddMMyyy.format(oDate));
		} else {
			oText.setValue("No Date Selected");
		}
	},
	onCloseDialog : function(oEvent) {
		oEvent.getSource().getParent().close();
	},
	

	/******************************************
	 * Operation Detail Pop-Up Close functions
	 */
	onCloseOperationDetailPopup : function() {

		airbus.mes.stationtracker.operationDetailPopup.close();
	},

	afterCloseOperationDetailPopup : function() {
		airbus.mes.shell.oView.getController()
				.renderStationTracker();
	},

	onContinueCheckQA : function(){
		airbus.mes.stationtracker.AssignmentManager.handleLineAssignment("S", true);
	},
	
	onCancelCheckQA : function(oEvent){
		this.onCloseDialog(oEvent);
	},
	
	deleteLineAssignment : function(){
		airbus.mes.stationtracker.AssignmentManager.handleLineAssignment("D", true);
		airbus.mes.stationtracker.oPopoverPolypoly.close();
	},
	
	tooltipDisplay : function(oEvent) {
		var oEventProvider = new sap.ui.base.EventProvider();
		var oEvent = new sap.ui.base.Event("test",oEventProvider);
		this.onProductionGroupPress(oEvent);
		console.log("tooltip");
	}
});

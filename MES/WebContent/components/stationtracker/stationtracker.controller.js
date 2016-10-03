sap.ui.controller("airbus.mes.stationtracker.stationtracker", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf components.stationtracker.stationtracker
	 */
	//	onInit: function() {
	//
	//	},
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf components.stationtracker.stationtracker
	 */
	//	onBeforeRendering: function() {
	//
	//	},
	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf components.stationtracker.stationtracker
	 */
	onAfterRendering : function() {

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
		scheduler.matrix['timeline'].x_size = 18;
		scheduler.matrix['timeline'].x_length = 18;
		scheduler.matrix['timeline'].x_start = 0,
		scheduler.matrix['timeline'].x_date = '%H:%i';
		scheduler.templates.timeline_scale_date = function(date) {
			var func = scheduler.date.date_to_str(scheduler.matrix['timeline'].x_date);
			return func(date);
		};
		scheduler.updateView(airbus.mes.stationtracker.ShiftManager.currentShiftStart);

	},

	onDayPress : function() {

		airbus.mes.stationtracker.ShiftManager.shiftDisplay = false;
		airbus.mes.stationtracker.ShiftManager.dayDisplay = true;
		
		scheduler.matrix['timeline'].x_unit = 'minute';
		scheduler.matrix['timeline'].x_step = 60;
		scheduler.matrix['timeline'].x_start = 0;
		scheduler.matrix['timeline'].x_size = 18;
		scheduler.matrix['timeline'].x_length = 18;
		scheduler.matrix['timeline'].x_date = '%H:%i';
		
		scheduler.templates.timeline_scale_date = function(date) {
			var func = scheduler.date.date_to_str(scheduler.matrix['timeline'].x_date);
			return func(date);
		};
		scheduler.updateView(airbus.mes.stationtracker.ShiftManager.currentShiftStart);

	},

	onInitialPlanPress : function() {

		// XX TO REDEFINE
		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;

		if (airbus.mes.stationtracker.GroupingBoxingManager.showInitial) {

			airbus.mes.stationtracker.GroupingBoxingManager.showInitial = false;
			GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);
			
		} else {

			airbus.mes.stationtracker.GroupingBoxingManager.showInitial = true;
			airbus.mes.stationtracker.ModelManager.loadStationTracker("I")
			
		
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

	changeGroup : function() {

		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;

		GroupingBoxingManager.group = sap.ui.getCore().byId("stationTrackerView").byId("selectGroup").getSelectedKey();
		GroupingBoxingManager.box = sap.ui.getCore().byId("stationTrackerView").byId("selectBox").getSelectedKey();

		GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);
	},

	changeBox : function() {

		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;

		GroupingBoxingManager.group = sap.ui.getCore().byId("stationTrackerView").byId("selectGroup").getSelectedKey();
		GroupingBoxingManager.box = sap.ui.getCore().byId("stationTrackerView").byId("selectBox").getSelectedKey();

		GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);

	},
	onReschedulePress : function(oEvent) {
		
		var oNavCon = sap.ui.getCore().byId("operationPopover--navOperatorContainer");
		var oReschedulePage = sap.ui.getCore().byId("operationPopover--Reschedule");
		var oOperationPopover = sap.ui.getCore().byId("operationPopover--operationPopoverID");
		oOperationPopover.setContentHeight("790px");
		oNavCon.to(oReschedulePage);
	},
	onNavBack : function (oEvent) {
		var oNavCon = sap.ui.getCore().byId("operationPopover--navOperatorContainer");
		var oOperationPopover = sap.ui.getCore().byId("operationPopover--operationPopoverID");
		oOperationPopover.setContentHeight("353px");		
		oNavCon.back();
	}

});

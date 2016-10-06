jQuery.sap.require("airbus.mes.stationtracker.util.Formatter");

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
		//scheduler.matrix['timeline'].x_size = 18;
		//scheduler.matrix['timeline'].x_length = 18;
		//scheduler.matrix['timeline'].x_start = 0,
		scheduler.matrix['timeline'].x_date = '%H:%i';
		scheduler.templates.timeline_scale_date = function(date) {
			var func = scheduler.date.date_to_str(scheduler.matrix['timeline'].x_date);
			return func(date);
		};
		scheduler.config.preserve_length = true;
		scheduler.updateView(airbus.mes.stationtracker.ShiftManager.currentShiftStart);
		/* Delete Selection box when shift */
		for (var i = 0; i < $("select[class='selectBoxStation']").length; i++) {
			$("select[class='selectBoxStation']").eq(i).remove();
		}
		
		airbus.mes.stationtracker.ModelManager.loadStationTrackerShift();
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
		scheduler.updateView(airbus.mes.stationtracker.ShiftManager.currentShiftStart);
		
		airbus.mes.stationtracker.ModelManager.loadStationTrackerShift();
	},

	onInitialPlanPress : function() {

		// XX TO REDEFINE
		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;

		if (airbus.mes.stationtracker.GroupingBoxingManager.showInitial) {

			airbus.mes.stationtracker.GroupingBoxingManager.showInitial = false;
			GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);
			scheduler.updateView();
			
		} else {

			airbus.mes.stationtracker.GroupingBoxingManager.showInitial = true;
			airbus.mes.stationtracker.ModelManager.loadStationTracker("I");
			scheduler.updateView();
		
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
		jQuery.sap.registerModulePath("airbus.mes.polypoly","/MES/components/polypoly");


			//Open fragment
		var bindingContext = oEvent.getSource().getBindingContext();
		
		// open team popover fragment		 
		if (!this._oPopoverPolypoly) {
			this._oPopoverPolypoly = sap.ui.xmlfragment("airbus.mes.stationtracker.polypolyFragment", this);
			this.getView().addDependent(this._oPopoverPolypoly);
		}
		
		
		if (!this.oComp) { 
        var oComp = sap.ui.getCore().createComponent({
            name : "airbus.mes.polypoly", // root component folder is resources
            id : "Comp10",
     });

     // Create a Ui container

     
//   oCompCont.placeAt("contentPopover");
     this.oComp = oComp;
     this.oCompCont = oCompCont;
	};
	
	var oCompCont = new sap.ui.core.ComponentContainer({
	    component : oComp
	});
	// place this Ui Container with the Component inside into UI Area
	this._oPopoverPolypoly.addContent(oCompCont);
	this._oPopoverPolypoly.open();

		
	},
	handleCloseButtonPolypoly: function(oEvent) {
		this._oPopoverPolypoly.close();
		
	},

	onUnplannedPress : function(oEvent) {
		if ( airbus.mes.stationtracker.worklistPopover === undefined ) {
			
			var oView = airbus.mes.stationtracker.oView;
			airbus.mes.stationtracker.worklistPopover = sap.ui.xmlfragment("worklistPopover","airbus.mes.stationtracker.worklistPopover", airbus.mes.stationtracker.oView.getController());
			airbus.mes.stationtracker.worklistPopover.addStyleClass("alignTextLeft");
			oView.addDependent(airbus.mes.stationtracker.worklistPopover);
		}
		airbus.mes.stationtracker.worklistPopover.unPlanned = true;
		airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().getModel("unPlannedModel").getData().Rowsets.Rowset[0].Row), "WorkListModel");
		airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").refresh();
		// delay because addDependent will do a async rerendering and the popover will immediately close without it
		var oButton = oEvent.getSource();
		jQuery.sap.delayedCall(0, this, function () {
			airbus.mes.stationtracker.worklistPopover.openBy(oButton);	
		});		
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
	onSelectionChange : function(oEvent) {
		var oList = oEvent.getSource();
		var oLabel = this.getView().byId("idFilterLabel");
		var oInfoToolbar = this.getView().byId("idInfoToolbar");

		// With the 'getSelectedContexts' function you can access the context paths
		// of all list items that have been selected, regardless of any current
		// filter on the aggregation binding.
		var aContexts = oList.getSelectedContexts(true);

		// update UI
		var bSelected = (aContexts && aContexts.length > 0);
		var sText = (bSelected) ? aContexts.length + " selected" : null;
//		oInfoToolbar.setVisible(bSelected);
		oLabel.setText(sText);		
		
	},
	onUnplannedImport : function(oEvent) {

		var oList = sap.ui.getCore().byId("worklistPopover--myList"); //TODO : change access to list
		var aContext = oList.getSelectedContexts(true);
		
		
		
		
		console.log("toto");
		
		
		
		
	},
	
	onUnplannedClose : function() {
		
		
	}	

});

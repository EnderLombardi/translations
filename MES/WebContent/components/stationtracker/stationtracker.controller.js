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
			
			this.getView().byId("selectProductionGroup").setSelectedKeys(aItems);	
				
			
		},
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf components.stationtracker.stationtracker
	 */
		onBeforeRendering: function() {
			
			var temp = [];
			var binding = this.getView().byId("selectProductionGroup").getBinding("items");
//			path correspond to relatif path after binding, here absolute path is /Rowsets/Rowset/0/Row			
			var Filter = new sap.ui.model.Filter({ path : "PROD_GROUP",
										           test : function(value) {
										                     if (temp.indexOf(value) == -1) {
										                            temp.push(value)
										                            return true;
										                     } else {
										                            return false;
										                     }
										              }
													});	
			
			binding.filter(Filter);		
		},
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
		
		scheduler.deleteMarkedTimespan( airbus.mes.stationtracker.ShiftManager.ShiftMarkerID );
		airbus.mes.stationtracker.ModelManager.selectMyShift();
		scheduler.updateView();
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
		
		airbus.mes.stationtracker.ModelManager.selectMyShift();
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
			//If model is allready load I dont call back the service
			if ( !sap.ui.getCore().getModel("stationTrackerIModel").getProperty("/Rowsets/Rowset/0/Row") ) {
				
				airbus.mes.stationtracker.ModelManager.loadStationTracker("I");
				
			} else {
			
			GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);
			scheduler.updateView();
		
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
		airbus.mes.stationtracker.worklistPopover.OSW = false;		
		airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().getModel("unPlannedModel").getData().Rowsets.Rowset[0].Row), "WorkListModel");
		airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").refresh();
		
		airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().getModel("filterUnplannedModel").getData()), "filterUnplannedModel");
		airbus.mes.stationtracker.worklistPopover.getModel("filterUnplannedModel").refresh();
		
		// delay because addDependent will do a async rerendering and the popover will immediately close without it
		var oButton = oEvent.getSource();
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
			oView.addDependent(airbus.mes.stationtracker.worklistPopover);
		}
		
		airbus.mes.stationtracker.worklistPopover.unPlanned = true;
		airbus.mes.stationtracker.worklistPopover.OSW = true;			
		airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().getModel("OSWModel").getData().Rowsets.Rowset[0].Row), "WorkListModel");
		airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").refresh();
		
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
		
		GroupingBoxingManager.parseOperation(GroupingBoxingManager.group,GroupingBoxingManager.box);		
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
		scheduler.updateView();

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
		
		airbus.mes.stationtracker.worklistPopover.unPlanned = false;
		airbus.mes.stationtracker.worklistPopover.OSW = false;			
		airbus.mes.stationtracker.worklistPopover.close();
		
	},	
	
	changeShift : function() {
	
		if ( airbus.mes.stationtracker.ShiftManager.dayDisplay ) {
		
		airbus.mes.stationtracker.ShiftManager.ShiftSelected = airbus.mes.stationtracker.oView.byId("selectShift").getSelectedItem().getText();
		
		var intervals = airbus.mes.stationtracker.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.ShiftManager.current_day][airbus.mes.stationtracker.ShiftManager.ShiftSelected];
				
		
		airbus.mes.stationtracker.ShiftManager.ShiftSelectedStart = intervals[0].beginDateTime;
		airbus.mes.stationtracker.ShiftManager.ShiftSelectedEnd = intervals[intervals.length - 1].endDateTime;
		// remove previous marker
		
				
		scheduler.deleteMarkedTimespan( airbus.mes.stationtracker.ShiftManager.ShiftMarkerID );
			
		airbus.mes.stationtracker.ShiftManager.ShiftMarkerID = scheduler.addMarkedTimespan({  
			start_date: airbus.mes.stationtracker.ShiftManager.ShiftSelectedStart,
			end_date: airbus.mes.stationtracker.ShiftManager.ShiftSelectedEnd,
		    css:   "shiftCss",
		});
		
		
		scheduler.updateView();
		
		}
	},
	
	changeGroupWorkList : function() {
		// TOSEE if we can get ID by better way
		sap.ui.getCore().byId("worklistPopover--myList").bindAggregation('items', {
			path : "WorkListModel>/",
			template : sap.ui.getCore().byId("worklistPopover--sorterList"),
			sorter : [ new sap.ui.model.Sorter({
				// Change this value dynamic
				path : 'shopOrder',
				descending : false,
				group : true,
			}), new sap.ui.model.Sorter({
				path : 'index',
				descending : false
			}) ]
		});
		
	}
	

/////////////////////////////////////////////////////////////////////////////////////////////////
	/**
     * Fire the sorter when picking a value in the combobox worklist 
      * 
      * @returns {sap.ui.model.Sorter}
     */
     changeGrouping : function(oEvt) {
           
           var aModelToTest = airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").oData;
           
//           if (aModelToTest.some(function(el) {
//
//                  return el.groupingInternal === ModelManager.group_type;
//
//           })) {
//
//                  ModelManager.group_parameter = ModelManager.group_type;
//
//           } else {
//                  ModelManager.group_parameter = sap.ui.getCore().getModel("WorkListModel").oData.Group[0].groupingInternal;
//
//           }
//           
//           if(oEvt){
//           ModelManager.group_parameter = oEvt.getSource().getSelectedKey();
//           }
                  
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
           oWorkList.sort(util.Formatter.fieldComparator([ 'shopOrder',
                         'operationID' ]));

           // Constitute a table of WO groups with operations associated
           // The group object has template bellow.
           var currentWO = {
                  workOrder : undefined,
                  dynamicStartDate : undefined,
                  scheduledStartDate : undefined,
                  operations : [],
           };

           for (i = 0; i < oWorkList.length; i++) {
                  if (currentWO.workOrder !== oWorkList[i].workOrder) {

                         if (currentWO.operations.length > 0) {
                                oWOList.push(currentWO);
                         }

                         currentWO = {
                                workOrder : oWorkList[i].workOrder,
                                dynamicStartDate : oWorkList[i].dynamicReschedStartDate,
                                scheduledStartDate : oWorkList[i].start,
                                operations : [ oWorkList[i] ],
                         };

                  } else {

                         if (oWorkList[i].dynamicReschedStartDate < currentWO.dynamicStartDate) {
                                currentWO.dynamicStartDate = oWorkList[i].dynamicReschedStartDate;
                         }

                         if (oWorkList[i].start < currentWO.scheduledStartDate) {
                                currentWO.scheduledStartDate = oWorkList[i].start;
                         }

                         currentWO.operations.push(oWorkList[i]);

                  }
           }

           oWOList.push(currentWO);

           // Sort each groups (Work Orders)
           // The operations inside each groups should still be in the same order
           // (ascending order preserved)
           oWOList.sort(util.Formatter.fieldComparator([ 'dynamicStartDate',
                         'scheduledStartDate', 'workOrder' ]));

           // Flatten worklist (take operations of each groups)
           oWL2 = oWOList.reduce(function(prev, curr) {
                  return prev.concat(curr.operations);
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
	
	
	
});

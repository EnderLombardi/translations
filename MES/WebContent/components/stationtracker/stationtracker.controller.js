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
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf components.stationtracker.stationtracker
	 */
		onBeforeRendering: function() {
			
//			var temp = [];
//			var binding = this.getView().byId("selectProductionGroup").getBinding("items");
////			path correspond to relatif path after binding, here absolute path is /Rowsets/Rowset/0/Row			
//			var Filter = new sap.ui.model.Filter({ path : "PROD_GROUP",
//										           test : function(value) {
//										                     if (temp.indexOf(value) == -1) {
//										                            temp.push(value)
//										                            return true;
//										                     } else {
//										                            return false;
//										                     }
//										              }
//													});	
//			
//			binding.filter(Filter);		
		},
	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf components.stationtracker.stationtracker
	 */
	onAfterRendering : function() {
		// Capture the open/close panel event
		airbus.mes.stationtracker.oView.byId('kpi_header').attachExpand(resizeGantt);
		
		// First run on init
		resizeGantt(true);
		
		// Place the Gantt under the Toolbar
		function resizeGantt(param){
			setTimeout(function(){
				var jqToolbar = $(airbus.mes.stationtracker.oView.byId('toolbarstationtracker').getDomRef());
				var jqStationTracker = $(airbus.mes.stationtracker.oView.byId('stationtracker').getDomRef());
				jqStationTracker.css('top', jqToolbar.offset().top);
			}, 0);
		}
		this.getView().byId("disruptNotifications").openNavigation();
		this.getView().byId("disruptNotifications").closeNavigation();

	},
	onProductionGroupPress : function(oEvent){
		if ( airbus.mes.stationtracker.productionGroupPopover === undefined ) {
			
			var oView = airbus.mes.stationtracker.oView;
			airbus.mes.stationtracker.productionGroupPopover = sap.ui.xmlfragment("productionGroupPopover","airbus.mes.stationtracker.productionGroupPopover", airbus.mes.stationtracker.oView.getController());
			airbus.mes.stationtracker.productionGroupPopover.addStyleClass("alignTextLeft");
			oView.addDependent(airbus.mes.stationtracker.productionGroupPopover);
			//var oModel = new sap.ui.model.json.JSONModel(sap.ui.getCore().getModel("productionGroupModel").getData().Rowsets.Rowset[0].Row) ;
			
			airbus.mes.stationtracker.productionGroupPopover.setModel(sap.ui.getCore().getModel("productionGroupModel"), "productionGroupModel");
		
		}

	

//		airbus.mes.stationtracker.productionGroupPopover.getModel("productionGroupModel").refresh(true);

		var temp = [];
		var binding = sap.ui.getCore().byId("productionGroupPopover--myList").getBinding("items");
//		path correspond to relatif path after binding, here absolute path is /Rowsets/Rowset/0/Row			
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
		
		
		
//		airbus.mes.stationtracker.productionGroupPopover.getModel("productionGroupModel").setData(oData);
//		airbus.mes.stationtracker.productionGroupPopover.getModel("productionGroupModel").refresh(true);

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
		scheduler.updateView(airbus.mes.stationtracker.ShiftManager.currentShiftStart);
		/* Delete Selection box when shift */
		for (var i = 0; i < $("select[class='selectBoxStation']").length; i++) {
			$("select[class='selectBoxStation']").eq(i).remove();
		}
		
		airbus.mes.stationtracker.ShiftManager.ShiftMarkerID.forEach(function(el){
			
			scheduler.deleteMarkedTimespan(el);
		
		})
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
		
		// Need this to update selected view and dont brake the behaviour of overflowtoolbar not needed if use Toolbar
		airbus.mes.stationtracker.oView.byId("buttonViewMode").rerender();
		airbus.mes.stationtracker.oView.byId("buttonViewMode").setSelectedKey("day");
		
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
		
		jQuery.sap.registerModulePath("airbus.mes.polypoly","../components/polypoly");
		airbus.mes.stationtracker.AssignmentManager.polypolyAffectation = false;
		
//		if (!airbus.mes.stationtracker.oPopoverPolypoly) {
//			airbus.mes.stationtracker.oPopoverPolypoly = sap.ui.xmlfragment("airbus.mes.stationtracker.polypolyFragment", this);
//			
//			var oComp = sap.ui.getCore().createComponent({
//	            name : "airbus.mes.polypoly", // root component folder is resources
//	            id : "Comp10",
//	     });	
//			//load model of polypoly
//			airbus.mes.polypoly.ModelManager.loadPolyPolyModel("F1","1","10","CHES");	
//		}
		if(airbus.mes.polypoly == undefined){
			sap.ui.getCore().createComponent({
				name : "airbus.mes.polypoly", // root component folder is resources
         	});
		}
		
		airbus.mes.polypoly.PolypolyManager.globalContext.bEditable = !airbus.mes.stationtracker.AssignmentManager.polypolyAffectation;
		
		if(!nav.getPage("polypolyPage")){
		var oPolypolyPage = new sap.m.Page({
			content: airbus.mes.polypoly.oView,
			title : "POLYPOLY",
			id:"polypolyPage",
			customHeader : new sap.m.Toolbar({
				content: [
				          new sap.m.Button({
				        	  icon:"sap-icon://arrow-left",
				        	  type:"Transparent",
				        	  press: function(){nav.back()}
				          }),
				          new sap.m.ToolbarSpacer({}),
				          new sap.m.Label({
				        	  text: "PolyValence/PolyCompetence Matrix"
				          }).addStyleClass("pageWelcome sapUiTinyMarginBeginEnd"),
				          new sap.m.ToolbarSpacer({}),
				          ]
			}).addStyleClass("pageHeader contentNoPad"),
		});
		
		nav.addPage(oPolypolyPage);
		}else{
			var oPolypolyPage = nav.getPage("polypolyPage");
			if(oPolypolyPage.getContent().length == 0){
				oPolypolyPage.addContent(airbus.mes.polypoly.oView);
			}
		}
		nav.to(oPolypolyPage);
		
//		nav.addPage(airbus.mes.polypoly.oView);
//		nav.to(airbus.mes.polypoly.oView.getId());
		
		
		airbus.mes.polypoly.ModelManager.getPolyPolyModel("F1","1","10","CHES");
		
		airbus.mes.polypoly.oView.getController().initiatePolypoly();
		// place this Ui Container with the Component inside into UI Area
//		airbus.mes.stationtracker.oPopoverPolypoly.addContent(airbus.mes.polypoly.oView);
//		airbus.mes.stationtracker.oPopoverPolypoly.open();	
			
		
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
	    var sProdGroup = "";
	    var sProdGroupMii = "";
	     
		if(sap.ui.getCore().byId("productionGroupPopover--myList").getSelectedItems().length != 0 ){
			
			sap.ui.getCore().byId("productionGroupPopover--myList").getSelectedItems().forEach(function(el){
				
				sProdGroup += el.mProperties.label + ",";
				sProdGroupMii += el.mProperties.label + "','";
			}) 
		sProdGroup = sProdGroup.slice(0,-1);
		airbus.mes.settings.ModelManager.prodGroup = sProdGroupMii.slice(0,-3);
		} else {
				
				sProdGroup += airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("ProductionGroup");
				airbus.mes.settings.ModelManager.prodGroup ="%";
			}

		
		airbus.mes.stationtracker.oView.byId("ProductionButton").setText(sProdGroup);

		airbus.mes.stationtracker.ModelManager.loadStationTracker("I");		
		airbus.mes.stationtracker.ModelManager.loadStationTracker("R");
		airbus.mes.stationtracker.ModelManager.loadStationTracker("U");		
		airbus.mes.stationtracker.ModelManager.loadStationTracker("O");		
		
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
			
		})
		
		airbus.mes.stationtracker.ModelManager.setOSW(aSFC_Step);
		
	},
	
	onUnplannedClose : function() {
		
		airbus.mes.stationtracker.worklistPopover.unPlanned = false;
		airbus.mes.stationtracker.worklistPopover.OSW = false;			
		airbus.mes.stationtracker.worklistPopover.close();
		
	},	
	onPressExpdandable : function(oEvent) {
		var oPanel = oEvent.getSource().getParent().getParent();
		var bIsExpanded = oPanel.getExpanded();
		
		oEvent.getSource().getParent().getParent().setExpanded(!bIsExpanded);

		/***** REMY *****/
		oPanel.getHeight();
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
		
		})
		
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
	},
	
	changeGroupWorkList : function(oEvent) {
		// TOSEE if we can get ID by better way
		sap.ui.getCore().byId("worklistPopover--myList").bindAggregation('items', {
			path : "WorkListModel>/",
			template : sap.ui.getCore().byId("worklistPopover--sorterList"),
			sorter : [ new sap.ui.model.Sorter({
				// Change this value dynamic
				path : 'WORKORDER_ID', //oEvt.getSource().getSelectedKey();
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
//    	 Check the current value of the filter status
    	 if(oEvent.getSource().getSelectedKey() === "A") {
//			if status ALL, we have to remove all filter
    		 sap.ui.getCore().byId("worklistPopover--myList").getBinding("items").filter();    	
    		 
    	 } else {
//    		 we apply the a filter

    		 var oFilterStatus = new sap.ui.model.Filter("STATE","EQ",oEvent.getSource().getSelectedKey());        
             aMyFilter.push(oFilterStatus);
             sap.ui.getCore().byId("worklistPopover--myList").getBinding("items").filter(new sap.ui.model.Filter(aMyFilter, true));    		 
    	 }
    	 
     },
     
     ClosePolyPoly : function(oEvent){
    	 
 		oEvent.getSource().getParent().close();
 		
     },
     
 	getI18nValue : function(sKey) {
	    return this.getView().getModel("StationTrackerI18n").getProperty(sKey);
	},
	
	_close : function() {
		airbus.mes.stationtracker.operationDetailPopup.close();
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
	showDisruption : function(oEvent)
	{
		if(this.getView().byId("disruptNotifications").getState() == false)
			this.getView().byId("disruptNotifications").openNavigation();
		else
			this.getView().byId("disruptNotifications").closeNavigation();
	},
	
	/**
     * Change the date of scheduler
     */
	changeDay : function(oEvt) {
		
		scheduler.updateView(oEvt.getSource().getDateValue())
	}
	
});

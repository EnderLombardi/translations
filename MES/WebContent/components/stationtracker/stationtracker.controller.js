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
	onAfterRendering: function() {
		
		if ( !sap.ui.getCore().byId("selectGroup") ) {
		var oToolBar = new sap.m.Toolbar({
		
			content : [new sap.m.Button({
				text : "42",
				type : "Transparent",
				icon : "sap-icon://group",
				press : this.onTeamPress,
			}).addStyleClass("buttonStatus"),
			
			new sap.m.ToolbarSeparator({}), 
			
			new sap.m.Label({ text:"Sort By : "}),
			
			new sap.m.Select("selectGroup",{
				change: this.changeGroup,
				items : [ new sap.ui.core.Item({ text:"Competence", key:"competency"}),
				          new sap.ui.core.Item({ text:"Avl", key:"avlLine"}),
				         ]
				}).addStyleClass("sapUiTinyMarginBeginEnd"),
			
			new sap.m.Label({ text:"Show : "}),
			 
			new sap.m.Select("selectBox",{
				change: this.changeBox,
				items : [ new sap.ui.core.Item({ text:"Operations", key:"operationId"}),
				          new sap.ui.core.Item({ text:"WorkOrder", key:"workOrderId"}),
				         ]
				}).addStyleClass("sapUiTinyMarginBeginEnd"),
			
			new sap.m.ToolbarSeparator({}), 
			
			new sap.m.Button({
				text : "show CP",
				type : "Transparent",
				icon : "sap-icon://ppt-attachment",
				press : this.onCPPress,
			}).addStyleClass("sapUiTinyMarginBeginEnd"),
			
			new sap.m.Button({
				text : "show initial plan",
				type : "Transparent",
				icon : "sap-icon://ppt-attachment",
				press : this.onInitialPlanPress,
			}).addStyleClass("sapUiTinyMarginBeginEnd"),
			           
//			new sap.m.SegmentedButton({
//			
//				items: [ new sap.m.SegmentedButtonItem({ text:"Shift", press:this.onShiftPress }),
//				         new sap.m.SegmentedButtonItem({ text:"Day", press:this.onDayPress })]				
//			})
			
			
			]
		
		
			
		}).addStyleClass("white")
		
		
//		<Toolbar class="white">
//		<content>
//			<Button text="42" type="Transparent" icon="sap-icon://group"
//				class="buttonStatus" press="onTeamPress"></Button>
//			<ToolbarSeparator />
//			<Label text="Sort By : " />
//			<Select id="selectGroup" class="sapUiTinyMarginBeginEnd" change="changeGroup">
//				<core:Item text="Competence" key="competency"/>
//				<core:Item text="Avl" key="avlLine" />
//			</Select>
//			<Label text="Show : " />
//			<Select id="selectBox" class="sapUiTinyMarginBeginEnd" change="changeBox">
//				<core:Item text="Operations" key="operationId"/>
//				<core:Item text="WorkOrder" key="workOrderId"/>
//			</Select>
//			<ToolbarSpacer />
//			<Button text="show CP" type="Transparent" icon="sap-icon://ppt-attachment"
//				class="sapUiTinyMarginBeginEnd" press="onCPPress"></Button>
//			<Button text="show initial plan" type="Transparent"
//				icon="sap-icon://ppt-attachment" class="sapUiTinyMarginBeginEnd"
//				press="onInitialPlanPress"></Button>
//			<SegmentedButton>
//				
//				<items>
//					<SegmentedButtonItem text="Shift" press="onShiftPress" />
//					<SegmentedButtonItem text="Day" press="onDayPress" />
//				</items>
//			</SegmentedButton>
//		</content>
//	</Toolbar>
		
		
		oToolBar.placeAt($("div[class='dhx_cal_navline']"))
		}
	},
	
	onTeamPress :function(oEvent){
		
		 var bindingContext = oEvent.getSource().getBindingContext();			 
		 // open team popover fragment		 
		if (! this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("airbus.mes.stationtracker.teamPopover", this);
			this._oPopover.addStyleClass("alignTextLeft");
			this.getView().addDependent(this._oPopover);
		}
		this._oPopover.openBy(oEvent.getSource());							

	},

	 onShiftPress : function(){
		
  	  scheduler.matrix['timeline'].x_unit = 'minute';
  	  scheduler.matrix['timeline'].x_step = 120;
  	  scheduler.matrix['timeline'].x_size = 6;
  	  scheduler.matrix['timeline'].x_length = 12;
  	  scheduler.matrix['timeline'].x_start= 3,
  	  scheduler.matrix['timeline'].x_date = '%H:%i';
  	  scheduler.templates.timeline_scale_date = function(date){
         var func=scheduler.date.date_to_str(scheduler.matrix['timeline'].x_date );
         return func(date);
      };
      scheduler.updateView();
  	  
	 },
	 
	 onDayPress : function(){
			
		  scheduler.matrix['timeline'].x_unit = 'minute';
       	  scheduler.matrix['timeline'].x_step = 120;
       	  scheduler.matrix['timeline'].x_start= 3,
       	  scheduler.matrix['timeline'].x_size = 8.5;
       	  scheduler.matrix['timeline'].x_length = 12;
       	  scheduler.matrix['timeline'].x_date = '%H:%i';
       	  scheduler.templates.timeline_scale_date = function(date){
             var func=scheduler.date.date_to_str(scheduler.matrix['timeline'].x_date );
             return func(date);
          };
          scheduler.updateView();
	  	  
		 },
	
		
	onInitialPlanPress : function() {
	
		// XX TO REDEFINE
		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
		
	if (airbus.mes.stationtracker.GroupingBoxingManager.showInitial) {
		
		airbus.mes.stationtracker.GroupingBoxingManager.showInitial = false;
		GroupingBoxingManager.parseOperation(GroupingBoxingManager.group,GroupingBoxingManager.box);
							
		} else {
			
			airbus.mes.stationtracker.GroupingBoxingManager.showInitial = true;
			GroupingBoxingManager.parseOperation(GroupingBoxingManager.group,GroupingBoxingManager.box);
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
	
		GroupingBoxingManager.parseOperation(GroupingBoxingManager.group,GroupingBoxingManager.box);
	},
	
	changeBox : function() {
		
		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
		
		GroupingBoxingManager.group = sap.ui.getCore().byId("stationTrackerView").byId("selectGroup").getSelectedKey();
		GroupingBoxingManager.box = sap.ui.getCore().byId("stationTrackerView").byId("selectBox").getSelectedKey();
	
		GroupingBoxingManager.parseOperation(GroupingBoxingManager.group,GroupingBoxingManager.box);
		
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

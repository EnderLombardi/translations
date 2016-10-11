jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.stationtracker.util.Formatter");
jQuery.sap.require("airbus.mes.stationtracker.AssignmentManager");
jQuery.sap.require("airbus.mes.stationtracker.GroupingBoxingManager");
jQuery.sap.require("airbus.mes.stationtracker.ShiftManager");
jQuery.sap.require("airbus.mes.stationtracker.ModelManager");
jQuery.sap.require("airbus.mes.stationtracker.customProgressIndicator");


jQuery.sap.registerModulePath("airbus.mes.dhtmlx","../lib/dhtmlxscheduler");

jQuery.sap.require("airbus.mes.dhtmlx.dhtmlxscheduler");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_limit");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_timeline");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_treetimeline");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_units");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_drag_between");
//jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_tooltip");

jQuery.sap.declare("airbus.mes.stationtracker.Component");

sap.ui.core.UIComponent.extend("airbus.mes.stationtracker.Component", {
	metadata : {
		properties : {},
		includes : [ "./css/stationTracker.css" ] //array of css and/or javascript files that should be used in the component  

	}
	
	//manifestUrl : "component.json",
});

airbus.mes.stationtracker.Component.prototype.createContent = function() {
	
	 if (airbus.mes.stationtracker.oView === undefined) {
	//	View on XML
	  this.oView = sap.ui.view({
	  id : "stationTrackerView",
	  viewName : "airbus.mes.stationtracker.stationtracker",
	  type : "XML",
  })

//  		airbus.mes.stationtracker.ModelManager.loadShifts();
//			airbus.mes.stationtracker.ModelManager.loadAffectation();
//			airbus.mes.stationtracker.ModelManager.loadStationTracker("R");
//			airbus.mes.stationtracker.ShiftManager.init(airbus.mes.stationtracker.GroupingBoxingManager.shiftNoBreakHierarchy);

//			scheduler.xy.scroll_width = 20;
			//scheduler.xy.nav_height = 0;
//			scheduler.updateView();
  
  
  	  this.oView.setModel(sap.ui.getCore().getModel("userSettingModel"), "userSettingModel");
  	  airbus.mes.stationtracker.oView = this.oView;	
	  return this.oView;
	 }
};

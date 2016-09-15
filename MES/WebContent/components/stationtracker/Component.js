jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.stationtracker.ModelManager");
jQuery.sap.require("airbus.mes.stationtracker.AssignmentManager");

jQuery.sap.registerModulePath("airbus.mes.dhtmlx","/MES/lib/dhtmlxscheduler");
jQuery.sap.require("airbus.mes.dhtmlx.dhtmlxscheduler");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_limit");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_timeline");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_treetimeline");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_units");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_drag_between");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_tooltip");

jQuery.sap.declare("airbus.mes.stationtracker.Component");

sap.ui.core.UIComponent.extend("airbus.mes.stationtracker.Component", {
	//manifestUrl : "component.json",
});

airbus.mes.stationtracker.Component.prototype.createContent = function() {
//	View on XML
	this.oView = sap.ui.view({
	  id : "stationTrackerView",
	  viewName : "airbus.mes.stationtracker.stationtracker",
	  type : "XML",
  })

	  return this.oView;
};
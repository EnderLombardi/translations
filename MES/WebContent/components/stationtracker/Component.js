jQuery.sap.require("sap.ui.core.UIComponent");
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


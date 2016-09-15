jQuery.sap.require("sap.ui.core.UIComponent");


jQuery.sap.declare("airbus.mes.globalnav.Component");

sap.ui.core.UIComponent.extend("airbus.mes.globalnav.Component", {
	//manifestUrl : "component.json",
});

airbus.mes.globalnav.Component.prototype.createContent = function() {
//	View on XML
	this.oView = sap.ui.view({
	  id : "globalNavView",
	  viewName : "airbus.mes.globalnav.globalNavigation",
	  type : "XML",
  })

	  return this.oView;
};


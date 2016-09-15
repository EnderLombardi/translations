jQuery.sap.require("sap.ui.core.UIComponent");

sap.ui.core.UIComponent.extend("airbus.mes.homepage.Component", {
	//manifestUrl : "component.json",
});

airbus.mes.homepage.Component.prototype.createContent = function() {
	
	var oModel = new sap.ui.model.json.JSONModel();
	this.setModel(oModel , "buttonUrl");
	oModel.loadData("/MES/components/homepage/data/url.json",null,false);
	
//	View on XML
	this.oView = sap.ui.view({
	  id : "homePageView",
	  viewName : "airbus.mes.homepage.homePage",
	  type : "XML",
	  height : "100%"
  }).addStyleClass("absolutePosition");

	  return this.oView;
};


jQuery.sap.require("sap.ui.core.UIComponent");

sap.ui.core.UIComponent.extend("airbus.mes.homepage.Component", {
	metadata : {
		properties : {},
		includes : [ "./css/margin.css" ] //array of css and/or javascript files that should be used in the component   

	},
	//manifestUrl : "component.json",
});

airbus.mes.homepage.Component.prototype.createContent = function() {

	var oModel = new sap.ui.model.json.JSONModel();
	this.setModel(oModel, "buttonUrl");
	oModel.loadData("../components/homepage/data/url.json", null, false);

	if (airbus.mes.homepage.oView === undefined) {
		//	View on XML
		this.oView = sap.ui.view({
			id : "homePageView",
			viewName : "airbus.mes.homepage.homePage",
			type : "XML",
			height : "100%"

		}).addStyleClass("absolutePosition");
		airbus.mes.homepage.oView = this.oView;

		return this.oView;

	}

};


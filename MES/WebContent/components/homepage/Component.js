jQuery.sap.require("sap.ui.core.UIComponent");

sap.ui.core.UIComponent.extend("airbus.mes.homepage.Component", {
	metadata : {
		properties : {},
		includes : [ "./css/margin.css" ]

	},
	//manifestUrl : "component.json",
});

airbus.mes.homepage.Component.prototype.createContent = function() {

	var oModel1 = new sap.ui.model.json.JSONModel();	
	
	oModel1.loadData("../components/homepage/data/1TileLineHome.json", null, false);
	
	if (airbus.mes.homepage.oView === undefined) {
		//	View on XML
		this.oView = sap.ui.view({
			id : "homePageView",
			viewName : "airbus.mes.homepage.homePage",
			type : "XML",
			height : "100%"

		}).addStyleClass("absolutePosition");
		airbus.mes.homepage.oView = this.oView;

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/homepage/i18n/i18n.properties",
//	        bundleLocale : "en" automatic defined by parameter sap-language
	     });
		
		// Local Model
		this.oView.setModel(i18nModel, "i18n");				
		this.oView.setModel(oModel1, "1TileLineHome");
		
		
		return this.oView;

	}

};


jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.base.Event");
jQuery.sap.require("airbus.mes.polypoly.ModelManager");
jQuery.sap.require("airbus.mes.polypoly.PolypolyManager");

jQuery.sap.declare("airbus.mes.polypoly.Component");

sap.ui.core.UIComponent.extend("airbus.mes.polypoly.Component", {
	metadata : {
		properties : {},
//		includes : [ "./css/margin.css" ] //array of css and/or javascript files that should be used in the component   

	},
	//manifestUrl : "component.json",
});

airbus.mes.polypoly.Component.prototype.createContent = function() {

//	var oModel = new sap.ui.model.json.JSONModel();
//	this.setModel(oModel, "buttonUrl");
//	oModel.loadData("../components/homepage/data/url.json", null, false);
	airbus.mes.polypoly.ModelManager.init(this);

	if (airbus.mes.polypoly.oView === undefined) {
		//	View on XML
		airbus.mes.polypoly.PolypolyManager.init(this);
		airbus.mes.polypoly.ModelManager.init(this);

		this.oView = sap.ui.view({
			id : "polypoly",
			viewName : "airbus.mes.polypoly.polypoly",
			type : "XML",
			height : "100%"
		})
		airbus.mes.polypoly.oView = this.oView;

//		var i18nModel = new sap.ui.model.resource.ResourceModel({
//	        bundleUrl : "../components/homepage/i18n/i18n.properties",
////	        bundleLocale : "en" automatic defined by parameter sap-language
//	     });
		
//		this.oView.setModel(i18nModel, "i18n");		
		
		return this.oView;

	}

};


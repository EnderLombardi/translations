jQuery.sap.registerModulePath("airbus.mes.operationdetail", "../components/operationdetail");
jQuery.sap.require("airbus.mes.operationdetail.Formatter");

jQuery.sap.declare("airbus.mes.operationdetail.Component");

sap.ui.core.UIComponent.extend("airbus.mes.operationdetail.Component", {
	metadata : {
		properties : {},
		includes : [ "./css/progressSlider.css" ]

	}

	/** manifestUrl : "component.json",*/
});

airbus.mes.operationdetail.Component.prototype.createContent = function() {


	if (airbus.mes.operationdetail.oView === undefined) {
		/**		Initialization
		airbus.mes.stationtracker.ModelManager.init(sap.ui.getCore()); */
		
		// View on XML
		this.oView = sap.ui.view({
			id : "progressSliderView",
			viewName : "airbus.mes.operationdetail.progressSlider",
			type : "XML",
		})

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/operationdetail/i18n/i18n.properties",
	        //bundleLocale : "en" automatic defined by parameter sap-language
	     });
		
		/**this.oView.setModel(i18nModel, "StationTrackerI18n");		
		airbus.mes.stationtracker.oView = this.oView		
		this.oView.setModel(sap.ui.getCore().getModel("userSettingModel"),	"userSettingModel");
		this.oView.setModel(sap.ui.getCore().getModel("stationTrackerShift"),"stationTrackerShift");
		this.oView.setModel(sap.ui.getCore().getModel("productionGroupModel"), "productionGroupModel");
		this.oView.setModel(sap.ui.getCore().getModel("KPI"), "KPI");
		this.oView.setModel(sap.ui.getCore().getModel("groupModel"), "groupModel"); */

		return this.oView;
	}

};
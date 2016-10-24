jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.disruptiontracker.util.Formatter");
jQuery.sap.require("airbus.mes.disruptiontracker.ModelManager");

jQuery.sap.registerModulePath("airbus.mes.dhtmlx", "../lib/dhtmlxscheduler");

jQuery.sap.require("airbus.mes.dhtmlx.dhtmlxscheduler");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_limit");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_timeline");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_treetimeline");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_units");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_drag_between");
// jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_tooltip");

jQuery.sap.declare("airbus.mes.disruptiontracker.Component");

sap.ui.core.UIComponent.extend("airbus.mes.disruptiontracker.Component", {
	metadata : {
		properties : {},
		includes : [ "./css/disruptiontracker.css" ]
	// array of css and/or javascript files that should be used in the component

	}

// manifestUrl : "component.json",
});

airbus.mes.disruptiontracker.Component.prototype.createContent = function() {

	airbus.mes.disruptiontracker.isDisplay = true;
	
	if (airbus.mes.disruptiontracker.oView === undefined) {
//		Initialization
		airbus.mes.disruptiontracker.ModelManager.init(sap.ui.getCore());
		
		// View on XML
		this.oView = sap.ui.view({
			id : "disruptiontrackerView",
			viewName : "airbus.mes.disruptiontracker.list.disruptions",
			type : "XML",
		})

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/disruptiontracker/i18n/i18n.properties"
//	        bundleLocale : "en" automatic defined by parameter sap-language
	     });
		this.oView.setModel(i18nModel, "disruptiontrackerI18n");		
		airbus.mes.disruptiontracker.oView = this.oView		
		//this.oView.setModel(sap.ui.getCore().getModel("userSettingModel"),	"userSettingModel");
		this.oView.setModel(sap.ui.getCore().getModel("tableData"),"tableData");
		this.oView.setModel(sap.ui.getCore().getModel("filterData"), "filterData");
		this.oView.setModel(sap.ui.getCore().getModel("orderData"), "orderData");
		
		
		
		return this.oView;
	}
};

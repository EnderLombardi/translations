jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.stationtracker.util.Formatter");
jQuery.sap.require("airbus.mes.stationtracker.AssignmentManager");
jQuery.sap.require("airbus.mes.stationtracker.GroupingBoxingManager");
jQuery.sap.require("airbus.mes.stationtracker.ShiftManager");
jQuery.sap.require("airbus.mes.stationtracker.ModelManager");
jQuery.sap.require("airbus.mes.stationtracker.customProgressIndicator");

jQuery.sap.registerModulePath("airbus.mes.dhtmlx", "../lib/dhtmlxscheduler");

jQuery.sap.require("airbus.mes.dhtmlx.dhtmlxscheduler");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_limit");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_timeline");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_treetimeline");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_units");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_drag_between");
// jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_tooltip");

jQuery.sap.declare("airbus.mes.stationtracker.Component");

sap.ui.core.UIComponent.extend("airbus.mes.stationtracker.Component", {
	metadata : {
		properties : {},
		includes : [ "./css/stationTracker.css" ]
	// array of css and/or javascript files that should be used in the component

	}

// manifestUrl : "component.json",
});

airbus.mes.stationtracker.Component.prototype.createContent = function() {

	if (airbus.mes.stationtracker.oView === undefined) {
//		Initialization
		airbus.mes.stationtracker.ModelManager.init(sap.ui.getCore());
		
		// View on XML
		this.oView = sap.ui.view({
			id : "stationTrackerView",
			viewName : "airbus.mes.stationtracker.stationtracker",
			type : "XML",
		})

		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/stationtracker/i18n/i18n.properties",
//	        bundleLocale : "en" automatic defined by parameter sap-language
	     });
		this.oView.setModel(i18nModel, "StationTrackerI18n");		
		airbus.mes.stationtracker.oView = this.oView		
		//this.oView.setModel(sap.ui.getCore().getModel("userSettingModel"),	"userSettingModel");
		this.oView.setModel(sap.ui.getCore().getModel("stationTrackerShift"),"stationTrackerShift");
		this.oView.setModel(sap.ui.getCore().getModel("productionGroupModel"), "productionGroupModel");
		this.oView.setModel(sap.ui.getCore().getModel("KPI"), "KPI");
		this.oView.setModel(sap.ui.getCore().getModel("groupModel"), "groupModel");
		this.oView.setModel(sap.ui.getCore().getModel("affectationModel"), "affectationModel");
		this.oView.setModel(sap.ui.getCore().getModel("ressourcePoolModel"), "ressourcePoolModel");
		
		
		return this.oView;
	}
};

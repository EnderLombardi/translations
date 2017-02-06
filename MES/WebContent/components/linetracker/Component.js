"use strict";
//jQuery.sap.registerModulePath("airbus.mes.d3", "../lib/d3");
//jQuery.sap.require("airbus.mes.d3.d3_3_5_17_min");
jQuery.sap.require("airbus.mes.linetracker.kpicharts.util.Formatter");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.base.Event");
jQuery.sap.require("airbus.mes.linetracker.util.ModelManager");
jQuery.sap.require("airbus.mes.linetracker.util.Formatter");
// Declare the current Component
jQuery.sap.declare("airbus.mes.linetracker.Component");
jQuery.sap.require("airbus.mes.linetracker.control.linetrackerProgressBar");

// Extend current Component
sap.ui.core.UIComponent.extend("airbus.mes.linetracker.Component", {
	// manifestUrl : "Component.json",
	metadata : {

		properties : {

		},
	}

});

// override the createContent function to return user interface
airbus.mes.linetracker.Component.prototype.createContent = function() {

	if (airbus.mes.linetracker.oView === undefined) {
		airbus.mes.linetracker.util.ModelManager.init(sap.ui.getCore());

		this.oView = sap.ui.view({
			id : "idLinetracker1",
			viewName : "airbus.mes.linetracker.Linetracker",
			type : "XML"
		});

		// Line Tracker Model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleName : "airbus.mes.linetracker.i18n.i18n",
		});
		this.oView.setModel(i18nModel, "i18n");

		// kpicharts model
		/*var KPIi18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "../components/linetracker/kpicharts/i18n/i18n.properties",
		});
		this.oView.setModel(KPIi18nModel, "kpiI18n");
*/
		this.oView.setModel(sap.ui.getCore().getModel("stationDataModel"), "stationDataModel");
		this.oView.setModel(sap.ui.getCore().getModel("statusActionModel"), "statusActionModel");
		this.oView.setModel(sap.ui.getCore().getModel("lineVariantModel"), "lineVariantModel");
		//this.oView.setModel(sap.ui.getCore().getModel("KPItaktAdherence"), "KPItaktAdherence");
		//this.oView.setModel(sap.ui.getCore().getModel("KPIshiftStaffing"), "KPIshiftStaffing");
		//this.oView.setModel(sap.ui.getCore().getModel("KPIextraWork"), "KPIextraWork");
		//this.oView.setModel(sap.ui.getCore().getModel("KPI"), "KPI");
		//this.oView.setModel(sap.ui.getCore().getModel("KPIchartTaktAdherence"), "KPIchartTaktAdherence");
		//this.oView.setModel(sap.ui.getCore().getModel("KPIdisruption"), "KPIdisruption");
		//this.oView.setModel(sap.ui.getCore().getModel("KPIresolutionEfficiency"), "KPIresolutionEfficiency");
		//this.oView.setModel(sap.ui.getCore().getModel("KPItaktEfficiency"), "KPItaktEfficiency");
		//this.oView.setModel(sap.ui.getCore().getModel("KPIopenAnomalies"), "KPIopenAnomalies");

		//this.oView.setModel(sap.ui.getCore().getModel("plantModel"), "plantModel");
		//this.oView.setModel(sap.ui.getCore().getModel("airlineLogoModel"), "airlineLogoModel");

		airbus.mes.linetracker.oView = this.oView;

		return this.oView;

	} else {
		return airbus.mes.linetracker.oView;
	}

	sap.ui.getCore().byId("idLinetracker1--linetrackerTable").rerender();
};

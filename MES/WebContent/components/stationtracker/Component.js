"use strict";

jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.stationtracker.util.Formatter");
jQuery.sap.require("airbus.mes.stationtracker.util.AssignmentManager");
jQuery.sap.require("airbus.mes.stationtracker.util.GroupingBoxingManager");
jQuery.sap.require("airbus.mes.stationtracker.util.ShiftManager");
jQuery.sap.require("airbus.mes.stationtracker.util.ModelManager");
jQuery.sap.require("airbus.mes.stationtracker.util.GraphManager");
jQuery.sap.require("airbus.mes.stationtracker.util.customProgressIndicator");
jQuery.sap.require("airbus.mes.stationtracker.util.customButton");

jQuery.sap.require("airbus.mes.dhtmlx.dhtmlxscheduler");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_limit");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_timeline");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_treetimeline");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_units");
jQuery.sap.require("airbus.mes.dhtmlx.ext.dhtmlxscheduler_drag_between");

jQuery.sap.require("airbus.mes.d3.d3_3_5_17_min");

jQuery.sap.declare("airbus.mes.stationtracker.Component");

sap.ui.core.UIComponent.extend("airbus.mes.stationtracker.Component", {
    metadata : {
        properties : {
        },
        //includes : []
    // array of css and/or javascript files that should be used in the component

    }

// manifestUrl : "component.json",
});

airbus.mes.stationtracker.Component.prototype.createContent = function() {
	
    airbus.mes.stationtracker.opeDetailCallStack = {sOrigin: false, arr : [] };
    airbus.mes.stationtracker.isDisplay = true;

    if (airbus.mes.stationtracker.oView === undefined) {
//        Initialization
        airbus.mes.stationtracker.util.ModelManager.init(sap.ui.getCore());

        // View on XML
        this.oView = sap.ui.view({
            id : "stationTrackerView",
            viewName : "airbus.mes.stationtracker.view.stationtracker",
            type : "XML",
        });

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleName : "airbus.mes.stationtracker.i18n.i18n"
         });
        this.oView.setModel(i18nModel, "StationTrackerI18n");
        // Set instant display for busy indicator
        this.oView.byId("stationtracker").setBusyIndicatorDelay(0);
        this.oView.byId("oswButton").setBusyIndicatorDelay(0);
        this.oView.byId("unplannedButton").setBusyIndicatorDelay(0);
        this.oView.setBusyIndicatorDelay(0);

        airbus.mes.stationtracker.oView = this.oView;

        this.oView.setModel(new sap.ui.model.json.JSONModel(),"productionGroupDisplay");
        this.oView.setModel(sap.ui.getCore().getModel("stationTrackerShift"),"stationTrackerShift");
        this.oView.setModel(sap.ui.getCore().getModel("productionGroupModel"), "productionGroupModel");
        this.oView.setModel(sap.ui.getCore().getModel("KPI"), "KPI");
        this.oView.setModel(sap.ui.getCore().getModel("KPIextraWork"), "KPIextraWork");
        this.oView.setModel(sap.ui.getCore().getModel("KPItaktAdherence"), "KPItaktAdherence");
        this.oView.setModel(sap.ui.getCore().getModel("KPIshiftStaffing"), "KPIshiftStaffing");
        this.oView.setModel(sap.ui.getCore().getModel("KPItaktEfficiency"), "KPItaktEfficiency");
        this.oView.setModel(sap.ui.getCore().getModel("KPIresolutionEfficiency"), "KPIresolutionEfficiency");
        this.oView.setModel(sap.ui.getCore().getModel("KPIdisruption"), "KPIdisruption");
        this.oView.setModel(sap.ui.getCore().getModel("KPIchartTaktAdherence"), "KPIchartTaktAdherence");
        this.oView.setModel(sap.ui.getCore().getModel("groupModel"), "groupModel");
        this.oView.setModel(sap.ui.getCore().getModel("affectationModel"), "affectationModel");
        this.oView.setModel(sap.ui.getCore().getModel("ressourcePoolModel"), "ressourcePoolModel");
        this.oView.setModel(sap.ui.getCore().getModel("SplitDetailModel"), "SplitDetailModel");
        this.oView.setModel(sap.ui.getCore().getModel("oswQuantityModel"), "oswQuantityModel");

    /*    airbus.mes.disruptiontracker.oView = this.odisruptiontrackerComp.oView;*/
        return this.oView;
    } else {
        return airbus.mes.stationtracker.oView;
    }
};

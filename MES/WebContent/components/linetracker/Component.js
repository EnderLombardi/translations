"use strict";
jQuery.sap.registerModulePath("airbus.mes.d3", "../lib/d3");
jQuery.sap.require("airbus.mes.d3.d3_3_5_17_min");
jQuery.sap.require("airbus.mes.linetracker.KPICharts.util.Formatter");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.base.Event");
jQuery.sap.require("airbus.mes.linetracker.util.ModelManager");
jQuery.sap.require("airbus.mes.linetracker.util.Formatter");
jQuery.sap.require("airbus.mes.linetracker.util.RoleManager");
// Declare the current Component
jQuery.sap.declare("airbus.mes.linetracker.Component");

// Extend current Component
sap.ui.core.UIComponent.extend("airbus.mes.linetracker.Component", {
    //manifestUrl : "Component.json",
    metadata : {

        properties : {
//            textButtonTo : "string",
//            buttonAction : "string"
        	 
        },
        /*includes : [ "../linetracker/css/KPICharts.css",
                     "../linetracker/css/customProgress.css",
                     "../linetracker/css/font-awesome.min.css",
                     "../linetracker/css/style.css",
                     "../linetracker/css/PhysicalStation.css"
                    ]*/
    }

});

// override the createContent function to return user interface
airbus.mes.linetracker.Component.prototype.createContent = function() {
	
    if (airbus.mes.linetracker.oView === undefined) {
    	airbus.mes.linetracker.util.ModelManager.init(sap.ui.getCore());
       /* airbus.mes.linetracker.util.RoleManager.init(this);
        airbus.mes.linetracker.util.ModelManager.init(this);*/
        /*this.factoryView = sap.ui.view({
            id : "idFactoryView",
            viewName : "airbus.mes.linetracker.FactoryView",
            type : sap.ui.core.mvc.ViewType.XML,
            height : "98%",
            width: "100%"
        });
        this.factoryView.setModel(sap.ui.getCore().getModel("newFactoryModel"),    "newFactoryModel");
        this.oView = sap.ui.view({
            id : "idMainView",
            viewName : "airbus.mes.linetracker.MainView",
            type : "XML",
        })*/
    	
    	this.oView = sap.ui.view({
    		id:"idLinetracker1", 
    		viewName:"airbus.mes.linetracker.Linetracker", 
//    		type:sap.ui.core.mvc.ViewType.XML
    		type : "XML"	
    	}); 
    	
        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl : "../components/linetracker/i18n/i18n.properties",
         });
        this.oView.setModel(sap.ui.getCore().getModel("stationDataModel"), "stationDataModel");
        this.oView.setModel(i18nModel, "i18n");
        this.oView.setModel(sap.ui.getCore().getModel("kpiI18n"), "kpiI18n");
        this.oView.setModel(sap.ui.getCore().getModel("KPItaktAdherence"), "KPItaktAdherence");
        this.oView.setModel(sap.ui.getCore().getModel("KPIshiftStaffing"), "KPIshiftStaffing");
        this.oView.setModel(sap.ui.getCore().getModel("KPIextraWork"), "KPIextraWork");
        this.oView.setModel(sap.ui.getCore().getModel("KPI"), "KPI");
        this.oView.setModel(sap.ui.getCore().getModel("KPIchartTaktAdherence"), "KPIchartTaktAdherence");
        this.oView.setModel(sap.ui.getCore().getModel("KPIdisruption"), "KPIdisruption");
        this.oView.setModel(sap.ui.getCore().getModel("KPIresolutionEfficiency"), "KPIresolutionEfficiency");
        this.oView.setModel(sap.ui.getCore().getModel("KPItaktEfficiency"), "KPItaktEfficiency");
        this.oView.setModel(sap.ui.getCore().getModel("KPIopenAnomalies"), "KPIopenAnomalies");
        airbus.mes.linetracker.oView = this.oView;

        return this.oView;


    } else {
        return airbus.mes.linetracker.oView;
    }
};

"use strict";

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
        }
    }

});

// override the createContent function to return user interface
airbus.mes.linetracker.Component.prototype.createContent = function() {

    if (airbus.mes.linetracker.oView === undefined) {
        airbus.mes.linetracker.util.RoleManager.init(this);
        airbus.mes.linetracker.util.ModelManager.init(this);
        this.factoryView = sap.ui.view({
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
        })

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl : "../components/linetracker/i18n/i18n.properties",
//            bundleLocale : "en" automatic defined by parameter sap-language
         });

        this.oView.setModel(i18nModel, "linetrackerI18n");
//        this.oView.setModel(sap.ui.getCore().getModel("newStationModel"),    "newStationModel");
//        this.oView.setModel(sap.ui.getCore().getModel("newFactoryModel"),    "newFactoryModel");
        this.oView.setModel(sap.ui.getCore().getModel("newStationModel"),    "newStationModel");
        this.oView.setModel(sap.ui.getCore().getModel("newProductionModel"), "newProductionModel");
        this.oView.setModel(sap.ui.getCore().getModel("PulseModel"), "PulseModel");
        airbus.mes.linetracker.oView = this.oView;

        return this.oView;


    } else {
        return airbus.mes.linetracker.oView;
    }
};

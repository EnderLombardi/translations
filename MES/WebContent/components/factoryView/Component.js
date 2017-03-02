"use strict";

jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.base.Event");
jQuery.sap.require("airbus.mes.factoryView.util.ModelManager");
jQuery.sap.require("airbus.mes.factoryView.util.Formatter");
jQuery.sap.require("airbus.mes.factoryView.util.RoleManager");
// Declare the current Component
jQuery.sap.declare("airbus.mes.factoryView.Component");

// Extend current Component
sap.ui.core.UIComponent.extend("airbus.mes.factoryView.Component", {
    //manifestUrl : "Component.json",
    metadata : {

        properties : {
//            textButtonTo : "string",
//            buttonAction : "string"
        }
    }

});

// override the createContent function to return user interface
airbus.mes.factoryView.Component.prototype.createContent = function() {

    if (airbus.mes.factoryView.oView === undefined) {
        airbus.mes.factoryView.util.RoleManager.init(this);
        airbus.mes.factoryView.util.ModelManager.init(this);
        this.factoryView = sap.ui.view({
            id : "idFactoryView",
            viewName : "airbus.mes.factoryView.FactoryView",
            type : sap.ui.core.mvc.ViewType.XML,
            height : "98%",
            width: "100%"
        });
        this.factoryView.setModel(sap.ui.getCore().getModel("newFactoryModel"),    "newFactoryModel");
        this.oView = sap.ui.view({
            id : "idMainView",
            viewName : "airbus.mes.factoryView.MainView",
            type : "XML",
        })

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleName : "airbus.mes.factoryView.i18n.i18n",
//            bundleLocale : "en" automatic defined by parameter sap-language
         });

        this.oView.setModel(i18nModel, "factoryViewI18n");
//        this.oView.setModel(sap.ui.getCore().getModel("newStationModel"),    "newStationModel");
//        this.oView.setModel(sap.ui.getCore().getModel("newFactoryModel"),    "newFactoryModel");
        this.oView.setModel(sap.ui.getCore().getModel("newStationModel"),    "newStationModel");
        this.oView.setModel(sap.ui.getCore().getModel("newProductionModel"), "newProductionModel");
        this.oView.setModel(sap.ui.getCore().getModel("PulseModel"), "PulseModel");
        airbus.mes.factoryView.oView = this.oView;

        return this.oView;


    } else {
        return airbus.mes.factoryView.oView;
    }
};

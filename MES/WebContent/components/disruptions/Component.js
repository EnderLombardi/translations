"use strict";
jQuery.sap.require("sap.ui.core.Component");
jQuery.sap.registerModulePath("airbus.mes.disruptions.i18n.i18n", "../components/disruptions/i18n/i18n");
jQuery.sap.require("airbus.mes.disruptions.ModelManager");
jQuery.sap.require("airbus.mes.disruptions.Formatter");
jQuery.sap.require("airbus.mes.disruptions.func");
jQuery.sap.require("airbus.mes.disruptions.AttachmentFile");
jQuery.sap.declare("airbus.mes.disruptions.Component");


sap.ui.core.Component.extend("airbus.mes.disruptions.Component", {
    metadata : {
        properties : {},
    }

});

airbus.mes.disruptions.Component.prototype.createContent = function() {

//    if (airbus.mes.disruptionslist.oView === undefined) {
////        Initialization
//        airbus.mes.disruptions.ModelManager.init(sap.ui.getCore());
//
//
//        this.oView = {};
//
//
//        this.oView = sap.ui.view({
//            id : "ViewDisruptionView",
//            viewName : "airbus.mes.disruptionslist.ViewDisruption",
//            type : "XML",
//            height:"100%"
//        });
//
//        var i18nModel = new sap.ui.model.resource.ResourceModel({
//            bundleName : "airbus.mes.disruptions.i18n.i18n"
//        });
//
//
//        this.oView.setModel(i18nModel, "i18nModel");
//
//        airbus.mes.disruptionslist.oView = this.oView;
//
//        // Model for disruptionslist details
//        this.oView.setModel(sap.ui.getCore().getModel("operationDisruptionsModel"),"operationDisruptionsModel");
//        return this.oView;
//
//    } else {
//        return airbus.mes.disruptionslist.oView;
//    }
};

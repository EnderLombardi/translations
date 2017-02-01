"use strict";
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.disruptiontracker.util.Formatter");
jQuery.sap.require("airbus.mes.disruptiontracker.ModelManager");


if (jQuery.sap.getObject("airbus.mes.disruptions.Component") === undefined) {
	jQuery.sap.registerModulePath("airbus.mes.disruptions", "../components/disruptions");
	sap.ui.getCore().createComponent({name : "airbus.mes.disruptions"});
}
jQuery.sap.require("airbus.mes.disruptions.ModelManager");


jQuery.sap.declare("airbus.mes.disruptiontracker.Component");

sap.ui.core.UIComponent.extend("airbus.mes.disruptiontracker.Component", {
    metadata : {
        properties : {}
    }

});

airbus.mes.disruptiontracker.Component.prototype.createContent = function() {

    if (airbus.mes.disruptiontracker.oView === undefined) {
        //    Initialization
        airbus.mes.disruptiontracker.ModelManager.init(sap.ui.getCore());
        airbus.mes.disruptions.ModelManager.init(sap.ui.getCore());

        // View on XML
        this.oView = sap.ui.view({
            id : "disruptiontrackerView",
            viewName : "airbus.mes.disruptiontracker.disruptions",
            type : "XML",
        })

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleName : "airbus.mes.disruptiontracker.i18n.i18n"
         });
        this.oView.setModel(i18nModel, "disruptiontrackerI18n");
        airbus.mes.disruptiontracker.oView = this.oView


        //Model for disruptions list data in table
        this.oView.setModel(sap.ui.getCore().getModel("disruptionsTrackerModel"),"disruptionsTrackerModel");

        //Model Station Names
        this.oView.setModel(sap.ui.getCore().getModel("plantModel"), "plantModel");


        return this.oView;

    } else {
        return airbus.mes.disruptiontracker.oView;
    }
};

"use strict";
jQuery.sap.require("sap.ui.core.UIComponent");
//jQuery.sap.require("airbus.mes.disruptionkpi.util.Formatter");
jQuery.sap.require("airbus.mes.disruptionkpi.ModelManager");

jQuery.sap.declare("airbus.mes.disruptionkpi.Component");

sap.ui.core.UIComponent.extend("airbus.mes.disruptionkpi.Component", {
    metadata : {
        properties : {},
        //global.css already included in components\settings\manifest.json so no need to include it here
    }

});

airbus.mes.disruptionkpi.Component.prototype.createContent = function() {

    if (airbus.mes.disruptionkpi.oView === undefined) {
//        Initialization
        airbus.mes.disruptionkpi.ModelManager.init(sap.ui.getCore());

        // View on XML
        this.oView = sap.ui.view({
            id : "disruptionKPIView",
            viewName : "airbus.mes.disruptionkpi.disruptionKPIChart",
            type : "XML",
        })

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleName : "airbus.mes.disruptionkpi.i18n.i18n"
         });
        this.oView.setModel(i18nModel, "i18nModel");
        airbus.mes.disruptionkpi.oView = this.oView


        //Model for disruptionKPI Attributes vs Time Lost Chart
        this.oView.setModel(sap.ui.getCore().getModel("TimeLostperAttribute"),"TimeLostperAttribute");

        //Model Station Names
        this.oView.setModel(sap.ui.getCore().getModel("plantModel"), "plantModel");

        return this.oView;
    } else {
        return airbus.mes.disruptionkpi.oView;
    }
};

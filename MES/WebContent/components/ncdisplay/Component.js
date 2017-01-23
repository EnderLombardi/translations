"use strict";

jQuery.sap.registerModulePath("airbus.mes.ncdisplay", "../components/ncdisplay");
jQuery.sap.require("airbus.mes.ncdisplay.util.ModelManager");
jQuery.sap.declare("airbus.mes.ncdisplay.Component");

sap.ui.core.UIComponent.extend("airbus.mes.ncdisplay.Component", {
    metadata : {
        properties : { },
    }
});

airbus.mes.ncdisplay.Component.prototype.createContent = function() {

    if (airbus.mes.ncdisplay.oView === undefined) {

        // Initialize ModelManager and load needed file
        airbus.mes.ncdisplay.util.ModelManager.init(sap.ui.getCore());

        // View on XML
        this.oView = sap.ui.view({
            id : "ncdisplayView",
            viewName : "airbus.mes.ncdisplay.view.ncdisplay",
            type : "XML",
            height:"auto"
        })
        airbus.mes.ncdisplay.oView = this.oView;

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleName : "airbus.mes.ncdisplay.i18n.i18n"
        });

        this.oView.setModel(i18nModel, "i18ncdisplaylinksModel");

        return this.oView;
    } else {

        return airbus.mes.ncdisplay.oView;
    }

};

"use strict";

jQuery.sap.registerModulePath("airbus.mes.scanner", "../components/scanner");
jQuery.sap.require("airbus.mes.scanner.util.ModelManager");
jQuery.sap.require("airbus.mes.scanner.customControl.scannerBox");
jQuery.sap.declare("airbus.mes.scanner.Component");

sap.ui.core.UIComponent.extend("airbus.mes.scanner.Component", {
    metadata : {
        properties : { },
    }
});

airbus.mes.scanner.Component.prototype.createContent = function() {
    if (airbus.mes.scanner.oView === undefined) {

        // Initialize ModelManager and load needed file
        airbus.mes.scanner.util.ModelManager.init(sap.ui.getCore());

        // View on XML
        this.oView = new airbus.mes.scanner.customControl.scannerBox();
        airbus.mes.scanner.oView = this.oView;

//        var i18nModel = new sap.ui.model.resource.ResourceModel({
//            bundleName : "airbus.mes.scanner.i18n.i18n"
//        });

//        this.oView.setModel(i18nModel, "i18scannerlinksModel");

        return this.oView;
    } else {

        return airbus.mes.scanner.oView;
    }

};

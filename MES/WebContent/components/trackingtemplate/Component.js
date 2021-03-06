"use strict";

jQuery.sap.registerModulePath("airbus.mes.trackingtemplate", "../components/trackingtemplate");
jQuery.sap.require("airbus.mes.trackingtemplate.util.ModelManager");
jQuery.sap.require("airbus.mes.trackingtemplate.util.Formatter");

jQuery.sap.declare("airbus.mes.trackingtemplate.Component");

sap.ui.core.UIComponent.extend("airbus.mes.trackingtemplate.Component", {
    metadata : {
        properties : { },
    }
});

airbus.mes.trackingtemplate.Component.prototype.createContent = function() {

    if (airbus.mes.trackingtemplate.oView === undefined) {

        // Initialize ModelManager and load needed file
        airbus.mes.trackingtemplate.util.ModelManager.init(sap.ui.getCore());    	
    	
        // View on XML
        this.oView = sap.ui.view({
            id : "trackingtemplateView",
            viewName : "airbus.mes.trackingtemplate.view.trackingtemplate",
            type : "XML",
            height:"auto"
        })
        airbus.mes.trackingtemplate.oView = this.oView;

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleName : "airbus.mes.trackingtemplate.i18n.i18n"
        });
        this.oView.setModel(i18nModel, "i18n");
        
        return this.oView;
    } else {
        return airbus.mes.trackingtemplate.oView;
    }

};

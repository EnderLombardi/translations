/**
 * @fileOverview Define the docviewer component.
 * @module docviewer.Component
 * @version 1.0.0
 */
"use strict";

jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.registerModulePath("airbus.mes.docviewer", "../components/docviewer");
//jQuery.sap.require("airbus.mes.docviewer.Formatter");
jQuery.sap.require("airbus.mes.docviewer.ModelManager");


/**
 * @extends sap.ui.core.UIComponent
 * @memberOf sap.ui.core.UIComponent
 */
sap.ui.core.UIComponent.extend("airbus.mes.docviewer.Component", {
    metadata : {
        properties : {},
        includes : [ "../../lib/pdftron/WebViewer.min.js",
                     "../lib/pdftron/html5/ControlUtils.js" ]
    },
});

/**
 * Create the view corresponding to the docviewer component
 * @returns {sap.ui.view} view of the docviewer component
 */
airbus.mes.docviewer.Component.prototype.createContent = function() {

    if (airbus.mes.docviewer.oView === undefined) {
        //    View on XML
        this.oView = sap.ui.view({
            id : "docviewerView",
            viewName : "airbus.mes.docviewer.display",
            type : "XML",
            height : "100%"

        }).addStyleClass("absolutePosition");
        airbus.mes.docviewer.oView = this.oView;

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl : "../components/docviewer/i18n/i18n.properties"
         });


        return this.oView;

    } else {
        return airbus.mes.docviewer.oView;
    }

};


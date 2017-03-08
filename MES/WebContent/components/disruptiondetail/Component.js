"use strict";
jQuery.sap.require("sap.ui.core.UIComponent");

if (jQuery.sap.getObject("airbus.mes.disruptions") === undefined) {
	jQuery.sap.registerModulePath("airbus.mes.disruptions", "../components/disruptions");
	jQuery.sap.require("airbus.mes.disruptions.ModelManager");
	jQuery.sap.require("airbus.mes.disruptions.Formatter");
	jQuery.sap.require("airbus.mes.disruptions.func");
	jQuery.sap.require("airbus.mes.disruptions.AttachmentFile");
	jQuery.sap.registerModulePath("airbus.mes.disruptions.i18n.i18n", "../components/disruptions/i18n/i18n");
	jQuery.sap.registerModulePath("airbus.mes.disruptions.fragment", "../components/disruptions/fragment");
}


jQuery.sap.declare("airbus.mes.disruptiondetail.Component");

sap.ui.core.UIComponent.extend("airbus.mes.disruptiondetail.Component", {
    metadata : {
        properties : {}
    }

});

airbus.mes.disruptiondetail.Component.prototype.createContent = function() {

    if (airbus.mes.disruptiondetail.oView === undefined) {
        //    Initialization
        airbus.mes.disruptions.ModelManager.init(sap.ui.getCore());

        // View on XML
        this.oView = sap.ui.view({
            id : "disruptionDetailView",
            viewName : "airbus.mes.disruptiondetail.disruptionDetail",
            type : "XML",
            height:"100%"
        });

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleName : "airbus.mes.disruptions.i18n.i18n"
        });
        this.oView.setModel(i18nModel, "i18nModel");
        airbus.mes.disruptiondetail.oView = this.oView

        this.oView.setModel(sap.ui.getCore().getModel("DisruptionDetailModel"),"DisruptionDetailModel");
        this.oView.setModel(sap.ui.getCore().getModel("disruptionCategoryModel"),"disruptionCategoryModel");
        this.oView.setModel(sap.ui.getCore().getModel("disruptionRsnRespGrp"),"disruptionRsnRespGrp");
        this.oView.setModel(sap.ui.getCore().getModel("disruptionResolverModel"),"disruptionResolverModel");

        return this.oView;

    } else {
        return airbus.mes.disruptiondetail.oView;
    }
};

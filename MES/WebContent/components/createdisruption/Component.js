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
};


jQuery.sap.declare("airbus.mes.createdisruption.Component");

sap.ui.core.UIComponent.extend("airbus.mes.createdisruption.Component", {
    metadata : {
        properties : {},
    }

});

airbus.mes.createdisruption.Component.prototype.createContent = function() {

    if (airbus.mes.createdisruption.oView === undefined) {
//        Initialization
        airbus.mes.disruptions.ModelManager.init(sap.ui.getCore());
        airbus.mes.disruptions.AttachmentFile.init(sap.ui.getCore());


        this.oView = {};


        this.oView = sap.ui.view({
            id : "createDisruptionView",
            viewName : "airbus.mes.createdisruption.CreateDisruption",
            type : "XML",
            height:"100%"
        });

        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleName : "airbus.mes.disruptions.i18n.i18n"
        });


        this.oView.setModel(i18nModel, "i18nModel");
        
      /*  if(sap.ui.Device.system.desktop)
        	this.oView.disruptionDetail.setModel(i18nModel, "i18nModel");*/

        airbus.mes.createdisruption.oView = this.oView;

        //Model for custom data of edit disruption
        this.oView.setModel(sap.ui.getCore().getModel("DisruptionDetailModel"),"DisruptionDetailModel");

        //Model for Material List
        this.oView.setModel(sap.ui.getCore().getModel("MaterialListModel"),"MaterialListModel");

        //Model for JigTool List
        this.oView.setModel(sap.ui.getCore().getModel("JigtoolListModel"),"JigtoolListModel");
      
        //Model for disruptionCategoryModel
        this.oView.setModel(sap.ui.getCore().getModel("disruptionCategoryModel"),"disruptionCategoryModel");
          
        //Model for disruption reason and responsible group
        this.oView.setModel(sap.ui.getCore().getModel("disruptionRsnRespGrp"),"disruptionRsnRespGrp");
          
        //Model for disruption resolver names
        this.oView.setModel(sap.ui.getCore().getModel("disruptionResolverModel"),"disruptionResolverModel");

        return this.oView;

    } else {
        return airbus.mes.createdisruption.oView;
    }
};

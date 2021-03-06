"use strict";

jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.disruptions.ModelManager");
jQuery.sap.require("airbus.mes.disruptions.Formatter");
jQuery.sap.require("airbus.mes.disruptions.func");
jQuery.sap.require("airbus.mes.disruptions.AttachmentManager");


jQuery.sap.declare("airbus.mes.disruptions.Component");

sap.ui.core.UIComponent.extend("airbus.mes.disruptions.Component", {
    metadata : {
        properties : {},
        //global.css already included in components\settings\manifest.json so no need to include it here
    }

});

airbus.mes.disruptions.Component.prototype.createContent = function() {

    if (airbus.mes.disruptions.oView === undefined) {
//        Initialization
        airbus.mes.disruptions.ModelManager.init(sap.ui.getCore());


        this.oView = {};


        this.oView.viewDisruption = sap.ui.view({
            id : "ViewDisruptionView",
            viewName : "airbus.mes.disruptions.ViewDisruption",
            type : "XML",
            height:"100%"
        });

        this.oView.createDisruption = sap.ui.view({
            id : "createDisruptionView",
            viewName : "airbus.mes.disruptions.CreateDisruption",
            type : "XML",
            height:"100%"
        });
        
        
     

        
       /*if(sap.ui.Device.system.desktop){
	       this.oView.disruptionDetail = sap.ui.view({
	            id : "disruptionDetailView",
	            viewName : "airbus.mes.disruptions.disruptionDetail",
	            type : "XML",
	            height:"100%"
	        })
        }
        */
        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleName : "airbus.mes.disruptions.i18n.i18n"
        });


        this.oView.viewDisruption.setModel(i18nModel, "i18nModel");
        this.oView.createDisruption.setModel(i18nModel, "i18nModel");
        
      /*  if(sap.ui.Device.system.desktop)
        	this.oView.disruptionDetail.setModel(i18nModel, "i18nModel");*/

        airbus.mes.disruptions.oView = this.oView;

        // Model for Disruptions details
        this.oView.viewDisruption.setModel(sap.ui.getCore().getModel("operationDisruptionsModel"),"operationDisruptionsModel");

        //Model for custom data of edit disruption
        this.oView.createDisruption.setModel(sap.ui.getCore().getModel("DisruptionDetailModel"),"DisruptionDetailModel");

        //Model for Material List
        this.oView.createDisruption.setModel(sap.ui.getCore().getModel("MaterialListModel"),"MaterialListModel");

        //Model for JigTool List
        this.oView.createDisruption.setModel(sap.ui.getCore().getModel("JigtoolListModel"),"JigtoolListModel");
      
        //Model for disruptionCategoryModel
        this.oView.createDisruption.setModel(sap.ui.getCore().getModel("disruptionCategoryModel"),"disruptionCategoryModel");
          
        //Model for disruption reason and responsible group
        this.oView.createDisruption.setModel(sap.ui.getCore().getModel("disruptionRsnRespGrp"),"disruptionRsnRespGrp");
          
        //Model for disruption resolver names
        this.oView.createDisruption.setModel(sap.ui.getCore().getModel("disruptionResolverModel"),"disruptionResolverModel");

        /******
         * set models on disruption Detail Page MES V1.5
         */
        /*if(sap.ui.Device.system.desktop){
        	this.oView.disruptionDetail.setModel(sap.ui.getCore().getModel("DisruptionDetailModel"),"DisruptionDetailModel");
        	this.oView.disruptionDetail.setModel(sap.ui.getCore().getModel("MaterialListModel"),"MaterialListModel");
        	this.oView.disruptionDetail.setModel(sap.ui.getCore().getModel("JigtoolListModel"),"JigtoolListModel");
        	this.oView.disruptionDetail.setModel(sap.ui.getCore().getModel("disruptionCategoryModel"),"disruptionCategoryModel");
        	this.oView.disruptionDetail.setModel(sap.ui.getCore().getModel("disruptionRsnRespGrp"),"disruptionRsnRespGrp");
        	this.oView.disruptionDetail.setModel(sap.ui.getCore().getModel("disruptionResolverModel"),"disruptionResolverModel");
        }*/
/*        
        if (airbus.mes.disruptiondetail === undefined || airbus.mes.disruptiondetail.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.disruptiondetail", "../components/disruptiondetail");
            sap.ui.getCore().createComponent({ name: "airbus.mes.disruptiondetail", });
            this.oView.disruptiondetail = airbus.mes.disruptiondetail.oView;
            nav.addPage(airbus.mes.disruptions.oView.disruptiondetail);
        }
        */
        return this.oView.viewDisruption;

    } else {
        return airbus.mes.disruptions.oView;
    }
};

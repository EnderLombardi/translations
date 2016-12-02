"use strict";
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("airbus.mes.resourcepool.util.ModelManager");
jQuery.sap.require("airbus.mes.resourcepool.util.Formatter");

sap.ui.core.UIComponent.extend("airbus.mes.resourcepool.Component", {
    metadata : {
        properties : {},
        includes : [ "../../Sass/global.css" ]

    },
});

airbus.mes.resourcepool.Component.prototype.createContent = function() {

    if (airbus.mes.resourcepool.oView === undefined) {
        // Initialization
        airbus.mes.resourcepool.util.ModelManager.init(sap.ui.getCore());

        //load User View
        this.UserView = sap.ui.view({
            id : "idUsersView",
            viewName : "airbus.mes.resourcepool.views.UsersView",
            type : sap.ui.core.mvc.ViewType.XML,
            height : "97%",
            width: "auto"
        });


        //load WorkCenter View
        this.WorkCenterView = sap.ui.view({
            id : "idWorkCenterView",
            viewName : "airbus.mes.resourcepool.views.WorkCenterView",
            type : sap.ui.core.mvc.ViewType.XML,
            height : "97%",
            width: "auto"
        });

        //load Shift View
        this.ShiftView = sap.ui.view({
            id : "idShiftView",
            viewName : "airbus.mes.resourcepool.views.ShiftView",
            type : sap.ui.core.mvc.ViewType.XML,
            height : "97%",
            width: "auto"
        });

        // View on XML
        this.oView = sap.ui.view({
            id : "resourcePool",
            viewName : "airbus.mes.resourcepool.views.Main",
            type : "XML",
            height : "100%"

        }).addStyleClass("absolutePosition");
        airbus.mes.resourcepool.oView = this.oView;


        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl : "../components/resourcepool/i18n/i18n.properties",
         });

        // Local Model
        this.oView.setModel(i18nModel, "i18nModel");
        this.oView.setModel(sap.ui.getCore().getModel("ValueHelpModel"), "ValueHelpModel");
        /*this.oView.setModel(sap.ui.getCore().getModel("AvailableUsersModel"), "AvailableUsersModel");
        this.oView.setModel(sap.ui.getCore().getModel("AssignedUsersModel"), "AssignedUsersModel");
        this.oView.setModel(sap.ui.getCore().getModel("AvailableWCModel"), "AvailableWCModel");
        this.oView.setModel(sap.ui.getCore().getModel("AssignedWCModel"), "AssignedWCModel");
        this.oView.setModel(sap.ui.getCore().getModel("AvailableShiftModel"), "AvailableShiftModel");*/
        this.oView.setModel(sap.ui.getCore().getModel("ResourcePoolDetailModel"), "ResourcePoolDetailModel");

        return this.oView;

    } else {
        return airbus.mes.resourcepool.oView;
    }

};


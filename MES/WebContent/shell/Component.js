"use strict";

jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.model.resource.ResourceModel");
jQuery.sap.require("airbus.mes.shell.ModelManager");
jQuery.sap.require("airbus.mes.shell.util.Formatter");
jQuery.sap.require("airbus.mes.shell.util.navFunctions");
jQuery.sap.require("airbus.mes.shell.ModelManager");
jQuery.sap.require("airbus.mes.shell.RoleManager");
jQuery.sap.require("airbus.mes.shell.UserImageManager");
jQuery.sap.require("airbus.mes.shell.AutoRefreshManager");
jQuery.sap.require("airbus.mes.shell.AutoRefreshConfig");
jQuery.sap.require("airbus.mes.shell.busyManager");

jQuery.sap.declare("airbus.mes.shell.Component");

sap.ui.core.UIComponent.extend("airbus.mes.shell.Component", {


    metadata : {
//        manifest: "json",
        properties : {}
    },

    oView:undefined,
});


airbus.mes.shell.Component.prototype.init = function() {
    sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

},

airbus.mes.shell.Component.prototype.createContent = function() {

    //    View on XML
    if (airbus.mes.shell.oView === undefined) {

        // Initialize ModelManager and load needed file
        airbus.mes.shell.ModelManager.init(sap.ui.getCore());

        // Initialize Role Manager
        airbus.mes.shell.RoleManager.init(sap.ui.getCore());


        this.oView = sap.ui.view({
            id : "globalNavView",
            viewName : "airbus.mes.shell.globalNavigation",
            type : "XML",
            height:"100%"

        }).addStyleClass("absolutePosition");

        if (window.location.hostname != "localhost") {

            this.oView.byId("localDELog").setVisible(false);

        }

        airbus.mes.shell.oView = this.oView;
        airbus.mes.shell.settingPopup = sap.ui.xmlfragment("airbus.mes.shell.settingPopover", airbus.mes.shell.oView.getController());
       
        this.oView.setModel(sap.ui.getCore().getModel("userDetailModel"),    "userDetailModel");
        this.oView.setModel(sap.ui.getCore().getModel("ShellI18n"), "ShellI18n");
        this.oView.setModel(sap.ui.getCore().getModel("userSettingModel"),    "userSettingModel");
                
        return this.oView;

    } else {

        return airbus.mes.shell.oView;
    }
};


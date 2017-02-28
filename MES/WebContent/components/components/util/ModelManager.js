"use strict";
jQuery.sap.declare("airbus.mes.components.util.ModelManager")

airbus.mes.components.util.ModelManager = {

    urlModel : undefined,
    currentOperator : {
        'fname' : undefined,
        'lname' : undefined,
        'user_id' : undefined,
        'image' : undefined
    },

    dataSaveJson: [],
    jsonConvertedToXml: undefined,

    // variable for filter
    workOrder : "P",
    operation : "O",

    badgeReader:undefined,
    brOnMessageCallBack:function (data) {},

    colVisibilityComponents : ["componentsView--bomItemNbCol", "componentsView--operationNumberCol",
    "componentsView--materialTypeCol", "componentsView--materialDescriptionCol",
    "componentsView--storageLocationCol", "componentsView--fkbmCol", "componentsView--reqQtyCol", "componentsView--withdrawQtyCol",
    "componentsView--shortageCol", "componentsView--unitCol", "componentsView--serialNumberCol"],
    colVisibilityCommittedFitted : ["componentsView--bomItemNbCol", "componentsView--materialTypeCol", "componentsView--materialCol",
    //materialCol to display
    "componentsView--materialDescriptionCol", "componentsView--reqQtyCol", "componentsView--withdrawQtyCol",
    "componentsView--editableRowCom", "componentsView--editableRowFit"],

    init : function(core) {

        this.core = core;

        // Handle URL Model
        this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.components.config.url_config");

        //"componentsConfigModel",
        airbus.mes.shell.ModelManager.createJsonModel(core,["componentsWorkOrderDetail", "selectFilterModel"]);
        this.loadcomponentsWorkOrderDetail();
        this.loadselectFilterModel();
    },

    //load
    loadcomponentsWorkOrderDetail : function() {
        var oModel = sap.ui.getCore().getModel("componentsWorkOrderDetail");
        oModel.loadData(this.getcomponentsWorkOrderDetail(), null, false);
    },

    //get
    getcomponentsWorkOrderDetail : function() {
        var url = this.urlModel.getProperty("componentsWorkOrderDetail");
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$site", airbus.mes.components.oView.getController().getOwnerComponent().getSite());
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$workorder", airbus.mes.components.oView.getController().getOwnerComponent().getWorkOrder());
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$operation", "");        
        return url;
    },
    
    loadselectFilterModel : function() {
        var oModel = sap.ui.getCore().getModel("selectFilterModel");
        var url = this.urlModel.getProperty("selectFilterModel");
        oModel.loadData(url, null, false);
    }
};

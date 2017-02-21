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
    productionOrder : "P",
    operation : "O",

    badgeReader:undefined,
    brOnMessageCallBack:function (data) {},

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
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$site", airbus.mes.settings.ModelManager.site);
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$sfc", sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc);
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$operation", "");        
        return url;
    },
    loadselectFilterModel : function() {
        var oModel = sap.ui.getCore().getModel("selectFilterModel");
        var url = this.urlModel.getProperty("selectFilterModel");
        oModel.loadData(url, null, false);
    }
};

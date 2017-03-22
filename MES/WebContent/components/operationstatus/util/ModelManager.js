"use strict";

jQuery.sap.declare("airbus.mes.operationstatus.util.ModelManager");
airbus.mes.operationstatus.util.ModelManager = {


    urlModel: undefined,
    i18nModel: undefined,

    init: function (core) {

        var aModel = ["StatusWorkTracker"];

        airbus.mes.shell.ModelManager.createJsonModel(core, aModel);

        // Handle URL Model
        this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.operationstatus.config.url_config");
        this.getShopOrderOperation();
    },

    getShopOrderOperation: function () {
        var oViewModel = sap.ui.getCore().getModel("StatusWorkTracker");

        jQuery.ajax({
            type: 'get',
            url: this.getOperationstatusUrl("urlOperationstatus"),
            contentType: 'application/json',

            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                if (data.Rowsets.Rowset && data.Rowsets.Rowset[0].Row) {
                    data.Rowsets.Rowset[0].Row.forEach(function (el) {
                        if (el.RMA_STATUS_COLOR != "---") {
                            el.RMA_STATUS_COLOR = "1";
                        } else {
                            el.RMA_STATUS_COLOR = "0";
                        }
                    })
                }


                oViewModel.setData(data);
            },

            error: function (error, jQXHR) {
                jQuery.sap.log.info(error);
            }
        });
    },

    /***************************************************************************
    * Get URL for Operation Status
    **************************************************************************/
    getOperationstatusUrl: function (model) {
        var operationstatusUrl = this.urlModel.getProperty(model);
        var site = airbus.mes.settings.util.ModelManager.site;
        var ShopOrderNumber = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no;

        operationstatusUrl = airbus.mes.shell.ModelManager.replaceURI(
            operationstatusUrl, "$Site", site);
        operationstatusUrl = airbus.mes.shell.ModelManager.replaceURI(
            operationstatusUrl, "$ShopOrderNumber", ShopOrderNumber);
        operationstatusUrl = airbus.mes.shell.ModelManager.replaceURI(
            operationstatusUrl, "$program", airbus.mes.settings.util.ModelManager.program);
        

        return operationstatusUrl;
    },



};

"use strict";
jQuery.sap.declare("airbus.mes.components.util.ModelManager")

airbus.mes.components.util.ModelManager = {

    urlModel: undefined,
    dataSaveJson: [],
    jsonConvertedToXml: undefined,
    
    // variable for filter
    workOrder: "P",
    operation: "O",

    badgeReader: undefined,
    brOnMessageCallBack: function (data) { },

    colVisibilityComponents: ["componentsView--bomItemNbCol", "componentsView--operationNumberCol",
        "componentsView--materialTypeCol", "componentsView--materialDescriptionCol",
        "componentsView--storageLocationCol", "componentsView--fkbmCol", "componentsView--reqQtyCol", "componentsView--withdrawQtyCol",
        "componentsView--shortageCol", "componentsView--unitCol", "componentsView--serialNumberCol"],
    colVisibilityCommittedFitted: ["componentsView--bomItemNbCol", "componentsView--materialTypeCol", "componentsView--materialCol",
        "componentsView--materialDescriptionCol", "componentsView--reqQtyCol", "componentsView--withdrawQtyCol",
        "componentsView--editableRowCom", "componentsView--editableRowFit"],

    //creates json Model and handles url model
    init: function (core) {
        this.core = core;

        // Handle URL Model
        this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.components.config.url_config");

        //"componentsConfigModel",
        airbus.mes.shell.ModelManager.createJsonModel(core, ["componentsWorkOrderDetail", "selectFilterModel"]);
    },

    //load
    loadcomponentsWorkOrderDetail: function () {
        var oModel = sap.ui.getCore().getModel("componentsWorkOrderDetail");
        oModel.loadData(this.getcomponentsWorkOrderDetail(), null, false);
        try{
	        this.saveOldValue(oModel);
	        var row = oModel.oData.Rowsets.Rowset[0].Row;
	        this.replaceStepInputsWithoutValue(row);
        } catch(exception){
        	console.log(exception);
        }
    },
    saveOldValue : function(oModel) {    	
        var count = oModel.getData().Rowsets.Rowset[0].Row.length;
//      Keep old value
        for (var i = 0; i < count; i++) {
        	oModel.getData().Rowsets.Rowset[0].Row[i].Checked_Components_old = oModel.getData().Rowsets.Rowset[0].Row[i].Checked_Components;
        	oModel.getData().Rowsets.Rowset[0].Row[i].Fitted_Components_old = oModel.getData().Rowsets.Rowset[0].Row[i].Fitted_Components;
        }    	
    },
    
    //get
    getcomponentsWorkOrderDetail: function () {
        var url = this.urlModel.getProperty("componentsWorkOrderDetail");
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$site", airbus.mes.components.oView.getController().getOwnerComponent().getSite());
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$workorder", airbus.mes.components.oView.getController().getOwnerComponent().getWorkOrder());
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$operation", "");
        return url;
    },

    //replace "" values by a 0
    replaceStepInputsWithoutValue: function (row) {
        for (var i = 0; i < row.length; i++) {
            if (row[i].Checked_Components === "") {
                row[i].Checked_Components = 0;
            }
            if (row[i].Fitted_Components === "") {
                row[i].Fitted_Components = 0;
            }
        }
    },

    loadselectFilterModel: function () {
        var oModel = sap.ui.getCore().getModel("selectFilterModel");
        var url = this.urlModel.getProperty("selectFilterModel");
        oModel.loadData(url, null, false);
    },

    saveFittedComponent: function () {
        var oViewModel = sap.ui.getCore().getModel("jigToolsWorkOrderDetail");

        jQuery.ajax({
            type: 'post',
            async: false,
            url: this.urlModel.getProperty("componentsSaveFittedComponent"),
            contentType: 'application/json',
            data: JSON.stringify({
                "site": airbus.mes.components.oView.getController().getOwnerComponent().getSite(),
                "ERPSystem": airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].erp_system,
                "xmlPAPI": toto,
                "xmlJCO": titi
            }),

            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                if (typeof data != "object" || data === null) {
                    /* In case the tool list is empty, we receive "null" */
                    data = { toolInfoList: [] };
                }
                data.toolInfoList = data.toolInfoList || [];
                if (!Array.isArray(data.toolInfoList)) {
                    /* In case the tool list contain one element, we receive an object */
                    data.toolInfoList = [data.toolInfoList];
                }
                oViewModel.setData(data);
                oViewModel.refresh();
            },

            error: function (error, jQXHR) {
                console.log(error);
            }
        });

    },
};

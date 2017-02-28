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
    colVisibilityCommittedFitted : ["componentsView--bomItemNbCol", "componentsView--materialTypeCol",
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
    },
    saveFittedComponent : function() {
		
        var oViewModel = sap.ui.getCore().getModel("jigToolsWorkOrderDetail");

        jQuery.ajax({
            type : 'post',
            async : false,
            url : this.urlModel.getProperty("componentsSaveFittedComponent"),
            contentType : 'application/json',
            data : JSON.stringify({
                "site" : airbus.mes.components.oView.getController().getOwnerComponent().getSite(),
                "ERPSystem" : airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].erp_system,
                "xmlPAPI" : toto,
                "xmlJCO" : titi
            }),

            success : function(data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                if (typeof data != "object" || data === null) {
                	/* In case the tool list is empty, we receive "null" */
                	data = { toolInfoList : [] };
                }
                data.toolInfoList = data.toolInfoList || [];
                if (!Array.isArray(data.toolInfoList)) {
                	/* In case the tool list contain one element, we receive an object */
                    data.toolInfoList = [ data.toolInfoList ];
                }
                oViewModel.setData(data);
                oViewModel.refresh();
            },

            error : function(error, jQXHR) {
                console.log(error);
            }
        });
		
	},
};

"use strict";
jQuery.sap.declare("airbus.mes.operationdetail.ModelManager")

airbus.mes.operationdetail.ModelManager = {

    urlModel: undefined,
    currentOperator: {
        'fname': undefined,
        'lname': undefined,
        'user_id': undefined,
        'image': undefined
    },
    badgeReader: undefined,
    statusCheckBoxReasonCode: "",
    durationNeededForCalc: undefined,
    jsonConfirmationCheckList: undefined,
    brOnMessageCallBack:function (data) {},

    init: function (core) {

        // Handle URL Model
        this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.operationdetail.config.url_config");

        airbus.mes.shell.ModelManager.createJsonModel(core, ["reasonCodeModel"]);
    },

    /***************************************************************************
     * Show Message Toast
     **************************************************************************/
    messageShow: function (text, duration) {
        if (typeof duration == "undefined")
            duration = 3000;

        sap.m.MessageToast.show(text, {
            duration: duration,
            width: "25em",
            my: "center center",
            at: "center center",
            of: window,
            offset: "0 0",
            collision: "fit fit",
            onClose: null,
            autoClose: true,
            animationTimingFunction: "ease",
            animationDuration: 3000,
            closeOnBrowserNavigation: false
        });

    },

    /***************************************************************************
     * Set the Models for Reason Codes
     **************************************************************************/
    loadReasonCodeModel: function () {
        var oModel = sap.ui.getCore().getModel("reasonCodeModel");
        if (this.getReasonCodesURL() != undefined) {
            oModel.loadData(this.getReasonCodesURL(), null, false);
        }
    },
    getReasonCodesURL: function () {
        var urlReasonCodes = this.urlModel.getProperty("getReasonCodes");
        urlReasonCodes = airbus.mes.shell.ModelManager.replaceURI(
            urlReasonCodes, "$site", airbus.mes.settings.ModelManager.site);
        return urlReasonCodes;

    },

    /***************************************************************************
     * Get URL for Activate Operation
     **************************************************************************/
    getUrlStartOperation: function (data) {
        var urlStartOperation = this.urlModel.getProperty("startOperation");
        urlStartOperation = airbus.mes.shell.ModelManager
            .replaceURI(urlStartOperation, "$operation", data.operation_no);
        urlStartOperation = airbus.mes.shell.ModelManager
            .replaceURI(urlStartOperation, "$sfc", data.sfc);
        urlStartOperation = airbus.mes.shell.ModelManager
            .replaceURI(urlStartOperation, "$site",
            airbus.mes.settings.ModelManager.site);
        urlStartOperation = airbus.mes.shell.ModelManager
            .replaceURI(urlStartOperation, "$resource", "DEFAULT");

        return urlStartOperation;
    },
    getUrlConfirmationCheckList : function(){
        var urlConfirmationCheckList = this.urlModel.getProperty("confirmationCheckList");

        return urlConfirmationCheckList;
    },
    getDataConfirmationCheckList : function(){
        var getData;
        jQuery.ajax({
            url : airbus.mes.operationdetail.ModelManager.getUrlConfirmationCheckList(),
            async : false,
            error : function(xhr, status, error) {
                airbus.mes.operationdetail.ModelManager.messageShow(sMessageError);
            },
            success : function(result, status, xhr) {
                if(result.Rowsets.Rowset === undefined){
                    return;
                }else{
                    getData = result.Rowsets.Rowset[0].Row[0];
                }

            }
        });
        airbus.mes.operationdetail.ModelManager.jsonConfirmationCheckList = getData;
        return airbus.mes.operationdetail.ModelManager.jsonConfirmationCheckList;
    },
    /***************************************************************************
     * Get URL for Pause Operation
     **************************************************************************/
    getUrlPauseOperation: function (data) {
        var urlPauseOperation = this.urlModel.getProperty("pauseOperation");
        urlPauseOperation = airbus.mes.shell.ModelManager.replaceURI(urlPauseOperation, "$Operation", data.operation_no);
        urlPauseOperation = airbus.mes.shell.ModelManager.replaceURI(urlPauseOperation, "$Sfc", data.sfc);
        urlPauseOperation = airbus.mes.shell.ModelManager.replaceURI(urlPauseOperation, "$Site", airbus.mes.settings.ModelManager.site);
        urlPauseOperation = airbus.mes.shell.ModelManager.replaceURI(urlPauseOperation, "$Resource", "DEFAULT");
        return urlPauseOperation;
    },

    /***************************************************************************
     * Get URL for Operation Confirmation
     **************************************************************************/
    getConfirmationUrl: function (userId, password, confirmationType,
            percentConfirm, sfcStepRef, reasonCodeText, Mode, ID, pin, osw, statusReasonCode, erpSystem) {
        var totalPartialConfirmationUrl = this.urlModel
            .getProperty("operationConfirmatonUrl");
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "$userId", userId.toUpperCase());
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "$password", password);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "$confirmationType",
            confirmationType);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "$percentConfirm", percentConfirm);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "$sfcStepRef", sfcStepRef);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "$resonCodeText", reasonCodeText);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "$Mode", Mode);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "$ID", ID);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "$pin", pin);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "$osw", osw);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "$statusReasonCode", statusReasonCode);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "$erpSystem", erpSystem);

        return totalPartialConfirmationUrl;

    },


    confirmOperation: function (userId, password, confirmationType, percentConfirm, sfcStepRef, reasonCodeText, Mode, ID, pin, sMessageError, sMessageSuccess, osw, statusReasonCode, erpSystem) {
        var url = this.getConfirmationUrl(userId, password, confirmationType, percentConfirm, sfcStepRef, reasonCodeText, Mode, ID, pin, osw, statusReasonCode, erpSystem);
        var flagSuccess;
        jQuery
            .ajax({
                url: url,
                async: false,
                error: function (xhr, status, error) {
                    airbus.mes.operationdetail.ModelManager.messageShow(sMessageError);
                    flagSuccess = false;

                },
                success: function (data, status, xhr) {
                    flagSuccess = true;
                    flagSuccess = airbus.mes.operationdetail.ModelManager.ajaxMsgHandler(data, sMessageSuccess);
                }
            });
        return flagSuccess;
    },
    ajaxMsgHandler: function (data, Message) {
        var flagSuccess;
        var sMessage = "";

        if (data.Rowsets.FatalError != undefined) {

            airbus.mes.operationdetail.ModelManager
                .messageShow(data.Rowsets.FatalError);
            flagSuccess = false;


        } else if (data.Rowsets.Messages != undefined) {
            // Need to implement Server message
            airbus.mes.operationdetail.ModelManager
                .messageShow(data.Rowsets.Messages[0].Message)
            flagSuccess = false;
        } else if (data.Rowsets.Rowset != undefined) {
            // [0].Row[0].Message != undefined
            if (data.Rowsets.Rowset[0].Row[0].Message_Type != undefined) {
                // Check if message is in Message or Message_ID
                if (data.Rowsets.Rowset[0].Row[0].Message_ID !== undefined) {
                    sMessage = data.Rowsets.Rowset[0].Row[0].Message_ID;
                } else {
                    sMessage = data.Rowsets.Rowset[0].Row[0].Message;
                }

                airbus.mes.operationdetail.ModelManager.messageShow(airbus.mes.operationdetail.oView.getModel("i18n").getProperty(sMessage));
                if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {
                    flagSuccess = true;
                } else {
                    flagSuccess = false;
                }
            } else {
                airbus.mes.operationdetail.ModelManager.messageShow(Message);
                flagSuccess = false;
            }
        }
        return flagSuccess;
    },
};

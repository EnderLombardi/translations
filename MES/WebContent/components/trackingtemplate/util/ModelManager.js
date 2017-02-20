"use strict";

jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.declare("airbus.mes.trackingtemplate.util.ModelManager");
airbus.mes.trackingtemplate.util.ModelManager = {


    urlModel: undefined,
    //queryParams : jQuery.sap.getUriParameters(),

    i18nModel: undefined,
    operationType: undefined,
    fIsLoad: 0,
    timeMinR: undefined,
    firstTime: undefined,
    stationInProgress: {
        ShopOrderBO: undefined,
        RouterStepBO: undefined,
        ErpElement: undefined
    },

    //parameters from the settings component
    settings: undefined,
    showDisrupionBtnClicked: false, // button Disruption on Station Tracker clicked
    init: function (core) {

        var aModel = ["TrackingTemplate"];

        airbus.mes.shell.ModelManager.createJsonModel(core, aModel);

        // Handle URL Model
        this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.trackingtemplate.config.url_config");

    },

    refreshTrackingTemplateModel: function () {
        var oViewModel = sap.ui.getCore().getModel("TrackingTemplate");
        var reasonCodeModel = sap.ui.getCore().getModel("reasonCodeModel");
        this.loadTrackingTemplateData(oViewModel, "urltrackingtemplate");
        this.loadReasonCodeData(reasonCodeModel, "getReasonCodes");
    },

    loadTrackingTemplateModel: function () {
        this.refreshTrackingTemplateModel();
        airbus.mes.trackingtemplate.oView.oController.hideCommentBox();
        airbus.mes.trackingtemplate.oView.oController.cleanAfterAddingNotes();
    },

    loadTrackingTemplateData: function (oViewModel, model) {

        jQuery.ajax({
            type: 'get',
            url: this.getTrackingTemplateUrl(model),
            contentType: 'application/json',

            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }

                if (data.Rowsets.Rowset[0] && data.Rowsets.Rowset[0].Row) {
                    data.Rowsets.Rowset[0].Row = airbus.mes.trackingtemplate.util.ModelManager.sortArrayByOperationAndDate(data.Rowsets.Rowset[0].Row);
                }

                oViewModel.setData(data);

            },

            error: function (error, jQXHR) {
                jQuery.sap.log.info(error);
            }
        });
    },

    sortArrayByOperationAndDate: function (array) {

        var index, len, previousRow, regex;

        regex = /11016386-([^,]*)/;
        
        //we order the array by grouping the items by operation (beginning string of Production_Content_GBO)
        array.sort(function (a, b) {
            console.log(regex.exec(a.Production_Context_GBO)[0]);
            if (regex.exec(a.Production_Context_GBO)[1] < regex.exec(b.Production_Context_GBO)[1]) 
                return -1;
            if (regex.exec(a.Production_Context_GBO)[1] > regex.exec(b.Production_Context_GBO)[1])
                return 1;
            return 0;
        });

        //we order the array by Created_Date_Time in each group of Production_Context_GBO
        array.sort(function (a, b) {
            if (a.Production_Context_GBO === b.Production_Context_GBO) {
                if (a.Created_Date_Time < b.Created_Date_Time) {
                    return 1;
                }
            }
            return 0;
        });

        index = 1;
        len = array.length;
        array[0].lastOperationNote = true;
        previousRow = array[0];

        //we add the attribute lastOperationNote to each item of the array. This attribute is set to true 
        //for each most recent confirmation note of a group of operation(Production_Context_GBO)
        for (; index < len; index += 1) {
            if (previousRow.Production_Context_GBO !== array[index].Production_Context_GBO) {
                array[index].lastOperationNote = true;
            } else {
                array[index].lastOperationNote = false;
            }
            previousRow = array[index];
        }

        return array;
    },

    loadReasonCodeData: function (oViewModel, model) {

        jQuery.ajax({
            type: 'get',
            url: this.getReasonCodeUrl(model),
            contentType: 'application/json',

            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                oViewModel.setData(data);
            },

            error: function (error, jQXHR) {
                jQuery.sap.log.info(error);
            }
        });
    },

    /***************************************************************************
     * Get URL for tracking template
     **************************************************************************/
    getTrackingTemplateUrl: function (model) {
        var trackingTemplateUrl = this.urlModel.getProperty(model);
        var site = airbus.mes.settings.ModelManager.site;
        trackingTemplateUrl = airbus.mes.shell.ModelManager.replaceURI(
            trackingTemplateUrl, "$site", airbus.mes.settings.ModelManager.site);
        trackingTemplateUrl = airbus.mes.shell.ModelManager.replaceURI(
            trackingTemplateUrl, "$workOrder", sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no);
        console.log(trackingTemplateUrl.toString());
        return trackingTemplateUrl;
    },
    /***************************************************************************
     * Get URL for reason code
     **************************************************************************/

    getReasonCodeUrl: function (model) {
        var reasonCodeUrl = this.urlModel.getProperty(model);
        reasonCodeUrl = airbus.mes.shell.ModelManager.replaceURI(
            reasonCodeUrl, "$site", airbus.mes.settings.ModelManager.site);
        console.log(reasonCodeUrl);
        return reasonCodeUrl;
    },

    /***************************************************************************
     * Get URL for sending note
     **************************************************************************/
    getSendNotesUrl: function (shopOrderNum, erpSystem, badgeID, description, reasonCodeText, password, userId) {
        var totalPartialConfirmationUrl = this.urlModel
            .getProperty("sendNotesUrl");
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "SHopOrderNumber", shopOrderNum);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "ERPSYstem", erpSystem);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "BadgeID", badgeID);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "Desciption", description);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "ReasonCode", reasonCodeText);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "password", password);
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "logon", userId.toUpperCase());

        return totalPartialConfirmationUrl;
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




};

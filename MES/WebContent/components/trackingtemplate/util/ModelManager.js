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

        this.loadTrackingTemplateModel();

    },

    loadTrackingTemplateModel: function () {
        var oViewModel = sap.ui.getCore().getModel("TrackingTemplate");
        var reasonCodeModel = sap.ui.getCore().getModel("reasonCodeModel");
        this.loadTrackingTemplateData(oViewModel, "urltrackingtemplate");
        this.loadReasonCodeData(reasonCodeModel, "getReasonCodes");
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
                oViewModel.setData(data);
            },

            error: function (error, jQXHR) {
                jQuery.sap.log.info(error);
            }
        });
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



};

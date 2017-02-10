"use strict";

jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.declare("airbus.mes.trackingtemplate.ModelManager");
airbus.mes.trackingtemplate.ModelManager = {


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

        airbus.mes.shell.ModelManager.createJsonModel(core,aModel);
        
        // Handle URL Model
        this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.trackingtemplate.config.url_config");

        this.loadTrackingTemplateModel();

    },

    loadTrackingTemplateModel: function () {
        var oViewModel = sap.ui.getCore().getModel("TrackingTemplate");
        jQuery.ajax({
            type: 'get',
            url: this.urlModel.getProperty("urltrackingtemplate"),
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



};

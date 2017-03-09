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

        var aModel = ["ConfirmationsNotes", "WONotes"];

        airbus.mes.shell.ModelManager.createJsonModel(core, aModel);

        // Handle URL Model
        this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.trackingtemplate.config.url_config");

    },

    /**
     * Refresh all the data of tracking template
     */
    refreshTrackingTemplateModel: function () {
        var oViewModel = sap.ui.getCore().getModel("ConfirmationsNotes");
        var woNotesModel = sap.ui.getCore().getModel("WONotes");
        var reasonCodeModel = sap.ui.getCore().getModel("reasonCodeModel");
        this.loadConfirmationsNotesData(oViewModel, "getConfirmationsNotes");
        this.loadReasonCodeData(reasonCodeModel, "getReasonCodes");
        this.loadWONotesData(woNotesModel, "getWorkOrderNotes");
    },

    /**
     * whenever user click on tab or send a note, it's call loadTrackingTemplateModel to refresh page and data
     */
    loadTrackingTemplateModel: function () {
        this.refreshTrackingTemplateModel();
        airbus.mes.trackingtemplate.oView.oController.uncheckedAllSelectedBox();
        airbus.mes.trackingtemplate.oView.oController.hideCommentBox();
        airbus.mes.trackingtemplate.oView.oController.cleanAfterAddingNotes();
        airbus.mes.trackingtemplate.oView.oController.cleanListFiles();
    },

    /**
     * Call the service to update confirmations notes data
     */
    loadConfirmationsNotesData: function (oViewModel, model) {
        airbus.mes.shell.busyManager.setBusy(airbus.mes.trackingtemplate.oView, "trackingtemplateView--confirmation_notes_panel");
        jQuery.ajax({
            type: 'get',
            url: this.getConfirmationsNotesUrl(model),
            contentType: 'application/json',
            async: false,
            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }

                if (data.Rowsets.Rowset[0] && data.Rowsets.Rowset[0].Row) {
                    data.Rowsets.Rowset[0].Row = airbus.mes.trackingtemplate.util.ModelManager.sortArrayByOperationAndDate(data.Rowsets.Rowset[0].Row);
                }

                oViewModel.setData(data);
                airbus.mes.trackingtemplate.oView.oController.initNotesList();
                airbus.mes.shell.busyManager.unsetBusy(airbus.mes.trackingtemplate.oView, "trackingtemplateView--confirmation_notes_panel");
            },

            error: function (error, jQXHR) {
                jQuery.sap.log.info(error);
                airbus.mes.shell.busyManager.unsetBusy(airbus.mes.trackingtemplate.oView, "trackingtemplateView--confirmation_notes_panel");
            }
        });
    },
    /**
     * Call the service to update  WO notes data
     */
    loadWONotesData: function (woNotesModel, model) {
        airbus.mes.shell.busyManager.setBusy(airbus.mes.trackingtemplate.oView, "trackingtemplateView--wo_notes_panel");
        jQuery.ajax({
            type: 'get',
            url: this.getConfirmationsNotesUrl(model),
            contentType: 'application/json',
            async: false,
            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                if (data.Rowsets.Rowset) {
                    var wonotes = data.Rowsets.Rowset[0].Row;
                    if (data.Rowsets.Rowset[1].Row && wonotes) {
                        airbus.mes.trackingtemplate.util.ModelManager.attachedDocumentToWoNotes(wonotes, data.Rowsets.Rowset[1].Row);
                        wonotes = wonotes.sort(airbus.mes.shell.util.Formatter.fieldComparator(['-Created_Date_Time']));
                        wonotes[0].lastOperationNote = true;
                    }
                }
                woNotesModel.setData(data);
                airbus.mes.shell.busyManager.unsetBusy(airbus.mes.trackingtemplate.oView, "trackingtemplateView--wo_notes_panel");
            },

            error: function (error, jQXHR) {
                jQuery.sap.log.info(error);
                airbus.mes.shell.busyManager.unsetBusy(airbus.mes.trackingtemplate.oView, "trackingtemplateView--wo_notes_panel");
            }
        });
    },


    /**
     * Function in order to link attached document to a WO notes
     */
    attachedDocumentToWoNotes: function (wonotes, attachedDocument) {
        wonotes = wonotes.sort(airbus.mes.shell.util.Formatter.fieldComparator(['Handle']));
        attachedDocument = attachedDocument.sort(airbus.mes.shell.util.Formatter.fieldComparator(['PRODUCTION_COMMENT']));
        var indexAttDoc, indexWONotes, lengthAttDoc, lengthWONotes;
        indexAttDoc = 0;
        indexWONotes = 0;
        lengthAttDoc = attachedDocument.length;
        lengthWONotes = wonotes.length;

        for (; indexAttDoc < lengthAttDoc; indexAttDoc += 1) {
            for (; indexWONotes < lengthWONotes; indexWONotes += 1) {
                wonotes[indexWONotes]["User_First_Name"] = wonotes[indexWONotes]["User_First_Name"].substring(0, 1);
                if (!wonotes[indexWONotes].attachedDocument) {
                    wonotes[indexWONotes].attachedDocument = [];
                }
                if (wonotes[indexWONotes].Handle === attachedDocument[indexAttDoc]['PRODUCTION_COMMENT']) {
                    wonotes[indexWONotes].attachedDocument.push(attachedDocument[indexAttDoc]);
                    break;
                }
            }
        }
    },

    /**
     * getOperationNumber
     */

    getOperationNumber: function (row) {
        row["User_First_Name"] = row["User_First_Name"].substring(0, 1);
        var regex = regex = /-([^,]*)/;
        if (regex.exec(row.OperationBO)) {
            var arrayOperationNumber = regex.exec(row.OperationBO)[1].split('-'); //return smth like : "1-0-0010" we split to get the last number array of length 3 here
            var operationNumber = arrayOperationNumber[arrayOperationNumber.length - 1]; //get the last number
            return operationNumber || '';
        }
    },

    /**
     * sort Array by operation and date
     */
    sortArrayByOperationAndDate: function (array) {

        var index, len, previousRow;
        array = array.sort(airbus.mes.shell.util.Formatter.fieldComparator(['OperationBO', '-Created_Date_Time']));
        index = 1;
        len = array.length;
        //we update the user first name to show only the first letter.
        previousRow = array[0];
        previousRow.lastOperationNote = true;
        previousRow.operationNumber = this.getOperationNumber(previousRow);
        this.getPercentage(previousRow, previousRow.Progress, previousRow.Duration);

        //we add the attribute lastOperationNote to each item of the array. This attribute is set to true 
        //for each most recent confirmation note of a group of operation(Production_Context_GBO)
        for (; index < len; index += 1) {
            //we update the user first name to show only the first letter. 
            array[index].operationNumber = this.getOperationNumber(array[index]);
            this.getPercentage(array[index], array[index].Progress, array[index].Duration);
            if (previousRow.OperationBO !== array[index].OperationBO) {
                array[index].lastOperationNote = true;
            } else {
                array[index].lastOperationNote = false;
            }
            previousRow = array[index];
        }
        return array;
    },

    /**
     * Calculate the percentage
     */
    getPercentage: function (obj, n1, n2) {
        if (n1 && n2) {
            obj.percentage = n1 / n2 * 100;
        }
    },
    /**
     * load reason code
    */
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
    getConfirmationsNotesUrl: function (model) {
        var trackingTemplateUrl = this.urlModel.getProperty(model);
        var site = airbus.mes.settings.ModelManager.site;
        trackingTemplateUrl = airbus.mes.shell.ModelManager.replaceURI(
            trackingTemplateUrl, "$site", site);
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
        // console.log(reasonCodeUrl);
        return reasonCodeUrl;
    },

    /***************************************************************************
     * Get URL for sending note
     **************************************************************************/
    getSendNotesUrl: function (shopOrderNum, erpSystem, badgeID, description, reasonCodeText, password, userId, site) {
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
        totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
            totalPartialConfirmationUrl, "$site", site);
        console.log(totalPartialConfirmationUrl.toString());
        return totalPartialConfirmationUrl;
    },

    /***************************************************************************
     * Request for sending note
     **************************************************************************/
    sendWONotes: function (shopOrderNum, erpSystem, badgeID, description, reasonCodeText, password, userId, site) {
        var sMessageSuccess;
        var sMessageError = 'Error during confirmation';
        jQuery
            .ajax({
                url: airbus.mes.trackingtemplate.util.ModelManager
                    .getSendNotesUrl(shopOrderNum, erpSystem, badgeID, description, reasonCodeText, password, userId, site),
                async: false,
                error: function (xhr, status, error) {
                    if (result.Rowsets.Rowset && result.Rowsets.Rowset[0].Row[0].Message) {
                        sMessageError = result.Rowsets.Rowset[0].Row[0].Message;
                    }
                    airbus.mes.trackingtemplate.util.ModelManager.messageShow(sMessageError);

                },
                success: function (result, status, xhr) {
                    if (result.Rowsets.Rowset && result.Rowsets.Rowset[0].Row) {
                        sMessageSuccess = result.Rowsets.Rowset[0].Row[0].Message;
                    } else {
                        sMessageSuccess = sMessageError;
                    }
                    //get handle for attached document
                    var handle = result.Rowsets.Rowset[0].Row[0].Production_Comment;
                    var userFromRequest = result.Rowsets.Rowset[0].Row[0].UserID;
                    if (userFromRequest.length) {
                        userId = userFromRequest;
                    };
                    //if we send  badgeID => UserID != null
                    //récupérer la reference du WO note. Non renvoyé par MII
                    airbus.mes.trackingtemplate.util.ModelManager.messageShow(sMessageSuccess);
                    if (result.Rowsets.Rowset[0].Row[0].Message_Type === 'S') {
                        airbus.mes.trackingtemplate.oView.oController.submitAttachedDocument(handle, userId);
                    }
                }
            });
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
     * Send POST attached document request
     **************************************************************************/
    attachDocument: function (site, referenceWO, fileName, fileBase64, userName) {
        jQuery.ajax({
            async: false,
            url: airbus.mes.trackingtemplate.util.ModelManager.getPostAttachedDocumentUrl(),
            dataType: "json",
            cache: false,
            contentType: 'application/json',
            type: 'post',
            data: JSON.stringify({
                "site": site,
                "type": "TT",
                "ref": referenceWO,
                "fileName": fileName,
                "fileDescript": "test MF",
                "fileBase64": fileBase64,
                "userName": userName
            })
            ,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
            },
            error: function (data, textStatus, jqXHR) {
                airbus.mes.trackingtemplate.oView.oController.cleanListFiles();
            }
        });
    },

    /***
     * return post url
     */
    getPostAttachedDocumentUrl: function () {
        return this.urlModel.getProperty("postAttachedDocument");
    },

};

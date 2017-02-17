"use strict";
sap.ui.controller("airbus.mes.trackingtemplate.controller.trackingtemplate", {
    /**
    * Apply a filter on the confirmation Notes List depending 
    * on the state of the checkbox 
    * (only not confirmed operation)
    * @param {Object} oEvent wich represent the event on press from the CheckBox last note
    */
    showOnlyLastConfirmationNote: function (oEvent) {
        var flag = oEvent.getSource().getSelected();
        var listConfirmationNotes = this.getView().byId("trackingtemplateView--confirmationNotes");
        var aFilters = [];

        //we had the filter only if the checkbox state is true.
        if (flag) {
            aFilters.push(new sap.ui.model.Filter({
                path: "STATE",
                test: function (oValue) {
                    if (oValue === "CONFIRMED") {
                        return true;
                    }
                    return false;
                }
            }));
        }
        //we apply the filter here
        listConfirmationNotes.getBinding("items").filter(aFilters);
    },

    /**
    * Show Comment Box to Add Comments
    */
    showCommentBox: function () {
        var commentBox = this.getView().byId("trackingtemplateView--commentBox");
        commentBox.setVisible(true);
    },

    /**
     * Hide Comment Box to Add Comments
     */
    hideCommentBox: function () {
        var commentBox = this.getView().byId("trackingtemplateView--commentBox");
        commentBox.setVisible(false);
        console.log(commentBox);
    },

    /**
     * Submit Disruption Comment
     * @param {Object} oEvent wich represent the event on press from the CheckBox last note
     */
    showOnlyLastWONote: function (oEvent) {
        var oViewModel = airbus.mes.trackingtemplate.oView.getModel("TrackingTemplate");
        oEvent.getSource().getSelected() ? oViewModel.setSizeLimit(1) : oViewModel.setSizeLimit(100);
        oViewModel.refresh(true);
    },

    /**
     * Hide Comment Box to Add Comments
     */
    printTrackingTemplate: function () {
        var ctrlString = "width=500px, height= 600px";
        var wind = window.open('', 'PrintWindow', ctrlString);
        var chart = document.getElementById('trackingtemplateView--listNotes').outerHTML;
        // wind.document.write('<html><head><title>Print it!</title>'
        // +'<link rel="stylesheet" type="text/css" href="../../../Sass/global.css">'
        // +'<link rel="stylesheet" type="text/css" href="../../../lib/dhtmlxscheduler/dhtmlxscheduler.css">'
        // +'<link rel="stylesheet" type="text/css" href="../../../lib/dhtmlxscheduler/dhtmlxscheduler_flat.css">'
        // +'</head><body>');
        wind.document.write(chart);
        // wind.document.write('</body></html>');
        wind.print();
        wind.close();
    },

    /**
     * Submit a comment 
     */
    submitComment: function () {

        if (!this._oUserConfirmationDialog) {

            this._oUserConfirmationDialog = sap.ui
                .xmlfragment(
                "airbus.mes.trackingtemplate.fragments.userConfirmation",
                this);

            this.getView().addDependent(
                this._oUserConfirmationDialog);
        }
        this._oUserConfirmationDialog.open();
    },

    onCancelConfirmation: function () {
        this._oUserConfirmationDialog.close();
    },

    onOKConfirmation: function () {
        // var attachmentFilesCollection = this.getView().byId('UploadCollection');
        // var collection = attachmentFilesCollection.getItems();
        // var size = collection.length;
        // var i = 0;
        // for (; i < size; i += 1) {
        //     console.log(collection[i].getAttributes());
        //     console.log(collection[i].getFileName());
        // }

        //work order number Param.1 SHopOrderNumber
        var shopOrderNum = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no;
        console.log(shopOrderNum);
        //ERPSystem Param.2 ERPSYstem
        var erpSystem = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].erp_system || ''
        //Param.3 BadgeID
        var badgeId = '';
        //Param.4 Desciption
        var textArea = this.getView().byId('commentArea');
        //Param.5 ReasonCode
        var reasonCode = this.getView().byId("reasonCodeSelectBox").getSelectedKey() || '';
        //Param.6 password
        var password = sap.ui.getCore().byId('passwordTckTmpltForConfirmation').getValue();
        //Param.7 logon
        var login = sap.ui.getCore().byId('userNameTckTmpltForConfirmation').getValue();

        var sMessageSuccess = this.getView().getModel("i18n")
            .getProperty("SuccessfulConfirmation");
        var sMessageError = this.getView().getModel("i18n")
            .getProperty("ErrorDuringConfirmation");

        console.log(airbus.mes.trackingtemplate.util.ModelManager
            .getSendNotesUrl(
            shopOrderNum, erpSystem, badgeId, textArea.getValue(), reasonCode, password, login
            ));
        jQuery
            .ajax({
                url: airbus.mes.trackingtemplate.util.ModelManager
                    .getSendNotesUrl(
                    shopOrderNum, erpSystem, badgeId, textArea.getValue(), reasonCode, password, login
                    ),
                async: false,
                error: function (xhr, status, error) {
                    airbus.mes.trackingtemplate.util.ModelManager.messageShow(sMessageError);
                },
                success: function (result, status, xhr) {
                    airbus.mes.trackingtemplate.util.ModelManager.messageShow(sMessageSuccess);
                    airbus.mes.trackingtemplate.util.ModelManager.loadTrackingTemplateModel();
                    this.cleanAfterAddingNotes();
                }
            });
        this._oUserConfirmationDialog.close();
    },

    replaceSendNotesURLWithParams: function () {
        url = this.urlModel.getProperty("sendNotes");
    },

    cleanAfterAddingNotes: function () {
        //if the view is ready yet, dont try to reset value
        if (airbus.mes.trackingtemplate.oView.byId('commentArea')) {
            //Param.4 Desciption
            airbus.mes.trackingtemplate.oView.byId('commentArea').setValue('');
            //Param.5 ReasonCode
            airbus.mes.trackingtemplate.oView.byId("reasonCodeSelectBox").setSelectedKey('');
        }
        if (sap.ui.getCore().byId('passwordTckTmpltForConfirmation')) {
            //Param.6 password
            sap.ui.getCore().byId('passwordTckTmpltForConfirmation').setValue('');
            //Param.7 logon
            sap.ui.getCore().byId('userNameTckTmpltForConfirmation').setValue('');
        }
    }


});
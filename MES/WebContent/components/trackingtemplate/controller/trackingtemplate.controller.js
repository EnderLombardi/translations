"use strict";
sap.ui.controller("airbus.mes.trackingtemplate.controller.trackingtemplate", {

    /**
    * Apply a filter on the confirmation Notes List and the WO Notes List
    * depending on the Production_Context_GBO name
    */
    onBeforeRendering: function () {
        var listConfirmationNotes = this.getView().byId("trackingtemplateView--confirmationNotes");
        var listWONotes = this.getView().byId("trackingtemplateView--listNotes");

        //we apply the filter here
        listConfirmationNotes.getBinding("items").filter(new sap.ui.model.Filter({
            path: "Production_Context_GBO",
            test: function (oValue) {
                return !oValue.startsWith("ShopOrderBO");
            }
        }));

        //we apply the filter here
        listWONotes.getBinding("items").filter(new sap.ui.model.Filter({
            path: "Production_Context_GBO",
            test: function (oValue) {
                return !oValue.startsWith("ShopOrderBO");
            }
        }));
    },

    /**
    * Apply a filter on the confirmation Notes List depending 
    * on the state of the checkbox 
    * (only not confirmed operation)
    */
    filterConfirmationNoteList: function () {
        // var flag = oEvent.getSource().getSelected();
        var listConfirmationNotes = this.getView().byId("trackingtemplateView--confirmationNotes");
        var showOnlyLastConfirmationNote = this.getView().byId("trackingtemplateView--showOnlyLastConfirmationNote").getSelected();
        var showOnlyConfirmedConfirmationNote = this.getView().byId("trackingtemplateView--showOnlyConfirmedConfirmationNote").getSelected();
        var aFilters = [];

        //we had the filter only if the checkbox state is true.
        if (showOnlyLastConfirmationNote) {
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
        if (showOnlyConfirmedConfirmationNote) {
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
        // var b = new Blob([this.getPrintHtml()], { type: 'text/html' }), uri = URL.createObjectURL(b), myPrintWindow;

        var ctrlString = "width=500px, height= 600px";
        // myPrintWindow = window.open(uri, 'PrintWindow', ctrlString);

        var wind = window.open('', 'PrintWindow', ctrlString);
        wind.document.write('<html><head><title>' + this.getPrintTitle() + '</title>'
            + '<link rel="stylesheet" type="text/css" href="../components/trackingtemplate/styles/trackingtemplatePrint.css">'
            + '</head><body>');
        if (this.getView().byId('trackingtemplateView--confirmation_notes_panel').getExpanded()) {
            wind.document.write(document.getElementById('trackingtemplateView--confirmation_notes_panel').outerHTML);
        }
        if (this.getView().byId('trackingtemplateView--wo_notes_panel').getExpanded()) {
            wind.document.write(document.getElementById('trackingtemplateView--wo_notes_panel').outerHTML);
        }

        wind.document.write('</body></html>');
        wind.document.addEventListener('load',
            setTimeout(function () {
                wind.print();
                wind.close();
            }, 1000), true);
    },

/**
 * Get print title
 */
getPrintTitle: function () {
    var operationDetail = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0]
    return operationDetail.wo_no + '-' + operationDetail.material_description + ' ' + operationDetail.original_start_time + '-' + operationDetail.original_end_time;
},

/**
 * Get html to print
 */
getPrintHtml: function () {
    var html = '<html><head>' + this.getCSS() + '<title>' + this.getPrintTitle() + '</title>'
        + '<link rel="stylesheet" type="text/css" href="../components/trackingtemplate/styles/trackingtemplatePrint.css">'
        + '</head><body>';
    if (this.getView().byId('trackingtemplateView--confirmation_notes_panel').getExpanded()) {
        html += document.getElementById('trackingtemplateView--confirmation_notes_panel').outerHTML;
    }
    if (this.getView().byId('trackingtemplateView--wo_notes_panel').getExpanded()) {
        html += document.getElementById('trackingtemplateView--wo_notes_panel').outerHTML;
    }
    html += '</body></html>';

    return html;

},

/**
 * Submit a comment 
 */
submitComment: function () {
    var sMessageError = this.getView().getModel("i18n")
        .getProperty("ErrorDuringConfirmation");
    if (airbus.mes.trackingtemplate.oView.byId("reasonCodeSelectBox").getSelectedKey()) {
        if (this.getView().byId('commentArea').getValue()) {
            if (!this._oUserConfirmationDialog) {

                this._oUserConfirmationDialog = sap.ui
                    .xmlfragment(
                    "airbus.mes.trackingtemplate.fragments.userConfirmation",
                    this);

                this.getView().addDependent(
                    this._oUserConfirmationDialog);
            }
            this._oUserConfirmationDialog.open();
        } else {
            var sMessageError = this.getView().getModel("i18n").getProperty("WriteSomething");
            airbus.mes.trackingtemplate.util.ModelManager.messageShow(sMessageError);
        }
    } else {
        var sMessageError = this.getView().getModel("i18n").getProperty("ChooseReasonCode");
        airbus.mes.trackingtemplate.util.ModelManager.messageShow(sMessageError);
    }
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
                airbus.mes.trackingtemplate.oView.oController.cleanAfterAddingNotes();
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
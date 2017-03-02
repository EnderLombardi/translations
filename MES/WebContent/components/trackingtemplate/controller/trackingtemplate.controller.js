"use strict";
sap.ui.controller("airbus.mes.trackingtemplate.controller.trackingtemplate", {

    attachDocument: [],
    
    /**
    * Apply a filter on the confirmation Notes List and the WO Notes List
    * depending on the Production_Context_GBO name
    */
    initNotesList: function () {
        var listConfirmationNotes = this.getView().byId("trackingtemplateView--confirmationNotes");
        var listWONotes = this.getView().byId("trackingtemplateView--listNotes");

        //we apply the filter here
        listConfirmationNotes.getBinding("items").filter(new sap.ui.model.Filter({
            path: "Production_Context_GBO",
            test: function (oValue) {
                return !oValue.toUpperCase().startsWith("SHOPORDERBO");
            }
        }));

        //we apply the filter here
        listWONotes.getBinding("items").filter(new sap.ui.model.Filter({
            path: "Production_Context_GBO",
            test: function (oValue) {
                return oValue.toUpperCase().startsWith("SHOPORDERBO");
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
        var showOnlyNotConfirmedConfirmationNote = this.getView().byId("trackingtemplateView--showOnlyNotConfirmedConfirmationNote").getSelected();
        var aFilters = [];

        aFilters.push(new sap.ui.model.Filter({
            path: "Production_Context_GBO",
            test: function (oValue) {
                return !oValue.toUpperCase().startsWith("SHOPORDERBO");
            }
        }));

        //we had the filter only if the checkbox state is true.
        if (showOnlyLastConfirmationNote) {
            aFilters.push(new sap.ui.model.Filter({
                path: "lastOperationNote",
                test: function (oValue) {
                    return oValue;
                }
            }));
        }

        if (showOnlyNotConfirmedConfirmationNote) {
            aFilters.push(new sap.ui.model.Filter({
                path: "Confirmed",
                test: function (oValue) {
                    return oValue !== "C";
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
     * Apply a filter on the wo notes
     * @param {Object} oEvent wich represent the event on press from the CheckBox last note
     */
    showOnlyLastWONote: function (oEvent) {
        var listWONotes = this.getView().byId("trackingtemplateView--listNotes");
        var lastWoCheckBox = this.getView().byId("trackingtemplateView--showOnlyLastWONote").getSelected();
        var aFilters = [];

        aFilters.push(new sap.ui.model.Filter({
            path: "Production_Context_GBO",
            test: function (oValue) {
                return oValue.toUpperCase().startsWith("SHOPORDERBO");
            }
        }));
        //we had the filter only if the checkbox state is true.
        if (lastWoCheckBox) {
            aFilters.push(new sap.ui.model.Filter({
                path: "lastOperationNote",
                test: function (oValue) {
                    return oValue;
                }
            }));
        }

        //we apply the filter here
        listWONotes.getBinding("items").filter(aFilters);
    },

    /**
     * It prints the WO or/and the confirmation note list
     */
    printTrackingTemplate: function () {

        var ctrlString = "width=500px, height= 600px";

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
        var operationDetail = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0];
        var title = operationDetail.wo_no + '-' + operationDetail.material_description + ' ';
        title += operationDetail.original_start_time || '';
        title += ' ';
        title += operationDetail.original_end_time || '';
        return title;
    },

    /**
     * Submit a comment 
     */
    submitComment: function () {
        //check the attachDocument list
        this.compareListAndRemove();
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

    /**
     * Cancel confirmation dialog
     */
    onCancelConfirmation: function () {
        this._oUserConfirmationDialog.close();
    },

    /**
     * Confirm the request
     */
    onOKConfirmation: function () {
        var uID = sap.ui.getCore().byId("UIDTckTmpltForConfirmation").getValue();
        var pin = sap.ui.getCore().byId("pinTckTmpltForConfirmation").getValue();

        airbus.mes.trackingtemplate.util.ModelManager.sendWONotes(
            //work order number Param.1 SHopOrderNumber
            sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no,
            //ERPSystem Param.2 ERPSYstem 
            sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].erp_system || '',
            //Param.3 BadgeID
            sap.ui.getCore().byId("badgeIDTckTmpltForConfirmation").getValue(),
            //Param.4 Description
            this.getView().byId('commentArea').getValue(),
            //Param.5 ReasonCode
            this.getView().byId("reasonCodeSelectBox").getSelectedKey() || '',
            //Param.6 password
            sap.ui.getCore().byId('passwordTckTmpltForConfirmation').getValue(),
            //Param.7 logon
            sap.ui.getCore().byId('userNameTckTmpltForConfirmation').getValue()
        );
        this.submitAttachedDocument();

        this._oUserConfirmationDialog.close();
    },


    /**
     * Remove the comment, reason code and value set in confirmation dialog
     * TODO : need a better method to clean value. 
     */
    cleanAfterAddingNotes: function () {
        //if the view is ready yet, dont try to reset value 
        if (airbus.mes.trackingtemplate.oView.byId('commentArea')) {
            //Param.4 Desciption
            airbus.mes.trackingtemplate.oView.byId('commentArea').setValue();
        }
        if (airbus.mes.trackingtemplate.oView.byId("reasonCodeSelectBox")) {
            //Param.5 ReasonCode
            airbus.mes.trackingtemplate.oView.byId("reasonCodeSelectBox").setSelectedKey('');
        }
        if (sap.ui.getCore().byId('passwordTckTmpltForConfirmation')) {
            //Param.6 password
            sap.ui.getCore().byId('passwordTckTmpltForConfirmation').setValue();
        }
        if (sap.ui.getCore().byId('userNameTckTmpltForConfirmation')) {
            //Param.7 logon
            sap.ui.getCore().byId('userNameTckTmpltForConfirmation').setValue();
        }

        if (sap.ui.getCore().byId("UIDTckTmpltForConfirmation")) {
            sap.ui.getCore().byId("UIDTckTmpltForConfirmation").setValue();
        }
        if (sap.ui.getCore().byId("badgeIDTckTmpltForConfirmation")) {
            sap.ui.getCore().byId("badgeIDTckTmpltForConfirmation").setValue();
        }
        this.cleanListFiles();
    },

    /**
     * unchecked all checked boxes
     */
    uncheckedAllSelectedBox: function () {
        this.getView().byId("trackingtemplateView--showOnlyLastWONote").setSelected(false);
        this.getView().byId("trackingtemplateView--showOnlyLastConfirmationNote").setSelected(false);
        this.getView().byId("trackingtemplateView--showOnlyNotConfirmedConfirmationNote").setSelected(false);
    },

    /***********************************************************
     * Scan Badge for User Confirmation
     ***********************************************************/
    onScanConfirmation: function (oEvt) {
        var timer;
        sap.ui.getCore().byId("UIDTckTmpltForConfirmation").setValue();
        sap.ui.getCore().byId("badgeIDTckTmpltForConfirmation").setValue();
        //close existing connection. then open again
        oEvt.getSource().setEnabled(false);
        var callBackFn = function () {
            console.log("callback entry \n");
            console.log("connected");
            if (airbus.mes.shell.ModelManager.badgeReader.readyState == 1) {
                airbus.mes.shell.ModelManager.brOpen();
                airbus.mes.shell.ModelManager.brStartReading();
                sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setText(
                    sap.ui.getCore().getModel("ShellI18n").getProperty("ConenctionOpened"));
                var i = 10;

                timer = setInterval(function () {
                    sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setType("Information");
                    sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setText(
                        sap.ui.getCore().getModel("ShellI18n").getProperty("ConnectYourBadge") + i--);//
                    if (i < 0) {
                        clearInterval(timer);
                        airbus.mes.shell.ModelManager.brStopReading();
                        airbus.mes.shell.ModelManager.badgeReader.close();
                        sap.ui.getCore().byId("scanTckTmpltButton").setEnabled(true);
                        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setType("Warning");
                        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setText(
                            sap.ui.getCore().getModel("ShellI18n").getProperty("timeout"));
                        setTimeout(function () {
                            sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setVisible(false);
                        }, 2000)
                    }
                }, 1000)
            }
        }

        var response = function (data) {
            clearInterval(timer);
            sap.ui.getCore().byId("scanTckTmpltButton").setEnabled(true);
            sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setVisible(false);
            if (data.Message) {
                var idType = data.Message.split(":")[0];

                switch (idType) {

                    case "UID":
                        sap.ui.getCore().byId("UIDTckTmpltForConfirmation").setValue(data.Message.replace(":", ""));
                        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setType("Success");
                        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setText(
                            sap.ui.getCore().getModel("ShellI18n").getProperty("ScannedSuccessfully"));
                        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setVisible(true);
                        break;

                    case "BID":
                        sap.ui.getCore().byId("badgeIDTckTmpltForConfirmation").setValue(data.Message.replace(":", ""));
                        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setType("Success");
                        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setText(
                            sap.ui.getCore().getModel("ShellI18n").getProperty("ScannedSuccessfully"));
                        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setVisible(true);
                        break;

                    default:
                        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setVisible(true);
                        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setText(
                            sap.ui.getCore().getModel("ShellI18n").getProperty("ErrorScanning"));
                        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setType("Error");
                }
            } else {
                sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setVisible(true);
                sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setType("Error");
                sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setText(
                    sap.ui.getCore().getModel("ShellI18n").getProperty("ErrorScanning"));
            }
            setTimeout(function () {
                sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setVisible(false);
                sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setText("");
            }, 2000);
            airbus.mes.shell.ModelManager.brStopReading();
            airbus.mes.shell.ModelManager.badgeReader.close();
            sap.ui.getCore().byId("scanTckTmpltButton").setEnabled(true);
        }

        var error = function () {
            clearInterval(timer);
            sap.ui.getCore().byId("scanTckTmpltButton").setEnabled(true);
            sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setVisible(true);
            sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setType("Error");
            sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setText(
                sap.ui.getCore().getModel("ShellI18n").getProperty("ErrorConnectionWebSocket"));
            setTimeout(function () {
                sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setVisible(false);
                sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setText("");
            }, 2000)
            sap.ui.getCore().byId("scanButton").setEnabled(true);
        }

        // Open a web socket connection
        //if(!airbus.mes.trackingtemplate.ModelManager.badgeReader){
        airbus.mes.shell.ModelManager.connectBadgeReader(callBackFn, response, error);
        //}

        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setType("Information");
        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setText(sap.ui.getCore().getModel("ShellI18n").getProperty("OpeningConnection"));
        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setVisible(true);
    },

    onChangeUploadCollection: function (oEvent) {
        // var oUploadCollection = oEvent.getSource();

        var files = oEvent.getParameters().files;
        var file = files[0];
        this.updateFile(file.name);
        var reader = new FileReader();
        var filesListBase64 = this.attachDocument;
        reader.onload = function (readerEvt) {
            var binaryString = readerEvt.target.result;
            // var base64 = btoa(binaryString);
            var oBase64 = {};
            oBase64.fileName = file.name;
            oBase64.type = file.type;
            oBase64.fileBase64 = btoa(binaryString);
            filesListBase64.push(oBase64);
        }
        reader.readAsBinaryString(files[0]);

    },

    /**
     * Send file one by one and call the request function
     */
    submitAttachedDocument: function () {
        var i = 0;
        var attachDocumentLength = this.attachDocument.length;
        for (; i < attachDocumentLength; i += 1) {
            airbus.mes.trackingtemplate.util.ModelManager.attachDocument(
                airbus.mes.settings.ModelManager.site,
                '1234',
                this.attachDocument[0].fileName, this.attachDocument[0].fileBase64,
                'S00DB44');
        }
    },

    /**
     * Remove items in upload collection list
     */
    cleanListFiles: function () {
        var attachmentFilesCollection = this.getView().byId('UploadCollection');
        attachmentFilesCollection.removeAllItems();
        this.attachDocument.length = 0;
    },

    /**
     * We don't allow to add same file name. At least we delete the first one then add the new one
     */
    updateFile: function (name) {
        var attachmentFilesCollection = this.getView().byId('UploadCollection');
        attachmentFilesCollection.getItems();
        this.removeFileFromAttachDocument(name);
        var i = 0;
        var len = attachmentFilesCollection.getItems().length;
        for (; i < len; i += 1) {``
            var namelist = attachmentFilesCollection.getItems()[i].getFileName();
            if (attachmentFilesCollection.getItems()[i].getFileName() === name) {
                // return attachmentFilesCollection.removeItem(i);
                attachmentFilesCollection.removeItem(i);
            }
        }
        return null;
    },

    /**
     * compare the list see in UI5 (attachmentFilesCollection) and attachDocument which we put the fileBase64
     * if we don't find the file name attachmentFilesCollection we delete remove the file in attachDocument
     */
    compareListAndRemove: function () {
        var attachmentFilesCollection = this.getView().byId('UploadCollection');
        var i = this.attachDocument.length-1;
        for (; i >= 0; i -= 1) {
            // We are looking if the attachDocument's list is still present in the collection.
            var index = attachmentFilesCollection.getItems().map(function (e) { return e.getFileName(); }).indexOf(this.attachDocument[i].fileName);
            if(index === -1) {
                this.attachDocument.splice(i, 1);
            }
        }
    },

    /**
     * remove file by the name from the array named AttachDocument
     */
    removeFileFromAttachDocument: function (name) {
        var index = this.attachDocument.map(function (e) { return e.fileName; }).indexOf(name);
        if (index !== -1) {
            this.attachDocument.splice(index, 1);
        }
    },

});

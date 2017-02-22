"use strict";
sap.ui.controller("airbus.mes.trackingtemplate.controller.trackingtemplate", {

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
     * Hide Comment Box to Add Comments
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
        var operationDetail = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0]
        return operationDetail.wo_no + '-' + operationDetail.material_description + ' ' + operationDetail.original_start_time + '-' + operationDetail.original_end_time;
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
        var uID = sap.ui.getCore().byId("UIDTckTmpltForConfirmation").getValue();
        var pin = sap.ui.getCore().byId("pinTckTmpltForConfirmation").getValue();

        //work order number Param.1 SHopOrderNumber
        var shopOrderNum = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no;
        //ERPSystem Param.2 ERPSYstem
        var erpSystem = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].erp_system || ''
        //Param.3 BadgeID
        var badgeId = sap.ui.getCore().byId("badgeIDTckTmpltForConfirmation").getValue();
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
        //if(!airbus.mes.operationdetail.ModelManager.badgeReader){
        airbus.mes.shell.ModelManager.connectBadgeReader(callBackFn, response, error);
        //}

        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setType("Information");
        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setText(sap.ui.getCore().getModel("ShellI18n").getProperty("OpeningConnection"));
        sap.ui.getCore().byId("msgstrpTckTmpltConfirm").setVisible(true);
    },


});
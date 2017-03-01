"use strict";

sap.ui.controller("airbus.mes.userConfirmation.controller.userConfirmation", {

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
    /**
     * Cancel confirmation dialog
     */
    onCancelConfirmation: function (oEvent) {
        oEvent.getSource().getParent().close();
    },
    /**
     * Confirm the request
     */
    onOKConfirmation: function (oEvent) {
        // var attachmentFilesCollection = this.getView().byId('UploadCollection');
        // var collection = attachmentFilesCollection.getItems();
        // var size = collection.length;
        // var i = 0;
        // for (; i < size; i += 1) {
        //     console.log(collection[i].getAttributes());
        //     console.log(collection[i].getFileName());
        // }
//        var uID = sap.ui.getCore().byId("UIDTckTmpltForConfirmation").getValue();
//        var pin = sap.ui.getCore().byId("pinTckTmpltForConfirmation").getValue();

        this.getOwnerComponent().setUser(sap.ui.getCore().byId('userNameTckTmpltForConfirmation').getValue());
        this.getOwnerComponent().setPassword(sap.ui.getCore().byId('passwordTckTmpltForConfirmation').getValue());      
        
//        //work order number Param.1 SHopOrderNumber
//        var shopOrderNum = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no;
//        //ERPSystem Param.2 ERPSYstem
//        var erpSystem = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].erp_system || ''
//        //Param.3 BadgeID
//        var badgeId = sap.ui.getCore().byId("badgeIDTckTmpltForConfirmation").getValue();
//        //Param.4 Desciption
//        var textArea = this.getView().byId('commentArea');
//        //Param.5 ReasonCode
//        var reasonCode = this.getView().byId("reasonCodeSelectBox").getSelectedKey() || '';
//        //Param.6 password
//        var password = sap.ui.getCore().byId('passwordTckTmpltForConfirmation').getValue();
//        //Param.7 logon
//        var login = sap.ui.getCore().byId('userNameTckTmpltForConfirmation').getValue();
//
//        var sMessageSuccess = this.getView().getModel("i18n")
//            .getProperty("SuccessfulConfirmation");
//        var sMessageError = this.getView().getModel("i18n")
//            .getProperty("ErrorDuringConfirmation");
//
//        jQuery
//            .ajax({
//                url: airbus.mes.trackingtemplate.util.ModelManager
//                    .getSendNotesUrl(
//                    shopOrderNum, erpSystem, badgeId, textArea.getValue(), reasonCode, password, login
//                    ),
//                async: false,
//                error: function (xhr, status, error) {
//                    airbus.mes.trackingtemplate.util.ModelManager.messageShow(sMessageError);
//                },
//                success: function (result, status, xhr) {
//                    if(result.Rowsets.Rowset &&  result.Rowsets.Rowset[0].Row) {
//                        sMessageSuccess = result.Rowsets.Rowset[0].Row[0].Message;
//                    } else {
//                        sMessageSuccess = sMessageError;
//                    }
//                    airbus.mes.trackingtemplate.util.ModelManager.messageShow(sMessageSuccess);
//                    airbus.mes.trackingtemplate.util.ModelManager.loadTrackingTemplateModel();
//                    airbus.mes.trackingtemplate.oView.oController.cleanAfterAddingNotes();
//                }
//            });
        oEvent.getSource().getParent().close();
    }    
}
);

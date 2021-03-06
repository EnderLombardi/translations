"use strict";
sap.ui.controller("airbus.mes.operationstatus.controller.status", {

    /**
     * Called when a controller is instantiated and its View
     * controls (if available) are already created. Can be used
     * to modify the View before it is displayed, to bind event
     * handlers and do other one-time initialization.
     *
     * @memberOf components.operationstatus.status
     */
    onInit : function() {

        // Set action on buttons
        sap.ui.getCore().byId("operationDetailPopup--btnPause").detachPress(this.pauseOperation);
        sap.ui.getCore().byId("operationDetailPopup--btnConfirm").detachPress(this.confirmOperation);
        sap.ui.getCore().byId("operationDetailPopup--btnActivate").detachPress(this.activateOperation);
        sap.ui.getCore().byId("operationDetailPopup--btnComplete").detachPress(this.completeOperation);
        sap.ui.getCore().byId("operationDetailPopup--btnAssignToObserver").detachPress(this.onAssignObserver);

        sap.ui.getCore().byId("operationDetailPopup--btnPause").attachPress(this.pauseOperation);
        sap.ui.getCore().byId("operationDetailPopup--btnConfirm").attachPress(this.confirmOperation);
        sap.ui.getCore().byId("operationDetailPopup--btnActivate").attachPress(this.activateOperation);
        sap.ui.getCore().byId("operationDetailPopup--btnComplete").attachPress(this.completeOperation);
        sap.ui.getCore().byId("operationDetailPopup--btnAssignToObserver").attachPress(this.onAssignObserver);
        
        sap.ui.getCore().byId("idStatusView--labelAssignACPnG").setVisible(false);
        sap.ui.getCore().byId("idStatusView--assignACPnGstatus").setVisible(false);
        sap.ui.getCore().byId("idStatusView--labelAssignMES").setVisible(false);
        sap.ui.getCore().byId("idStatusView--assignMESstatus").setVisible(false);
        
    },
    onAfterRendering: function () {
    	//management of radiobutton when coming from acpnglinks
	    if(airbus.mes.stationtracker.opeDetailCallStack.arr && airbus.mes.stationtracker.opeDetailCallStack.arr.length > 1 && airbus.mes.stationtracker.opeDetailCallStack.sOrigin){
	    	sap.ui.getCore().byId("idStatusView--workOrderButton").setSelected(true);
			sap.ui.getCore().byId("idStatusView--workOrderButton").fireSelect({selected:true});
		}else{
			sap.ui.getCore().byId("idStatusView--operationButton").setSelected(true);
			sap.ui.getCore().byId("idStatusView--operationButton").fireSelect({selected:true});
		}
    },
    onSelectLevel : function(oEvent) {
         var sId = oEvent.mParameters.selectedIndex;
         var detailStatus = sap.ui.getCore().byId("idStatusView--Statutprogress");
         var operationList = sap.ui.getCore().byId("idStatusView--operationList");
        switch (sId) {
            case 0://operation button
                detailStatus.setVisible(true);
                operationList.setVisible(false);
                break;
            case 1://work order button
               detailStatus.setVisible(false);
               operationList.setVisible(true);
                break;
            default:
                break;
        }
    },


    /* increase or decrease Progress Functions */

    addProgress : function() {
        sap.ui.getCore().byId("progressSlider").stepUp(1);
        var progress = sap.ui.getCore().byId("progressSlider").getValue();
        sap.ui.getCore().byId("imTextArea").setValue(airbus.mes.operationdetail.Formatter.convertProgressBarToImField(progress));
    	sap.ui.getCore().byId("imTextArea").setValueState("None");

    },

    reduceProgress : function() {
        sap.ui.getCore().byId("progressSlider").stepDown(1);
        var progress = sap.ui.getCore().byId("progressSlider").getValue();
        sap.ui.getCore().byId("imTextArea").setValue(airbus.mes.operationdetail.Formatter.convertProgressBarToImField(progress));
    	sap.ui.getCore().byId("imTextArea").setValueState("None");

    },
    /***********************************************************
     *
     * activate pause or confirm operation
     *
     **********************************************************/
    activateOperation : function() {

        var oView = airbus.mes.operationstatus.oView;

        //active busy
        airbus.mes.shell.busyManager.setBusy(airbus.mes.stationtracker.oView, "stationtracker");

        var data = oView.getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0];
        var sMessageSuccess = oView.getModel("i18n").getProperty("SuccessfulActivation");
        var sMessageError = oView.getModel("i18n").getProperty("UnsuccessfulActivation");
        var flagSuccess;

        jQuery.ajax({
            url : airbus.mes.operationdetail.ModelManager.getUrlStartOperation(data),
            async : false,
            error : function(xhr, status, error) {
                airbus.mes.operationdetail.ModelManager.messageShow(sMessageError);
                flagSuccess = false
            },
            success : function(result, status, xhr) {

                if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
                    if (result.Rowsets.Rowset[0].Row[0].Message || result.Rowsets.Rowset[0].Row[0].Message !== undefined) {
                        airbus.mes.operationdetail.ModelManager.messageShow(sMessageSuccess);
                    }
                    flagSuccess = true;
                } else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
                    if (result.Rowsets.Rowset[0].Row[0].Message || result.Rowsets.Rowset[0].Row[0].Message !== undefined) {
                        airbus.mes.operationdetail.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
                    }
                    flagSuccess = false;
                } else {
                    if (result.Rowsets.Rowset[0].Row[0].Message || result.Rowsets.Rowset[0].Row[0].Message !== undefined) {
                        airbus.mes.operationdetail.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
                    }
                    flagSuccess = true;
                }
            }
        });

        // Refresh User Operation Model and Operation Detail
        if (flagSuccess == true) {
            oView.getController().setProgressScreenBtn(true, false, true, true);

            // Refresh User Operation Model and Operation Detail
            airbus.mes.shell.oView.getController().renderStationTracker();

            oView.byId("operationStatus").setText(oView.getModel("i18n").getProperty("in_progress"));

            // Re-Render Station Tracker
            /*airbus.mes.shell.oView.getController().renderStationTracker();*/

            // update operationDetailsModel
            sap.ui.getCore().getModel("operationDetailModel").setProperty("/Rowsets/Rowset/0/Row/0/status", "IN_WORK");
            sap.ui.getCore().getModel("operationDetailModel").setProperty("/Rowsets/Rowset/0/Row/0/paused", "false");
            sap.ui.getCore().getModel("operationDetailModel").refresh();

            // Refresh Station tracker Gantt Chart
            /*airbus.mes.shell.oView.getController().renderStationTracker();*/
        } else {
            airbus.mes.shell.busyManager.unsetBusy(airbus.mes.stationtracker.oView, "stationtracker");
        }
        return flagSuccess;
    },

    pauseOperation : function() {

        //active busy
        airbus.mes.shell.busyManager.setBusy(airbus.mes.stationtracker.oView, "stationtracker");

        var oView = airbus.mes.operationstatus.oView;

        var data = oView.getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0];
        var sMessageSuccess = oView.getModel("i18n").getProperty("SuccessfulPause");
        var sMessageError = oView.getModel("i18n").getProperty("UnsuccessfulPause");
        var flagSuccess;

        jQuery.ajax({
            url : airbus.mes.operationdetail.ModelManager.getUrlPauseOperation(data),
            async : false,
            error : function(xhr, status, error) {
                airbus.mes.operationdetail.ModelManager.messageShow(sMessageError);
                flagSuccess = false
            },
            success : function(result, status, xhr) {

                if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
                    if (result.Rowsets.Rowset[0].Row[0].Message || result.Rowsets.Rowset[0].Row[0].Message !== undefined) {
                        airbus.mes.operationdetail.ModelManager.messageShow(sMessageSuccess);
                    }
                    flagSuccess = true;
                } else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
                    if (result.Rowsets.Rowset[0].Row[0].Message || result.Rowsets.Rowset[0].Row[0].Message !== undefined) {
                        airbus.mes.operationdetail.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
                    }
                    flagSuccess = false;
                } else {
                    if (result.Rowsets.Rowset[0].Row[0].Message || result.Rowsets.Rowset[0].Row[0].Message !== undefined) {
                        airbus.mes.operationdetail.ModelManager.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
                    }
                    flagSuccess = true;
                }
            }
        });

        if (flagSuccess == true) {
            oView.getController().setProgressScreenBtn(false, true, false, false);

            // Refresh User Operation Model and Operation Detail
            airbus.mes.shell.oView.getController().renderStationTracker();
            //update spent time on pause of operation
            oView.getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].time_spent = airbus.mes.stationtracker.util.ModelManager.getSpentTimePerOperation(data.operation_no, data.wo_no);
            oView.getModel("operationDetailModel").refresh();

            oView.byId("operationStatus").setText(oView.getModel("i18n").getProperty("paused"));

            // update operationDetailsModel
            sap.ui.getCore().getModel("operationDetailModel").setProperty("/Rowsets/Rowset/0/Row/0/status", "IN_QUEUE")
            sap.ui.getCore().getModel("operationDetailModel").setProperty("/Rowsets/Rowset/0/Row/0/paused", "---");
            sap.ui.getCore().getModel("operationDetailModel").refresh();
        } else {
            airbus.mes.shell.busyManager.unsetBusy(airbus.mes.stationtracker.oView, "stationtracker");
        }
    },

    confirmOperation : function(oEvent) {
        oEvent.reset();
        var oView = airbus.mes.operationstatus.oView;
        var oModel = [sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0]];
        airbus.mes.operationdetail.ModelManager.durationNeededForCalc = oModel[0].duration;
        // click on confirm
        oView.getController().operationStatus = "C";
        oView.getController().Mode = "EarnedStandards";

        airbus.mes.operationdetail.ModelManager.loadReasonCodeModel();
        if (!oView._reasonCodeDialog) {
            oView._reasonCodeDialog = sap.ui.xmlfragment("airbus.mes.operationdetail.fragments.reasonCode", oView.getController());
            oView.addDependent(oView._reasonCodeDialog);
        }
        //[Defect 289] Clear Select and Text Field on opening of Popup
        sap.ui.getCore().byId("reasonCodeSelectBox").clearSelection();
        sap.ui.getCore().byId("reasonCodeComments").setValue();
        sap.ui.getCore().byId("confirmTimeWorked").setSelected(false);
        airbus.mes.operationdetail.ModelManager.statusCheckBoxReasonCode = "";
        if(oModel[0].progres != 0 || oModel[0].progres != "0"){
            var im  = airbus.mes.operationdetail.Formatter.convertProgressBarToImField(oModel[0].progress);
            sap.ui.getCore().byId("imTextArea").setValue(im);
        }
        airbus.mes.operationdetail.Formatter.liveChangeIm(oEvent);
        airbus.mes.operationdetail.Formatter.liveChangeProgressBar();
//        $("#confirmTimeWorked-CB").attr("checked")
        oView._reasonCodeDialog.open();
		// Reset value
		sap.ui.getCore().byId("imTextArea").setValueState("None");
		sap.ui.getCore().byId("progressSlider").setValue(0);
    },
    completeOperation : function(oEvent) {

        var oView = airbus.mes.operationstatus.oView;
        var dataConfirm = airbus.mes.operationdetail.ModelManager.jsonConfirmationCheckList;
        airbus.mes.operationdetail.ModelManager.statusCheckBoxReasonCode = "";
        // Click on Complete
        oView.getController().operationStatus = "X";
        oView.getController().Mode = "Complete";
        if (!oView._oUserConfirmationDialog) {

            oView._oUserConfirmationDialog = sap.ui.xmlfragment("airbus.mes.operationdetail.fragments.userConfirmation", oView.getController());
            oView.addDependent(oView._oUserConfirmationDialog);
        }
        //Display PIN Field in Confirmation PopUp
        var flagForPIN = airbus.mes.settings.util.AppConfManager.getConfiguration("MES_BADGE_PIN");
        if (flagForPIN == true) {
            sap.ui.getCore().byId("confirmPinLabel").setVisible(true);
            sap.ui.getCore().byId("pinForConfirmation").setVisible(true);
        }

        var jsonModel = airbus.mes.operationdetail.ModelManager.jsonConfirmationCheckList;
        if(jsonModel === undefined){
            oView._oUserConfirmationDialog.open();
            sap.ui.getCore().byId("confirmationCheckList").setVisible(false);
        }else{
            sap.ui.getCore().byId("confirmationCheckList").setVisible(true);
            airbus.mes.operationdetail.Formatter.setIconTypeConfirmation();
            oView._oUserConfirmationDialog.open();
            airbus.mes.operationdetail.Formatter.setIconColor();
            sap.ui.getCore().byId("scanButtonEnd").setProperty("justifyContent", "End");
            sap.ui.getCore().byId("partialConfirmForm").setProperty("justifyContent", "End");
            oView._oUserConfirmationDialog.setProperty("contentWidth", "34%");
        }
        sap.ui.getCore().byId("msgstrpConfirm").setVisible(false);
        sap.ui.getCore().byId("UIDForConfirmation").setValue("");
        sap.ui.getCore().byId("badgeIDForConfirmation").setValue("");
        sap.ui.getCore().byId("pinForConfirmation").setValue("");
        sap.ui.getCore().byId("userNameForConfirmation").setValue("");
        sap.ui.getCore().byId("passwordForConfirmation").setValue("");
    },
    
    
    onAssignObserver : function(oEvent) {
        oEvent.reset();
        var oView = airbus.mes.operationstatus.oView;
       
        airbus.mes.operationdetail.ModelManager.loadDispatchModel();
        if (!oView._dipatchDialog) {
        	oView._dipatchDialog = sap.ui.xmlfragment("airbus.mes.operationdetail.fragments.dispatchToObserver", oView.getController());
            oView.addDependent(oView._dipatchDialog);
        }
        
        oView._dipatchDialog.open();    
        oView.getController().onChangeLevelAssign(); 

    },
    

   

    /***********************************************************
     * on click of go to Disruption button when status of
     * operation is Blocked
     *
     */
    onPressGotoDisruptios : function() {
    	this.nav = sap.ui.getCore().byId("operationDetailsView--operDetailNavContainer")
        airbus.mes.shell.util.navFunctions.viewDisruptionsList(this.nav, sap.ui.getCore().byId(
                "operationDetailPopup--reportDisruption"), // Report
        // Disruption
        // Button
        sap.ui.getCore().byId("operationDetailPopup--btnCreateDisruption"), // Create
        sap.ui.getCore().byId("operationDetailPopup--btnUpdateDisruption"), // Update
        sap.ui.getCore().byId("operationDetailPopup--btnCancelDisruption") // Cancel
        );
        this.nav.to(airbus.mes.disruptionslist.oView.getId());

        sap.ui.getCore().byId("operationDetailsView--opDetailSegmentButtons").setSelectedItem(sap.ui.getCore().byId("operationDetailsView--idDisruption"));


    },

    /***********************************************************
     *
     * User Confirmation Dialog Methods
     *
     **********************************************************/
    /***********************************************************
     * Scan Badge for User Confirmation
     */
    onScanConfirmation : function(oEvt) {
        var timer;
        sap.ui.getCore().byId("UIDForConfirmation").setValue();
        sap.ui.getCore().byId("badgeIDForConfirmation").setValue();
        //close existing connection. then open again
        oEvt.getSource().setEnabled(false);
        var callBackFn = function() {
            console.log("callback entry \n");
            console.log("connected");
            if (airbus.mes.shell.ModelManager.badgeReader.readyState == 1) {
                airbus.mes.shell.ModelManager.brOpen();
                airbus.mes.shell.ModelManager.brStartReading();
                sap.ui.getCore().byId("msgstrpConfirm").setText(
                        sap.ui.getCore().getModel("ShellI18n").getProperty("ConenctionOpened"));
                var i = 10;

                timer = setInterval(function() {
                    sap.ui.getCore().byId("msgstrpConfirm").setType("Information");
                    sap.ui.getCore().byId("msgstrpConfirm").setText(
                            sap.ui.getCore().getModel("ShellI18n").getProperty("ConnectYourBadge") + i--);//
                    if (i < 0) {
                        clearInterval(timer);
                        airbus.mes.shell.ModelManager.brStopReading();
                        airbus.mes.shell.ModelManager.badgeReader.close();
                        sap.ui.getCore().byId("scanButton").setEnabled(true);
                        sap.ui.getCore().byId("msgstrpConfirm").setType("Warning");
                        sap.ui.getCore().byId("msgstrpConfirm").setText(
                                sap.ui.getCore().getModel("ShellI18n").getProperty("timeout"));
                        setTimeout(function() {
                            sap.ui.getCore().byId("msgstrpConfirm").setVisible(false);
                        }, 2000)
                    }
                }, 1000)
            }
        }

        var response = function(data) {
            clearInterval(timer);
            sap.ui.getCore().byId("scanButton").setEnabled(true);
            sap.ui.getCore().byId("msgstrpConfirm").setVisible(false);
            if (data.Message) {
                var idType = data.Message.split(":")[0];

                switch (idType){

                case "UID":
                    sap.ui.getCore().byId("UIDForConfirmation").setValue(data.Message.replace(":", ""));
                    sap.ui.getCore().byId("msgstrpConfirm").setType("Success");
                    sap.ui.getCore().byId("msgstrpConfirm").setText(
                            sap.ui.getCore().getModel("ShellI18n").getProperty("ScannedSuccessfully"));
                    sap.ui.getCore().byId("msgstrpConfirm").setVisible(true);
                    break;

                case "BID":
                    sap.ui.getCore().byId("badgeIDForConfirmation").setValue(data.Message.replace(":", ""));
                    sap.ui.getCore().byId("msgstrpConfirm").setType("Success");
                    sap.ui.getCore().byId("msgstrpConfirm").setText(
                            sap.ui.getCore().getModel("ShellI18n").getProperty("ScannedSuccessfully"));
                    sap.ui.getCore().byId("msgstrpConfirm").setVisible(true);
                    break;

                default:
                    sap.ui.getCore().byId("msgstrpConfirm").setVisible(true);
                    sap.ui.getCore().byId("msgstrpConfirm").setText(
                            sap.ui.getCore().getModel("ShellI18n").getProperty("ErrorScanning"));
                    sap.ui.getCore().byId("msgstrpConfirm").setType("Error");
                }
            } else {
                sap.ui.getCore().byId("msgstrpConfirm").setVisible(true);
                sap.ui.getCore().byId("msgstrpConfirm").setType("Error");
                sap.ui.getCore().byId("msgstrpConfirm").setText(
                        sap.ui.getCore().getModel("ShellI18n").getProperty("ErrorScanning"));
            }
            setTimeout(function() {
                sap.ui.getCore().byId("msgstrpConfirm").setVisible(false);
                sap.ui.getCore().byId("msgstrpConfirm").setText("");
            }, 2000);
            airbus.mes.shell.ModelManager.brStopReading();
            airbus.mes.shell.ModelManager.badgeReader.close();
            sap.ui.getCore().byId("scanButton").setEnabled(true);
        }

        var error = function() {
            clearInterval(timer);
            sap.ui.getCore().byId("scanButton").setEnabled(true);
            sap.ui.getCore().byId("msgstrpConfirm").setVisible(true);
            sap.ui.getCore().byId("msgstrpConfirm").setType("Error");
            sap.ui.getCore().byId("msgstrpConfirm").setText(
                    sap.ui.getCore().getModel("ShellI18n").getProperty("ErrorConnectionWebSocket"));
            setTimeout(function() {
                sap.ui.getCore().byId("msgstrpConfirm").setVisible(false);
                sap.ui.getCore().byId("msgstrpConfirm").setText("");
            }, 2000)
            sap.ui.getCore().byId("scanButton").setEnabled(true);
        }

        // Open a web socket connection
        //if(!airbus.mes.operationdetail.ModelManager.badgeReader){
        airbus.mes.shell.ModelManager.connectBadgeReader(callBackFn, response, error);
        //}

        sap.ui.getCore().byId("msgstrpConfirm").setType("Information");
        sap.ui.getCore().byId("msgstrpConfirm").setText(sap.ui.getCore().getModel("ShellI18n").getProperty("OpeningConnection"));
        sap.ui.getCore().byId("msgstrpConfirm").setVisible(true);
    },

    onCancelConfirmation : function() {
        var oView = airbus.mes.operationstatus.oView;

        oView._oUserConfirmationDialog.close();
    },

    onOKConfirmation : function(oEvent) {

        //set the BusyIndicatorDelay to 0 ms (by default it's 500 ms)
        sap.ui.getCore().byId("partial").setBusyIndicatorDelay(0);
        sap.ui.getCore().byId("operationDetailPopup--operationDetailPopUp").setBusyIndicatorDelay(0);

        //active busy
        airbus.mes.shell.busyManager.setBusy(sap.ui.getCore(), "partial");
        airbus.mes.shell.busyManager.setBusy(sap.ui.getCore(), "operationDetailPopup--operationDetailPopUp");

        //IMPORTANT
        //setTimeout of 1ms because the setBusy begins after if we don't use this trick
        setTimeout(function() {
            var sMessageSuccess = "";
            var oView = airbus.mes.operationstatus.oView;

            var uID = sap.ui.getCore().byId("UIDForConfirmation").getValue();
            var bID = sap.ui.getCore().byId("badgeIDForConfirmation").getValue();
            var ID;
            if (bID != "") {
                ID = bID;
            } else {
                ID = uID;
            }
            var pin = sap.ui.getCore().byId("pinForConfirmation").getValue();
            var user = sap.ui.getCore().byId("userNameForConfirmation").getValue();
            var pass = sap.ui.getCore().byId("passwordForConfirmation").getValue();
            if(oView._reasonCodeDialog) {
                sMessageSuccess = oView.getModel("i18n").getProperty("Partial_Confirmation_Done");
            } else {
                sMessageSuccess = oView.getModel("i18n").getProperty("SuccessfulConfirmation");
            }
            var sWo = airbus.mes.operationstatus.oView.getModel("operationDetailModel").getProperty(
                    "/Rowsets/Rowset/0/Row/0/wo_no");
            var sMessageError = oView.getModel("i18n").getProperty("ErrorDuringConfirmation");

            if ((user == "" || pass == "") && (ID == "")) {
                sap.ui.getCore().byId("msgstrpConfirm").setVisible(true);
                sap.ui.getCore().byId("msgstrpConfirm").setType("Error");
                sap.ui.getCore().byId("msgstrpConfirm")
                        .setText(oView.getModel("i18n").getProperty("CompulsaryCredentials"));

                //unactive busyIndicator
                airbus.mes.shell.busyManager.unsetBusy(sap.ui.getCore(), "partial");
                airbus.mes.shell.busyManager.unsetBusy(sap.ui.getCore(), "operationDetailPopup--operationDetailPopUp");
            } else {
                sap.ui.getCore().byId("msgstrpConfirm").setVisible(false);
                var percent;

                if (oView.getController().operationStatus == "X") {
                    percent = 100;
                } else {
                    percent = sap.ui.getCore().byId("progressSlider").getValue();
                }
                var statusReasonCode = airbus.mes.operationdetail.ModelManager.statusCheckBoxReasonCode;
                var erpSystem = airbus.mes.operationstatus.oView.getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].erp_system;
                // Call service for Operation Confirmation
                var flagSuccess = airbus.mes.operationdetail.ModelManager.confirmOperation(user, pass, oView
                        .getController().operationStatus, percent, oView.getModel("operationDetailModel").getProperty(
                        "/Rowsets/Rowset/0/Row/0/sfc_step_ref"), oView.getController().reasonCodeText, oView
                        .getController().Mode, ID, pin, sMessageError, sMessageSuccess, sWo, statusReasonCode, erpSystem);

                // Close reason code dialog
                if (oView._reasonCodeDialog) {
                    oView._reasonCodeDialog.close();
                }

                // Close confirmation dialogue
                oView._oUserConfirmationDialog.close();

                //unactive busyIndicator
                airbus.mes.shell.busyManager.unsetBusy(sap.ui.getCore(), "partial");
                airbus.mes.shell.busyManager.unsetBusy(sap.ui.getCore(), "operationDetailPopup--operationDetailPopUp");

                if (flagSuccess === true) {
                    //update spent time on success of confirmation
                    var data = oView.getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0];
                    oView.getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].time_spent = airbus.mes.stationtracker.util.ModelManager.getSpentTimePerOperation(data.operation_no, data.wo_no);
                    oView.getModel("operationDetailModel").refresh();
                    // Refresh User Operation Model and Operation Detail
                    airbus.mes.shell.oView.getController().renderStationTracker();

                    // update operationDetailsModel
                    if (oView.getController().operationStatus == "X") {
                        sap.ui.getCore().getModel("operationDetailModel").setProperty("/Rowsets/Rowset/0/Row/0/status",
                                "COMPLETED");
                        oView.getController().setProgressScreenBtn(false, false, false, false);
                    }

                    sap.ui.getCore().getModel("operationDetailModel").setProperty("/Rowsets/Rowset/0/Row/0/progress",
                            percent)
                    sap.ui.getCore().getModel("operationDetailModel").refresh();
                }
            }
        }, 1);
    },
    
    
    
    /***********************************************************
     * Dispatch To Observer Fragment Methods
     **********************************************************/
    
    onCancelDispatchObserver : function() {

        var oView = airbus.mes.operationstatus.oView;
        sap.ui.getCore().getModel("operationDetailModel").refresh();
        oView._dipatchDialog.close();
    },

    onDispatchObserver : function() {
    //	var sMessageError = i18nModel.getProperty("tryAgain");
    	var sMessageError = "Dispatch error";
    	var sMessageSuccess = "Dispatch success";
    	var userGroup = sap.ui.getCore().byId("observerSelectBox").getSelectedKey();
        var level = "WO";
        
        // check level chosen by user
        if (!sap.ui.getCore().byId("WOlevel").getProperty("selected"))
        	level = "OP";
    	
    	
        jQuery.ajax({
            url : airbus.mes.operationdetail.ModelManager.getUrlDispatch(userGroup, level),
            async : false,
            error : function(xhr, status, error) {
            	airbus.mes.operationdetail.ModelManager.messageShow(sMessageError);
            	
            },
            success : function(result, status, xhr) {
            	airbus.mes.operationdetail.ModelManager.messageShow(sMessageSuccess);
            	airbus.mes.operationstatus.oView._dipatchDialog.close();
            }
        });
    	
    },    
    
    onChangeLevelAssign : function(){
        var oSorter = new sap.ui.model.Sorter("USER_GROUP");

        var filter, binding;
        var level = "WO";
     
        // check level chosen by user
        if (!sap.ui.getCore().byId("WOlevel").getProperty("selected"))
        	level = "OP";

        // filter user group according level (OP or WO)
        filter = new sap.ui.model.Filter("level",sap.ui.model.FilterOperator.Contains , level);
        binding = sap.ui.getCore().byId("observerSelectBox").getBinding("items");
        binding.filter(filter,"Application");
        binding.refresh(true);
             
        // sort values according description
        sap.ui.getCore().byId("observerSelectBox").getBinding("items").sort(oSorter);
    	
    },
    
    

    /***********************************************************
     * ReasonCode Fragment Methods
     **********************************************************/
    onSubmitReasonCode : function(oEvent) {
        var oView = airbus.mes.operationstatus.oView;
        
        if ( sap.ui.getCore().byId("reasonCodeSelectBox").getSelectedKey() === "" ||  sap.ui.getCore().byId("imTextArea").getValueState() === "Error" ) {
        	
        	jQuery.sap.require("sap.m.MessageBox");

			sap.m.MessageBox.warning(airbus.mes.operationstatus.oView.getModel("i18n").getProperty("errorSelection"), {

			});
			return;
        	
        }
        // store reason Code text
        oView.getController().reasonCodeText = sap.ui.getCore().byId("reasonCodeSelectBox").getSelectedKey() + "-"
                + sap.ui.getCore().byId("reasonCodeComments").getValue()
        // Close reason code dialog
        // this._reasonCodeDialog.close();

        if (!oView._oUserConfirmationDialog) {

            oView._oUserConfirmationDialog = sap.ui.xmlfragment(
                    "airbus.mes.operationdetail.fragments.userConfirmation", oView.getController());

            oView.addDependent(oView._oUserConfirmationDialog);
        }
        //Display PIN Field in Confirmation PopUp
        var flagForPIN = airbus.mes.settings.util.AppConfManager.getConfiguration("MES_BADGE_PIN");
        if (flagForPIN == true) {
            sap.ui.getCore().byId("confirmPinLabel").setVisible(true);
            sap.ui.getCore().byId("pinForConfirmation").setVisible(true);
        }
        if($("#confirmTimeWorked-CB").attr("checked") == "checked"){
            airbus.mes.operationdetail.ModelManager.statusCheckBoxReasonCode = "X";
        }else{
            airbus.mes.operationdetail.ModelManager.statusCheckBoxReasonCode = "";
        }
        sap.ui.getCore().byId("confirmationCheckList").setVisible(false);
        oView._oUserConfirmationDialog.open();
        oView._oUserConfirmationDialog.setProperty("contentWidth", "20%");
        sap.ui.getCore().byId("scanButtonEnd").setProperty("justifyContent", "Center");
        sap.ui.getCore().byId("partialConfirmForm").setProperty("justifyContent", "Center");
        sap.ui.getCore().byId("msgstrpConfirm").setVisible(false);
        sap.ui.getCore().byId("UIDForConfirmation").setValue("");
        sap.ui.getCore().byId("badgeIDForConfirmation").setValue("");
        sap.ui.getCore().byId("pinForConfirmation").setValue("");
        sap.ui.getCore().byId("userNameForConfirmation").setValue("");
        sap.ui.getCore().byId("passwordForConfirmation").setValue("");
    },


    onCancelReasonCode : function() {

        var oView = airbus.mes.operationstatus.oView;

        sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].progress_new = sap.ui
                .getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].progress;
        sap.ui.getCore().getModel("operationDetailModel").refresh();
        oView._reasonCodeDialog.close();
    },

    /***********************************************************
     * set Buttons on the screen according to status
     *
     **********************************************************/
    setProgressScreenBtn : function(actionBtnStatus, activateBtnStatus, confirmBtnStatus, assignObserver) {
        sap.ui.getCore().byId("operationDetailPopup--btnPause").setVisible(actionBtnStatus);
        sap.ui.getCore().byId("operationDetailPopup--btnComplete").setVisible(actionBtnStatus);
        sap.ui.getCore().byId("operationDetailPopup--btnActivate").setVisible(activateBtnStatus);
        sap.ui.getCore().byId("operationDetailPopup--btnConfirm").setVisible(confirmBtnStatus);
        sap.ui.getCore().byId("operationDetailPopup--btnAssignToObserver").setVisible(assignObserver);
    },

    setOperationActionButtons : function() {

         // Not started ever
        if (airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/previously_start") === "true" ||
            sap.ui.getCore().byId("operationDetailsView--switchOperationModeBtn").getState() ) {

            // Get status
            var sStatus = airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/status");

            switch(sStatus){

            case airbus.mes.operationdetail.Formatter.status.notStarted:
            case airbus.mes.operationdetail.Formatter.status.paused:

                this.setProgressScreenBtn(false, true, false, true);
                break;

            case airbus.mes.operationdetail.Formatter.status.active:

                this.setProgressScreenBtn(true, false, true, true);
                break;

            case airbus.mes.operationdetail.Formatter.status.blocked:

                this.setProgressScreenBtn(false, false, true, true);
                break;

            case airbus.mes.operationdetail.Formatter.status.completed:
                this.setProgressScreenBtn(false, false, false, false);
                break;
            }

            return;

        } else {
            this.setProgressScreenBtn(false, false, false, false);
            return;
        }


    }

});

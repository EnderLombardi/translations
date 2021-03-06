"use strict";
sap.ui
    .controller(
    "airbus.mes.operationdetail.operationDetail",
    {
        reasonCodeText: undefined,
        operationStatus: undefined,

        /**
         * Called when a controller is instantiated and its View
         * controls (if available) are already created. Can be used
         * to modify the View before it is displayed, to bind event
         * handlers and do other one-time initialization.
         *
         * @memberOf components.operationdetail.operationDetail
         */
        onInit: function () {
            this.nav = this.getView().byId("operDetailNavContainer");

            airbus.mes.shell.util.navFunctions.operationstatus(this.nav, false);
        },

        expandOperationDetailPanel: function (oEvent) {
            var toggleButton = this.getView().byId("opDetailExpandButton");
            toggleButton.setVisible(!toggleButton.getVisible());

            var toggleButton2 = this.getView().byId("opDetailCloseButton");
            toggleButton2.setVisible(!toggleButton2.getVisible());

            this.getView().byId("operationDetailPanel").setExpanded(!toggleButton.getVisible());
        },


        /**
         * Called when the View has been rendered (so its HTML is
         * part of the document). Post-rendering manipulations of
         * the HTML could be done here. This hook is the same one
         * that SAPUI5 controls get after being rendered.
         *
         * @memberOf components.operationdetail.operationDetail
         */
        onAfterRendering: function () {

        	var oModel = [sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0]];
        	if (airbus.mes.stationtracker.util.GroupingBoxingManager.computeStatus(oModel[0].state, oModel[0].paused, oModel[0].previously_start) === "0") {
        		airbus.mes.operationdetail.oView.byId("idReschedule").setEnabled(false);
        	} else {
        			if(sap.ui.getCore().getModel("Profile").getProperty("/identifiedUser/permissions/STATION_DRILL_RESCHEDULE") === true){
        		airbus.mes.operationdetail.oView.byId("idReschedule").setEnabled(true);
        			} else{
        				airbus.mes.operationdetail.oView.byId("idReschedule").setEnabled(false);
        			}
        	}

    		this.nav.to(airbus.mes.operationstatus.oView.getId());
    		//select the icontabbarfilter which matched with the panel displayed in pop-up
    		this.getView().byId("opDetailSegmentButtons").setSelectedKey("status");
    		sap.ui.getCore().byId("operationDetailsView--opDetailSegmentButtons").fireSelect({selectedKey:"status"})
        	// Navigation to Status every time pop-up is opened
        	if(airbus.mes.stationtracker.opeDetailCallStack && airbus.mes.stationtracker.opeDetailCallStack.sOrigin){
        		if(airbus.mes.stationtracker.opeDetailCallStack.arr[airbus.mes.stationtracker.opeDetailCallStack.arr.length-1].type == "NC"){
        			airbus.mes.shell.util.navFunctions.ncDisplayLink(this.nav);
        			this.nav.to(airbus.mes.ncdisplay.oView.getId());
        			this.getView().byId("opDetailSegmentButtons").setSelectedKey("ncDisplay");
        			sap.ui.getCore().byId("operationDetailsView--opDetailSegmentButtons").fireSelect({selectedKey:"ncDisplay"})
        			sap.ui.getCore().byId("ncdisplayView--ncDisplayOrder").setSelected(true);
        			sap.ui.getCore().byId("ncdisplayView--ncDisplayOrder").fireSelect({selected:true});

        		}else{
        			this.nav.to(airbus.mes.acpnglinks.oView.getId());
        			this.getView().byId("opDetailSegmentButtons").setSelectedKey("ACPnGLinks");
        			sap.ui.getCore().byId("operationDetailsView--opDetailSegmentButtons").fireSelect({selectedKey:"ACPnGLinks"})
        		}    	
        	}else{
        		this.nav.to(airbus.mes.operationstatus.oView.getId());
        		//select the icontabbarfilter which matched with the panel displayed in pop-up
        		this.getView().byId("opDetailSegmentButtons").setSelectedKey("status");
        		sap.ui.getCore().byId("operationDetailsView--opDetailSegmentButtons").fireSelect({selectedKey:"status"})
        	}
    		// Set button
    		airbus.mes.operationstatus.oView.oController.setOperationActionButtons();


        	this.setToolbarVisible();


        	//AFTER THIS ITS OK
        	var oSwitchButton = this.getView().byId("switchOperationModeBtn");
        	if (oSwitchButton.getState() == true) {
        		//Define visibility for header sections
        		$(".opDetailNavToolbar > ul > li ~ li").css("display", "inline-block");
        	} else {
        		//Define visibility for header sections
        		$(".opDetailNavToolbar > ul > li ~ li").css("display", "none");
        	}
        	/****** hide buttons *********/
        	sap.ui.getCore().byId("operationDetailPopup--reportDisruption").setVisible(false);
        	sap.ui.getCore().byId("operationDetailPopup--btnCreateDisruption").setVisible(false);
        	sap.ui.getCore().byId("operationDetailPopup--reportandCloseDisruption").setVisible(false);
        	sap.ui.getCore().byId("operationDetailPopup--btnUpdateDisruption").setVisible(false);
        	sap.ui.getCore().byId("operationDetailPopup--btnCancelDisruption").setVisible(false);
        	sap.ui.getCore().byId("operationDetailPopup--btnReschedule").setVisible(false);


        	airbus.mes.operationstatus.util.ModelManager.getShopOrderOperation();


        	// init the tabindex 
        	$("#operationDetailsView--opDetailSegmentButtons--header-head").attr("tabindex", "-1");
        	$("#operationDetailsView--idStatus").attr("tabindex", "0");
        },


        /***********************************************************
         *
         * Switch Execution Mode for Operation Detail
         *
         * @param oEvent
         */
        switchMode: function (oEvent) {


            var oSwitchButton = oEvent.getSource();

            if (airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/status") == airbus.mes.operationdetail.Formatter.status.blocked) {
                oSwitchButton.setState(false);
                airbus.mes.shell.ModelManager.messageShow(this.getView().getModel("i18n").getProperty("BlockedOperation"));
                return;
            }

            if (oSwitchButton.getState() == true) {
                this.getView().byId("switchStatusLabel").setText(this.getView().getModel("i18n").getProperty("Execution"));

                //when the operation goes on execution mode, it is too activate
                var bResult = airbus.mes.operationstatus.oView.getController().activateOperation();
                if (bResult) {
                    this.setToolbarVisible();
                    oSwitchButton.setEnabled(false);

                    /**
                     * set the buttons according to the status of operation mode
                     */
                    airbus.mes.operationstatus.oView.oController.setOperationActionButtons();

                    if (jQuery.sap.getObject("airbus.mes.qdc.oView") != undefined) {
                        airbus.mes.qdc.oView.getController().enableButtons();
                    }


                } else {
                    oSwitchButton.setEnabled(true);
                    oSwitchButton.setState(false);
                    this.setToolbarVisible();
                    this.getView().byId("switchStatusLabel").setText(this.getView().getModel("i18n").getProperty("ReadOnly"));
                }

            } else {
                this.getView().byId("switchStatusLabel").setText(this.getView().getModel("i18n").getProperty("ReadOnly"));
                //Define visibility for header sections
                this.setToolbarVisible();
            }

        },

        setToolbarVisible: function () {
            var state = sap.ui.getCore().byId("operationDetailsView--switchOperationModeBtn").getState();
            var oModel = [sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0]];
            if (!state) {
                sap.ui.getCore().byId("operationDetailsView--idDisplayOpeAttachments").setVisible(false);
                //It must be possible to reschedule an operation than has not started even when the operation is not in execution mode
                if (airbus.mes.stationtracker.util.GroupingBoxingManager.computeStatus(oModel[0].state, oModel[0].paused, oModel[0].previously_start) === "1") {
                    sap.ui.getCore().byId("operationDetailsView--idReschedule").setVisible(true);
                } else {
                    sap.ui.getCore().byId("operationDetailsView--idReschedule").setVisible(false);
                }
                sap.ui.getCore().byId("operationDetailsView--idtouchngo").setVisible(false);
                sap.ui.getCore().byId("operationDetailsView--idACPnGLinks").setVisible(airbus.mes.acpnglinks.model.ModelManager.checkExistingChildrentData());
                sap.ui.getCore().byId("operationDetailsView--idJignTools").setVisible(false);
                sap.ui.getCore().byId("operationDetailsView--idComponents").setVisible(false);
                sap.ui.getCore().byId("operationDetailsView--idNCDisplay").setVisible(true);
                sap.ui.getCore().byId("operationDetailsView--idTrackingTemplate").setVisible(false);          
            } else {
                sap.ui.getCore().byId("operationDetailsView--idCheckList").setVisible(true);
                sap.ui.getCore().byId("operationDetailsView--idDisruption").setVisible(true);
                sap.ui.getCore().byId("operationDetailsView--idDisplayOpeAttachments").setVisible(true);
                sap.ui.getCore().byId("operationDetailsView--idReschedule").setVisible(true);
                sap.ui.getCore().byId("operationDetailsView--idtouchngo").setVisible(true);
                sap.ui.getCore().byId("operationDetailsView--idJignTools").setVisible(true);
                sap.ui.getCore().byId("operationDetailsView--idACPnGLinks").setVisible(airbus.mes.acpnglinks.model.ModelManager.checkExistingChildrentData());
                sap.ui.getCore().byId("operationDetailsView--idComponents").setVisible(true);
                sap.ui.getCore().byId("operationDetailsView--idNCDisplay").setVisible(true);
                sap.ui.getCore().byId("operationDetailsView--idTrackingTemplate").setVisible(true);
            }
        },

        /***********************************************************
         * Click on segmented button to respective page
         */
        openPage: function (oEvent) {
            var sItemKey = oEvent.getSource().getSelectedKey();

            switch (sItemKey) {
                case "status":
                    airbus.mes.shell.util.navFunctions.operationstatus(this.nav, true);
                    break;
                case "checkList":
                    airbus.mes.shell.util.navFunctions.qdc(this.nav);
                    break;
                case "ncDisplay":
                    airbus.mes.shell.util.navFunctions.ncDisplayLink(this.nav);
                    this.nav.to(airbus.mes.ncdisplay.oView.getId());

                    //rerender the table to get the good row number
                    this.refreshMesTable("ncdisplayView--ncDisplay");
                    break;
                case "disruption":
                    this.goToDisruptionListView();
                    break;

                case "displayOpeAttachments":
                    airbus.mes.shell.util.navFunctions.displayOpeAttachments(this.nav);

                    /** Navigate **/
                    this.nav.to(airbus.mes.displayOpeAttachments.oView.getId());
                    break;
                case "reschedule":
                    var aModel = [sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0]];

                    if (airbus.mes.stationtracker.ReschedulePopover === undefined) {

                        var oModel = airbus.mes.stationtracker.oView.getModel("StationTrackerI18n");
                        airbus.mes.stationtracker.ReschedulePopover = sap.ui.xmlfragment("reschedulePage", "airbus.mes.stationtracker.fragment.Reschedule", airbus.mes.stationtracker.oView.getController());
                        airbus.mes.stationtracker.ReschedulePopover.addStyleClass("alignTextLeft");
                        airbus.mes.stationtracker.ReschedulePopover.setModel(oModel, "i18nModel");
                        this.nav.addPage(airbus.mes.stationtracker.ReschedulePopover);
                    }
                    // Model for the current operation
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData(aModel);

                    airbus.mes.stationtracker.ReschedulePopover.setModel(oModel, "RescheduleModel");
                    airbus.mes.stationtracker.ReschedulePopover.getModel();

                    this.nav.to(airbus.mes.stationtracker.ReschedulePopover.getId());

                    //we can rechedule if operation is different of confirmed
                    if (aModel[0].state != "C") {
                        sap.ui.getCore().byId("operationDetailPopup--btnReschedule").setVisible(true);
                    } else {
                        sap.ui.getCore().byId("operationDetailPopup--btnReschedule").setVisible(false);
                    }
                    break;
                case "touchngo":
                    var selectedSegmentedButton = sap.ui.getCore().byId("operationDetailsView--opDetailSegmentButtons").getSelectedKey();
                    var sWorkOrder = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].wo_no;
                    var operationId = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_id;
                    var erpSystem = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].erp_system.toLowerCase();
                    console.log(erpSystem);

                    var oLink = "touchngo" + erpSystem + "://openpage/operation?workorder=" + sWorkOrder + "&operation=" + operationId;
                    window.open(oLink, "_blank");
                    setTimeout(function () {
                        sap.ui.getCore().byId("operationDetailsView--opDetailSegmentButtons").setSelectedKey(selectedSegmentedButton);
                    }, 2000);
                    break;
                case "jigntools":
                    airbus.mes.shell.util.navFunctions.jigToolsDetail(this.nav);

                    /** Navigate **/
                    this.nav.to(airbus.mes.jigtools.oView.getId());

                    //rerender the table to get the good row number
                    this.refreshMesTable("jigtoolsView--jigToolList");
                    break;
                case "components":
                    airbus.mes.shell.util.navFunctions.componentsDetail(this.nav);

                    /** Navigate **/
                    this.nav.to(airbus.mes.components.oView.getId());

                    sap.ui.getCore().byId("operationDetailPopup--btnCommittedFitted").setVisible(true);
                    airbus.mes.components.oView.getController().setBtnCommittedFittedValue(sap.ui.getCore().byId("operationDetailPopup--btnCommittedFitted"), airbus.mes.components.oView.getController().committedFittedView);

                    //rerender the table to get the good row number
                    this.refreshMesTable("componentsView--ComponentsList");
                    break;
                case "ACPnGLinks":
                    airbus.mes.shell.util.navFunctions.acpnglinksDetail(this.nav);
                    this.nav.to(airbus.mes.acpnglinks.oView.getId());
                    break;
                case "tckTemplate":
                    airbus.mes.shell.util.navFunctions.tckTemplateLink(this.nav);
                    this.nav.to(airbus.mes.trackingtemplate.oView.getId());
                    sap.ui.getCore().byId("operationDetailPopup--btnPrintTckTmplt").setVisible(true);
                    sap.ui.getCore().byId("operationDetailPopup--btnFreezeTT").setVisible(true);
                    break;

                default:
                    break;

            }
        },

        onNavigate: function (oEvent) {


            /***************************************************
             * Show/ Hide Footer Buttons
             */
            //case "idStatusView":
            // Hide buttons
            sap.ui.getCore().byId("operationDetailPopup--btnPause").setVisible(false);
            sap.ui.getCore().byId("operationDetailPopup--btnActivate").setVisible(false);
            sap.ui.getCore().byId("operationDetailPopup--btnConfirm").setVisible(false);
            sap.ui.getCore().byId("operationDetailPopup--btnComplete").setVisible(false);
            sap.ui.getCore().byId("operationDetailPopup--btnAssignToObserver").setVisible(false);

            //Case "ViewDisruptionView":
            // Hide buttons
            sap.ui.getCore().byId("operationDetailPopup--reportDisruption").setVisible(false);


            //case "createDisruptionView":
            // Hide buttons
            sap.ui.getCore().byId("operationDetailPopup--btnCreateDisruption").setVisible(false);
            sap.ui.getCore().byId("operationDetailPopup--btnUpdateDisruption").setVisible(false);
            sap.ui.getCore().byId("operationDetailPopup--btnCancelDisruption").setVisible(false);
            sap.ui.getCore().byId("operationDetailPopup--reportandCloseDisruption").setVisible(false);


            //case "reschedulePage--reschedulePage":
            // Hide buttons
            sap.ui.getCore().byId("operationDetailPopup--btnReschedule").setVisible(false);

            //case tracking template
            sap.ui.getCore().byId("operationDetailPopup--btnPrintTckTmplt").setVisible(false);
            sap.ui.getCore().byId("operationDetailPopup--btnFreezeTT").setVisible(false);

            //set visible false if the view isn't components one
            if (oEvent.mParameters.toId !== "componentsView") {
                sap.ui.getCore().byId("operationDetailPopup--btnCommittedFitted").setVisible(false);
                sap.ui.getCore().byId("operationDetailPopup--btnSave").setVisible(false);
                sap.ui.getCore().byId("operationDetailPopup--btnFreezeComponent").setVisible(false);
            }
            //set visible false if the view isn't components one
            if (oEvent.mParameters.toId !== "TrackingTemplateView") {
                sap.ui.getCore().byId("operationDetailPopup--btnFreezeTT").setVisible(false);
            }
            if (oEvent.mParameters.toId == "ncdisplayView") {
                var oButtonNc = sap.ui.getCore().byId("operationDetailPopup--createNC");
                oButtonNc.setVisible(true);
                var oButtonPnc = sap.ui.getCore().byId("operationDetailPopup--createPNC");
                oButtonPnc.setVisible(true);
                oButtonNc.detachPress(airbus.mes.ncdisplay.oView.oController.onCreateNC);
                oButtonNc.attachPress(airbus.mes.ncdisplay.oView.oController.onCreateNC);
                oButtonPnc.detachPress(airbus.mes.ncdisplay.oView.oController.onCreatePNC);
                oButtonPnc.attachPress(airbus.mes.ncdisplay.oView.oController.onCreatePNC);

            } else {
                sap.ui.getCore().byId("operationDetailPopup--createNC").setVisible(false);
                sap.ui.getCore().byId("operationDetailPopup--createPNC").setVisible(false);
            }

            //fix bad tabindex: issue is active with the statusView because we set the tabindex with jquery in onAfterRendering
            //the tabindex doesn't change so we change it here
            if (oEvent.mParameters.toId !== "idStatusView") {
                $("#operationDetailsView--idStatus").attr("tabindex", "-1");
            }

        },

        renderViews: function (oEvent) {
            //Load Data
            switch (this.nav.getCurrentPage().sId) {

                case "ViewDisruptionView":
                    /** Set buttons visibility ****/
                    airbus.mes.disruptionslist.oView.oController.turnOnOffButtons();
                    break;

                case "createDisruptionView":

                    /*****************************
                     *  Set buttons visibility
                     *****************************/
                    // In case of Update of Disruption
                    if (sap.ui.getCore().getModel("DisruptionDetailModel").getData().messageType != undefined) {

                        // set buttons according to update disruption
                        sap.ui.getCore().byId("operationDetailPopup--btnUpdateDisruption").setVisible(true);
                        sap.ui.getCore().byId("operationDetailPopup--btnCreateDisruption").setVisible(false);
                        sap.ui.getCore().byId("operationDetailPopup--reportandCloseDisruption").setVisible(false);
                        sap.ui.getCore().byId("operationDetailPopup--btnCancelDisruption").setVisible(true);
                    } else {
                        // In case of Creation of disruption
                        // set buttons according to create disruption
                        sap.ui.getCore().byId("operationDetailPopup--btnUpdateDisruption").setVisible(false);
                        sap.ui.getCore().byId("operationDetailPopup--btnCreateDisruption").setVisible(true);
                        sap.ui.getCore().byId("operationDetailPopup--reportandCloseDisruption").setVisible(true);
                        sap.ui.getCore().byId("operationDetailPopup--btnCancelDisruption").setVisible(true);
                    }

                    break;

                case "jigtoolsView":
                    airbus.mes.jigtools.oView.oController.checkSettingJigsTools();
                    break;
                case "ncdisplayView":
                    airbus.mes.ncdisplay.oView.oController.checkSettingNCDisplay();
                    break;
                case "componentsView":
                    airbus.mes.components.oView.oController.checkSettingComponents();
                    break;
                case "trackingTemplateView":
                    airbus.mes.trackingtemplate.oView.oController.checkSettingTrackingTemplate();
                    break;
                default:
            };
        },

        onMissingPartsNotifPress: function (oEvent) {
            airbus.mes.shell.util.navFunctions.componentsDetail(this.nav);
            //set visible the buttons of the components view
            sap.ui.getCore().byId("operationDetailPopup--btnCommittedFitted").setVisible(true);
            if (airbus.mes.components !== undefined && airbus.mes.components.oView !== undefined && airbus.mes.components.oView.oController.committedFittedView) {
                sap.ui.getCore().byId("operationDetailPopup--btnSave").setVisible(true);
                sap.ui.getCore().byId("operationDetailPopup--btnFreezeComponent").setVisible(true);
            }

            //navigate and create the filter fragment
            this.nav.to(airbus.mes.components.oView.getId());
            if (airbus.mes.components.selectFilter === undefined) {
                airbus.mes.components.oView.oController.createSelectFilterPopoverFragment();
            }

            //select the good filter
            var missingPartsFilter = sap.ui.getCore().byId("selectFilter--selectFilterComponents").getItems()[3];
            sap.ui.getCore().byId("selectFilter--selectFilterComponents").removeSelections(true)
            sap.ui.getCore().byId("selectFilter--selectFilterComponents").setSelectedItem(missingPartsFilter);
            airbus.mes.components.oView.oController.onSelectFilterFinish();

        },

        /***********************************************************
         * Open disruption list view screen
         */
        goToDisruptionListView: function () {
            airbus.mes.shell.util.navFunctions.viewDisruptionsList(this.nav,
                sap.ui.getCore().byId("operationDetailPopup--reportDisruption") // Report Disruption Button
            );

            //Load Disruption Data
            airbus.mes.disruptions.ModelManager.loadDisruptionsByOperation();
        },

        refreshMesTable: function (id) {
            //rerender the table to get the good row number
            if (sap.ui.getCore().byId(id)) {
                setTimeout(function () {
                    sap.ui.getCore().byId(id).rerender(true);
                }, 0);
            }
        }

    });

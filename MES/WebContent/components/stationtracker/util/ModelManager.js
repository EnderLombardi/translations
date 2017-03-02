"use strict";

jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("airbus.mes.stationtracker.util.Globals_Functions");
jQuery.sap.declare("airbus.mes.stationtracker.util.ModelManager");
airbus.mes.stationtracker.util.ModelManager = {


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
        ERP_SYSTEM: undefined,
        SFC: undefined,
        OPERATION_BO: undefined
    },

    //     parameters from the settings component
    settings: undefined,
    showDisrupionBtnClicked: false, // button Disruption on Station Tracker clicked
    init: function (core) {

        var aModel = ["operationDetailModel", // Model having operation detail
            "WorkListModel",
            "stationTrackerRModel", // Station tracker model  // reschedule line
            "stationTrackerIModel",  // Station tracker model// initial line
            "shiftsModel", // Shifts// model
            "affectationModel",
            "unPlannedModel", // Unplanned// // model
            "groupModel",  // Unplanned      // Filter// Model
            "OSWModel", // OutStanding// Work      // model
            "stationTrackerShift", // Shifts// for/ station// tracker
            "KPI", // KPI
            "productionGroupModel", // production Group model
            "ressourcePoolModel", // Resource// poolModel
            "groupModel",   // Unplanned// Filter// Model
            "KPIextraWork", // KPI Extra Work
            "KPItaktAdherence", // KPI Takt Adherence
            "phStationSelected", // physical station Selected for Osw
            "KPIshiftStaffing", // KPI Shift Staffing
            "KPItaktEfficiency", // KPI Shift Staffing
            "KPIresolutionEfficiency", // KPI Shift Staffing
            "KPIdisruption", // KPI Resolution Staffing
            "KPIchartTaktAdherence", // KPI Resolution Staffing
            "spentTimedataModel", // KPI Resolution Staffing
            "taktModel",			// Start and End date for takt  
            "SplitDetailModel", // Model for Split Model
            "dispatchFromAcpngModel", //Model for ACPGN status
            "dispatchFromMesModel", //Model for MES status
        ]

        airbus.mes.shell.ModelManager.createJsonModel(core, aModel);
        this.settings = airbus.mes.settings.ModelManager;

        core.getModel("stationTrackerRModel").attachRequestCompleted(airbus.mes.stationtracker.util.ModelManager.onStationTrackerLoad);
        core.getModel("stationTrackerIModel").attachRequestCompleted(airbus.mes.stationtracker.util.ModelManager.onStationTrackerLoadInitial);
        core.getModel("shiftsModel").attachRequestCompleted(airbus.mes.stationtracker.util.ModelManager.onShiftsLoad);
        core.getModel("affectationModel").attachRequestCompleted(airbus.mes.stationtracker.util.ModelManager.onAffectationLoad);
        core.getModel("unPlannedModel").attachRequestCompleted(airbus.mes.stationtracker.util.ModelManager.onUnPlannedLoad);
        core.getModel("OSWModel").attachRequestCompleted(airbus.mes.stationtracker.util.ModelManager.onOWSLoad);
        core.getModel("ressourcePoolModel").attachRequestCompleted(airbus.mes.stationtracker.util.ModelManager.onRessourcePoolLoad);
        core.getModel("phStationSelected").attachRequestCompleted(airbus.mes.stationtracker.util.ModelManager.onPhStationLoad);
        core.getModel("taktModel").attachRequestCompleted(airbus.mes.stationtracker.util.ModelManager.onTaktLoad);
        // Handle URL Model
        this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.stationtracker.config.url_config");

        // Load Data
        this.loadFilterUnplanned();

    },

    setLineAssignment: function (sSite, sStation, sMSN, sUserID, sShiftName, sDay, sLine, sSkill, sModeAssignment, bQACheck) {
        var seturlLineAssignment = this.urlModel.getProperty('urlsetlineassignment');
        seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$site", sSite);
        seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$station", sStation);
        seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$msn", sMSN);
        seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$userid", sUserID);
        seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$shiftName", sShiftName);
        seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$day", sDay);
        seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$line", sLine);
        seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$skill", sSkill);
        // seturlLineAssignment = this.replaceURI(seturlLineAssignment,
        // "$myuserid", sMyUserID);
        seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$mode", sModeAssignment);
        seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$qacheck", bQACheck);

        $
            .ajax({
                url: seturlLineAssignment,
                cache: false,
                success: function (data, textStatus, jqXHR) {
                    // Handle Local url_config
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    if (airbus.mes.shell.util.Formatter
                        .getMiiMessageType(data) == "E") {
                        sap.m.MessageToast
                            .show(airbus.mes.shell.util.Formatter
                                .getMiiTextFromData(data));
                    } else if (data.Rowsets.Rowset != undefined) {
                        if (data.Rowsets.Rowset[0].Row[0].message == "W") {
                            var checkQAModel = new sap.ui.model.json.JSONModel();
                            checkQAModel.setData(data.Rowsets.Rowset[1]);
                            airbus.mes.stationtracker.oView.getController()
                                .openCheckQAPopup(checkQAModel);
                        } else if (data.Rowsets.Rowset[0].Row[0].message == "S") {
                            airbus.mes.shell.oView.getController()
                                .renderStationTracker();
                            airbus.mes.stationtracker.oPopoverPolypoly
                                .close();
                        }
                    } else {// if (data.Rowsets.Rowset[0].Row[0].message ==
                        // "S"){
                        airbus.mes.shell.oView.getController()
                            .renderStationTracker();
                        airbus.mes.stationtracker.oPopoverPolypoly.close();
                    }
                    //we reload the work tracker
                    airbus.mes.stationtracker.util.ModelManager.loadSplitModel();
                },
            });
    },

    loadAffectation: function () {

        var oData = airbus.mes.stationtracker.util.ModelManager.settings;
        var geturlAffectation = this.urlModel.getProperty('urlaffectation');

        geturlAffectation = airbus.mes.stationtracker.util.ModelManager.replaceURI(
            geturlAffectation, "$site", oData.site);
        geturlAffectation = airbus.mes.stationtracker.util.ModelManager.replaceURI(
            geturlAffectation, "$station", oData.station);
        geturlAffectation = airbus.mes.stationtracker.util.ModelManager.replaceURI(
            geturlAffectation, "$msn", oData.msn);

        var oViewModel = sap.ui.getCore().getModel("affectationModel");
        oViewModel.loadData(geturlAffectation, null, false);

    },

    onAffectationLoad: function () {

        var oModel = sap.ui.getCore().getModel("affectationModel");

        if (oModel.getProperty("/Rowsets/Rowset/0/Row")) {

            oModel = sap.ui.getCore().getModel("affectationModel").oData.Rowsets.Rowset[0].Row;

        } else {
            // oModel.oData.Rowsets.Rowset[0].Row = [];
            console.log("no affectationModel load");
        }
        airbus.mes.stationtracker.util.AssignmentManager.computeAffectationHierarchy();

    },

    loadDispatchFromAcpngModel: function () {

        var oData = airbus.mes.stationtracker.util.ModelManager.settings;
        var opeData = airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0];


        var oViewModel = sap.ui.getCore().getModel("dispatchFromAcpngModel");
        var getUrlAcpngStatus = this.urlModel.getProperty("urlDispatchFromAcpng");

        getUrlAcpngStatus = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(getUrlAcpngStatus, "$site", oData.site);

        getUrlAcpngStatus = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(getUrlAcpngStatus, "$workorder", opeData.wo_no);

        getUrlAcpngStatus = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(getUrlAcpngStatus, "$operation", opeData.operation_id);

        oViewModel.loadData(getUrlAcpngStatus, null, true);


    },

    loadDispatchFromMesModel: function () {
        var oData = airbus.mes.stationtracker.util.ModelManager.settings;
        var opeData = airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0];

        var oViewModel = sap.ui.getCore().getModel("dispatchFromMesModel");
        var getUrlMesStatus = this.urlModel.getProperty("urlDispatchFromMes");

        getUrlMesStatus = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(getUrlMesStatus, "$site", oData.site);

        getUrlMesStatus = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(getUrlMesStatus, "$workorder", opeData.wo_no);

        getUrlMesStatus = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(getUrlMesStatus, "$operation", opeData.operation_id);

        getUrlMesStatus = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(getUrlMesStatus, "$sfcstep", opeData.sfc_step_ref);

        oViewModel.loadData(getUrlMesStatus, null, true);


    },

    loadStationTracker: function (sType) {

        var oData = airbus.mes.stationtracker.util.ModelManager.settings;
        this.operationType = sType;

        var geturlstationtracker = this.urlModel
            .getProperty('urlstationtrackeroperation');
        geturlstationtracker = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(geturlstationtracker, "$site", oData.site);
        geturlstationtracker = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(geturlstationtracker, "$station", oData.station);
        geturlstationtracker = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(geturlstationtracker, "$msn", oData.msn);
        geturlstationtracker = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(geturlstationtracker, "$operationType", sType);
        geturlstationtracker = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(geturlstationtracker, "$productionGroup",
            oData.prodGroup);
        geturlstationtracker = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(
            geturlstationtracker,
            "$user",
            airbus.mes.stationtracker.util.AssignmentManager.userSelected);
        //console.log(geturlstationtracker);
        var oViewModel;
        switch (sType) {
            case "R":
                oViewModel = sap.ui.getCore().getModel("stationTrackerRModel");
                break;
            case "I":
                oViewModel = sap.ui.getCore().getModel("stationTrackerIModel");
                break;
            case "U":
                airbus.mes.stationtracker.oView.byId("unplannedButton").setBusy(true);
                oViewModel = sap.ui.getCore().getModel("unPlannedModel");
                break;
            case "O":
                airbus.mes.stationtracker.oView.byId("oswButton").setBusy(true);
                oViewModel = sap.ui.getCore().getModel("OSWModel");
                break;
            default:

        }

        oViewModel.loadData(geturlstationtracker, null, true);

    },
    computeStatus: function (aModel) {

        aModel.forEach(function (el) {

            // TODO : factorize this computation
            // Developped too on ModelManager.js
            var sStatus = "0";
            // Operation is active

            if (el.PAUSED === "false") {

                sStatus = "2";
            }

            // Operation is not started
            if (el.PAUSED === "---") {

                sStatus = "1";

                // Operation is pause
                if (el.PAUSED === "---" && el.PROGRESS != "0") {

                    sStatus = "3";
                }

            }

            // Operation Completed
            if (el.STATE === "C") {

                sStatus = "0";
            }

            el.status = sStatus;
        });

    },
    /***************************************************************************
     * Import OSw or UNplanned activities selected in gantt before importing it
     * call the check QA and display it if operation are inserted and the user
     * affected has no QA
     *
     * @param {ARRAY} aItem, List of sfcStepBO selected
     * @param {STRING} sProdgroups, Value of Prod group selected
     * @param {STRING} sCheckQa Perform the CheckQA or not true/false
     * @param {BOOLEAN} bOuStanding Permit to know if we import unplanned or Osw
     ****************************************************************************/
    setOSW: function (aItem, sProdgroups, sCheckQa, bOuStanding) {
        //sCheckQa true dont do check Qa
        //sCheckQa false do check Qa
        //bOuStanding = true insert OSW
        //bOuStanding = false insert unplanned

        // This is done to keep dmi xml format Rowsets/Rowset/Row/ect..
        var sXmlStart = '<?xml version="1.0" encoding="iso-8859-1"?><Rowsets><Rowset>';
        var sXmlEnd = '</Rowset></Rowsets>';
        var sXmlByRow = "";

        aItem.forEach(function (el) {
            sXmlByRow += airbus.mes.stationtracker.util.Formatter.json2xml({
                Row: {
                    sfcStepBO: [el.sfcStepBO],
                    Previous_Skill: [el.Previous_Skill],
                    Previous_Line: [el.Previous_Line],
                    Skill: [el.Skill],
                    Line: [el.Line],
                },
            })
        })

        var sXml = sXmlStart + sXmlByRow + sXmlEnd;
        var sDateShift = airbus.mes.settings.ModelManager.taktStart;
        var oData = airbus.mes.stationtracker.util.ModelManager.settings;
        var geturlsetosw = this.urlModel.getProperty('urlsetosw');

        geturlsetosw = airbus.mes.stationtracker.util.ModelManager.replaceURI(geturlsetosw, "$site", oData.site);
        geturlsetosw = airbus.mes.stationtracker.util.ModelManager.replaceURI(geturlsetosw, "$sCheckQa", sCheckQa);
        geturlsetosw = airbus.mes.stationtracker.util.ModelManager.replaceURI(geturlsetosw, "$bOuStanding", bOuStanding);
        geturlsetosw = airbus.mes.stationtracker.util.ModelManager.replaceURI(geturlsetosw, "$sProdgroups", sProdgroups);
        geturlsetosw = airbus.mes.stationtracker.util.ModelManager.replaceURI(geturlsetosw, "$station", oData.station);
        geturlsetosw = airbus.mes.stationtracker.util.ModelManager.replaceURI(geturlsetosw, "$msn", oData.msn);
        geturlsetosw = airbus.mes.stationtracker.util.ModelManager.replaceURI(geturlsetosw, "$sDateShift", sDateShift);
        geturlsetosw = airbus.mes.stationtracker.util.ModelManager.replaceURI(geturlsetosw, "$sXml", sXml);

        $.ajax({

            url: geturlsetosw,
            success: function (data, textStatus, jqXHR) {
                // Handle Local url_config
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                if (airbus.mes.shell.util.Formatter.getMiiMessageType(data) == "E") {
                    sap.m.MessageToast.show(airbus.mes.shell.util.Formatter.getMiiTextFromData(data));
                    console.log("no import done");
                } else if (data.Rowsets.Rowset != undefined) {
                    if (data.Rowsets.Rowset[0].Row[0].message == "W") {
                        var checkQAModel = new sap.ui.model.json.JSONModel();
                        checkQAModel.setData(data.Rowsets.Rowset[1]);
                        //Permit to display button ok and cancel
                        airbus.mes.stationtracker.util.AssignmentManager.checkQA = false;
                        airbus.mes.stationtracker.oView.getController().openCheckQAPopup(checkQAModel);
                    } else if (data.Rowsets.Rowset[0].Row[0].message == "S") {
                        // reuse default value of CheckQa permit to add user when checkQa is use
                        airbus.mes.stationtracker.CheckQa = "";
                        airbus.mes.shell.oView.getController().renderStationTracker();
                        airbus.mes.stationtracker.ImportOswUnplannedPopover.close();
                        if (airbus.mes.stationtracker.dialogProdGroup != undefined) { airbus.mes.stationtracker.dialogProdGroup.close(); }
                    }
                } else {

                    airbus.mes.shell.oView.getController().renderStationTracker();
                    airbus.mes.stationtracker.ImportOswUnplannedPopover.close();
                    if (airbus.mes.stationtracker.dialogProdGroup != undefined) { airbus.mes.stationtracker.dialogProdGroup.close(); }
                }
            },
        });

        console.log(sXml);

    },

    onUnPlannedLoad: function () {

        airbus.mes.stationtracker.oView.byId("unplannedButton").setBusy(false);
        var aModel = sap.ui.getCore().getModel("unPlannedModel");

        if (!aModel.getProperty("/Rowsets/Rowset/0/Row")) {

            aModel = [];
            console.log("no Unplanned operation load");

        } else {
            aModel = aModel.getProperty("/Rowsets/Rowset/0/Row");

            try {
                aModel.forEach(function (el) {

                    if (el.RMA_STATUS_COLOR != "---") {

                        el.RMA_STATUS_COLOR = "1";

                    } else {

                        el.RMA_STATUS_COLOR = "0";
                    }

                })

            } catch (e) {
                console.log("formating unplanned does not work");
                console.log(e);
            }

        }

        // Compute status for Unplanned and OSW Model
        airbus.mes.stationtracker.util.ModelManager.computeStatus(aModel);

    },

    onOWSLoad: function () {

        airbus.mes.stationtracker.oView.byId("oswButton").setBusy(false);
        var aModel = sap.ui.getCore().getModel("OSWModel");

        if (!aModel.getProperty("/Rowsets/Rowset/0/Row")) {

            aModel = [];
            console.log("no OWS operation load");

        } else {

            aModel = aModel.getProperty("/Rowsets/Rowset/0/Row")
        }
        // Compute status for Unplanned and OSW Model
        airbus.mes.stationtracker.util.ModelManager.computeStatus(aModel);

    },

    loadFilterUnplanned: function () {
        var oViewModel = sap.ui.getCore().getModel("groupModel");
        oViewModel.loadData(this.urlModel.getProperty("urlgroupmodel"), null,
            false);
        airbus.mes.stationtracker.util.ModelManager.filterUnplanned = oViewModel;

    },
    loadRessourcePool: function (syncCall) {

        var oData = airbus.mes.stationtracker.util.ModelManager.settings;
        var oViewModel = sap.ui.getCore().getModel("ressourcePoolModel");
        var geturlressourcepool = this.urlModel.getProperty("urlressourcepool");

        geturlressourcepool = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(geturlressourcepool, "$site", oData.site);
        geturlressourcepool = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(geturlressourcepool, "$station", oData.station);
        geturlressourcepool = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(geturlressourcepool, "$msn", oData.msn);
        oViewModel.loadData(geturlressourcepool, null, syncCall);

    },

    /**
     * This function is called each time we load the ressourcePoolModel.
     * The goal is to filter the list of user in the ressourcePoolModel.
     * In this function, the following things are done : 
     *  - The viewModel is feed with 2 more values : All Users and No Users
     *  - The list of  ressourcePoolModel is filter in order not to have the same user twice in the list.
     *  - The workTracker view is reload by calling the loadSplitModel function if we are in worktracker Mode.
     *  - The ‘show KPIs’ button is grayed out in the case of operator filter applied (workTracker Mode).
     */
    onRessourcePoolLoad: function () {

        var aModel = sap.ui.getCore().getModel("ressourcePoolModel");
        var MyModele = airbus.mes.shell.util.navFunctions.splitMode;
        var previousUserSelected = airbus.mes.stationtracker.util.AssignmentManager.userSelected;
        var previousUserSelectedDeleted = true;

        if (aModel.getProperty("/Rowsets/Rowset/0/Row")) {

            var workTrackerUser = aModel.oData.Rowsets.Rowset[0].Row[0].user;

            aModel.oData.Rowsets.Rowset[0].Row.unshift({
                "firstName": "No Users",
                "user": "No",
            });

            aModel.oData.Rowsets.Rowset[0].Row.unshift({
                "firstName": "All Users",
                "user": "ALL",
            });

            var currentUser = sap.ui.getCore().getModel("Profile").getData().connectedUser.uniquename;

            aModel.oData.Rowsets.Rowset[0].Row = aModel.oData.Rowsets.Rowset[0].Row.reduce(function (field, e1) {
                if (previousUserSelected === e1.user) {
                    previousUserSelectedDeleted = false;
                }
                if (e1.user === currentUser) {
                    //if the currentUser belong to the ressource pool list, we set if as the user to load.
                    //otherwise, we keep the first user of the ressource pool list. 
                    workTrackerUser = currentUser;
                }
                var matches = field.filter(function (e2) { return e1.user === e2.user });
                if (matches.length === 0) {
                    field.push(e1);
                } return field;
            }, []);

            sap.ui.getCore().getModel("ressourcePoolModel").refresh(true);

            if (MyModele === "WorkTracker") {
                //we load the splitModel only if we are in workTracker mode.
                if (airbus.mes.stationtracker.util.AssignmentManager.userSelected === '%') {
                    //if the previous user selected was "ALL USERS" we assigne the user to load at workTrackerUser
                    airbus.mes.stationtracker.util.AssignmentManager.userSelected = workTrackerUser;
                    if ( sap.ui.getCore().getModel("Profile").getProperty("/identifiedUser/permissions/STATION_KPI_TAKT") ) {
                        airbus.mes.stationtracker.oView.byId("hideKPI").setEnabled(false);
                        airbus.mes.stationtracker.oView.oController.hideKPI();
                    }

                } else if (previousUserSelectedDeleted) {
                    airbus.mes.shell.util.navFunctions.splitMode = "StationTracker";
                    airbus.mes.stationtracker.oView.byId("stationTrackerView--StationtrackerTitle").setText("Station Tracker");
                    airbus.mes.stationtracker.util.AssignmentManager.userSelected = '%';
                    sap.ui.getCore().byId("stationTrackerView--selectUser").setSelectedKey("ALL");
                    airbus.mes.stationtracker.oView.byId("splitWorkTra").removeContentArea(1);
                    sap.ui.getCore().byId("stationTrackerView--splitWorkTra").rerender();
                    airbus.mes.stationtracker.oView.byId("splitWorkTra").removeContentArea(airbus.mes.stationtracker.splitterWorkTracker);
                    if (!airbus.mes.stationtracker.oView.byId("kpi_header").getExpanded()) {
                        $("#stationTrackerView--splitWorkTra").addClass("withoutKPI");
                    }
                    airbus.mes.shell.oView.getController().loadStationTrackerGantKPI();
                    return;
                } else {
                    //if the previous user selected was different and is still in the ressourcePoolList
                    workTrackerUser = airbus.mes.stationtracker.util.AssignmentManager.userSelected;
                    if ( sap.ui.getCore().getModel("Profile").getProperty("/identifiedUser/permissions/STATION_KPI_TAKT") ) {
                        airbus.mes.stationtracker.oView.byId("hideKPI").setEnabled(false);
                        airbus.mes.stationtracker.oView.oController.hideKPI();
                    }
                }
                sap.ui.getCore().byId("stationTrackerView--selectUser").setSelectedKey(workTrackerUser);
                airbus.mes.stationtracker.util.ModelManager.loadSplitModel(workTrackerUser);
            } else if (airbus.mes.stationtracker.util.AssignmentManager.userSelected !== "No") {
                //if we are in station stacker mode we reset the user to --> ALL USERS in order to reload the complete station tracker list
                airbus.mes.stationtracker.util.AssignmentManager.userSelected = '%';
                if ( sap.ui.getCore().getModel("Profile").getProperty("/identifiedUser/permissions/STATION_KPI_TAKT") ) {
                airbus.mes.stationtracker.oView.byId("hideKPI").setEnabled(true);
                airbus.mes.stationtracker.oView.oController.showKPI();
                }
                sap.ui.getCore().byId("stationTrackerView--selectUser").setSelectedKey("ALL");
            }

        } else {
            console.log("NO user in ressource pool");
        }

    },
    loadProductionGroup: function () {

        var oData = airbus.mes.stationtracker.util.ModelManager.settings;
        var geturlstationtracker = this.urlModel
            .getProperty('urlproductiongroup');

        geturlstationtracker = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(geturlstationtracker, "$station", oData.station);
        geturlstationtracker = airbus.mes.stationtracker.util.ModelManager
            .replaceURI(geturlstationtracker, "$plant", oData.site);

        var oViewModel = sap.ui.getCore().getModel("productionGroupModel");
        oViewModel.loadData(geturlstationtracker, null, true);
        airbus.mes.stationtracker.util.ModelManager.ProductionGroup = oViewModel;

    },
    loadKPI: function () {
        var oViewModel = sap.ui.getCore().getModel("KPI");
        oViewModel.loadData(this.urlModel.getProperty("urlKPI"), null, true);
        airbus.mes.stationtracker.util.ModelManager.KPI = oViewModel;

        //        // Model For the Disruption Andon KPI
        //        var oDisruptionAndonModel = sap.ui.getCore().getModel("disruptionAndonKPI");
        //        var urlDisruptionKpi = this.urlModel.getProperty("urlDisruptionKpi");
        //        urlDisruptionKpi = airbus.mes.settings.ModelManager.replaceURI(urlDisruptionKpi, "$site", airbus.mes.settings.ModelManager.site);
        //        urlDisruptionKpi = airbus.mes.settings.ModelManager.replaceURI(urlDisruptionKpi, "$station", airbus.mes.settings.ModelManager.station);
        //        oDisruptionAndonModel.loadData(urlDisruptionKpi, null, true);

        this.loadKPIextraWork();
        this.loadKPItaktAdherence();
        //        this.loadKPIshiftStaffing(); Moved to the end of this.selectMyShift()
        this.loadKPItaktEfficiency();
        this.loadKPIresolutionEfficiency();
        this.loadKPIdisruption();
        this.loadKPIchartTaktAdherence();

    },
    loadKPIextraWork: function () {
        var oViewModel = sap.ui.getCore().getModel("KPIextraWork");
        airbus.mes.stationtracker.oView.byId("boxExtraWork").setBusy(true);
        jQuery.ajax({
            type: 'post',
            url: this.urlModel.getProperty("urlKPIextraWork"),
            contentType: 'application/json',
            data: JSON.stringify({
                "site": airbus.mes.settings.ModelManager.site,
                "station": airbus.mes.settings.ModelManager.station,
                "msn": airbus.mes.settings.ModelManager.msn
            }),

            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                oViewModel.setData(data);
                airbus.mes.stationtracker.oView.byId("boxExtraWork").setBusy(false);
            },

            error: function (error, jQXHR) {
                console.log(error);
                airbus.mes.stationtracker.oView.byId("boxExtraWork").setBusy(false);
            }
        });
    },
    loadKPItaktAdherence: function () {
        var oViewModel = sap.ui.getCore().getModel("KPItaktAdherence");
        airbus.mes.stationtracker.oView.byId("boxTaktAdherenceRight").setBusy(true);
        jQuery.ajax({
            type: 'post',
            url: this.urlModel.getProperty("urlKPItaktAdherence"),
            contentType: 'application/json',
            data: JSON.stringify({
                "site": airbus.mes.settings.ModelManager.site,
                "currentStation": airbus.mes.settings.ModelManager.station,
                "msn": airbus.mes.settings.ModelManager.msn
            }),

            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                oViewModel.setData(data);
                airbus.mes.stationtracker.oView.byId("boxTaktAdherenceRight").setBusy(false);
            },

            error: function (error, jQXHR) {
                console.log(error);
                airbus.mes.stationtracker.oView.byId("boxTaktAdherenceRight").setBusy(false);

            }
        });
    },

    loadKPIshiftStaffing: function () {
        var oViewModel = sap.ui.getCore().getModel("KPIshiftStaffing");
        airbus.mes.stationtracker.oView.byId("boxShiftStaffing").setBusy(true);
        jQuery.ajax({
            type: 'post',
            url: this.urlModel.getProperty("urlKPIshiftStaffing"),
            contentType: 'application/json',
            data: JSON.stringify({
                "site": airbus.mes.settings.ModelManager.site,
                "physicalStation": airbus.mes.settings.ModelManager.station,
                "msn": airbus.mes.settings.ModelManager.msn,
                "day": airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.day,
                "shift": airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.shiftName
            }),

            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                oViewModel.setData(data);
                airbus.mes.stationtracker.oView.byId("boxShiftStaffing").setBusy(false);
            },

            error: function (error, jQXHR) {
                console.log(error);
                airbus.mes.stationtracker.oView.byId("boxShiftStaffing").setBusy(false);

            }
        });
    },

    loadKPItaktEfficiency: function () {
        var oViewModel = sap.ui.getCore().getModel("KPItaktEfficiency");
        airbus.mes.stationtracker.oView.byId("boxSLBEfficiecy").setBusy(true);
        airbus.mes.stationtracker.oView.byId("boxLabourEfficiency").setBusy(true);
        jQuery.ajax({
            type: 'post',
            url: this.urlModel.getProperty("urlKPItaktEfficiency"),
            contentType: 'application/json',
            data: JSON.stringify({
                "site": airbus.mes.settings.ModelManager.site,
                "currentStation": airbus.mes.settings.ModelManager.station,
                "msn": airbus.mes.settings.ModelManager.msn
            }),

            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                oViewModel.setData(data);
                airbus.mes.stationtracker.oView.byId("boxSLBEfficiecy").setBusy(false);
                airbus.mes.stationtracker.oView.byId("boxLabourEfficiency").setBusy(false);
            },

            error: function (error, jQXHR) {
                console.log(error);
                airbus.mes.stationtracker.oView.byId("boxSLBEfficiecy").setBusy(false);
                airbus.mes.stationtracker.oView.byId("boxLabourEfficiency").setBusy(false);

            }
        });
    },

    loadKPIresolutionEfficiency: function () {
        var oViewModel = sap.ui.getCore().getModel("KPIresolutionEfficiency");
        airbus.mes.stationtracker.oView.byId("boxResolutionEfficiency").setBusy(true);
        jQuery.ajax({
            type: 'post',
            url: this.urlModel.getProperty("urlKPIresolutionEfficiency"),
            contentType: 'application/json',
            data: JSON.stringify({
                "site": airbus.mes.settings.ModelManager.site,
                "station": airbus.mes.settings.ModelManager.station,
                "msn": airbus.mes.settings.ModelManager.msn
            }),

            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                oViewModel.setData(data);
                airbus.mes.stationtracker.oView.byId("boxResolutionEfficiency").setBusy(false);
            },

            error: function (error, jQXHR) {
                console.log(error);
                airbus.mes.stationtracker.oView.byId("boxResolutionEfficiency").setBusy(false);

            }
        });
    },

    loadKPIdisruption: function () {
        var oViewModel = sap.ui.getCore().getModel("KPIdisruption");
        airbus.mes.stationtracker.oView.byId("boxOpenDisruptions").setBusy(true);
        jQuery.ajax({
            type: 'post',
            url: this.urlModel.getProperty("urlKPIdisruption"),
            contentType: 'application/json',
            data: JSON.stringify({
                "site": airbus.mes.settings.ModelManager.site,
                "station": airbus.mes.settings.ModelManager.station,
                "msn": airbus.mes.settings.ModelManager.msn
            }),

            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                oViewModel.setData(data);
                airbus.mes.stationtracker.oView.byId("boxOpenDisruptions").setBusy(false);
            },

            error: function (error, jQXHR) {
                console.log(error);
                airbus.mes.stationtracker.oView.byId("boxOpenDisruptions").setBusy(false);

            }
        });
    },

    loadKPIchartTaktAdherence: function () {
        var oViewModel = sap.ui.getCore().getModel("KPIchartTaktAdherence");
        airbus.mes.stationtracker.oView.byId("chartId").setBusy(true);
        jQuery.ajax({
            type: 'post',
            url: this.urlModel.getProperty("urlKPIchartTaktAdherence"),
            contentType: 'application/json',
            data: JSON.stringify({
                "site": airbus.mes.settings.ModelManager.site,
                "currentStation": airbus.mes.settings.ModelManager.station,
                "msn": airbus.mes.settings.ModelManager.msn
            }),

            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                if (data.realHoursConfirmed.length == undefined) {
                    data.realHoursConfirmed = [data.realHoursConfirmed];
                }
                if (data.plannedHoursToBeConfirmed.length == undefined) {
                    data.plannedHoursToBeConfirmed = [data.plannedHoursToBeConfirmed];
                }
                oViewModel.setData(data);
                airbus.mes.stationtracker.oView.byId("chartId").setBusy(false);
            },

            error: function (error, jQXHR) {
                console.log(error);
                airbus.mes.stationtracker.oView.byId("chartId").setBusy(false);

            }
        });
    },

    /**
     * Used to update data of shift combobox regarding the day of the gantt
     *
     */
    selectMyShift: function () {
        // stationTrackerShift model
        var oView = airbus.mes.stationtracker.oView;
        var options = airbus.mes.stationtracker.util.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.util.ShiftManager.current_day];
        var modelarray = [];
        var sShiftName = "";
        // var i = 0; not used
        for (var prop in options) {
            // skip loop if the property is from prototype
            if (!options.hasOwnProperty(prop))
                continue;

            airbus.mes.stationtracker.util.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.util.ShiftManager.current_day][prop]
                .forEach(function (key1, index) {

                    sShiftName = airbus.mes.stationtracker.util.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.util.ShiftManager.current_day][prop][index].shiftName;

                });

            var element = {};
            element.value = prop;
            element.visible = airbus.mes.stationtracker.util.ShiftManager.dayDisplay;
            element.shiftName = sShiftName;
            element.day = airbus.mes.stationtracker.util.ShiftManager.current_shift.day;
            element.shiftID = prop;
            modelarray.push(element);

        }

        oView.getModel("stationTrackerShift").setData(modelarray);
        oView.getModel("stationTrackerShift").refresh();

        if (airbus.mes.stationtracker.util.ShiftManager.dayDisplay) {

            if (airbus.mes.stationtracker.util.ShiftManager.selectFirstShift) {

                //when using Arrow in gantt we select the first shift of the day
                airbus.mes.stationtracker.oView.byId("selectShift").fireChange(0);
                airbus.mes.stationtracker.util.ShiftManager.selectFirstShift = false;

            } else {

                // Select the previous shift selected
                airbus.mes.stationtracker.oView.byId("selectShift").setSelectedIndex(airbus.mes.stationtracker.util.ShiftManager.sIndexCombobox);
                airbus.mes.stationtracker.oView.byId("selectShift").rerender();
                //airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.shiftID);                airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.shiftID);
                airbus.mes.stationtracker.oView.byId("selectShift").fireChange(0);

            }

        }

        if (airbus.mes.stationtracker.util.ShiftManager.shiftDisplay && airbus.mes.stationtracker.util.ShiftManager.current_shift != undefined) {

            airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.shiftName = airbus.mes.stationtracker.util.ShiftManager.current_shift.shiftName;
            airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.shiftID = airbus.mes.stationtracker.util.ShiftManager.current_shift.shiftID;
            airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.day = airbus.mes.stationtracker.util.ShiftManager.current_shift.day;
            airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.StartDate = airbus.mes.stationtracker.util.ShiftManager.current_shift.StartDate;

            airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.shiftID);
            scheduler.updateView(airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.StartDate);

        }

        var oDate = new Date($("#stationTrackerView--stationtracker")[0].children[0].children[0].textContent.split("-")[0]);
        var oFormatddMMyyy = sap.ui.core.format.DateFormat.getInstance({
            pattern: "dd MMM yyyy",
            calendarType: sap.ui.core.CalendarType.Gregorian
        });
        var oText = airbus.mes.stationtracker.oView.byId("dateButton");
        oText.setText(oFormatddMMyyy.format(oDate));

        this.loadKPIshiftStaffing();
    },
    onStationTrackerLoad: function () {

        var GroupingBoxingManager = airbus.mes.stationtracker.util.GroupingBoxingManager;

        airbus.mes.stationtracker.util.ModelManager.fIsLoad++;
        // initial model and rescheduled model are load in same time it permit to redenrer stationtracker only one time
        // when both are finish
        if (airbus.mes.stationtracker.util.ModelManager.fIsLoad > 1) {
            airbus.mes.stationtracker.util.ModelManager.fIsLoad = 0;
            GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);
        }

    },

    onStationTrackerLoadInitial: function () {

        var GroupingBoxingManager = airbus.mes.stationtracker.util.GroupingBoxingManager;
        airbus.mes.stationtracker.util.ModelManager.fIsLoad++;
        // initial model and rescheduled model are load in same time it permit to redenrer stationtracker only one time
        // when both are finish
        if (airbus.mes.stationtracker.util.ModelManager.fIsLoad > 1) {
            airbus.mes.stationtracker.util.ModelManager.fIsLoad = 0;
            GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);
        }
    },

    loadShifts: function () {

        var oViewModelshift = sap.ui.getCore().getModel("shiftsModel");
        var getUrlShifts = this.urlModel.getProperty("urlshifts");
        var oData = airbus.mes.stationtracker.util.ModelManager.settings;
        var reqResult = "";
        getUrlShifts = airbus.mes.stationtracker.util.ModelManager.replaceURI(getUrlShifts, "$site", oData.site);
        getUrlShifts = airbus.mes.stationtracker.util.ModelManager.replaceURI(getUrlShifts, "$station", oData.station);
        getUrlShifts = airbus.mes.stationtracker.util.ModelManager.replaceURI(getUrlShifts, "$msn", oData.msn);

        oViewModelshift.loadData(getUrlShifts, null, false);

        reqResult = airbus.mes.shell.util.Formatter
            .getMiiMessageType(oViewModelshift.oData);

        switch (reqResult) {
            case "S":
                break;
            case "E":
                sap.m.MessageToast.show("Error : "
                    + airbus.mes.shell.util.Formatter
                        .getMiiTextFromData(oViewModelshift.oData));
                break;
            default:
        }

    },
    onShiftsLoad: function () {

        var GroupingBoxingManager = airbus.mes.stationtracker.util.GroupingBoxingManager;
        GroupingBoxingManager.parseShift();
    },

    replaceURI: function (sURI, sFrom, sTo) {
        return sURI.replace(sFrom, encodeURIComponent(sTo));
    },

    sendRescheduleRequest: function (bCheckQa, oFinal, oInitial) {

        // get Url of the service
        var urlReschedulingService = this.urlModel.getProperty("urlReschedulingService");
        var oData = airbus.mes.stationtracker.util.ModelManager.settings;
        var splitId;
        var splitIdI;
        var lengthId;
        var lengthIdI;
        var line;
        var skill;
        var lineI;
        var skillI;

        splitId = oFinal.section_id.split("_");
        lengthId = splitId.length;
        if (lengthId > 1) {
            line = splitId[lengthId - 2];
            skill = splitId[lengthId - 1]
        }

        splitIdI = oInitial.section_id.split("_");
        lengthIdI = splitIdI.length;
        if (lengthIdI > 1) {
            lineI = splitIdI[lengthIdI - 2];
            skillI = splitIdI[lengthIdI - 1]
        }


        jQuery.ajax({
            async: false,
            url: urlReschedulingService,
            data: {
                "Param.1": oData.site,
                "Param.2": bCheckQa,
                "Param.3": oInitial.ProdGroup,
                "Param.4": oData.station,
                "Param.5": oData.msn,
                "Param.6": airbus.mes.stationtracker.util.Formatter.dDate2sDate(oFinal.start_date),
                "Param.7": oInitial.sSfcStep,
                "Param.8": line,
                "Param.9": skill,
                "Param.10": lineI,
                "Param.11": skillI,
            },

            success: function (data, textStatus, jqXHR) {
                // Handle Local url_config
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                if (airbus.mes.shell.util.Formatter.getMiiMessageType(data) == "E") {
                    sap.m.MessageToast.show(airbus.mes.shell.util.Formatter.getMiiTextFromData(data));
                    airbus.mes.shell.oView.getController().renderStationTracker();
                } else if (data.Rowsets.Rowset != undefined) {
                    if (data.Rowsets.Rowset[0].Row[0].message == "W") {
                        var checkQAModel = new sap.ui.model.json.JSONModel();
                        checkQAModel.setData(data.Rowsets.Rowset[1]);
                        //Permit to display button continue and cancel
                        airbus.mes.stationtracker.util.AssignmentManager.checkQA = false;
                        //Permit to relaunch rescheduling after the check Qa
                        airbus.mes.stationtracker.CheckQa = "RESCHEDULING";
                        airbus.mes.stationtracker.oView.getController().openCheckQAPopup(checkQAModel);
                        airbus.mes.shell.oView.getController().renderStationTracker();
                    } else if (data.Rowsets.Rowset[0].Row[0].message == "S") {
                        airbus.mes.shell.oView.getController().renderStationTracker();
                    }
                } else {

                    airbus.mes.shell.oView.getController().renderStationTracker();
                    airbus.mes.stationtracker.dialogProdGroup.close();
                    airbus.mes.stationtracker.ImportOswUnplannedPopover.close();
                }
                //we reload the work tracker
                airbus.mes.stationtracker.util.ModelManager.loadSplitModel();
            },

        });
    },
    
    // Reschedule AVL Line(s)
    sendRescheduleLineRequest: function (lines) {
        // get Url of the service
        var urlReschedulingLineService = this.urlModel.getProperty("urlReschedulingLineService");
        var oData = airbus.mes.stationtracker.util.ModelManager.settings;
        
        
        // Get current shift id
		var oShift = airbus.mes.stationtracker.util.ShiftManager.ShiftSelected;
		console.log("Current shift ID: " + oShift.shiftID);
		var fIndexShift = airbus.mes.stationtracker.util.ShiftManager.closestShift(oShift.StartDate);
		
		// Get previous shift id
		if ( fIndexShift != -1 && fIndexShift != 0 ) {
			var prevShiftID = airbus.mes.stationtracker.util.ShiftManager.shifts[fIndexShift -1].shiftID;
			console.log("Prev shift ID: " + prevShift);
		
			
			var data = JSON.stringify({
				"site": 		oData.site,
				"phStation": 	oData.station,
				"msn": 			oData.msn,
				"currShiftID":  oShift.shiftID,
				"prevShiftID": 	prevShiftID,
				"curentDate": 	currentDate,
				"lines": 		lines
            });
	        
	        jQuery.ajax({
	            type: 'post',
	            url: urlReschedulingLineService,
	            async: false,
	            contentType: 'application/json',
	            data: data,
	            success: function (data) {
	                if (typeof data == "string") {
	                    data = JSON.parse(data);
	                }
	            },
	            error: function (error, jQXHR) {
	                jQuery.sap.log.info(error);
	            }
	        });
		}
    },
    
	rescheduleLine: function (avlLine, count) {
		window.event.stopPropagation();
		
		// Get AVL Line number and skill from avlLine string
		var avlline  = avlLine.split("_");
		var line  = avlline[0];
		var skill = avlline[1];

		var lines = [
			{
			"line": line,
			"skill": skill
			}
		]
		// console.log("lines: " + line + " / " + skill);
		// console.log("countNotConfOpe = " + count);
		
		
		/*
		 * CONFIRMATION POP UP HERE !!
		 * 
		 */
		
		// call request
		//airbus.mes.stationtracker.util.ModelManager.sendRescheduleLineRequest(lines);
	},

    openWorkListPopover: function (id) {

        // var elModel; not used
        var elOverallModel = {};
        var aOverallModel = [];
        var oEvent = scheduler.getEvent(id);
        var fAllDuration = 0;
        var fAllProgress = 0;
        var fNumberEl = 0;
        var oHierarchy = airbus.mes.stationtracker.util.GroupingBoxingManager.operationDateIHierarchy;
        // Check if there is only one operation on the worklist
        // If yes, open the operation list
        var aModel = airbus.mes.stationtracker.util.GroupingBoxingManager.operationHierarchy[scheduler.getEvent(id).group][scheduler.getEvent(id).avlLine][scheduler.getEvent(id).box];

        if (aModel.length === 1) {
            //Get avlDate initial of operation
            var sId = aModel[0].OPERATION_ID + aModel[0].WORKORDER_ID;

            if (oHierarchy[sId] != undefined) {

                var sAvlStart = oHierarchy[sId].startI
                var sAvlEnd = oHierarchy[sId].endI

            }

            airbus.mes.stationtracker.util.ModelManager.openOperationDetailPopup(aModel, sAvlStart, sAvlEnd);
            return;
        }

        if (airbus.mes.stationtracker.worklistPopover === undefined) {

            airbus.mes.stationtracker.worklistPopover = sap.ui.xmlfragment("worklistPopover", "airbus.mes.stationtracker.fragment.worklistPopover", airbus.mes.stationtracker.oView.getController());
            airbus.mes.stationtracker.worklistPopover.addStyleClass("alignTextLeft");
            airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.worklistPopover);
        }

        airbus.mes.stationtracker.worklistPopover.OSW = false;
        airbus.mes.stationtracker.worklistPopover.unPlanned = false;

        aModel = airbus.mes.stationtracker.util.Formatter.sortWorkList(aModel);
        airbus.mes.stationtracker.util.Formatter.sortWorklistAndBind("WORKORDER_ID", aModel);
        sap.ui.getCore().byId("worklistPopover--selectGroupingWorklist").setSelectedKey(0);

        sap.ui.getCore().byId("worklistPopover--selectStatus").setSelectedKey(0);

        // Manage model on worklist
        // Overall progress model
        aModel.forEach(function (elModel) {
            // TODO
            // elOverallModel.STATE =???
            // elOverallModel.andons = ???
            fNumberEl = fNumberEl + 1;
            fAllDuration = parseFloat(fAllDuration) + parseFloat(elModel.DURATION);
            fAllProgress = parseFloat(fAllProgress) + parseFloat(elModel.PROGRESS);

        });

        // Text to display different case regarding box selected
        switch (airbus.mes.stationtracker.util.GroupingBoxingManager.box) {

            case "OPERATION_ID":
                //sText = oBox.operationDescription + " - " + oBox.shopOrder + " - " + oBox.operationId;
                elOverallModel.WORKORDER_ID = oEvent.operationId;
                elOverallModel.WORKORDER_DESCRIPTION = oEvent.operationDescription;
                break;

            case "WORKORDER_ID":
                elOverallModel.WORKORDER_ID = oEvent.shopOrderDescription;
                elOverallModel.WORKORDER_DESCRIPTION = oEvent.shopOrder;
                break;
            default:
                elOverallModel.WORKORDER_ID = oEvent.realValueBox;
                elOverallModel.WORKORDER_DESCRIPTION = "";
                break;

        }

        elOverallModel.OPERATION_ID = "";
        elOverallModel.OPERATION_DESCRIPTION = "";
        elOverallModel.DURATION = fAllDuration.toFixed(0);
        elOverallModel.PROGRESS = fAllProgress.toFixed(0);
        elOverallModel.ISUNPLANNED = oEvent.isUnplanned;
        elOverallModel.RMA_STATUS_COLOR = oEvent.rmaStatus;
        elOverallModel.EXECUTION_STATION_SOURCE = oEvent.OSW;

        switch (oEvent.status) {
            case 0:
                elOverallModel.STATE = "C";
                break;
            case 1:
                elOverallModel.PAUSED = "---";
                break;
            case 2:
                elOverallModel.PAUSED = "false";
                break;
            case 3:
                elOverallModel.PAUSED = "---";
                elOverallModel.PREVIOUSLY_STARTED = "true";
                break;
            case 4:
                elOverallModel.DISRUPTION = "D1";
                break;
            case 5:
                elOverallModel.DISRUPTION = "D2";
                break;
            case 6:
                elOverallModel.DISRUPTION = "D3";
                break;
            case 7:
                elOverallModel.DISRUPTION = "D4";
                break;
        }

        aOverallModel.push(elOverallModel);

        airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(aOverallModel), "WorkListOverallModel");
        airbus.mes.stationtracker.worklistPopover.getModel("WorkListOverallModel").refresh(true);

        // Operation model
        airbus.mes.stationtracker.worklistPopover.setModel(new sap.ui.model.json.JSONModel(aModel), "WorkListModel");
        airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel").refresh(true);

        // Overall Progress is only display on worklist
        sap.ui.getCore().byId("worklistPopover--overallProgress").setVisible(true);

        // delay because addDependent will do a async rerendering and the
        // popover will immediately close without it
        airbus.mes.stationtracker.worklistPopover.open();

    },

    /***************************************************************************
     * open work list popover
     **************************************************************************/
    OpenWorkList: function (id) {
        airbus.mes.stationtracker.util.ModelManager.openWorkListPopover(id);
    },

    /***************************************************************************
     * open operation detail popup containing progress slider
     **************************************************************************/
    openOperationDetailPopup: function (aModel, sAvlStart, sAvlEnd) {

        //two timeout chained to active setBusy & to be sure the setBusy is launched before the next operations
        //don't work without this trick (or sometimes but don't 100% effective)
        setTimeout(function () {

            //set busyIndicator delay to 0 ms instead of 500ms
            if (airbus.mes.stationtracker.oView.byId("stationtracker").getBusyIndicatorDelay() !== 0) {
                airbus.mes.stationtracker.oView.byId("stationtracker").setBusyIndicatorDelay(0);
            }
            airbus.mes.stationtracker.oView.byId("stationtracker").setBusy(true);

            setTimeout(function () {
                if (airbus.mes.stationtracker.operationDetailPopup === undefined) {
                    airbus.mes.stationtracker.operationDetailPopup = sap.ui.xmlfragment("operationDetailPopup", "airbus.mes.stationtracker.fragment.operationDetailPopup", airbus.mes.stationtracker.oView.getController());
                    airbus.mes.stationtracker.operationDetailPopup.setModel(sap.ui.getCore().getModel("operationDetailModel"), "operationDetailModel");
                    airbus.mes.stationtracker.operationDetailPopup.setModel(sap.ui.getCore().getModel("dispatchFromAcpngModel"), "dispatchFromAcpngModel");
                    airbus.mes.stationtracker.operationDetailPopup.setModel(sap.ui.getCore().getModel("dispatchFromMesModel"), "dispatchFromMesModel");
                    airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.operationDetailPopup);

                }

                //spent time calculation
                var operation = aModel[0].OPERATION_BO.split(",")[1];
                var order = aModel[0].SHOP_ORDER_BO.split(",")[1];
                var spentTimeInMs = 0;


                //TODO Exception to display to UI
                if (operation && order) {
                    spentTimeInMs = airbus.mes.stationtracker.util.ModelManager.getSpentTimePerOperation(operation, order);
                }


                //informations for Document request
                airbus.mes.stationtracker.util.ModelManager.stationInProgress.ShopOrderBO = aModel[0].SHOP_ORDER_BO;
                airbus.mes.stationtracker.util.ModelManager.stationInProgress.RouterStepBO = aModel[0].ROUTERSTEPBO;
                airbus.mes.stationtracker.util.ModelManager.stationInProgress.ERP_SYSTEM = aModel[0].ERP_SYSTEM;
                airbus.mes.stationtracker.util.ModelManager.stationInProgress.WORKORDER_ID = aModel[0].WORKORDER_ID;
                airbus.mes.stationtracker.util.ModelManager.stationInProgress.OPERATION_ID = aModel[0].OPERATION_ID;
                airbus.mes.stationtracker.util.ModelManager.stationInProgress.SFC = aModel[0].SFC;
                airbus.mes.stationtracker.util.ModelManager.stationInProgress.OPERATION_BO = aModel[0].OPERATION_BO;


                // calculate status of operation
                var sStatus;
                if (aModel[0].status == "0")
                    sStatus = "COMPLETED";
                else if (aModel[0].status == "2")
                    sStatus = "IN_WORK";
                else if (aModel[0].status === "3")
                    sStatus = "IN_QUEUE";
                else if (aModel[0].status === "1")
                    sStatus = "NOT_STARTED";
                else if (aModel[0].status === "4" || aModel[0].status === "5"
                    || aModel[0].status === "6" || aModel[0].status === "7")
                    sStatus = "Blocked";


                // progress calculation
                var progress;
                if (sStatus == "COMPLETED")
                    progress = 100;
                else if (parseInt(aModel[0].DURATION, 10) === 0)
                    progress = 0;
                else
                    progress = aModel[0].PROGRESS / parseInt(aModel[0].DURATION, 10)
                        * 100;
                var oOperModel = {
                    "Rowsets": {
                        "Rowset": [{
                            "Row": [{
                                "prodGroup": aModel[0].PROD_GROUP,
                                "skills": aModel[0].SKILLS,
                                "avlLine": aModel[0].AVL_LINE,
                                "sfc": aModel[0].SFC,
                                "sfc_step_ref": aModel[0].SFC_STEP_REF,
                                "USER_BO": aModel[0].USER_BO,
                                "operation_bo": aModel[0].OPERATION_BO,
                                "operation_id": aModel[0].OPERATION_ID,
                                "operation_no": aModel[0].OPERATION_BO.split(",")[1],
                                "operation_desc": aModel[0].OPERATION_DESCRIPTION,
                                "material_description": aModel[0].WORKORDER_DESCRIPTION,
                                "operation_revision": aModel[0].SFC_STEP_REF.split(",")[5],
                                "shopOrderBo": aModel[0].SHOP_ORDER_BO,
                                "wo_no": aModel[0].SHOP_ORDER_BO.split(",")[1],
                                "workcenter": aModel[0].WORK_CENTER,
                                "status": sStatus,
                                "realStatus": aModel[0].status,
                                "progress": parseInt(progress, 10),
                                "progress_new": parseInt(progress, 10),
                                "time_spent": spentTimeInMs,
                                "reschedule_start_time": aModel[0].START_TIME,
                                "reschedule_end_time": aModel[0].END_TIME,
                                "original_start_time": sAvlStart,
                                "original_end_time": sAvlEnd,
                                "cpp_cluster": aModel[0].CPP_CLUSTER,
                                "work_package": aModel[0].WORK_PACKAGE,
                                "erp_system": aModel[0].ERP_SYSTEM,
                                "state": aModel[0].STATE,
                                "previously_start": aModel[0].PREVIOUSLY_STARTED,
                                "paused": aModel[0].PAUSED,
                                "noOfEmp": aModel[0].NUMBER_OF_EMPLOYEES,
                                "duration": aModel[0].DURATION,
                                "routerStepBo": aModel[0].ROUTERSTEPBO,
                            }]
                        }]
                    }
                };

                airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").setData(oOperModel);
                airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").refresh();
                sap.ui.getCore().getModel("operationDetailModel").setData(oOperModel);
                sap.ui.getCore().getModel("operationDetailModel").refresh();

                airbus.mes.stationtracker.util.ModelManager.loadDispatchFromAcpngModel();
                airbus.mes.stationtracker.util.ModelManager.loadDispatchFromMesModel();


                if (airbus.mes.operationdetail === undefined) {
                    jQuery.sap.registerModulePath("airbus.mes.operationdetail",
                        "../components/operationdetail");
                    this.oOperationDetailComp = sap.ui.getCore().createComponent({
                        name: "airbus.mes.operationdetail",
                        id: "operationDetailComponent"
                    });
                    airbus.mes.operationdetail.oView = this.oOperationDetailComp.oView;
                    airbus.mes.operationdetail.parentId = airbus.mes.stationtracker.operationDetailPopup.sId;
                }
                // Model for Missing Parts Notification
                airbus.mes.operationdetail.ModelManager.loadMissingPartsModel(airbus.mes.operationdetail.oView.getModel("i18n"));
                airbus.mes.stationtracker.operationDetailPopup.open();
                airbus.mes.operationdetail.oView.placeAt(airbus.mes.stationtracker.operationDetailPopup.sId + "-scrollCont");

                // If previously_started is true, the operation has to be on execution mode
                if (aModel[0].PREVIOUSLY_STARTED === "true") {
                    airbus.mes.operationdetail.oView.byId("switchOperationModeBtn").setState(true);
                    airbus.mes.operationdetail.oView.byId("switchOperationModeBtn").setEnabled(false);
                    airbus.mes.operationdetail.oView.byId("switchStatusLabel").setText(airbus.mes.operationdetail.oView.getModel("i18n").getProperty("Execution"));
                } else {
                    airbus.mes.operationdetail.oView.byId("switchOperationModeBtn").setState(false);
                    airbus.mes.operationdetail.oView.byId("switchOperationModeBtn").setEnabled(true);
                    airbus.mes.operationdetail.oView.byId("switchStatusLabel").setText(airbus.mes.operationdetail.oView.getModel("i18n").getProperty("ReadOnly"));
                }


                // Ooen Pop-up and place status view inside it
                airbus.mes.stationtracker.operationDetailPopup.open();
                airbus.mes.operationdetail.oView.placeAt(airbus.mes.stationtracker.operationDetailPopup.sId + "-scrollCont");

                //Load acpngLinks if no child find for the wo the button is disabled
                airbus.mes.shell.util.navFunctions.acpnglinksDetail(airbus.mes.operationdetail.oView.getController().nav);
                sap.ui.getCore().byId("operationDetailsView--idACPnGLinks").setVisible(airbus.mes.acpnglinks.model.ModelManager.checkExistingChildrentData());

                //Load components model
                airbus.mes.stationtracker.util.ModelManager.loadComponentsTabs();

                airbus.mes.shell.busyManager.unsetBusy(airbus.mes.stationtracker.oView, "stationtracker");

            }, 0);
        }, 0);
    },

    loadComponentsTabs: function () {
        if (airbus.mes.components === undefined || airbus.mes.components.oView === undefined) {

            jQuery.sap.registerModulePath("airbus.mes.components", "../components/components");
            sap.ui.getCore().createComponent({
                name: "airbus.mes.components",
                site: airbus.mes.settings.ModelManager.site,
                sfc: sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc,
                sSet: airbus.mes.shell.util.navFunctions.components.configME
            });
        } else { // or load model
            airbus.mes.components.oView.getController().getOwnerComponent().setSite(airbus.mes.settings.ModelManager.site);
            airbus.mes.components.oView.getController().getOwnerComponent().setWorkOrder(sap.ui.getCore().getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].wo_no);
            airbus.mes.components.oView.getController().getOwnerComponent().setOperation(sap.ui.getCore().getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].operation_no);
            airbus.mes.components.util.ModelManager.loadcomponentsWorkOrderDetail();
            airbus.mes.components.util.ModelManager.loadselectFilterModel();
            airbus.mes.components.oView.getController().checkSettingComponents();
        }

    },

    OpenReschedule: function (id) {

        //
        var aGroup = [];

        // Check if we are on operation grouping
        // SD-PPC-ST-386
        if (airbus.mes.stationtracker.util.GroupingBoxingManager.box !== 'OPERATION_ID') {
            return;
        }

        var aOperationHierachy = airbus.mes.stationtracker.util.GroupingBoxingManager.operationHierarchy;
        var aModel = [scheduler.getEvent(id)];

        // Define all group
        for (var oTmpOperationHierarchy in aOperationHierachy) {
            aGroup.push(oTmpOperationHierarchy);
        }

        if (airbus.mes.stationtracker.ReschedulePopover === undefined) {
            airbus.mes.stationtracker.ReschedulePopover = sap.ui.xmlfragment("ReschedulePopover", "airbus.mes.stationtracker.fragment.Reschedule", airbus.mes.stationtracker.oView.getController());
            airbus.mes.stationtracker.ReschedulePopover.addStyleClass("alignTextLeft");

            airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.ReschedulePopover);
        }
        // Model for the current operation
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(aModel);
        airbus.mes.stationtracker.ReschedulePopover.setModel(oModel, "RescheduleModel");

        oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(aGroup);
        airbus.mes.stationtracker.ReschedulePopover.setModel(oModel, "RescheduleGroupModel");

        airbus.mes.stationtracker.ReschedulePopover.open();

    },


    savePhStation: function (aPhStation) {

        // get Url of the service
        var urlsavephstation = this.urlModel.getProperty("urlsavephstation");
        var oData = airbus.mes.stationtracker.util.ModelManager.settings;

        jQuery.ajax({
            async: false,
            url: urlsavephstation,
            data: {
                "Param.1": oData.site,
                "Param.2": oData.station,
                "Param.3": aPhStation.toString(),

            },

        });

    },

    getPhStation: function () {

        var urlgetphstation = this.urlModel.getProperty("urlgetphstation");
        var oData = airbus.mes.stationtracker.util.ModelManager.settings;

        urlgetphstation = airbus.mes.stationtracker.util.ModelManager.replaceURI(urlgetphstation, "$site", oData.site);
        urlgetphstation = airbus.mes.stationtracker.util.ModelManager.replaceURI(urlgetphstation, "$station", oData.station);
        urlgetphstation = airbus.mes.stationtracker.util.ModelManager.replaceURI(urlgetphstation, "$phStation", oData.station);

        var oViewModel = sap.ui.getCore().getModel("phStationSelected");
        oViewModel.loadData(urlgetphstation, null, true);

    },

    onPhStationLoad: function () {

        var aModel = sap.ui.getCore().getModel("phStationSelected");

        if (aModel.getProperty("/Rowsets/Rowset/0/Row")) {

            aModel = sap.ui.getCore().getModel("phStationSelected").oData.Rowsets.Rowset[0].Row[0].originPhysicalStation;

        } else {
            aModel = "";
            console.log("no phStationSelected load");
        }


        if (airbus.mes.stationtracker.ImportOswUnplannedPopover != undefined) {

            if (airbus.mes.stationtracker.CheckQa === "OSW");

            var aValueSelected = [];

            aModel.split(",").forEach(function (el) {

                aValueSelected.push(el);

            })
            //Check if one value is saved otherwise select by default all value// if no value send mii send ---
            if (aValueSelected[0] === "---") {

                sap.ui.getCore().byId("ImportOswUnplannedPopover--myList").getBinding("items").filter();
                return;

            }

            // Filter is doing in UpperCase
            aValueSelected = aValueSelected.map(function (x) { return x.toUpperCase(); })
            var binding = sap.ui.getCore().byId("ImportOswUnplannedPopover--myList").getBinding("items");
            // Erase duplicate key in combobox selection
            var Filter = new sap.ui.model.Filter({
                path: "WORK_CENTER",
                test: function (value) {
                    if (aValueSelected.indexOf(value) != -1) {
                        sap.ui.getCore().byId("ImportOswUnplannedPopover--filterPhStation").setSelectedKeys(value);
                        return true;
                    } else {
                        return false;
                    }
                }
            });

            binding.filter(Filter);

        }

    },
    getTakt: function () {
        var oModel = sap.ui.getCore().getModel("taktModel");
        var url = this.urlModel.getProperty("urltakt");

        var oData = airbus.mes.stationtracker.util.ModelManager.settings;

        url = airbus.mes.stationtracker.util.ModelManager.replaceURI(url, "$site", oData.site);
        url = airbus.mes.stationtracker.util.ModelManager.replaceURI(url, "$station", oData.station);
        url = airbus.mes.stationtracker.util.ModelManager.replaceURI(url, "$msn", oData.msn);


        oModel.loadData(url, null, true);
    },
    onTaktLoad: function () {

        var aModel = sap.ui.getCore().getModel("taktModel").getData();

        var date = aModel.Rowsets.Rowset[0].Row[0].START_TIME;
        var aDate = date.split(" ");

        if (aDate[0].split("/").length > 1) {
            //			If date format is DD/MM/YYYY
            //		TOBE remove after date changed		

            var aDate1 = aDate[0].split("/")

            //        airbus.mes.settings.ModelManager.taktStart = aModel.Rowsets.Rowset[0].Row[0].START_TIME;
            airbus.mes.settings.ModelManager.taktStart = aDate1[2].concat("-", aDate1[0], "-", aDate1[1], " ", aDate[1]);

            //		TOBE remove after date changed
            var date = aModel.Rowsets.Rowset[0].Row[0].END_TIME;
            var aDate = date.split(" ");
            var aDate1 = aDate[0].split("/")

            //        airbus.mes.settings.ModelManager.taktEnd = aModel.Rowsets.Rowset[0].Row[0].END_TIME;
            airbus.mes.settings.ModelManager.taktEnd = aDate1[2].concat("-", aDate1[0], "-", aDate1[1], " ", aDate[1]);

        } else {
            //			If date format is YYYY-MM-DD
            airbus.mes.settings.ModelManager.taktStart = aModel.Rowsets.Rowset[0].Row[0].START_TIME;
            airbus.mes.settings.ModelManager.taktEnd = aModel.Rowsets.Rowset[0].Row[0].END_TIME;
        }

        airbus.mes.settings.ModelManager.taktDuration = aModel.Rowsets.Rowset[0].Row[0].DURATION;
        airbus.mes.stationtracker.util.ModelManager.settings.taktStart = airbus.mes.settings.ModelManager.taktStart
        airbus.mes.stationtracker.util.ModelManager.settings.taktEnd = airbus.mes.settings.ModelManager.taktEnd
        airbus.mes.stationtracker.util.ModelManager.settings.taktDuration = aModel.Rowsets.Rowset[0].Row[0].DURATION;
    },

    getSpentTimePerOperation: function (operation, order) {
        var spentTime = 0;
        jQuery.ajax({
            type: 'post',
            url: this.urlModel.getProperty("urlGetTimeSpentPerOperation"),
            contentType: 'application/json',
            async: false,
            data: JSON.stringify({
                "site": airbus.mes.settings.ModelManager.site,
                "order": order,
                "operation": operation,
            }),

            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                if (data.success) {
                    spentTime = data.spentTime;
                } else
                    return 0;
            },

            error: function (error, jQXHR) {
                return 0;
            }
        });
        return spentTime;
    },

    /**
     * This function aim to retrieve data for the work tracker split view.
     * It call the url to retrieve the last operation of a specific user and the data are saved in the
     * ViewModel named SplitDetailModel
     * 
     * This function is called when we are in WorkTracker mode and :
     *      - when we change the selected user 
     *      - when we change the selected day    
     *      - when a user is unassigned from an operation
     *      - when a user is assigned to an operation
     */
    loadSplitModel: function (userToLoad) {
        var splitModelURL, oViewModel, shiftSelected, userSelected, startDate, tzoffset, localISOTime;

        oViewModel = sap.ui.getCore().getModel("SplitDetailModel");

        userSelected = userToLoad || airbus.mes.stationtracker.util.AssignmentManager.userSelected;

        shiftSelected = null;
        if (airbus.mes.stationtracker.util.ShiftManager.ShiftSelected && airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.shiftName) {
            shiftSelected = airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.shiftName;
        }

        startDate = airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.StartDate;
        if (startDate) {
            tzoffset = (startDate).getTimezoneOffset() * 60000; //offset in milliseconds
            localISOTime = (new Date(startDate - tzoffset)).toISOString().slice(0, -5);
        }

        splitModelURL = this.urlModel.getProperty("urlSplitData");
        splitModelURL = airbus.mes.stationtracker.util.ModelManager.replaceURI(splitModelURL, "$user", userSelected);
        splitModelURL = airbus.mes.stationtracker.util.ModelManager.replaceURI(splitModelURL, "$shift", shiftSelected);
        splitModelURL = airbus.mes.stationtracker.util.ModelManager.replaceURI(splitModelURL, "$site", airbus.mes.settings.ModelManager.site);
        splitModelURL = airbus.mes.stationtracker.util.ModelManager.replaceURI(splitModelURL, "$startDate", localISOTime);

        jQuery.ajax({
            type: 'get',
            url: splitModelURL,
            contentType: 'application/json',
            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                oViewModel.setData(data);

                //if the KPI are hidden we add the class without KPI in order ajust the height correctly
                if (!airbus.mes.stationtracker.oView.byId("kpi_header").getExpanded()) {
                    $("#stationTrackerView--splitWorkTra").addClass("withoutKPI");
                }
            },

            error: function (error, jQXHR) {
                jQuery.sap.log.info(error);
            }
        });
    },

    loadTimeMinRModel: function () {

        var urlMinRModel = this.urlModel.getProperty("urlminr");

        jQuery.ajax({
            type: 'post',
            url: urlMinRModel,
            contentType: 'application/json',

            success: function (data) {

                try {

                    var sValue = data.Rowsets.Rowset[0].Row.filter(function (el) {
                        return el.Name === "minHorizontalDrag" &&
                            el.Context === "*"

                    });;
                    // Store value in ms
                    airbus.mes.stationtracker.util.ModelManager.timeMinR = sValue[0].Value * 1000 * 60;

                } catch (e) {
                    // default value in ms
                    airbus.mes.stationtracker.util.ModelManager.timeMinR = 5 * 1000 * 60;
                    console.log("no min time for rescheduling click load");
                }

            },

            error: function (error, jQXHR) {
                jQuery.sap.log.info(error);
            }
        });
    },

};

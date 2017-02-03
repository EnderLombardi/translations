"use strict";

jQuery.sap.declare("airbus.mes.shell.util.Functions");

airbus.mes.shell.util.navFunctions = {

    //StationTracker or Worktracker
    splitMode: undefined,

    jigsAndTools: {
        configME: undefined,
    },

    components: {
        configME: undefined,
    },

    disruptionButtons: {
        create: undefined,
        update: undefined,
        cancel: undefined
    },

    stationHandover: function () {
        if (airbus.mes.stationHandover === undefined) {

            jQuery.sap.registerModulePath("airbus.mes.stationHandover", "../components/stationHandover");
            sap.ui.getCore().createComponent({ name: "airbus.mes.stationHandover", });
            nav.addPage(airbus.mes.stationHandover.oView);
        }

        airbus.mes.shell.util.navFunctions.jigsAndTools.configME = undefined;

        nav.to(airbus.mes.stationHandover.oView.getId());
    },

    calendar: function () {
        if (airbus.mes.calendar === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.calendar", "../components/calendar");
            sap.ui.getCore().createComponent({ name: "airbus.mes.calendar", });
            nav.addPage(airbus.mes.calendar.oView);
        }

        airbus.mes.shell.util.navFunctions.jigsAndTools.configME = undefined;

        nav.to(airbus.mes.calendar.oView.getId());
    },

    stationTracker: function () {
        if (airbus.mes.stationtracker === undefined) {

            jQuery.sap.registerModulePath("airbus.mes.stationtracker", "../components/stationtracker");
            sap.ui.getCore().createComponent({ name: "airbus.mes.stationtracker", });
            nav.addPage(airbus.mes.stationtracker.oView);
        }

        //initialize jigs & Tools to force refresh when go to station Tracker
        airbus.mes.shell.util.navFunctions.jigsAndTools.configME = undefined;

        nav.to(airbus.mes.stationtracker.oView.getId());
    },


    polypoly: function () {
        var oPolypolyPage;

        if (airbus.mes.stationtracker === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.stationtracker", "../components/stationtracker");
            sap.ui.getCore().createComponent({ name: "airbus.mes.stationtracker", });
            nav.addPage(airbus.mes.stationtracker.oView);
        }

        if (airbus.mes.polypoly === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.polypoly", "../components/polypoly");
            airbus.mes.stationtracker.AssignmentManager.polypolyAffectation = false;
            if (airbus.mes.polypoly == undefined) {
                sap.ui.getCore().createComponent({
                    name: "airbus.mes.polypoly", // root component folder is resources
                });
            }
        }

        airbus.mes.shell.busyManager.setBusy(airbus.mes.polypoly.oView);
        airbus.mes.polypoly.PolypolyManager.globalContext.bEditable = !airbus.mes.stationtracker.AssignmentManager.polypolyAffectation;

        if (!nav.getPage("polypolyPage")) {
            oPolypolyPage = new sap.m.Page({
                content: airbus.mes.polypoly.oView,
                title: "POLYPOLY",
                id: "polypolyPage",
                customHeader: new sap.m.Bar({
                    height: "3rem",
                    design: 'SubHeader',
                    contentLeft: [new sap.m.Label("polypolytitle").addStyleClass("polypolytitle")],
                }).addStyleClass("pageHeader contentNoPad"),
            }).addStyleClass("classPolypolyPage");

            nav.addPage(oPolypolyPage);
        } else {
            oPolypolyPage = nav.getPage("polypolyPage");
            if (oPolypolyPage.getContent().length == 0) {
                oPolypolyPage.addContent(airbus.mes.polypoly.oView);
            }
        }

        if (nav.getPreviousPage() == undefined) {
            nav.to(oPolypolyPage);
        } else if (nav.getPreviousPage().getId() == "polypolyPage") {
            nav.back();
        } else {
            nav.to(oPolypolyPage);
        }

        airbus.mes.polypoly.PolypolyManager.firstVisibleRow = 0;
        // //FIXME When Settings ready
        airbus.mes.polypoly.ModelManager.getPolyPolyModel(airbus.mes.settings.ModelManager.site, airbus.mes.settings.ModelManager.station);
    },

    resourcePool: function () {
        if (airbus.mes.resourcepool === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.resourcepool", "../components/resourcepool");
            sap.ui.getCore().createComponent({ name: "airbus.mes.resourcepool", });
            nav.addPage(airbus.mes.resourcepool.oView);
        }
        nav.to(airbus.mes.resourcepool.oView.getId());
    },

    lineTracker: function () {
        if (airbus.mes.linetracker === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.linetracker", "../components/linetracker");
            sap.ui.getCore().createComponent({ name: "airbus.mes.linetracker" });
            nav.addPage(airbus.mes.linetracker.oView);
        }
        nav.to(airbus.mes.linetracker.oView.getId());
    },
    
    
    operationstatus: function(oNavContainer, navigate){
        if (airbus.mes.operationstatus === undefined || airbus.mes.operationstatus.oView === undefined) {
        	jQuery.sap.registerModulePath("airbus.mes.operationstatus", "../components/operationstatus");
            sap.ui.getCore().createComponent({
                name: "airbus.mes.operationstatus",
            });
            oNavContainer.addPage(airbus.mes.operationstatus.oView);
        }
        
        if(navigate){
        	oNavContainer.to(airbus.mes.operationstatus.oView.getId());
        	airbus.mes.operationstatus.oView.oController.setOperationActionButtons();
        }
    },
    
    qdc: function(oNavContainer){
        if (airbus.mes.qdc === undefined || airbus.mes.qdc.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.qdc", "../components/qdc");
            sap.ui.getCore().createComponent({ name: "airbus.mes.qdc" });
            oNavContainer.addPage(airbus.mes.qdc.oView);
        }
        oNavContainer.to(airbus.mes.qdc.oView.getId());
    },    
    

    disruptionsDetail: function (container, reportDisruptButton, createButton, updateButton, cancelButton) {

        if (airbus.mes.disruptions === undefined || airbus.mes.disruptions.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.disruptions", "../components/disruptions");
            sap.ui.getCore().createComponent({ name: "airbus.mes.disruptions", });
        }

        if (container.getPage("ViewDisruptionView") == null) {
            container.addPage(airbus.mes.disruptions.oView.viewDisruption);
            container.addPage(airbus.mes.disruptions.oView.createDisruption);
            container.addPage(airbus.mes.disruptions.oView.disruptionDetail);// add new page disruption detail in nav container MES V1.5
        }

        // Set click event on report disruption button
        if (reportDisruptButton) {
            reportDisruptButton.detachPress(airbus.mes.disruptions.oView.viewDisruption.oController.onReportDisruption);
            reportDisruptButton.attachPress(airbus.mes.disruptions.oView.viewDisruption.oController.onReportDisruption);
        }

        // Set click event on create, update and cancel disruption button
        if (createButton) {
            createButton.detachPress(airbus.mes.disruptions.oView.createDisruption.oController.onCreateDisruption);
            createButton.attachPress(airbus.mes.disruptions.oView.createDisruption.oController.onCreateDisruption);
        }

        if (updateButton) {
            updateButton.detachPress(airbus.mes.disruptions.oView.createDisruption.oController.onUpdateDisruption);
            updateButton.attachPress(airbus.mes.disruptions.oView.createDisruption.oController.onUpdateDisruption);
        }

        if (cancelButton) {
            cancelButton.detachPress(airbus.mes.disruptions.oView.createDisruption.oController.onCancelCreateDisruption);
            cancelButton.attachPress(airbus.mes.disruptions.oView.createDisruption.oController.onCancelCreateDisruption);
        }

        airbus.mes.shell.util.navFunctions.disruptionButtons.create = createButton;
        airbus.mes.shell.util.navFunctions.disruptionButtons.update = updateButton;
        airbus.mes.shell.util.navFunctions.disruptionButtons.cancel = cancelButton;
    },

    displayOpeAttachments: function (container) {
        if (airbus.mes.displayOpeAttachments === undefined || airbus.mes.displayOpeAttachments.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.displayOpeAttachments", "../components/displayOpeAttachments");
            sap.ui.getCore().createComponent({ name: "airbus.mes.displayOpeAttachments" });
        }

        if (container.getPage("displayOpeAttachmentsView") === null) {
            container.addPage(airbus.mes.displayOpeAttachments.oView);
        }
    },

    jigToolsDetail: function (container) {

        //    	Retrieve current workOrder Display
        var sCurrentWorkOrder = sap.ui.getCore().getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].wo_no;


        if (airbus.mes.jigtools === undefined || airbus.mes.jigtools.oView === undefined) {

            jQuery.sap.registerModulePath("airbus.mes.jigtools", "../components/jigtools");
            sap.ui.getCore().createComponent({ name: "airbus.mes.jigtools" });
        } else if (airbus.mes.jigtools.oView.oController.workOrder !== sCurrentWorkOrder) {
//          If WorkdOrder changed, need to reload data in the model
            airbus.mes.jigtools.oView.getController().getOwnerComponent().setSite(airbus.mes.settings.ModelManager.site);
            airbus.mes.jigtools.oView.getController().getOwnerComponent().setWorkOrder(airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].wo_no);
            airbus.mes.jigtools.util.ModelManager.loadjigToolsWorkOrderDetail();
        }
        airbus.mes.jigtools.oView.getController().getOwnerComponent().setPhStation(airbus.mes.settings.ModelManager.station);
        airbus.mes.jigtools.oView.getController().getOwnerComponent().setOperation(sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_no);
        airbus.mes.jigtools.oView.getController().checkSettingJigsTools();
       
        if (container.getPage("jigtoolsView") === null) {
            container.addPage(airbus.mes.jigtools.oView);
        }
    },

    componentsDetail: function (container) {
        if (airbus.mes.components === undefined || airbus.mes.components.oView === undefined) {

            jQuery.sap.registerModulePath("airbus.mes.components", "../components/components");
            sap.ui.getCore().createComponent({ name: "airbus.mes.components" });
        }
        if (container.getPage("componentsView") === null) {
            container.addPage(airbus.mes.components.oView);
        }
    },

    acpnglinksDetail: function (container) {
        if (airbus.mes.acpnglinks === undefined || airbus.mes.acpnglinks.oView === undefined) {

            jQuery.sap.registerModulePath("airbus.mes.acpnglinks", "../components/acpnglinks");
            sap.ui.getCore().createComponent({ name: "airbus.mes.acpnglinks" });
        }
        if (container.getPage("acpnglinksView") === null) {
            container.addPage(airbus.mes.acpnglinks.oView);
        }
    },

    ncDisplayLink: function (container) {
        if (airbus.mes.ncdisplay === undefined || airbus.mes.ncdisplay.oView === undefined) {

            jQuery.sap.registerModulePath("airbus.mes.ncdisplay", "../components/ncdisplay");
            sap.ui.getCore().createComponent({ name: "airbus.mes.ncdisplay" });
        }
        if (container.getPage("ncdisplayView") === null) {
            container.addPage(airbus.mes.ncdisplay.oView);
        }
    },

    disruptionAttachment: function (container, disruptionDesc) {
        if (airbus.mes.disruptionattachments === undefined || airbus.mes.disruptionattachments.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.disruptionattachments", "../components/disruptionattachments");
            sap.ui.getCore().createComponent({ name: "airbus.mes.disruptionattachments" });
            container.addPage(airbus.mes.disruptionattachments.oView);
        }
        if (container.getPage("DisruptionAttachmentView") == null) {
            container.addPage(airbus.mes.disruptionattachments.oView);
        }
        container.to(airbus.mes.disruptionattachments.oView.getId(), { Desc: disruptionDesc })
    },

    disruptionTracker: function () {
        if (airbus.mes.disruptiontracker === undefined
            || airbus.mes.disruptiontracker.oView === undefined) {

            jQuery.sap.registerModulePath("airbus.mes.disruptiontracker",
                "../components/disruptiontracker");
            sap.ui.getCore().createComponent({
                name: "airbus.mes.disruptiontracker",
            });
            nav.addPage(airbus.mes.disruptiontracker.oView);
        }

        if (nav.getPreviousPage() != undefined && nav.getPreviousPage().sId == "stationTrackerView") {
            airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.station = airbus.mes.settings.ModelManager.station;
            airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.msn = airbus.mes.settings.ModelManager.msn;

        } else if (airbus.mes.stationtracker != undefined && airbus.mes.stationtracker.ModelManager.showDisrupionBtnClicked == true) {
            airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.station = airbus.mes.settings.ModelManager.station;
            airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.msn = airbus.mes.settings.ModelManager.msn;
            airbus.mes.stationtracker.ModelManager.showDisrupionBtnClicked = false;

        } else {
            airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.station = airbus.mes.settings.ModelManager.station;
            airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.msn = "";
        }

        airbus.mes.shell.util.navFunctions.renderDisruptionTracker();

        // Load data
        airbus.mes.disruptiontracker.ModelManager
            .loadDisruptionTrackerModel();

        // Navigate
        nav.to(airbus.mes.disruptiontracker.oView.getId());
    },

    /***************************************************************************
     * Render disruption Tracker
     */
    renderDisruptionTracker: function () {

        /*********** Filter for Station **************/
        var aFilters = [];
        var aTemp = [];
        var duplicatesFilter = new sap.ui.model.Filter({
            path: "station",
            test: function (value) {
                if (aTemp.indexOf(value) == -1) {
                    aTemp.push(value)
                    return true;
                } else {
                    return false;
                }
            }
        });

        aFilters.push(duplicatesFilter);

        aFilters.push(new sap.ui.model.Filter("program", "EQ", airbus.mes.settings.ModelManager.program)); // Filter on selected A/C Program

        sap.ui.getCore().byId("disruptiontrackerView--stationComboBox")
            .getBinding("items").filter(new sap.ui.model.Filter(aFilters, true));

        var stationItemAll = new sap.ui.core.Item();
        stationItemAll.setKey("");
        stationItemAll.setText(airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("All"));

        var stationBox = sap.ui.getCore().byId("disruptiontrackerView--stationComboBox");
        stationBox.insertItem(stationItemAll, 0);


        /************* Filter for MSN *********************/
        // Apply filter on MSN Filter Box
        sap.ui.getCore().byId("disruptiontrackerView--msnComboBox")
            .getBinding("items").filter(new sap.ui.model.Filter({
                path: "msn",
                test: function (oValue) {
                    if (oValue == "---") {
                        return false;
                    }
                    return true;
                }
            }));


        if (airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.station != "") {
            // When Station is selected on Model Loading
            sap.ui.getCore().byId("disruptiontrackerView--msnComboBox").getBinding("items")
                .filter(new sap.ui.model.Filter("station", "EQ", airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.station));
        } else {
            sap.ui.getCore().byId("disruptiontrackerView--msnComboBox").getBinding("items")
                .filter(new sap.ui.model.Filter("station", "EQ", "DISPLAY_NO_MSN"));
        }

        var msnItemAll = new sap.ui.core.Item();
        msnItemAll.setKey("");
        msnItemAll.setText(airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("All"));

        var msnBox = sap.ui.getCore().byId("disruptiontrackerView--msnComboBox");
        msnBox.insertItem(msnItemAll, 0);
        msnBox.setSelectedKey("");
    },

    disruptionKPI: function () {
        if (airbus.mes.disruptionkpi === undefined || airbus.mes.disruptionkpi.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.disruptionkpi", "../components/disruptionkpi");
            sap.ui.getCore().createComponent({ name: "airbus.mes.disruptionkpi", });
            nav.addPage(airbus.mes.disruptionkpi.oView);
        }


        airbus.mes.disruptionkpi.ModelManager.loadDisruptionKPIModel();

        airbus.mes.disruptionkpi.ModelManager.setPreSelectionCriteria();
        airbus.mes.disruptionkpi.ModelManager.removeDuplicates();


        nav.to(airbus.mes.disruptionkpi.oView.getId());
    },

    /************************
     * Open MES Document Viewer
     */
    docViewer: function (fileURL, closeFunction) {
        if (airbus.mes.docviewer === undefined || airbus.mes.docviewer.oView === undefined) {

            jQuery.sap.registerModulePath("airbus.mes.docviewer", "../components/docviewer");
            sap.ui.getCore().createComponent({
                name: "airbus.mes.docviewer",
            });
            nav.addPage(airbus.mes.docviewer.oView);
        }

        airbus.mes.docviewer.ModelManager.onCloseFunction = closeFunction;

        // Navigate to the view
        nav.to(airbus.mes.docviewer.oView.getId());

        // Get ID of the HBox where PDFTron will be placed
        airbus.mes.docviewer.ModelManager.oViewerElement = document.getElementById("docviewerView--pdfViewer");

        // Finally open the document viewer with the document URL
        airbus.mes.docviewer.ModelManager.openDocumentByURL(fileURL);
    },

    worktracker: function () {

        if (airbus.mes.worktracker === undefined) {
            sap.ui.getCore().createComponent({ name: "airbus.mes.worktracker", });
            nav.addPage(airbus.mes.worktracker.oView);
        }

        // Validate whether User exist in WorkCenter or not
        var userId = sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/user_id");

        airbus.mes.worktracker.util.ModelManager.loadUserListModel();

        var oUserListModel = sap.ui.getCore().getModel("UserListModel");
        var aUserList = oUserListModel.getProperty("/Rowsets/Rowset/0/Row");
        if (typeof aUserList != "undefined") {
            var flagUserFound = false;
            for (var i = 0; i < aUserList.length; i++) {
                if (aUserList[i].Logon == userId) {
                    flagUserFound = true;
                    break;
                }
            }
            if (!flagUserFound) {
                airbus.mes.worktracker.util.ModelManager.messageShow(
                    airbus.mes.worktracker.oView.getModel("i18n").getProperty("notAssigned_Workcenter")
                    + airbus.mes.settings.ModelManager.station, 5000)
            }
        } else {
            airbus.mes.worktracker.util.ModelManager.messageShow(
                airbus.mes.worktracker.oView.getModel("i18n").getProperty("notAssigned_Workcenter")
                + airbus.mes.settings.ModelManager.station, 5000)
        }

        // Set Current Operator
        if (typeof airbus.mes.worktracker.util.ModelManager.currentOperator.fname == "undefined")
            airbus.mes.worktracker.util.ModelManager.setCurrentOperator();

        // Load Operations Data
        airbus.mes.worktracker.util.ModelManager.loadUserOperationsModel();

        // Set station name
        airbus.mes.worktracker.oView.byId("stationName").setText(airbus.mes.settings.ModelManager.station);

        // Navigate
        nav.to(airbus.mes.worktracker.oView.getId());
    },

    worktrackerOpDetail: function (operationIndex) {
        if (airbus.mes.worktracker.detail === undefined) {
            sap.ui.getCore().createComponent({ name: "airbus.mes.worktracker.detail", });
            nav.addPage(airbus.mes.worktracker.detail.oView);
        }

        var controller = airbus.mes.worktracker.detail.oView.getController();

        // Set station name
        airbus.mes.worktracker.detail.oView.byId("stationName").setText(airbus.mes.settings.ModelManager.station);

        // Get Operation data from operation list
        var operationData = sap.ui.getCore().getModel("userOperationsModel").getProperty("/Rowsets/Rowset/0/Row/" + operationIndex);

        // put operation data in Operation Detail Model
        airbus.mes.worktracker.detail.oView.getModel("operationDetailModel").setProperty("/schedule/", operationData);

        // Set Progress Screen according to status of operation
        if (airbus.mes.worktracker.detail.oView.byId("operationStatus").getText() === "Not Started"
            || airbus.mes.worktracker.detail.oView.byId("operationStatus").getText() === "Paused") {
            controller.setProgressScreenBtn(false, false, true);
            airbus.mes.worktracker.detail.oView.byId("progressSlider").setEnabled(false);

        } else if (airbus.mes.worktracker.detail.oView.byId("operationStatus").getText() === "In Progress") {
            controller.setProgressScreenBtn(true, true, false);
            airbus.mes.worktracker.detail.oView.byId("progressSlider").setEnabled(true);

        } else if (airbus.mes.worktracker.detail.oView.byId("operationStatus").getText() === "Blocked"
            || airbus.mes.worktracker.detail.oView.byId("operationStatus").getText() === "Confirmed") {
            controller.setProgressScreenBtn(false, false, false);
            airbus.mes.worktracker.detail.oView.byId("progressSlider").setEnabled(false);
            airbus.mes.worktracker.detail.oView.byId("progressSliderfirst").setEnabled(false);
        }

        // Model for Reason Code Comments
        airbus.mes.worktracker.util.ModelManager.loadReasonCodeModel();

        // Set default tab as progress slider
        airbus.mes.worktracker.detail.oView.byId("operationNav").setSelectedKey(0);

        // Hide Create disruption for (If it's already opened)
        // controller.onCancelCreateDisruption();

        // Navigate
        nav.to(airbus.mes.worktracker.detail.oView.getId());
    },

    testScanner: function () {
        if (airbus.mes.scanner === undefined) {

            jQuery.sap.registerModulePath("airbus.mes.scanner", "../components/scanner");
            sap.ui.getCore().createComponent({ name: "airbus.mes.scanner", });
            nav.addPage(airbus.mes.scanner.oView);
        }
    }

};

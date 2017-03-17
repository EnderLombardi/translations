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

    stationHandover: function (bDialog) {
        if (airbus.mes.stationHandover === undefined) {

            jQuery.sap.registerModulePath("airbus.mes.stationHandover", "../components/stationHandover");
            sap.ui.getCore().createComponent({ name: "airbus.mes.stationHandover", });

        }

        //ReloadModel
        airbus.mes.shell.oView.getController().renderStationHandover();
        // reDisplay all columns
        airbus.mes.stationHandover.oView.byId("TreeTableBasic").getColumns()[5].setVisible(true);
        airbus.mes.stationHandover.oView.byId("TreeTableBasic").getColumns()[6].setVisible(true);
        airbus.mes.shell.util.navFunctions.jigsAndTools.configME = undefined;

        if (bDialog) {

            if (nav.getPage("stationHandoverView") != null) {
                //Permit to not has conflict with stationTRacker overwise scheduler disepear
                nav.removePage("stationHandoverView");
                sap.ui.getCore().byId("oswDialog--oswDialog").addContent(airbus.mes.stationHandover.oView);

            } else {

                sap.ui.getCore().byId("oswDialog--oswDialog").addContent(airbus.mes.stationHandover.oView);

            }

            airbus.mes.stationHandover.oView.byId("kpiHeaderToolbar").setVisible(false);
            airbus.mes.stationHandover.oView.byId("navBack").setVisible(false);
            airbus.mes.stationHandover.oView.byId("headerstationhandover").addStyleClass("stationHandoverDialog");
            airbus.mes.stationHandover.oView.byId("headerstationhandover").removeStyleClass("stationHandoverTile");

        } else {

            nav.addPage(airbus.mes.stationHandover.oView);
            nav.to(airbus.mes.stationHandover.oView.getId());
            airbus.mes.stationHandover.oView.byId("kpiHeaderToolbar").setVisible(true);
            airbus.mes.stationHandover.oView.byId("navBack").setVisible(true);
            airbus.mes.stationHandover.oView.byId("headerstationhandover").addStyleClass("stationHandoverTile");
            airbus.mes.stationHandover.oView.byId("headerstationhandover").removeStyleClass("stationHandoverDialog");
            var aColumns = airbus.mes.stationHandover.oView.byId("TreeTableBasic").getColumns();
            //Resize the width of column regarding space free
            aColumns.forEach(function (el, indice) {
                // Don't do auto resize blocked line it bug
                if (indice === 1) {

                } else {

                    airbus.mes.stationHandover.oView.byId("TreeTableBasic").autoResizeColumn(indice);

                }

            });

        }

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
            airbus.mes.stationtracker.util.AssignmentManager.polypolyAffectation = false;
            if (airbus.mes.polypoly == undefined) {
                sap.ui.getCore().createComponent({
                    name: "airbus.mes.polypoly", // root component folder is resources
                });
            }
        }

        airbus.mes.shell.busyManager.setBusy(airbus.mes.polypoly.oView);
        airbus.mes.polypoly.PolypolyManager.globalContext.bEditable = !airbus.mes.stationtracker.util.AssignmentManager.polypolyAffectation;

        if (!nav.getPage("polypolyPage")) {
            nav.addPage(airbus.mes.polypoly.oView);
        } else {
            oPolypolyPage = nav.getPage("polypolyPage");
            if (oPolypolyPage.getContent().length == 0) {
                oPolypolyPage.addContent(airbus.mes.polypoly.oView);
            }
        }

        if (nav.getPreviousPage() == undefined) {
            nav.to(airbus.mes.polypoly.oView.getId());
        } else if (nav.getPreviousPage().getId() == "polypolyPage") {
            nav.back();
        } else {
            nav.to(airbus.mes.polypoly.oView.getId());
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

    factoryView: function () {
        if (airbus.mes.factoryView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.factoryView", "../components/factoryView");
            sap.ui.getCore().createComponent({ name: "airbus.mes.factoryView" });
            nav.addPage(airbus.mes.factoryView.oView);
        }
        nav.to(airbus.mes.factoryView.oView.getId());
    },

    operationstatus: function (oNavContainer, navigate) {
        if (airbus.mes.operationstatus === undefined || airbus.mes.operationstatus.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.operationstatus", "../components/operationstatus");
            sap.ui.getCore().createComponent({
                name: "airbus.mes.operationstatus",
            });
            oNavContainer.addPage(airbus.mes.operationstatus.oView);
        }

        if (navigate) {
            oNavContainer.to(airbus.mes.operationstatus.oView.getId());
            airbus.mes.operationstatus.oView.oController.setOperationActionButtons();
        }
    },

    qdc: function (oNavContainer) {
        if (airbus.mes.qdc === undefined || airbus.mes.qdc.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.qdc", "../components/qdc");
            sap.ui.getCore().createComponent({ name: "airbus.mes.qdc" });
            oNavContainer.addPage(airbus.mes.qdc.oView);
        }

        //Load data
        airbus.mes.qdc.util.ModelManager.loadQDCModel();
        airbus.mes.qdc.util.ModelManager.loadQDCData();
        airbus.mes.qdc.util.ModelManager.loadQACheckModel();

        // Navigate
        oNavContainer.to(airbus.mes.qdc.oView.getId());
    },


    viewDisruptionsList: function (container, reportDisruptButton) {

        if (airbus.mes.disruptionslist === undefined || airbus.mes.disruptionslist.oView === undefined) {

            jQuery.sap.registerModulePath("airbus.mes.disruptionslist", "../components/disruptionslist");
            sap.ui.getCore().createComponent({ name: "airbus.mes.disruptionslist" });
        }

        if (container.getPage(airbus.mes.disruptionslist.oView.sId) == null) {
            container.addPage(airbus.mes.disruptionslist.oView);
        }

        container.to(airbus.mes.disruptionslist.oView.getId());

        // Set click event on report disruption button
        if (reportDisruptButton) {
            reportDisruptButton.detachPress(airbus.mes.disruptionslist.oView.oController.onReportDisruption);
            reportDisruptButton.attachPress(airbus.mes.disruptionslist.oView.oController.onReportDisruption);
        }
    },


    createDisruptionScreen: function (container, oParams, createButton, updateButton, cancelButton, createAndCloseButton) {

        if (airbus.mes.createdisruption === undefined || airbus.mes.createdisruption.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.createdisruption", "../components/createdisruption");
            sap.ui.getCore().createComponent({ name: "airbus.mes.createdisruption" });

            // Add event delegate
            airbus.mes.createdisruption.oView.addEventDelegate({
                onBeforeShow: function (evt) {
                    airbus.mes.createdisruption.oView.oController.loadData(evt.data.mode, evt.data.oData);
                }
            });
        }

        // Add Page to navigation container
        if (container.getPage(airbus.mes.createdisruption.oView.sId) == null) {
            container.addPage(airbus.mes.createdisruption.oView);
        }

        container.to(airbus.mes.createdisruption.oView.getId(), oParams);

        // Set click event on create, update and cancel disruption button
        if (createButton) {
            createButton.detachPress(airbus.mes.createdisruption.oView.oController.onCreateDisruption);
            createButton.attachPress(airbus.mes.createdisruption.oView.oController.onCreateDisruption);
        }

        if (updateButton) {
            updateButton.detachPress(airbus.mes.createdisruption.oView.oController.onUpdateDisruption);
            updateButton.attachPress(airbus.mes.createdisruption.oView.oController.onUpdateDisruption);
        }

        if (cancelButton) {
            cancelButton.detachPress(airbus.mes.createdisruption.oView.oController.onCancelCreateDisruption);
            cancelButton.attachPress(airbus.mes.createdisruption.oView.oController.onCancelCreateDisruption);
        }
        if (createAndCloseButton) {
            createAndCloseButton.detachPress(airbus.mes.createdisruption.oView.oController.onCreateAndCloseDisruption);
            createAndCloseButton.attachPress(airbus.mes.createdisruption.oView.oController.onCreateAndCloseDisruption);
        }
    },

    disruptionAttachment: function (container) {
        if (airbus.mes.disruptionattachments === undefined || airbus.mes.disruptionattachments.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.disruptionattachments", "../components/disruptionattachments");
            sap.ui.getCore().createComponent({ name: "airbus.mes.disruptionattachments" });
            container.addPage(airbus.mes.disruptionattachments.oView);
        }
        if (container.getPage("DisruptionAttachmentView") == null) {
            container.addPage(airbus.mes.disruptionattachments.oView);
        }
        container.to(airbus.mes.disruptionattachments.oView.getId())
    },

    displayOpeAttachments: function (container) {

        if (airbus.mes.displayOpeAttachments === undefined || airbus.mes.displayOpeAttachments.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.displayOpeAttachments", "../components/displayOpeAttachments");
            sap.ui.getCore().createComponent({ name: "airbus.mes.displayOpeAttachments" });
        }

        //component parameters
        var station = airbus.mes.settings.ModelManager.station;
        var componentProperties = airbus.mes.displayOpeAttachments.component.mProperties;
        componentProperties.phStation = station;
        componentProperties.sSet = airbus.mes.settings.AppConfManager.getConfiguration("VIEW_ATTACHED_TOOL_" + station);
        airbus.mes.displayOpeAttachments.util.ModelManager.checkOperationWorkOrderFilter();//change the value if not "P" or "O"

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
            airbus.mes.jigtools.oView.getController().checkSettingJigsTools();
        }
        airbus.mes.jigtools.oView.getController().getOwnerComponent().setPhStation(airbus.mes.settings.ModelManager.station);
        airbus.mes.jigtools.oView.getController().getOwnerComponent().setOperation(sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_no);
        airbus.mes.jigtools.oView.getController().checkSettingJigsTools();

        if (container.getPage("jigtoolsView") === null) {
            container.addPage(airbus.mes.jigtools.oView);
        }
    },

    componentsDetail: function (container) {
        //the component isn't create in navFunctionx, it's created at the pop-up opening
        //by this way we can keep the data entered in the fields when we change of tab

        //set buttons visible if we are on the fitted/committed view
        if (airbus.mes.components !== undefined && airbus.mes.components.oView !== undefined && airbus.mes.components.oView.oController.committedFittedView) {
            sap.ui.getCore().byId("operationDetailPopup--btnSave").setVisible(true);
            sap.ui.getCore().byId("operationDetailPopup--btnFreezeComponent").setVisible(true);
        }

        //fill the container
        if (container.getPage("componentsView") === null) {
            container.addPage(airbus.mes.components.oView);
        }
    },

    acpnglinksDetail: function (container) {
        //    	Retrieve current workOrder Display
        var sCurrentWorkOrder = sap.ui.getCore().getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].wo_no;
        var oData = airbus.mes.settings.ModelManager;

        if (airbus.mes.acpnglinks === undefined || airbus.mes.acpnglinks.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.acpnglinks", "../components/acpnglinks");
            sap.ui.getCore().createComponent({ name: "airbus.mes.acpnglinks" });
            airbus.mes.acpnglinks.model.ModelManager.loadacpnglinksWorkOrderDetail();
        } else if (airbus.mes.acpnglinks.oView.getController().getOwnerComponent().getWorkOrder() !== sCurrentWorkOrder) {
            // If WorkdOrder changed, need to reload data in the model
            airbus.mes.acpnglinks.oView.getController().getOwnerComponent().setSite(airbus.mes.settings.ModelManager.site);
            airbus.mes.acpnglinks.oView.getController().getOwnerComponent().setWorkOrder(airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].wo_no);
            airbus.mes.acpnglinks.oView.getController().getOwnerComponent().setSfcstep(sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref);
            airbus.mes.acpnglinks.oView.getController().getOwnerComponent().setPhStation("WorkCenterBO:" + oData.site + "," + oData.station);
            airbus.mes.acpnglinks.model.ModelManager.loadacpnglinksWorkOrderDetail();
        }
        airbus.mes.acpnglinks.oView.getController().getOwnerComponent().setPhStation("WorkCenterBO:" + oData.site + "," + oData.station);
        airbus.mes.acpnglinks.oView.getController().getOwnerComponent().setOperation(sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_no);
        airbus.mes.acpnglinks.oView.getController().getOwnerComponent().setSfcstep(sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref);
        if (container.getPage("acpnglinksView") === null) {
            container.addPage(airbus.mes.acpnglinks.oView);
        }
    },

    ncDisplayLink: function (container) {
        // Create component
        if (airbus.mes.ncdisplay === undefined || airbus.mes.ncdisplay.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.ncdisplay", "../components/ncdisplay");
            sap.ui.getCore().createComponent({ name: "airbus.mes.ncdisplay" });
        }
        
        if (container.getPage("ncdisplayView") === null) {
            container.addPage(airbus.mes.ncdisplay.oView);
        }
    },

    tckTemplateLink: function (container) {
        if (airbus.mes.trackingtemplate === undefined || airbus.mes.trackingtemplate.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.trackingtemplate", "../components/trackingtemplate");
            sap.ui.getCore().createComponent({ name: "airbus.mes.trackingtemplate" });
            airbus.mes.trackingtemplate.oView.oController.checkSettingTrackingTemplate();
        }
        if (container.getPage("trackingtemplateView") === null) {
            airbus.mes.trackingtemplate.oView.oController.checkSettingTrackingTemplate();
        	container.addPage(airbus.mes.trackingtemplate.oView);
        }
        airbus.mes.trackingtemplate.util.ModelManager.loadTrackingTemplateModel();
    },

    disruptionTracker: function () {
        if (airbus.mes.disruptiontracker === undefined
            || airbus.mes.disruptiontracker.oView === undefined) {

            jQuery.sap.registerModulePath("airbus.mes.disruptiontracker", "../components/disruptiontracker");
            sap.ui.getCore().createComponent({
                name: "airbus.mes.disruptiontracker",
            });
            nav.addPage(airbus.mes.disruptiontracker.oView);
        }

        if (nav.getPreviousPage() != undefined && nav.getPreviousPage().sId == "stationTrackerView") {
            airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.station = airbus.mes.settings.ModelManager.station;
            airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.msn = airbus.mes.settings.ModelManager.msn;

        } else if (airbus.mes.stationtracker != undefined && airbus.mes.stationtracker.util.ModelManager.showDisrupionBtnClicked == true) {
            airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.station = airbus.mes.settings.ModelManager.station;
            airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.msn = airbus.mes.settings.ModelManager.msn;
            airbus.mes.stationtracker.util.ModelManager.showDisrupionBtnClicked = false;

        } else {
            airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.station = airbus.mes.settings.ModelManager.station;
            airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.msn = "";
        }

        airbus.mes.shell.util.navFunctions.renderDisruptionTracker();

        // Load data
        airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel();

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
        stationItemAll.setText(airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("All")
            + " " + airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("PhyStation"));

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
        msnItemAll.setText(airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("All")
            + " MSN");

        var msnBox = sap.ui.getCore().byId("disruptiontrackerView--msnComboBox");
        msnBox.insertItem(msnItemAll, 0);
        msnBox.setSelectedKey("");
    },



    // Screen to be called from disruption tracker on Laptop/Desktop by support team only -  V1.5
    disruptionsDetailScreen: function (oData) {

        if (airbus.mes.disruptiondetail === undefined || airbus.mes.disruptiondetail.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.disruptiondetail", "../components/disruptiondetail");
            sap.ui.getCore().createComponent({ name: "airbus.mes.disruptiondetail", });


            nav.addPage(airbus.mes.disruptiondetail.oView);

            // Add event delegate to pass the data and load the services
            airbus.mes.disruptiondetail.oView.addEventDelegate({
                onBeforeShow: function (evt) {
                    airbus.mes.disruptiondetail.oView.getController().loadData(evt.data.oData);
                }
            });
        }

        // Navigate
        nav.to(airbus.mes.disruptiondetail.oView.getId(), { "oData": oData });

    },

    disruptionKPI: function () {
        if (airbus.mes.disruptionkpi === undefined || airbus.mes.disruptionkpi.oView === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.disruptionkpi", "../components/disruptionkpi");
            sap.ui.getCore().createComponent({ name: "airbus.mes.disruptionkpi", });

            // Add event delegate
            airbus.mes.disruptionkpi.oView.addEventDelegate({
                onBeforeShow: function (evt) {
                    //Get start date time of current TAKT
                    airbus.mes.disruptionkpi.ModelManager.setTaktStartTime();
                    // Sequence is important !!!
                    airbus.mes.disruptionkpi.ModelManager.oFilters.line = airbus.mes.settings.ModelManager.line;
                    airbus.mes.disruptionkpi.ModelManager.removeDuplicates();
                    airbus.mes.disruptionkpi.ModelManager.setPreSelectionCriteria();
                    airbus.mes.disruptionkpi.ModelManager.loadDisruptionKPIModel();
                }
            });


            nav.addPage(airbus.mes.disruptionkpi.oView);
        }
        nav.to(airbus.mes.disruptionkpi.oView.getId(), {});
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
        if (typeof airbus.mes.worktracker.util.ModelManager.currentOperator.fname == "undefined") {
            airbus.mes.worktracker.util.ModelManager.setCurrentOperator();
        }

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

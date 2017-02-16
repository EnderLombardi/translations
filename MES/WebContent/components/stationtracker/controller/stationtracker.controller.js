"use strict";

jQuery.sap.require("airbus.mes.stationtracker.util.Formatter");
jQuery.sap.require("airbus.mes.stationtracker.util.ModelManager");

sap.ui.controller("airbus.mes.stationtracker.controller.stationtracker", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf components.stationtracker.stationtracker
     */
    onInit: function () {
        //if the page is not busy
        if (airbus.mes.shell.oView.byId('refreshTime').setBusyIndicatorDelay(0)) {
            airbus.mes.shell.oView.byId('refreshTime').setEnabled(true);
        }
    },
    
    onBackPress : function(){
        nav.back();
    },
    
    /**
     * Similar to onBeforeRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf components.stationtracker.stationtracker
     */
    onBeforeRendering: function () {

        airbus.mes.stationtracker.oView.byId("unplannedButton").setVisible(true);
        airbus.mes.stationtracker.oView.byId("oswButton").setVisible(true);
        airbus.mes.stationtracker.oView.byId("kpi_header").setExpanded(true);
        airbus.mes.stationtracker.oView.byId("hideKPI").setEnabled(true);
        
        // change title
        //TODO : translate
        if( airbus.mes.shell.util.navFunctions.splitMode == "WorkTracker" ){
        	airbus.mes.stationtracker.oView.byId("stationTrackerView--StationtrackerTitle").setText("Work Tracker");
        }else {
        	airbus.mes.stationtracker.oView.byId("stationTrackerView--StationtrackerTitle").setText("Station Tracker");
        }

    },

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf components.stationtracker.stationtracker
     */
    onAfterRendering: function () {

    },

    /***************************************************************************
     * Open the production group Popover and display all the prodgroup selectable
     *
     * @param {oEvent} Object wich represent the event on press from "ProductionButton"
     * button
     ****************************************************************************/
    onProductionGroupPress: function (oEvent) {
        if (airbus.mes.stationtracker.productionGroupPopover === undefined) {

            var oView = airbus.mes.stationtracker.oView;
            airbus.mes.stationtracker.productionGroupPopover = sap.ui.xmlfragment("productionGroupPopover", "airbus.mes.stationtracker.fragment.productionGroupPopover", airbus.mes.stationtracker.oView.getController());
            airbus.mes.stationtracker.productionGroupPopover.addStyleClass("alignTextLeft");
            oView.addDependent(airbus.mes.stationtracker.productionGroupPopover);

            airbus.mes.stationtracker.productionGroupPopover.setModel(sap.ui.getCore().getModel("productionGroupModel"), "productionGroupModel");
        }

        var temp = [];
        var binding = sap.ui.getCore().byId("productionGroupPopover--myList").getBinding("items");
        //path correspond to relatif path after binding, here absolute path is /Rowsets/Rowset/0/Row
        var Filter = new sap.ui.model.Filter({
            path: "PROD_GROUP",
            test: function (value) {
                if (temp.indexOf(value) == -1) {
                    temp.push(value);
                    return true;
                } else {
                    return false;
                }
            }
        });

        binding.filter(Filter);

        // delay because addDependent will do a async rerendering and the popover will immediately close without it
        var oButton = oEvent.getSource();
        jQuery.sap.delayedCall(0, this, function () {
            airbus.mes.stationtracker.productionGroupPopover.openBy(oButton);
        });
    },

    /***************************************************************************
     * Open the popover of Team it permit to go on team avaibility
     * polyPoly ressource pool
     *
     * @param {oEvent} Object wich represent the event on press from "TeamButton"
     * button
     ****************************************************************************/
    onTeamPress: function (oEvent) {
        if (!this._oPopover) {

            this._oPopover = sap.ui.xmlfragment("airbus.mes.stationtracker.fragment.teamPopover", this);
            this._oPopover.addStyleClass("alignTextLeft");
            this.getView().addDependent(this._oPopover);

        }
        this._oPopover.openBy(oEvent.getSource());
    },

    /***************************************************************************
     * Display the scheduler in view mode "Shift" only on shift is represented
     * and the step of scheduler is set to 30min
     *
     ****************************************************************************/
    onShiftPress: function () {

        airbus.mes.stationtracker.util.ShiftManager.shiftDisplay = true;
        airbus.mes.stationtracker.util.ShiftManager.dayDisplay = false;

        scheduler.matrix['timeline'].x_unit = 'minute';
        scheduler.matrix['timeline'].x_step = 30;
        scheduler.matrix['timeline'].x_date = '%H:%i';
        scheduler.templates.timeline_scale_date = function (date) {
            var func = scheduler.date.date_to_str(scheduler.matrix['timeline'].x_date);
            return func(date);
        };
        scheduler.config.preserve_length = true;
        for (var i = 0; i < $("select[class='selectBoxStation']").length; i++) {
            $("select[class='selectBoxStation']").eq(i).remove();
        }

        airbus.mes.stationtracker.util.ShiftManager.ShiftMarkerID.forEach(function (el) {
            scheduler.deleteMarkedTimespan(el);
        })

        airbus.mes.stationtracker.oView.byId("selectShift").setEnabled(false);
        airbus.mes.stationtracker.oView.byId("selectShift").fireChange(0);
    },

    /***************************************************************************
     * Display the scheduler in view mode "Day" all shift of the day are represented
     * and the step of scheduler is set to 60min
     *
     ****************************************************************************/
    onDayPress: function () {

        airbus.mes.stationtracker.util.ShiftManager.shiftDisplay = false;
        airbus.mes.stationtracker.util.ShiftManager.dayDisplay = true;

        scheduler.matrix['timeline'].x_unit = 'minute';
        scheduler.matrix['timeline'].x_step = 60;
        scheduler.matrix['timeline'].x_date = '%H:%i';

        scheduler.templates.timeline_scale_date = function (date) {
            var func = scheduler.date.date_to_str(scheduler.matrix['timeline'].x_date);
            return func(date);
        };
        scheduler.config.preserve_length = true;

        // Need this to update selected view and dont brake the behaviour of overflowtoolbar not needed if use Toolbar
        airbus.mes.stationtracker.oView.byId("buttonViewMode").rerender();
        airbus.mes.stationtracker.oView.byId("buttonViewMode").setSelectedKey("day");

        airbus.mes.stationtracker.oView.byId("selectShift").setEnabled(true);
        //Use Previous Shift selection
        airbus.mes.stationtracker.oView.byId("selectShift").fireChange(0);
    },

    /***************************************************************************
     * On initial pressed it load the model of initial operation re-compute the
     * hierarchy of operation and display in grey initial operation
     *
     ****************************************************************************/
    onInitialPlanPress: function () {

        airbus.mes.stationtracker.oView.byId("stationtracker").setBusy(true);
        var GroupingBoxingManager = airbus.mes.stationtracker.util.GroupingBoxingManager;

        if (airbus.mes.stationtracker.util.GroupingBoxingManager.showInitial) {

            airbus.mes.stationtracker.util.GroupingBoxingManager.showInitial = false;
            GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);
            airbus.mes.stationtracker.oView.getController().changeShift();


        } else {

            airbus.mes.stationtracker.util.GroupingBoxingManager.showInitial = true;
            GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);
            airbus.mes.stationtracker.oView.getController().changeShift();
        }
    },

    /***************************************************************************
	 * [batch1 - batch2 button] hide
     * Display a border blue on operation in gantt wich has the attribute CPP_CLUSTER
     * fullfil
     *
     ****************************************************************************/
    onCPPress: function () {

        if (airbus.mes.stationtracker.util.AssignmentManager.CpPress === false) {
            scheduler.templates.event_class = function (start, end, ev) {
                if (ev.criticalPath != "---") {
                    return "operationCP";
                } else {
                    return "grey";
                }
            };
            airbus.mes.stationtracker.util.AssignmentManager.CpPress = true;
            scheduler.updateView();
        } else {
            scheduler.templates.event_class = function (start, end, ev) {
                return "grey";
            };

            airbus.mes.stationtracker.util.AssignmentManager.CpPress = false;
            scheduler.updateView();
        }
    },


    onPolypolyOpen: function (oEvent) {
        airbus.mes.shell.util.navFunctions.polypoly();
    },

    onResourcePoolOpen: function (oEvt) {
        airbus.mes.shell.util.navFunctions.resourcePool();
    },
    
    /***************************************************************************
     * Open Missing Parts View
     *
     ****************************************************************************/
    onMPPress: function () {
    	if (airbus.mes.missingParts === undefined) {
            jQuery.sap.registerModulePath("airbus.mes.missingParts", "../components/missingParts");
            sap.ui.getCore().createComponent({ name: "airbus.mes.missingParts", });
        }
        //load data
        airbus.mes.missingParts.model.ModelManager.loadMPDetail();
        //Show popup
    	airbus.mes.missingParts.oView.getContent()[0].open();
    },

    /***************************************************************************
     * Open fragment of unplanned activities
     *
     ****************************************************************************/
    onUnplannedPress: function () {
        if (airbus.mes.stationtracker.ImportOswUnplannedPopover === undefined) {

            airbus.mes.stationtracker.ImportOswUnplannedPopover = sap.ui.xmlfragment("ImportOswUnplannedPopover", "airbus.mes.stationtracker.fragment.ImportOswUnplannedPopover", airbus.mes.stationtracker.oView.getController());
            airbus.mes.stationtracker.ImportOswUnplannedPopover.addStyleClass("alignTextLeft");
            airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.ImportOswUnplannedPopover);
            airbus.mes.stationtracker.ImportOswUnplannedPopover.setModel(sap.ui.getCore().getModel("groupModel"), "groupModel");

            airbus.mes.stationtracker.ImportOswUnplannedPopover.setBusyIndicatorDelay(0);

        }
        sap.ui.getCore().byId("ImportOswUnplannedPopover--myList").bindAggregation('items', {
            path: "WorkListModel>/",
            template: sap.ui.getCore().byId("ImportOswUnplannedPopover--sorterList"),
            sorter: [new sap.ui.model.Sorter({
                // Change this value dynamic
                path: 'COMPETENCY',
                descending: false,
                group: true,
            }), new sap.ui.model.Sorter({
                path: 'index',
                descending: false
            })]
        });
        sap.ui.getCore().byId("ImportOswUnplannedPopover--filterPhStation").setVisible(false);
        airbus.mes.stationtracker.CheckQa = "UNPLANNED";
        sap.ui.getCore().byId("ImportOswUnplannedPopover--LabelTitle").setText(airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("UnplannedActivities"));
        var oModel = sap.ui.getCore().getModel("unPlannedModel");

        //Changed the data of the worklist by unplannned model
        airbus.mes.stationtracker.ImportOswUnplannedPopover.setModel(new sap.ui.model.json.JSONModel(oModel.oData.Rowsets.Rowset[0].Row), "WorkListModel");
        airbus.mes.stationtracker.ImportOswUnplannedPopover.getModel("WorkListModel").refresh(true);

        //reset name pop up
        sap.ui.getCore().byId("ImportOswUnplannedPopover--filterStatus").setSelectedKey("StatusAll");

        // delay because addDependent will do a async rerendering and the popover will immediately close without it
        jQuery.sap.delayedCall(0, this, function () {
            airbus.mes.stationtracker.ImportOswUnplannedPopover.open();

        });
    },

    /***************************************************************************
     * Open fragment of OSW and open dialog.
     *
     ****************************************************************************/
    onOSWPress: function () {
    	
    	// Create component and go on stationHandover
        airbus.mes.shell.util.navFunctions.stationHandover();
       
        //Hide column not used in that mode SD-PPC-ST-1840
        airbus.mes.stationHandover.oView.byId("TreeTableBasic").getColumns()[5].setVisible(false);
        airbus.mes.stationHandover.oView.byId("TreeTableBasic").getColumns()[6].setVisible(false);
        
        
//        // delay because addDependent will do a async rerendering and the popover will immediately close without it
//        jQuery.sap.delayedCall(0, this, function () {
//        	airbus.mes.stationtracker.ImportOswUnplannedPopover;
//
//        });

    },

    /***************************************************************************
     * Fire when the user close the popover of prodgroup
     * It Reload all the operation filtered by mii regarding prodgroup send
     *
     ****************************************************************************/
    onProdGroupSelFinish: function () {

        // show loading on gantt
        airbus.mes.stationtracker.oView.byId("stationtracker").setBusy(true);
        // Filter the stationtracker model with current production group
        var sProdGroup = airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("ProductionGroup") + " : ";
        var sProdGroupMii = "";


        // If no Production group have been selected
        // Or all production group have been selected
        if (sap.ui.getCore().byId("productionGroupPopover--myList").getSelectedItems().length === 0
            || sap.ui.getCore().byId("productionGroupPopover--myList").getSelectedItems().length === sap.ui.getCore().byId("productionGroupPopover--myList").getItems().length) {

            // We write All instead of concatenantion of production group
            sProdGroup += airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("StatusAll");

            airbus.mes.stationtracker.util.ModelManager.settings.prodGroup = "%";

        } else {
            sap.ui.getCore().byId("productionGroupPopover--myList").getSelectedItems().forEach(function (el) {
                sProdGroup += el.mProperties.title + ",";
                sProdGroupMii += el.mProperties.title + "','";
            });
            sProdGroup = sProdGroup.slice(0, -1);
            airbus.mes.stationtracker.util.ModelManager.settings.prodGroup = sProdGroupMii.slice(0, -3);

        }

        airbus.mes.stationtracker.oView.byId("ProductionButton").setText(sProdGroup);
        airbus.mes.shell.oView.getController().loadStationTrackerGantKPI();
    },

    /***************************************************************************
     * Open the popover of Team it permit to go on team avaibility
     * polyPoly ressource pool
     *
     ****************************************************************************/
    changeGroup: function () {
        var GroupingBoxingManager = airbus.mes.stationtracker.util.GroupingBoxingManager;

        GroupingBoxingManager.group = sap.ui.getCore().byId("stationTrackerView").byId("selectGroup").getSelectedKey();
        GroupingBoxingManager.box = sap.ui.getCore().byId("stationTrackerView").byId("selectBox").getSelectedKey();

        GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);
        // Need to display marked shift
        airbus.mes.stationtracker.oView.getController().changeShift();
    },

    /***************************************************************************
     * Re compute the operation hierarchy regarding the boxing value selected
     *
     ****************************************************************************/
    changeBox: function () {
        var GroupingBoxingManager = airbus.mes.stationtracker.util.GroupingBoxingManager;

        GroupingBoxingManager.group = sap.ui.getCore().byId("stationTrackerView").byId("selectGroup").getSelectedKey();
        GroupingBoxingManager.box = sap.ui.getCore().byId("stationTrackerView").byId("selectBox").getSelectedKey();

        GroupingBoxingManager.parseOperation(GroupingBoxingManager.group, GroupingBoxingManager.box);
        // Need to display marked shift
        airbus.mes.stationtracker.oView.getController().changeShift();
    },

    onNavBack: function (oEvent) {
        var oNavCon = sap.ui.getCore().byId("operationPopover--navOperatorContainer");
        var oOperationPopover = sap.ui.getCore().byId("operationPopover--operationPopoverID");
        oOperationPopover.setContentHeight("395px");
        oOperationPopover.setContentWidth("770px");
        oNavCon.back();
    },

    onCloseWorklist: function (oEvent) {
        //Close Popup
        this.onCloseDialog(oEvent);
    },
    /**
     * Fire when the user click on confirm in the operation info popup in folder
     * reschedule call the rescheduling service.
     *
     * @param{OBEJCT} oEvent, Object of event press
     */
    onRescheduleConfirm: function (oEvent) {

        var fFormater = airbus.mes.stationtracker.util.Formatter;
        var dNewDate = sap.ui.getCore().byId("reschedulePage--datePicker").getDateValue();
        var dNewDateSecond = sap.ui.getCore().byId("reschedulePage--hourPicker").getDateValue();
        // Merge in string year mount date + hour minutes second in string + retransform in js date format
        var sNewDate = fFormater.jsDateFromDayTimeStr(fFormater.dDate2sDate(dNewDate).split("T")[0] + "T" + fFormater.dDate2sDate(dNewDateSecond).split("T")[1]);
        var oModel = airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0];

        var oInitial = {
            "start_date": oModel.reschedule_start_time.replace(" ", "T"),
            "skill": oModel.skills,
            "avlLine": oModel.avlLine,
            "sSfcStep": oModel.sfc_step_ref,
            "ProdGroup": oModel.prodGroup,
            "section_id": "_" + oModel.avlLine + "_" + oModel.skills,
        };

        var oFinal = {
            "start_date": sNewDate,
            // Merge avl + skill to correspond with the section_Id used in sendRescheduleRequest function.
            "section_id": "_" + oModel.avlLine + "_" + oModel.skills,
            "skill": oModel.skills,
            "avlLine": oModel.avlLine,
            "sSfcStep": oModel.sfc_step_ref,
            "ProdGroup": oModel.prodGroup,
        };

        //Store oFinal and oInitial value in case of check qa is not successfull
        airbus.mes.stationtracker.oFinal = oFinal;
        airbus.mes.stationtracker.oInitial = oInitial;
        airbus.mes.stationtracker.util.ModelManager.sendRescheduleRequest(false, oFinal, oInitial);
        //Close Popup
        this.onCloseDialog(oEvent);
    },

    /**
     * Fire when the user click on Import of unplanned pop-up 
     *
     *  @return{STRING} Myvalue, current value of box/group Id
     *
     *  TODO : change access to list
     */
    onUnplannedImport: function () {

        var oList = airbus.mes.stationtracker.ImportOswUnplannedPopover.getContent()[0].getItems()[1];

        if (oList.getSelectedItems().length > 0) {

            if (airbus.mes.stationtracker.CheckQa === "UNPLANNED") {
                var aPath = oList.getSelectedContextPaths();
                var aSFC_Step = [];
                var sNewSkill = "Unplanned";
                var sNewAvl = "1";

                //Prepare data for the update query for MII
                aPath.forEach(function (el) {

                    aSFC_Step.push(
                        {
                            "sfcStepBO": airbus.mes.stationtracker.ImportOswUnplannedPopover.getModel("WorkListModel").getProperty(el).SFC_STEP_REF,
                            "Previous_Skill": airbus.mes.stationtracker.ImportOswUnplannedPopover.getModel("WorkListModel").getProperty(el).SKILLS,
                            "Previous_Line": airbus.mes.stationtracker.ImportOswUnplannedPopover.getModel("WorkListModel").getProperty(el).AVL_LINE,
                            "Skill": sNewSkill,
                            "Line": sNewAvl,
                        }
                    );

                });
                //store sfcstep and prodgroup if Qa check is not succesfull
                airbus.mes.stationtracker.ImportOswUnplannedPopover.aSFC_Step = aSFC_Step;
                airbus.mes.stationtracker.util.ModelManager.setOSW(aSFC_Step, "", false, false);

            } else {

                var oModel = sap.ui.getCore().getModel("productionGroupModel");
                if (!airbus.mes.stationtracker.dialogProdGroup) {
                    airbus.mes.stationtracker.dialogProdGroup = sap.ui.xmlfragment("dialogProdGroup", "airbus.mes.stationtracker.fragment.dialogProdGroup", airbus.mes.stationtracker.oView.getController());
                    airbus.mes.stationtracker.dialogProdGroup.setModel(oModel, "productionGroupModel");
                    airbus.mes.stationtracker.dialogProdGroup.setModel(airbus.mes.stationtracker.oView.getModel("StationTrackerI18n"), "StationTrackerI18n");
                }

                var temp = [];
                var binding = sap.ui.getCore().byId("dialogProdGroup--selectProdGroup").getBinding("items");
                //                path correspond to relatif path after binding, here absolute path is /Rowsets/Rowset/0/Row
                var Filter = new sap.ui.model.Filter({
                    path: "PROD_GROUP",
                    test: function (value) {
                        if (temp.indexOf(value) == -1) {
                            temp.push(value);
                            return true;
                        } else {
                            return false;
                        }
                    }
                });

                binding.filter(Filter);

                airbus.mes.stationtracker.dialogProdGroup.open();
            }
        } else {

            sap.m.MessageToast.show(airbus.mes.stationtracker.oView.getModel("StationTrackerI18n")
                .getProperty("NoOSWData"));
        }

    },

    /***************************************************************************
     * Fire selected the prodGroup and import osw
     *
     ****************************************************************************/
    onOswImport: function () {

        var sProdGroup = airbus.mes.stationtracker.dialogProdGroup.getContent()[0].getSelectedItem().getText();
        var oList = airbus.mes.stationtracker.ImportOswUnplannedPopover.getContent()[0].getItems()[1];
        var aPath = oList.getSelectedContextPaths();
        var aSFC_Step = [];
        var sNewSkill = "Osw";
        var sNewAvl = "1";
        //Prepare data for the update query for MII
        aPath.forEach(function (el) {

            aSFC_Step.push(
                {
                    "sfcStepBO": airbus.mes.stationtracker.ImportOswUnplannedPopover.getModel("WorkListModel").getProperty(el).SFC_STEP_REF,
                    "Previous_Skill": airbus.mes.stationtracker.ImportOswUnplannedPopover.getModel("WorkListModel").getProperty(el).SKILLS,
                    "Previous_Line": airbus.mes.stationtracker.ImportOswUnplannedPopover.getModel("WorkListModel").getProperty(el).AVL_LINE,
                    "Skill": sNewSkill,
                    "Line": sNewAvl,
                }
            );

        });

        //store sfcstep and prodgroup if Qa check is not succesfull
        airbus.mes.stationtracker.ImportOswUnplannedPopover.aSFC_Step = aSFC_Step;
        airbus.mes.stationtracker.ImportOswUnplannedPopover.sProdGroup = sProdGroup;

        airbus.mes.stationtracker.util.ModelManager.setOSW(aSFC_Step, sProdGroup, false, true);


    },

    onUnplannedSelectAll: function (oEvent) {
        var oList = airbus.mes.stationtracker.ImportOswUnplannedPopover.getContent()[0].getItems()[1];
        if (oEvent.getParameter("selected")) {
            oList.selectAll();
        } else {
            oList.getSelectedItems().forEach(function (elt) {
                elt.setSelected(false);
            })
        }
    },

    onUnplannedClose: function (oEvent) {
        airbus.mes.stationtracker.worklistPopover.close();

    },

    /***************************************************************************
     * Fire when selected shift value in combobox it redisplay marker of shift
     * in the gantt
     *
     ****************************************************************************/
    changeShift: function () {

        var sPath = airbus.mes.stationtracker.oView.byId("selectShift").getSelectedIndex();
        airbus.mes.stationtracker.util.ShiftManager.sIndexCombobox = sPath;
        var oModel = airbus.mes.stationtracker.oView.getModel("stationTrackerShift").getProperty("/" + sPath);

        airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.shiftName = oModel.shiftName;
        airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.shiftID = oModel.shiftID;
        airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.day = oModel.day;

        if (airbus.mes.stationtracker.util.ShiftManager.dayDisplay) {

            var intervals = airbus.mes.stationtracker.util.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.util.ShiftManager.current_day][airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.shiftID];


            airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.StartDate = intervals[0].StartDate;
            airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.EndDate = intervals[intervals.length - 1].EndDate;
            // remove previous marker
            airbus.mes.stationtracker.util.ShiftManager.ShiftMarkerID.forEach(function (el) {

                scheduler.deleteMarkedTimespan(el);

            });

            airbus.mes.stationtracker.util.ShiftManager.ShiftMarkerID.push(scheduler.addMarkedTimespan({
                //get startdate of first shift maybe need to get only the shift day before the current to avoid issue perf?
                start_date: airbus.mes.stationtracker.util.ShiftManager.shifts[0].StartDate,
                end_date: airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.StartDate,
                css: "shiftCss",

            }));

            airbus.mes.stationtracker.util.ShiftManager.ShiftMarkerID.push(scheduler.addMarkedTimespan({

                start_date: airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.EndDate,
                //get enddate of last shift maybe need to get only the shift day before the current to avoid issue perf?
                end_date: airbus.mes.stationtracker.util.ShiftManager.shifts[airbus.mes.stationtracker.util.ShiftManager.shifts.length - 1].EndDate,
                css: "shiftCss",

            }));

            scheduler.updateView();
        }

        // this is permit to display same shift when clicking from day to shift display.
        if (airbus.mes.stationtracker.util.ShiftManager.shiftDisplay) {

            scheduler.updateView(airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.StartDate);
            airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(airbus.mes.stationtracker.util.ShiftManager.ShiftSelected.shiftID);
        }

        //        Relaunch service to for KPI header
        airbus.mes.stationtracker.util.ModelManager.loadKPIshiftStaffing();
    },

    /***************************************************************************
     * [batch1 - batch2 button] hide
     * Re apply the sorter on the model of the worklist to group operation
     * in worklist popup
     *
     * @param {oEvent} Object wich represent the event on press from "TeamButton"
     * button
     ****************************************************************************/
    changeGroupWorkList: function (oEvent) {

        var aModel = airbus.mes.stationtracker.worklistPopover.aModel;
        airbus.mes.stationtracker.util.Formatter.sortWorklistAndBind(oEvent.getSource().getSelectedKey(), aModel);

    },

    /***************************************************************************
     * Re apply the sorter on the model of the osw and unplanned to group operation
     * in worklist popup
     *
     * @param {oEvent} Object wich represent the event on press from "TeamButton" or 
     * directly the value to user
     * button
     ****************************************************************************/
    changeGroupUnplannedOsw: function (oEvent, sValue) {
        var sFilter = "";

        if (sValue === undefined) {
            sFilter = oEvent.getSource().getSelectedKey();
        } else {
            sFilter = sValue;
        }

        sap.ui.getCore().byId("ImportOswUnplannedPopover--myList").bindAggregation('items', {
            path: "WorkListModel>/",
            template: sap.ui.getCore().byId("ImportOswUnplannedPopover--sorterList"),
            sorter: [new sap.ui.model.Sorter({
                // Change this value dynamic
                path: sFilter, //oEvt.getSource().getSelectedKey();
                descending: false,
                group: true,
            }), new sap.ui.model.Sorter({
                path: 'index',
                descending: false
            })]
        });
    },

    /**
     * Sort worklist according to business rule.
     *
     * Rule in detail: the operations shall be grouped by WO.
     * These WO groups shall be sorted using the start date/time
     * of their box in the Gantt, then using the schedule start
     * date/time and then numerical order, ascending order.
     * Within one group of operations belonging to the same WO,
     * operations shall be sorted by ascending operation number.
     *
     * @param oWorkList
     */
    sortWorkList: function (oWorkList) {
        var oWL2 = [];
        var oWOList = [];
        var i;

        // Sort by WO number (to group operations with same WO)
        // Also group by operation, because the sort order is kept for
        // operations
        oWorkList.sort(this.fieldComparator(['WORKORDER_ID',
            'OPERATION_ID']));

        // Constitute a table of WO groups with operations associated
        // The group object has template bellow.
        var currentWO = {
            shopOrder: undefined,
            dynamicStartDate: undefined,
            scheduledStartDate: undefined,
            operationsID: [],
        };

        for (i = 0; i < oWorkList.length; i++) {
            if (currentWO.shopOrder !== oWorkList[i].shopOrder) {

                if (currentWO.operationsID.length > 0) {
                    oWOList.push(currentWO);
                }

                currentWO = {
                    shopkOrder: oWorkList[i].shopOrder,
                    startDate: oWorkList[i].startDate,
                    operationsID: [oWorkList[i]],
                };

            } else {
                if (oWorkList[i].startDate < currentWO.startDate) {
                    currentWO.startDate = oWorkList[i].startDate;
                }
                currentWO.operationsID.push(oWorkList[i]);
            }
        }

        oWOList.push(currentWO);

        // Sort each groups (Work Orders)
        // The operations inside each groups should still be in the same order
        // (ascending order preserved)
        oWOList.sort(this.fieldComparator(['startDate', 'WORKORDER_ID']));

        // Flatten worklist (take operations of each groups)
        oWL2 = oWOList.reduce(function (prev, curr) {
            return prev.concat(curr.operationsID);
        }, []);

        // Keep the index, for stable sorting on WorkList screen (as sorter is
        // also used for grouping)
        oWL2.forEach(function (el, i) {
            el.index = i;
        });

        return oWL2;
    },

    //////////////////////////////////////

    /**
    * Returns a comparator function on the provided fields, in the provided
    * order of priority, to be used for example by an Array.sort() function.
    *
    * @param {Array} fields, Array of object
    * @returns {Function} comparator
    */
    fieldComparator: function (fields) {
        return function (a, b) {
            return fields.map(function (o) {
                var dir = 1;
                if (o[0] === '-') {
                    dir = -1;
                    o = o.substring(1);
                }
                if (a[o] > b[o])
                    return dir;
                if (a[o] < b[o])
                    return -(dir);
                return 0;
            }).reduce(function firstNonZeroValue(p, n) {
                return p ? p : n;
            }, 0);
        };
    },

    /**
     * Filter the worklistPopover on the status
     *
     * @param {OBJECT} oEvent,object of event pressed
     */
    onChangeFilter: function (oEvent) {
        var aMyFilter = [];

        // Check the current value of the filter status
        if (oEvent.getSource().getSelectedKey() === "StatusAll") {
            // if status ALL, we have to remove all filter
            sap.ui.getCore().byId("worklistPopover--myList").getBinding("items").filter();
        } else {
            // we apply the a filter
            switch (oEvent.getSource().getSelectedKey()) {
                case "StatusBlocked":
                    aMyFilter.push(new sap.ui.model.Filter("status", "EQ", "5"));
                    aMyFilter.push(new sap.ui.model.Filter("status", "EQ", "6"));
                    aMyFilter.push(new sap.ui.model.Filter("status", "EQ", "7"));
                    aMyFilter.push(new sap.ui.model.Filter("status", "EQ", "4"));
                    break;
                case "StatusPaused":
                    aMyFilter.push(new sap.ui.model.Filter("status", "EQ", "3"));
                    break;
                case "StatusStarted":
                    aMyFilter.push(new sap.ui.model.Filter("status", "EQ", "2"));
                    break;
                case "StatusNotStarted":
                    aMyFilter.push(new sap.ui.model.Filter("status", "EQ", "1"));
                    break;
                case "StatusConfirmed":
                    aMyFilter.push(new sap.ui.model.Filter("status", "EQ", "0"));
                    break;
                default:
            }
            sap.ui.getCore().byId("worklistPopover--myList").getBinding("items").filter(new sap.ui.model.Filter(aMyFilter, false));
        }
    },

    /**
     * Filter the ImportOswUnplannedPopover on the status
     *
     * @param {OBJECT} oEvent,object of event pressed
     */
    onChangeFilterOSWUnplanned: function (oEvent) {
        var aMyFilter = [];
        //var sStatus;

        // Check the current value of the filter status
        if (oEvent.getSource().getSelectedKey() === "StatusAll") {
            // if status ALL, we have to remove all filter
            sap.ui.getCore().byId("ImportOswUnplannedPopover--myList").getBinding("items").filter();
        } else {
            // we apply the a filter this filter is apply directly on mii service
            switch (oEvent.getSource().getSelectedKey()) {
                case "StatusBlocked":
                    aMyFilter.push(new sap.ui.model.Filter("DISRUPTION", "EQ", "D4"));
                    aMyFilter.push(new sap.ui.model.Filter("DISRUPTION", "EQ", "D3"));
                    aMyFilter.push(new sap.ui.model.Filter("DISRUPTION", "EQ", "D2"));
                    aMyFilter.push(new sap.ui.model.Filter("DISRUPTION", "EQ", "D1"));
                    break;
                case "StatusPaused":
                    aMyFilter.push(new sap.ui.model.Filter("PAUSED", "EQ", "---"));
                    aMyFilter.push(new sap.ui.model.Filter("PREVIOUSLY_STARTED", "EQ", "true"));
                    // Use AND filter
                    sap.ui.getCore().byId("ImportOswUnplannedPopover--myList").getBinding("items").filter(new sap.ui.model.Filter(aMyFilter, true));
                    return;
                    break;
                case "StatusStarted":
                    aMyFilter.push(new sap.ui.model.Filter("PAUSED", "EQ", "false"));
                    break;
                case "StatusNotStarted":
                    aMyFilter.push(new sap.ui.model.Filter("PAUSED", "EQ", "---"));
                    aMyFilter.push(new sap.ui.model.Filter("PREVIOUSLY_STARTED", "NE", "true"));
                    aMyFilter.push(new sap.ui.model.Filter("DISRUPTION", "NE", "D4"));
                    aMyFilter.push(new sap.ui.model.Filter("DISRUPTION", "NE", "D3"));
                    aMyFilter.push(new sap.ui.model.Filter("DISRUPTION", "NE", "D2"));
                    aMyFilter.push(new sap.ui.model.Filter("DISRUPTION", "NE", "D1"));
                    aMyFilter.push(new sap.ui.model.Filter("STATE", "NE", "C"));
                    // User AND filter
                    sap.ui.getCore().byId("ImportOswUnplannedPopover--myList").getBinding("items").filter(new sap.ui.model.Filter(aMyFilter, true));
                    return;
                    break;
                case "StatusConfirmed":
                    aMyFilter.push(new sap.ui.model.Filter("STATE", "EQ", "C"));
                    break;
                default:
            }
            sap.ui.getCore().byId("ImportOswUnplannedPopover--myList").getBinding("items").filter(new sap.ui.model.Filter(aMyFilter, false));
        }

    },

    ClosePolyPoly: function (oEvent) {

        this.onCloseDialog(oEvent);
        airbus.mes.stationtracker.util.AssignmentManager.polypolyAffectation = false;

    },

    getI18nValue: function (sKey) {
        return this.getView().getModel("StationTrackerI18n").getProperty(sKey);
    },

    selectUser: function (oEvt) {

        // not used
        var oSelected = oEvt.getSource().getSelectedItem().mProperties;
        console.log(oSelected.key);
        airbus.mes.stationtracker.oView.byId("stationtracker").setBusy(true);

        // for specifique users
        if (oSelected.key != "ALL") {

            airbus.mes.stationtracker.util.AssignmentManager.userSelected = oSelected.key;
            airbus.mes.shell.oView.getController().loadStationTrackerGantKPI();

            airbus.mes.stationtracker.util.ModelManager.loadSplitModel();

            if (airbus.mes.shell.util.navFunctions.splitMode == "StationTracker") {
                //show split screen if select user
                airbus.mes.shell.oView.oController.renderWorkTracker();
            }

            // task with no user 
        } else if (oSelected.key === "---") {

            airbus.mes.stationtracker.util.AssignmentManager.userSelected = oSelected.key;
            airbus.mes.shell.oView.getController().loadStationTrackerGantKPI();

            if (airbus.mes.shell.util.navFunctions.splitMode == "StationTracker") {
                //hide split screen if select user
                airbus.mes.stationtracker.oView.byId("splitWorkTra").removeContentArea(1);
            }
            sap.ui.getCore().byId("stationTrackerView--splitWorkTra").rerender();
            //force gantt 100% height
            $("#stationTrackerView--splitWorkTra").children().css('height', '100%');

            //for all cases
        } else {

            airbus.mes.stationtracker.util.AssignmentManager.userSelected = "%";
            airbus.mes.shell.oView.getController().loadStationTrackerGantKPI();

            if (airbus.mes.shell.util.navFunctions.splitMode == "StationTracker") {
                //hide split screen if select user
                airbus.mes.stationtracker.oView.byId("splitWorkTra").removeContentArea(1);
            }
            sap.ui.getCore().byId("stationTrackerView--splitWorkTra").rerender();
            //force gantt 100% height
            $("#stationTrackerView--splitWorkTra").children().css('height', '100%');
        }


    },
    showDisruption: function (oEvent) {
        // aboolean variable is taken to know if the button Disruption from station tracker is clicked
        //If yes, then the Disruptiontracker will be loaded with filter on Current Station
        airbus.mes.stationtracker.util.ModelManager.showDisrupionBtnClicked = true;
        airbus.mes.shell.util.navFunctions.disruptionTracker();
    },

    /**
     * Change the date of scheduler
     */
    changeDay: function (oEvt) {

        scheduler.updateView(oEvt.getSource().getDateValue());
        airbus.mes.stationtracker.util.ModelManager.selectMyShift();
    },

    /**
     * Collapse or display KPI
     */
    hideKPI: function () {

        var oPanel = airbus.mes.stationtracker.oView.byId("kpi_header");
        var bIsExpanded = oPanel.getExpanded();

        if (bIsExpanded) {
            airbus.mes.stationtracker.oView.byId("hideKPI").setIcon("sap-icon://show");
            airbus.mes.stationtracker.oView.byId("hideKPI").setText(airbus.mes.stationtracker.oView.getController().getI18nValue("ShowKPIS"));
        } else {
            airbus.mes.stationtracker.oView.byId("hideKPI").setIcon("sap-icon://hide");
            airbus.mes.stationtracker.oView.byId("hideKPI").setText(airbus.mes.stationtracker.oView.getController().getI18nValue("HideKPIS"));
        }

        oPanel.setExpanded(!bIsExpanded);

    },
    /**
     * Action on fragment worklist
     */
    operationWorkListClick: function (oEvent) {

        console.log(oEvent);

        // Retrieve corresponding operation
        // Format of attribute displayValue is WorkOrderId Name separated by space
        var sWorkOrder_id = oEvent.getSource().getParent().getAggregation("items")[0].getDisplayValue().split(" ")[0];

        // Format of attribute displayValue2 is OperationId space process calculation
        var sOperation_id = oEvent.getSource().getParent().getAggregation("items")[0].getDisplayValue2().split(" ")[0];

        // We have to scan operationHierarchie to retrieve the corresponding item on the Model
        var aModel = airbus.mes.stationtracker.worklistPopover.aModel;

        aModel = aModel.filter(function (el) {
            return el.OPERATION_ID === sOperation_id &&
                el.WORKORDER_ID === sWorkOrder_id;
        });
        // Call the operation list popup
        airbus.mes.stationtracker.util.ModelManager.openOperationDetailPopup(aModel);
    },


    /**
     * function about date picker fragment
     */

    //Fired when Calendar Button is clicked
    //Open datePicker XML fragment
    datePick: function () {
        if (airbus.mes.stationtracker.datePicker === undefined) {
            airbus.mes.stationtracker.datePicker = sap.ui.xmlfragment("datePickerFragment", "airbus.mes.stationtracker.fragment.datePickerFragment", airbus.mes.stationtracker.oView.getController());
            airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.datePicker);

            airbus.mes.stationtracker.oView.oCalendar = airbus.mes.stationtracker.datePicker.getContent()[0];
        }
        airbus.mes.stationtracker.datePicker.openBy(airbus.mes.stationtracker.oView.byId("dateButton"));
    },

    onSelectToday: function () {
        airbus.mes.stationtracker.oView.oCalendar.removeAllSelectedDates();
        airbus.mes.stationtracker.oView.oCalendar.displayDate(new Date());
        airbus.mes.stationtracker.oView.oCalendar.addSelectedDate(new sap.ui.unified.DateRange({ startDate: new Date() }));
        airbus.mes.stationtracker.oView.getController().dateSelected();
    },

    dateSelected: function () {
        // Check if current selected date corresponds to range of shift date
        var dSeletectedDate = airbus.mes.stationtracker.oView.oCalendar.getSelectedDates()[0].getStartDate();
        if (dSeletectedDate < airbus.mes.stationtracker.util.GroupingBoxingManager.minDate || dSeletectedDate > airbus.mes.stationtracker.util.GroupingBoxingManager.maxDate) {
            // If we are out of range, we display a message and don't close the date picker
            sap.m.MessageToast.show("Selected date out of range");
        } else {
            // Reselect the date in shift hierarchy to select the good date
            var dDataSelected = airbus.mes.stationtracker.oView.oCalendar.getSelectedDates()[0].getStartDate();
            var sYear = dDataSelected.getFullYear();
            var sMounth = dDataSelected.getMonth() + 1;
            var sDay = dDataSelected.getDate();

            if (sMounth < 10) {
                sMounth = "0" + sMounth
            }
            sDay = dDataSelected.getDate();

            if (sDay < 10) {
                sDay = "0" + sDay
            }
            // Search in the shift hierarshy the first date of first shift of the current date
            var sDate = sYear.toString() + sMounth.toString() + sDay.toString();
            if (airbus.mes.stationtracker.util.GroupingBoxingManager.shiftHierarchy[sDate] === undefined) {
                sap.m.MessageToast.show(airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("noShiftExist"));
                return;
            }

            // We feed the scheduler with the new selected date
            airbus.mes.stationtracker.oView.getController().updateDateLabel(airbus.mes.stationtracker.oView.oCalendar);
            airbus.mes.stationtracker.datePicker.close();

            var sDateId = Object.keys(airbus.mes.stationtracker.util.GroupingBoxingManager.shiftHierarchy[sDate])[0];
            var dStartDate = airbus.mes.stationtracker.util.GroupingBoxingManager.shiftHierarchy[sDate][sDateId][0].StartDate;

            airbus.mes.stationtracker.util.ShiftManager.changeShift = false; //Airbus Defect #262 - Shift selection is not kept when changing date
            scheduler.updateView(dStartDate);
            //airbus.mes.stationtracker.util.ShiftManager.selectFirstShift = true; //Airbus Defect #262 - Shift selection is not kept when changing date
            airbus.mes.stationtracker.util.ModelManager.selectMyShift();
            airbus.mes.stationtracker.util.ShiftManager.changeShift = true; //Airbus Defect #262 - Shift selection is not kept when changing date
        }
    },

    updateDateLabel: function (oCalendar) {
        var oFormatddMMyyy = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd MMM yyyy", calendarType: sap.ui.core.CalendarType.Gregorian });
        var oText = airbus.mes.stationtracker.oView.byId("dateButton");
        var aSelectedDates = oCalendar.getSelectedDates();
        var oDate;
        if (aSelectedDates.length > 0) {
            oDate = aSelectedDates[0].getStartDate();
            oText.setText(oFormatddMMyyy.format(oDate));
        } else {
            oText.setText("No Date Selected");
        }
    },
    onCloseDialog: function (oEvent) {
        oEvent.getSource().getParent().close();
    },

    onCloseImportOswUnplannedPopoverDialog: function (oEvent) {
        airbus.mes.stationtracker.CheckQa = "";
        oEvent.getSource().getParent().close();
    },


    /******************************************
     * Operation Detail Pop-Up Close functions
     */
    onCloseOperationDetailPopup: function (oEvent) {

        // Close expanded disruption panel
        if (airbus.mes.disruptions != undefined && airbus.mes.disruptions.oView != undefined) {
            var expandedDisruptionPanelId = airbus.mes.disruptions.oView.viewDisruption.getController().expandedDisruptionPanel;

            if (expandedDisruptionPanelId) {
                sap.ui.getCore().byId(expandedDisruptionPanelId).setExpanded(false);
                airbus.mes.disruptions.oView.viewDisruption.getController().expandedDisruptionPanel = undefined;
            }
        }
        // Close the Popup
        this.onCloseDialog(oEvent);
    },

    afterCloseOperationDetailPopup: function () {
        // perf issue if stationtracker dont rerender correctly its because of this.
        //airbus.mes.shell.oView.getController().renderStationTracker();

        // Refresh Station tracker
        // Resume the Refresh timer when the Pop-Up is opened
        airbus.mes.shell.AutoRefreshManager.resumeRefresh();
    },

    onContinueCheckQA: function (oEvent) {
        // special case for polypoly
        switch (airbus.mes.stationtracker.CheckQa) {
            case "UNPLANNED":
                airbus.mes.stationtracker.CheckQa === "";
                var oModel = airbus.mes.stationtracker.ImportOswUnplannedPopover;
                airbus.mes.stationtracker.util.ModelManager.setOSW(oModel.aSFC_Step, "", true, false);
                this.onCloseDialog(oEvent);
                break;
            case "OSW":
                airbus.mes.stationtracker.CheckQa === "";
                var oModel = airbus.mes.stationtracker.ImportOswUnplannedPopover;
                airbus.mes.stationtracker.util.ModelManager.setOSW(oModel.aSFC_Step, oModel.sProdGroup, true, true);
                this.onCloseDialog(oEvent);
                break;
            case "RESCHEDULING":
                airbus.mes.stationtracker.CheckQa === "";
                var oModel = airbus.mes.stationtracker;
                airbus.mes.stationtracker.util.ModelManager.sendRescheduleRequest(true, oModel.oFinal, oModel.oInitial);
                airbus.mes.shell.oView.getController().renderStationTracker();
                this.onCloseDialog(oEvent);
                break;
            default:
                airbus.mes.stationtracker.util.AssignmentManager.handleLineAssignment("S", true);
                this.onCloseDialog(oEvent);
        }

    },

    openCheckQAPopup: function (oModel) {
        if (!airbus.mes.stationtracker.checkQAPopUp) {
            airbus.mes.stationtracker.checkQAPopUp = sap.ui.xmlfragment("airbus.mes.stationtracker.fragment.checkQAPopUp", airbus.mes.stationtracker.oView.getController());
        }
        airbus.mes.stationtracker.checkQAPopUp.setModel(oModel, "checkQAModel");
        airbus.mes.stationtracker.checkQAPopUp.setModel(airbus.mes.stationtracker.oView.getModel("StationTrackerI18n"), "StationTrackerI18n");

        var aConfirmButtons = ["continueButton", "cancelButton"];
        var aInfoButtons = ["okButton"];
        var aButtons = airbus.mes.stationtracker.checkQAPopUp.getButtons();
        aButtons.forEach(function (el) {
            if (aConfirmButtons.indexOf(el.sId) !== -1) {
                aConfirmButtons[aConfirmButtons.indexOf(el.sId)] = el;
            } else if (aInfoButtons.indexOf(el.sId) !== -1) {
                aInfoButtons[aInfoButtons.indexOf(el.sId)] = el;
            }
        });

        aConfirmButtons.forEach(function (el) {
            if (!el.getVisible() && !airbus.mes.stationtracker.util.AssignmentManager.checkQA) {
                el.setVisible(true);
            } else if (el.getVisible() && airbus.mes.stationtracker.util.AssignmentManager.checkQA) {
                el.setVisible(false);
            }
        });
        aInfoButtons.forEach(function (el) {
            if (!el.getVisible() && airbus.mes.stationtracker.util.AssignmentManager.checkQA) {
                el.setVisible(true);
            } else if (el.getVisible() && !airbus.mes.stationtracker.util.AssignmentManager.checkQA) {
                el.setVisible(false);
            }
        });
        airbus.mes.stationtracker.checkQAPopUp.open();
        airbus.mes.stationtracker.util.AssignmentManager.checkQA = false;
    },

    onCancelCheckQA: function (oEvent) {
        this.onCloseDialog(oEvent);
    },

    deleteLineAssignment: function () {
        airbus.mes.stationtracker.util.AssignmentManager.handleLineAssignment("D", true);
        airbus.mes.stationtracker.oPopoverPolypoly.close();
    },

    onCheckQA: function () {
        airbus.mes.stationtracker.util.AssignmentManager.checkQA = true;
    },

    // Displays the number of items selected in the "Groupe de production
    onSelectionChange: function (oEvt) {

        var oList = oEvt.getSource();
        var oInfoToolbar = sap.ui.getCore().byId("productionGroupPopover--idInfoToolbar");
        var oLabel = oInfoToolbar.getContent()[0];
        var aContexts = oList.getSelectedContexts(true);
        // update UI
        var bSelected = (aContexts && aContexts.length > 0);
        var sText = (bSelected) ? aContexts.length + " selected" : null;

        oInfoToolbar.setVisible(bSelected);
        oLabel.setText(sText);
    },

    /**
     * Fire the filter of the OSW list on the ph station selected
     */
    filterPhStation: function (oEvt) {

        var aValueSelected = oEvt.getSource().getSelectedKeys();
        //reset the filter if nothing is selected its same as selected all
        if (aValueSelected.length === 0) {

            sap.ui.getCore().byId("ImportOswUnplannedPopover--myList").getBinding("items").filter();
            airbus.mes.stationtracker.util.ModelManager.savePhStation(aValueSelected);
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
                    return true;
                } else {
                    return false;
                }
            }
        });

        binding.filter(Filter);

        airbus.mes.stationtracker.util.ModelManager.savePhStation(aValueSelected);
    }

});
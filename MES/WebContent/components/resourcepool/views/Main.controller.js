"use strict";
sap.ui
        .controller(
                "airbus.mes.resourcepool.views.Main",
                {

                    resourcePoolName : undefined,
                    resourcePoolDescription : undefined,
                    resourceId : undefined,

                    /**
                     * Called when a controller is instantiated and its View
                     * controls (if available) are already created. Can be used
                     * to modify the View before it is displayed, to bind event
                     * handlers and do other one-time initialization.
                     *
                     * @memberOf resource_pool.Main
                     */

                    onInit : function() {
                        if (this.getView().getId() == "resourcePool") {

                            // add all three pages userView,ShiftView, and
                            // WorkCenterView in NavContainer
                            this.getView().byId("MainViewNavContainer")
                                    .addPage(
                                            sap.ui.getCore()
                                                    .byId("idUsersView"));
                            this.getView().byId("MainViewNavContainer")
                                    .addPage(
                                            sap.ui.getCore()
                                                    .byId("idShiftView"));

                            this.getView().byId("MainViewNavContainer")
                                    .addPage(
                                            sap.ui.getCore().byId(
                                                    "idWorkCenterView"));

                            this.nav = this.getView().byId(
                                    "MainViewNavContainer");
                            this.nav.to("idUsersView");
                        }

                    },

                    /**
                     * Similar to onAfterRendering, but this hook is invoked
                     * before the controller's View is re-rendered (NOT before
                     * the first rendering! onInit() is used for that one!).
                     *
                     * @memberOf resource_pool.Main
                     */
                    // onBeforeRendering: function() {
                    //
                    // },
                    /**
                     * Called when the View has been rendered (so its HTML is
                     * part of the document). Post-rendering manipulations of
                     * the HTML could be done here. This hook is the same one
                     * that SAPUI5 controls get after being rendered.
                     *
                     * @memberOf resource_pool.Main
                     */
                    /*
                     * onAfterRendering : function() { },
                     */
                    /***********************************************************
                     * Load Views according to segmented button selected
                     **********************************************************/
                    openPage : function(oEvent) {

                        var itemKey = oEvent.getSource().getKey();
                        if (itemKey === "users") {
                            // direct nav container to users view
                            this.nav.to("idUsersView");

                        } else if (itemKey === "workcenters") {

                            // direct nav container to workcenter view
                            this.nav.to("idWorkCenterView");

                        } else if (itemKey === "shifts") {

                            this.nav.to("idShiftView");
                        } else {
                            // do nothing or probably select factory view again
                        }
                    },
                    /***********************************************************
                     * Triggers when any change is done using switch button in
                     * Shifts Table
                     **********************************************************/
                    changeAssignedShift : function(oEvent) {
                        airbus.mes.resourcepool.util.ModelManager.anyChangesFlag = true;
                        /* row of table on which event is triggered */
                        var oItemAssign = oEvent.getSource().getParent();
                        /* all list of shifts in table */
                        var oListOfItems = oEvent.getSource().getParent()
                                .getParent();

                        for (var i = 0; i < oListOfItems.getItems().length; i++) {
                            var sPath = oListOfItems.getItems()[i].getBindingContext("ResourcePoolDetailModel").sPath
                            var rowNum = sPath.split("/")[5];

                            /* if item is one on which the shift is changed */
                            if (oListOfItems.getItems()[i] === oItemAssign) {

                                // Set Shift Assigned Property True
                                sap.ui.getCore().getModel("ResourcePoolDetailModel").oData.Rowsets.Rowset[5].Row[rowNum].shiftAssigned =
                                    oItemAssign.getCells()[5].getState().toString();


                                /* set styleClass selected or not selected */
                                if (oItemAssign.getCells()[5].getState() == true)
                                    oItemAssign
                                            .addStyleClass("sapMLIBSelected");
                                else
                                    oItemAssign
                                            .removeStyleClass("sapMLIBSelected");

                            } else {
                                /* For all other items on which shift is not changed */
                                // Set Shift Assigned Property false
                                sap.ui.getCore().getModel("ResourcePoolDetailModel").oData.Rowsets.Rowset[5].Row[rowNum].shiftAssigned = "false";

                                oListOfItems.getItems()[i]
                                        .removeStyleClass("sapMLIBSelected");
                            }

                        }
                        /* Refresh Model */
                        sap.ui.getCore().getModel("ResourcePoolDetailModel").refresh();
                    },
                    /**
                     * Called when the Controller is destroyed. Use this one to
                     * free resources and finalize activities.
                     *
                     * @memberOf resource_pool.Main
                     */
                    // onExit: function() {
                    //
                    // }
                    /***********************************************************
                     * Triggers when Assign Button is clicked on Users Tab
                     **********************************************************/
                    assignUsers : function(evt) {
                        var aUsersToAssign = this.getView().byId(
                                "listAvailableUsers").getSelectedItems();

                        var aError = [];

                        /* If no selections are made when assigning show error */
                        if (!aUsersToAssign || aUsersToAssign.length == 0) {
                            airbus.mes.resourcepool.util.ModelManager
                                    .showMessage(
                                            "Toast",
                                            "",
                                            airbus.mes.resourcepool.oView
                                                    .getModel("i18nModel")
                                                    .getProperty("NoSelections"),
                                            "");
                            return;
                        }
                        airbus.mes.resourcepool.util.ModelManager.anyChangesFlag = true;
                        /*
                         * if no data was present in AssignedUsersModel then set
                         * an empty Row
                         */
                        if (!sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/1/Row/"))
                            sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/1/").Row = [];

                        var rowIDs = [];
                        /* for each user selected to assign */
                        aUsersToAssign
                                .forEach(function(item) {

                                    var oBinding = item.getBindingContext("ResourcePoolDetailModel");
                                    var oUser = oBinding.getObject();
//                                    rowIDs.push(oUser.handle);

                                    /*
                                     * If any user is already loaned or assigned
                                     * then prepare error messages
                                     */
                                    if (oUser.loanedToPool != "" && oUser.assignedToRPName != airbus.mes.resourcepool.util.ModelManager.resourceName){
                                        //console.log(item.getBindingContext("ResourcePoolDetailModel"))
                                        aError.push(item);
                                    } else if(oUser.loanedToPool == "" && oUser.assignedToRPName != airbus.mes.resourcepool.util.ModelManager.resourceName){
                                        if(oUser.assignedToRPName!="") {
                                            oUser.loanedToPool= sap.ui.getCore().getModel("ResourcePoolDetailModel").oData.Rowsets.Rowset[0].Row[0].id;
                                            oUser.loanedToRPName = airbus.mes.resourcepool.util.ModelManager.resourceName;
                                        }
                                        sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/1/Row/").push(oUser);
                                        rowIDs.push(oUser.handle);
                                    } else {
                                        /*
                                         * Push JSON Object to Assigned Users Model
                                         */
                                        rowIDs.push(oUser.handle);
                                        sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/1/Row/").push(oUser);
                                    }

                                });

                        // Remove Users(s) from Available User model
                        $.each(rowIDs, function(key, handle){
                            var oAvailUsers = sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/3/Row/")
                            $.each(oAvailUsers, function(key2, obj){
                                if(obj.handle == handle){
                                    sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/3/Row/").splice(key2, 1);
                                    return false;
                                }
                            });
                        });

                        sap.ui.getCore().getModel("ResourcePoolDetailModel").refresh();

                        /* remove all selections on screen */
                        this.getView().byId("listAvailableUsers")
                                .removeSelections();
                        this.getView().byId("allAvailableUsers").setSelected(
                                false);
                        this.getView().byId("allAssignedUsers").setSelected(
                                false);


                        /* for loaned and assigned users show error message */
                        if (aError.length != 0)
                            this.showMessageDialog(aError);

                    },
                    /***********************************************************
                     * handle error message for already loaned and assigned
                     * users which cannot be assigned any longer
                     **********************************************************/
                    showMessageDialog : function(aError) {
                        if (airbus.mes.resourcepool.messageDialog === undefined) {

                            airbus.mes.resourcepool.messageDialog = sap.ui
                                    .xmlfragment(
                                            "messageDialog",
                                            "airbus.mes.resourcepool.views.messageDialog",
                                            airbus.mes.resourcepool.oView
                                                    .getController());
                            airbus.mes.resourcepool.oView
                                    .addDependent(airbus.mes.resourcepool.messageDialog);
                        }

                        for (var i = 0; i < aError.length; i++) {
                            airbus.mes.resourcepool.messageDialog.getContent()[0]
                                    .addItem(new sap.m.Text(
                                            {
                                                text : airbus.mes.resourcepool.oView
                                                        .getModel("i18nModel")
                                                        .getProperty("User")
                                                        + " "
                                                        + this
                                                                .titleCase(aError[i]
                                                                        .getCustomData()[5]
                                                                        .getValue()
                                                                        + " "
                                                                        + aError[i]
                                                                                .getCustomData()[6]
                                                                                .getValue())
                                                        + " "
                                                        + airbus.mes.resourcepool.oView
                                                                .getModel(
                                                                        "i18nModel")
                                                                .getProperty(
                                                                        "AssignedToResourcePool")
                                                        + " "
                                                        + aError[i]
                                                                .getCustomData()[3]
                                                                .getValue()
                                                        + " "
                                                        + airbus.mes.resourcepool.oView
                                                                .getModel(
                                                                        "i18nModel")
                                                                .getProperty(
                                                                        "LoanedToResourcePool")
                                                        + aError[i]
                                                                .getCustomData()[4]
                                                                .getValue()

                                            }));
                        }
                        airbus.mes.resourcepool.messageDialog.open();

                    },

                    /***********************************************************
                     * triggers when OK is pressed on Message Dialog which
                     * appeared while assigning users
                     **********************************************************/
                    afterMessageDialogClose : function() {
                        airbus.mes.resourcepool.messageDialog.getContent()[0]
                                .removeAllItems();
                        airbus.mes.resourcepool.messageDialog.close();
                    },

                    /***********************************************************
                     * Triggers when unAssign button is clicked on the Users tab
                     **********************************************************/
                    unassignUsers : function(evt) {
                        var aUsersToUnassign = this.getView().byId(
                                "listAllocatedUsers").getSelectedItems();
                        /*
                         * show error message when no users are selected when
                         * unassigning
                         */
                        if (!aUsersToUnassign || aUsersToUnassign.length == 0) {
                            airbus.mes.resourcepool.util.ModelManager
                                    .showMessage(
                                            "Toast",
                                            "",
                                            airbus.mes.resourcepool.oView
                                                    .getModel("i18nModel")
                                                    .getProperty("NoSelections"),
                                            "")
                            return;
                        }
                        airbus.mes.resourcepool.util.ModelManager.anyChangesFlag = true;

                        /*
                         * if no data is present in AvailableUsersModel then
                         * create a row
                         */
                        if (!sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/3/Row/"))
                            sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/3/").Row = [];

                        var rowIDs = [];
                        /* for each user which is to be unassigned */
                        aUsersToUnassign
                                .forEach(function(item) {

                                    var oBinding = item.getBindingContext("ResourcePoolDetailModel");
                                    var oUser = oBinding.getObject();
                                    rowIDs.push(oUser.handle);

                                    // If Loaned to current resource, empty loanedToPool field
                                    if (oUser.loanedToRPName == airbus.mes.resourcepool.util.ModelManager.resourceName){
                                        oUser.loanedToPool = "";
                                        oUser.loanedToRPName = "";
                                    }
                                    /*
                                     * Push prepared JSON Object to Available Users Model
                                     */
                                    sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/3/Row/").push(oUser);
                                });

                        // Remove User(s) from Assigned User model
                        $.each(rowIDs, function(key, handle){
                            var oAssigUsers = sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/1/Row/")
                            $.each(oAssigUsers, function(key2, obj){
                                if(obj.handle == handle){
                                    sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/1/Row/").splice(key2, 1);
                                    return false;
                                }
                            });
                        });

                        sap.ui.getCore().getModel("ResourcePoolDetailModel").refresh();

                        /* remove all selection */
                        this.getView().byId("listAllocatedUsers")
                                .removeSelections();
                        this.getView().byId("allAvailableUsers").setSelected(
                                false);
                        this.getView().byId("allAssignedUsers").setSelected(
                                false);

                    },

                    /***********************************************************
                     * triggers when assign button is clicked on WC Tab
                     **********************************************************/
                    assignWorkCenter : function(evt) {

                        var aWorkCenterToAssign = this.getView().byId(
                                "listAvailableWorkCenter").getSelectedItems();
                        /* If no selections are made when assigning show error */
                        if (!aWorkCenterToAssign
                                || aWorkCenterToAssign.length == 0) {
                            airbus.mes.resourcepool.util.ModelManager
                                    .showMessage(
                                            "Toast",
                                            "",
                                            airbus.mes.resourcepool.oView
                                                    .getModel("i18nModel")
                                                    .getProperty("NoSelections"),
                                            "")
                            return;
                        }
                        airbus.mes.resourcepool.util.ModelManager.anyChangesFlag = true;
                        /*
                         * if no data was present in AssignedWCModel then set an
                         * empty Row
                         */
                        if (!sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/2/Row/"))
                            sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/2/").Row = [];

                        var rowIDs = [];
                        /* For each WC selected to assign */
                        aWorkCenterToAssign
                                .forEach(function(item) {
                                    var oBinding = item.getBindingContext("ResourcePoolDetailModel");
                                    var oWorkCenter = oBinding.getObject();
                                    rowIDs.push(oWorkCenter.handle);
                                    /*
                                     * Push JSON Object to Assigned WC Model
                                     */
                                    sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/2/Row/").push(oWorkCenter);
                                });

                        // Remove WorkCenters(s) from Available WC model
                        $.each(rowIDs, function(key, handle){
                            var oAvailWC = sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/4/Row/")
                            $.each(oAvailWC, function(key2, obj){
                                if(obj.handle == handle){
                                    sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/4/Row/").splice(key2, 1);
                                    return false;
                                }
                            });
                        });
                        sap.ui.getCore().getModel("ResourcePoolDetailModel").refresh();

                        /* Remove all selections on screen */
                        this.getView().byId("listAvailableWorkCenter")
                                .removeSelections();
                        this.getView().byId("allAvailableWC")
                                .setSelected(false);
                        this.getView().byId("allAssignedWC").setSelected(false);

                    },

                    /***********************************************************
                     * Triggers when assign button is clicked on WC Tab
                     **********************************************************/
                    unassignWorkCenter : function(evt) {

                        var aWorkCenterToUnassign = this.getView().byId(
                                "listAllocatedWorkCenter").getSelectedItems();

                        if (!aWorkCenterToUnassign
                                || aWorkCenterToUnassign.length == 0) {
                            airbus.mes.resourcepool.util.ModelManager
                                    .showMessage(
                                            "Toast",
                                            "",
                                            airbus.mes.resourcepool.oView
                                                    .getModel("i18nModel")
                                                    .getProperty("NoSelections"),
                                            "")
                            return;
                        }
                        airbus.mes.resourcepool.util.ModelManager.anyChangesFlag = true;

                        if (!sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/4/Row/"))
                            sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/4/").Row = [];

                        var rowIDs = [];
                        aWorkCenterToUnassign
                                .forEach(function(item) {
                                    var oBinding = item.getBindingContext("ResourcePoolDetailModel");
                                    var oWorkCenter = oBinding.getObject();
                                    rowIDs.push(oWorkCenter.handle);
                                    /*
                                     * Push JSON Object to Available WC Model
                                     */
                                    sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/4/Row/").push(oWorkCenter);
                                });

                        // Remove WorkCenters(s) from Assigned WC model
                        $.each(rowIDs, function(key, handle){
                            var oAssigWC = sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/2/Row/")
                            $.each(oAssigWC, function(key2, obj){
                                if(obj.handle == handle){
                                    sap.ui.getCore().getModel("ResourcePoolDetailModel").getProperty("/Rowsets/Rowset/2/Row/").splice(key2, 1);
                                    return false;
                                }
                            });
                        });

                        sap.ui.getCore().getModel("ResourcePoolDetailModel").refresh();

                        this.getView().byId("listAllocatedWorkCenter")
                                .removeSelections();
                        this.getView().byId("allAssignedWC").setSelected(false);
                        this.getView().byId("allAvailableWC")
                                .setSelected(false);
                    },

                    /***********************************************************
                     * Select All the items when SelectAll CheckBox Clicked
                     **********************************************************/
                    onSelectAllWC : function(oEvent) {

                        var flag = oEvent.getSource().getSelected();
                        //var oList = oEvent.getSource().getParent().getParent().getContent()[0];

                        switch (oEvent.getSource().getId()) {

                        /* for available WC List */
                        case this.getView().byId("allAvailableWC").sId:
                            if (flag)
                                this.getView().byId("listAvailableWorkCenter")
                                        .selectAll();
                            else
                                this.getView().byId("listAvailableWorkCenter")
                                        .removeSelections();
                            break;

                        /* for Assigned WC List */
                        case this.getView().byId("allAssignedWC").sId:
                            if (flag)
                                this.getView().byId("listAllocatedWorkCenter")
                                        .selectAll();
                            else
                                this.getView().byId("listAllocatedWorkCenter")
                                        .removeSelections();
                            break;
                            default:
                                break;
                        }

                    },

                    onSelectAllUsers : function(oEvent) {

                        var flag = oEvent.getSource().getSelected();
                        //var oList = oEvent.getSource().getParent().getParent().getContent()[0];

                        switch (oEvent.getSource().getId()) {
                        /* for Available Users List */
                        case this.getView().byId("allAvailableUsers").sId:
                            if (flag)
                                this.getView().byId("listAvailableUsers")
                                        .selectAll();
                            else
                                this.getView().byId("listAvailableUsers")
                                        .removeSelections();
                            break;

                        /* for Assigned Users List */
                        case this.getView().byId("allAssignedUsers").sId:
                            if (flag)
                                this.getView().byId("listAllocatedUsers")
                                        .selectAll();
                            else
                                this.getView().byId("listAllocatedUsers")
                                        .removeSelections();
                            break;
                        default:
                            break;
                        }
                    },
                    /***********************************************************
                     * Save Changes to Resource Pool
                     **********************************************************/
                    saveChangesToResourcePool : function(oEvent) {
                        /* show busy indicator as the process might be slow */
                        this.getView().setBusy(true);
                        /*
                         * clear all filters on Lists as it was creating problem
                         * in saving the list
                         */
                        /*this.clearFilters();
                        var aModelUsersData = this.saveAssignedUsers();
                        var aModelWCData = this.saveAssignedWC();
                        var aModelShifts = this.saveAssignedShifts();
                        var aModelData = [];
                        aModelData.push.apply(aModelData, aModelUsersData);
                        aModelData.push.apply(aModelData, aModelWCData);
                        aModelData.push.apply(aModelData, aModelShifts);*/

                        var oModelData = this.getView().getModel("ResourcePoolDetailModel").getData()

                        airbus.mes.resourcepool.util.ModelManager
                                .updateResourcePool(oModelData);
                        airbus.mes.resourcepool.util.ModelManager.anyChangesFlag = false;

                        if(airbus.mes.resourcepool.SaveChanges != undefined){
                            airbus.mes.resourcepool.SaveChanges.close();
                            nav.back();
                        }
                    },

                    /*saveAssignedUsers : function() {

                        var aAssignedItems = this.getView().byId(
                                "listAllocatedUsers").getItems();

                        var aModelData = []
                        for (var i = 0; i < aAssignedItems.length; i++) {

                            var oJson = {
                                "Type" : "U",
                                "Name" : aAssignedItems[i].getCustomData()[7]
                                        .getValue(),
                                "PersonalNo" : aAssignedItems[i]
                                        .getCustomData()[0].getValue(),
                                "ERP_USER_ID" : aAssignedItems[i]
                                        .getCustomData()[1].getValue(),
                                "ShiftStartDateTime" : "",
                                "ShiftEndDateTime" : "",
                                "ShiftValidFrom" : "",
                                "ShiftValidTo" : "",
                                "Description" : "",
                                "LOANED_TO_POOL" : aAssignedItems[i]
                                        .getCustomData()[2].getValue()

                            }
                            aModelData.push(oJson);
                        }

                        return aModelData;
                    },

                    saveAssignedWC : function() {
                        var aAssignedItems = this.getView().byId(
                                "listAllocatedWorkCenter").getItems();

                        var aModelData = [];
                        for (var i = 0; i < aAssignedItems.length; i++) {

                            var oJson = {
                                "Type" : "WC",
                                "Name" : aAssignedItems[i].getTitle(),
                                "PersonalNo" : "",
                                "ERP_USER_ID" : "",
                                "ShiftStartDateTime" : "",
                                "ShiftEndDateTime" : "",
                                "ShiftValidFrom" : "",
                                "ShiftValidTo" : "",
                                "Description" : aAssignedItems[i]
                                        .getDescription(),
                                "LOANED_TO_POOL" : ""
                            }
                            aModelData.push(oJson);
                        }
                        return aModelData;

                    },

                    saveAssignedShifts : function() {
                        var aRows = this.getView().byId("shiftTable")
                                .getItems();

                        var aModelData = [];
                        for (var i = 0; i < aRows.length; i++) {
                            if (aRows[i].getCells()[5].getState() === true) {
                                var oJson = {
                                    "Type" : "S",
                                    "Name" : aRows[i].getCells()[0].getText(),
                                    "PersonalNo" : "",
                                    "ERP_USER_ID" : "",
                                    "ShiftStartDateTime" : airbus.mes.resourcepool.util.Formatter
                                            .shiftHoursToTime(aRows[i]
                                                    .getCells()[1].getText()),
                                    "ShiftEndDateTime" : airbus.mes.resourcepool.util.Formatter
                                            .shiftHoursToTime(aRows[i]
                                                    .getCells()[2].getText()),
                                    "ShiftValidFrom" : airbus.mes.resourcepool.util.Formatter
                                            .shiftDateToString(aRows[i]
                                                    .getCells()[3].getText()),
                                    "ShiftValidTo" : airbus.mes.resourcepool.util.Formatter
                                            .shiftDateToString(aRows[i]
                                                    .getCells()[4].getText()),
                                    "Description" : "",
                                    "LOANED_TO_POOL" : ""
                                }
                                aModelData.push(oJson);
                            }
                        }
                        return aModelData;

                    },*/

                    /**
                     * *************************** Back Button Press
                     * ********************************
                     */
                    /*
                     * onBackPress : function() { if
                     * (airbus.mes.resourcepool.util.ModelManager.anyChangesFlag ==
                     * true) { if (!this.oDialog) { this.oDialog =
                     * sap.ui.xmlfragment(
                     * "airbus.mes.resourcepool.views.SaveChanges", this); }
                     *
                     * this.oDialog.open(); } else { this.clearFilters();
                     * app.removePage(main); app.to(page);
                     * sap.ui.getCore().byId("idSearchView--resourcePool")
                     * .setValue(airbus.mes.resourcepool.util.ModelManager.resourceName);
                     * sap.ui.getCore().byId("idSearchView--description")
                     * .setValue(airbus.mes.resourcepool.util.ModelManager.resourceDescription); //
                     * app.removePage("idMainView"); //
                     * sap.ui.getCore().byId("idMainView").destroy(); } },
                     *
                     * saveChangesUsingDialog : function() {
                     * this.saveChangesToResourcePool(); this.oDialog.close();
                     * this.clearFilters(); app.removePage(main); app.to(page); },
                     *

                    /**
                     * *************Search Functions for Users and Work
                     * Centers***************
                     */
                    afterDialogClose : function() {
//                        airbus.mes.resourcepool.util.ModelManager.anyChangesFlag =
//                            false; this.oDialog.close(); this.clearFilters();
//                        app.removePage(main); app.to(page); //
//                        app.removePage("idMainView"); //
//                        sap.ui.getCore().byId("idMainView").destroy();
                        var close = this.afterDialogCancel();
                        close;
                    },

                    afterDialogCancel : function() {
                        if (airbus.mes.resourcepool.SaveChanges === undefined) {

                            airbus.mes.resourcepool.SaveChanges = sap.ui
                                .xmlfragment(
                                "SaveChanges",
                                "airbus.mes.resourcepool.views.SaveChanges",
                                airbus.mes.resourcepool.oView
                                .getController());
                            airbus.mes.resourcepool.oView
                                .addDependent(airbus.mes.resourcepool.SaveChanges);
                        }
                        airbus.mes.resourcepool.SaveChanges.close();
                    },
                    onSearchUsers : function(oEvt) {

                        // add filter for search
                        var aFilters = [];
                        var sQuery = oEvt.getSource().getValue();
                        var oList = oEvt.getSource().getParent().getParent()
                                .getContent()[0].getItems()[0];
                        var binding = oList.getBinding("items");
                        // console.log('Search '+sQuery);
                        if (sQuery && sQuery.length > 0) {
                            var filter1 = new sap.ui.model.Filter("userId",
                                    sap.ui.model.FilterOperator.Contains,
                                    sQuery);
                            aFilters.push(filter1);

                            var filter2 = new sap.ui.model.Filter(
                                    "personalNo",
                                    sap.ui.model.FilterOperator.Contains,
                                    sQuery);
                            aFilters.push(filter2);

                            var filter3 = new sap.ui.model.Filter(
                                    "erpUserIid",
                                    sap.ui.model.FilterOperator.Contains,
                                    sQuery);
                            aFilters.push(filter3);

                            var filter4 = new sap.ui.model.Filter("name",
                                    sap.ui.model.FilterOperator.Contains,
                                    sQuery);
                            aFilters.push(filter4);

//                            var filter5 = new sap.ui.model.Filter("LNAME",
//                                    sap.ui.model.FilterOperator.Contains,
//                                    sQuery);
//                            aFilters.push(filter5);
                            binding.filter(new sap.ui.model.Filter(aFilters,
                                    false), "Control");
                        } else {
                            // update list binding
                            binding.filter();
                        }
                    },

                    onSearchAvailableWC : function(oEvt) {

                        // add filter for search
                        var aFilters = [];
                        var sQuery = oEvt.getSource().getValue();
                        var oList = this.getView().byId(
                                "listAvailableWorkCenter");
                        var binding = oList.getBinding("items");

                        if (sQuery && sQuery.length > 0) {
                            var filter1 = new sap.ui.model.Filter("name",
                                    sap.ui.model.FilterOperator.Contains,
                                    sQuery);
                            aFilters.push(filter1);

                            var filter2 = new sap.ui.model.Filter(
                                    "description",
                                    sap.ui.model.FilterOperator.Contains,
                                    sQuery);
                            aFilters.push(filter2);

                            binding.filter(new sap.ui.model.Filter(aFilters,
                                    false), "Control");
                        } else {
                            // update list binding
                            binding.filter();
                        }
                    },

                    onSearchAssignedWC : function(oEvt) {

                        // add filter for search
                        var aFilters = [];
                        var sQuery = oEvt.getSource().getValue();
                        var oList = this.getView().byId(
                                "listAllocatedWorkCenter");

                        var binding = oList.getBinding("items");

                        if (sQuery && sQuery.length > 0) {
                            var filter1 = new sap.ui.model.Filter(
                                    "name",
                                    sap.ui.model.FilterOperator.Contains,
                                    sQuery);
                            aFilters.push(filter1);

                            var filter2 = new sap.ui.model.Filter(
                                    "description",
                                    sap.ui.model.FilterOperator.Contains,
                                    sQuery);
                            aFilters.push(filter2);

                            binding.filter(new sap.ui.model.Filter(aFilters,
                                    false), "Control");
                        } else {
                            // update list binding
                            binding.filter();
                        }
                    },

                    showHelp : function(oEvent) {

                        if (airbus.mes.resourcepool.help === undefined) {

                            airbus.mes.resourcepool.help = sap.ui.xmlfragment(
                                    "resourcePoolHelp",
                                    "airbus.mes.resourcepool.views.Help",
                                    airbus.mes.resourcepool.oView
                                            .getController());
                            airbus.mes.resourcepool.oView
                                    .addDependent(airbus.mes.resourcepool.help);
                        }
                        airbus.mes.resourcepool.help.open();

                    },

                    afterHelpOK : function() {
                        airbus.mes.resourcepool.help.close();
                    },

                    /***********************************************************
                     * Open Search Resource Pool Dialogue
                     **********************************************************/
                    openSelectResourcePool : function(oEvent) {
                        if (airbus.mes.resourcepool.searchResourcePool === undefined) {

                            airbus.mes.resourcepool.searchResourcePool = sap.ui
                                    .xmlfragment(
                                            "searchResourcePool",
                                            "airbus.mes.resourcepool.views.Search",
                                            airbus.mes.resourcepool.oView
                                                    .getController());
                            airbus.mes.resourcepool.oView
                                    .addDependent(airbus.mes.resourcepool.searchResourcePool);
                        }

                        sap.ui
                                .getCore()
                                .byId("searchResourcePool--site")
                                .setText(airbus.mes.resourcepool.util.ModelManager.site);
                        sap.ui
                                .getCore()
                                .byId("searchResourcePool--resourcePool")
                                .setValue();
                        sap.ui
                                .getCore()
                                .byId("searchResourcePool--description")
                                .setValue();
                        /* Attach focus out event to resource pool field */
                        var oInputResource = sap.ui.getCore().byId(
                                "searchResourcePool--resourcePool");
                        oInputResource.attachBrowserEvent("focusout",
                                this.onFocusOutOfResourcePool, this);
                        airbus.mes.resourcepool.util.ModelManager.loadModelValueHelp();
                        airbus.mes.resourcepool.searchResourcePool.open();
                    },

                    cancelForm : function(oEvt) {
                        if (airbus.mes.resourcepool.util.ModelManager.resourceName === undefined
                                || airbus.mes.resourcepool.util.ModelManager.resourceName == "" || airbus.mes.resourcepool.util.ModelManager.goBack) {
                            nav.back();
                        }
                    },

                    closeForm : function() {
                        airbus.mes.resourcepool.searchResourcePool.close();
                    },

                    /***********************************************************
                     * Triggers when user focus out from resource pool field
                     *
                     * @returns {Boolean} : false: resource pool does not
                     *          exists, true: resource pool exists
                     **********************************************************/
                    onFocusOutOfResourcePool : function() {
                        var resource = sap.ui.getCore().byId(
                                "searchResourcePool--resourcePool").getValue();

                        var oButton = sap.ui.getCore().byId(
                                "searchResourcePool--createOrDeleteButton");
                        var oSaveButton = sap.ui.getCore().byId(
                        "searchResourcePool--saveButtonforRPDesc");
                        //oSaveButton.setEnabled=true;
                        /*
                         * if resource pool is empty , create button will be
                         * shown and save button as hidden
                         */
                        if (resource === "") {

                            sap.ui.getCore().byId(
                                    "searchResourcePool--description")
                                    .setValue("");
                            oButton.setIcon("sap-icon://create");
                            oButton.setTooltip("create");
                            if(airbus.mes.resourcepool.util.Formatter.isEnabled)
                                oSaveButton.setEnabled(false);
                            return;

                        }
                        /* search resource pool description in existing list */
                        var value = this.searchValueHelp(resource);

                        /*
                         * if description not exists - means resource pool does
                         * not exists: hide save button as well
                         */
                        if (!value) {
                            /* message displayed according to roles */
                            if (airbus.mes.shell.RoleManager
                                    .isAllowed('MII_MOD1684_PRODMNG')
                                    || airbus.mes.shell.RoleManager
                                            .isAllowed('MII_MOD1684_MANUFMNG')
                                    || airbus.mes.shell.RoleManager
                                            .isAllowed('MII_MOD1684_HOOPE')
                                    || airbus.mes.shell.RoleManager
                                            .isAllowed('MII_MOD1684_MFTEAM')) {
                                airbus.mes.resourcepool.util.ModelManager
                                        .showMessage(
                                                "Strip",
                                                "Error",
                                                airbus.mes.resourcepool.oView
                                                        .getModel("i18nModel")
                                                        .getProperty(
                                                                "ResourceNotExists")
                                                        + airbus.mes.resourcepool.oView
                                                                .getModel(
                                                                        "i18nModel")
                                                                .getProperty(
                                                                        "CreateNewOne"),
                                                true);
                            } else {
                                airbus.mes.resourcepool.util.ModelManager
                                        .showMessage(
                                                "Strip",
                                                "Error",
                                                airbus.mes.resourcepool.oView
                                                        .getModel("i18nModel")
                                                        .getProperty(
                                                                "ResourceNotExists"));
                            }
                            /*
                             * resource pool not exists- clear description and
                             * set create icon
                             */
                            sap.ui.getCore().byId(
                                    "searchResourcePool--description").focus();
                            sap.ui.getCore().byId(
                                    "searchResourcePool--description")
                                    .setValue("");
                            oButton.setIcon("sap-icon://create");
                            oButton.setTooltip("create");
                            if(airbus.mes.resourcepool.util.Formatter.isEnabled)
                                oSaveButton.setEnabled(false);
                            return false;
                        } else {
                            /*
                             * resource pool exists- show description and set
                             * delete button and show save button
                             */
                            sap.ui.getCore().byId(
                                    "searchResourcePool--description")
                                    .setValue(value);
                            oButton.setIcon("sap-icon://delete");
                            oButton.setTooltip("delete");
                            if(airbus.mes.resourcepool.util.Formatter.isEnabled)
                                oSaveButton.setEnabled(true);
                            return true;
                        }
                    },

                    /***********************************************************
                     * Show Value help on resource pool field
                     **********************************************************/
                    showValueHelp : function(oEvent) {
                        if (airbus.mes.resourcepool.valueHelp === undefined) {

                            airbus.mes.resourcepool.valueHelp = sap.ui
                                    .xmlfragment(
                                            "valueHelp",
                                            "airbus.mes.resourcepool.views.valueHelp",
                                            airbus.mes.resourcepool.oView
                                                    .getController());
                            airbus.mes.resourcepool.oView
                                    .addDependent(airbus.mes.resourcepool.valueHelp);
                        }
                        airbus.mes.resourcepool.valueHelp.open();
                    },

                    /***********************************************************
                     *
                     * Close Value Help on clicking close button
                     **********************************************************/
                    handleCloseValueHelp : function(oEvt) {
                        /*
                         * if
                         * (airbus.mes.resourcepool.util.ModelManager.resourceName
                         * === undefined ||
                         * airbus.mes.resourcepool.util.ModelManager.resourceName ==
                         * "") { this.openSelectResourcePool();
                         * airbus.mes.resourcepool.util.ModelManager
                         * .showMessage( "Toast", "",
                         * airbus.mes.resourcepool.oView .getModel("i18nModel")
                         * .getProperty("RPMandatory"), "", 5000); }
                         *
                         * else
                         */
                        oEvt.getSource().getBinding("items").filter([]);
                    },

                    /***********************************************************
                     * triggers when search is clicked on search field in value
                     * help
                     *
                     * @param oEvt :
                     *            search on the search field of value help
                     **********************************************************/
                    onSearch : function(oEvt) {

                        // add filter for search
                        var aFilters = [];
                        var sQuery = oEvt.getParameter("value");
                        if (sQuery && sQuery.length >= 0) {
                            var filter = new sap.ui.model.Filter("NAME",
                                    sap.ui.model.FilterOperator.Contains,
                                    sQuery);
                            aFilters.push(filter);
                        }

                        // update list binding
                        var oDialog = sap.ui.getCore().byId("valueHelp--selectDialog-list");
                        var binding = oDialog.getBinding("items");
                        binding.filter(aFilters, "Application");
                    },

                    /***********************************************************
                     * handle selected value in the value help
                     *
                     **********************************************************/
                    handleSelectedValue : function(oEvt) {
                        /*
                         * fill resource pool field and description field with
                         * selected item
                         */
                        var oSelectedItem = oEvt.getParameter("selectedItem");
                        var oResourcePool = sap.ui.getCore().byId(
                                "searchResourcePool--resourcePool");
                        var oDescription = sap.ui.getCore().byId(
                                "searchResourcePool--description");
                        var oButton = sap.ui.getCore().byId(
                                "searchResourcePool--createOrDeleteButton");
                        sap.ui.getCore().byId("searchResourcePool--rpId").setText(oSelectedItem.getTooltip());
                        oResourcePool.setValue(oSelectedItem.getTitle());
                        oDescription.setValue(oSelectedItem.getDescription());

                        this.resourcePoolName = oResourcePool.getValue();
                        this.resourcePoolDescription = oDescription.getValue();
                        this.resourceId = oSelectedItem.getTooltip();
                        /* set create or delete buton based on some conditions */
                        if (!oResourcePool) {
                            oButton.setIcon("sap-icon://create");
                            oButton.setTooltip("create");
                        } else {
                            oButton.setIcon("sap-icon://delete");
                            oButton.setTooltip("delete");
                        }
                        /* clear search filter for each case */
                        oEvt.getSource().getBinding("items").filter([]);

                    },

                    /***********************************************************
                     * triggers when create or delete button is clicked
                     *
                     * @param oEvent :
                     *            button event
                     **********************************************************/
                    createOrDeleteResource : function(oEvent) {

                        /* get the value on the screen in variables */
                        var resourcePool = sap.ui.getCore().byId(
                                "searchResourcePool--resourcePool").getValue();
                        var description = sap.ui.getCore().byId(
                                "searchResourcePool--description").getValue();
                        var oButton = sap.ui.getCore().byId(
                                "searchResourcePool--createOrDeleteButton");

                        /* check mandatory parameters are filled */
                        if (this.checkMandatoryParam(resourcePool, description))
                            return;
                        /*
                         * Special Characters are not allowed in resource pool
                         * name
                         */
                        if (/^[a-zA-Z0-9-_ ]*$/.test(resourcePool) == false) {
                            airbus.mes.resourcepool.util.ModelManager
                                    .showMessage(
                                            "Strip",
                                            "Error",
                                            airbus.mes.resourcepool.oView
                                                    .getModel("i18nModel")
                                                    .getProperty(
                                                            "NoSpecialCharacter"),
                                            true);
                            return;
                        }

                        /* if create button is clicked */
                        if (oEvent.getSource().getIcon() === "sap-icon://create") {

                            /* call createResource() */
                            var anyError = airbus.mes.resourcepool.util.ModelManager
                                    .createResource(sap.ui.getCore().byId(
                                            "searchResourcePool--resourcePool")
                                            .getValue(), sap.ui.getCore().byId(
                                            "searchResourcePool--description")
                                            .getValue());

                            /* if no error is returned, set button to delete */
                            if (anyError == 0) {
                                oButton.setIcon("sap-icon://delete");
                                oButton.setTooltip("delete");
                            }
                            /* if delete button is clicked */
                        } else if (oEvent.getSource().getIcon() === "sap-icon://delete") {

                            /* open DeleteConfirmation dialog before deleting */
                            this.oDeleteDialogue();

                        }
                    },

                    /***********************************************************
                     * triggers when Save button is clicked on the screen
                     *
                     * @returns {Number} 0: if not error in updating else 1.
                     **********************************************************/
                    updateResource : function() {

                        var resourcePool = sap.ui.getCore().byId(
                                "searchResourcePool--resourcePool").getValue();
                        var description = sap.ui.getCore().byId(
                                "searchResourcePool--description").getValue();

//                        check if resourcepool exists

                        /*
                         * check mandatory paramaters are filled before
                         * proceeding to update
                         */
                        if (this.checkMandatoryParam(resourcePool, description))
                            return;

                        /*
                         * call updateResource() method from
                         * airbus.mes.resourcepool.util.ModelManager.
                         */
                        var anyError = airbus.mes.resourcepool.util.ModelManager
                                .updateResource(resourcePool, description);
                        airbus.mes.resourcepool.util.ModelManager
                                .loadModelValueHelp();
                        /* if no error is returned return 0 */
                        if (anyError == 0) {

                            /* Set the title header of the main page */
                            if (resourcePool == airbus.mes.resourcepool.util.ModelManager.resourceName) {
                                airbus.mes.resourcepool.util.ModelManager.resourceDescription = description;
                                this
                                        .getView()
                                        .byId("resourcePoolName")
                                        .setText(
                                                airbus.mes.resourcepool.util.ModelManager.site
                                                        + " / "
                                                        + airbus.mes.resourcepool.util.ModelManager.resourceName
                                                        + " / "
                                                        + airbus.mes.resourcepool.util.ModelManager.resourceDescription);
                            }

                            return 0;
                        } else if (anyError == 1) var error = airbus.mes.resourcepool.util.ModelManager.createResource(resourcePool, description);
                        // if 1 is returned, means resource pool does not exists, create new one by calling createResource()
                        /* if creation is successful return 0 */
                        if (error == 0)
                            return 0;
                        /* if creation is not successful return 1 */
                        else
                            return 1;

                    },

                    /***********************************************************
                     * function triggers when form is submitted
                     **********************************************************/
                    submitForm : function(oEvt) {

                        airbus.mes.resourcepool.util.ModelManager
                                .loadModelValueHelp();

                        var resourcePool = sap.ui.getCore().byId(
                                "searchResourcePool--resourcePool").getValue();
                        var description = sap.ui.getCore().byId(
                                "searchResourcePool--description").getValue();
                        /* Check Mandatory parameters are filled */
                        if (this.checkMandatoryParam(resourcePool, description))
                            return;

                        /* decide action on submitting form */
                        var action = this.checkResourcePool(resourcePool,
                                description);

                        switch (action) {

                        /* 0: everything is perfect to move to next screen */
                        case 0:
                            this.resourcePoolName = sap.ui.getCore().byId(
                                    "searchResourcePool--resourcePool")
                                    .getValue();
                            this.resourcePoolDescription = sap.ui.getCore()
                                    .byId("searchResourcePool--description")
                                    .getValue();
                            this.loadMainPage();
                            break;

                        /* 1: the entered resource pool does not exists */
                        case 1:
                            airbus.mes.resourcepool.util.ModelManager
                                    .showMessage(
                                            "Strip",
                                            "Error",
                                            airbus.mes.resourcepool.oView
                                                    .getModel("i18nModel")
                                                    .getProperty(
                                                            "ResourceNotExists"),
                                            true);
                            break;

                        /*
                         * 2: description is changed on the screen for the
                         * resource pool
                         */
                        case 2:

                            if (airbus.mes.resourcepool.oUpdateDialog === undefined) {

                                airbus.mes.resourcepool.oUpdateDialog = sap.ui
                                        .xmlfragment(
                                                "updateDialogue",
                                                "airbus.mes.resourcepool.views.updateDescription",
                                                airbus.mes.resourcepool.oView
                                                        .getController());
                                airbus.mes.resourcepool.oView
                                        .addDependent(airbus.mes.resourcepool.oUpdateDialog);
                            }

                            // Open
                            airbus.mes.resourcepool.oUpdateDialog.open();
                            break;

                        default:
                            break;

                        }
                    },

                    /***********************************************************
                     * update description using dialog box
                     **********************************************************/
                    updateDescriptionUsingDialog : function() {

                        airbus.mes.resourcepool.oUpdateDialog.close();
                        /*
                         * call updateResource() from
                         * airbus.mes.resourcepool.util.ModelManager
                         */
                        var anyError = this.updateResource();
                        /* if no error is returned then load main page */
                        if (anyError == 0) {
                            this.resourcePoolName = sap.ui.getCore().byId(
                                    "searchResourcePool--resourcePool")
                                    .getValue();
                            this.resourcePoolDescription = sap.ui.getCore()
                                    .byId("searchResourcePool--description")
                                    .getValue();
                            this.loadMainPage();
                        }

                    },

                    /***********************************************************
                     * Triggers on "No" of Update Dialog
                     **********************************************************/
                    afterUpdateDialogClose : function() {
                        /*
                         * load main page if user dont want to save the
                         * description
                         */
                        airbus.mes.resourcepool.oUpdateDialog.close();
                        this.loadMainPage();
                    },

                    /***********************************************************
                     * Triggers when user clicks "Cancel" on update dialog
                     **********************************************************/
                    afterUpdateDialogCancel : function() {
                        airbus.mes.resourcepool.oUpdateDialog.close();
                    },

                    /***********************************************************
                     * Load the Main page of RPM to maintain the resource pool
                     **********************************************************/
                    loadMainPage : function() {
                        /* Set Model Manager Global Variables */
                        airbus.mes.resourcepool.util.ModelManager.resourceName = this.resourcePoolName;
                        airbus.mes.resourcepool.util.ModelManager.resourceDescription = this.resourcePoolDescription;
                        airbus.mes.resourcepool.util.ModelManager.resourceId = this.resourceId;
                         airbus.mes.resourcepool.util.ModelManager.goBack = false;
                        /* Set the title header of the main page */
                        this
                                .getView()
                                .byId("resourcePoolName")
                                .setText(
                                        airbus.mes.resourcepool.util.ModelManager.site
                                                + " / "
                                                + airbus.mes.resourcepool.util.ModelManager.resourceName
                                                + " / "
                                                + airbus.mes.resourcepool.util.ModelManager.resourceDescription);

                        /* take the current view in a variable */
                        airbus.mes.resourcepool.util.ModelManager.currentView = this
                                .getView();

                        /* load all models and move to main page */
                        airbus.mes.resourcepool.util.ModelManager
                                .loadMainViewModels();

                        // Close Search Resource Pool Pop-Up
                        if (airbus.mes.resourcepool.searchResourcePool)
                            airbus.mes.resourcepool.searchResourcePool.close();

                        sap.ui.getCore().byId("idUsersView--availableUsersPanel").rerender();
                        sap.ui.getCore().byId("idUsersView--assignedUsersPanel").rerender();
                        sap.ui.getCore().byId("idWorkCenterView--assignedWCPanel").rerender();
                         sap.ui.getCore().byId("idWorkCenterView--availableWCPanel").rerender();
                         sap.ui.getCore().byId("idShiftView--userShiftPanel").rerender();

                    },

                    titleCase : function(str) {
                        var splitStr = str.toLowerCase().split(' ');
                        for (var i = 0; i < splitStr.length; i++) {
                            // You do not need to check if i is larger than
                            // splitStr length, as your for does that for you
                            // Assign it back to the array
                            splitStr[i] = splitStr[i].charAt(0).toUpperCase()
                                    + splitStr[i].substring(1);
                        }
                        // Directly return the joined string
                        return splitStr.join(' ');
                    },

                    /*clearFilters : function() {
                        this.getView().byId("searchAvailableUsers").clear();
                        this.getView().byId("searchAssignedUsers").clear();
                        this.getView().byId("searchAvailableWC").clear();
                        this.getView().byId("searchAssignedWC").clear();
                    },*/

                    /*
                     * editTeamOpen : function() { if
                     * (airbus.mes.resourcepool.editTeam === undefined) {
                     *
                     * airbus.mes.resourcepool.editTeam = sap.ui .xmlfragment(
                     * "editTeam", "airbus.mes.resourcepool.views.editTeam",
                     * airbus.mes.resourcepool.oView .getController());
                     * airbus.mes.resourcepool.oView
                     * .addDependent(airbus.mes.resourcepool.editTeam); }
                     *  // Open airbus.mes.resourcepool.editTeam.open();
                     *  // Set Site, Resource Pool name and Description
                     * sap.ui.getCore().byId("editTeam--site").setText(
                     * airbus.mes.resourcepool.util.ModelManager.site); sap.ui
                     * .getCore() .byId("editTeam--resourcePoolName") .setText(
                     * airbus.mes.resourcepool.util.ModelManager.resourceName);
                     * sap.ui .getCore() .byId("editTeam--description")
                     * .setValue(
                     * airbus.mes.resourcepool.util.ModelManager.resourceDescription); },
                     *
                     * editTeamClose : function() {
                     * airbus.mes.resourcepool.editTeam.close(); },
                     */

                    /***********************************************************
                     * Triggers when Save button is clicked on the Pop-Up
                     *
                     * @returns {Number} 0: if not error in updating else 1.
                     **********************************************************/

                    saveResourcePool : function() {

                        var resourcePool = sap.ui.getCore().byId(
                                "editTeam--resourcePoolName").getText();
                        var description = sap.ui.getCore().byId(
                                "editTeam--description").getValue();

                        /*
                         * check mandatory paramater's are filled before
                         * proceeding to update
                         */
                        if (this.checkMandatoryParam(resourcePool, description))
                            return;
                        airbus.mes.resourcepool.util.ModelManager.resourceName = resourcePool;
                        airbus.mes.resourcepool.util.ModelManager.resourceDescription = description;
//                        airbus.mes.resourcepool.util.ModelManager.resourceId = resourcePool;
                        /*
                         * call updateResource() method from
                         * airbus.mes.resourcepool.util.ModelManager.
                         */
                        //var anyError = airbus.mes.resourcepool.util.ModelManager.updateResource();

                    },

                    oDeleteDialogue : function() {
                        if (airbus.mes.resourcepool.deleteTeam === undefined) {

                            airbus.mes.resourcepool.deleteTeam = sap.ui
                                    .xmlfragment(
                                            "deleteTeam",
                                            "airbus.mes.resourcepool.views.DeleteConfirmation",
                                            airbus.mes.resourcepool.oView
                                                    .getController());
                            airbus.mes.resourcepool.oView
                                    .addDependent(airbus.mes.resourcepool.deleteTeam);
                        }

                        // Open
                        airbus.mes.resourcepool.deleteTeam.open();
                    },

                    /***********************************************************
                     * Triggers when "Yes" is pressed on delete dialog
                     **********************************************************/

                    deleteResourcePool : function() {
                        /* call deleteResource() from ModelManager */

                        var anyError = airbus.mes.resourcepool.util.ModelManager.deleteResource(sap.ui.getCore().byId("searchResourcePool--resourcePool").getValue());

                        airbus.mes.resourcepool.deleteTeam.close();

                        if (anyError == 0) {
                            var oButton = sap.ui.getCore().byId("searchResourcePool--createOrDeleteButton");
                            oButton.setIcon("sap-icon://create");
                            oButton.setTooltip("create");

                            if (airbus.mes.resourcepool.util.ModelManager.resourceName == sap.ui
                                    .getCore().byId("searchResourcePool--resourcePool").getValue()) {
                                airbus.mes.resourcepool.util.ModelManager.resourceName = undefined;
                                airbus.mes.resourcepool.util.ModelManager.resourceDescription = undefined;
                                airbus.mes.resourcepool.util.ModelManager.Id = undefined;
                                this.getView().byId("resourcePoolName").setText("");


                            }

                            // reset fields
                            sap.ui.getCore().byId("searchResourcePool--resourcePool").setValue("");
                            sap.ui.getCore().byId("searchResourcePool--description").setValue("");
                        }
                    },

                    /***********************************************************
                     * Triggers on "No" of Update Dialog
                     **********************************************************/

                    deleteDialogueClose : function() {
                        airbus.mes.resourcepool.deleteTeam.close();

                    },

                    /***********************************************************
                     * Check mandatory parameters before taking any actions
                     **********************************************************/

                    checkMandatoryParam : function(resourcePool, description) {
                        /* if resource pool is empty display error and return */
                        if (!resourcePool) {

                            airbus.mes.resourcepool.util.ModelManager
                                    .showMessage("Strip", "Error",
                                            airbus.mes.resourcepool.oView
                                                    .getModel("i18nModel")
                                                    .getProperty(
                                                            "EmptyResource"),
                                            true);

                            return true;
                        }

                        /* if description is empty display error and return */
                        if (!description) {

                            airbus.mes.resourcepool.util.ModelManager
                                    .showMessage(
                                            "Strip",
                                            "Error",
                                            airbus.mes.resourcepool.oView
                                                    .getModel("i18nModel")
                                                    .getProperty(
                                                            "EmptyDescription"),
                                            true);

                            return true;
                        }
                    },

                    /***********************************************************
                     * Converts the resource pool name to upper case
                     **********************************************************/

                    upperCaseConversion : function(oEvt) {
                        oEvt.getSource().setValue(
                                oEvt.getSource().getValue().toUpperCase().replace(" ", ""));
                    },

                    /***********************************************************
                     * Check resource pool exists
                     *
                     * @param ResourcePool
                     * @param Description
                     * @returns {Number} 0: if exists 1: if does not exists 2:
                     *          if description is changed
                     **********************************************************/

                    checkResourcePool : function(ResourcePool, Description) {

                        var actualDescription = this
                                .searchValueHelp(ResourcePool);

                        if (!actualDescription) {
                            return 1;
                        }
                        if (actualDescription != Description) {
                            return 2;
                        }

                        return 0;
                    },

                    /***********************************************************
                     * function used to search resource pool in existing
                     * resource pools
                     **********************************************************/
                    searchValueHelp : function(oValue) {

                        var oModelData = sap.ui.getCore().getModel(
                                "ValueHelpModel").getProperty(
                                "/Rowsets/Rowset/0/Row");
                        if (oModelData) {
                            for (var i = 0; i < oModelData.length; i++) {
                                if (oModelData[i].NAME === oValue) {
                                    return oModelData[i].DESCRIPTION;
                                }
                            }
                        }

                    },

                    afterNavigate : function(oEvt) {

                        if(oEvt.getParameters().toId == "idUsersView"){
                            sap.ui.getCore().byId("idUsersView--availableUsersPanel").rerender();
                            sap.ui.getCore().byId("idUsersView--assignedUsersPanel").rerender();
                         } else if (oEvt.getParameters().toId == "idWorkCenterView"){
                             sap.ui.getCore().byId("idWorkCenterView--assignedWCPanel").rerender();
                             sap.ui.getCore().byId("idWorkCenterView--availableWCPanel").rerender();
                         } else {
                             sap.ui.getCore().byId("idShiftView--userShiftPanel").rerender();
                         }

                    },
                    // get model data after render
                    modelDataRessourcePool : function(){
                        var oModelData = this.getView().getModel("ResourcePoolDetailModel").getData()
                    },

                    onNavBack : function(oEvent) {
                        if(airbus.mes.resourcepool.util.ModelManager.anyChangesFlag){
                            if (airbus.mes.resourcepool.SaveChanges === undefined) {

                                airbus.mes.resourcepool.SaveChanges = sap.ui
                                    .xmlfragment(
                                    "SaveChanges",
                                    "airbus.mes.resourcepool.views.SaveChanges",
                                    airbus.mes.resourcepool.oView
                                    .getController());
                                airbus.mes.resourcepool.oView
                                    .addDependent(airbus.mes.resourcepool.SaveChanges);
                            }
                            airbus.mes.resourcepool.SaveChanges.open();
                        }else{
                            nav.back();
                        }
                    }
                });

"use strict";

sap.ui.controller("airbus.mes.components.controller.components", {

    oFilterSearch: undefined,
    oFilterFilter: undefined,

    onAfterRendering: function () {
        this.oFilterSearch = undefined;
        this.oFilterFilter = undefined;
        var oTable = sap.ui.getCore().byId("componentsView--ComponentsList");
        oTable.setSelectionMode("None");
        oTable.setVisibleRowCount(oTable.getBinding("rows").oList.length);
        this.changeButtonColor();
    },

    changeButtonColor: function () {
        var oTable = sap.ui.getCore().byId("componentsView--ComponentsList");
        var count = oTable.getBinding("rows").oList.length;
        for (var i = 0; i < count; i++) {
            oTable.getRows()[i];
            var dataIndex = oTable.getModel("componentsWorkOrderDetail").oData.Rowsets.Rowset[0].Row[i];
            if (dataIndex.withdrawQty === dataIndex.requiredQty) {
                oTable.getRows()[i].getCells()[11].getItems()[0].setType("Accept");
                oTable.getRows()[i].getCells()[12].getItems()[0].setType("Accept");
            } else {
                oTable.getRows()[i].getCells()[11].getItems()[0].setType("Default");
                oTable.getRows()[i].getCells()[12].getItems()[0].setType("Default");
            }
        }
    },

    checkSettingComponents: function () {

        // confirm if we have already check the ME settings
        if (airbus.mes.shell.util.navFunctions.components.configME === undefined) {

            //will be the configuration received in AppConfManager
            //var sSet = airbus.mes.settings.AppConfManager.getConfiguration("VIEW_ATTACHED_TOOL");
            var sSet = "P";

            //Add value to global variable
            airbus.mes.shell.util.navFunctions.components.configME = sSet;
        } else {
            // set the global variable
            var sSet = airbus.mes.shell.util.navFunctions.components.configME;
        }

        switch (sSet) {
            case "O"://operation
                this.getView().byId("operationButton").setSelected(true);
                break;
            case "P"://work order
                this.getView().byId("workOrderButton").setSelected(true);
                break;
            default: //if Null
                break;
        }
        this.filterComponents(sSet);
    },

    //get user action on the checkbox field
    onSelectLevel: function (oEvent) {

        var sId = oEvent.mParameters.selectedIndex;
        switch (sId) {
            case 0://operation button
                this.filterComponents(airbus.mes.components.util.ModelManager.operation);
                break;
            case 1://work order button
                this.filterComponents(airbus.mes.components.util.ModelManager.workOrder);
                break;
            default:
                break;
        }
    },

    //table filter
    filterComponents: function (sScope) {
        switch (sScope) {
            case airbus.mes.components.util.ModelManager.operation:
                sap.ui.getCore().byId("componentsView--ComponentsList").getBinding("rows").filter(new sap.ui.model.Filter("operationNumber", "EQ", sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_no));
                break;
            case airbus.mes.components.util.ModelManager.workOrder:
                sap.ui.getCore().byId("componentsView--ComponentsList").getBinding("rows").filter();
                break;
            default:
                break;
        }
    },

    onFilterComponent: function (oEvent) {

        // add filter for search
        var sQuery = oEvent.getSource().getValue();
        if (sQuery && sQuery.length > 0) {
            var aFilters = [];

            aFilters.push(this.addFilter("itemNumber", sQuery));
            aFilters.push(this.addFilter("operationNumber", sQuery));
            aFilters.push(this.addFilter("materialDescription", sQuery));
            aFilters.push(this.addFilter("materialType", sQuery));
            aFilters.push(this.addFilter("storageLocation", sQuery));
            aFilters.push(this.addFilter("freestockKanbanBulkMaterial", sQuery));
            aFilters.push(this.addFilter("requiredQty", sQuery));
            aFilters.push(this.addFilter("withdrawQty", sQuery));
            aFilters.push(this.addFilter("shortage", sQuery));
            aFilters.push(this.addFilter("unit", sQuery));
            aFilters.push(this.addFilter("serialNumber", sQuery));
            aFilters.push(this.addFilter("committed", sQuery));
            aFilters.push(this.addFilter("fitted", sQuery));

            //OR Filter
            var oCurrentFilter = new sap.ui.model.Filter(aFilters, false);

            this.oFilterSearch = oCurrentFilter;
        } else {
            //No filter or filter remove
            this.oFilterSearch = undefined;
        }

        //Apply all filter
        this.applyFilters();
    },

    addFilter: function (sName, sQuery) {
        return new sap.ui.model.Filter(sName, sap.ui.model.FilterOperator.Contains, sQuery);
    },

    onSelectFilter: function (oEvent) {
        if (airbus.mes.components.selectFilter === undefined) {
            var oView = airbus.mes.components.oView;
            airbus.mes.components.selectFilter = sap.ui.xmlfragment("selectFilter", "airbus.mes.components.fragment.selectFilterPopover", airbus.mes.components.oView.getController());
            airbus.mes.components.selectFilter.addStyleClass("alignTextLeft");
            oView.addDependent(airbus.mes.components.selectFilter);

            airbus.mes.components.selectFilter.setModel(sap.ui.getCore().getModel("selectFilterModel"), "selectFilterModel");
        }

        // delay because addDependent will do a async rerendering and the popover will immediately close without it
        var oButton = oEvent.getSource();
        jQuery.sap.delayedCall(0, this, function () {
            airbus.mes.components.selectFilter.openBy(oButton);
        });
    },

    onSelectFilterFinish: function () {
        var that = this;
        var aFilters = [];
        var aSelectedItems = [];

        //Retrieve selected items
        aSelectedItems = sap.ui.getCore().byId("selectFilter--selectFilterComponents").getSelectedItems();

        if (aSelectedItems.length !== 0) {
            aSelectedItems.forEach(function (element) {
                //Use translation between we have access only to translation and not to key
                switch (element.getTitle()) {
                    case airbus.mes.components.util.Formatter.translateFilter("BulkMaterial"):
                        aFilters.push(that.addFilter("freestockKanbanBulkMaterial", "B"));
                        break;
                    case airbus.mes.components.util.Formatter.translateFilter("Kanban"):
                        aFilters.push(that.addFilter("freestockKanbanBulkMaterial", "K"));
                        break;
                    case airbus.mes.components.util.Formatter.translateFilter("Available"):
                        aFilters.push(new sap.ui.model.Filter("shortage", sap.ui.model.FilterOperator.EQ, "0"));
                        break;
                    case airbus.mes.components.util.Formatter.translateFilter("MissingPart"):
                        aFilters.push(new sap.ui.model.Filter("shortage", sap.ui.model.FilterOperator.NE, "0"));
                        break;
                    default:
                        break;
                }
            }

            )
            //OR Filter
            var oCurrentFilter = new sap.ui.model.Filter(aFilters, false);

            this.oFilterFilter = oCurrentFilter;
        } else {
            //No filter or filter remove
            this.oFilterFilter = undefined;
        }

        //Apply all filter
        this.applyFilters();
    },

    applyFilters: function () {
        var oFilter;

        // update list binding
        var list = this.getView().byId("ComponentsList");
        var binding = list.getBinding("rows");

        //AND Filter
        if (this.oFilterSearch === undefined && this.oFilterFilter === undefined) {
            //No filter
            binding.filter();
        } else if (this.oFilterFilter === undefined) {
            //If filter from Filter popover is empty, apply only filter from LiveSearch
            oFilter = new sap.ui.model.Filter([this.oFilterSearch], true);
            binding.filter(oFilter);
        } else if (this.oFilterSearch === undefined) {
            //If filter from Filter popover is empty, apply only filter from LiveSearch
            oFilter = new sap.ui.model.Filter([this.oFilterFilter], true);
            binding.filter(oFilter);
        } else {
            oFilter = new sap.ui.model.Filter([this.oFilterSearch, this.oFilterFilter], true);
            binding.filter(oFilter);
        }
    },

    synchronizeFieldCommitted: function (oEvent) {
        var oTable = sap.ui.getCore().byId("componentsView--ComponentsList");
        var index = oEvent.getSource().oParent.oParent.getCells()[0].oParent.getIndex();
        var dataIndex = oTable.getModel("componentsWorkOrderDetail").oData.Rowsets.Rowset[0].Row[index];
        oEvent.getSource().oParent.getItems()[1].setValue(dataIndex.withdrawQty);
        sap.ui.getCore().byId("componentsView--btnComponentsSave").setEnabled(true);
        sap.ui.getCore().byId("componentsView--btnComponentsFreeze").setEnabled(true);
    },

    synchronizeFieldFitted: function (oEvent) {
        var oTable = sap.ui.getCore().byId("componentsView--ComponentsList");
        var index = oEvent.getSource().oParent.oParent.getCells()[0].oParent.getIndex();
        var dataIndex = oTable.getModel("componentsWorkOrderDetail").oData.Rowsets.Rowset[0].Row[index];
        oEvent.getSource().oParent.getItems()[1].setValue(dataIndex.withdrawQty);
        sap.ui.getCore().byId("componentsView--btnComponentsSave").setEnabled(true);
        sap.ui.getCore().byId("componentsView--btnComponentsFreeze").setEnabled(true);
    },

    committedLiveChange: function (oEvent) {
        var inputVal = oEvent.getSource().getValue();
        var dataJson = sap.ui.getCore().getModel("componentsWorkOrderDetail").getData().Rowsets.Rowset[0].Row;
        var index = oEvent.getSource().oParent.oParent.getIndex();
        var compareWith = dataJson[index].requiredQty;
        var intIndex = parseInt(inputVal, 10);
        var intcompareWith = parseInt(compareWith, 10);
        if (intIndex >= 0 && intIndex <= intcompareWith) {
            oEvent.getSource().setValue(inputVal);
        } else {
            oEvent.getSource().setValue(0);
        }
        sap.ui.getCore().byId("componentsView--btnComponentsSave").setEnabled(true);
        sap.ui.getCore().byId("componentsView--btnComponentsFreeze").setEnabled(true);
    },

    fittedLiveChange: function (oEvent) {
        var inputVal = oEvent.getSource().getValue();
        var dataJson = sap.ui.getCore().getModel("componentsWorkOrderDetail").getData().Rowsets.Rowset[0].Row;
        var index = oEvent.getSource().oParent.oParent.getIndex();
        var compareWith = dataJson[index].requiredQty;
        var intIndex = parseInt(inputVal, 10);
        var intcompareWith = parseInt(compareWith, 10);
        if (intIndex >= 0 && intIndex <= intcompareWith) {
            oEvent.getSource().setValue(inputVal);
        } else {
            oEvent.getSource().setValue(0);
        }
        sap.ui.getCore().byId("componentsView--btnComponentsSave").setEnabled(true);
        sap.ui.getCore().byId("componentsView--btnComponentsFreeze").setEnabled(true);
    },

    onbtnComponentsSave: function (oEvent) {
        var oTable = sap.ui.getCore().byId("componentsView--ComponentsList");
        var count = oTable.getBinding("rows").oList.length;
        if (airbus.mes.components.util.ModelManager.dataSaveJson != []) {
            airbus.mes.components.util.ModelManager.dataSaveJson = [];
        }
        for (var i = 0; i < count; i++) {
            var tableVal = oTable.getRows()[i].getCells()[11].getItems()[1].getValue();
            var tableValFitt = oTable.getRows()[i].getCells()[12].getItems()[1].getValue();
            var dataIndex = oTable.getModel("componentsWorkOrderDetail").oData.Rowsets.Rowset[0].Row[i];
            if (dataIndex.committed != tableVal) {
                dataIndex.committed = tableVal;
            }
            if (dataIndex.fitted != tableValFitt) {
                dataIndex.fitted = tableValFitt;
            }
            airbus.mes.components.util.ModelManager.dataSaveJson.push(dataIndex);
            airbus.mes.components.util.Formatter.convertJsontoXml(airbus.mes.components.util.ModelManager.dataSaveJson);
        }

    },

    onbtnComponentsFreeze: function (oEvent) {
        var buttonText = oEvent.getSource().getText();
        var freeze = airbus.mes.components.oView.getModel("i18nComponentsModel").getProperty("freeze");
        var unfreeze = airbus.mes.components.oView.getModel("i18nComponentsModel").getProperty("unfreeze");
        if (buttonText === freeze) {
            oEvent.getSource().setText(unfreeze);
        } else {
            oEvent.getSource().setText(freeze);
        }
    }
});

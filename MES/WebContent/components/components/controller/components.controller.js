"use strict";

sap.ui.controller("airbus.mes.components.controller.components", {

    oFilterSearch: undefined,
    oFilterFilter: undefined,
    oFilterRB: undefined,
    sSet: undefined,
    committedFittedView: false,

    //is called after view is rendered.
    onAfterRendering: function () {
        this.oFilterSearch = undefined;
        this.oFilterFilter = undefined;

        //reset the columns on compnents
        if (this.committedFittedView) {
            this.committedFittedView = false;

            this.changeColVisibility(this.committedFittedView);
        }

        //clear filters list if filter already exists
        if (sap.ui.getCore().byId("selectFilter--selectFilterComponents")) {
            sap.ui.getCore().byId("selectFilter--selectFilterComponents").removeSelections(true);
        }

        // Get setting from ME/MII and select the good button between operation and work order
        this.filterComponents(this.sSet);

        // Init value of SearchField
        sap.ui.getCore().byId("componentsView--idSearchComponent").setValue("");
    },

    //checks operation or work order mode
    checkSettingComponents: function () {
        // confirm if we have already check the ME settings
        if (this.sSet === undefined) {
            //Application manager configuration is setting to physical station level, we concatenate the ID VIEW_ATTACHED_TOOL with the physical station
            var sSet = airbus.mes.settings.AppConfManager.getConfiguration("VIEW_ATTACHED_BOM_" + airbus.mes.settings.ModelManager.station);

            if (sSet === null) {
                this.sSet = 'O';
            } else {
                this.sSet = sSet;
            }
        }

        switch (this.sSet) {
            case "O"://operation
                this.getView().byId("operationButton").setSelected(true);
                break;
            case "P"://work order
                this.getView().byId("workOrderButton").setSelected(true);
                break;
            default: //if Null
                break;
        }
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

    //filters on sSet
    filterComponents: function (sScope) {
        this.sSet = sScope;
        switch (sScope) {
            case airbus.mes.components.util.ModelManager.operation:
                this.oFilterRB = new sap.ui.model.Filter("operationNumber", "EQ", sap.ui.getCore().getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].operation_id);
                break;
            case airbus.mes.components.util.ModelManager.workOrder:
                this.oFilterRB = undefined;
                break;
            default:
                break;
        }
        //Apply all filter
        this.applyFilters();
    },

    //filters on search in the searchbar
    onFilterComponent: function (oEvent) {
        // add filter for search
        var sQuery = oEvent.getSource().getValue();
        if (sQuery && sQuery.length > 0) {
            var aFilters = [];

            aFilters.push(this.addFilter("sequence", sQuery));
            aFilters.push(this.addFilter("itemNumber", sQuery));
            aFilters.push(this.addFilter("operationNumber", sQuery));
            aFilters.push(this.addFilter("materialType", sQuery));
            aFilters.push(this.addFilter("materialDescription", sQuery));
            aFilters.push(this.addFilter("storageLocation", sQuery));
            aFilters.push(this.addFilter("FKBm", sQuery));
            aFilters.push(this.addFilter("reqQty", sQuery));
            aFilters.push(this.addFilter("withdrawQty", sQuery));
            aFilters.push(this.addFilter("shortage", sQuery));
            aFilters.push(this.addFilter("unit", sQuery));
            aFilters.push(this.addFilter("serialNumber", sQuery));
            aFilters.push(this.addFilter("Checked_Components", sQuery));
            aFilters.push(this.addFilter("Fitted_Components", sQuery));
            aFilters.push(this.addFilter("BOMComponentBO", sQuery));
            aFilters.push(this.addFilter("ERPSequence", sQuery));

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

    //adds a filter in the filter list.
    addFilter: function (sName, sQuery) {
        return new sap.ui.model.Filter(sName, sap.ui.model.FilterOperator.Contains, sQuery);
    },

    //apply the filter on the model data
    onSelectFilter: function (oEvent) {
        if (airbus.mes.components.selectFilter === undefined) {
            this.createSelectFilterPopoverFragment();
        }

        // delay because addDependent will do a async rerendering and the popover will immediately close without it
        var oButton = oEvent.getSource();
        jQuery.sap.delayedCall(0, this, function () {
            airbus.mes.components.selectFilter.openBy(oButton);
        });
        
    },

    createSelectFilterPopoverFragment: function () {
        var oView = airbus.mes.components.oView;
        airbus.mes.components.selectFilter = sap.ui.xmlfragment("selectFilter", "airbus.mes.components.fragment.selectFilterPopover", airbus.mes.components.oView.getController());
        airbus.mes.components.selectFilter.addStyleClass("alignTextLeft");
        oView.addDependent(airbus.mes.components.selectFilter);

        airbus.mes.components.selectFilter.setModel(sap.ui.getCore().getModel("selectFilterModel"), "selectFilterModel");
    },

    //prepare to apply the filters after a small delay (due to async rendering)
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
                        aFilters.push(that.addFilter("FKBm", "B"));
                        break;
                    case airbus.mes.components.util.Formatter.translateFilter("Kanban"):
                        aFilters.push(that.addFilter("FKBm", "K"));
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
            })
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

    //apply the filter (for real after the several functions)
    applyFilters: function () {
        var oFilter;
        var aFilter = [];

        // update list binding
        var list = this.getView().byId("ComponentsList");
        var binding = list.getBinding("rows");

        //AND Filter
        if (this.oFilterSearch !== undefined) {
            aFilter.push(this.oFilterSearch);
        }

        if (this.oFilterFilter !== undefined) {
            aFilter.push(this.oFilterFilter);
        }

        if (this.oFilterRB !== undefined) {
            aFilter.push(this.oFilterRB);
        }

        if (aFilter.length > 0) {
            oFilter = new sap.ui.model.Filter(aFilter, true);
            binding.filter(oFilter);
        } else {
            //No filter
            binding.filter();
        }

    },

    synchronizeField: function (oEvent) {
        var value = oEvent.getSource().getParent().getParent().mAggregations.cells[5].mProperties.text
        oEvent.getSource().oParent.getItems()[1].setValue(value);
    },

    //is called when the save button is clicked. It handles the datan converts it in xml and send them to backend.
    onbtnComponentsSave: function () {

        var count = sap.ui.getCore().getModel("componentsWorkOrderDetail").getData().Rowsets.Rowset[0].Row.length;
        if (airbus.mes.components.util.ModelManager.dataSaveJson != []) {
            airbus.mes.components.util.ModelManager.dataSaveJson = [];
        }
        for (var i = 0; i < count; i++) {
            var tableVal = sap.ui.getCore().getModel("componentsWorkOrderDetail").getData().Rowsets.Rowset[0].Row[i].Checked_Components;
            var tableValFitt = sap.ui.getCore().getModel("componentsWorkOrderDetail").getData().Rowsets.Rowset[0].Row[i].Fitted_Components;
            var dataIndex = sap.ui.getCore().getModel("componentsWorkOrderDetail").getData().Rowsets.Rowset[0].Row[i];

            if (airbus.mes.components.util.ModelManager.aInitialModel.Rowsets.Rowset[0].Row[i].Checked_Components != tableVal
            || airbus.mes.components.util.ModelManager.aInitialModel.Rowsets.Rowset[0].Row[i].Fitted_Components   != tableValFitt ) {
                dataIndex.committed = tableVal;
                dataIndex.fitted = tableValFitt;
                airbus.mes.components.util.ModelManager.dataSaveJson.push(dataIndex);
            }
        }
        airbus.mes.components.util.Formatter.convertJsontoXmlJCO(airbus.mes.components.util.ModelManager.dataSaveJson);
        airbus.mes.components.util.Formatter.convertJsontoXmlPapi(airbus.mes.components.util.ModelManager.dataSaveJson);


        //      Param.1=$site&Param.2=$ERPSystem&Param.3=$xmlPAPI&Param.4=$xmlJCO
        var url = airbus.mes.components.util.ModelManager.urlModel.getProperty("componentsSaveFittedComponent");
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$site", airbus.mes.components.oView.getController().getOwnerComponent().getSite());
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$ERPSystem", airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].erp_system);
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$xmlPAPI", airbus.mes.components.util.ModelManager.jsonConvertedToXmlPapi);
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$xmlJCO", airbus.mes.components.util.ModelManager.jsonConvertedToXmlJCO);

        //      call service
        jQuery.ajax({
            type: 'get',
            async: false,
            url: url,
            contentType: 'application/json',

            success: function (data) {
                console.log("sucess");
            },

            error: function (error, jQXHR) {
                console.log(error);
            }
        });

        
//      Save current data model in initialmodel
        airbus.mes.components.util.ModelManager.aInitialModel = sap.ui.getCore().getModel("componentsWorkOrderDetail").getData();

    },

    //freeze not available now
    //is called when the save button is clicked
    onbtnComponentsFreeze: function (oEvent) {
        var buttonText = oEvent.getSource().getText();
        var freeze = airbus.mes.components.oView.getModel("i18nComponentsModel").getProperty("freeze");
        var unfreeze = airbus.mes.components.oView.getModel("i18nComponentsModel").getProperty("unfreeze");
        if (buttonText === freeze) {
            oEvent.getSource().setText(unfreeze);
        } else {
            oEvent.getSource().setText(freeze);
        }
    },

    //change the view between components and fitted/committed
    onbtnCommittedFitted: function (oEvent) {
        var committedFitted = airbus.mes.components.oView.getModel("i18nComponentsModel").getProperty("CommittedFitted");
        var components = airbus.mes.components.oView.getModel("i18nComponentsModel").getProperty("Components");

        this.committedFittedView = !this.committedFittedView;

        //change button text
        if (this.committedFittedView) {
            oEvent.getSource().setText(committedFitted);
            sap.ui.getCore().byId("operationDetailPopup--btnSave").setVisible(true);
            sap.ui.getCore().byId("operationDetailPopup--btnFreeze").setVisible(true);
        } else {
            oEvent.getSource().setText(components);
            sap.ui.getCore().byId("operationDetailPopup--btnSave").setVisible(false);
            sap.ui.getCore().byId("operationDetailPopup--btnFreeze").setVisible(false);
        }

        this.changeColVisibility(this.committedFittedView);
    },

    //changes the visibility of the several columns
    changeColVisibility: function (committedFittedView) {
        var colVisibilityArray;
        var columns = sap.ui.getCore().byId("componentsView--ComponentsList").getColumns();

        if (!committedFittedView) {
            colVisibilityArray = airbus.mes.components.util.ModelManager.colVisibilityComponents;
        } else {
            colVisibilityArray = airbus.mes.components.util.ModelManager.colVisibilityCommittedFitted;
        }

        for (var i = 0; i < columns.length; i++) {
            if (colVisibilityArray.indexOf(columns[i].sId) !== -1) {
                columns[i].setVisible(true);
            } else {
                columns[i].setVisible(false);
            }
        }
    }
});

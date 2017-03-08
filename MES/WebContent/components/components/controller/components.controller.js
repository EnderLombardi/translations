"use strict";

sap.ui.controller("airbus.mes.components.controller.components", {

    oFilterSearch: undefined,
    oFilterFilter: undefined,
    oFilterRB: undefined,
    sSet: undefined,
    committedFittedView: false,
    freeze : false,

    //is called after view is rendered.
    onAfterRendering: function () {
        this.oFilterSearch = undefined;
        this.oFilterFilter = undefined;

        //clear filters list if filter already exists
        if (sap.ui.getCore().byId("selectFilter--selectFilterComponents")) {
            sap.ui.getCore().byId("selectFilter--selectFilterComponents").removeSelections(true);
        }

        // Get setting from ME/MII and select the good button between operation and work order
        this.filterComponents(this.sSet);

        // Init value of SearchField
        sap.ui.getCore().byId("componentsView--idSearchComponent").setValue("");
        
//      Load freeze state
        this.computeFreeze();
        this.manageFreezeButton(this.freeze);
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
        
//      Manage freeze button
        this.manageFreezeButton();
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
            try {//try to filter
                binding.filter(oFilter);
            } catch (e) {//if no data fits, we catch the error and apply an impossible filter (so no rows in the table)
                var impossibleFilter = [new sap.ui.model.Filter("shortage", sap.ui.model.FilterOperator.LT, "0")];
                binding.filter(impossibleFilter);
            }
        } else {
            //No filter
            binding.filter();
        }

    },

    synchronizeField: function (oEvent) {
        var value = oEvent.getSource().getParent().getParent().mAggregations.cells[5].mProperties.text
        oEvent.getSource().oParent.getItems()[1].setValue(value);

        //enable or not the decrementButton
        var col = oEvent.mParameters.id.match(/(?:col)(\d+)/)[1];//column id
        var row = oEvent.mParameters.id.match(/(?:row)(\d+)/)[1];//row id
        var hBoxId = oEvent.oSource.oParent.sId.split('--')[1].split('-')[0];//Committed ou Fitted
        var decrementButton = sap.ui.getCore().byId("componentsView--stepInput" + hBoxId + "-col" + col + "-row" + row + "-decrementButton");
        if (value !== "0") {
            decrementButton.setEnabled(true);
        } else {
            decrementButton.setEnabled(false);
        }
    },

    //is called when the save button is clicked. It handles the data converts it in xml and send them to backend.
    onbtnComponentsSave: function () {

        var oModel = sap.ui.getCore().getModel("componentsWorkOrderDetail");
        var count = oModel.getData().Rowsets.Rowset[0].Row.length;
        if (airbus.mes.components.util.ModelManager.dataSaveJson != []) {
            airbus.mes.components.util.ModelManager.dataSaveJson = [];
        }
        for (var i = 0; i < count; i++) {
            var tableVal = oModel.getData().Rowsets.Rowset[0].Row[i].Checked_Components;
            var tableValFitt = oModel.getData().Rowsets.Rowset[0].Row[i].Fitted_Components;
            var dataIndex = oModel.getData().Rowsets.Rowset[0].Row[i];

            if (oModel.getData().Rowsets.Rowset[0].Row[i].Checked_Components_old != tableVal
                || oModel.getData().Rowsets.Rowset[0].Row[i].Fitted_Components_old != tableValFitt) {
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
        //Save current data model in old data
        airbus.mes.components.util.ModelManager.saveOldValue(oModel);

    },

    manageFreezeButton: function(bFreeze) {
//		Retrieve button freeze
    	var oButton = sap.ui.getCore().byId("operationDetailPopup--btnFreezeComponent");
    	
//    	Manage text
    	var sText;

//    	If component is freeze
    	if(this.freeze === true) {
    		sText = airbus.mes.components.oView.getModel("i18nComponentsModel").getProperty("unfreeze");
    	} else {
//    		If component is unfreeze
    		sText = airbus.mes.components.oView.getModel("i18nComponentsModel").getProperty("freeze");
    	}
    	
    	oButton.setText(sText);
    	
//    	Manage enable
    	var bEnabled;
    	
//    	SD-PPC-WT-1760
//    	This button shall be greyed out if the check box ‘show for operation’ is clicked in the ‘components’ tab
    	if (this.sSet === airbus.mes.components.util.ModelManager.operation ){
    		bEnabled = false;
    	} else {
    		bEnabled = true;
    	}
    	
    	oButton.setEnabled(bEnabled);
    	
    },
    
    computeFreeze: function(){
    	this.freeze = sap.ui.getCore().getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].frozen_fitted_parts;
    },
    
    manageFreezeAction: function() {

//    	Refresh Profile Model to relaunch formatter on View
    	sap.ui.getCore().getModel("Profile").refresh(true);
    	sap.ui.getCore().getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].frozen_fitted_parts = this.freeze;
    	sap.ui.getCore().getModel("operationDetailModel").refresh();
    
    },
    
//  SD-PPC-WT-1760
//  The status freezed components should be saved on operation operation  level for all operations of this WO
    //is called when the save button is clicked
    onbtnComponentsFreeze: function (oEvent) {
        
        var url = airbus.mes.components.util.ModelManager.urlModel.getProperty("componentsSaveFreeze");
//		We inverse the freeze status
        this.freeze = !this.freeze

        url = airbus.mes.shell.ModelManager.replaceURI(url, "$site", airbus.mes.components.oView.getController().getOwnerComponent().getSite());
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$workorder", airbus.mes.components.oView.getController().getOwnerComponent().getWorkOrder());
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$freeze", this.freeze);
        
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
        
//      We update the freeze button display
//      The ‘freeze components’ button will become an ‘unfreeze components’ button
        this.manageFreezeButton(this.freeze);
        
//      We update display of column
        this.manageFreezeAction();

    },

    //change the view between components and fitted/committed
    onbtnCommittedFitted: function (oEvent) {
        //Inverse the value
        this.committedFittedView = !this.committedFittedView;

        //Retrieve button
        var oButton = oEvent.getSource();
        this.setBtnCommittedFittedValue(oButton, this.committedFittedView);
    },

    setBtnCommittedFittedValue: function (oButton, bValue) {
        var committedFitted = airbus.mes.components.oView.getModel("i18nComponentsModel").getProperty("CommittedFitted");
        var components = airbus.mes.components.oView.getModel("i18nComponentsModel").getProperty("Components");

        //change button text
        if (bValue) {
            oButton.setText(committedFitted);
            sap.ui.getCore().byId("operationDetailPopup--btnSave").setVisible(true);
            sap.ui.getCore().byId("operationDetailPopup--btnFreezeComponent").setVisible(true);
        } else {
            oButton.setText(components);
            sap.ui.getCore().byId("operationDetailPopup--btnSave").setVisible(false);
            sap.ui.getCore().byId("operationDetailPopup--btnFreezeComponent").setVisible(false);
        }

        this.changeColVisibility(bValue);
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
    },

    //called on commtted and fitted component hbox changes
    //enable or not the several decrement button
    onModelContextChange: function (oEvent) {
        var value;
        var numberOfRows = sap.ui.getCore().byId("componentsView--ComponentsList").getRows().length;
        var col = oEvent.mParameters.id.match(/(?:col)(\d+)/)[1];//column id
        var hBoxId = oEvent.mParameters.id.split('--')[1].split('-')[0];//Committed ou Fitted

        //committed component
        for (var i = 0; i < numberOfRows; i++) {
            value = sap.ui.getCore().byId("componentsView--stepInput" + hBoxId + "-col" + col + "-row" + i + "-input")._lastValue;
            if (value !== "0") {
                sap.ui.getCore().byId("componentsView--stepInput" + hBoxId + "-col" + col + "-row" + i + "-decrementButton").setEnabled(true);
            } else {
                sap.ui.getCore().byId("componentsView--stepInput" + hBoxId + "-col" + col + "-row" + i + "-decrementButton").setEnabled(false);
            }
        }
    },
});

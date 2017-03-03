"use strict";

sap.ui.controller("airbus.mes.missingParts.controller.missingParts", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf components.missingParts.view.missingParts
*/
	init: function() {
       
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf components.missingParts.view.missingParts
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf components.missingParts.view.missingParts
*/
	onAfterRendering: function() {
  
	},

    /**
	 * Called to close dialog
	 * 
	 */
	onCloseMPPopup: function() {
        airbus.mes.missingParts.oView.getContent()[0].close();
    },

	/**
	 * Called to manage filters of the toolbar
	 * 
	 * @param {any} oEvent 
	 */
	onSearch: function(oEvent) {
		var oFilters = [];
		var oSorter = null;
		var mpTable_Binding = this.getView().byId("missingPartsView--MPTable").getBinding("rows");
		var comboFilter = airbus.mes.missingParts.oView.byId("missingPartsView--mpFilter");
		var comboSorter = airbus.mes.missingParts.oView.byId("missingPartsView--mpSorter");
		var searchField = airbus.mes.missingParts.oView.byId("missingPartsView--searchField");
	    	var query = (searchField.mProperties.value != "")? searchField.mProperties.value: undefined;
		var filterSelected = comboFilter.getSelectedItem();
		var sorterSelected= comboSorter.getSelectedItemId();
		
		if ( filterSelected )
		{
			var filterCriteria = filterSelected.getBindingInfo("text").binding.oValue;
			if( query 
			&& (filterCriteria != undefined)
			&& (filterCriteria != airbus.mes.missingParts.util.Formatter.getTranslation("FilterPlaceholder"))){

				oFilters.push(new sap.ui.model.Filter(filterCriteria,  sap.ui.model.FilterOperator.EQ, query));
			}
		
			if( sorterSelected 
			&& (filterCriteria != undefined)
			&& (filterCriteria != airbus.mes.missingParts.util.Formatter.getTranslation("FilterPlaceholder"))){
						oSorter = new sap.ui.model.Sorter({path: filterCriteria,
											descending: (sorterSelected == "Descending") ? true : false });
			}
		}
		mpTable_Binding.filter(oFilters);
		mpTable_Binding.sort(oSorter);
	}


/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf components.missingParts.view.missingParts
*/
//	onExit: function() {
//
//	}

});
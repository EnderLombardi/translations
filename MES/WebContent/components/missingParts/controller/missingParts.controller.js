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

    onCloseMPPopup: function() {
        airbus.mes.missingParts.oView.getContent()[0].close();
    },

	onSearch: function(oEvent) {
		var query = oEvent.getParameter("query");
		var mpTable_Binding = this.getView().byId("missingPartsView--MPTable").getBinding("rows");
		if( !query || query.length == 0 ){
			mpTable_Binding.filter( [] );
		}
		else
		{
			mpTable_Binding.filter([new sap.ui.model.Filter([
				new sap.ui.model.Filter("WorkOrder",  sap.ui.model.FilterOperator.EQ, query),
				new sap.ui.model.Filter("Operation",  sap.ui.model.FilterOperator.EQ, query),
				new sap.ui.model.Filter("PartNumber",  sap.ui.model.FilterOperator.EQ, query),
				new sap.ui.model.Filter("PartDescript",  sap.ui.model.FilterOperator.Contains, query)
			],false)]);
		}
	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf components.missingParts.view.missingParts
*/
//	onExit: function() {
//
//	}

});
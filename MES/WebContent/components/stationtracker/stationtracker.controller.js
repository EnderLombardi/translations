sap.ui.controller("airbus.mes.stationtracker.stationtracker", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf components.stationtracker.stationtracker
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf components.stationtracker.stationtracker
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf components.stationtracker.stationtracker
*/
	onAfterRendering: function() {

		airbus.mes.stationtracker.ModelManager.fnLoadStationTracker();
		
	},
	
	onTeamPress :function(oEvent){
		
		 var bindingContext = oEvent.getSource().getBindingContext();			 
		 // open team popover fragment		 
		if (! this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("airbus.mes.stationtracker.teamPopover", this);
			this._oPopover.addStyleClass("alignTextLeft");
			this.getView().addDependent(this._oPopover);
		}
		this._oPopover.openBy(oEvent.getSource());							

	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf components.stationtracker.stationtracker
*/
//	onExit: function() {
//
//	}

});
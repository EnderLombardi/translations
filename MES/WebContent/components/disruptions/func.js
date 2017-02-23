"use strict";

jQuery.sap.declare("airbus.mes.disruptions.func");

airbus.mes.disruptions.func = {
	
	currentBusyObject: undefined,

	/**********************************************************************
	 * Check and return if Detailed view is opened by support team from
	 * disruption tracker using Laptop/Desktop
	 **********************************************************************/
	isSupportTeamViaDestop : function() {
		// Disruption Tracker via Desktop 
		if ((sap.ui.Device.system.desktop && nav.getPreviousPage().sId == "disruptiontrackerView")			
			// Or Big Disruption detail screen meant only for support team
			|| nav.getCurrentPage().getId() == "disruptionDetailView" ) {
			
			return true;
		} else {
			return false;
		}

	},

	/***************************************************************************
	 * Get View object
	 **************************************************************************/
	getView: function(){
		if (airbus.mes.disruptions.func.isSupportTeamViaDestop()) {
			return airbus.mes.disruptiondetail.oView;
		} else {
			return airbus.mes.disruptions.oView.createDisruption;
		}
	},
	
	
	/***************************************************************************
	 * Show try again error message
	 **************************************************************************/
	tryAgainError: function(){
		var oView = airbus.mes.disruptions.func.getView();
		var i18nModel = oView.getModel("i18nModel");

		var sMessageError = i18nModel.getProperty("tryAgain");

		airbus.mes.shell.ModelManager.messageShow(sMessageError);
	},
	
	

/*	*//***************************************************************************
	 * Set busy for disruptions pop-up
	 **************************************************************************//*
	setBusy : function(aSetBusy) {
		$.each(aSetBusy, function(key, value){
			value.setBusyIndicatorDelay(0);
			value.setBusy(true);
		});
		this.currentBusyObject = aSetBusy;
	},

	*//***************************************************************************
	 * Un-Set busy for disruptions pop-up
	 **************************************************************************//*
	unSetBusy : function() {
		$.each(this.currentBusyObject, function(key, value){
			value.setBusy(false);
		});
	},
*/
}
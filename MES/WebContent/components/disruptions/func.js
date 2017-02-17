"use strict";

jQuery.sap.declare("airbus.mes.disruptions.func");

airbus.mes.disruptions.func = {

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
	
	

	/***************************************************************************
	 * Set busy for disruptions pop-up
	 **************************************************************************/
	setBusy : function() {
		switch (nav.getCurrentPage().getId()) {

		case "stationTrackerView":
			sap.ui.getCore().byId("operationDetailPopup--operationDetailPopUp").setBusyIndicatorDelay(0);
			sap.ui.getCore().byId("operationDetailPopup--operationDetailPopUp").setBusy(true);
			break;
		case "disruptiontrackerView":
			if(!sap.ui.Device.system.desktop){
				sap.ui.getCore().byId("disruptionDetailPopup--disruptionDetailPopUp").setBusyIndicatorDelay(0);
				sap.ui.getCore().byId("disruptionDetailPopup--disruptionDetailPopUp").setBusy(true);
			} else{
				sap.ui.getCore().byId("disruptionDetailView").setBusyIndicatorDelay(0);
				sap.ui.getCore().byId("disruptionDetailView").setBusy(true);
			}
			break;
		case "disruptionDetailView":
			sap.ui.getCore().byId("disruptionDetailView").setBusyIndicatorDelay(0);
			sap.ui.getCore().byId("disruptionDetailView").setBusy(true);
		default:
			break;
		}
	},

	/***************************************************************************
	 * Un-Set busy for disruptions pop-up
	 **************************************************************************/
	unSetBusy : function() {
		switch (nav.getCurrentPage().getId()) {

		case "stationTrackerView":
			sap.ui.getCore().byId("operationDetailPopup--operationDetailPopUp").setBusy(false);
			break;
		case "disruptiontrackerView":
			if(!sap.ui.Device.system.desktop){
				sap.ui.getCore().byId("disruptionDetailPopup--disruptionDetailPopUp").setBusy(false);
			} else{
				sap.ui.getCore().byId("disruptionDetailView").setBusy(false);
			}
			break;
		case "disruptionDetailView":
			sap.ui.getCore().byId("disruptionDetailView").setBusy(false);
		default:
			break;
		}
	},

}
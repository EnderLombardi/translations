"use strict";
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.declare("airbus.mes.stationHandover.util.Formatter");

airbus.mes.stationHandover.util.Formatter = {

	isBlocked : function(oEvt) {

	},

	translate : function(oEvt) {

		return airbus.mes.stationHandover.oView.getModel("stationHandoverI18n").getProperty(oEvt);

	},

	isInsert : function(oEvt) {

		var aValueSelected = airbus.mes.stationHandover.util.ModelManager.aSelected;

		if (oEvt != null) {

			var sPath = this.oPropagatedProperties.oBindingContexts.oswModel.sPath;
			var oModel = airbus.mes.stationHandover.oView.getModel("oswModel").getProperty(sPath);

			if (oModel.MATERIAL_DESCRIPTION != undefined) {

				return aValueSelected[oModel.WOID].open;

			} else {

				return aValueSelected[oModel.WOID][oModel.WOID + "##||##" + oModel.REFERENCE].open;

			}

		}
	},

	isInsertEnabled : function(oEvt) {

		if (oEvt === "true") {

			return false;

		}

		if (oEvt === "false") {

			return true;

		}

	},

	colorTracking : function(oEvt) {

		switch (oEvt) {
		case "true":
			this.addStyleClass("green");
			return oEvt;
			break;
		case "false":
			this.addStyleClass("orange");
			return oEvt;
			break;
		default:
			return;
		}
	}

};

"use strict";
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.declare("airbus.mes.stationHandover.util.Formatter");

airbus.mes.stationHandover.util.Formatter = {

	translate : function(oEvt) {

		return airbus.mes.stationHandover.oView.getModel("stationHandoverI18n").getProperty(oEvt);

	},

	isInsert : function(oEvt) {

		if (oEvt != null) {

			return String(oEvt.SELECED_UI) == "true";

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
};

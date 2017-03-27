"use strict";
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.declare("airbus.mes.stationHandover.util.Formatter");

airbus.mes.stationHandover.util.Formatter = {

	translate: function (oEvt) {
		return airbus.mes.stationHandover.oView.getModel("stationHandoverI18n").getProperty(oEvt);
	},

	isInsert: function (oEvt) {
		if (oEvt != null) {
			return String(oEvt.selected) == "true";
		}
	},

	isInsertEnabled: function (oEvt) {
		if (oEvt === "true") {
			return false;
		}
		if (oEvt === "false") {
			return true;
		}
	},

	displayColor: function (oEvt) {
		if (oEvt) {
			return oEvt;
		} else {
			return "";
		}
	},

	dateToStringFormat: function (sDate) {
		// Date send by MII are UTC date
		var oDate = new Date(sDate);
		var oFormat = sap.ui.core.format.DateFormat.getInstance({
			UTC: true,
			pattern: "dd MMM - HH:mm",
			calendarType: sap.ui.core.CalendarType.Gregorian
		});
		return oFormat.format(oDate)
	},
};

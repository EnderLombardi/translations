"use strict";

jQuery.sap.declare("airbus.mes.settings.util.Formatter");

airbus.mes.settings.util.Formatter = {

	enabledProgram: function (sValue) {
		var oModel = sap.ui.getCore().getModel("plantModel");
		if (oModel.getProperty("/Rowsets/Rowset/0/Row")) {
			oModel = sap.ui.getCore().getModel("plantModel").oData.Rowsets.Rowset[0].Row;
		} else {
			oModel = []
		}

		if (oModel.map(function (x) { return x.program; }).indexOf(sValue) != -1) {
			return true;
		} else {
			return false;
		}
	},

	enabledSite: function (sValue) {
		var oModel = sap.ui.getCore().getModel("siteModel");
		if (oModel.getProperty("/Rowsets/Rowset/0/Row")) {
			oModel = sap.ui.getCore().getModel("siteModel").oData.Rowsets.Rowset[0].Row;
		} else {
			oModel = []
		}
		if (oModel.map(function (x) { return x.site_desc; }).indexOf(sValue) != -1) {
			return true;
		} else {
			return false;
		}
	},
	
	enabledCurrentMSN : function(sValue) {
		if (sValue === "X") {
			return true;
		} else {
			return false;
		}
		
	}

};

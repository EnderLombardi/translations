"use strict";

jQuery.sap.declare("airbus.mes.qdc.util.Formatter");

airbus.mes.qdc.util.Formatter = {

	getExclamationIcon : function(oEvt) {
		if (oEvt === "true") {
			return "sap-icon://warning";
		}
	},

	getEnabled : function() {
		var oVal = sap.ui.getCore().getModel("GetQDCDataModel");

		var obj = oVal.oData.Rowsets.Rowset[1].Row;
		if (oVal.oData.Rowsets.Rowset[0].Row[0].QDCSTATUS === "X") {

			obj.filter(function(row) {
				if (row.DOC_TYPE === "MEA") {
					airbus.mes.qdc.oView.byId("idButtonMEA").setEnabled();
				}

			});

			obj.filter(function(row) {
				if (row.DOC_TYPE === "PLA") {
					airbus.mes.qdc.oView.byId("idButtonMAA").setEnabled();
				}

			});

			obj.filter(function(row) {
				if (row.DOC_TYPE === "QDC") {
					airbus.mes.qdc.oView.byId("idButtonQDC").setEnabled();
				}

			});
				return true;
		} else{
			return false;
		}
	}

};

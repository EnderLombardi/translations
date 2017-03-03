"use strict";

jQuery.sap.declare("airbus.mes.qdc.util.Formatter");

airbus.mes.qdc.util.Formatter = {
	
	/**
	 * BR: SD-QDC-HMI-130 This function is used to show the Exclamation mark
	 * symbol from the local json model, moreover the icon src is set.
	 */
	getExclamationIcon : function(oEvt) {
		if (oEvt === "true") {
			return "sap-icon://warning";
		}
	},

	/**
	 * BR: SD-QDC-HMI-160 This function is used to enable or disable the
	 * External tools buttons on switching the display only and Execution mode
	 * Switch control
	 */
	getButtonsEnabled : function() {
		var oVal = sap.ui.getCore().getModel("GetQDCDataModel");
		var obj = oVal.oData.Rowsets.Rowset[1].Row;
		if (airbus.mes.operationdetail.oView.byId("switchOperationModeBtn").getState() === true) {

			if (oVal.oData.Rowsets.Rowset[0].Row[0].QDCSTATUS === "X") {

				obj.filter(function(row) {
					if (row.DOC_TYPE === "MEA") {
						airbus.mes.qdc.oView.byId("idButtonMEA").setEnabled(true);
					}

				});

				obj.filter(function(row) {
					if (row.DOC_TYPE === "MAA") {
						airbus.mes.qdc.oView.byId("idButtonMAA").setEnabled(true);
					}

				});

				obj.filter(function(row) {
					if (row.DOC_TYPE === "QDC") {
						airbus.mes.qdc.oView.byId("idButtonQDC").setEnabled(true);
					}

				});
			}
		} else
			(airbus.mes.operationdetail.oView.byId("switchOperationModeBtn").getState() === false)
		{
			if (oVal.oData.Rowsets.Rowset[0].Row[0].QDCSTATUS === "X") {

				obj.filter(function(row) {
					if (row.DOC_TYPE === "MEA") {
						airbus.mes.qdc.oView.byId("idButtonMEA").setEnabled(false);
					}

				});

				obj.filter(function(row) {
					if (row.DOC_TYPE === "MAA") {
						airbus.mes.qdc.oView.byId("idButtonMAA").setEnabled(false);
					}

				});

				obj.filter(function(row) {
					if (row.DOC_TYPE === "QDC") {
						airbus.mes.qdc.oView.byId("idButtonQDC").setEnabled(false);
					}

				});
			}
		}
	},

	/**
	 * BR: SD-QDC-HMI-140 This function is used to display the counter values
	 * 
	 */
	getDescription : function(iTotCount, iCloseCount) {
		if (iTotCount === iCloseCount) {
			return "";
		} else {
			return (iCloseCount + "/" + iTotCount);
		}

	},

	/**
	 * BR: SD-QDC-HMI-130 This function is used to display the orange
	 * Exclamation mark symbol based on the TotaCount and CloseCount Difference.
	 * If Difference is greater than 1, it would be visible.
	 */
	getExclamationVisible : function(iTotCount, iCloseCount) {
		var iDiff = iTotCount - iCloseCount;

		if (iDiff >= 1) {
			return true;
		} else {
			return false;
		}
	}

};

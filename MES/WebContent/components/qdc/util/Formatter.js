"use strict";

jQuery.sap.declare("airbus.mes.qdc.util.Formatter");

airbus.mes.qdc.util.Formatter = {
	/**
	 * This function is used to show the Exclamation mark symbol
	 * from the local json model, moreover the icon src is set.
	 *
	 */
	getExclamationIcon : function(oEvt) {
		if (oEvt === "true") {
			return "sap-icon://warning";
		}
	},

	/**
	 * This function is used to show the QDC data on the UI, based on the 
	 * QDC status, moreover the External tools buttons are enabled based on the status
	 *
	 */
	getEnabled : function() {
		var oVal = sap.ui.getCore().getModel("GetQDCDataModel");

		var obj = oVal.oData.Rowsets.Rowset[1].Row;
		if (oVal.oData.Rowsets.Rowset[0].Row[0].QDCSTATUS === "X") {
			if (airbus.mes.operationdetail.oView.byId("switchStatusLabel").mProperties.text === "Execution Mode") {
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
			}

			return true;
		} else {
			return false;
		}
	},

	/**
	 * This function is used to enable or disable the External tools buttons on switching 
	 * the display only and Execution mode Switch control
	 *
	 */
	getButtonsEnabled : function() {
		var oVal = sap.ui.getCore().getModel("GetQDCDataModel");
		var obj = oVal.oData.Rowsets.Rowset[1].Row;
		if (airbus.mes.operationdetail.oView.byId("switchStatusLabel").mProperties.text === "Execution Mode") {

			if (oVal.oData.Rowsets.Rowset[0].Row[0].QDCSTATUS === "X") {

				obj.filter(function(row) {
					if (row.DOC_TYPE === "MEA") {
						airbus.mes.qdc.oView.byId("idButtonMEA").setEnabled(true);
					}

				});

				obj.filter(function(row) {
					if (row.DOC_TYPE === "PLA") {
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
			(airbus.mes.operationdetail.oView.byId("switchStatusLabel").mProperties.text === "Read Only")
		{
			if (oVal.oData.Rowsets.Rowset[0].Row[0].QDCSTATUS === "X") {

				obj.filter(function(row) {
					if (row.DOC_TYPE === "MEA") {
						airbus.mes.qdc.oView.byId("idButtonMEA").setEnabled(false);
					}

				});

				obj.filter(function(row) {
					if (row.DOC_TYPE === "PLA") {
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
	 * This function is used to display the counter
	 * values
	 *
	 */
	getDescription : function(oEvt) {
		// var iRootLevel = this.getParent().getParent().getRootLevel();
		if (this.getParent().getCells()[0]) {
			var oVal = sap.ui.getCore().getModel("GetQDCDataModel");
			var iTotCount = oVal.oData.Rowsets.Rowset[0].Row[0].TOT_COUNT;
			var iCloseCount = oVal.oData.Rowsets.Rowset[0].Row[0].CLOSE_COUNT;

			if (iTotCount === iCloseCount) {
				return "";
			} else {
				return (iCloseCount + "/" + iTotCount);
			}
		} else {
			return "";
		}

	},

	/**
	 * This function is used to display the orange Exclamation mark symbol
	 * based on the TotaCount and CloseCount Difference.
	 * If Difference is greater than 1, it would be visible.
	 */
	getExclamationVisible : function() {
		var oVal = sap.ui.getCore().getModel("GetQDCDataModel");
		var iTotCount = oVal.oData.Rowsets.Rowset[0].Row[0].TOT_COUNT;
		var iCloseCount = oVal.oData.Rowsets.Rowset[0].Row[0].CLOSE_COUNT;

		var iDiff = iTotCount - iCloseCount;

		if (iDiff >= 1) {
			return true;
		} else {
			return false;
		}
	}

};

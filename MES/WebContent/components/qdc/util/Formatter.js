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
	},
	getButtonVisible : function(sBoolean) {
		if (sBoolean === true) {
			return true;
		} else {
			return false;
		}
	}

};

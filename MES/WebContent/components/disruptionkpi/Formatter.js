"use strict";

jQuery.sap.declare("airbus.mes.disruptionkpi.Formatter");

airbus.mes.disruptionkpi.Formatter = {
	
	/**
	 * @param milli
	 *            seconds
	 * @output minutes function to conver milliseconds to minutes devide by
	 *         60000
	 */
	msToUnitConverter : function(ms) {
		
		var unit  = sap.ui.getCore().byId("disruptionKPIView--timeUnit").getSelectedKey();
		if (ms != '' && ms != undefined) {
			if (unit === "Minutes")
				return Math.round(ms / 60000);
			else if (unit === "Hours")
				return Math.round(ms / 3600000);
		}
		return 0;
	},
};

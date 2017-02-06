"use strict";
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.declare("airbus.mes.stationHandover.util.Formatter");

airbus.mes.stationHandover.util.Formatter = {

	isBlocked : function(oEvt) {

		var oEvt

	},

	translate : function(oEvt) {

		return airbus.mes.stationHandover.oView.getModel("stationHandoverI18n").getProperty(oEvt);

	},

	isInsert : function(oEvt) {

		if (oEvt === "true") {

			return true;

		}

		if (oEvt === "false") {
			if ( airbus.mes.stationHandover.util.ModelManager.selectAll ) {
				
				return true;
			}
			return false;
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
	
	setColorLine : function(oEvt) {
		
		var oRow = "#" + this.getParent().sId;
		
		if ( oEvt != null  ) {
			if ( oEvt.TYPE === "0" ) {
				
				$(oRow).removeClass("blue");
				$(oRow).addClass("blue");
	
			}
		} else {
			
			$(oRow).removeClass("blue");
		}
	}
};

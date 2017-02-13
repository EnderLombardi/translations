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

		var aValueSelected = airbus.mes.stationHandover.util.ModelManager.aSelected;
		var applyAll = airbus.mes.stationHandover.util.ModelManager.applyAll;

		if (oEvt != null) {

			var sPath = this.oPropagatedProperties.oBindingContexts.oswModel.sPath;
			var oModel = airbus.mes.stationHandover.oView.getModel("oswModel").getProperty(sPath);

			//			if (oModel.INSERTED === "true") {
			//
			//				return true;
			//
			//			}

			//if (oModel.INSERTED === "false") {
			// Apply selection/unselection of box all only when clicking on

			// Check if we selected a chill or not
			if (oModel.MATERIAL_DESCRIPTION != undefined) {

				return aValueSelected[oModel.WOID].open;

			} else {

				return aValueSelected[oModel.WOID][oModel.WOID + "##||##" + oModel.REFERENCE].open;

			}

			//}

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

//	setColorLine : function(oEvt) {
//
//		var oRow = "#" + this.getParent().sId;
//
//		if (oEvt != null) {
//			if (oEvt.TYPE === "0") {
//
//				$(oRow).removeClass("blue");
//				$(oRow).addClass("blue");
//
//			}
//		} else {
//
//			$(oRow).removeClass("blue");
//		} 							visible="{path:'oswModel>' , formatter:'airbus.mes.stationHandover.util.Formatter.setColorLine'}"
//	}
};

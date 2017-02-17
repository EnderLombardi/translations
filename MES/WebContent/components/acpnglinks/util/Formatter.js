"use strict";
jQuery.sap.declare("airbus.mes.acpnglinks.util.Formatter");

airbus.mes.acpnglinks.util.Formatter = {
	/**
	 * Set Visibility to false
	 * 
	 * @param {string}
	 *            sValue : true or false
	 * @returns {boolean} return : true/false
	 */
	toBooleanLeft : function(sValue) {
		if (sValue.toUpperCase() == "NEVER") {
			return false;
		} else {
			return !Boolean(sValue.toUpperCase() == "TRUE");
		}
	},

	/**
	 * Set visibility to true
	 * 
	 * @param {string}
	 *            sValue : true or false
	 * @returns {boolean} return : true/false
	 */
	toBooleanRight : function(sValue) {
		if (sValue.toUpperCase() == "NEVER") {
			return false;
		} else {
			return Boolean(sValue.toUpperCase() == "TRUE");
		}
	},

	/**
	 * handle Tree table row color
	 */
	changeRowColor : function() {
		var oTable = sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable");
		var count = oTable.getVisibleRowCount();
//		for (var i = 0; i < count; i++) {
//			var id = oTable.getRows()[i].getId();
//			var level = $("#" + id)[0].getAttribute("aria-level");
//				level = $("#" + id)[0].getAttribute("data-sap-ui-level");
//			try {
////				level = oTable.getRows()[i].getModel("acpnglinksWorkOrderDetail").getProperty(
////					oTable.getRows()[i].getBindingContext("acpnglinksWorkOrderDetail").getPath() + "/Level");
//
//				$("#" + id).css("background-color", "white");
//				level = parseInt(level, 10);
//				switch (level % 5) {
//				case 0:
//					$("#" + id).css("background-color", "#fbefcc");
//					break;
//				case 1:
//					$("#" + id).css("background-color", "#cfe0e8");
//					break;
//				case 2:
//					$("#" + id).css("background-color", "#b7d7e8");
//					break;
//				case 3:
//					$("#" + id).css("background-color", "#87bdd8");
//					break;
//				case 4:
//					$("#" + id).css("background-color", "#daebe8");
//					break;
//				}
//			} catch (err) {
//				// level = $("#" + id)[0].getAttribute("aria-level");
//			}
//		}

	},
};

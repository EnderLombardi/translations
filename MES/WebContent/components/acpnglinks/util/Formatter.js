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
		if (sValue != undefined) {
			if (sValue.toUpperCase() == "NEVER") {
				return false;
			} else {
				return !Boolean(sValue.toUpperCase() == "TRUE");
			}
		}else{
			return false
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
		if (sValue != undefined) {
			if (sValue.toUpperCase() == "NEVER") {
				return false;
			} else {
				return Boolean(sValue.toUpperCase() == "TRUE");
			}
		}else{
			return false;
		}
	},

	/**
	 * Set custom data level on DOM
	 */
	levelFormat : function(sValue) {
		var result = sValue % 5;
		var oRow;
			
		if(sValue == undefined || isNaN(sValue) == true) {
			result = 1;
		}
		try{
			oRow = this.getParent().getParent();
			oRow.data("level", result.toString() , true);
			}catch(e){
			//do nothing	
			}
		return result.toString();
	},
	
	/**
	 * Set custom data CurrentWO on DOM
	 */
	currentWOFormat : function(sValue){
		var result = "false";
		if ( sValue == airbus.mes.acpnglinks.oView.getController().getOwnerComponent().getWorkOrder()){
			result = "true";
		}
		try{
			oRow = this.getParent().getParent();
			oRow.data("currentWO", result , true);
		} catch(e){
//do nothing			
		}
		return result;
	}
};

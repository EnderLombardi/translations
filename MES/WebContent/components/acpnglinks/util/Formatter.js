"use strict";
jQuery.sap.declare("airbus.mes.acpnglinks.util.Formatter");

airbus.mes.acpnglinks.util.Formatter = {
	/**
	 * Set Visibility to false
	 * @param {string}
	 * 		sValue :  true or false
	 * @returns {boolean}
	 * 		return : true/false
	 */
    toBooleanLeft : function(sValue) {
    return !Boolean(sValue.toUpperCase() == "TRUE");
    },

	/**
	 * Set visibility to true
	 * @param {string}
	 * 		sValue :  true or false
	 * @returns {boolean}
	 * 		return : true/false
	 */
    toBooleanRight : function(sValue) {
    return Boolean(sValue.toUpperCase() == "TRUE");
    },
    
	/**
	 * handle Tree table row color
	 */
    changeRowColor: function(){
        var oTable = sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable");
        var count = oTable.getVisibleRowCount();
        for(var i = 0; i < count; i++){
            var id = oTable.getRows()[i].getId();
            $("#" + id).css("background-color", "#c5d4e4");
        }

    }
};

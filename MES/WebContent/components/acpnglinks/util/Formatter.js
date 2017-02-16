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
		if(sValue.toUpperCase() == "NEVER") {
			return false;
		}else{
			return !Boolean(sValue.toUpperCase() == "TRUE");
		}
	},

	/**
	 * Set visibility to true
	 * @param {string}
	 * 		sValue :  true or false
	 * @returns {boolean}
	 * 		return : true/false
	 */
	toBooleanRight : function(sValue) {
		if(sValue.toUpperCase() == "NEVER") {
			return false;
		}else{
			return Boolean(sValue.toUpperCase() == "TRUE");
		}
	},
    
	/**
	 * handle Tree table row color
	 */
    changeRowColor: function(){
        var oTable = sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable");
        var count = oTable.getVisibleRowCount();
        for(var i = 0; i < count; i++){
            var id = oTable.getRows()[i].getId();
            var level = $("#" + id)[0].getAttribute("aria-level");
            $("#" + id).css("background-color", "white");
            level = parseInt(level,10);
            switch (level % 5){
            case 0:
                $("#" + id).css("background-color", "blue");
            	break;
            case 1:
            	$("#" + id).css("background-color", "green");
            	break;
            case 2:
            	$("#" + id).css("background-color", "red");
            	break;
            case 3:
            	$("#" + id).css("background-color", "pink");
            	break;
            case 4:
            	$("#" + id).css("background-color", "yellow");
            	break;
            }

        }

    },
};

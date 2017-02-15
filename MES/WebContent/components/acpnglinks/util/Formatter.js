"use strict";
jQuery.sap.declare("airbus.mes.acpnglinks.util.Formatter");

airbus.mes.acpnglinks.util.Formatter = {

    toBooleanLeft : function(sValue) {
    return !Boolean(sValue.toUpperCase() == "TRUE");
    },

    toBooleanRight : function(sValue) {
    return Boolean(sValue.toUpperCase() == "TRUE");
    },
    changeRowColor: function(){
        var oTable = sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable");
        var count = oTable.getVisibleRowCount();
        for(var i = 0; i < count; i++){
            var id = oTable.getRows()[i].getId();
            $("#" + id).css("background-color", "#c5d4e4");
        }

    }
};

"use strict";

jQuery.sap.declare("airbus.mes.trackingtemplate.util.Formatter");

airbus.mes.trackingtemplate.util.Formatter = {

    dateFormat: function (sDate) {
        var aDate = sDate.split("T");
        return aDate[0] + " " + aDate[1];
    }


}
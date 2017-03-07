"use strict";

jQuery.sap.declare("airbus.mes.trackingtemplate.util.Formatter");

airbus.mes.trackingtemplate.util.Formatter = {

    commentFormat: function (sComment) {
        var regex = /^([^-]*-)?(.*)$/;
        return regex.exec(sComment)[2];
    },

    isEmpty: function (length) {
        if(length === 0) {
            return false;
        }
        return true;
    }

}
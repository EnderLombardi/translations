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
    }, 
    checkFreeze : function(sProfile) {
//    	If Tracking Template is Freeze, the action is disabled
    	if(airbus.mes.trackingtemplate.oView.getController().freeze === true) {
    		return false;
    	} else {
    		return sProfile;
    	}
    }

}
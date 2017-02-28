"use strict";
jQuery.sap.declare("airbus.mes.userConfirmation.util.Formatter");

airbus.mes.userConfirmation.util.Formatter = {

    displayBadge : function(){
        return airbus.mes.settings.AppConfManager.getConfiguration("MES_BADGE_ACTIVE");
    },

    displayPin : function(){
        return airbus.mes.settings.AppConfManager.getConfiguration("MES_BADGE_PIN");
    },

    displaySeperator : function() {
        if (airbus.mes.settings.AppConfManager.getConfiguration("MES_BADGE_ACTIVE")
            || airbus.mes.settings.AppConfManager.getConfiguration("MES_BADGE_PIN")) {
            return true;
        } else
            return false;
    },

};

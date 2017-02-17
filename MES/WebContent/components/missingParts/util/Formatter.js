"use strict";
jQuery.sap.declare("airbus.mes.missingParts.util.Formatter");

airbus.mes.missingParts.util.Formatter = {

    getTranslation: function(sIdText){
        return airbus.mes.missingParts.oView.getModel("i18nmissingPartsModel").getProperty(sIdText);
    }

};
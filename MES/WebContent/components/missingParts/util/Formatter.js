"use strict";
jQuery.sap.declare("airbus.mes.missingParts.util.Formatter");

airbus.mes.missingParts.util.Formatter = {

    /**
     * Manage internationalization texts
     * 
     * @param {any} sIdText 
     * @returns 
     */
    getTranslation: function(sIdText){
        return airbus.mes.missingParts.oView.getModel("i18nmissingPartsModel").getProperty(sIdText);
    },
    
    splitName : function(sText) {
    	
    	if ( sText != undefined && !null ) {
    		
    		return sText.split("-").slice(-1)[0];
    	}
    	
    	return;
    }
};
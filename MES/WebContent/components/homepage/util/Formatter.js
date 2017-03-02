"use strict";
jQuery.sap.declare("airbus.mes.homepage.util.Formatter");

airbus.mes.homepage.util.Formatter = {

	enabledTiles : function(sFeature) {

		if (sap.ui.getCore().getModel("Profile").getProperty("/identifiedUser/permissions/HOMESCREEN")){
		
			if (sap.ui.getCore().getModel("Profile").getProperty("/identifiedUser/permissions/" + sFeature) != undefined) {
	
				return sap.ui.getCore().getModel("Profile").getProperty("/identifiedUser/permissions/" + sFeature);
	
			}
	
			return true;
			
		} 
		return false;
	}

};

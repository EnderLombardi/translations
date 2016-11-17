"use strict";

jQuery.sap.declare("airbus.mes.shell.UserImageManager");

airbus.mes.shell.UserImageManager =  {
	
	
	/**************************************************
	 * Get user image
	 */
	getUserImage: function(username){
		
		var urlUserImage = airbus.mes.shell.ModelManager.urlModel.getProperty("urlGetUserImage");
		return urlUserImage.replace("$username", username.toUpperCase());
	}
	
}
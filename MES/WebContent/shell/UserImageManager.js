"use strict";

jQuery.sap.declare("airbus.mes.shell.UserImageManager");

airbus.mes.shell.UserImageManager =  {
	
	
	/**************************************************
	 * Get user image
	 */
	getUserImage: function(imageId, username){
		
		var urlUserImage = airbus.mes.shell.ModelManager.urlModel.getProperty("urlGetUserImage");
		urlUserImage = urlUserImage.replace("$username", username.toUpperCase());
		sap.ui.getCore().byId(imageId).onerror = airbus.mes.shell.UserImageManager.getErrorUserImage;
		return urlUserImage; 
	},
getErrorUserImage: function(){

	if(this.setSrc)
	this.setSrc ( "../images/user.png");
	else
	 this.src =  "../images/user.png";
}
	
}
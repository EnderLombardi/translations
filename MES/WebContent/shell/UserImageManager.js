"use strict";

jQuery.sap.declare("airbus.mes.shell.UserImageManager");

airbus.mes.shell.UserImageManager =  {


	/**************************************************
	 * Get user image
	 */

	getUserImage: function(imageId, username){

		var urlUserImage = airbus.mes.shell.ModelManager.urlModel.getProperty("urlGetUserImage");
		urlUserImage = urlUserImage.replace("$username", username.toUpperCase());
		if(sap.ui.getCore().byId(imageId))
			sap.ui.getCore().byId(imageId).onerror = airbus.mes.shell.UserImageManager.getErrorUserImage;
		return urlUserImage; 
	},
		
	getErrorUserImage: function(img){

		if(this.setSrc)
			this.setSrc ( "../images_locale/user.png");
		else
			img.src =  "../images_locale/user.png";
	}

}
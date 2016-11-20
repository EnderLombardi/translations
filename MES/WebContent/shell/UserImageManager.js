"use strict";

jQuery.sap.declare("airbus.mes.shell.UserImageManager");

airbus.mes.shell.UserImageManager =  {
	
	
	/**************************************************
	 * Get user image
	 */
	getUserImage: function(imageId, username){
		
		var urlUserImage = airbus.mes.shell.ModelManager.urlModel.getProperty("urlGetUserImage");
		urlUserImage = urlUserImage.replace("$username", username.toUpperCase());
		
		var downloadingImage = new Image();
		downloadingImage.id = imageId+"_rand";

		downloadingImage.onload = function(){ 
                          	var id = this.id.split("_rand")[0];
                          	$("#" + id )[0].src = this.src;
		                  };
		downloadingImage.src = urlUserImage;		
		return "../images/user.png"
	}
	
}
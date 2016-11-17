"use strict";

jQuery.sap.declare("airbus.mes.shell.UserImageManager");

airbus.mes.shell.UserImageManager =  {
	
	
	/**************************************************
	 * Get user image
	 */
	getUserImage: function(username){
		
		var urlUserImage = airbus.mes.shell.ModelManager.urlModel.getProperty("urlAppConfiguration");
		urlUserImage = airbus.mes.shell.ModelManager.replaceURI(urlUserImage,
				"$username", username);
		
		var userImage;
		
		
		jQuery.ajax({
		    type:'post',
		    async:false,
		    url: urlUserImage,
		    contentType: 'application/json',
		    success: function(data){
		    	userImage = JSON.parse(data).user["user-photo"];
		    },
		    
		    error: function(error,  jQXHR){console.log(error)}
		});
		
		return userImage;
	}
	
}
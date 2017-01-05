"use strict";

jQuery.sap.declare("airbus.mes.linetracker.util.Formatter");
airbus.mes.linetracker.util.Formatter = {
	
	selectImageToDisplay : function(station){
        var src = airbus.mes.linetracker.util.ModelManager.selectImageToDisplay(station);
        return src;
    },
    
    displayFlightImage:function(){
    	 return airbus.mes.settings.AppConfManager.getConfiguration("MES_PHOTO_DISPLAY");
    },
	
    selectImageToDisplay:function(imageId, station){
	   var urlFlightImage = airbus.mes.linetracker.util.ModelManager.urlModel.getProperty("urlGetFlightImage");
//	   urlFlightImage = urlFlightImage.replace("$username", username.toUpperCase());
		if(sap.ui.getCore().byId(imageId))
			sap.ui.getCore().byId(imageId).onerror = airbus.mes.linetracker.util.ModelManager.getErrorFlightImage;
		urlFlightImage = "../components/linetracker/images/Emirates_logo.jpg";
		return urlFlightImage;
		
//    	img.src =  "../images/Emirates_logo.jpg";
    	
    },
    getErrorFlightImage: function(img){

			img.src =  "..../components/linetracker/images/lufthansa-logo.jpg";
	}
}

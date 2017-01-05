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
		urlFlightImage = "../images_locale/Emirates_logo.jpg";
		return urlFlightImage;
		
//    	img.src =  "../images/Emirates_logo.jpg";
    	
    },
    getErrorFlightImage: function(img){
			img.src =  "../images_locale/lufthansa-logo.jpg";
	},
	
	stationIconTrendSrc : function(bTrend){
		if(bTrend == "true"){
			return "sap-icon://up"
		}else if(bTrend == "false"){
			return "sap-icon://down"
		}else{
			return "sap-icon://media-play"
		}
	},
	
	stationIconTrendColor : function(bTrend){
		if(bTrend == "true"){
			return "#84bd00"
		}else  if(bTrend == "false"){
			return "#e4002b"
		}else{
			return "#97999b"
		}
	}
}

"use strict";

jQuery.sap.declare("airbus.mes.linetracker.util.Formatter");
airbus.mes.linetracker.util.Formatter = {
	
	selectImageToDisplay : function(airline_logo_url){
        var src = airbus.mes.linetracker.util.Formatter.getAirlineImage(this.sId, airline_logo_url);
        return src;
    },
    
    displayFlightImage:function(){
    	 return airbus.mes.settings.AppConfManager.getConfiguration("MES_PHOTO_DISPLAY");
    },
	
    getAirlineImage:function(imageId, airline_logo_url){
//	   var urlFlightImage = airbus.mes.linetracker.util.ModelManager.urlModel.getProperty("urlAirline_logo");
    	var urlFlightImage = sap.ui.getCore().getModel("airlineLogoModel").oData["Rowsets"].Rowset[0].Row[0].airline_logo_url;
//	   urlFlightImage = urlFlightImage.replace("$username", username.toUpperCase());
//	   urlFlightImage = urlFlightImage.replace("$TF", "V");
//	   urlFlightImage = urlFlightImage.replace("$Application_ID", "000000000030");
//	   urlFlightImage = urlFlightImage.replace("$msn", "00002");
		if(sap.ui.getCore().byId(imageId))
			sap.ui.getCore().byId(imageId).onerror = airbus.mes.linetracker.util.Formatter.getErrorFlightImage;

		return urlFlightImage;    	
    },
    getErrorFlightImage: function(img){
			if(this.setSrc)
				this.setSrc ( "../images_locale/lufthansa-logo.jpg");
			else
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

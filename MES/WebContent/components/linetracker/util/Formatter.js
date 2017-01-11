"use strict";

jQuery.sap.declare("airbus.mes.linetracker.util.Formatter");
airbus.mes.linetracker.util.Formatter = {
	
	/**
	 * BR: SD-PPC-LT-110
	 * To select Airline logo
	 * @param {string} :msn
	 * @Returns Image Url
	 */
	selectImageToDisplay : function(msn){
        var src = airbus.mes.linetracker.util.Formatter.getAirlineImage(this.sId, msn);
        return src;
    },
    /**
     * BR: SD-PPC-LT-110
     * To display Airline Logo
     * @Returns {boolean}: true
     */
    
    displayFlightImage:function(){
    	 return airbus.mes.settings.AppConfManager.getConfiguration("MES_PHOTO_DISPLAY");
    },
	
    /**
     * BR: SD-PPC-LT-110
     * To display Airline Logo
     * @param image Id
     * @param msn
     * @returns image url
     */
    getAirlineImage:function(imageId, msn){
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
    /**
     * BR: SD-PPC-LT-110
     * Get Error Airline Logo 
     * Default Logo url will be sent
     * @return ImageUrl
     */
    getErrorFlightImage: function(img){
			if(this.setSrc)
				this.setSrc ( "../images_locale/lufthansa-logo.jpg");
			else
				img.src =  "../images_locale/lufthansa-logo.jpg";
	},
	
	
	/**
	 * BR: SD-PPC-LT-150
	 * To display Trend Symbol for Forecast end of assembly – trend 
	 * @return trend symbol
	 */
	stationIconTrendSrc : function(bTrend){
		if(bTrend == "true"){
			return "sap-icon://up"
		}else if(bTrend == "false"){
			return "sap-icon://down"
		}else{
			return "sap-icon://media-play"
		}
	},
	
	/**
	 *  BR: SD-PPC-LT-150
	 * To display Trend color for Forecast end of assembly – trend 
	 * @return trend color
	 */
	stationIconTrendColor : function(bTrend){
		if(bTrend == "true"){
			return "#84bd00"
		}else  if(bTrend == "false"){
			return "#e4002b"
		}else{
			return "#97999b"
		}
	},
	/**
	 * BR:SD-PPC-ST-1910
	 * Set the progress Icon of Station based on MSN,Completion Data and Actual Start Date
	 * @param msn, completion_date_time and Actual_date_time
	 * @param return Icon
	 */
	getActionIcon: function(msn, date){
		if(msn == ""){
			return "sap-icon://border";
		}else if(msn != "" && date == ""){
			return "sap-icon://accept";
		}else if(msn != "" && date != "" ){
			return "sap-icon://media-play";
		}else{
			return "sap-icon://media-pause";
		}
		
	}
}

"use strict";

jQuery.sap.declare("airbus.mes.linetracker.util.Formatter");
airbus.mes.linetracker.util.Formatter = {

	/**
	 * BR: SD-PPC-LT-110 To select Airline logo
	 * 
	 * @param {string}
	 *            :msn
	 * @Returns Image Url
	 */
	/*
	 * selectImageToDisplay : function(msn){ var src =
	 * airbus.mes.linetracker.util.Formatter.getAirlineImage(this.sId, msn);
	 * return src; },
	 */
	/**
	 * BR: SD-PPC-LT-110 To display Airline Logo
	 * 
	 * @Returns {boolean}: true
	 */

	/**
	 * BR: SD-PPC-LT-110 To display Airline Logo
	 * 
	 * @param msn
	 * @returns image url
	 */
	/*
	 * getAirlineImage:function(msn){ // var urlFlightImage =
	 * airbus.mes.linetracker.util.ModelManager.urlModel.getProperty("urlAirline_logo"); //
	 * var urlFlightImage =
	 * sap.ui.getCore().getModel("airlineLogoModel").oData["Rowsets"].Rowset[0].Row[0].airline_logo_url;
	 * var urlFlightImage =
	 * airbus.mes.linetracker.util.Formatter.loadFlightLogo(msn); //
	 * urlFlightImage = urlFlightImage.replace("$username",
	 * username.toUpperCase()); // urlFlightImage =
	 * urlFlightImage.replace("$TF", "V"); // urlFlightImage =
	 * urlFlightImage.replace("$Application_ID", "000000000030"); //
	 * urlFlightImage = urlFlightImage.replace("$msn", "00002");
	 * //if(sap.ui.getCore().byId(imageId))
	 * //sap.ui.getCore().byId(imageId).onerror =
	 * airbus.mes.linetracker.util.Formatter.getErrorFlightImage; //
	 * console.log(urlFlightImage); return urlFlightImage; },
	 */

	/**
	 * BR: SD-PPC-LT-110 Get Error Airline Logo Default Logo url will be sent
	 * 
	 * @return ImageUrl
	 */
	getErrorFlightImage : function() {
		return "../images_locale/Airbus.jpg";

	},
	/**
	 * BR: SD-PPC-LT-110 Load Airline Logo Model
	 */
	// TODO $TF, $Application_ID and $msn values to be changed
	loadFlightLogo : function(msn) {
		var that = this;
		// msn= msn.split("_")[0];//to remove the hand from msn
		// var oViewModel = sap.ui.getCore().getModel("airlineLogoModel");
		var url = airbus.mes.linetracker.util.ModelManager.urlModel.getProperty("urlAirline_logo");
		url = url.replace("$TF", "V");
		url = url.replace("$Application_ID", "000000000030");
		url = url.replace("$msn", msn);
		jQuery.ajax({
			async : true,
			type : 'get',
			url : url,
			contentType : 'application/json',

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				try {
					if (data.Rowsets.Rowset[0].Row[0].airline_logo_url && data.Rowsets.Rowset[0].Row[0].airline_logo_url.length != 0) {
						var url = data.Rowsets.Rowset[0].Row[0].airline_logo_url;
						jQuery.ajax({
							async : true,
							type : 'get',
							url : data.Rowsets.Rowset[0].Row[0].airline_logo_url,
							success : function(data) {
								that.setSrc(url);
							},
							error : function() {
								that.setSrc(airbus.mes.linetracker.util.Formatter.getErrorFlightImage())
							}
						});
						that.setSrc(data.Rowsets.Rowset[0].Row[0].airline_logo_url);
					} else {
						that.setSrc(airbus.mes.linetracker.util.Formatter.getErrorFlightImage());
					}// return
						// data.Rowsets.Rowset[0].Row[0].airline_logo_url;
				} catch (oException) {
					that.setSrc(airbus.mes.linetracker.util.Formatter.getErrorFlightImage());
				}
			},

			error : function(error, jQXHR) {
				that.setSrc(airbus.mes.linetracker.util.Formatter.getErrorFlightImage());
			}
		});
	},

	/**
	 * BR: SD-PPC-LT-150 To display Trend Symbol for Forecast end of assembly –
	 * trend
	 * 
	 * @return trend symbol
	 */
	stationIconTrendSrc : function(bTrend) {
		if (bTrend == "true") {
			return "sap-icon://up"
		} else if (bTrend == "false") {
			return "sap-icon://down"
		} else {
			return "sap-icon://media-play"
		}
	},

	/**
	 * BR: SD-PPC-LT-150 To display Trend color for Forecast end of assembly –
	 * trend
	 * 
	 * @return trend color
	 */
	stationIconTrendColor : function(bTrend) {
		if (bTrend == "true") {
			return "#84bd00"
		} else if (bTrend == "false") {
			return "#e4002b"
		} else {
			return "#97999b"
		}
	},
	/**
	 * BR:SD-PPC-ST-1910 Set the progress Icon of Station based on
	 * MSN,Completion Data and Actual Start Date
	 * 
	 * @param msn,
	 *            completion_date_time and Actual_date_time
	 * @param return
	 *            Icon
	 */
	getActionIcon : function(msn, completionDate, actualStartDate) {
		if (msn == null) {
	getActionIcon: function(status){
	/*	if(status == "UN_LOADED" || status == "TO_BE_LOADED"){ 
			return "sap-icon://border";
		} else if (completionDate != null) {
		}else if(status == "COMPLETE"){
			return "sap-icon://accept";
		} else if (actualStartDate != null) {
		}else if(status == "IN_PROGRESS"){
			return "sap-icon://media-play";
		} else if (actualStartDate == null) {
		}else if(status == "LOADED"){
			return "sap-icon://media-pause";
		} else {
			return "";
		}*/
		return  "sap-icon://media-play";
	},
	showHideButtonsOnStatus : function(status) {
		if (this.getId() === "loadNextMSN" && status)
			return true;
		if (this.getId() === "startAssembly" && status)
			return true;
		if (this.getId() === "emptyStation" && status)
			return true;
		if (this.getId() === "endAssembly" && status)
			return true;
		if (this.getId() === "undo" && status)
			return true;
		/*status is msn here for last case*/
		if (this.getId() === "nextMsnImage" && status && status!=="NA")
			return true;

	}
}

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
	loadFlightLogo : function(station, msn) {
		var that = this;
		/*if(msn==="NA"){
			sap.ui.getCore().byId("loadNextMSN").setText("No MSN Load");
			sap.ui.getCore().byId("nextMsnImage").setVisible(false);
			return;
		}*/
		// msn= msn.split("_")[0];//to remove the hand from msn
		// var oViewModel = sap.ui.getCore().getModel("airlineLogoModel");
		var url = airbus.mes.linetracker.util.ModelManager.urlModel.getProperty("urlAirline_logo");
		var oResult = airbus.mes.linetracker.util.ModelManager.getProgramForMsnStation(station, msn);
		var sProgram;
		if(oResult && oResult.program){
			sProgram = oResult.program;
		}
		url = url.replace("$TF", sProgram);
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
	getActionIcon : function(status) {
		if (status == "UN_LOADED" || status == "TO_BE_LOADED") {
			return "sap-icon://border";
		} else if (status == "COMPLETE") {
			return "sap-icon://accept";
		} else if (status == "IN_PROGRESS") {
			return "sap-icon://media-play";
		} else if (status == "LOADED") {
			return "sap-icon://synchronize";
		} else {
			return "sap-icon://alert";
		}

	},
	/**
	 * BR:SD-PPC-ST-1910 Set the progress Icon for takt operations 
	 * on takt popover fragment
	 * @param 
	 * @param return boolean
	 *            
	 */
	showHideButtonsOnStatus : function(status) {

		if (!status)
			return false;
		if (this.getId() === "loadNextMSN") {
			// if(status === "UN_LOADED" || status === "COMPLETE" || status ===
			// "TO_BE_LOADED")
			if ((status === "LOADED" || status === "IN_PROGRESS" || status === "COMPLETE" || status === "UN_LOADED") /*&& msn && msn!=="NA" || msn.length()==""*/ )
				return false;
			else
				return true;
		}

		if (this.getId() === "startAssembly") {
			// if( status !== "LOADED" || status !== "IN_PROGRESS" )
			if (status === "IN_PROGRESS" || status === "UN_LOADED" || status === "COMPLETE" || status === "TO_BE_LOADED")
				return false;
			else
				return true;

		}
		if (this.getId() === "emptyStation") {
			// if( status !== "UN_LOADED" )
			if (status === "UN_LOADED" || status === "TO_BE_LOADED" || status === "IN_PROGRESS" || status === "LOADED")
				return false;
			else
				return true;

		}
		if (this.getId() === "endAssembly") {
			// if( status !== "IN_PROGRESS" || status !== "LOADED" )
			if (status === "UN_LOADED" || status === "COMPLETE" || status === "TO_BE_LOADED" || status === "LOADED")
				return false;
			else
				return true;

		}

		if (this.getId() === "undo") {
			if (status === "COMPLETE" || status === "IN_PROGRESS" || status === "LOADED" || status === "UN_LOADED" || status === "TO_BE_LOADED")
				return true;
			else
				return false;

		}

		if (this.getId() === "nextMsnImage") { // /*status is msn here for last									// case*/
			if (status !== "NA")
				return true;
			else{
				//sap.ui.getCore().byId("loadNextMSN").setText(airbus.mes.linetracker.oView.getModel("i18n").getProperty("NoMSNToLoad"));
				return false;
			}

		}

	}

}

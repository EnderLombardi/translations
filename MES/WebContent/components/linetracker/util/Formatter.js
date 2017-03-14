"use strict";

jQuery.sap.declare("airbus.mes.linetracker.util.Formatter");
airbus.mes.linetracker.util.Formatter = {

	/**
	 * BR: SD-PPC-LT-110 Get Error Airline Logo Default Logo url will be sent
	 * 
	 * @return ImageUrl
	 */
	getErrorFlightImage : function(oEvt) {
		oEvt.oSource.setSrc(airbus.mes.shell.ModelManager.getResourceUrl('airbus.logo.jpg'));
	},
	
	/**
	 * BR: SD-PPC-LT-110 Load Airline Logo Model
	 */
	// TODO $TF, $Application_ID and $msn values to be changed
	loadFlightLogo : function(station, msn) {
		var that = this;
		
		this.setSrc(airbus.mes.shell.ModelManager.getResourceUrl('airbus.logo.jpg'));

		var url = airbus.mes.linetracker.util.ModelManager.urlModel.getProperty("urlAirline_logo");
		var oResult = airbus.mes.linetracker.util.ModelManager.getProgramForMsnStation(station, msn);
		var sProgram;
		//to remove hand from msn if msn exists
		if(msn)
			msn=msn.split("_")[0];
		if(oResult && oResult.TF){
			sProgram = oResult.TF;
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
						that.setSrc(url);
					} 
				} catch (oException) {
					that.setSrc(airbus.mes.shell.ModelManager.getResourceUrl('airbus.logo.jpg'));
				}
			}
		});
	},

	/**
	 * BR: SD-PPC-LT-150 To display Trend Symbol for Forecast end of assembly –
	 * trend
	 * 
	 * @return trend symbol
	 */
	stationIconTrendSrc : function(bTrend, trendException) {
		if (bTrend == "true" && trendException=="false") {
			//this.color="#84bd00";
			return "sap-icon://up"
		} else if (bTrend == "false" && trendException=="false") {
			//this.color="#e4002b";
			return "sap-icon://down"
		} else {
			//this.color="#97999b";
			return "sap-icon://media-play"
		}
	},

	/**
	 * BR: SD-PPC-LT-150 To display Trend color for Forecast end of assembly –
	 * trend
	 * 
	 * @return trend color
	 */
	stationIconTrendColor : function(bTrend, trendException) {
		if (bTrend == "true" && trendException=="false") {
			return "#84bd00"
		} else if (bTrend == "false" && trendException=="false") {
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
		
		if(status)
		this.setTooltip(sap.ui.getCore().byId("idLinetracker").getModel("i18n").getProperty("tooltip_"+status));
	
		
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

	},
	
	/**
	 * @param completionTime,actualEndTime
	 * output show completion date if available , else show actual takt end date
	 */
	forcastEndDate : function(completionTime,actualEndTime, status){
		if (status === "COMPLETE") {
			return airbus.mes.linetracker.util.Formatter.dateToStringFormat(completionTime);
		} else if (status === "IN_PROGRESS") {
			return airbus.mes.linetracker.util.Formatter.dateToStringFormat(actualEndTime);
		} else { 
			return;
		}
	},
	
	/**
	 * @param sDate
	 * output formatted date
	 */
	dateToStringFormat : function(sDate) {
		// Date send by MII are UTC date
		var oDate = new Date(sDate);
		var oFormat = sap.ui.core.format.DateFormat.getInstance({
			UTC : true,
			pattern : "dd MMM yyyy - HH:mm",
			calendarType : sap.ui.core.CalendarType.Gregorian
		});
		return oFormat.format(oDate)
	},

}

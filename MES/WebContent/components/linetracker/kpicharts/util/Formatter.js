"use strict";
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.declare("airbus.mes.linetracker.kpicharts.util.Formatter");

airbus.mes.linetracker.kpicharts.util.Formatter = {

	/**
	 * To convert Date to StringFormat
	 * @Param sDate
	 */
        dateToStringFormat : function(sDate){
            var oDate = new Date(sDate);
            var oFormat = sap.ui.core.format.DateFormat.getInstance({
                pattern : "dd MMM - HH:mm",
                calendarType : sap.ui.core.CalendarType.Gregorian
            });
            return oFormat.format(oDate)
        },
        /**
         * To convert string to int
         * @param string
         */
        stringToInt : function(string){
            if(typeof string =="string"){
                return parseInt(string,10)
            }else{
                return string
            }
        },
        /**
         * To get Trend Icon
         * @param bTrend
         */
        KPIiconTrendSrc : function(bTrend){
            if(bTrend == "true"){
                return "sap-icon://up"
            }else if(bTrend == "false"){
                return "sap-icon://down"
            }else{
                return "sap-icon://media-play"
            }
        },
        /**
         * To get Trend color
         * @param bTrend
         */
        KPIiconTrendColor : function(bTrend){
            if(bTrend == "true"){
                return "#84bd00"
            }else  if(bTrend == "false"){
                return "#E4002B"
            }else{
                return "#97999b"
            }
        },

};


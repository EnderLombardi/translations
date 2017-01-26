"use strict";
jQuery.sap.declare("airbus.mes.stationHandover.util.ModelManager");

airbus.mes.stationHandover.util.ModelManager = {
	urlModel : undefined,
	i18nModel : undefined,

   
	init : function(core) {
	  
		var aModel = ["stationHandovershiftsModel"]
		airbus.mes.shell.ModelManager.createJsonModel(core,aModel);
       
		core.getModel("stationHandovershiftsModel").attachRequestCompleted(airbus.mes.stationHandover.util.ModelManager.onShiftsLoad);
		
		// Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.stationHandover.config.url_config");
	},
	
	/* *********************************************************************** *
	 *  Replace URL Parameters                                                 *
	 * *********************************************************************** */
	replaceURI : function(sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},
	
	loadShifts : function() {
		
	    var oViewModelshift = airbus.mes.stationHandover.oView.getModel("stationHandovershiftsModel");
	    var getUrlShifts = this.urlModel.getProperty("urlshifts");
	    var oData = airbus.mes.settings.ModelManager;
	    var reqResult = "";
	    getUrlShifts = airbus.mes.stationHandover.util.ModelManager.replaceURI(getUrlShifts, "$site", oData.site);
	    getUrlShifts = airbus.mes.stationHandover.util.ModelManager.replaceURI(getUrlShifts, "$station", oData.station);
	    getUrlShifts = airbus.mes.stationHandover.util.ModelManager.replaceURI(getUrlShifts, "$msn", oData.msn);

	    oViewModelshift.loadData(getUrlShifts, null, false);

	    reqResult = airbus.mes.shell.util.Formatter.getMiiMessageType(oViewModelshift.oData);

	    switch (reqResult) {
	    case "S":
	    	break;
	    case "E":
	        sap.m.MessageToast.show("Error : " + airbus.mes.shell.util.Formatter.getMiiTextFromData(oViewModelshift.oData));
	        break;
	    default:
	    }

	},
	   
	onShiftsLoad : function() {

		var GroupingBoxingManager = airbus.mes.stationHandover.util.GroupingBoxingManager;
		GroupingBoxingManager.parseShift();
    },
	  	  	    
	  
};

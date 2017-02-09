"use strict";
jQuery.sap.declare("airbus.mes.stationHandover.util.ModelManager");

airbus.mes.stationHandover.util.ModelManager = {
       urlModel : undefined,
       aSelected : {},
       queryParams : jQuery.sap.getUriParameters(),
       i18nModel : undefined,
       selectAll : false,
       Indice : 0,
       filter : {
    	   "search" : undefined,
    	   "type" :  new sap.ui.model.Filter({ 
			path :  "TYPE",
			test : function(oValue){
				
				if ( airbus.mes.stationHandover.util.ModelManager.filter.aType.indexOf(oValue) != -1 ){
					
					return true;
			} else {
				
				return false;
			}
		}}),
    	   "noTime" : new sap.ui.model.Filter("NO_TIME", "EQ", "false"),
    	   "inserted" : new sap.ui.model.Filter("INSERTED", "EQ", "false"),
    	   "station" : new sap.ui.model.Filter({ 
			path :  "ORIGIN_STATION",
			test : function(oValue){
				
				if ( airbus.mes.stationHandover.util.ModelManager.filter.aStation.indexOf(oValue) != -1 ){
					
					return true;
			} else {
				
				return false;
			}
		}}),
    	   "aType" : [0],
    	   "aStation" : [],
       },
       
       init : function(core) {
    	  
    	   var aModel = ["oswModel","msnModel","typeModel","groupModel"]
    	   airbus.mes.shell.ModelManager.createJsonModel(core,aModel);
           
           core.getModel("oswModel").attachRequestCompleted(airbus.mes.stationHandover.util.ModelManager.onTestLoad);
                
    	var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "sopra";
			break;
		default:
			dest = "airbus";
			break;
		}

		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleName : "airbus.mes.stationHandover.config.url_config",
			bundleLocale : dest
		});

		if (dest === "sopra") {

			var oModel = this.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;

			for ( var prop in oModel) {
				if (oModel[prop].slice(-5) != ".json") {
					oModel[prop] += "&j_user=" + Cookies.getJSON("login").user
							+ "&j_password=" + Cookies.getJSON("login").mdp;
				}
			}
		}
		
		this.loadTest();
		this.loadType();
		this.loadGroup();
	},
	
	/* *********************************************************************** *
	 *  Replace URL Parameters                                                 *
	 * *********************************************************************** */
	replaceURI : function(sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},
	
	 loadTest : function() {

	        var oViewModel = airbus.mes.stationHandover.oView.getModel("oswModel");
	        var getUrlShifts = this.urlModel.getProperty("urltest");
	        var oData = airbus.mes.settings.ModelManager;
	       
	        oViewModel.loadData(getUrlShifts, null, false);

	 },
	 

		 onTestLoad : function() {
		
		var oModelManager = airbus.mes.stationHandover.util.ModelManager;	 
		var oViewModel = airbus.mes.stationHandover.oView.getModel("oswModel");
		var aValueSelected = airbus.mes.stationHandover.util.ModelManager.aSelected;
		var sDateSaved = 0;
		
		
		 try {

		var aModel = oViewModel.oData.row;
		//Create tre of for manage selection of tree
		aModel.forEach(function(el, indice) {

			aValueSelected[el.WOID] = {
				"open" : undefined
			};

			//As a default, the physical station with the biggest planned start date/time should be selected.
        	if ( new Date(el.TaktStart) > new Date(sDateSaved) ) {
        		
        		sDateSaved = el.TaktStart;
        		oModelManager.Indice = indice;	            		
        	}
        	
			aModel[indice].row.forEach(function(al, indice1) {

				var sID = al.WOID + "##||##" + al.REFERENCE;

				aValueSelected[al.WOID][sID] = {
					"open" : undefined
				};

			})
		})
		
		oModelManager.filter.aStation.push(aModel[oModelManager.Indice].ORIGIN_STATION);
		

		 } catch(e) {
					
			 console.log("Error");
		 
		 }
	},
	    
	    onShiftsLoad : function() {

	        var GroupingBoxingManager = airbus.mes.stationHandover.util.GroupingBoxingManager;
	        GroupingBoxingManager.parseShift();
	    },
	  
	    loadType : function() {
	    	
	    	  var oViewModel = airbus.mes.stationHandover.oView.getModel("typeModel");
		      var getUrl = this.urlModel.getProperty("urltype");
		       
		      oViewModel.loadData(getUrl, null, false);
		      oViewModel.refresh();	    	    	

	    },
	    
	    loadGroup : function() {
	    	
	    	  var oViewModel = airbus.mes.stationHandover.oView.getModel("groupModel");
		      var getUrl = this.urlModel.getProperty("urlgroup");
		       
		      oViewModel.loadData(getUrl, null, false);
		      oViewModel.refresh();	    	    	

	    },
	    
	    getMsn : function() {
	    	
	    	var aMsn = airbus.mes.settings.oView.byId("selectMSN").getItems();
	        var aModel = [];
	    	var oViewModel = airbus.mes.stationHandover.oView.getModel("msnModel");
	    	
	    	aMsn.forEach(function(el) {

	    		aModel.push({
	    			"msn" : el.mProperties.text,
	    			"key" : el.mProperties.key,
	    		})
	    	})
	    	
	    	oViewModel.setData(aModel);
	    	oViewModel.refresh();	    	    	
	    }
};

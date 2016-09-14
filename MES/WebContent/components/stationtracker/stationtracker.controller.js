sap.ui.controller("airbus.mes.stationtracker.stationtracker", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf components.stationtracker.stationtracker
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf components.stationtracker.stationtracker
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf components.stationtracker.stationtracker
*/
	onAfterRendering: function() {

		airbus.mes.stationtracker.ModelManager.loadStationTracker();
		
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf components.stationtracker.stationtracker
*/
//	onExit: function() {
//
//	}
	 spaceInsecable : function(sText){
		 
	    var sTextF="";
	    var aText=sText.split(new RegExp("[ ]+", "g"));    // Récupère tous les mots dans un tableau : texte_decoup
	 
	    for (var i=0; i<aText.length; i++)
	    {
	        sTextF += aText[i] + "&nbsp;";  // le + " " NE FONCTIONNE PAS. IDEM AVEC String.fromCharCode(32) 
	      
	    }
	    
	    return sTextF;
	}
	
	
	
});
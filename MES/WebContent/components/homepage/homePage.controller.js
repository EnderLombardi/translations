sap.ui.controller("airbus.mes.homepage.homePage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf components.globalnav.globalNavigation
*/
	onInit: function() {
//		var oModel = new sap.ui.model.json.JSONModel();
//		sap.ui.getCore().setModel(oModel , "buttonUrl");
//		oModel.loadData("/MES/components/homepage/data/url.json",null,false);
	},
	onPress:function(oEvt){
//	    jQuery.sap.registerModulePath("airbus.mes.settings","/MES/components/settings");
//	    
	    if (airbus.mes.settings != undefined) {
	    	airbus.mes.settings.oView.destroy();
	    	airbus.mes.settings.oView = undefined
	    }

	       sap.ui.getCore().createComponent({
				name : "airbus.mes.settings", // root component folder is resources
				settings : {
					textButtonTo : "go to Station Tracker",
					buttonAction : "stationtracker"
				}	
			});	    
	    
	    nav.addPage(airbus.mes.settings.oView);
		nav.to(airbus.mes.settings.oView.getId());		
		
//	    if (airbus.mes.settings != undefined) {
//	    	nav.to(airbus.mes.settings.oView.getId());
//		}
//	    else {
//	    	
//	    	if( this.oView.getId() === "homePageView") {
//	    		
//		    	var sTextButtonTo = "go to Station Tracker";    		
//	    	}
//	    		    	
//	    	sap.ui.getCore().createComponent({
//			name : "airbus.mes.settings", // root component folder is resources
//			settings : {
//				textButtonTo : sTextButtonTo
//			}	    	
//		});
//
//		nav.addPage(airbus.mes.settings.oView);
//		nav.to(airbus.mes.settings.oView.getId()); }
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf components.globalnav.globalNavigation
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf components.globalnav.globalNavigation
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf components.globalnav.globalNavigation
*/
//	onExit: function() {
//
//	}

});
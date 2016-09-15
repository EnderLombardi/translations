sap.ui.controller("airbus.mes.shell.globalNavigation", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf components.globalnav.globalNavigation
*/
	
	
	
	onInit: function() {
		

	},
	onPress:function(oEvt){
	
	},
	onBack : function(){
		nav.addPage(oComp3.oView);
		nav.to(oComp3.oView.getId()); 
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
	naviguate : function(){
		
//		var oComp1 = sap.ui.getCore().createComponent({
//			name : "airbus.mes.globalnav", // root component folder is resources
//			});
//
//		// Create a Ui container 
//		var oCompCont1 = new sap.ui.core.ComponentContainer({
//			component : oComp1
//		});
//		// place this Ui Container with the Component inside into UI Area 
//		oCompCont1.placeAt("content");

		
	    jQuery.sap.registerModulePath("airbus.mes.settings","/MES/components/settings");
	    jQuery.sap.registerModulePath("airbus.mes.stationtracker","/MES/components/stationtracker");
		var oComp = sap.ui.getCore().createComponent({
			name : "airbus.mes.stationtracker", // root component folder is resources
		});

		// Create a Ui container 
//		var oCompCont = new sap.ui.core.ComponentContainer("CompCont", {
//			component : oComp
//		});
		
		
//		var navCon = this.getView().byId("navCon");
//		
//		
//		
		nav.addPage(oComp.oView);
//		nav.to(oComp.oView);
		nav.to(oComp.oView.getId()); 
		
	},
});
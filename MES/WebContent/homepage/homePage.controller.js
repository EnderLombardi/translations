	sap.ui.controller("airbus.mes.homepage.homePage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf components.globalnav.globalNavigation
*/
	onInit: function() {
		// Localization model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "homepage/i18n/i18n.properties",
			bundleLocale : sap.ui.getCore().getConfiguration().getLanguage()
		});
		this.getView().setModel(i18nModel, "i18n");
		
		
		// Buttons URL Model
		var oModel = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oModel , "buttonUrl");
		oModel.loadData("/MES/homepage/data/url.json",null,false);
	},
	onPress:function(oEvt)	{
		
		jQuery.sap.require("airbus.mes.settings.ModelManager");
	    
//		If default user settings are not yet loaded, need to load them
//		We display settings screen		
		if(airbus.mes.settings.ModelManager.station === undefined || airbus.mes.settings.ModelManager.station == ""){
			switch(oEvt.getSource().getCustomData()[1].getValue()){
				case "worktracker":
					this.getOwnerComponent().getRouter().navTo("settings",{
						query : {
							nav : "worktracker"
						}
					});
					break;
				case "StationTracker":
					this.getOwnerComponent().getRouter().navTo("settings",{
						query : {
							nav : "stationtracker"
						}
					});
					break;
				default:
					this.getOwnerComponent().getRouter().navTo("settings");
					break;
			}
		}
		

		//	If default user settings are already loaded, 
		//	We display directly station tracker screen
		else
			//Include Model Manager and Formatter and Functions
			switch(oEvt.getSource().getCustomData()[1].getValue()){
				case "worktracker":
					jQuery.sap.require("airbus.mes.worktracker.util.ModelManager");
					jQuery.sap.require("airbus.mes.worktracker.util.Functions");
					jQuery.sap.require("airbus.mes.worktracker.util.Formatter");
					break;
			}
		  	
		  	this.getOwnerComponent().getRouter().navTo(oEvt.getSource().getCustomData()[1].getValue());
	},
	
	getI18nValue : function(sKey) {
	    return this.getView().getModel("i18n").getProperty(sKey);
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
	onAfterRendering: function() {
//		Retrieve default user settings after the rendering of the Home Page 
		//airbus.mes.settings.oView.getController().getUserSettings();
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf components.globalnav.globalNavigation
*/
//	onExit: function() {
//
//	}

});
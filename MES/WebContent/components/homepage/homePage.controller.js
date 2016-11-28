/**
 * @fileOverview Define the homepage controller.
 * @version 1.0.0
 */
"use strict";
sap.ui.controller("airbus.mes.homepage.homePage", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf components.globalnav.globalNavigation
	 */
	onInit : function() {

	},
	
	/**
	 * Navigation management on the homepage
	 * @param {string} text : identifying the tile that has been clicked on 
	 */
	onPress : function(text) {

		//		If default user settings are not yet loaded, need to load them
		//		We display settings screen
		if (airbus.mes.settings.ModelManager.station === "") {

			switch (text) {
			case "StationTracker":
				airbus.mes.settings.GlobalFunction.navigateTo("Go to Station Tracker", "stationtracker");
				break;
			case "WorkerOrderTracker":
				airbus.mes.settings.GlobalFunction.navigateTo("Go to Work Tracker", "stationtracker");
				break;
			case "ResourcePool":
				airbus.mes.settings.GlobalFunction.navigateTo("Go to Team Assignment", "teamassignment");
				break;
			case "LineTracker":
				airbus.mes.settings.GlobalFunction.navigateTo("Go to Line Tracker", "linetracker");
				break;
			case "DisruptionAndon":
				airbus.mes.settings.GlobalFunction.navigateTo("Go to Disruption Tracker", "disruptiontracker");
				break;
			case "Polypoly":
				airbus.mes.settings.GlobalFunction.navigateTo("Go to Polypoly", "polypoly");
				break;
			case "TeamCompetencies" :
				airbus.mes.settings.GlobalFunction.navigateTo("Go to Team competencies & qualification", "disruptiontracker");
				break;
			default:
				break;
			}

		} else {
			// If default user settings are already loaded,
			// We display directly station tracker screen

			switch (text) {
			case "StationTracker":
				airbus.mes.shell.util.navFunctions.stationTracker();
				break;
				
			case "WorkerOrderTracker":
				airbus.mes.shell.util.navFunctions.stationTracker();
				break;
				
			case "ResourcePool":
				airbus.mes.shell.util.navFunctions.resourcePool();
				break;

			case "LineTracker":
				airbus.mes.shell.util.navFunctions.lineTracker();
				break;
			case "DisruptionAndon":
				airbus.mes.shell.util.navFunctions.disruptionTracker();
				break;
			case "TeamCompetencies" :
				airbus.mes.shell.util.navFunctions.polypoly();
				break;
			default:
				break;
			}
			

		}
	},

	/**
	 * Is triggered when clicking on a tile of the homepage view
	 * Launch the onPress function with the text corresponding to the Tile that has been clicked on
	 * @param {Event} oEvt : Tile press event
	 */
	onPressLine1 : function(oEvt) {

		var sPath = oEvt.getSource().oBindingContexts["1TileLineHome"].sPath;
		var text = airbus.mes.homepage.oView.getModel("1TileLineHome").getProperty(sPath).text;

		this.onPress(text);
	},

	/**
	 * Get translated text
	 * @param {string} sKey : the ID of the text to be fetched
	 * @returns {string} the text found
	 */
	getI18nValue : function(sKey) {
		return this.getView().getModel("i18n").getProperty(sKey);
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf components.globalnav.globalNavigation
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf components.globalnav.globalNavigation
	 */
	onAfterRendering : function() {
			
	},

/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf components.globalnav.globalNavigation
 */
// onExit: function() {
//
// }
});

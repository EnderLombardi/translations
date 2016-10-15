sap.ui.controller("airbus.mes.shell.globalNavigation", {

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
	onPress : function(oEvt) {

	},


	goToHome : function() {

		// Active settings button during leaving settings screen
		if (airbus.mes.shell != undefined) {
			airbus.mes.shell.oView.byId("settingsButton").setEnabled(true);
		};

		if (airbus.mes.homepage != undefined) {
			nav.to(airbus.mes.homepage.oView.getId());
		} else {
			sap.ui.getCore().createComponent({
				name : "airbus.mes.homepage", // root component folder is resources
			});

			nav.addPage(airbus.mes.homepage.oView);
			nav.to(airbus.mes.homepage.oView.getId());
		}
	},
//	Change language, reload the URL with the new language
	onChangeLanguage : function(oEvent) {
//		Retrieve language 		
		var sText = sap.ui.getCore().byId(oEvent.getSource().getSelectedItemId()).getText();

		
		switch (sText) {
		case "English":
			window.location.href = window.location.origin + window.location.pathname + "?sap-language=EN";
			break;
		case "Deutsch":
			window.location.href = window.location.href = window.location.origin + window.location.pathname + "?sap-language=DE";
			break;
		case "French":
			window.location.href = window.location.href = window.location.origin + window.location.pathname + "?sap-language=FR";
			break;
		case "Spanish":
			window.location.href = window.location.href = window.location.origin + window.location.pathname + "?sap-language=SP";
			break;
		default:
			window.location.href = window.location.href = window.location.origin + window.location.pathname + "?sap-language=EN";
			break;
		};
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
		this.getView().byId("user_id")
				.setModel(sap.ui.getCore().getModel("userDetailModel"),
						"userDetailModel");
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf components.globalnav.globalNavigation
	 */
	// onExit: function() {
	//
	// }
	navigate : function() {

		// Deactivate button on settings screen
		airbus.mes.shell.oView.byId("settingsButton").setEnabled(false);
		
		if (nav.getCurrentPage().getId() === "stationTrackerView") {
			var textButtonTo = "Go to Station Tracker";

		}if (nav.getCurrentPage().getId() === "workTrackerView" || nav.getCurrentPage().getId() === "workTrackerOpDetailView") {
			var textButtonTo = "Go to Work Tracker";
			airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "worktracker");

		} else if (nav.getCurrentPage().getId() === "homePageView") {
			var textButtonTo = "Go to Home Page";

		}

		airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "back");

	},

	checkCurrentView : function(){
		console.log("toto");
		return false;
	}
});

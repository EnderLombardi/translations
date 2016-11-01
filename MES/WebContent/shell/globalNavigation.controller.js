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
			this.setInformationVisibility(false);
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

//	onAfterRendering : function() {
//		
//	},


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

		this.setInformationVisibility(false);
		// Deactivate button on settings screen
		airbus.mes.shell.oView.byId("settingsButton").setEnabled(false);
		
		var textButtonTo = undefined;
		
		switch(nav.getCurrentPage().getId()){
		case "stationTrackerView":
			textButtonTo = "Go to Station Tracker";
			airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "back");
			break;

		case "homePageView":
			textButtonTo = "Go to Home Page";
			airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "back");
			break;
			
		case "resourcePool":
			textButtonTo = "Go to Team Assignment";
			airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "teamassignmentBack");
			break;
			
		case "disruptiontrackerView":
			textButtonTo = "Go to Disruption Tracker";
			airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "disruptiontrackerBack");
			break;
		}

	},

	renderViews : function() {

        if ( nav.getCurrentPage().getId() != "homePageView" ) {
            
            airbus.mes.shell.oView.byId("homeButton").setVisible(true);
            airbus.mes.shell.oView.byId("SelectLanguage").setVisible(false);
	           
	     } else  {
	           
	            airbus.mes.shell.oView.byId("homeButton").setVisible(false);
	            airbus.mes.shell.oView.byId("SelectLanguage").setVisible(true);
	    }

		switch(nav.getCurrentPage().getId()){
		
		case "stationTrackerView":
			this.setInformationVisibility(true);
			airbus.mes.stationtracker.oView.byId("stationtracker").setBusy(true);
			
			airbus.mes.stationtracker.ModelManager.loadShifts();
			airbus.mes.stationtracker.ModelManager.loadAffectation();
			airbus.mes.stationtracker.ShiftManager.init(airbus.mes.stationtracker.GroupingBoxingManager.shiftNoBreakHierarchy);
			airbus.mes.stationtracker.ModelManager.loadStationTracker("U");
			airbus.mes.stationtracker.ModelManager.loadStationTracker("O");
			airbus.mes.stationtracker.ModelManager.loadStationTracker("R");
			//TODO DEPLACE when the user change settings
			airbus.mes.stationtracker.ModelManager.loadProductionGroup();		
			airbus.mes.stationtracker.ModelManager.loadKPI();
			
			
			
			scheduler.xy.scroll_width = 20;
			//scheduler.xy.nav_height = 0;
			scheduler.updateView();
			
		case "disruptiontrackerView":
			airbus.mes.disruptiontracker.ModelManager.loadData();

		}
	},
	setInformationVisibility : function(bSet) {
		this.getView().byId("informationButton").setVisible(bSet);
		this.getView().byId("homeButton").setVisible(bSet);
		this.getView().byId("SelectLanguage").setVisible(!bSet);
	},
	onInformation : function(oEvent){
		airbus.mes.shell.oView.addStyleClass("viewOpacity");
		
		if ( airbus.mes.stationtracker.informationPopover === undefined ) {
			var oView = airbus.mes.stationtracker.oView;
			airbus.mes.stationtracker.informationPopover = sap.ui.xmlfragment("informationPopover","airbus.mes.shell.informationPopover", airbus.mes.shell.oView.getController());
			airbus.mes.stationtracker.informationPopover.addStyleClass("alignTextLeft");
			oView.addDependent(airbus.mes.stationtracker.informationPopover);
		}

		// delay because addDependent will do a async rerendering and the popover will immediately close without it
		var oButton = oEvent.getSource();
		jQuery.sap.delayedCall(0, this, function () {
			airbus.mes.stationtracker.informationPopover.openBy(oButton);	
		});			
	},
	onCloseInformation : function(){
		airbus.mes.shell.oView.removeStyleClass("viewOpacity");		
	}
	
});

sap.ui.controller("airbus.mes.linetracker.MainView", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf airbus.MainView
	 */
	onInit : function() {
		var oEventBus = sap.ui.getCore().getEventBus();
		oEventBus.subscribe("MainView", "onClickLine",
				this.lineSelected, this);
		oEventBus.subscribe("MainView", "onClickStation", this.stationSelected, this);
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf airbus.MainView
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf airbus.MainView
	 */
	 onAfterRendering: function() {
		 sap.ui.getCore().byId("idMainView--myShell").setContent(sap.ui.getCore().byId("idFactoryView"));
	 },
	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf airbus.MainView
	 */
	// onExit: function() {
	//
	// }
	worksetItemSelected : function(oEvent) {

		var itemKey = oEvent.mParameters.key;
		//PolypolyManager.globalContext.tabSelected = itemKey;
		var oShell = oEvent.oSource;

		if (itemKey === "factory") {
			oShell.setContent(sap.ui.getCore().byId("idFactoryView"));
			airbus.mes.linetracker.util.ModelManager.lockshellselected = false;
			oShell.setSelectedWorksetItem("idMainView--idFactory");
			airbus.mes.linetracker.util.ModelManager.loadModelFactoryModel();
			sap.ui.getCore().byId("idMainView--idProduction").setText(
					"Production Line ");
			sap.ui.getCore().byId("idMainView--idStation").setText(
					"Station Detail");
		}
		if (airbus.mes.linetracker.util.ModelManager.lockshellselected === true) {
			
			switch (itemKey) {
			case "prod_line":
				if(airbus.mes.linetracker.util.ModelManager.station_number=="5"){
					oEvent.bPreventDefault = true;
				}
				else{
					if (!airbus.mes.linetracker.util.ModelManager.ProductionView) {
						airbus.mes.linetracker.util.ModelManager.ProductionView = sap.ui.view({
							id : "idProductionView",
							viewName : "airbus.mes.linetracker.ProductionLineView",
							type : sap.ui.core.mvc.ViewType.XML,
							height : "98%",
							width: "99%"
						});
					}
					oShell.setSelectedWorksetItem("idMainView--idProduction");
					oShell.setContent(airbus.mes.linetracker.util.ModelManager.ProductionView);
					sap.ui.getCore().byId('idMainView--idProduction').setText(
							"PRODUCTION LINE " + airbus.mes.linetracker.util.ModelManager.line_number);
					/*sap.ui.getCore().byId("idMainView--idStation").setText(
							"Station Detail");*/
					airbus.mes.linetracker.util.ModelManager.loadModelProductionModel();
					airbus.mes.linetracker.util.ModelManager.loadProdLineColorPalette();
					//ModelManager.lockshellselected = false;
			}
				break;
			case "station":
				oShell.setContent(airbus.mes.linetracker.util.ModelManager.StationView);
				break;
			default:
				break;
			}
		} else {
			oEvent.bPreventDefault = true;

		}
		airbus.mes.linetracker.util.ModelManager.minimizeMsgBar();
	},

	lineSelected : function(oChannel, oEvent, line_number) {

		var oShell = this.getView().byId("myShell");
		oShell.removeContent(sap.ui.getCore().byId("idFactoryView"));
		if (!airbus.mes.linetracker.util.ModelManager.ProductionView) {
			airbus.mes.linetracker.util.ModelManager.ProductionView = sap.ui.view({
				id : "idProductionView",
				viewName : "airbus.mes.linetracker.ProductionLineView",
				type : sap.ui.core.mvc.ViewType.XML,
				height : "95%",
				width:"99%"
			});
		}
		oShell.setSelectedWorksetItem("idMainView--idProduction");
		oShell.setContent(airbus.mes.linetracker.util.ModelManager.ProductionView);
		sap.ui.getCore().byId('idMainView--idProduction').setText(
				"PRODUCTION LINE " + airbus.mes.linetracker.util.ModelManager.line_number);
		airbus.mes.linetracker.util.ModelManager.loadModelProductionModel();
		airbus.mes.linetracker.util.ModelManager.loadProdLineColorPalette();

	},

	// Event Bus methods
	stationSelected : function(oChannel, oEvent, oData) {
		var oShell = this.getView().byId("myShell");
		oShell.removeContent(sap.ui.getCore().byId("idFactoryView"));
		if (!airbus.mes.linetracker.util.ModelManager.StationView) {
			airbus.mes.linetracker.util.ModelManager.StationView = sap.ui.view({
				id : "idStationView",
				viewName : "airbus.mes.linetracker.StationView",
				type : sap.ui.core.mvc.ViewType.XML,
				height:"97%"
			});
		}

		oShell.setSelectedWorksetItem("idMainView--idStation");
		oShell.setContent(airbus.mes.linetracker.util.ModelManager.StationView);
		//to prevent opening line View if station 5 is selected
		if(airbus.mes.linetracker.util.ModelManager.station_number != "5")
		{
			sap.ui.getCore().byId('idMainView--idProduction').setText("PRODUCTION LINE " + airbus.mes.linetracker.util.ModelManager.line_number);
		}
		sap.ui.getCore().byId('idMainView--idStation').setText("Station "+airbus.mes.linetracker.util.ModelManager.station_number +" DETAIL");
		airbus.mes.linetracker.util.ModelManager.lockshellselected = true;
		airbus.mes.linetracker.util.ModelManager.loadModelStationModel();
		airbus.mes.linetracker.util.ModelManager.loadStationColorPalette();
//		ModelManager.loadOperationWorklistModel();
//		ModelManager.loadOrderWorklistModel();
//		ModelManager.loadModelUsersModel();
//		ModelManager.getBreakData();
		
	},

	
});

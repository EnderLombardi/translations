sap.ui.controller("airbus.mes.linetracker.StationView", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf airbus.StationView
	 */
	/*onInit : function() {		
	},*/
	lockStation : function(oEvent) {
		
		var oVBox = this.getView().byId("staionVbox2");
		var items = oVBox.getItems();
		for( var i = 0;i<3;i++){
			items[i].removeStyleClass("hboxselect")
		}
		
		if(oEvent){
			
			oEvent.getSource().addStyleClass("hboxselect");
			airbus.mes.linetracker.util.ModelManager.line_number = parseInt(oEvent.getSource().getBindingContext("newStationModel").getPath().split("")[1])+1;
			sap.ui.getCore().byId('idMainView--idProduction').setText("PRODUCTION LINE " + airbus.mes.linetracker.util.ModelManager.line_number);
			airbus.mes.linetracker.util.ModelManager.msn = oEvent.getSource().getContent().getItems()[0].getMsn();
			airbus.mes.linetracker.util.ModelManager.hand = oEvent.getSource().getContent().getItems()[0].getHand();
		}
		else{
			sap.ui.getCore().byId("idStationView--staionVbox2").getItems()[airbus.mes.linetracker.util.ModelManager.line_number-1].addStyleClass("hboxselect");
		}
	},
	onProductionSelect:function(oEvt){
		var oEventBus = sap.ui.getCore().getEventBus();
		if(oEvt.getSource().getText().substring(8,10).trim()!="5"){
		airbus.mes.linetracker.util.ModelManager.line_number = sap.ui.getCore().getModel("newStationModel").getProperty(oEvt.getSource().getBindingContext("newStationModel").getPath()).Line
		oEventBus.publish("MainView", "onClickLine",null);
		}
	},
	refreshStationDetail : function(ok){
		airbus.mes.linetracker.util.ModelManager.loadModelStationModel();
		airbus.mes.linetracker.util.ModelManager.refreshFactoryModel();
		airbus.mes.linetracker.util.ModelManager.loadModelProductionModel();

	},
	
	onStationPress : function(oEvt){
		var sLineNumber = parseInt(oEvt.getSource().getLineNumber());
		var sMsn = oEvt.getSource().getMsn();
		var sStationNumber = airbus.mes.linetracker.util.ModelManager.station_number;
		var sFactory = airbus.mes.linetracker.util.ModelManager.factory_name;
		var sSite = airbus.mes.linetracker.util.ModelManager.site;
		
		airbus.mes.linetracker.util.ModelManager.getTranscoStation(sSite, sFactory, sLineNumber, sStationNumber, sMsn);
	},
	/*onAfterRendering: function(){
	}*/

/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 * 
 * @memberOf airbus.StationView
 */
// onBeforeRendering: function() {
//
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf airbus.StationView
 */
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf airbus.StationView
 */
// onExit: function() {
//
// }
});
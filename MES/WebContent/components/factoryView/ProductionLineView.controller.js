"use strict";
sap.ui.controller("airbus.mes.factoryView.ProductionLineView", {

    /**
     * Called when a controller is instantiated and its View controls (if
     * available) are already created. Can be used to modify the View before it
     * is displayed, to bind event handlers and do other one-time
     * initialization.
     *
     * @memberOf airbus.ProductionLineView
     */
    onInit : function() {

        /* ModelManager.loadModelProductionModel(); */
        /* ModelManager.loadModelOperationModel(); */
        /*
         * var oVizFrame = this.getView().byId("vizFrame");
         * oVizFrame.setVizProperties({ title: { visible: false }, plotArea : {
         * colorPalette : ["green", "#BA000B"], } });
         */
    },
    onStationSelect : function(oEvent) {
        var oEventBus = sap.ui.getCore().getEventBus();
        var oStation = oEvent.getSource();
        // get Station name
        airbus.mes.factoryView.util.ModelManager.station_number = oStation.getHeading().substring(8);
        airbus.mes.factoryView.util.ModelManager.msn = oStation.getMsn();
        airbus.mes.factoryView.util.ModelManager.hand = oStation.getHand();
        // get Line for station clicked
//        ModelManager.line_number = oStation.getLineNumber().substring(1, 2);//gives line number

        oEventBus.publish("MainView", "onClickStation", null);

    },

    parseInteger : function(value) {

        return parseInt(value,10);
    },
     refreshProdLine : function(ok) {
            airbus.mes.factoryView.util.ModelManager.loadModelProductionModel();
            if(ok === true){
                airbus.mes.factoryView.util.ModelManager.loadModelFactoryModel();
/*why put in a condition commented for now*/
//ModelManager.loadModelProductionModel();
            }

        //    this.selectedLineDesc("LINE" + ModelManager.line_number);
        //    this.processing("LINE" + ModelManager.line_number);
        },

/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 *
 * @memberOf airbus.ProductionLineView
 */
// onBeforeRendering: function() {
//
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 *
 * @memberOf airbus.ProductionLineView
 */
// onAfterRendering: function() {
//
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 *
 * @memberOf airbus.ProductionLineView
 */
// onExit: function() {
//
// }
});

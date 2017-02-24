"use strict";
//require the base first
jQuery.sap.require("airbus.mes.disruptions.createDisruptions");

airbus.mes.disruptions.createDisruptions.extend("airbus.mes.createdisruption.CreateDisruption", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf airbus.mes.components.disruptions.CreateDisruption
	 */
	/*
	 * onInit : function() { // this.loadDisruptionCustomData();
	 * this.addParent(this.selectTree, undefined); },
	 */
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf airbus.mes.components.disruptions.CreateDisruption
	 */
	// onBeforeRendering: function() {
	//
	// },
	onInit : function() {
		this.getView().byId("timeLost").setPlaceholder(airbus.mes.disruptions.Formatter.getConfigTimeFullUnit());
	},

});

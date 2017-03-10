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
	


	/***************************************************************************
	 * Load Category and custom Data
	 * @param {string} sMode tells it is edit disruption page or new disruption page
	 */
	loadData : function(sMode, oData) {

		airbus.mes.disruptions.ModelManager.createViewMode = sMode;
		
		var oModel = sap.ui.getCore().getModel("DisruptionDetailModel");
		oModel.setData(oData);
		oModel.refresh();
		

		// Get View
		var oView = this.getView();
		airbus.mes.disruptions.ModelManager.sCurrentViewId = oView.sId;

		// Set Busy's
		oView.setBusyIndicatorDelay(0);
		oView.setBusy(true);
		
		var ModelManager = airbus.mes.disruptions.ModelManager;
		ModelManager.createViewMode = sMode;

		// Reset All fields
		this.resetAllFields();
		
		this.loadDisruptionCategory();
		ModelManager.loadMaterialList();
		ModelManager.loadJigtoolList();

		if (sMode == "Create") {
            this.createDisruptionSettings();
            
		} else if (sMode == "Edit") {
			this.loadRsnResponsibleGrp(oData.messageType);
			this.editPreSettings();

		}

	},
	
	
	onExit : function(oEvt) {
		sap.ui.getCore().byId("idAttachmentDialog").close()
	},
	
	onAttachPress : function(){
		sap.ui.getCore().byId("idAttachmentDialog").close()
	},

});

"use strict";

sap.ui.controller("airbus.mes.linetracker.StationDetail", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf coustomtable.StationDetail
*/
	onInit: function() {
		

	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf coustomtable.StationDetail
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf coustomtable.StationDetail
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf coustomtable.StationDetail
*/
//	onExit: function() {
//
//	}
	
	onAddStation : function() {
		var stationRow = {
				"station" : "Station 10",
				"planned" : 20,
				"confirmed" : 30,
				"trend" : "down",
				"trendColor" : "Red",
				"date"	: "02 JUL 2016 16:00",
				"cycleTime" : "3.5",
				"workContent" : "5"
			};
		
		this.getView().getModel("stationDataModel").getProperty("/list").push(stationRow);
		
		this.getView().getModel("stationDataModel").refresh();
	},
	
	onSaveVariant : function() {

		if (!this.oSaveDialog) {
			// create dialog via fragment factory
			this.oSaveDialog = sap.ui.xmlfragment("airbus.mes.linetracker.fragment_save", this);
			
			this.getView().addDependent(
					this.oSaveDialog);
			
		}
	
		this.oSaveDialog.open();

	},
		
	onCreateModifyLine : function() {

		if (!this.oAddLineDialog) {
			// create dialog via fragment factory
			this.oAddLineDialog = sap.ui.xmlfragment("airbus.mes.linetracker.edit_line", this);
			
			this.getView().addDependent(
					this.oAddLineDialog);
			
		}
	
		this.oAddLineDialog.open();

	},
	
	openStationPopover : function(oEvent) {
		
		if (!this.oStationPopover) {
			// create dialog via fragment factory
			this.oStationPopover = sap.ui.xmlfragment("airbus.mes.linetracker.StationPopover", this);
			
			this.getView().addDependent(
					this.oStationPopover);
			
		}
	
		this.oStationPopover.openBy(oEvent.getSource());
	},
	
	onEditStation : function(oEvent) {
		
		if (!this.oEditStation) {
			// create dialog via fragment factory
			this.oEditStation = sap.ui.xmlfragment("airbus.mes.linetracker.Edit_station", this);
			
			this.getView().addDependent(
					this.oEditStation);
			
		}
	
		this.oEditStation.open();
	},
	
	onCancel : function(evt) {
		
		var fragmentId = evt.getSource().getParent().getId();
		
		switch(fragmentId) {
			
			case "createModifyLine" : this.oAddLineDialog.close();
										break;
										
			case "saveVariant" : this.oSaveDialog.close();
									break;
									
			case "editStation" : this.oEditStation.close();
			break;
									
			default : return;
		}
		
	},
	
	handleValueHelp : function (oEvent) {
		this.inputId = oEvent.getSource().getId();
		
		// create value help dialog
		if (!this._valueHelpDialog) {
			this._valueHelpDialog = sap.ui.xmlfragment(
				"airbus.mes.linetracker.Dialog", this);
			this.getView().addDependent(this._valueHelpDialog);
		}

		// open value help dialog filtered by the input value
		this._valueHelpDialog.open();
	},

	_handleValueHelpSearch : function (evt) {
		var sValue = evt.getParameter("value");
		var oFilter = new Filter(
			"site",
			sap.ui.model.FilterOperator.Contains, sValue
		);
		evt.getSource().getBinding("items").filter([oFilter]);
	},

	_handleValueHelpClose : function (evt) {
		var oSelectedItem = evt.getParameter("selectedItem");
		if (oSelectedItem) {
			var productInput = this.getView().byId(this.inputId);
			productInput.setValue(oSelectedItem.getTitle());
		}
		evt.getSource().getBinding("items").filter([]);
	},

	displayKPIBelow : function(evt) {
		var state = sap.ui.getCore().byId("idStationDetail1--idSlideControl").getState();
		if (state == true) {
			sap.ui.getCore().byId("idStationDetail1--idSlideControl").closeNavigation();
			
		} else
			sap.ui.getCore().byId("idStationDetail1--idSlideControl").openNavigation();

	},
	
	hideKPISlide : function(evt) {
		var state = sap.ui.getCore().byId("idStationDetail1--idSlideControl").getState();
		if (state == true) {
			sap.ui.getCore().byId("idStationDetail1--idSlideControl").closeNavigation();
			
		}
	},
	
	handlePopoverPress: function (oEvent) {
	       if (!this.oPopover) {
	              this.oPopover = sap.ui.xmlfragment("airbus.mes.linetracker.PhStationPopover", this);
	              this.getView().addDependent(this.oPopover);
	              
	       }

	       // delay because addDependent will do a async rerendering and the
	       // actionSheet will immediately close without it.
	       var oButton = oEvent.getSource();
	       jQuery.sap.delayedCall(0, this, function () {
	              this.oPopover.openBy(oButton);
	       });
     }


});
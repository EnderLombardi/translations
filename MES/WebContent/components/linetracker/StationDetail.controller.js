jQuery.sap.registerModulePath("d3", "./lib/d3");
jQuery.sap.require("d3.d3_3_5_17_min");
jQuery.sap.require("customtable.KPICharts.util.Formatter");
sap.ui.controller("customtable.customtable.StationDetail", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf coustomtable.StationDetail
*/
	onInit: function() {
		var oViewModel=  new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oViewModel,"dataModel");
		sap.ui.getCore().getModel("dataModel").loadData("local/data.json",null,false);
		
		var oModel = new sap.ui.model.resource.ResourceModel({bundleName:"customtable.i18n.i18n"});
		sap.ui.getCore().setModel(oModel, "i18n");
		
		// KPICharts models
		var i18nModel = new sap.ui.model.resource.ResourceModel(
				{
					bundleUrl : "KPICharts/i18n/i18n.properties",
				});
		this.getView()
				.setModel(i18nModel, "kpiI18n");

		//Takt Efficiency
		sap.ui.getCore().setModel(
				new sap.ui.model.json.JSONModel(),
				"KPItaktEfficiency");
		sap.ui
				.getCore()
				.getModel("KPItaktEfficiency")
				.loadData(
						"KPICharts/data/KPItaktEfficiencyModel.json",
						null, false);
		//Takt Adherence
		sap.ui.getCore().setModel(
				new sap.ui.model.json.JSONModel(),
				"KPItaktAdherence");
		sap.ui
				.getCore()
				.getModel("KPItaktAdherence")
				.loadData(
						"KPICharts/data/KPItaktAdherenceModel.json",
						null, false);
		//Shift Staffing
		sap.ui.getCore().setModel(
				new sap.ui.model.json.JSONModel(),
				"KPIshiftStaffing");
		sap.ui
				.getCore()
				.getModel("KPIshiftStaffing")
				.loadData(
						"KPICharts/data/KPIshiftStaffingModel.json",
						null, false);
		// Extrawork
		sap.ui.getCore().setModel(
				new sap.ui.model.json.JSONModel(),
				"KPIextraWork");
		sap.ui
				.getCore()
				.getModel("KPIextraWork")
				.loadData(
						"KPICharts/data/KPIextraWorkModel.json",
						null, false);
		//KPI Model
		sap.ui.getCore().setModel(
				new sap.ui.model.json.JSONModel(),
				"KPI");
		sap.ui
				.getCore()
				.getModel("KPI")
				.loadData(
						"KPICharts/data/KPIModel.json",
						null, false);
		
		//KPI Chart Model
        sap.ui.getCore().setModel(
                      new sap.ui.model.json.JSONModel(),
                      "KPIchartTaktAdherence");
        sap.ui
                      .getCore()
                      .getModel("KPIchartTaktAdherence")
                      .loadData(
                                    "KPICharts/data/KPIchartTaktAdherenceModel.json",
                                    null, false);
        
        //KPI Chart Model
        sap.ui.getCore().setModel(
                      new sap.ui.model.json.JSONModel(),
                      "KPIdisruption");
        sap.ui
                      .getCore()
                      .getModel("KPIdisruption")
                      .loadData("KPICharts/data/KPIdisruptionModel.json",
                                    null, false);
        
      //KPI Resolution Efficiency Model
		sap.ui.getCore().setModel(
				new sap.ui.model.json.JSONModel(),
				"KPIresolutionEfficiency");
		sap.ui
				.getCore()
				.getModel("KPIresolutionEfficiency")
				.loadData(
						"KPICharts/data/KPIresolutionEfficiencyModel.json",
						null, false);

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
		
		this.getView().getModel("dataModel").getProperty("/list").push(stationRow);
		
		this.getView().getModel("dataModel").refresh();
	},
	
	onSaveVariant : function() {

		if (!this.oSaveDialog) {
			// create dialog via fragment factory
			this.oSaveDialog = sap.ui.xmlfragment("customtable.customtable.fragment_save", this);
			
			this.getView().addDependent(
					this.oSaveDialog);
			
		}
	
		this.oSaveDialog.open();

	},
		
	onCreateModifyLine : function() {

		if (!this.oAddLineDialog) {
			// create dialog via fragment factory
			this.oAddLineDialog = sap.ui.xmlfragment("customtable.customtable.edit_line", this);
			
			this.getView().addDependent(
					this.oAddLineDialog);
			
		}
	
		this.oAddLineDialog.open();

	},
	
	openStationPopover : function(oEvent) {
		
		if (!this.oStationPopover) {
			// create dialog via fragment factory
			this.oStationPopover = sap.ui.xmlfragment("customtable.customtable.StationPopover", this);
			
			this.getView().addDependent(
					this.oStationPopover);
			
		}
	
		this.oStationPopover.openBy(oEvent.getSource());
	},
	
	onEditStation : function(oEvent) {
		
		if (!this.oEditStation) {
			// create dialog via fragment factory
			this.oEditStation = sap.ui.xmlfragment("customtable.customtable.Edit_station", this);
			
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
				"customtable.customtable.Dialog", this);
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
		state = sap.ui.getCore()
		.byId("idStationDetail1--idSlideControl").getState();
		if (state == true) {
			sap.ui.getCore()
			.byId("idStationDetail1--idSlideControl")
			.closeNavigation();
			
		} else
			sap.ui.getCore()
			.byId("idStationDetail1--idSlideControl")
			.openNavigation();

	},
	
	hideKPISlide : function(evt) {
		state = sap.ui.getCore()
		.byId("idStationDetail1--idSlideControl").getState();
		if (state == true) {
			sap.ui.getCore()
			.byId("idStationDetail1--idSlideControl")
			.closeNavigation();
			
		}
	},
	
	handlePopoverPress: function (oEvent) {
	       if (! this.oPopover) {
	              this.oPopover = sap.ui.xmlfragment("customtable.customtable.PhStationPopover", this);
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
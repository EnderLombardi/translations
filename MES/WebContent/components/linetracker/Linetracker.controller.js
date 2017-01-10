"use strict";
jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.controller("airbus.mes.linetracker.Linetracker", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf classLineTrackerTable.Linetracker
	 */
	onInit : function() {

		// if the page is not busy
		if (airbus.mes.shell.oView.byId('refreshTime').setBusyIndicatorDelay(0)) {
			airbus.mes.shell.oView.byId('refreshTime').setEnabled(true);
		}

		// Date in Header
		var oDate = new Date();
		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
			pattern : "dd MMMM yyyy"
		}); // Returns a DateFormat instance for date
		this.getView().byId("linetracker_dateLabel").setText(oDateFormat.format(oDate));

		// Time in Header
		var oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
			pattern : "HH:mm"
		}); // Returns a DateFormat instance for time
		this.getView().byId("linetracker_timeLabel").setText(oTimeFormat.format(oDate));

		// Load User Settings Model to get Site
		var oModel = airbus.mes.settings.ModelManager.core.getModel("userSettingModel").getData();
		airbus.mes.linetracker.util.ModelManager.site = oModel.Rowsets.Rowset[0].Row[0].site;
		// To add hierarchy selectTree
		this.addParent(this.selectTree, undefined);

	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf classLineTrackerTable.Linetracker
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf classLineTrackerTable.Linetracker
	 */
	onAfterRendering : function() {
		// sap.ui.getCore().byId("idLinetracker1--linetrackerTable").attachBrowserEvent("onscroll",function(){
		// sap.ui.getCore().byId("idLinetracker1--linetrackerTable").rerender();
		// })
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf classLineTrackerTable.Linetracker
	 */
	// onExit: function() {
	//
	// }
	/**
	 * To hide Header KPI
	 */
	hideKPI : function() {

		var oPanel = airbus.mes.linetracker.oView.byId("linetrackerHeaderKPI");

		var bIsExpanded = oPanel.getExpanded();

		if (bIsExpanded) {
			airbus.mes.linetracker.oView.byId("hideKPI").setIcon("sap-icon://show");
			airbus.mes.linetracker.oView.byId("hideKPI").setText(airbus.mes.linetracker.oView.getController().getI18nValue("ShowKPIS"));
		} else {
			airbus.mes.linetracker.oView.byId("hideKPI").setIcon("sap-icon://hide");
			airbus.mes.linetracker.oView.byId("hideKPI").setText(airbus.mes.linetracker.oView.getController().getI18nValue("HideKPIS"));
		}

		oPanel.setExpanded(!bIsExpanded);

	},

	getI18nValue : function(sKey) {
		return this.getView().getModel("i18n").getProperty(sKey);
	},
	/**
	 * Called when +Station button clicked in line tracker To Add Station in
	 * Line Tracker Station List
	 * 
	 */
	/*
	 * onAddStation : function() { var stationRow = { "station" : "Station 10",
	 * "planned" : 20, "confirmed" : 30, "trend" : "down", "trendColor" : "Red",
	 * "date" : "02 JUL 2016 16:00", "cycleTime" : "3.5", "workContent" : "5" };
	 * 
	 * this.getView().getModel("stationDataModel").getProperty("/list").push(stationRow);
	 * 
	 * this.getView().getModel("stationDataModel").refresh(); },
	 */

	/**
	 * BR: SD-PPC-LT-100 Called when save button is clicked to save(Global) the
	 * modified variant line
	 */
	onSaveVariant : function() {

		if (!this.oSaveDialog) {
			// create dialog via fragment factory
			this.oSaveDialog = sap.ui.xmlfragment("airbus.mes.linetracker.fragments.saveStation", this);

			this.getView().addDependent(this.oSaveDialog);

		}

		this.oSaveDialog.open();

	},

	/**
	 * To create new line or to modify name or description of existing(selected)
	 * line
	 * 
	 */
	onCreateModifyLine : function() {

		if (!this.oAddLineDialog) {
			// create dialog via fragment factory
			this.oAddLineDialog = sap.ui.xmlfragment("airbus.mes.linetracker.fragments.editLine", this);

			this.getView().addDependent(this.oAddLineDialog);

		}

		this.oAddLineDialog.open();
		var lineVariantName = this.getView().byId("selectLine").getValue();
		// var variantDes = this.getView().byId("selectLine").getValue();
		sap.ui.getCore().byId("variantName").setValue(lineVariantName);
		// sap.ui.getCore().byId("variantDescription").setValue(variantDes);
	},

	/**
	 * Called when detailed button clicked
	 * 
	 * @param oEvent
	 */

	openStationPopover : function(oEvent) {

		if (!this.oStationPopover) {
			// create dialog via fragment factory
			this.oStationPopover = sap.ui.xmlfragment("airbus.mes.linetracker.fragments.StationPopover", this);

			this.getView().addDependent(this.oStationPopover);

		}

		this.oStationPopover.openBy(oEvent.getSource());
	},

	/**
	 * BR NO: SD-PPC-LT-090 Add New Station/Edit Station in Line Tracker table
	 * display
	 * 
	 * @param oEvent
	 */
	onEditStation : function(oEvent) {

		if (!this.oEditStation) {
			// create dialog via fragment factory

			this.oEditStation = sap.ui.xmlfragment("airbus.mes.linetracker.fragments.editStation", this);

			this.getView().addDependent(this.oEditStation);

		}

		this.filterField(this.selectTree);
		this.oEditStation.open();
		var pressedBtnId = oEvent.getSource().sId;
		if (pressedBtnId == "idLinetracker1--linetrackerAddStation") {

			sap.ui.getCore().byId("editStation").setTitle(this.oView.getModel("i18n").getProperty("addStation"));
			sap.ui.getCore().byId("editStation").setIcon("sap-icon://add");

			// get last record of station table
			var length = sap.ui.getCore().getModel("stationDataModel").oData.length;

			sap.ui.getCore().byId("selectProgram").setValue(sap.ui.getCore().getModel('stationDataModel').oData[length - 1].program);
			sap.ui.getCore().byId("selectLine").setValue(sap.ui.getCore().getModel('stationDataModel').oData[length - 1].line);
			sap.ui.getCore().byId("selectStation").setValue(sap.ui.getCore().getModel('stationDataModel').oData[length - 1].station);

		} else {
			sap.ui.getCore().byId("editStation").setTitle(this.oView.getModel("i18n").getProperty('editStation'));
			sap.ui.getCore().byId("editStation").setIcon("sap-icon://edit");

			// get selected station details
			var currentStation = sap.ui.getCore().getModel("stationDataModel").getProperty(
				oEvent.oSource.getParent().getParent()._oOpenBy.getParent().getItems()[0].getBindingContext("stationDataModel").getPath()).station;

			var currentProgram = sap.ui.getCore().getModel("stationDataModel").getProperty(
				oEvent.oSource.getParent().getParent()._oOpenBy.getParent().getItems()[0].getBindingContext("stationDataModel").getPath()).program;

			var currentLine = sap.ui.getCore().getModel("stationDataModel").getProperty(
				oEvent.oSource.getParent().getParent()._oOpenBy.getParent().getItems()[0].getBindingContext("stationDataModel").getPath()).line;

			sap.ui.getCore().byId("selectProgram").setValue(currentProgram);
			sap.ui.getCore().byId("selectLine").setValue(currentLine);
			sap.ui.getCore().byId("selectStation").setValue(currentStation);

		}

	},

	/**
	 * Called when cancel button clicked on editStation/editLine fragments
	 * 
	 * @param evt
	 */

	onCancel : function(evt) {

		var fragmentId = evt.getSource().getParent().getId();

		switch (fragmentId) {

		case "createModifyLine":
			this.oAddLineDialog.close();
			break;

		case "saveVariant":
			this.oSaveDialog.close();
			break;

		case "editStation":
			this.oEditStation.close();
			break;

		case "deleteStation":
			this.oDeleteDialog.close();
			break;

		default:
			return;
		}

	},

	/**
	 * Called when variant value help request
	 * 
	 * @param oEvent
	 */
	handleValueHelp : function(oEvent) {
		this.inputId = oEvent.getSource().getId();

		// create value help dialog
		if (!this._valueHelpDialog) {
			this._valueHelpDialog = sap.ui.xmlfragment("airbus.mes.linetracker.fragments.LineVariantDialog", this);
			this.getView().addDependent(this._valueHelpDialog);
		}

		// open value help dialog filtered by the input value
		this._valueHelpDialog.open();
	},

	/**
	 * Called when search on variant name in value help popup
	 * 
	 * @param evt
	 *            used to get search field value to the search filter
	 * @returns matched variant name
	 */
	handleValueHelpSearch : function(evt) {
		var sValue = evt.getParameter("value");
		var oFilter = new sap.ui.model.Filter("variantName", sap.ui.model.FilterOperator.Contains, sValue);
		evt.getSource().getBinding("items").filter([ oFilter ]);
	},

	/**
	 * fill select line field with selected value help variant name
	 * 
	 * @param oEvt
	 *            used to get selected
	 * @returns Selected Line Variant name for the Select Line field
	 */
	handleSelectedLineValueHelp : function(oEvt) {
		var oSelectedItem = oEvt.getParameter("selectedItem");
		if (oSelectedItem) {
			var selectLine = this.getView().byId("selectLine");
			selectLine.setValue(oSelectedItem.getTitle());
		}
	},

	/**
	 * To display Station KPI Header slide
	 * @Param {Object}:evt
	 */
	displayStationKPIHeader : function(evt) {
		var state = sap.ui.getCore().byId("idLinetracker1--idSlideControl").getState();
		if (state == true) {
			sap.ui.getCore().byId("idLinetracker1--idSlideControl").closeNavigation();

		} else
			sap.ui.getCore().byId("idLinetracker1--idSlideControl").openNavigation();

		this.oPopover.close();

	},

	hideKPISlide : function(evt) {
		var state = sap.ui.getCore().byId("idLinetracker1--idSlideControl").getState();
		if (state == true) {
			sap.ui.getCore().byId("idLinetracker1--idSlideControl").closeNavigation();

		}
	},

	/**
	 * To Display Popup of Station KPI header, Station Tracker, Disruption ANDON
	 * 
	 * @param oEvent
	 */

	handlePopoverPress : function(oEvent) {
		if (!this.oPopover) {
			this.oPopover = sap.ui.xmlfragment("airbus.mes.linetracker.fragments.PhStationPopover", this);
			this.getView().addDependent(this.oPopover);

		}

		// delay because addDependent will do a async rerendering and the
		// actionSheet will immediately close without it.
		var oButton = oEvent.getSource();
		jQuery.sap.delayedCall(0, this, function() {
			this.oPopover.openBy(oButton);
		});
	},

	/**
	 * To Delete the Station from Line
	 * 
	 * @param oEvent
	 */

	onDeleteStation : function(oEvent) {
		if (!this.oDeleteDialog) {
			this.oDeleteDialog = sap.ui.xmlfragment("airbus.mes.linetracker.fragments.deleteStation", this);
			this.getView().addDependent(this.oDeleteDialog);
		}
		this.oDeleteDialog.open();
	},

	/**
	 * To navigate to Station Tracker from Line Trakcer
	 */
	gotoStationTracker : function() {
		airbus.mes.shell.util.navFunctions.stationTracker();
	},

	/**
	 * To navigate to Disruption & Andon Tracker from Line Tracker
	 */
	gotoDisruptionAndonTracker : function() {
		airbus.mes.shell.util.navFunctions.disruptionTracker();
	},

	// Tree to define the hierarchy for Program, Line and Station select boxes
	selectTree : {
		id : "selectProgram",
		type : "select",
		path : "program",
		attr : "program",
		childs : [ {
			id : "selectLine",
			type : "select",
			path : "line",
			attr : "line",
			childs : [ {
				id : "selectStation",
				type : "select",
				path : "station",
				attr : "station",
				childs : []
			}, {
				id : "Return",
				type : "Return",
				childs : []
			} ]
		} ]
	},

	// For hierachy of select
	addParent : function(oTree, oParent) {
		var that = this;
		oTree.parent = oParent;
		oTree.childs.forEach(function(oElement) {
			that.addParent(oElement, oTree);
		});
	},

	findElement : function(oTree, sId) {
		if (oTree.id == sId) {
			return oTree;
		} else {
			var oElement;
			for (var i = 0; i < oTree.childs.length; i++) {
				oElement = this.findElement(oTree.childs[i], sId);
				if (oElement) {
					return oElement;
				}
			}
			return "";
		}
	},

     // clear other select boxes after changing
	// the item of one select *****
	clearField : function(oTree) {
		var that = this;
		if (oTree.type == "select") {
			sap.ui.getCore().byId(oTree.id).setSelectedKey();
		}
		oTree.childs.forEach(that.clearField.bind(that));
	},

	// Called when select Program in edit/modify station popup
	onProgramSelect : function() {
		var that = this;
		var sProgram = "selectProgram";
		this.findElement(this.selectTree, sProgram).childs.forEach(function(oElement) {
			that.clearField(oElement);
			that.filterField(oElement);
		});

		this.setEnabledSelect(true, true, false, false);

	},

	// Filter tree

	filterField : function(oTree) {
		if (oTree.type == "Return") {
			return;
		}
		var that = this;
		var aFilters = [];
		var oElement = oTree.parent;
		while (oElement) {
			
			var val = sap.ui.getCore().byId(oElement.id).getSelectedKey();

			var oFilter = new sap.ui.model.Filter(oElement.path, "EQ", val);
			aFilters.push(oFilter);

			oElement = oElement.parent;
		}
		;
		var temp = [];
		var duplicatesFilter = new sap.ui.model.Filter({
			path : oTree.path,
			test : function(value) {
				if (temp.indexOf(value) == -1) {
					temp.push(value)
					return true;
				} else {
					return false;
				}
			}
		});
		aFilters.push(duplicatesFilter);

		if (sap.ui.getCore().byId(oTree.id).getBinding("items")) {
			sap.ui.getCore().byId(oTree.id).getBinding("items").filter(new sap.ui.model.Filter(aFilters, true));
		}
		oTree.childs.forEach(function(oElement) {
			that.filterField(oElement);
		});
	},
	// Set the Selected value
	setEnabledSelect : function(fProgram, fLine, fStation, fMsn) {
		sap.ui.getCore().byId("selectLine").setEnabled(fLine);
		sap.ui.getCore().byId("selectStation").setEnabled(fStation);
	},

	/**
	 * Called when selecting Program, Line and Station from select in Add/Modify
	 * Station Popup
	 */

	onSelectionChange : function(oEvt) {
		var that = this;
		var id
		if (oEvt.getSource()) {

			id = oEvt.getSource().getId().split("--")[0];

		} else {
			// Used when this function is call to set usersetting data.
			id = oEvt;
		}

		this.findElement(this.selectTree, id).childs.forEach(function(oElement) {
			that.clearField(oElement);
			that.filterField(oElement);
		});

		switch (id) {
		case "selectProgram":
			this.setEnabledSelect(true, true, true, false);
			break;
		case "selectLine":
			this.setEnabledSelect(true, true, true, false);
			break;
		case "selectStation":

			if (sap.ui.getCore().getModel("plantModel").getProperty("/Rowsets/Rowset/0/Row") != undefined) {
				var oModel = sap.ui.getCore().getModel("plantModel").getProperty("/Rowsets/Rowset/0/Row");
				// Find automatically the msn with the flag Current MSN
				// different of "---"
				oModel = oModel.filter(function(el) {
					return el.program === sap.ui.getCore().byId("selectProgram").getSelectedKey()
						&& el.line === sap.ui.getCore().byId("selectLine").getSelectedKey()
						&& el.station === sap.ui.getCore().byId("selectStation").getSelectedKey()
					// && el.Current_MSN === "true"
				});
			}
			this.setEnabledSelect(true, true, true, true);
			break;
		default:
			this.setEnabledSelect(true, true, true, true);

		}
	},

});
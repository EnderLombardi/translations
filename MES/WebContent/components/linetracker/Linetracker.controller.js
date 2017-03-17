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

	},
	
    onBackPress : function(){
        nav.back();
    },

	/**
	 * BR:SD-PPC-LT-270
	 * @param sKey
	 * @returns
	 */
	getI18nValue : function(sKey) {
		return this.getView().getModel("i18n").getProperty(sKey);
	},

	/**
	 * BR:SD-PPC-LT-260
	 * Called when Station Box is clicked 
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
	 * Called when cancel button clicked on editStation/editLine/deleteStation/saveVariant/undoAction fragments
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
		case "undoAction":
			this.oUndoAction.close();
			break;
		default:
			return;
		}

	},

	/**
	 * BR:SD-PPC-LT-100
	 * Called when variant value help request
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
		//clear filters
		sap.ui.getCore().byId("valueHelpDialogSelectLine").getBinding("items").filter();
	},

	/**
	 * BR:SD-PPC-LT-100
	 * Called when search on variant name in value help popup
	 * @param evt  used to get search field value to the search filter
	 * @returns matched variant name
	 */
	handleValueHelpSearch : function(evt) {
		var sValue = evt.getParameter("value");
		var oFilter = new sap.ui.model.Filter("variantName", sap.ui.model.FilterOperator.Contains, sValue);
		evt.getSource().getBinding("items").filter([ oFilter ]);
	},

	/**
	 * BR:SD-PPC-LT-100
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
			airbus.mes.linetracker.util.ModelManager.customLineBO = oSelectedItem.getCustomData()[0].getKey();
			airbus.mes.linetracker.util.ModelManager.updateLineInUserSettings();
			airbus.mes.linetracker.util.ModelManager.loadStationDataModel();
		}
	},

	/**
	 * BR:SD-PPC-LT-260
	 * To Display Popup of Station KPI header, Station Tracker, Disruption ANDON
	 * 
	 * @param oEvent
	 */

	handlePopoverPress : function(oEvent) {
		if (!this.oPopover) {
			this.oPopover = sap.ui.xmlfragment("airbus.mes.linetracker.fragments.PhStationPopover", this);
			this.getView().addDependent(this.oPopover);
		}
		this.oPopover.setTitle(oEvent.oSource.getStationName());
		var msn = oEvent.oSource.getMsn();
		sap.ui.getCore().byId("lineStationTracker").setEnabled(true);
		sap.ui.getCore().byId("lineStationHandover").setEnabled(true);
		if(msn==undefined){
			sap.ui.getCore().byId("lineStationTracker").setEnabled(false);
			sap.ui.getCore().byId("lineStationHandover").setEnabled(false);
		}
		// delay because addDependent will do a async rerendering and the
		// actionSheet will immediately close without it.
		var oButton = oEvent.getSource();
		jQuery.sap.delayedCall(0, this, function() {
			this.oPopover.openBy(oButton);
		});
	},
	handleValueHelpClose : function(oEvt){
		if(!sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/customLineBO")){
			nav.back();
		}
	},

	/**
	 * BR:SD-PPC-LT-260
	 * To navigate to Station Tracker from Line Tracker
	 */
	gotoStationTracker : function(oEvt) {
		var element = sap.ui.getCore().byId("sapContentPopUpLinetracker")._oOpenBy;
		airbus.mes.linetracker.util.ModelManager.setProgramLineForStationMsn(element.getStation(), element.getMsn());
		airbus.mes.shell.util.navFunctions.stationTracker();
	},

	/**
	 * BR:SD-PPC-LT-260
	 * To navigate to Disruption & Andon Tracker from Line Tracker
	 */
	gotoDisruptionAndonTracker : function() {
		var element = sap.ui.getCore().byId("sapContentPopUpLinetracker")._oOpenBy;
		airbus.mes.linetracker.util.ModelManager.setProgramLineForStationMsn(element.getStation(), element.getMsn());
		airbus.mes.shell.util.navFunctions.disruptionTracker();
	},
	
	/**
	 * BR:SD-PPC-LT-260
	 * To navigate to StationHandover from Line Tracker
	 */
	gotoStationHandover:function(){
		var element = sap.ui.getCore().byId("sapContentPopUpLinetracker")._oOpenBy;
		airbus.mes.linetracker.util.ModelManager.setProgramLineForStationMsn(element.getStation(), element.getMsn());
		airbus.mes.shell.util.navFunctions.stationHandover();
	},

	/**
	 * BR:SD-PPC-LT-090
	 * Set the Selected value
	 * @param
	 */
	setEnabledSelect : function(fProgram, fLine, fStation, fMsn) {
		sap.ui.getCore().byId("selectLine").setEnabled(fLine);
		sap.ui.getCore().byId("selectStation").setEnabled(fStation);
	},

	openTaktActionPopover : function(oEvt){
		var sPath = oEvt.getSource().getBindingContext("stationDataModel").getPath();
		var station = sap.ui.getCore().getModel("stationDataModel").getProperty(sPath).station;
		var status = sap.ui.getCore().getModel("stationDataModel").getProperty(sPath).status;
		var msn = sap.ui.getCore().getModel("stationDataModel").getProperty(sPath).msn;
		var nextMsn = sap.ui.getCore().getModel("stationDataModel").getProperty(sPath).nextMsn;
		var previousMsn = sap.ui.getCore().getModel("stationDataModel").getProperty(sPath).previousMsn;
		var nextMsnImageUrl = sap.ui.getCore().getModel("stationDataModel").getProperty(sPath).nextMsnImageUrl;
		var currentMsnModifydDate = sap.ui.getCore().getModel("stationDataModel").getProperty(sPath).modifyDateTime;
		var nextMsnModifyDate = sap.ui.getCore().getModel("stationDataModel").getProperty(sPath).nextMsnModifyDate;
		var previousMsnModifyDate = sap.ui.getCore().getModel("stationDataModel").getProperty(sPath).previousMsnModifyDate;
		airbus.mes.linetracker.util.ModelManager.populateStatusActionModel(station,msn,nextMsn, status, previousMsn,nextMsnImageUrl,currentMsnModifydDate,nextMsnModifyDate,previousMsnModifyDate);
		if (!this.oTaktActionPopover) {
			this.oTaktActionPopover = sap.ui.xmlfragment("airbus.mes.linetracker.fragments.taktOperation", this);
			this.getView().addDependent(this.oTaktActionPopover);
		}
		this.oTaktActionPopover.openBy(oEvt.getSource());
	},
	
	
	/**
	 * BR:SD-PPC-LT-230
	 * Takt actions – load next MSN
	 */
	loadNextMsn : function(oEvt){		
		sap.ui.getCore().byId("taktActionPopover").close();
		airbus.mes.linetracker.util.ModelManager.performTaktAction(airbus.mes.linetracker.util.ModelManager.aTaktAction[0]);
		
	},
	
	/**
	 * BR:SD-PPC-LT-210
	 * Takt actions – start of assembly
	 */
	startAssembly : function(oEvt){		
		sap.ui.getCore().byId("taktActionPopover").close();
		airbus.mes.linetracker.util.ModelManager.performTaktAction(airbus.mes.linetracker.util.ModelManager.aTaktAction[1]);

	},
	
	/**
	 * BR:SD-PPC-LT-220
	 * Takt actions – end of assembly
	 */
	endAssembly : function(oEvt){
		sap.ui.getCore().byId("taktActionPopover").close();
		airbus.mes.linetracker.util.ModelManager.performTaktAction(airbus.mes.linetracker.util.ModelManager.aTaktAction[2]);

	},
	
	/**
	 * BR:SD-PPC-LT-240
	 * Takt actions – empty station
	 */
	emptyStation : function(oEvt){

		sap.ui.getCore().byId("taktActionPopover").close();
		airbus.mes.linetracker.util.ModelManager.performTaktAction(airbus.mes.linetracker.util.ModelManager.aTaktAction[3]);

	},
	
	/**
	 * BR: SD-PPC-LT-250
	 * Takt actions – undo 
	 */
	undo : function(oEvt){		
		sap.ui.getCore().byId("taktActionPopover").close();
		if (!this.oUndoAction) {
			this.oUndoAction = sap.ui.xmlfragment("airbus.mes.linetracker.fragments.undoAction", this);
			this.getView().addDependent(this.oUndoAction);
		}
		var nextMsn=sap.ui.getCore().getModel("statusActionModel").oData.nextMsn;
		var currentMsn=sap.ui.getCore().getModel("statusActionModel").oData.msn;
		var previousMsn=sap.ui.getCore().getModel("statusActionModel").oData.previousMsn;
		var undoStatus= sap.ui.getCore().getModel("statusActionModel").oData.status;
		var undoText;
		if(undoStatus=="UN_LOADED" || undoStatus == "TO_BE_LOADED"){
			undoText="undoActionText1";
		}else if(undoStatus=="COMPLETE"){
			undoText="undoActionText2";
		}else if(undoStatus=="IN_PROGRESS"){
			undoText="undoActionText3";
		}else if(undoStatus=="LOADED"){
			undoText="undoActionText4";
		}else{
			undoText="undoActionText1";
		}
		sap.ui.getCore().byId("idUndoConfirm").setVisible(true);
		var text=this.getView().getModel("i18n").getProperty(undoText);
		if(text!=undefined){			
		if(previousMsn=="NA" && currentMsn && undoStatus!=="COMPLETE" && undoStatus!=="IN_PROGRESS"){
			text=this.getView().getModel("i18n").getProperty("undoActionText5");
			text=text.replace("$paramCurrentMsn",currentMsn);
		}
		else if(!currentMsn && previousMsn=="NA"){
			text=this.getView().getModel("i18n").getProperty("undoActionText6");
			sap.ui.getCore().byId("idUndoConfirm").setVisible(false);
		}
		else if(!currentMsn && previousMsn && previousMsn!="NA"){
			text=text.replace("$paramCurrentMsn",previousMsn);
		}
		else{
			text=text.replace("$paramCurrentMsn",currentMsn);
			text=text.replace("$paramPreviousMsn",previousMsn);
		}
		sap.ui.getCore().byId("undoText").setText(text);
		this.oUndoAction.open();
	}
	},
	
	
	/**
	 * BR: SD-PPC-LT-250
	 * Takt actions – undo 
	 * When user pressed on Confirm button of Undo fragment 
	 */
	onUndoConfirm:function(oEvt){
		//extract msn and station
		airbus.mes.linetracker.util.ModelManager.performTaktAction(airbus.mes.linetracker.util.ModelManager.aTaktAction[4]);
		this.oUndoAction.close();
	},
	onInformation :  function(oGlobalNavController) {
		 var lineTracker = airbus.mes.linetracker;
        if (lineTracker.informationPopover === undefined) {
        	lineTracker.informationPopover = sap.ui.xmlfragment(
                "linetrackerHelpPopover",
                "airbus.mes.linetracker.fragments.informationPopover",
                oGlobalNavController
            );
        	lineTracker.informationPopover.addStyleClass("alignTextLeft");
        	lineTracker.oView.addDependent(lineTracker.informationPopover);
        }
        return lineTracker.informationPopover;
    },

});

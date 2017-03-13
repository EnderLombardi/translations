"use strict";
jQuery.sap.declare("airbus.mes.missingParts.util.ModelManager")

airbus.mes.missingParts.util.ModelManager = {
	urlModel: undefined,
	i18nModel: undefined,
	excludedFields : ["sfcStepBO"],
	operation : "";
	workOrder : "";

	/**
	 * Initialize Model Manager
	 * 
	 * @param {any} core 
	 */
	init: function (core) {

		var aModel = ["getMissingParts"];
		airbus.mes.shell.ModelManager.createJsonModel(sap.ui.getCore(), aModel);

		// Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.missingParts.config.url_config");
	},

	//request + loadData + model refresh
	loadMPDetail: function () {
		var oViewModel = airbus.mes.missingParts.oView.getModel("getMissingParts");
		oViewModel.setData(airbus.mes.stationtracker.util.Globals_Functions.getMissingPartsData(airbus.mes.settings.ModelManager.site,
								  								   airbus.mes.settings.ModelManager.station,
								  								   airbus.mes.settings.ModelManager.msn));

		var sorterCombo = airbus.mes.missingParts.oView.byId("missingPartsView--mpSorter");
		if ( sorterCombo ){
			var items  = sorterCombo.getItems();
			if ( items.length === 0 ){
				//sorterCombo.insertItem(new sap.ui.core.ListItem({text: airbus.mes.missingParts.util.Formatter.getTranslation("SortPlaceholder"), key: "Placeholder"}), 0);
				sorterCombo.addItem(new sap.ui.core.ListItem("Descending").setText(airbus.mes.missingParts.util.Formatter.getTranslation("Descending")));
				sorterCombo.addItem(new sap.ui.core.ListItem("Ascending").setText(airbus.mes.missingParts.util.Formatter.getTranslation("Ascending")));
			}
		}
		if ( oViewModel.oData.Rowsets != undefined ){
			//oViewModel.oData.Rowsets.Rowset[0].Columns.Column.splice(0, 0, { Name: airbus.mes.missingParts.util.Formatter.getTranslation("FilterPlaceholder") });
		}
//		var dialog =oViewModel.byId("missingPartsView--missingPartsPopUp");
//		if(dialog) dialog.oPopup.setModal(false);
		
		
		
		oViewModel.refresh(true);//refresh the model (and so the view)
	},

	
	
};

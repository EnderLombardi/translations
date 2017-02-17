"use strict";
jQuery.sap.declare("airbus.mes.missingParts.util.ModelManager")

airbus.mes.missingParts.util.ModelManager = {

	urlModel: undefined,
	i18nModel: undefined,
	tableArray: [],

	init: function (core) {

		var aModel = ["getMissingParts"];
		airbus.mes.shell.ModelManager.createJsonModel(core, aModel);

		// Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.missingParts.config.url_config");
	},

	/* *********************************************************************** *
	 *  Replace URL Parameters                                                 *
	 * *********************************************************************** */
	//replace URL with parameter
	replaceURI: function (sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},

	//request + loadData + model refresh
	loadMPDetail: function () {
		var oViewModel = airbus.mes.missingParts.oView.getModel("getMissingParts");
		oViewModel.loadData(this.getMPDetail(), null, false);
		var sorterCombo = airbus.mes.missingParts.oView.byId("missingPartsView--mpSorter");
		if ( sorterCombo ){
			var items  = sorterCombo.getItems();
			if ( items.length === 0 ){
				sorterCombo.addItem(new sap.ui.core.ListItem("Descending").setText(airbus.mes.missingParts.util.Formatter.getTranslation("Descending")));
				sorterCombo.addItem(new sap.ui.core.ListItem("Ascending").setText(airbus.mes.missingParts.util.Formatter.getTranslation("Ascending")));
			}
		}
		oViewModel.refresh(true);//refresh the model (and so the view)
	},

	//replace the url with the several parameters needed
	getMPDetail: function (paramArray) {
		//local config to change between operation and work order
		return this.urlModel.getProperty("getMissingParts");
	}
};

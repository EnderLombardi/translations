"use strict";
jQuery.sap.declare("airbus.mes.missingParts.model.ModelManager")

airbus.mes.missingParts.model.ModelManager = {

	urlModel: undefined,
	i18nModel: undefined,
	tableArray: [],

	init: function (core) {

		var aModel = ["getMissingParts", "getFilters", "getOrder"];
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
		oViewModel.refresh(true);//refresh the model (and so the view)
	},

	//replace the url with the several parameters needed
	getMPDetail: function (paramArray) {
		//local config to change between operation and work order
		return this.urlModel.getProperty("getMissingParts");
	}
};

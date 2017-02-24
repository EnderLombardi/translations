"use strict";
jQuery.sap.declare("airbus.mes.missingParts.util.ModelManager")

airbus.mes.missingParts.util.ModelManager = {
	urlModel: undefined,
	i18nModel: undefined,

	/**
	 * Initialize Model Manager
	 * 
	 * @param {any} core 
	 */
	init: function (core) {

		var aModel = ["getMissingParts"];
		airbus.mes.shell.ModelManager.createJsonModel(core, aModel);

		// Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.missingParts.config.url_config");
	},

	//request + loadData + model refresh
	loadMPDetail: function () {
		var oViewModel = airbus.mes.missingParts.oView.getModel("getMissingParts");
		
		if (sessionStorage.loginType !== "local") {
			jQuery.ajax({
				type: 'post',
				url: this.urlModel.getProperty("urlMissingParts"),
				contentType: 'application/json',
				data: JSON.stringify({
				"site": airbus.mes.settings.ModelManager.site,
				"physicalStation": airbus.mes.settings.ModelManager.station,
				"msn": airbus.mes.settings.ModelManager.msn
				}),

				success: function (data) {
					if (typeof data == "string") {
						data = JSON.parse(data);
					}
					try {
						oViewModel.setData(airbus.mes.settings.GlobalFunction.getRowsetsFromREST(data.missingPartList));
					} catch (error) {
						console.log(error);
					};
				},

				error: function (error, jQXHR) {
				console.log(error);
				}
			});
		} else {
			oViewModel.loadData(this.urlModel.getProperty("getMissingParts"), null, false);
		}

		var sorterCombo = airbus.mes.missingParts.oView.byId("missingPartsView--mpSorter");
		if ( sorterCombo ){
			var items  = sorterCombo.getItems();
			if ( items.length === 0 ){
				sorterCombo.addItem(new sap.ui.core.ListItem("Descending").setText(airbus.mes.missingParts.util.Formatter.getTranslation("Descending")));
				sorterCombo.addItem(new sap.ui.core.ListItem("Ascending").setText(airbus.mes.missingParts.util.Formatter.getTranslation("Ascending")));
			}
		}

		var dialog = airbus.mes.missingParts.oView.byId("missingPartsView--missingPartsPopUp");
		dialog.setDraggable(true);
		dialog.setResizable(true);
		dialog.oPopup.setModal(false);
		oViewModel.refresh(true);//refresh the model (and so the view)
	}
};

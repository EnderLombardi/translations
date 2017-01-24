"use strict";
jQuery.sap.declare("airbus.mes.displayOpeAttachments.util.ModelManager")

airbus.mes.displayOpeAttachments.util.ModelManager = {

	urlModel: undefined,
	queryParams: jQuery.sap.getUriParameters(),
	i18nModel: undefined,

	init: function (core) {

		var aModel = ["getOpeAttachments"];
		airbus.mes.shell.ModelManager.createJsonModel(core, aModel);

		var dest;

		switch (window.location.hostname) {
			case "localhost":
				dest = "local";
				break;
			case "wsapbpc01.ptx.fr.sopra":
				dest = "sopra";
				break;
			default:
				dest = "airbus";
				break;
		}

		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleName: "airbus.mes.displayOpeAttachments.config.url_config",
			bundleLocale: dest
		});

		if (dest === "sopra") {
			var oModel = this.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;

			for (var prop in oModel) {
				if (oModel[prop].slice(-5) != ".json") {
					oModel[prop] += "&j_user=" + Cookies.getJSON("login").user + "&j_password=" + Cookies.getJSON("login").mdp;
				}
			}
		}

		var oModule = airbus.mes.displayOpeAttachments.util.ModelManager;
		oModule.loadDOADetail();
	},

	/* *********************************************************************** *
	 *  Replace URL Parameters                                                 *
	 * *********************************************************************** */
	replaceURI : function(sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},

	loadDOADetail: function () {
		var oViewModel = airbus.mes.displayOpeAttachments.oView.getModel("getOpeAttachments");
		oViewModel.loadData(this.getDOADetail(), null, false);

		var row = oViewModel.oData.Rowsets.Rowset[0].Row;
		airbus.mes.displayOpeAttachments.util.Formatter.extractWorkinstruction(row);//create dokar, doknr & doktl using workInstruction
		airbus.mes.displayOpeAttachments.util.Formatter.sortByDocType(row);//sort the documents by doc type
		oViewModel.oData.Rowsets.Rowset[0].Row = airbus.mes.displayOpeAttachments.util.Formatter.addDocTypeHierarchy(row);//create a parent object by foc type
		oViewModel.refresh(true);//refresh the model
	},

	getDOADetail: function () {
		var url = this.urlModel.getProperty("getOpeAttachments");
		//iftoad : durl = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$ShopOrderBO", airbus.mes.stationtracker.ModelManager.stationInProgress.ShopOrderBO);
			//url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$RouterBO", airbus.mes.settings.ModelManager.site);
		//iftoadd : url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$RouterStepBO", airbus.mes.stationtracker.ModelManager.stationInProgress.RouterStepBO);
			//url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$Site", airbus.mes.settings.ModelManager.site);
		return url;
	},

};

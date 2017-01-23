"use strict";
jQuery.sap.declare("airbus.mes.displayOpeAttachments.util.ModelManager")

airbus.mes.displayOpeAttachments.util.ModelManager = {

	urlModel: undefined,
	queryParams: jQuery.sap.getUriParameters(),

	init: function (core) {

		this.core = core;
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

		airbus.mes.shell.ModelManager.createJsonModel(core, ["getOpeAttachments"]);
		this.loadDOADetail();
	},

	loadDOADetail : function() {
		var oModel = sap.ui.getCore().getModel("getOpeAttachments");
		oModel.loadData(this.getDOADetail(), null, false);

		var row = oModel.oData.Rowsets.Rowset[0].Row;
		airbus.mes.displayOpeAttachments.util.Formatter.extractWorkinstruction(row);//create dokar, doknr & doktl using workInstruction
		airbus.mes.displayOpeAttachments.util.Formatter.sortByDocType(row);//sort the documents by doc type
		oModel.oData.Rowsets.Rowset[0].Row = airbus.mes.displayOpeAttachments.util.Formatter.addDocTypeHierarchy(row);//create a parent object by foc type
	},
	
	getDOADetail : function() {
		var url = this.urlModel.getProperty("getOpeAttachments");
		url = airbus.mes.shell.ModelManager.replaceURI(url, "$ShopOrderBO", airbus.mes.stationtracker.ModelManager.stationInProgress.ShopOrderBO);
		//url = airbus.mes.shell.ModelManager.replaceURI(url, "$RouterBO", airbus.mes.settings.ModelManager.site);
		url = airbus.mes.shell.ModelManager.replaceURI(url, "$RouterStepBO", airbus.mes.stationtracker.ModelManager.stationInProgress.RouterStepBO);
		//url = airbus.mes.shell.ModelManager.replaceURI(url, "$Site", airbus.mes.settings.ModelManager.site);
		return url;
	},
	
};

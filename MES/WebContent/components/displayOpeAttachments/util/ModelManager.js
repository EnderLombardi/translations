"use strict";
jQuery.sap.declare("airbus.mes.displayOpeAttachments.util.ModelManager")

airbus.mes.displayOpeAttachments.util.ModelManager = {

	urlModel: undefined,
	queryParams: jQuery.sap.getUriParameters(),
	i18nModel: undefined,
	//todo :will be the configuration received in AppConfManager
	//sSet : airbus.mes.settings.AppConfManager.getConfiguration("VIEW_ATTACHED_TOOL");
	sSet : "O",

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

		//load data in the model at the init of the component
		var oModule = airbus.mes.displayOpeAttachments.util.ModelManager;
		oModule.loadDOADetail();
	},

	/* *********************************************************************** *
	 *  Replace URL Parameters                                                 *
	 * *********************************************************************** */
	//replace URL with parameter
	replaceURI : function(sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},

	//request + loadData + formatter on response + model refresh
	loadDOADetail: function () {
		var oViewModel = airbus.mes.displayOpeAttachments.oView.getModel("getOpeAttachments");
		oViewModel.loadData(this.getDOADetail(), null, false);

		var row = oViewModel.oData.Rowsets.Rowset[0].Row;
		airbus.mes.displayOpeAttachments.util.Formatter.extractWorkinstruction(row);//create dokar, doknr & doktl using workInstruction
		airbus.mes.displayOpeAttachments.util.Formatter.sortByDocType(row);//sort the documents by doc type
		oViewModel.oData.Rowsets.Rowset[0].Row = airbus.mes.displayOpeAttachments.util.Formatter.addDocTypeHierarchy(row);//create a parent object by foc type
		oViewModel.refresh(true);//refresh the model
	},

	//replace the url with the several parameters needed
	getDOADetail: function (paramArray) {
		var url = this.urlModel.getProperty("getOpeAttachments");
		var urlConfig = this.queryParams.get("url_config");
		var set = airbus.mes.displayOpeAttachments.util.ModelManager.sSet;

		//local config to change between operation and work order
		if (urlConfig === "sopra" && set === "O"){
			url = "../components/displayOpeAttachments/data/displayOpeAttachments.json";
		} else if (urlConfig === "sopra" && set === "P") {
			url = "../components/displayOpeAttachments/data/displayOpeAttachments_wo.json";
		}
		
		//replace the urls
		//iftoadd : url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$ShopOrderBO", paramArray[0]);
			//url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$RouterBO", paramArray[1]);
		//iftoadd : url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$RouterStepBO", paramArray[2]);
			//url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$Site", paramArray[3]);
		return url;
	},

};

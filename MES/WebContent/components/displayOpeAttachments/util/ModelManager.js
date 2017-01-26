"use strict";
jQuery.sap.declare("airbus.mes.displayOpeAttachments.util.ModelManager")

airbus.mes.displayOpeAttachments.util.ModelManager = {

	urlModel: undefined,
	queryParams: jQuery.sap.getUriParameters(),
	i18nModel: undefined,
	treeTableArray: [],

	//todo :will be the configuration received in AppConfManager
	//sSet : airbus.mes.settings.AppConfManager.getConfiguration("VIEW_ATTACHED_TOOL");
	sSet: "O",

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
		oModule.createTreeTableArray();
	},

	/* *********************************************************************** *
	 *  Replace URL Parameters                                                 *
	 * *********************************************************************** */
	//replace URL with parameter
	replaceURI: function (sURI, sFrom, sTo) {
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
		if (urlConfig === "sopra" && set === "O") {
			url = "../components/displayOpeAttachments/data/displayOpeAttachments.json";
		} else if (urlConfig === "sopra" && set === "P") {
			url = "../components/displayOpeAttachments/data/displayOpeAttachments_wo.json";
		}

		//TODO : replace the urls
		//iftoadd : url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$ShopOrderBO", paramArray[0]);
		//url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$RouterBO", paramArray[1]);
		//iftoadd : url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$RouterStepBO", paramArray[2]);
		//url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$Site", paramArray[3]);
		return url;
	},

	//create an array which will be used to handle documents downloadable or not (for css and url binding)
	createTreeTableArray: function () {
		debugger;
		var oViewModelRow = airbus.mes.displayOpeAttachments.oView.getModel("getOpeAttachments").oData.Rowsets.Rowset[0].Row;
		var i;
		this.treeTableArray = [];//we reset the tab to handle onSelectLevel case (change between operation and wo mode)
		var treeTableArray = this.treeTableArray;

		for (i = 0; i < oViewModelRow.length; i++) {
			treeTableArray.push(this.addObjDocType(i));

			for (var j = 0; j < oViewModelRow[i].documents.length; j++) {
				treeTableArray.push(this.addObjDoc());
			}
		}
	},

	//create an object doc type for createTreeTableArray
	addObjDocType: function (i) {
		var objDocType = {};
		objDocType.isDocType = true;
		objDocType.isOpened = false;
		objDocType.position = i;
		return objDocType;
	},

	//create an object document for createTreeTableArray
	addObjDoc: function () {
		var document = {};
		document.isDocType = false;
		document.position = null;
		return document;
	},

};

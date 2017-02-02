"use strict";
jQuery.sap.declare("airbus.mes.displayOpeAttachments.util.ModelManager")

airbus.mes.displayOpeAttachments.util.ModelManager = {

	urlModel: undefined,
	i18nModel: undefined,
	treeTableArray: [],

	//todo :will be the configuration received in AppConfManager
	//sSet : airbus.mes.settings.AppConfManager.getConfiguration("VIEW_ATTACHED_TOOL");
	sSet: "O",

	init: function (core) {

		var aModel = ["getOpeAttachments"];
		airbus.mes.shell.ModelManager.createJsonModel(core, aModel);
		
	    // Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.displayOpeAttachments.config.url_config");

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
		oViewModel.refresh(true);//refresh the model (and so the view)
	},

	//replace the url with the several parameters needed
	getDOADetail: function (paramArray) {
		var url, set = airbus.mes.displayOpeAttachments.util.ModelManager.sSet;

		//local config to change between operation and work order
		if (set === "O") {
			url = this.urlModel.getProperty("getOpeAttachments");
		} else if (set === "P") {
			url = this.urlModel.getProperty("getOpeAttachments_wo");
		}

		//TODO : replace the urls
		// iftoadd : url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$ShopOrderBO", paramArray[0]);
		// url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$RouterBO", paramArray[1]);
		// iftoadd : url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$RouterStepBO", paramArray[2]);
		// url = airbus.mes.displayOpeAttachments.ModelManager.replaceURI(url, "$Site", paramArray[3]);
		return url;
	},

	//create an array which will be used to handle documents downloadable or not (for css and url binding)
	createTreeTableArray: function () {
		var oViewModelRow = airbus.mes.displayOpeAttachments.oView.getModel("getOpeAttachments").oData.Rowsets.Rowset[0].Row;
		var i;
		this.treeTableArray = [];//we reset the tab to handle onSelectLevel case (change between operation and wo mode)
		var treeTableArray = this.treeTableArray;

		for (i = 0; i < oViewModelRow.length; i++) {
			treeTableArray.push(this.addObjDocType(i, oViewModelRow));

			for (var j = 0; j < oViewModelRow[i].documents.length; j++) {
				treeTableArray.push(this.addObjDoc());
			}
		}
	},

	//create an object doc type for createTreeTableArray
	addObjDocType: function (i, oViewModelRow) {
		var objDocType = {};
		objDocType.isDocType = true;
		objDocType.isOpened = false;
		objDocType.position = i;
		objDocType.nbOfDocs = parseInt(oViewModelRow[i].dokarOrDoknr.split(" ")[2], 10);
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

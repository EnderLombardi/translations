"use strict";
jQuery.sap.declare("airbus.mes.displayOpeAttachments.util.ModelManager")

airbus.mes.displayOpeAttachments.util.ModelManager = {

	urlModel: undefined,
	i18nModel: undefined,
	treeTableArray: [],
	nbOfDocTypes: 0,

	//todo :will be the configuration received in AppConfManager
	//sSet : airbus.mes.settings.AppConfManager.getConfiguration("VIEW_ATTACHED_TOOL");
	sSet: "O",

	init: function (core) {

		var aModel = ["getOpeAttachments"];
		airbus.mes.shell.ModelManager.createJsonModel(core, aModel);

		// Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.displayOpeAttachments.config.url_config");
	},

	/* *********************************************************************** *
	 *  Replace URL Parameters                                                 *
	 * *********************************************************************** */
	//replace URL with parameter
	replaceURI: function (sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},

	//load the parameters needed for the documents request
	getLoadDOAParam: function () {
		var paramArray = [], shopOrderBO, routerBO, site, routerStepBO, erpId;

		site = airbus.mes.settings.ModelManager.site;
		erpId = airbus.mes.stationtracker.ModelManager.stationInProgress.ERP_SYSTEM;
		shopOrderBO = airbus.mes.stationtracker.ModelManager.stationInProgress.ShopOrderBO;
		routerStepBO = airbus.mes.stationtracker.ModelManager.stationInProgress.RouterStepBO;
		routerBO = routerStepBO.split(":")[1] + ":" + routerStepBO.split(":")[2];//delete the first part ("RouterStepBO:")
		routerBO = routerBO.replace(/,[^,]+$/, "");//delete all after the last comma

		//fill the parameters array
		paramArray.push(site);
		paramArray.push(erpId);
		paramArray.push(shopOrderBO);
		paramArray.push(routerBO);
		paramArray.push(routerStepBO);

		return paramArray;
	},

	//request + loadData + formatter on response + model refresh
	loadDOADetail: function () {
		var oViewModel = airbus.mes.displayOpeAttachments.oView.getModel("getOpeAttachments");

		if (sessionStorage.loginType !== "local") {
			var paramArray = this.getLoadDOAParam();
		} else {
			var paramArray = [];
		}
		
		oViewModel.loadData(this.getDOADetail(paramArray), null, false);

		if (oViewModel.oData.Rowsets && oViewModel.oData.Rowsets.Rowset && oViewModel.oData.Rowsets.Rowset[0].Row) {
			var row = oViewModel.oData.Rowsets.Rowset[0].Row;
			airbus.mes.displayOpeAttachments.util.Formatter.extractWorkinstruction(row);//create dokar, doknr & doktl using workInstruction
			airbus.mes.displayOpeAttachments.util.Formatter.sortByDocType(row);//sort the documents by doc type
			oViewModel.oData.Rowsets.Rowset[0].Row = airbus.mes.displayOpeAttachments.util.Formatter.addDocTypeHierarchy(row);//create a parent object by foc type
			oViewModel.refresh(true);//refresh the model (and so the view)
		}
	},

	//replace the url with the several parameters needed
	getDOADetail: function (paramArray) {
		var url, set = airbus.mes.displayOpeAttachments.util.ModelManager.sSet;

		url = this.urlModel.getProperty("getOpeAttachments");
		if (sessionStorage.loginType !== "local") {
			url = this.replaceURI(url, "$Site", paramArray[0]);
			url = this.replaceURI(url, "$ErpId", paramArray[1]);
			url = this.replaceURI(url, "$ShopOrderBO", paramArray[2]);

			//operation or work order
			if (set === "O") {
				url = this.replaceURI(url, "$RouterBO", paramArray[3]);
				url = this.replaceURI(url, "$RouterStepBO", paramArray[4]);
			} else if (set === "P") {
			}
		} else {//LOCAL
			//operation or work order
			if (set === "O") {
				url = this.urlModel.getProperty("getOpeAttachments");
			} else if (set === "P") {
				url = this.urlModel.getProperty("getOpeAttachments_wo");
			}
		}
		return url;
	},

	//create an array which will be used to handle documents downloadable or not (for css and url binding)
	createTreeTableArray: function () {
		var oViewModelRow = airbus.mes.displayOpeAttachments.oView.getModel("getOpeAttachments").oData.Rowsets.Rowset[0].Row;
		var i;
		this.treeTableArray = [];//we reset the tab to handle onSelectLevel case (change between operation and wo mode)
		var treeTableArray = this.treeTableArray;

		var position = 0;
		for (i = 0; i < oViewModelRow.length; i++) {
			treeTableArray.push(this.addObjDocType(i, position, oViewModelRow));
			position++;
			for (var j = 0; j < oViewModelRow[i].documents.length; j++) {
				treeTableArray.push(this.addObjDoc(position, oViewModelRow[i].documents[j].URL));
				position++;
			}
		}
	},

	//create an object doc type for createTreeTableArray
	addObjDocType: function (i, position, oViewModelRow) {
		var objDocType = {};
		objDocType.isDocType = true;
		objDocType.isOpened = true;//set to true
		objDocType.position = position;
		objDocType.nbOfDocs = parseInt(oViewModelRow[i].dokarOrDoknr.split(" ")[2], 10);
		return objDocType;
	},

	//create an object document for createTreeTableArray
	addObjDoc: function (position, url) {
		var document = {};
		document.isDocType = false;
		document.position = position;
		document.url = url;
		return document;
	},

};

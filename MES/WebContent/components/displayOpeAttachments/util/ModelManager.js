"use strict";
jQuery.sap.declare("airbus.mes.displayOpeAttachments.util.ModelManager")

airbus.mes.displayOpeAttachments.util.ModelManager = {

	urlModel: undefined,
	treeTableArray: [],
	functions: ["OPEN_DOCUMENT_OPERATION", "OPEN_DOCUMENT_WORKORDER"],

	/* *********************************************************************** *
	 *  MAIN FUNCTIONS                                                		   *
	 * *********************************************************************** */

	init: function (core) {
		var aModel = ["getOpeAttachments", "getDocumentTypes", "getExternalUrlTemplate"];
		airbus.mes.shell.ModelManager.createJsonModel(core, aModel);

		// Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.displayOpeAttachments.config.url_config");
	},

	//request + loadData + formatter on response + model refresh
	loadDOADetail: function () {
		var oViewModel = airbus.mes.displayOpeAttachments.oView.getModel("getOpeAttachments");
		var vmDocTypes = airbus.mes.displayOpeAttachments.oView.getModel("getDocumentTypes");
		var vmExternalUrlTemplate = airbus.mes.displayOpeAttachments.oView.getModel("getExternalUrlTemplate");
		var doaParameters, externalUrlTemplateParameters, externalUrlParameters;

		//used to fix bad loginType with localhost
		//sessionStorage.loginType = "dmi";
		if (sessionStorage.loginType !== "local") {
			doaParameters = this.getDoaParameters();
			externalUrlTemplateParameters = this.getExternalUrlTemplateParameters();
			externalUrlParameters = this.getExternalUrlParameters();
		} else {
			doaParameters = [];
		}

		vmDocTypes.loadData(this.getDocumentTypes(), null, false);
		vmExternalUrlTemplate.loadData(this.getExternalUrlTemplate(externalUrlTemplateParameters), null, false);
		oViewModel.loadData(this.getDOADetail(doaParameters), null, false);

		//format data from getExternalUrlTemplate
		if (vmExternalUrlTemplate.oData.Rowsets && vmExternalUrlTemplate.oData.Rowsets.Rowset && vmExternalUrlTemplate.oData.Rowsets.Rowset[0].Row) {
			vmExternalUrlTemplate.oData.externalUrl = vmExternalUrlTemplate.oData.Rowsets.Rowset[0].Row[0].str_output;
			this.getExternalUrl(externalUrlParameters);
		}

		//format data from getOpeAttachments and getDocumentTypes
		if (oViewModel.oData.Rowsets && oViewModel.oData.Rowsets.Rowset && oViewModel.oData.Rowsets.Rowset[0].Row) {
			var row = oViewModel.oData.Rowsets.Rowset[0].Row;
			var docTypesRow;

			if (vmDocTypes.oData.Rowsets) {//if data from getDocumentTypes
				docTypesRow = vmDocTypes.oData.Rowsets.Rowset[0].Row;
			}

			airbus.mes.displayOpeAttachments.util.Formatter.extractWorkinstruction(row);//create dokar, doknr & doktl using workInstruction
			airbus.mes.displayOpeAttachments.util.Formatter.sortByDocType(row);//sort the documents by doc type
			oViewModel.oData.Rowsets.Rowset[0].Row = airbus.mes.displayOpeAttachments.util.Formatter.addDocTypeHierarchy(row);//create a parent object by doc type
			airbus.mes.displayOpeAttachments.util.Formatter.removeOldVersions(oViewModel.oData.Rowsets.Rowset[0].Row);
			airbus.mes.displayOpeAttachments.util.Formatter.addDocTypesDescriptions(oViewModel.oData.Rowsets.Rowset[0].Row, docTypesRow);
			oViewModel.refresh(true);//refresh the model (and so the view)
		}
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

	/* *********************************************************************** *
	 *  URL                                                 				   *
	 * *********************************************************************** */

	//replace the url with the several parameters needed
	getDOADetail: function (doaParameters) {
		var url, set = airbus.mes.displayOpeAttachments.component.mProperties.sSet;

		url = this.urlModel.getProperty("getOpeAttachments");
		if (sessionStorage.loginType !== "local") {
			url = this.replaceURI(url, "$Site", doaParameters[0]);
			url = this.replaceURI(url, "$ErpId", doaParameters[1]);
			url = this.replaceURI(url, "$ShopOrderBO", doaParameters[2]);

			//operation or work order
			if (set === "O") {
				url = this.replaceURI(url, "$RouterBO", doaParameters[3]);
				url = this.replaceURI(url, "$RouterStepBO", doaParameters[4]);
			} else if (set === "P") {
				url = this.replaceURI(url, "$RouterBO", "");
				url = this.replaceURI(url, "$RouterStepBO", "");
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

	//replace the url with the several parameters needed
	getExternalUrlTemplate: function (externalUrlTemplateParameters) {
		var url = this.urlModel.getProperty("getExternalUrlTemplate");
		if (sessionStorage.loginType !== "local") {
			url = this.replaceURI(url, "$Site", externalUrlTemplateParameters[0]);
			url = this.replaceURI(url, "$ErpId", externalUrlTemplateParameters[1]);
			url = this.replaceURI(url, "$Function", externalUrlTemplateParameters[2]);
		}

		return url;
	},

	//replace the url with the several parameters needed
	getExternalUrl: function (externalUrlTemplateParameters) {
		var url = this.urlModel.getProperty("getExternalUrlTemplate");
		if (sessionStorage.loginType !== "local") {
			url = this.replaceURI(url, "$Site", externalUrlTemplateParameters[0]);
			url = this.replaceURI(url, "$ErpId", externalUrlTemplateParameters[1]);
			url = this.replaceURI(url, "$Function", externalUrlTemplateParameters[2]);
		}

		return url;
	},

	//replace the url with the several parameters needed
	getDocumentTypes: function () {
		var url = this.urlModel.getProperty("getDocumentTypesDescriptions");
		return url;
	},

	//replace URL with parameter
	replaceURI: function (sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},

/* *********************************************************************** *
 *  URL PARAMETERS                                              		   *
 * *********************************************************************** */

	//load the parameters needed for the documents request
	getDoaParameters: function () {
		var doaParameters = [], site, erpId, shopOrderBO, routerBO, routerStepBO;

		site = airbus.mes.settings.ModelManager.site;
		erpId = airbus.mes.stationtracker.util.ModelManager.stationInProgress.ERP_SYSTEM;
		shopOrderBO = airbus.mes.stationtracker.util.ModelManager.stationInProgress.ShopOrderBO;
		routerStepBO = airbus.mes.stationtracker.util.ModelManager.stationInProgress.RouterStepBO;
		routerBO = routerStepBO.split(":")[1] + ":" + routerStepBO.split(":")[2];//delete the first part ("RouterStepBO:")
		routerBO = routerBO.replace(/,[^,]+$/, "");//delete all after the last comma

		//fill the parameters array
		doaParameters.push(site);
		doaParameters.push(erpId);
		doaParameters.push(shopOrderBO);
		doaParameters.push(routerBO);
		doaParameters.push(routerStepBO);

		return doaParameters;
	},

	//load the parameters needed for the documents request
	getExternalUrlTemplateParameters: function () {
		var externalUrlTemplateParameters = [], site, erpId, fct;
		var set = airbus.mes.displayOpeAttachments.component.mProperties.sSet;

		site = airbus.mes.settings.ModelManager.site;
		erpId = airbus.mes.stationtracker.util.ModelManager.stationInProgress.ERP_SYSTEM;
		if (set === "O") {
			fct = this.functions[0];
		} else {
			fct = this.functions[1];
		}

		//fill the parameters array
		externalUrlTemplateParameters.push(site);
		externalUrlTemplateParameters.push(erpId);
		externalUrlTemplateParameters.push(fct);

		return externalUrlTemplateParameters;
	},

	//load the parameters needed for the documents request
	getExternalUrlParameters: function () {
		var externalUrlParameters = [], workorder, operation;
		var set = airbus.mes.displayOpeAttachments.component.mProperties.sSet;

		workorder = airbus.mes.stationtracker.util.ModelManager.stationInProgress.WORKORDER_ID;
		if (set === "O") {
			operation = airbus.mes.stationtracker.util.ModelManager.stationInProgress.OPERATION_ID;
		} else {
			operation = "";
		}

		//fill the parameters array
		externalUrlParameters.push(workorder);
		externalUrlParameters.push(operation);

		return externalUrlParameters;
	},

	/* *********************************************************************** *
	 *  operation/wo filter                                               	   *
	 * *********************************************************************** */

	checkOperationWorkOrderFilter: function () {
		if (["O", "P"].indexOf(airbus.mes.displayOpeAttachments.component.mProperties.sSet) === -1) {
			airbus.mes.displayOpeAttachments.component.mProperties.sSet = "O";
		}
	}

};

"use strict";

jQuery.sap.declare("airbus.mes.operationdetail.ModelManager")

airbus.mes.operationdetail.ModelManager = {

	urlModel : undefined,
	currentOperator : {
		'fname' : undefined,
		'lname' : undefined,
		'user_id' : undefined,
		'image' : undefined
	},

	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {

		this.core = core;

		var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "local";
			break;
		default:
			dest = "airbus";
			break;
		}

		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "../components/operationdetail/config/url_config.properties",
			bundleLocale : dest
		});

		this.core.setModel(new sap.ui.model.json.JSONModel(), "reasonCodeModel");

	},

	/***************************************************************************
	 * Show Message Toast
	 **************************************************************************/
	messageShow : function(text, duration) {
		if (typeof duration == "undefined")
			duration = 3000;

		sap.m.MessageToast.show(text, {
			duration : duration,
			width : "25em",
			my : "center center",
			at : "center center",
			of : window,
			offset : "0 0",
			collision : "fit fit",
			onClose : null,
			autoClose : true,
			animationTimingFunction : "ease",
			animationDuration : 3000,
			closeOnBrowserNavigation : false
		});

	},

	/***************************************************************************
	 * Set the Models for Reason Codes
	 **************************************************************************/
	loadReasonCodeModel : function() {
		var oModel = sap.ui.getCore().getModel("reasonCodeModel");
		oModel.loadData(this.getReasonCodesURL(), null, false);
	},
	getReasonCodesURL : function() {
		var urlReasonCodes = this.urlModel.getProperty("getReasonCodes");
		urlReasonCodes = airbus.mes.shell.ModelManager.replaceURI(
				urlReasonCodes, "$site", airbus.mes.settings.ModelManager.site);
		return urlReasonCodes;

	},

	/***************************************************************************
	 * Get URL for Activate Operation
	 **************************************************************************/
	getUrlStartOperation : function(data) {
		var urlStartOperation = this.urlModel.getProperty("startOperation");
		urlStartOperation = airbus.mes.shell.ModelManager
				.replaceURI(urlStartOperation, "$operation", data.operation_no);
		urlStartOperation = airbus.mes.shell.ModelManager
				.replaceURI(urlStartOperation, "$sfc", data.sfc);
		urlStartOperation = airbus.mes.shell.ModelManager
				.replaceURI(urlStartOperation, "$site",
						airbus.mes.settings.ModelManager.site);
		urlStartOperation = airbus.mes.shell.ModelManager
				.replaceURI(urlStartOperation, "$resource", "DEFAULT");
		urlStartOperation = airbus.mes.shell.ModelManager
				.replaceURI(urlStartOperation, "$OperationRevision",
						data.operation_revision);

		return urlStartOperation;
	},

	/***************************************************************************
	 * Get URL for Pause Operation
	 **************************************************************************/
	getUrlPauseOperation : function(data) {
		var urlPauseOperation = this.urlModel.getProperty("pauseOperation");
		urlPauseOperation = airbus.mes.shell.ModelManager
				.replaceURI(urlPauseOperation, "$Operation", data.operation_no);

		urlPauseOperation = airbus.mes.shell.ModelManager
				.replaceURI(urlPauseOperation, "$Sfc", data.sfc);
		urlPauseOperation = airbus.mes.shell.ModelManager
				.replaceURI(urlPauseOperation, "$Site",
						airbus.mes.settings.ModelManager.site);
		urlPauseOperation = airbus.mes.shell.ModelManager
				.replaceURI(urlPauseOperation, "$Resource", "DEFAULT");
		urlPauseOperation = airbus.mes.shell.ModelManager
				.replaceURI(urlPauseOperation, "$OperationRevision",
						data.operation_revision);

		return urlPauseOperation;
	},

	/***************************************************************************
	 * Get URL for Operation Confirmation
	 **************************************************************************/
	getConfirmationUrl : function(userId, password, confirmationType,
			percentConfirm, sfcStepRef, reasonCodeText, Mode, bID) {
		var totalPartialConfirmationUrl = this.urlModel
				.getProperty("operationConfirmatonUrl");
		totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
				totalPartialConfirmationUrl, "$userId", userId);
		totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
				totalPartialConfirmationUrl, "$password", password);
		totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
				totalPartialConfirmationUrl, "$confirmationType",
				confirmationType);
		totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
				totalPartialConfirmationUrl, "$percentConfirm", percentConfirm);
		totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
				totalPartialConfirmationUrl, "$sfcStepRef", sfcStepRef);
		totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
				totalPartialConfirmationUrl, "$resonCodeText", reasonCodeText);
		totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
				totalPartialConfirmationUrl, "$Mode", Mode);
		totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
				totalPartialConfirmationUrl, "$bID", bID);
		return totalPartialConfirmationUrl;

	}
};
// airbus.mes.operationdetail.ModelManager.init(sap.ui.getCore());

"use strict";

jQuery.sap.declare("airbus.mes.worktracker.util.ModelManager")

airbus.mes.worktracker.util.ModelManager = {

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
			bundleName : "airbus.mes.worktracker.config.url_config",
			bundleLocale : dest
		});
		 
        if (  dest === "sopra" ) {

			var oModel = this.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;
				
			for (var prop in oModel) {
				if (oModel[prop].slice(-5) != ".json" ) {
				oModel[prop] += "&j_user=" + Cookies.getJSON("login").user + "&j_password="  + Cookies.getJSON("login").mdp; 
				}
			}
		}
		
		this.core.setModel(new sap.ui.model.json.JSONModel(), "currentOperatorModel");
		this.core.setModel(new sap.ui.model.json.JSONModel(), "userOperationsModel");
		this.core.setModel(new sap.ui.model.json.JSONModel(), "UserListModel");
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
	 * Replace URL Parameters
	 **************************************************************************/
	replaceURI : function(sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
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
		urlReasonCodes = airbus.mes.worktracker.util.ModelManager.replaceURI(
				urlReasonCodes, "$site", airbus.mes.settings.ModelManager.site);
		return urlReasonCodes;

	},

	/***************************************************************************
	 * Get URL for Activate Operation
	 **************************************************************************/
	getUrlStartOperation : function(data) {
		var urlStartOperation = this.urlModel.getProperty("startOperation");
		urlStartOperation = airbus.mes.worktracker.util.ModelManager
				.replaceURI(urlStartOperation, "$operation", data.operation_no);
		urlStartOperation = airbus.mes.worktracker.util.ModelManager
				.replaceURI(urlStartOperation, "$sfc", data.sfc);
		urlStartOperation = airbus.mes.worktracker.util.ModelManager
				.replaceURI(urlStartOperation, "$site",
						airbus.mes.settings.ModelManager.site);
		urlStartOperation = airbus.mes.worktracker.util.ModelManager
				.replaceURI(urlStartOperation, "$resource", "DEFAULT");
		urlStartOperation = airbus.mes.worktracker.util.ModelManager
				.replaceURI(urlStartOperation, "$OperationRevision",
						data.operation_revision);

		return urlStartOperation;
	},

	/***************************************************************************
	 * Get URL for Pause Operation
	 **************************************************************************/
	getUrlPauseOperation : function(data) {
		var urlPauseOperation = this.urlModel.getProperty("pauseOperation");
		urlPauseOperation = airbus.mes.worktracker.util.ModelManager
				.replaceURI(urlPauseOperation, "$Operation", data.operation_no);

		urlPauseOperation = airbus.mes.worktracker.util.ModelManager
				.replaceURI(urlPauseOperation, "$Sfc", data.sfc);
		urlPauseOperation = airbus.mes.worktracker.util.ModelManager
				.replaceURI(urlPauseOperation, "$Site",
						airbus.mes.settings.ModelManager.site);
		urlPauseOperation = airbus.mes.worktracker.util.ModelManager
				.replaceURI(urlPauseOperation, "$Resource", "DEFAULT");
		urlPauseOperation = airbus.mes.worktracker.util.ModelManager
				.replaceURI(urlPauseOperation, "$OperationRevision",
						data.operation_revision);

		return urlPauseOperation;
	},

	/***************************************************************************
	 * Load list of operators assigned to current Work Center
	 **************************************************************************/
	getUsersInWorkcenterUrl : function() {
		var UsersInWorkcenterUrl = this.urlModel
				.getProperty("getUsersInWorkcenter");
		UsersInWorkcenterUrl = airbus.mes.worktracker.util.ModelManager
				.replaceURI(UsersInWorkcenterUrl, "$Site",
						airbus.mes.settings.ModelManager.site);
		UsersInWorkcenterUrl = airbus.mes.worktracker.util.ModelManager
				.replaceURI(UsersInWorkcenterUrl, "$WorkCenter",
						//"1TL1H13");
						airbus.mes.settings.ModelManager.station);
		return UsersInWorkcenterUrl;
	},
	loadUserListModel : function() {
		this.core.getModel("UserListModel").loadData(
				this.getUsersInWorkcenterUrl(), null, false);
	},

	/***************************************************************************
	 * Made a Global model for User List and User Detail
	 **************************************************************************/
	setCurrentOperator : function(oprtr) {

		if (oprtr === undefined || oprtr == "") {
			var userDetailModel = sap.ui.getCore().getModel("userDetailModel")
					.getData().Rowsets.Rowset[0].Row[0];
			this.currentOperator = {
				'fname' : userDetailModel.first_name,
				'lname' : userDetailModel.last_name,
				'user_id' : userDetailModel.user_id,
				'image' : undefined
			};

		} else
			this.currentOperator = {
				'fname' : oprtr.first_name,
				'lname' : oprtr.last_name,
				'user_id' : oprtr.user_id,
				'image' : undefined
			};

		var currentOperatorModel = sap.ui.getCore().getModel(
				"currentOperatorModel");
		currentOperatorModel.setData(this.currentOperator);
		currentOperatorModel.refresh();
	},

	/***************************************************************************
	 * Load operations assigned to a user
	 **************************************************************************/
	loadUserOperationsModel : function() {
		var OperationUrl = this.urlModel.getProperty("getOperationsForUser");
		OperationUrl = airbus.mes.worktracker.util.ModelManager.replaceURI(
				OperationUrl, "$Site", airbus.mes.settings.ModelManager.site);
		OperationUrl = airbus.mes.worktracker.util.ModelManager.replaceURI(
		// OperationUrl, "$User", "S007C96");
		OperationUrl, "$User", this.currentOperator.user_id);

		sap.ui.getCore().getModel("userOperationsModel").loadData(OperationUrl,
				null, false);
	},

	/***************************************************************************
	 * Get URL for Operation Confirmation
	 **************************************************************************/
	getConfirmationUrl : function(userId, password, confirmationType,
			percentConfirm, sfcStepRef, reasonCodeText) {
		var totalPartialConfirmationUrl = this.urlModel
				.getProperty("operationConfirmatonUrl");
		totalPartialConfirmationUrl = airbus.mes.worktracker.util.ModelManager
				.replaceURI(totalPartialConfirmationUrl, "$userId", userId);
		totalPartialConfirmationUrl = airbus.mes.worktracker.util.ModelManager
				.replaceURI(totalPartialConfirmationUrl, "$password", password);
		totalPartialConfirmationUrl = airbus.mes.worktracker.util.ModelManager
				.replaceURI(totalPartialConfirmationUrl, "$confirmationType",
						confirmationType);
		totalPartialConfirmationUrl = airbus.mes.worktracker.util.ModelManager
				.replaceURI(totalPartialConfirmationUrl, "$percentConfirm",
						percentConfirm);
		totalPartialConfirmationUrl = airbus.mes.worktracker.util.ModelManager
				.replaceURI(totalPartialConfirmationUrl, "$sfcStepRef",
						sfcStepRef);
		totalPartialConfirmationUrl = airbus.mes.worktracker.util.ModelManager
				.replaceURI(totalPartialConfirmationUrl, "$resonCodeText",
						reasonCodeText);
		return totalPartialConfirmationUrl;

	}
};

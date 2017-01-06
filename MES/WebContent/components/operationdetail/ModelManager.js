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
	badgeReader:undefined,
	brOnMessageCallBack:function (data) {},
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {

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
			bundleName : "airbus.mes.operationdetail.config.url_config",
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

		airbus.mes.shell.ModelManager.createJsonModel(core,["reasonCodeModel"]);


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

		return urlStartOperation;
	},

	/***************************************************************************
	 * Get URL for Pause Operation
	 **************************************************************************/
	getUrlPauseOperation : function(data) {
		var urlPauseOperation = this.urlModel.getProperty("pauseOperation");
		urlPauseOperation = airbus.mes.shell.ModelManager.replaceURI(urlPauseOperation, "$Operation", data.operation_no);
		urlPauseOperation = airbus.mes.shell.ModelManager.replaceURI(urlPauseOperation, "$Sfc", data.sfc);
		urlPauseOperation = airbus.mes.shell.ModelManager.replaceURI(urlPauseOperation, "$Site",airbus.mes.settings.ModelManager.site);
		urlPauseOperation = airbus.mes.shell.ModelManager.replaceURI(urlPauseOperation, "$Resource", "DEFAULT");
		return urlPauseOperation;
	},

	/***************************************************************************
	 * Get URL for Operation Confirmation
	 **************************************************************************/
	getConfirmationUrl : function(userId, password, confirmationType,
			percentConfirm, sfcStepRef, reasonCodeText, Mode, ID, pin,osw) {
		var totalPartialConfirmationUrl = this.urlModel
				.getProperty("operationConfirmatonUrl");
		totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
				totalPartialConfirmationUrl, "$userId", userId.toUpperCase());
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
				totalPartialConfirmationUrl, "$ID", ID);
		totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
				totalPartialConfirmationUrl, "$pin", pin);
		totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
				totalPartialConfirmationUrl, "$osw", osw);
		
		return totalPartialConfirmationUrl;

	},
	

		confirmOperation : function(userId, password, confirmationType,percentConfirm, sfcStepRef, reasonCodeText, Mode, ID, pin, sMessageError, sMessageSuccess,osw) {
			var url = this.getConfirmationUrl(userId, password, confirmationType,percentConfirm, sfcStepRef, reasonCodeText, Mode, ID, pin,osw);
			var flagSuccess;
			jQuery
					.ajax({
						url : url,
						async : false,
						error : function(xhr, status, error) {
							airbus.mes.operationdetail.ModelManager.messageShow(sMessageError);
							flagSuccess = false;
	
						},
						success : function(data, status, xhr) {
							flagSuccess =true;
							flagSuccess = airbus.mes.operationdetail.ModelManager.ajaxMsgHandler(data,sMessageSuccess);
							/*if (result.Rowsets.Rowset) {
	
								if (result.Rowsets.Rowset[0].Row) {
	
									if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
										airbus.mes.operationdetail.ModelManager
												.messageShow(sMessageSuccess);
										flagSuccess = true;
									} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
										airbus.mes.operationdetail.ModelManager
												.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
										flagSuccess = false;
									} else {
										airbus.mes.operationdetail.ModelManager
												.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
										flagSuccess = true;
									}
								}
								else{
									//TODO
	//								//case if no row
									if(result.Rowsets.Rowset[0].Message){
										airbus.mes.operationdetail.ModelManager.messageShow(result.Rowsets.Rowset[0].Message);
									}
								}
							}
							else{
								//TODO
								//case if no rowset
							}*/
						}
					});
		return flagSuccess;
	},
	ajaxMsgHandler : function(data, Message) {
		var flagSuccess;
		var sMessage = "";

		if (data.Rowsets.FatalError != undefined) {
			
			airbus.mes.operationdetail.ModelManager
			.messageShow(data.Rowsets.FatalError);
			flagSuccess = false;
			

		} else if (data.Rowsets.Messages != undefined) {
			// Need to implement Server message
			airbus.mes.operationdetail.ModelManager
					.messageShow(data.Rowsets.Messages[0].Message)
					flagSuccess = false;
		}  else if (data.Rowsets.Rowset != undefined) {
			// [0].Row[0].Message != undefined
			if (data.Rowsets.Rowset[0].Row[0].Message_Type != undefined) {
//				Check if message is in Message or Message_ID
				if( data.Rowsets.Rowset[0].Row[0].Message_ID !== undefined ) {
					sMessage = data.Rowsets.Rowset[0].Row[0].Message_ID;
				} else {
					sMessage = data.Rowsets.Rowset[0].Row[0].Message;
				}
				
				airbus.mes.operationdetail.ModelManager.messageShow(airbus.mes.operationdetail.oView.getModel("i18n").getProperty(sMessage));
				if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S"){
					flagSuccess = true;
				} else {
					flagSuccess = false;
				}

			} else {
				airbus.mes.operationdetail.ModelManager.messageShow(Message);
				flagSuccess = false;
				
			}
		}
		return flagSuccess;
	},
};

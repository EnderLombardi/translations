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
			bundleUrl : "../components/operationdetail/config/url_config.properties",
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
			percentConfirm, sfcStepRef, reasonCodeText, Mode, ID, pin) {
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
				totalPartialConfirmationUrl, "$ID", ID);
		totalPartialConfirmationUrl = airbus.mes.shell.ModelManager.replaceURI(
				totalPartialConfirmationUrl, "$pin", pin);
		return totalPartialConfirmationUrl;

	},
	/************************************************************************ BadeReader functions */
connectBadgeReader: function(brOnMessageCallBack ){
		
	if(!this.badgeReader){
	
	var wsUrl; 
		
	if(location.protocal = "https:")
		wsUrl = "wss://" + this.urlModel.getProperty("badgeReader");
	else
	wsUrl = "ws://" + this.urlModel.getProperty("badgeReader");
	wsUrl = "ws://localhost:754/TouchNTag";
	this.badgeReader = new WebSocket(wsUrl);
	
	this.badgeReader.onopen = this.brOnOpen;
	this.badgeReader.onerror = this.brOnError;
	this.badgeReader.onclose = this.brOnClose;
	this.badgeReader.onmessage = this.brOnMessage;
	
	}
	
	this.brOnMessageCallBack = brOnMessageCallBack;
},

brOnOpen: function(){	
	console.log("Connection is opened..."); 
},
brOpen : function(){
	 var msgData = {"BadgeOrRFID":"BADGE","CommandName":"CONNECT","Language":null,"ReaderName":null};
	  if(this.badgeReader)
		  this.badgeReader.send(JSON.stringify(msgData));
},

brOnMessage : function (evt){ 
 var scanData = JSON.parse(evt.data);	
 var uID  = scanData.Message;			// UID
 var badgeID = scanData.BadgeOrRFID;     // BID
console.log(scanData);

if(!this.brOnMessageCallBack)
	this.brOnMessageCallBack(scanData);	
},
brStartReading: function(){
   var msgData = {"BadgeOrRFID":"BADGE","CommandName":"START_READING","Language":null,"ReaderName":null};
      if(this.badgeReader)
    	  this.badgeReader.send(JSON.stringify(msgData));
  
},
brStopReading:function(){
   var msgData = {"BadgeOrRFID":"BADGE","CommandName":"STOP_READING","Language":null,"ReaderName":null};
      if(this.badgeReader)
    	  this.badgeReader.send(JSON.stringify(msgData));
  
},
brClose:function(){
   var msgData = {"BadgeOrRFID":"BADGE","CommandName":"DISCONNECT","Language":null,"ReaderName":null};
      if(this.badgeReader)
    	  this.badgeReader.send(JSON.stringify(msgData));
  
},
brOnError : function(evnt){
   alert("Error has occured In Badge Reader Connection");
},

brOnClose : function(){ 
 // websocket is closed.
  console.log("Connection is closed..."); 
}		               

};

// airbus.mes.operationdetail.ModelManager.init(sap.ui.getCore());

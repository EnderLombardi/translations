"use strict";
jQuery.sap.declare("airbus.mes.shell.ModelManager")
airbus.mes.shell.ModelManager = {
		urlModel : undefined,
		queryParams : jQuery.sap.getUriParameters(),
		
		i18nModel: undefined,
				
		init : function(core) {
			
			core.setModel(new sap.ui.model.json.JSONModel(),"userDetailModel");	
			core.setModel(new sap.ui.model.json.JSONModel(),"userSettingModel");
			
		
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
				bundleUrl : "../shell/config/url_config.properties",
				bundleLocale : dest
			});
			
			if (  dest === "sopra" ) {

				var oModel = airbus.mes.shell.ModelManager.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;
					
				for (var prop in oModel) {
					if (oModel[prop].slice(-5) != ".json" ) {
					oModel[prop] += "&j_user=" + Cookies.getJSON("login").user + "&j_password="  + Cookies.getJSON("login").mdp; 
					}
				}
			}
							
			// TODO DEPLACE this in shell controller and when service is ok remove all of this function
			this.loadUserDetail();		
			//this.loadUserSettings();
			
			var i18nModel = new sap.ui.model.resource.ResourceModel({
	            bundleUrl : "./i18n/i18n.properties",
	         });
			
			core.setModel(i18nModel, "ShellI18n");
			
			var MIIi18nModel = new sap.ui.model.resource.ResourceModel({
	            bundleUrl : "./i18n/mii_i18n.properties",
	         });
			core.setModel(MIIi18nModel, "miiI18n");
		},
				
		loadUserDetail : function() {
			
			var oViewModel = sap.ui.getCore().getModel("userDetailModel");
			oViewModel.loadData(this.urlModel.getProperty("urluserdetail"), null, false);
		
		},


		getRoles : function() {
			var rep = jQuery.ajax({
				async : false,
				url : this.urlModel.getProperty('urlgetroles'),
				type : 'GET',
			});

			return JSON.parse(rep.responseText);
		},

		json2xml : function(o, tab) {
			var toXml = function(v, name, ind) {
				var xml = "";
				if (v instanceof Array) {
					for (var i = 0, n = v.length; i < n; i++)
						xml += ind + toXml(v[i], name, ind + "\t") + "\n";
				} else if (typeof (v) == "object") {
					var hasChild = false;
					xml += ind + "<" + name;
					for ( var m in v) {
						if (m.charAt(0) == "@")
							xml += " " + m.substr(1) + "=\"" + v[m].toString()
									+ "\"";
						else
							hasChild = true;
					}
					xml += hasChild ? ">" : "/>";
					if (hasChild) {
						for ( var m in v) {
							if (m == "#text")
								xml += v[m];
							else if (m == "#cdata")
								xml += "<![CDATA[" + v[m] + "]]>";
							else if (m.charAt(0) != "@")
								xml += toXml(v[m], m, ind + "\t");
						}
						xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "")
								+ "</" + name + ">";
					}
				} else {
					xml += ind + "<" + name + ">" + v.toString() + "</" + name
							+ ">";
				}
				return xml;
			}, xml = "";
			for ( var m in o)
				xml += toXml(o[m], m, "");
			xml =  xml.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
			return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
		},

		/***************************************************************************
		 * Replace URL Parameters
		 **************************************************************************/
		replaceURI : function(sURI, sFrom, sTo) {
			return sURI.replace(sFrom, encodeURIComponent(sTo));
		},
		
		/********************************
		 * Show message Toast
		 */
		messageShow : function(text) {
	        sap.m.MessageToast
	        .show(
	        		text,
	                      {
	                             duration : 3000,
	                             width : "25em",
	                             my : "center center",
	                             at : "center center",
	                             of : window,
	                             offset : "0 0",
	                             collision : "fit fit",
	                             onClose : null,
	                             autoClose : true,
	                             animationTimingFunction : "ease",
	                             animationDuration : 1000,
	                             closeOnBrowserNavigation : true
	                      });
	               
	  },
	  
	  /********************************
		 * Get URL for My Profile
		 */
	  getMyProfileUrl:function(bID,user,pass,pinCode,uID){
		  var myProfileUrl = this.urlModel.getProperty("urlMyProfileSave");
		  myProfileUrl = airbus.mes.shell.ModelManager.replaceURI(
				  myProfileUrl, "$badgeID", bID);
		  myProfileUrl = airbus.mes.shell.ModelManager.replaceURI(
				  myProfileUrl, "$userID", user);
		  myProfileUrl = airbus.mes.shell.ModelManager.replaceURI(
				  myProfileUrl, "$password", pass);
		  myProfileUrl = airbus.mes.shell.ModelManager.replaceURI(
				  myProfileUrl, "$pinCode", pinCode);
		  myProfileUrl = airbus.mes.shell.ModelManager.replaceURI(
				  myProfileUrl, "$UID", uID);
		  
		  return myProfileUrl;		  
	  },
	  
		/************************************************************************ BadeReader functions */
	  connectBadgeReader: function(brOnMessageCallBack, response ){
	  		
	  	if(!this.badgeReader || airbus.mes.shell.ModelManager.badgeReader.readyState==3){
	  	
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
	  	this.brResponseMessage = response;
	  },

	  brOnOpen: function(){	
	  	console.log("Connection is opened..."); 
	  	if(airbus.mes.shell.ModelManager.brOnMessageCallBack)
	  		airbus.mes.shell.ModelManager.brOnMessageCallBack();	
	  },
	  brOpen : function(){
	  	 var msgData = {"BadgeOrRFID":"BADGE","CommandName":"CONNECT","Language":null,"ReaderName":null};
	  	  if(this.badgeReader)
	  		  this.badgeReader.send(JSON.stringify(msgData));
	  },

	  brOnMessage : function (evt){ 
	   var scanData = JSON.parse(evt.data);	
	  console.log(scanData);

	  if(airbus.mes.shell.ModelManager.brResponseMessage && scanData.Message)
	  	airbus.mes.shell.ModelManager.brResponseMessage(scanData);	

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

}

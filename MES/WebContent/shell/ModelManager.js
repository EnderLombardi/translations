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
						
			// TODO DEPLACE this in shell controller and when service is ok remove all of this function
			this.loadUserDetail();		
			//this.loadUserSettings();
			
			var i18nModel = new sap.ui.model.resource.ResourceModel({
	            bundleUrl : "./i18n/i18n.properties",
	         });
			
			
//			this.i18nModel = new sap.ui.model.resource.ResourceModel({
//				bundleUrl : "i18n/messageBundle.properties",
//				bundleLocale : core.getConfiguration().getLanguage()
//			});
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

}

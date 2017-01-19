"use strict";
jQuery.sap.declare("airbus.mes.acpnglinks.model.ModelManager")

airbus.mes.acpnglinks.model.ModelManager = {

	urlModel : undefined,
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
			bundleName : "airbus.mes.acpnglinks.config.url_config",
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
		
//		"acpnglinksConfigModel", 
		airbus.mes.shell.ModelManager.createJsonModel(core,["acpnglinksWorkOrderDetail"]);
		this.loadacpnglinksWorkOrderDetail();
	},


	loadacpnglinksWorkOrderDetail : function() {
		var oModel = sap.ui.getCore().getModel("acpnglinksWorkOrderDetail");
		oModel.loadData(this.getacpnglinksWorkOrderDetail(), null, false);
		var test = this.transformTreeData(oModel.oData.Rowsets.Rowset[0].Row);
	},
	
	getacpnglinksWorkOrderDetail : function() {
		var url = this.urlModel.getProperty("acpnglinksWorkOrderDetail");
		url = airbus.mes.shell.ModelManager.replaceURI(url, "$site", airbus.mes.settings.ModelManager.site);
		return url;
	},
	
	transformTreeData : function(nodesIn) {
		var nodes = [];          // ’deep’ object structure
		var nodeMap = {};      // ’map’, each node is an attribute
	
		if (nodesIn) {
			var nodeOut;
			var parentId;
	
			for (var i = 0; i < nodesIn.length; i++) {
				var nodeIn = nodesIn[i];
				nodeOut = {
					current : nodesIn,
					children : []
				}
				parentId = nodeIn.Father_ID;
				if (parentId && parentId.length > 0) {
	
					var parent = nodeMap[nodeIn.Father_ID];
					if (parent) {
						parent.children.push(nodeOut);
					}
	
				} else {
					// there is no parent, must be top level
					nodes.push(nodeOut);
				}
	
				// add the node to the node map, which is a simple
				// 1-level list of all nodes
				nodeMap[nodeOut.Ref] = nodeOut;
			}
		}
		return nodes;
	}
	
};



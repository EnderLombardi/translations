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
		var transformedModel = this.transformTreeData(oModel.oData.Rowsets.Rowset[0].Row);
		oModel.oData.Rowsets.Rowset[0].Row = transformedModel;
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
					Type : nodeIn.Type,
					Ref : nodeIn.Ref,
					Review_end : nodeIn.Review_end,
					Note : nodeIn.Note,
					Family_target : nodeIn.Family_target,
					Confirmed_time : nodeIn.Confirmed_time,
					STV : nodeIn.STV,
					ACP_workstation : nodeIn.ACP_workstation,
					CA : nodeIn.CA,
					Father_link : nodeIn.Father_link,
					Blocking_reason : nodeIn.Blocking_reason,
				    User_status : nodeIn.User_status,
					Execution_station : nodeIn.Execution_station,
					Origin_workstation : nodeIn.Origin_workstation,
					TDL : nodeIn.TDL,
					Upper_family : nodeIn.Upper_family,
					Zoning : nodeIn.Zoning,
					Material_description : nodeIn.Material_description,
					ATA : nodeIn.ATA,
					Father_Type : nodeIn.Father_Type,
					Father_ID : nodeIn.Father_ID,
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
	
				// add the node to the node map
				nodeMap[nodeOut.Ref] = nodeOut;
			}
		}
		return nodes;
	}
	
};



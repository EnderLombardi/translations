"use strict";
jQuery.sap.declare("airbus.mes.acpnglinks.model.ModelManager")

airbus.mes.acpnglinks.model.ModelManager = {

	urlModel : undefined,
	brOnMessageCallBack:function (data) {},

	/**
	 * Init of the model
	 */	
	init : function(core) {

		this.core = core;

		// Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.acpnglinks.config.url_config");
		
		// Get main model of this component, 
		airbus.mes.shell.ModelManager.createJsonModel(core,["acpnglinksWorkOrderDetail"]);
		this.loadacpnglinksWorkOrderDetail();
	},


	/**
	 * Load the mai model and transforms it
	 */
	loadacpnglinksWorkOrderDetail : function() {
		var oModel = sap.ui.getCore().getModel("acpnglinksWorkOrderDetail");
		oModel.loadData(this.getacpnglinksWorkOrderDetail(), null, false);
		var transformedModel = this.transformTreeData(oModel.getData().Rowsets.Rowset[0].Row);
		oModel.getData().Rowsets.Rowset[0].Row = transformedModel;
	},
	
	/**
	 * get Model using url
	 */	
	getacpnglinksWorkOrderDetail : function() {
		var url = this.urlModel.getProperty("acpnglinksWorkOrderDetail");
		url = airbus.mes.shell.ModelManager.replaceURI(url, "$site", airbus.mes.settings.ModelManager.site);
		return url;
	},
	
	/**
	 * Transform a flat JSON model into a TreeTable friendly model using map
	 */
	transformTreeData : function(nodesIn) {
		var nodes = [];        // ’deep’ object structure
		var nodeMap = {};      // ’map’, each node is an attribute
	
		if (nodesIn) {
			var nodeOut;
			var parentId;
	
			for (var i = 0; i < nodesIn.length; i++) {
				var nodeIn = nodesIn[i];
				nodeOut = {
					Type : nodeIn.Type,
					Reference : nodeIn.Reference,
					ReviewEnd : nodeIn.ReviewEnd,
					Note : nodeIn.Note,
					FamilyTarget : nodeIn.FamilyTarget,
					ConfirmedTime : nodeIn.ConfirmedTime,
					STV : nodeIn.STV,
					ACPWorkstation : nodeIn.ACPWorkstation,
					CA : nodeIn.CA,
					FatherLink : nodeIn.FatherLink,
					BlockingReason : nodeIn.BlockingReason,
				    UserStatus : nodeIn.UserStatus,
					ExecutionStation : nodeIn.ExecutionStation,
					OriginWorkstation : nodeIn.OriginWorkstation,
					TDL : nodeIn.TDL,
					UpperFamily : nodeIn.UpperFamily,
					Zoning : nodeIn.Zoning,
					MaterialDescription : nodeIn.MaterialDescription,
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
				nodeMap[nodeOut.Reference] = nodeOut;
			}
		}
		return nodes;
	}
	
};



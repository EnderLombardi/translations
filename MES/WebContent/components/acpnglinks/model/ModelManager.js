"use strict";
jQuery.sap.declare("airbus.mes.acpnglinks.model.ModelManager")

airbus.mes.acpnglinks.model.ModelManager = {

	urlModel: undefined,
	brOnMessageCallBack: function (data) { },

	/**
	 * Init of the model
	 */
	init: function (core) {

		this.core = core;

		// Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.acpnglinks.config.url_config");

		// Get main model of this component, 
		airbus.mes.shell.ModelManager.createJsonModel(core, ["acpnglinksWorkOrderDetail"]);

	},

	/**
	 * Check existing children in data
	 */ 
	checkExistingChildrentData: function () {
		var oModel = sap.ui.getCore().getModel("acpnglinksWorkOrderDetail");
		try {
			var aData = oModel.getData().Rowsets.Rowset[0].Row;
			var i = 0, nLength = aData.length, bFound = false;
			while (i < nLength && bFound == false) {
				if (aData[i].children.length > 0) {
					bFound = true;
				}
				i++;
			}
			;
			return bFound;
		} catch (e) {
			return false;
		}
	},


	/**
	 * Load the main model and transforms it
	 */
	loadacpnglinksWorkOrderDetail: function () {
		try{
		var oModel = sap.ui.getCore().getModel("acpnglinksWorkOrderDetail");

		jQuery.ajax({
			type: 'post',
			url: this.getacpnglinksWorkOrderDetail(),
			contentType: 'application/json',
			async: false,
			data: JSON.stringify({
				"site": airbus.mes.acpnglinks.oView.getController().getOwnerComponent().getSite(),
				"sfcStep": "STEP"
				
			}),

			success: function (data) {

				try {
					//DMI
					// Rest response with only one list, need same schema
					var jsonFormat = {
						"Rowsets": {
							"Rowset": [{
								"Columns": {
									"Column": [
										{
											"Name": "Type",
											"SourceColumn": "Type",
											"Visible": "true",
											"Sort": 0
										},
										{
											"Name": "reference",
											"SourceColumn": "reference",
											"Visible": "true",
											"Sort": 1
										},
										{
											"Name": "reviewEnd",
											"SourceColumn": "reviewEnd",
											"Visible": "true",
											"Sort": 2
										},
										{
											"Name": "note",
											"SourceColumn": "note",
											"Visible": "true",
											"Sort": 3
										},
										{
											"Name": "familyTarget",
											"SourceColumn": "familyTarget",
											"Visible": "true",
											"Sort": 4
										},
										{
											"Name": "confirmedTime",
											"SourceColumn": "confirmedTime",
											"Visible": "false",
											"Sort": 5
										},
										{
											"Name": "stv",
											"SourceColumn": "stv",
											"Visible": "false",
											"Sort": 6
										},
										{
											"Name": "acpWorkstation",
											"SourceColumn": "acpWorkstation",
											"Visible": "false",
											"Sort": 7
										},
										{
											"Name": "ca",
											"SourceColumn": "ca",
											"Visible": "false",
											"Sort": 8
										},
										{
											"Name": "fatherLink",
											"SourceColumn": "fatherLink",
											"Visible": "false",
											"Sort": 9
										},
										{
											"Name": "blockingReason",
											"SourceColumn": "blockingReason",
											"Visible": "false",
											"Sort": 10
										},
										{
											"Name": "userStatus",
											"SourceColumn": "userStatus",
											"Visible": "false",
											"Sort": 11
										},
										{
											"Name": "executionStation",
											"SourceColumn": "executionStation",
											"Visible": "false",
											"Sort": 12
										},
										{
											"Name": "originWorkstation",
											"SourceColumn": "originWorkstation",
											"Visible": "false",
											"Sort": 13
										},
										{
											"Name": "tdl",
											"SourceColumn": "tdl",
											"Visible": "false",
											"Sort": 14
										},
										{
											"Name": "upperFamily",
											"SourceColumn": "upperFamily",
											"Visible": "false",
											"Sort": 15
										},
										{
											"Name": "zoning",
											"SourceColumn": "zoning",
											"Visible": "false",
											"Sort": 16
										},
										{
											"Name": "materialDescription",
											"SourceColumn": "materialDescription",
											"Visible": "false",
											"Sort": 17
										},
										{
											"Name": "ata",
											"SourceColumn": "ata",
											"Visible": "false",
											"Sort": 18
										},
										{
											"Name": "fatherType",
											"SourceColumn": "fatherType",
											"Visible": "never",
											"Sort": 19
										},
										{
											"Name": "predId",
											"SourceColumn": "predId",
											"Visible": "never",
											"Sort": 20
										}
									]
								}, "Row": []
							}]
						}
					};
					jsonFormat.Rowsets.Rowset[0].Row = data.elementList
					oModel.setData(jsonFormat);
					oModel.refresh();

					//Local
					//oModel.setData(data);
					//oModel.refresh();

				} catch (e) {

					return;
				}

			},
			error: function (error, jQXHR) {
				console.log('acpnglinksWorkOrderDetail error', error);
			}
		});

		// If is temporary until airbus side create service to get data.
		if (oModel.getData().Rowsets.Rowset[0].Row != undefined){
			var transformedModel = this.transformTreeData(oModel.getData().Rowsets.Rowset[0].Row);
			oModel.getData().Rowsets.Rowset[0].Row = transformedModel;
		}
		}catch(error){
// do nothing no model			
		}

	},

	/**
	 * get Model using url
	 */
	getacpnglinksWorkOrderDetail: function () {
		try{
		var url = this.urlModel.getProperty("acpnglinksWorkOrderDetail");
//		  url = airbus.mes.shell.ModelManager.replaceURI(url, "$site", airbus.mes.acpnglinks.oView.getController().getOwnerComponent().getSite());
//		  url = airbus.mes.shell.ModelManager.replaceURI(url, "$sfcstep", airbus.mes.acpnglinks.oView.getController().getOwnerComponent().getSite());
//        url = airbus.mes.shell.ModelManager.replaceURI(url, "$workorder", airbus.mes.acpnglinks.oView.getController().getOwnerComponent().getWorkOrder());
		return url;
		}catch(error){
			return "";
		}
	},

	/**
	 * Transform a flat JSON model into a TreeTable friendly model using map
	 */
	transformTreeData: function (nodesIn) {
		var nodes = [];        // ’deep’ object structure
		var nodeMap = {};      // ’map’, each node is an attribute

		if (nodesIn) {
			var nodeOut;
			var parentId;

			for (var i = 0; i < nodesIn.length; i++) {
				var nodeIn = nodesIn[i];
				nodeOut = {
					Type: nodeIn.type,
					Reference: nodeIn.acpId,
					ReviewEnd: nodeIn.reviewEnd,
					Note: nodeIn.note,
					FamilyTarget: nodeIn.familyTarget,
					ConfirmedTime: nodeIn.confirmedTime,
					STV: nodeIn.STV,
					ACPWorkstation: nodeIn.acpWorkstation,
					CA: nodeIn.ca,
					FatherLink: nodeIn.fatherLink,
					BlockingReason: nodeIn.blockingReason,
					UserStatus: nodeIn.userStatus,
					ExecutionStation: nodeIn.executionStation,
					OriginWorkstation: nodeIn.originWorkstation,
					TDL: nodeIn.tdl,
					UpperFamily: nodeIn.upperFamily,
					Zoning: nodeIn.zoning,
					MaterialDescription: nodeIn.materialDescription,
					ATA: nodeIn.ata,
					Level: nodeIn.level,
					Father_Type: nodeIn.father_Type,
					Father_ID: nodeIn.predId,
					children: []
				}
				parentId = nodeIn.predId;
				if (parentId && parentId.length > 0 && parentId != '?') {
					var parent = nodeMap[nodeIn.predId];

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
		this.setTreeLevel(nodes, 1);
		return nodes;
	},

	/**
	 * Determine levels in a tree recursive
	 */
	setTreeLevel: function (nodes, i) {
		i++;
		var nodelength = 0;
		nodelength = nodes.length
		if (nodes.length === undefined) {
			nodes.Level = i - 1;
			for (var k = 0; k < nodes.children.length; k++) {
				this.setTreeLevel(nodes.children[k], i);
			}
		} else {
			for (var j = 0; j < nodelength; j++) {
				nodes[j].Level = i - 1;
				for (var k = 0; k < nodes[j].children.length; k++) {
					this.setTreeLevel(nodes[j].children[k], i);
				}
			}
		}
	}
};



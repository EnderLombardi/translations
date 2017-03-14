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
		var sLinkType;
		var hasColumns = false;
		var jsonFormat;
		try{
			if ( oModel.getData().Rowsets.Rowset[0].Columns.Column[0] !== undefined ){
				hasColumns = true;
			}
		}catch(error){
			hasColumns = false;
		}
		jQuery.ajax({
			type: 'post',
			url: this.getacpnglinksWorkOrderDetail(),
			contentType: 'application/json',
			async: false,
			data: JSON.stringify({
				"site": airbus.mes.acpnglinks.oView.getController().getOwnerComponent().getSite(),
				"sfcStep": airbus.mes.acpnglinks.oView.getController().getOwnerComponent().getSfcstep(),
				"phStationBO": airbus.mes.acpnglinks.oView.getController().getOwnerComponent().getPhStation()
			}),

			success: function (data) {

				try {
					//DMI
					// Rest response with only one list, need same schema
					if (hasColumns && oModel.getData().Rowsets.Rowset[0].Row){
						jsonFormat = {
							"Rowsets": {
								"Rowset": [{
									"Columns": {
										"Column": oModel.getData().Rowsets.Rowset[0].Columns.Column
									}, 
									"Row": []
								}]
							}
						};
								
					}else{
						
					jsonFormat = {
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
					}
					jsonFormat.Rowsets.Rowset[0].Row = data.elementList;
					jsonFormat.linkTypeToDisplay = data.linkTypeToDisplay.toUpperCase();
					oModel.setData(jsonFormat);
					oModel.refresh(true);

				} catch (e) {
					oModel.setData(undefined);
					oModel.refresh(true)
					return;
				}

			},
			error: function (error, jQXHR) {
				console.log('acpnglinksWorkOrderDetail error', error);
			}
		});

		// If is temporary until airbus side create service to get data.
		if (oModel.getData().Rowsets.Rowset[0].Row != undefined){
			switch (oModel.getData().linkTypeToDisplay){
				case "MANUAL":
					sLinkType = ""
					break;
				case "SAP":
					sLinkType = "X"
					break;
				default: //BOTH or anything else
					 sLinkType = "BOTH"
					break;
			}
			var transformedModel = this.transformTreeData(oModel.getData().Rowsets.Rowset[0].Row, sLinkType);
			oModel.getData().Rowsets.Rowset[0].Row = transformedModel;
			oModel.refresh(true);
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
		return url;
		}catch(error){
			return "";
		}
	},

	/**
	 * Transform a flat JSON model into a TreeTable friendly model using map
	 */
	transformTreeData: function (nodesIn , sLink) {
		var nodes = [];        // ’deep’ object structure
		var nodeMap = {};      // ’map’, each node is an attribute
		if (sLink === undefined){
			sLink = "BOTH";
		}
		if (nodesIn) {
			var nodeOut;
			var parentId;
			var lastParent;

			for (var i = 0; i < nodesIn.length; i++) {
				var nodeIn = nodesIn[i];
				nodeOut = {
					Type: nodeIn.type,
					acpid: nodeIn.acpId,
					Reference: nodeIn.reference,
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
					linkType: nodeIn.linkType,
					children: []
				}
				if( i == 0){
					nodeIn.linkType = sLink;
				}
				parentId = nodeIn.predId;
				if (nodeIn.linkType == sLink || sLink == "BOTH"){
					if (parentId && parentId.length > 0 && parentId != '?') {
						var parent = nodeMap[parentId];
						if (parent) {
							parent.children.push(nodeOut);
							lastParent = nodeIn.acpId;
						}else{
							parent = nodeMap[lastParent];
							if (parent){
								parent.children.push(nodeOut);
								lastParent = nodeIn.acpId;
							} else {
								nodes.push(nodeOut);
								lastParent = nodeIn.acpId
								var index = airbus.mes.acpnglinks.util.Formatter.findIndexObjectKey(nodesIn,"predId",parentId,0);
								while (index != null) {
									var oldIndex = index;
									nodesIn[index].predId = nodeIn.acpId;	
									index = airbus.mes.acpnglinks.util.Formatter.findIndexObjectKey(nodesIn,"predId",parentId,oldIndex+1)
								}
							}
						}

					} else { 
						// there is no parent, must be top level
						nodes.push(nodeOut);
						lastParent = nodeIn.acpId
					}

					if (nodeIn.linkType == sLink || sLink == "BOTH"){
						// add the node to the node map
						nodeMap[nodeOut.acpid] = nodeOut;
					}
				}else if (!parentId || parentId == 0  || parentId == '?'){
					lastParent = "";
				}
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



"use strict";
jQuery.sap.declare("airbus.mes.util.TreeHelper");
airbus.mes.util.TreeHelper = {
	
	transformTreeData : function(nodesIn) {
		var nodes = [];          // ’deep’ object structure
		var nodeMap = {};      // ’map’, each node is an attribute
	
		if (nodesIn) {
			var nodeOut;
			var parentId;
	
			for (var i = 0; i < nodesIn.length; i++) {
				var nodeIn = nodesIn[i];
				nodeOut = {     
					id: nodeIn.ID,
					text: nodeIn.Text,
					type: nodeIn.Type,
					children: [] };
					parentId = nodeIn.ParentID;
	
				if (parentId && parentId.length > 0) {
	
					var parent = nodeMap[nodeIn.ParentID];
					if (parent) {
						parent.children.push(nodeOut);
					}
	
				} else {
					// there is no parent, must be top level
					nodes.push(nodeOut);
				}
	
				// add the node to the node map, which is a simple
				// 1-level list of all nodes
				nodeMap[nodeOut.id] = nodeOut;
			}
		}
		return nodes;
	}
}
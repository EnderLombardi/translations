"use strict";

sap.ui.controller("airbus.mes.displayOpeAttachments.controller.displayOpeAttachments", {

	//handle the tree table on click
	onToggleTreeTable: function (oEvent) {

		//initial var
		var treeTableArray = airbus.mes.displayOpeAttachments.util.ModelManager.treeTableArray;
		var iRowIndex = oEvent.getParameter("rowIndex");//row index (sapui5)
		var bExpanded = oEvent.getParameter("expanded");//expanding (true) or collapsing (false)

		//var linked to the array : index & last position
		var arrayIndex = this.findSelectedDocType(treeTableArray, iRowIndex);//index in the array
		var lastPosition = treeTableArray[arrayIndex].position;//position of the node collapsed/expanded in the array

		//UPDATE ARRAY PART
		//first we changed the isOpened boolean
		treeTableArray[arrayIndex].isOpened = !treeTableArray[arrayIndex].isOpened; //isOpened boolean changed because of the click 

		//then we fill the position attribute of the documents that belong to the doc type selected
		while (treeTableArray[arrayIndex + 1] && !treeTableArray[arrayIndex + 1].isDocType) { //while we haven't reach the new doc type
			arrayIndex++;
			if (bExpanded) {
				treeTableArray[arrayIndex].position = lastPosition + 1;//we fill position 
				lastPosition++;
			} else {
				treeTableArray[arrayIndex].position = null;//we null the position
			}
		}

		//to finish to update treeTableArray, we update the position attribute of the documents that belong to the newt docType 
		//we don't need to do it for those before the doc type selected because the positions don't change
		for (var i = arrayIndex + 1; i < treeTableArray.length; i++) {
			if (treeTableArray[i].position) {// if not undefined
				lastPosition++;
				treeTableArray[i].position = lastPosition;
			}
		}

		//CSS PART
		//we add and remove class for the rows displayed
		var doaTable = $("#displayOpeAttachmentsView--DOATable-table").children("tbody").children();
		var positionMax;
		for (var j = 0; j < doaTable.length; j++) {
			positionMax = treeTableArray[j].position + 1;
			if (treeTableArray[j].position !== null && !treeTableArray[j].isDocType) {
				this.selectTreeTableRow(positionMax).addClass("document");
			} else if (treeTableArray[j].position !== null && treeTableArray[j].isDocType) {
				this.selectTreeTableRow(positionMax).removeClass("document");
			} 
		}

		//we remove document class on rows with no data inside
		var k = doaTable.length - 1, rowIndex;
		while (treeTableArray[k].position === null) {
			rowIndex = treeTableArray[k].position + 1;
			this.selectTreeTableRow(rowIndex).removeClass("document");
			k--;
		}
	},

	//select in jquery the html row for a tree table
	selectTreeTableRow: function(i) {
		return $("#displayOpeAttachmentsView--DOATable-table").children("tbody").children(":nth-child(" + i + ")");
	},

	//find the selected doc type in the array (its index) based on the iRowIndex (in UI)
	findSelectedDocType: function (treeTableArray, iRowIndex) {
		var numberOfRows = 0, arrayIndex = 1;
		if (iRowIndex === 0) {//if first doc type => arrayIndex = 0
			return 0;
		} else {
			while (numberOfRows !== iRowIndex) {//we will increment to have the same numberofRows in the function than the iRowIndex (which represents the number of rows displayed)
				if (treeTableArray[arrayIndex].position !== null) {//if position it's displayed so we increment
					numberOfRows++;
				}
				arrayIndex++;
			}
			arrayIndex--;//cancel the last "arrayIndex++" of the last while loop
			return arrayIndex;//position in the array 
		}
	},


	//todo : get user action on the checkbox field
	onSelectLevel: function (oEvent) {
		var paramArray = [], shopOrderBO = undefined, routerBO = undefined, site = undefined, routerStepBO = undefined, previousSet;

		shopOrderBO = airbus.mes.stationtracker.ModelManager.stationInProgress.ShopOrderBO;
		//routerBO = something; TODO
		site = airbus.mes.settings.ModelManager.site;
		routerStepBO = airbus.mes.stationtracker.ModelManager.stationInProgress.RouterStepBO;

		//change operation/wo mode
		previousSet = airbus.mes.displayOpeAttachments.util.ModelManager.sSet;
		switch (previousSet) {
			case "O"://operation
				sap.ui.getCore().byId("displayOpeAttachmentsView--operationButton").setSelected(true);
				airbus.mes.displayOpeAttachments.util.ModelManager.sSet = "P";
				break;
			case "P"://work order
				sap.ui.getCore().byId("displayOpeAttachmentsView--workOrderButton").setSelected(true);
				airbus.mes.displayOpeAttachments.util.ModelManager.sSet = "O";
				break;
			default: //if Null
				break;
		}

		//fill the tab
		paramArray.push(shopOrderBO);
		paramArray.push(routerBO);
		paramArray.push(site);
		paramArray.push(routerStepBO);

		//load data in the model at the init of the component
		var oModule = airbus.mes.displayOpeAttachments.util.ModelManager;
		oModule.loadDOADetail();
		oModule.createTreeTableArray();
		this.onToggleTreeTable();
	},

});
"use strict";

sap.ui.controller("airbus.mes.displayOpeAttachments.controller.displayOpeAttachments", {

	firstVisibleRow: 0, //first row displayed (it changes on scroll)
	popUrl: null,

	/////////////////////////////////
	//	INIT/RENDERING
	/////////////////////////////////

	onAfterRendering: function () {
		this.init();
	},

	//create/update model + update view
	init: function () {
		this.selectDocumentFilter (this.getOwnerComponent().getSSet());

		var oModule = airbus.mes.displayOpeAttachments.util.ModelManager;
		oModule.loadDOADetail();
		var model = airbus.mes.displayOpeAttachments.oView.getModel("getOpeAttachments");
		if (model.oData.Rowsets && model.oData.Rowsets && model.oData.Rowsets.Rowset && model.oData.Rowsets.Rowset[0].Row) {
			oModule.createTreeTableArray();

			this.firstVisibleRow = 0;

			var oTTbl = airbus.mes.displayOpeAttachments.oView.byId("DOATable");
			var treeTableArray = airbus.mes.displayOpeAttachments.util.ModelManager.treeTableArray;
			oTTbl.setFirstVisibleRow(0);

			//reinitialize treetable view
			this.collapseAllNodes();//we collapse all so the treeExpandAll functions can work
			this.treeExpandAll(treeTableArray, oTTbl);
			this.updateTreeTableView(treeTableArray);
		}
	},

	//expand all nodes
	treeExpandAll: function (treeTableArray, oTTbl) {
		var nbOfDocTypes = this.getNbOfDocTypes(treeTableArray);
		for (var i = nbOfDocTypes; i > 0; i--) {
			oTTbl.expand(i - 1);
		}
	},

	getNbOfDocTypes: function (treeTableArray) {
		var nbOfDocTypes = 0;
		for (var i = 0; i < treeTableArray.length; i++) {
			if (treeTableArray[i].isDocType) {
				nbOfDocTypes++;
			}
		}
		return nbOfDocTypes;
	},

	/////////////////////////////////
	//	EVENTS FUNCTIONS
	/////////////////////////////////

	//event : scroll (top or bottom)
	//goal : apply css style for the urls (blue and underline) and click events
	onScroll: function (oEvent) {
		var newFirstVisibleRow = oEvent.mParameters.firstVisibleRow;
		var treeTableArray = airbus.mes.displayOpeAttachments.util.ModelManager.treeTableArray;

		this.updateTreeTableArrayOnScroll(treeTableArray, newFirstVisibleRow);
		this.updateTreeTableView(treeTableArray);
	},

	//event : expand or collapse
	//goal : apply css style for the urls (blue and underline) and click events
	onToggleTreeTable: function (oEvent) {
		var treeTableArray = airbus.mes.displayOpeAttachments.util.ModelManager.treeTableArray;
		var bExpanded = oEvent.getParameter("expanded");//expanding (true) or collapsing (false)
		var iRowIndex = oEvent.getParameter("rowIndex");//row index (sapui5)
		var documentsGap;

		//we check if the first row has changed, this case happens when we have scroll bottom and collapsed an element, which ends with less than 9 elements in the array
		if (!bExpanded) {
			//if the first row has changed, we may have a gap of elements in the view to anticipate
			documentsGap = this.checkIfFirstRowChanged(treeTableArray, iRowIndex);//indicate the number of rows in the gap
		}
		if (!bExpanded && documentsGap > 0) {
			this.updateTreeTableArrayIfFirstRowChanged(oEvent, treeTableArray, documentsGap);
			this.updateTreeTableView(treeTableArray);
		} else {
			this.updateTreeTableArray(oEvent, treeTableArray);
			this.updateTreeTableView(treeTableArray);
		}
	},

	/////////////////////////////////
	//	UPDATE TREE TABLE ARRAY
	/////////////////////////////////

	//UPDATE ARRAY PART
	updateTreeTableArrayIfFirstRowChanged: function (oEvent, treeTableArray, documentsGap) {
		//var linked to the event
		var iRowIndex = oEvent.getParameter("rowIndex");//row index (sapui5)

		//first we change the isOpened boolean
		var arrayIndexOfDocType = this.getSelectedDocTypeIndex (treeTableArray, iRowIndex);
		treeTableArray[arrayIndexOfDocType].isOpened = !treeTableArray[arrayIndexOfDocType].isOpened; //isOpened boolean changed because of the click 

		//then we null the positions of the documents that belong to the doc type
		var arrayIndex = arrayIndexOfDocType;
		while (treeTableArray[arrayIndex + 1] && !treeTableArray[arrayIndex + 1].isDocType) { //while we haven't reach the new doc type
			arrayIndex++;
			treeTableArray[arrayIndex].position = null;
		}

		//we need to update the firstVisibleRow and obtain the former position of the first document which will be displayed
		var arrayIndexOfFirstDocDisplayed = this.getIndexOfFirstDocDisplayed(treeTableArray, documentsGap);
		if (arrayIndexOfFirstDocDisplayed < 0) {//if negative gap => set to 0
			arrayIndexOfFirstDocDisplayed = 0;
		}
		var formerPosition = treeTableArray[arrayIndexOfFirstDocDisplayed].position || 0;//position of the first document which will be displayed
		this.firstVisibleRow = this.calculateRow(treeTableArray, arrayIndexOfFirstDocDisplayed);//update the first visible row


		//then we operate the changes in the array for all the documents after the first document displayed
		var position = formerPosition;
		for (var i = arrayIndexOfFirstDocDisplayed; i < treeTableArray.length; i++) {
			treeTableArray[i].position = position;
			position++;
			if (treeTableArray[i].isDocType && !treeTableArray[i].isOpened) {
				i += treeTableArray[i].nbOfDocs;
			}
		}
	},

	//UPDATE ARRAY PART
	updateTreeTableArray: function (oEvent, treeTableArray) {
		//var linked to the event
		var iRowIndex = oEvent.getParameter("rowIndex");//row index (sapui5)
		var bExpanded = oEvent.getParameter("expanded");//expanding (true) or collapsing (false)

		//var linked to the array : index & last position
		var arrayIndex = this.getSelectedDocTypeIndex (treeTableArray, iRowIndex);//index in the array
		var lastPosition = treeTableArray[arrayIndex].position;//position of the node collapsed/expanded in the array

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
	},

	//when we collapse a doc type, the first row may changed
	// => if we remove more docs by collapsing than the number of elements not displayed displayed but available
	//we check and calculate the gap if we are in this case, else gap equals 0
	checkIfFirstRowChanged: function (treeTableArray, iRowIndex) {
		var maxPosition = Math.max.apply(Math, treeTableArray.map(function (o) { return o.position; }));
		if (maxPosition < 8) {// means that the treetable isn't filled with 9 elements so no first row changed
			return 0;
		}

		//we got the number of elements available to be displayed on the collapse
		var elementsAvailableAfter = 0, elementsAvailableBefore = 0, afterNinthElementsDisplayed = false, beforeFirstElementDisplayed = true;
		for (var i = 0; i < treeTableArray.length; i++) {
			if (afterNinthElementsDisplayed) {//if ninth displayed we chech the elements available to be displayed after the ones currently displayed
				if (!treeTableArray[i].isDocType || treeTableArray[i].isOpened) {
					elementsAvailableAfter++;
				} else {
					i += treeTableArray[i].nbOfDocs;
					elementsAvailableAfter++;
				}
			} else if (treeTableArray[i].position === 0) { //else we check if we have reached the first element displayed
				beforeFirstElementDisplayed = false;
			} else if (beforeFirstElementDisplayed) {//if not we continue to calculate the number of elements displayed before the ones currently displayed
				if (!treeTableArray[i].isDocType || treeTableArray[i].isOpened) {
					elementsAvailableBefore++;
				} else {
					i += treeTableArray[i].nbOfDocs;
					elementsAvailableBefore++;
				}
			}
			if (treeTableArray[i].position === 8) {//if we have reached the ninth position we will calculate the elements available to be displayed but not currently displayed
				afterNinthElementsDisplayed = true;
				if (treeTableArray[i].isOpened === false) {
					i += treeTableArray[i].nbOfDocs;
				}
			}
		}

		var arrayIndex = this.getSelectedDocTypeIndex (treeTableArray, iRowIndex);
		var nbOfDocsDisplayed = 0, x = arrayIndex + 1;
		//calculate numbers of document of this type displayed
		while (x < treeTableArray.length && treeTableArray[x].position <= 8 && !treeTableArray[x].isDocType) {
			nbOfDocsDisplayed++;
			x++;
		}

		//if there are some documents undisplayed of the doc type collapsed, we need not to count them in elementsAvailableAfter
		var numberOfDocsByType = treeTableArray[arrayIndex].nbOfDocs;
		elementsAvailableAfter = elementsAvailableAfter - (numberOfDocsByType - nbOfDocsDisplayed);

		//then we check if there is enough documents (if not there will be a rerender)
		var gapAfter = nbOfDocsDisplayed - elementsAvailableAfter;
		var firstRowGap = Math.min(elementsAvailableBefore, gapAfter);//the min will indicate the gap between the index of the actual first row and the index of the first row cwhich will be displayed
		if (firstRowGap < 0) {
			firstRowGap = 0;
		} else if (elementsAvailableBefore < gapAfter) {
			firstRowGap = arrayIndex;//we'll come back to the first element of the array
		}
		return firstRowGap;
	},

	//UPDATE ARRAY PART based on firstVisibleRow
	updateTreeTableArrayOnScroll: function (treeTableArray, newFirstVisibleRow) {
		if (newFirstVisibleRow > this.firstVisibleRow) {//scroll bottom
			for (var i = 0; i < treeTableArray.length; i++) {
				if (treeTableArray[i].position !== null && treeTableArray[i].position - (newFirstVisibleRow - this.firstVisibleRow) >= 0) {
					treeTableArray[i].position = treeTableArray[i].position - (newFirstVisibleRow - this.firstVisibleRow); //change position
				} else {//rows not displayed
					treeTableArray[i].position = null;
				}
			}
		} else {//scroll top

			//we find the arrayIndex of the first row displayed
			var numberOfRows = 0, arrayIndex = 0;
			//we will increment to have the same numberofRows in the function than the newFirstVisibleRow (which represents the number of rows displayed)
			while (numberOfRows !== newFirstVisibleRow) {
				//if document or doc type opened, we increment of one
				if (!treeTableArray[arrayIndex].isDocType || (treeTableArray[arrayIndex].isDocType && treeTableArray[arrayIndex].isOpened)) {
					arrayIndex++;
				} else {//else we don't count the documents not displayed
					arrayIndex += treeTableArray[arrayIndex].nbOfDocs + 1;
				}
				numberOfRows++;
			}

			//then we operate the changes
			var position = 0;
			for (var j = arrayIndex; j < treeTableArray.length; j++) {
				treeTableArray[j].position = position;
				position++;
				if (treeTableArray[j].isDocType && !treeTableArray[j].isOpened) {
					j += treeTableArray[j].nbOfDocs;
				}
			}
		}
		this.firstVisibleRow = newFirstVisibleRow;
	},

	//find the selected doc type in the array (its index) based on the iRowIndex (in UI)
	getSelectedDocTypeIndex : function (treeTableArray, iRowIndex) {
		var numberOfRows = 0, arrayIndex = 0;
		while (numberOfRows !== iRowIndex) {//we will increment to have the same numberofRows in the function than the iRowIndex (which represents the number of rows displayed)
			if (!treeTableArray[arrayIndex].isDocType || (treeTableArray[arrayIndex].isDocType && treeTableArray[arrayIndex].isOpened)) {//if position it's displayed so we increment
				arrayIndex++;
			} else {
				arrayIndex += treeTableArray[arrayIndex].nbOfDocs + 1;
			}
			numberOfRows++;
		}
		return arrayIndex;//position in the array 	
	},

	getIndexOfFirstDocDisplayed: function (treeTableArray, documentsGap) {

		//we find the index of the first row displayed before the collapsing click
		var firstRowDisplayedIndex = 0;
		while (treeTableArray[firstRowDisplayedIndex].position !== 0) {
			firstRowDisplayedIndex++;
		}

		//we decrement for each value of documentsGap to get the good index of first document displayed
		while (documentsGap !== 0) {
			var obj = this.getNbOfRowsForPreviousDocType(treeTableArray, firstRowDisplayedIndex);//we get the index and the number of rows of the previous document
			var counter = obj.rows;
			if (!treeTableArray[obj.index].isOpened) {//if not opened only one row to decrement
				documentsGap--;
				firstRowDisplayedIndex = obj.index;
			} else {//else more rows to decrement
				while (documentsGap !== 0 && counter !== 0) {//we go one by one to stop when counter or documentsGap equal 0
					firstRowDisplayedIndex--;
					counter--;
					documentsGap--;
				}
			}//if documentsGap don't equal 0 we start again in the while
		}

		return firstRowDisplayedIndex;
	},

	//get the number of rows displayed for the previous doc type and the index of the doc type 
	getNbOfRowsForPreviousDocType: function (treeTableArray, i) {
		var obj = {
			rows: undefined,
			index: undefined
		};
		var rows;

		i--;//first object to check is indexed by i-1
		while (!treeTableArray[i].isDocType) {
			i--;
		}
		if (treeTableArray[i].isOpened) {//opened so documents rows and doc type row are displayed
			rows = treeTableArray[i].nbOfDocs + 1;
		} else {//collapsed so only the doc type row is displayed
			rows = 1;
		}

		obj.rows = rows;//rows able to be displayed for the doc type
		obj.index = i;//index of the doc type
		return obj;
	},

	//calculate the row using the treeTableArray and the index of the document in this array
	calculateRow: function (treeTableArray, inputIndex) {
		var row = 0, i = 0;
		while (i < treeTableArray.length && inputIndex !== i) {
			if (treeTableArray[i].isOpened === false) {//if doc type not opened
				i += treeTableArray[i].nbOfDocs;
			}
			row++;
			i++;
		}
		return row;
	},

	/////////////////////////////////
	//	UPDATE TREE TABLE VIEW
	/////////////////////////////////

	//apply css and events for the document displayed (on the row)
	updateTreeTableView: function (treeTableArray) {
		//we add and remove class for the rows displayed
		var positionMax, events;
		for (var j = 0; j < treeTableArray.length; j++) {
			positionMax = treeTableArray[j].position + 1;
			if (positionMax <= 9) {
				events = $._data(this.selectTreeTableRow(positionMax)[0], 'events');//events list of the row
				if (treeTableArray[j].position !== null && !treeTableArray[j].isDocType) {
					this.selectTreeTableRow(positionMax).addClass("document");

					if (!events.click) {
						this.selectTreeTableRow(positionMax).on("click", { url: treeTableArray[j].url }, this.openDocument);//we attach click event
					} else {
						this.selectTreeTableRow(positionMax).off("click", this.openDocument);//we remove click event
						this.selectTreeTableRow(positionMax).on("click", { url: treeTableArray[j].url }, this.openDocument);//we attach click event
					}
				} else if (treeTableArray[j].position !== null && treeTableArray[j].isDocType) {
					this.selectTreeTableRow(positionMax).removeClass("document");

					if (events.click) {
						this.selectTreeTableRow(positionMax).off("click", this.openDocument);//we remove click event
					}
				}
			} else {//we have filled the 9 rows of the view
				break;//so we break the loop
			}
		}

		//we remove document class on rows with no data inside
		var k = treeTableArray.length - 1, rowIndex;
		//we browse the treetableArray to remove class/event if it's a document displayed
		while (k >= 0) {
			//if position <=8 it means it's displayed, furthermore if it's a document we remove the document class and the event
			if (treeTableArray[k].position !== null && treeTableArray[k].position <= 8 && treeTableArray[k].isDocType) {
				rowIndex = treeTableArray[k].position + 1;//index difference between a javascript array and a jquery element
				this.selectTreeTableRow(rowIndex).removeClass("document");

				events = $._data(this.selectTreeTableRow(rowIndex)[0], 'events');//events list of the row
				if (events.click) {
					this.selectTreeTableRow(rowIndex).off("click", this.openDocument);//we remove event
				}
			}
			k--;
		}
	},

	collapseAllNodes: function () {
		airbus.mes.displayOpeAttachments.oView.byId("DOATable").collapseAll();
	},

	//select in jquery the html row for a tree table sapui5 component
	selectTreeTableRow: function (i) {
		return $("#displayOpeAttachmentsView--DOATable-table").children("tbody").children(":nth-child(" + i + ")");
	},

	/////////////////////////////////
	//	POPUP
	/////////////////////////////////

	//open the choice popup
	openDocument: function (oEvent) {
		var url = oEvent.handleObj.data.url;
		var format = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
		var model = airbus.mes.displayOpeAttachments.oView.getModel("getDocumentExtensions");
		var documentExtensionsRows, i = 0, defaultViewer;

		if (model.oData.Rowsets && model.oData.Rowsets.Rowset) {//get the rows if it exist
			documentExtensionsRows = model.oData.Rowsets.Rowset[0].Row;
		}

		airbus.mes.displayOpeAttachments.oView.oController.popUrl = oEvent.handleObj.data.url;//stock var in controller to be called from popup in shell

		if (documentExtensionsRows) {
			//we find the good format in the array, then get the defaultViewer
			while (i + 1 < documentExtensionsRows.length && documentExtensionsRows[i].file_extension.toLowerCase() !== format) {//we find the good format in the array
				i++;
			}
			if (documentExtensionsRows[i].file_extension.toLowerCase() === format) {
				defaultViewer = documentExtensionsRows[i].default_viewer;
			}
		}

		//3 choices : download, mesviewer and pop-up to choose
		if (defaultViewer === "download") {
			airbus.mes.displayOpeAttachments.oView.oController.downloadDocument();
		} else if (defaultViewer === "mesViewer") {
			airbus.mes.shell.util.navFunctions.docViewer(url, undefined);
			airbus.mes.stationtracker.operationDetailPopup.close();
		} else {//"none" or undefined : we open a choice popup
			if (!airbus.mes.shell.doaPopup) {
				airbus.mes.shell.doaPopup = sap.ui.xmlfragment("airbus.mes.shell.doaPopup", this);
			}

			//set models
			airbus.mes.shell.doaPopup.setModel(airbus.mes.displayOpeAttachments.oView.getModel("getOpeAttachments"), "getOpeAttachments");
			airbus.mes.shell.doaPopup.setModel(airbus.mes.displayOpeAttachments.oView.getModel("i18nDisplayOpeAttachmentsModel"), "i18nDisplayOpeAttachmentsModel");

			airbus.mes.shell.doaPopup.open();
		}
	},

	//close the choice popup
	closeDocumentPopup: function () {
		this.popUrl = null;
		airbus.mes.shell.doaPopup.close();
	},

	downloadDocument: function () {
		//If in Chrome or Safari - download via virtual link click
		//Creating new link node.
		var sUrl = airbus.mes.displayOpeAttachments.oView.oController.popUrl;
		var link = document.createElement('a');
		link.href = sUrl;
		link.setAttribute('target', '_blank');

		if (link.download !== undefined) {
			//Set HTML5 download attribute. This will prevent file from opening if supported.
			var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
			link.download = fileName;
		}

		//Dispatching click event.
		if (document.createEvent) {
			var e = document.createEvent('MouseEvents');
			e.initEvent('click', true, true);
			link.dispatchEvent(e);
			return true;
		}

		// Force file download (whether supported by server).
		if (sUrl.indexOf('?') === -1) {
			sUrl += '?download';
		}

		window.open(sUrl, '_blank');
		return true;
	},

	openDocumentInMesViewer: function () {
		airbus.mes.shell.util.navFunctions.docViewer(airbus.mes.displayOpeAttachments.oView.oController.popUrl, undefined);

		//close the popups
		airbus.mes.shell.doaPopup.close();
		airbus.mes.stationtracker.operationDetailPopup.close();
	},

	/////////////////////////////////
	//	SELECT LEVEL
	/////////////////////////////////

	changeDocumentFilter: function (oEvent) {
		var previousSet = this.getOwnerComponent().getSSet();

		//change operation/wo mode
		switch (previousSet) {
			case "O"://operation
				sap.ui.getCore().byId("displayOpeAttachmentsView--workOrderButton").setSelected(true);
				this.getOwnerComponent().setSSet("P");
				break;
			case "P"://work order
				sap.ui.getCore().byId("displayOpeAttachmentsView--operationButton").setSelected(true);
				this.getOwnerComponent().setSSet("O");
				break;
			default:
				break;
		}

		this.init();
	},


	selectDocumentFilter : function (set) {
		//change operation/wo mode
		switch (set) {
			case "O"://operation
				sap.ui.getCore().byId("displayOpeAttachmentsView--operationButton").setSelected(true);
				break;
			case "P"://work order
				sap.ui.getCore().byId("displayOpeAttachmentsView--workOrderButton").setSelected(true);
				break;
			default:
				break;
		}
	}

});
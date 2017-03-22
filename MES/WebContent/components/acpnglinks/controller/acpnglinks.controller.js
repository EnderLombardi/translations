"use strict";
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-sortable');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-droppable');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-draggable');
sap.ui.controller("airbus.mes.acpnglinks.controller.acpnglinks", {

	/**
	 * Called when the View has been rendered
	 */
	onAfterRendering : function() {
		// Get Tree table
		var oTTbl = sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable");
		if (oTTbl != undefined) {
			// Expand all nodes of the tree and init the number of visible rows
			oTTbl.expandToLevel(99);
			oTTbl.setVisibleRowCount(this.treeExpandAll(oTTbl));
			oTTbl.setSelectionMode("None");
		}
	},

	/**
	 * Expand all the nodes of the Tree table control Return the number of rows
	 */
	treeExpandAll : function(oTTbl) {
		for (var i = 0; i < oTTbl.getRows().length; i++) {
			try {
				oTTbl.expand(i);
			} catch (exception) {
				return i;
			}
		}
		return oTTbl.getRows().length;
	},
	
	/**
	 * Clickable Cell management in Tree Table
	 */
	OnSelectionChange : function(oEvt) {
		 try {
			//TODO: check if the line selected doesn't concern the current work order
			//if clicked on workorder compare with current work order
			//if clicked on NC use fatherlink to do the comparison
			 var woClicked = airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").getProperty(oEvt.mParameters.rowBindingContext.sPath).Reference;
			 var woCurrent = airbus.mes.acpnglinks.oView.getController().getOwnerComponent().getWorkOrder();
			 var typeClicked = airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").getProperty(oEvt.mParameters.rowBindingContext.sPath).Type;
			 var fatherLinkClicked = airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").getProperty(oEvt.mParameters.rowBindingContext.sPath).FatherLink;
			 var site = this.getOwnerComponent().getSite();
			 var station = this.getOwnerComponent().getPhStation();
			 var oldSettings = {};
			 if ( ( typeClicked != "NC" &&  woClicked != woCurrent ) || ( typeClicked == "NC" && fatherLinkClicked != woCurrent) ){
				
				 if (typeClicked == "NC"){
					 woClicked = fatherLinkClicked;
				 }
				 //TODO : call model msn/ physical station/ workorder
				 //Step 1 call service to find linked WO	
				 if (!woClicked){
					return; 	
				}
//to uncomment to activate acpnglinks click				 
//				//test mode : first operation of the model	 
//				 var aModel = [sap.ui.getCore().getModel("stationTrackerRModel").oData.Rowsets.Rowset[0].Row[0]];
//				 
//
//				 //Step 2 save the line clicked on in an array for history management;
//				 aModel[0].type = airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").getProperty(oEvt.mParameters.rowBindingContext.sPath).Type;
//				 airbus.mes.stationtracker.opeDetailCallStack.arr.push(aModel[0]);
//				 
//
//				 //Step 3 update and save settings for physical station
//				 oldSettings.site =  airbus.mes.settings.util.ModelManager.site;
//				 oldSettings.program =  airbus.mes.settings.util.ModelManager.program;
//				 oldSettings.line =  airbus.mes.settings.util.ModelManager.line;
//				 oldSettings.station =  airbus.mes.settings.util.ModelManager.station;
//				 oldSettings.msn =  airbus.mes.settings.util.ModelManager.msn;
//				 try{
//					 // TODO change user settings
//					 airbus.mes.settings.util.ModelManager.site 		=  airbus.mes.settings.util.ModelManager.site;
//					 airbus.mes.settings.util.ModelManager.program 	=  airbus.mes.settings.util.ModelManager.program;
//					 airbus.mes.settings.util.ModelManager.line 		=  airbus.mes.settings.util.ModelManager.line;
//					 airbus.mes.settings.util.ModelManager.station 	=  airbus.mes.settings.util.ModelManager.station;
//					 airbus.mes.settings.util.ModelManager.msn 		=  airbus.mes.settings.util.ModelManager.msn;
//					 
//					 airbus.mes.settings.util.ModelManager.saveUserSetting(sap.ui.getCore().getConfiguration().getLanguage().slice(0,2));
//				 }catch(error){
//					 airbus.mes.settings.util.ModelManager.site 		=   oldSettings.site;
//					 airbus.mes.settings.util.ModelManager.program 	=   oldSettings.program;
//					 airbus.mes.settings.util.ModelManager.line 		=   oldSettings.line;
//					 airbus.mes.settings.util.ModelManager.station 	=   oldSettings.station;
//					 airbus.mes.settings.util.ModelManager.msn 		=   oldSettings.msn;
//				 }
//
//
//				 //Step 4 prepare data for openOperationDetailPopup to replace the content of this new Operation
////				 airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").getProperty(oEvt.mParameters.rowBindingContext.sPath);
//
//				 //Step 5 call openOperationDetailPopup
//				 airbus.mes.stationtracker.util.ModelManager.openOperationDetailPopup([airbus.mes.stationtracker.opeDetailCallStack.arr[airbus.mes.stationtracker.opeDetailCallStack.arr.length-1]],undefined,undefined,true);
			 }
		 } catch (exception) {
		 // do nothing
		 }
	},

	/**
	 * Update the "Sort" value in the acpnglink model for the column reordering
	 * 
	 */
	sortColumnModel : function() {
		var index = 0;
		var id = "";
		try {
			var model = airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").getData().Rowsets.Rowset[0].Columns.Column;
			var oTTbl = sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable").getColumns();
			for (var i = 0; i < oTTbl.length; i++) {
				index = oTTbl[i].sId.lastIndexOf("--"); // format:acpnglinksView--id
				id = oTTbl[i].sId.slice([ index + 2 ], oTTbl[i].sId.length);
				// find the column in the model
				index = airbus.mes.acpnglinks.util.Formatter.findIndexObjectKey(model, "Name", id, 0); 
				if (index != null){
					model[index].Sort = i; // new sort value
				}
			}
			// Model update
			airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").getData().Rowsets.Rowset[0].Columns.Column = model;
			airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").refresh(true);
		} catch (err) {
			// do nothing
		}

	},

	/**
	 * Called when clicking on the button of the Tree table to change column
	 * order/visibility Create the column reordering dialog and enable the list
	 * for drag/drop
	 * 
	 */
	onColumnsChange : function() {
		// Create Dialog View
		if (airbus.mes.acpnglinks.oColumnEditDialog === undefined) {
			airbus.mes.acpnglinks.oColumnEditDialog = sap.ui.xmlfragment("columnEdit", "airbus.mes.acpnglinks.view.columnEdit", airbus.mes.acpnglinks.oView
				.getController());
			airbus.mes.acpnglinks.oView.addDependent(airbus.mes.acpnglinks.oColumnEditDialog);
		}
		// Column Model sort
		this.sortColumnModel();

		// Open dialog
		airbus.mes.acpnglinks.oColumnEditDialog.open();

		// Drag drop management for the list of allocated columns to handle
		// Column reordering
		var oSortableList = sap.ui.getCore().byId("columnEdit--listAllocatedcolumns");
		var listId = oSortableList.getId();
		var listUlId = listId + "-listUl";
		$("#" + listUlId).addClass('ui-sortable');
		$("#" + listUlId).sortable({
			connectWith : ".ui-sortable",
			update : function(oEvent, ui) {
				// Custom column reordering in the Tree table.
				// fireColumnMove triggers the function updateColumn
				sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable").fireColumnMove({
					column : sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable").getColumns()[ui.item.index()],
					newPos : ui.item.index()
				});
			}
		}).disableSelection();

	},

	/**
	 * Change "Visible" attribute in model for selected item in the list of
	 * available columns
	 * @param {string}
	 *            oEvt : event
	 */
	onAssignColumns : function(oEvt) {
		var aColumnsToAssign = sap.ui.getCore().byId("columnEdit--listAvailableColumns").getSelectedItem();
		try {

			airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").setProperty(aColumnsToAssign.getBindingContextPath() + "/Visible", "true");
		} catch (err) {
			// do nothing
		}
	},

	/**
	 * Change "Visible" attribute in model for selected item in the list of
	 * allocated columns
	 */
	onUnassignColumns : function(oEvt) {
		var aColumnsToAssign = sap.ui.getCore().byId("columnEdit--listAllocatedcolumns").getSelectedItem();
		try {
			//Type column can't be unassigned
			if(airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").getProperty(aColumnsToAssign.getBindingContextPath()+"/SourceColumn").toUpperCase() != "TYPE"){
				
			airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").setProperty(aColumnsToAssign.getBindingContextPath() + "/Visible", "false");
		}
		} catch (err) {
			// do nothing
		}
	},

	/**
	 * Closing the Dialog
	 */
	onDialogClose : function(oEvent) {
		// Close Popup
		airbus.mes.acpnglinks.oColumnEditDialog.close();
		airbus.mes.acpnglinks.oColumnEditDialog.destroy();
		airbus.mes.acpnglinks.oColumnEditDialog = undefined;
	},

	/**
	 * Set column order when changing order in the list of allocated columns of the dialog
	 */
	updateColumn : function(oEvt) {
		var oColumnTree = oEvt.getSource().getColumns()
		var imax = oEvt.getSource().getColumns().length;	//Number of columns
		var j = 0;
		var oColumn;
		//Delete all columns
		for (var i = 0; i < imax; i++) {
			oEvt.getSource().removeColumn(0);
		}

		//Get visible columns and reorder them
		for (var i = 0; i < $(".acpnglinksVisible").length; i++) {
			oColumn = oColumnTree.filter(function(el) {
				return el.sId == "acpnglinksView--" + $(".acpnglinksVisible")[i].innerText;
			})
			if (oColumn != undefined && oColumn.length > 0) {
				oEvt.getSource().insertColumn(oColumn[0], j++);
			}
		}
		//Get invisible columns and reorder them
		for (var i = 0; i < $(".acpnglinksNotVisible").length; i++) {
			oColumn = oColumnTree.filter(function(el) {
				return el.sId == "acpnglinksView--" + $(".acpnglinksNotVisible")[i].innerText;
			})
			if (oColumn != undefined && oColumn.length > 0) {
				oEvt.getSource().insertColumn(oColumn[0], j++);
			}
		}
	},
	/**
	 * Get Translated value
	 */
	 getI18nValue: function (sKey) {
	        return this.getView().getModel("i18nAcpngLinksModel").getProperty(sKey);
	    },
});

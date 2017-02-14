"use strict";
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-sortable');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-droppable');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-draggable');
sap.ui.controller("airbus.mes.acpnglinks.controller.acpnglinks", {

	// onInit : function() {

	// },

	onAfterRendering : function() {
		var oTTbl = sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable");
		if (oTTbl != undefined) {

			oTTbl.setVisibleRowCount(this.treeExpandAll(oTTbl));
			oTTbl.setSelectionMode("None");
		}

	},

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

	OnSelectionChange : function(oEvt) {
		try {
			airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").getProperty(oEvt.mParameters.rowBindingContext.sPath);
			console.log(oEvt.getSource());
		} catch (exception) {
			// do nothing
		}
	},

	onColumnsChange : function() {
		if (airbus.mes.acpnglinks.oColumnEditDialog === undefined) {

			airbus.mes.acpnglinks.oColumnEditDialog = sap.ui.xmlfragment("columnEdit", "airbus.mes.acpnglinks.view.columnEdit", airbus.mes.acpnglinks.oView
				.getController());
			airbus.mes.acpnglinks.oView.addDependent(airbus.mes.acpnglinks.oColumnEditDialog);
		}
		// Open
		airbus.mes.acpnglinks.oColumnEditDialog.open();

		// Drag drop management
		var oSortableList = sap.ui.getCore().byId("columnEdit--listAllocatedcolumns");
		var listId = oSortableList.getId();
		var listUlId = listId + "-listUl";
		$("#" + listUlId).addClass('ui-sortable');
		$("#" + listUlId).sortable({
			connectWith : ".ui-sortable",
			update : function(oEvent, ui) {
				sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable").fireColumnMove({
					column : sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable").getColumns()[ui.item.index()],
					newPos : 3
				});
			}
		}).disableSelection();

	},

	onAssignColumns : function(oEvt) {
		var aColumnsToAssign = sap.ui.getCore().byId("columnEdit--listAvailableColumns").getSelectedItem();
		airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").setProperty(aColumnsToAssign.getBindingContextPath() + "/Visible", "true");
	},
	onUnassignColumns : function(oEvt) {
		var aColumnsToAssign = sap.ui.getCore().byId("columnEdit--listAllocatedcolumns").getSelectedItem();
		airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").setProperty(aColumnsToAssign.getBindingContextPath() + "/Visible", "false");
	},

	onDialogClose : function(oEvent) {
		// Close Popup
		sap.ui.getCore().byId("columnEdit--columnEditDialog").close();

	},

	updateColumn : function(oEvt) {
		// oTable.removeColumn(newPos);
		// oTable.insertColumn(oColumn, oldPos);
		// source = TreeTable
		var oColumnTree = oEvt.getSource().getColumns()
//		var oColumnTree = JSON.parse(JSON.stringify(oEvt.getSource().getColumns()));
//		var oColumnTree = oEvt.getSource().getColumns().map(a => Object.assign({}, a));
//		var oColumnTree = [...oEvt.getSource().getColumns()];
		// var oColumnList =
		// sap.ui.getCore().byId("columnEdit--listAvailableColumns");
		var aColOrder = [];
//		var aColTreeactual = [];
//		if (oEvt.getParameters().column != undefined) {
			// console.log("Column :"+oEvt.getParameters().column);
//		}

//		if (oEvt.getParameters().newPos != undefined) {
			// console.log("NewPos :"+oEvt.getParameters().newPos);
//		}
//		 console.log(oColumnList);
//		 Deletion phase
		 var imax = oEvt.getSource().getColumns().length;
		 for (var i = 0; i < imax; i++) {
		 oEvt.getSource().removeColumn(0);
		 }
		// var oitems = oColumnList.getItems();
;
//		for (var i = 0; i < $(".ACPnGtLabel").length; i++) {
//			aColTreeactual.push($(".ACPnGtLabel")[i].innerText);
//		}
		var j = 0;
		var oColumn
		for (var i = 0; i < $(".acpnglinksVisible").length; i++) {
			aColOrder.push($(".acpnglinksVisible")[i].innerText);
			oColumn = oColumnTree.filter(function(el) {
				return el.sId == "acpnglinksView--" + $(".acpnglinksVisible")[i].innerText;
			})
			if (oColumn != undefined && oColumn.length > 0){
				oEvt.getSource().insertColumn(oColumn[0],j++);
			}
		}
		for (var i = 0; i < $(".acpnglinksNotVisible").length; i++) {
			aColOrder.push($(".acpnglinksNotVisible")[i].innerText);
			oColumn = oColumnTree.filter(function(el) {
				return el.sId == "acpnglinksView--" + $(".acpnglinksNotVisible")[i].innerText;
			})
			if (oColumn != undefined && oColumn.length > 0){
				oEvt.getSource().insertColumn(oColumn[0],j++);
			}
		}
		// oitems.forEach(function(element, index) {
		// if
		// (element.getBindingContext("acpnglinksWorkOrderDetail").getModel().getProperty(element.getBindingContext("acpnglinksWorkOrderDetail").sPath).Visible
		// == "true")
		// //Get column name
		// console.log(element.getBindingContext("acpnglinksWorkOrderDetail").getModel().getProperty(element.getBindingContext("acpnglinksWorkOrderDetail").sPath).Name);
		// });

	}
});
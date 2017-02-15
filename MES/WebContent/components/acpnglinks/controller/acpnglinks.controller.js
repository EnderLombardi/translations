"use strict";
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-sortable');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-droppable');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-draggable');
sap.ui.controller("airbus.mes.acpnglinks.controller.acpnglinks", {

	onAfterRendering : function() {
		var oTTbl = sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable");
		if (oTTbl != undefined) {

            oTTbl.setVisibleRowCount(this.treeExpandAll(oTTbl));
            oTTbl.setSelectionMode("None");
            airbus.mes.acpnglinks.util.Formatter.changeRowColor();
        }
        airbus.mes.acpnglinks.util.Formatter.changeRowColor();

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
		} catch (exception) {
			// do nothing
		}
	},

	findIndexObjectKey : function(arraytosearch, key, valuetosearch) {

		for (var i = 0; i < arraytosearch.length; i++) {

			if (arraytosearch[i][key] == valuetosearch) {
				return i;
			}
		}
		return null;
	},
	
	SortColumnModel : function(){
		var index = 0;
		var id = "";
		// Column Model sort
		try{
			var model = airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").getData().Rowsets.Rowset[0].Columns.Column;
			var oTTbl = sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable").getColumns();
			for (var i = 0; i < oTTbl.length; i++) {
				index = oTTbl[i].sId.lastIndexOf("--");
				id = oTTbl[i].sId.slice([index+2], oTTbl[i].sId.length);
				index = this.findIndexObjectKey(model,"Name",id);
				model[index].Sort = i;
			}
			airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").getData().Rowsets.Rowset[0].Columns.Column = model;
			airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").refresh();
		}catch(err){
			// do nothing
		}

	},

    onColumnsChange : function() {
        if (airbus.mes.acpnglinks.oColumnEditDialog === undefined) {

			airbus.mes.acpnglinks.oColumnEditDialog = sap.ui.xmlfragment("columnEdit", "airbus.mes.acpnglinks.view.columnEdit", airbus.mes.acpnglinks.oView
				.getController());
			airbus.mes.acpnglinks.oView.addDependent(airbus.mes.acpnglinks.oColumnEditDialog);
		}
		// Column Model sort
		this.SortColumnModel()
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
					newPos : ui.item.index()
				});
			}
		}).disableSelection();

    },

   onAssignColumns : function(oEvt) {
		var aColumnsToAssign = sap.ui.getCore().byId("columnEdit--listAvailableColumns").getSelectedItem();
		try{

			airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").setProperty(aColumnsToAssign.getBindingContextPath() + "/Visible", "true");
		}catch(err){
			// do nothing
		}
		airbus.mes.acpnglinks.util.Formatter.changeRowColor();
	},
	onUnassignColumns : function(oEvt) {
		var aColumnsToAssign = sap.ui.getCore().byId("columnEdit--listAllocatedcolumns").getSelectedItem();
		try{
			airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").setProperty(aColumnsToAssign.getBindingContextPath() + "/Visible", "false");			
		}catch(err){
			// do nothing
		}
		airbus.mes.acpnglinks.util.Formatter.changeRowColor();
	},

	onDialogClose : function(oEvent) {
		// Close Popup
		airbus.mes.acpnglinks.oColumnEditDialog.close();
		airbus.mes.acpnglinks.oColumnEditDialog.destroy();
		airbus.mes.acpnglinks.oColumnEditDialog = undefined;
	},

	updateColumn : function(oEvt) {
		var oColumnTree = oEvt.getSource().getColumns()
		var imax = oEvt.getSource().getColumns().length;
		// var aColOrder = [];
		var j = 0;
		var oColumn
			for (var i = 0; i < imax; i++) {
				oEvt.getSource().removeColumn(0);
			}

			for (var i = 0; i < $(".acpnglinksVisible").length; i++) {
				// aColOrder.push($(".acpnglinksVisible")[i].innerText);
				oColumn = oColumnTree.filter(function(el) {
					return el.sId == "acpnglinksView--" + $(".acpnglinksVisible")[i].innerText;
				})
				if (oColumn != undefined && oColumn.length > 0) {
					oEvt.getSource().insertColumn(oColumn[0], j++);
				}
			}
			for (var i = 0; i < $(".acpnglinksNotVisible").length; i++) {
				// aColOrder.push($(".acpnglinksNotVisible")[i].innerText);
				oColumn = oColumnTree.filter(function(el) {
					return el.sId == "acpnglinksView--" + $(".acpnglinksNotVisible")[i].innerText;
				})
				if (oColumn != undefined && oColumn.length > 0) {
					oEvt.getSource().insertColumn(oColumn[0], j++);
				}
			}
		}
});

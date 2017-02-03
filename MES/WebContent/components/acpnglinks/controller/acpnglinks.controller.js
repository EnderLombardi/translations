"use strict";
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-sortable');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-droppable');
$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-draggable');
sap.ui.controller("airbus.mes.acpnglinks.controller.acpnglinks", {
	
//	onInit : function() {

//	},
	
	onAfterRendering : function() {
		var oTTbl = sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable");
		if (oTTbl != undefined){
			
			oTTbl.setVisibleRowCount(this.treeExpandAll(oTTbl));
			oTTbl.setSelectionMode(sap.ui.table.SelectionMode.Single);
		}
        
		 
    },
    
    treeExpandAll : function(oTTbl) {  
	        for (var i=0; i<oTTbl.getRows().length; i++){
				try{
		            oTTbl.expand(i);
	        	} catch(exception) {
	        		return i;
	        	}
	        }
	        return oTTbl.getRows().length;
    },
    
    OnSelectionChange : function(oEvt){
    	try{
    	airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").getProperty(oEvt.mParameters.rowBindingContext.sPath);
    	console.log(oEvt.getSource());
    	} catch(exception) {
    		//do nothing
    	}
    },
    
    onColumnsChange : function(){
    	 if (airbus.mes.acpnglinks.oColumnEditDialog === undefined) {

             airbus.mes.acpnglinks.oColumnEditDialog = sap.ui
                     .xmlfragment(
                             "columnEdit",
                             "airbus.mes.acpnglinks.view.columnEdit",
                             airbus.mes.acpnglinks.oView
                                     .getController());
             airbus.mes.acpnglinks.oView
                     .addDependent(airbus.mes.acpnglinks.oColumnEditDialog);
         }
         // Open
         airbus.mes.acpnglinks.oColumnEditDialog.open();

         //Drag drop management
        var oSortableList = sap.ui.getCore().byId("columnEdit--listAllocatedcolumns");
		var listId = oSortableList.getId();
		var listUlId = listId + "-listUl";
		$("#"+listUlId).addClass('ui-sortable');
		$("#"+listUlId).sortable({
			connectWith : ".ui-sortable",
//				start: function(event, ui) {
//		            var start_pos = ui.item.index();
//		            ui.item.data('start_pos', start_pos);
//		        },
//		        change: function(event, ui) {
//		            var start_pos = ui.item.data('start_pos');
//		            var index = ui.placeholder.index();
//		            if (start_pos < index) {
//		                $('#sortable li:nth-child(' + index + ')').addClass('highlights');
//		            } else {
//		                $('#sortable li:eq(' + (index + 1) + ')').addClass('highlights');
//		            }
//		        },
		        update: function(oEvent, ui) {
		        	sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable").fireColumnMove( { column : sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable").getColumns()[ui.item.index()], newPos : 3 } );
//		            $('#sortable li').removeClass('highlights');
		        }
		}).disableSelection();
		
//        var oSortableList = sap.ui.getCore().byId("columnEdit--listAvailableColumns");
//		var listId = oSortableList.getId();
//		var listUlId = listId + "-listUl";
//		$("#"+listUlId).addClass('ui-sortable');
//		$("#"+listUlId).sortable({
//			connectWith : ".ui-sortable"
//		}).disableSelection();
         
    },
    
    onAssignColumns : function(oEvt){
    	 var aColumnsToAssign = sap.ui.getCore().byId("columnEdit--listAvailableColumns").getSelectedItem();
    	 airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").setProperty(aColumnsToAssign.getBindingContextPath()+"/Visible","true");
    },
    onUnassignColumns : function(oEvt){
   	 var aColumnsToAssign = sap.ui.getCore().byId("columnEdit--listAllocatedcolumns").getSelectedItem();
   	 airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").setProperty(aColumnsToAssign.getBindingContextPath()+"/Visible","false");
   },
   
   onDialogClose : function (oEvent) {
       //Close Popup
	   sap.ui.getCore().byId("columnEdit--columnEditDialog").close();

   },
   
   updateColumn : function(a) {
	   console.log(a); // TODO column management
   }
});
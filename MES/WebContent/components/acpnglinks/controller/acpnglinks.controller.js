"use strict";
sap.ui.controller("airbus.mes.acpnglinks.controller.acpnglinks", {
	
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
    },
    
    onAssignColumns : function(oEvt){
    	 var aColumnsToAssign = sap.ui.getCore().byId("columnEdit--listAvailableColumns").getSelectedItem();
    	 airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").setProperty(aColumnsToAssign.getBindingContextPath()+"/Visible","true");
    	 console.log(aColumnsToAssign);
    },
    onUnassignColumns : function(oEvt){
   	 var aColumnsToAssign = sap.ui.getCore().byId("columnEdit--listAllocatedcolumns").getSelectedItem();
   	 airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").setProperty(aColumnsToAssign.getBindingContextPath()+"/Visible","false");
   	 console.log(aColumnsToAssign);
   }
});
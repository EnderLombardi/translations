"use strict";
sap.ui.controller("airbus.mes.acpnglinks.controller.acpnglinks", {
	
	onAfterRendering : function() {
		var oTTbl = sap.ui.getCore().byId("acpnglinksView--ACPnGTreeTable");
		if (oTTbl != undefined){
			this.treeExpandAll(oTTbl);
			oTTbl.setVisibleRowCount(oTTbl._getRowCount());
			oTTbl.setSelectionMode(sap.ui.table.SelectionMode.Single);
		}
        
    },
    
    treeExpandAll : function(oTTbl) {  
	        for (var i=0; i<oTTbl._getRowCount(); i++){
				try{
		            oTTbl.expand(i);
	        	} catch(exception) {
	        		//do nothing
	        	}
       }
    },
    
    OnSelectionChange : function(oEvt){
    	airbus.mes.acpnglinks.oView.getModel("acpnglinksWorkOrderDetail").getProperty(oEvt.mParameters.rowBindingContext.sPath);
    	console.log(oEvt.getSource());
    }
});
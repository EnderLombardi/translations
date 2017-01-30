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
    }
});
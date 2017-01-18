"use strict";

sap.ui.controller("airbus.mes.jigtools.controller.jigtools", {

	// Get setting from ME/MII
	onAfterRendering : function(){
			
		//var sSet = airbus.mes.settings.AppConfManager.getConfiguration("VIEW_ATTACHED_TOOL");
		//test	
		var sSet = "O";
		switch(sSet){
			case "O":	
				sap.ui.getCore().byId("jigtoolsView--operationButton").setSelected(true);
			break;
				
			case "P":	
				sap.ui.getCore().byId("jigtoolsView--workOrderButton").setSelected(true);
			break;
			
			default: //if Null
		}
		this.filterJigsTools(sSet);
	},
	
	//get user action on the checkbox field
	onSelectLevel : function(oEvent) {
		
		var sId = oEvent.getSource().getId();
		switch(sId){
			case "jigtoolsView--operationButton":	
				this.filterJigsTools(airbus.mes.jigtools.util.ModelManager.operation);
			break;
				
			case "jigtoolsView--workOrderButton":	
				this.filterJigsTools(airbus.mes.jigtools.util.ModelManager.productionOrder);
			break;
			
			default:
		}
	},
	
	//table filter 
	filterJigsTools : function(sScope) {
		switch(sScope){
			case airbus.mes.jigtools.util.ModelManager.operation:	
				sap.ui.getCore().byId("jigtoolsView--jigToolList").getBinding("items").filter(new sap.ui.model.Filter("operation","EQ","operation2"));
			break;

			case airbus.mes.jigtools.util.ModelManager.productionOrder:	
				sap.ui.getCore().byId("jigtoolsView--jigToolList").getBinding("items").filter();
			break;
			
			default:	
		}
	}
}
);
                
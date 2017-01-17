"use strict";

sap.ui.controller("airbus.mes.jigtools.controller.jigtools", {
	
	onSelectLevel : function(oEvent) {
//		get the action
		var sId = oEvent.getSource().getId();

		switch(sId){
		case "jigtoolsView--operationButton":	
			// Filter on matérial number
			sap.ui.getCore().byId("jigtoolsView--jigToolList").getBinding("items").filter(new sap.ui.model.Filter("operation","EQ","operation2"));
		break;
			
		case "jigtoolsView--workOrderButton":	
			// No filter
			sap.ui.getCore().byId("jigtoolsView--jigToolList").getBinding("items").filter();
		break;
		
		default:
		}
	}
});
                
jQuery.sap.declare("airbus.mes.stationtracker.AssignmentManager")
airbus.mes.stationtracker.AssignmentManager = {
	
	bOpen : undefined,
	
	newLine : function(sKey) {
			
			airbus.mes.stationtracker.AssignmentManager.bOpen = true;
			scheduler.addSection({ key: Math.random() , newop:"" , name:"Select Operator"}, sKey);   
		
	},
	
}
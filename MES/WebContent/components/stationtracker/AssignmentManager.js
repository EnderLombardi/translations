jQuery.sap.declare("airbus.mes.stationtracker.AssignmentManager")
airbus.mes.stationtracker.AssignmentManager = {
	
	bOpen : undefined,
	bInitial : false,
	CpPress : false,
	
	newLine : function(sKey) {
			
			airbus.mes.stationtracker.AssignmentManager.bOpen = true;
			scheduler.addSection({ key: (Math.random()).toString() , newop:"" , name:"Select Operator"}, sKey );   
		
	},
	
	
		 idName : function(sText){
			 
			 var sTextF="";
			    var aText=sText.split(new RegExp("[ ]+", "g"));    // Récupère tous les mots dans un tableau : texte_decoup
			 
			    for (var i=0; i < aText.length; i++)
			    {
			    	if ( aText.length - 1=== i ){
			    		
			        sTextF += aText[i];  // le + " " NE FONCTIONNE PAS. IDEM AVEC String.fromCharCode(32) 
			    	
			    	} else {
			    		
			    		sTextF += aText[i] + "_";
			    		
			    	}
			    }
			    
			    return sTextF;
			},
				
}
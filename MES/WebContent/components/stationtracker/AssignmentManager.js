jQuery.sap.declare("airbus.mes.stationtracker.AssignmentManager")
airbus.mes.stationtracker.AssignmentManager = {
	
	bOpen : undefined,
	bInitial : false,
	CpPress : false,
	affectationHierarchy : {},
	polypolyAffectation : undefined,
	
	computeAffectationHierarchy : function() {
		
		var oHierarchy =  airbus.mes.stationtracker.AssignmentManager.affectationHierarchy = {};
		var oModel = sap.ui.getCore().getModel("affectationModel");
		
		// check if model full or not
		if(oModel.getProperty("/Rowsets/Rowset/0/Row")){              
			
			oModel = oModel.oData.Rowsets.Rowset[0].Row;
			
        } else  {
        	oModel = []
        	console.log("no affectation load");
        }
		
		oModel.forEach(function(el) {

			if (!oHierarchy[el.avlLine]) {

				oHierarchy[el.avlLine] = {};
			}
			if (!oHierarchy[el.avlLine][el.day]) {

				oHierarchy[el.avlLine][el.day] = {};
			}
			if (!oHierarchy[el.avlLine][el.day][el.shiftName]) {

				oHierarchy[el.avlLine][el.day][el.shiftName] = [];
			}
			
			var userAffectation = {

				"user" : el.operator,
				"firstName" : el.firstName,
				"lastName" : el.lastName,
				"email" : el.email,
				"picture" : el.picture,
			};

			oHierarchy[el.avlLine][el.day][el.shiftName].push(userAffectation);
		});
		
	},
	
	newLine : function(sKey) {
			
			airbus.mes.stationtracker.AssignmentManager.bOpen = true;
			scheduler.addSection({ key: (Math.random()).toString() , rescheduled:"R" , name:"Select Operator"}, sKey );   
		
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
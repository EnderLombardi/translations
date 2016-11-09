jQuery.sap.declare("airbus.mes.stationtracker.AssignmentManager")
airbus.mes.stationtracker.AssignmentManager = {
	
	bOpen : undefined,
	bInitial : false,
	CpPress : false,
	affectationHierarchy : {},
	polypolyAffectation : undefined,
	userSelected : "%",
	avlLineSelected : "%",
	polypolyAssignment : {
		selectedLine : undefined,
		selectedUser : {
			login : "NA"
		},
		selectedShift : undefined,
	},
	
	handleLineAssignment : function( sModeAssignment, bIgnoreCheckQA) {
		var sUserID = airbus.mes.stationtracker.AssignmentManager.polypolyAssignment.selectedUser.login;
		var sShiftName = airbus.mes.stationtracker.AssignmentManager.polypolyAssignment.selectedShift.shiftName;
		var sDay = airbus.mes.stationtracker.AssignmentManager.polypolyAssignment.selectedShift.day;
		var sAVLLineSKILL = airbus.mes.stationtracker.AssignmentManager.polypolyAssignment.selectedLine.avlLine;
		var sLine = sAVLLineSKILL.split("_")[0];
		var sSkill = sAVLLineSKILL.split("_")[1];
		var sSite = airbus.mes.settings.ModelManager.site;
		var sStation = airbus.mes.settings.ModelManager.station;
		var sMSN = airbus.mes.settings.ModelManager.msn;
		var sMyUserID = "MESYS"; //FIXME ??
		
		sDay = (new Date(sDay)).toISOString().slice(0,10).replace(/-/g,"");
		
		airbus.mes.stationtracker.ModelManager.setLineAssignment(sSite, sStation, sMSN, sUserID, sShiftName, sDay, sLine, sSkill, sMyUserID, sModeAssignment, bIgnoreCheckQA);

	},
	
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
			if (!oHierarchy[el.avlLine][el.shiftID]) {

				oHierarchy[el.avlLine][el.shiftID] = [];
			}
			
			var userAffectation = {

				"user" : el.operator,
				"firstName" : el.firstName,
				"lastName" : el.lastName,
				"email" : el.email,
				"picture" : el.picture,
				"warn" : el.warn,
			};

			oHierarchy[el.avlLine][el.shiftID].push(userAffectation);
		});
		
	},
	
	/**
	 *	action attach to + button on scheduler 
	 */
	newLine : function(sKey) {
//			TODO : only 9 numbers (INTEGER --> 9 numbers) problem with unicity
//			Define an unique identifier for the AVL Line by using the date in millisecond
			var oDate = new Date(); 
			var sAVLKey = oDate.getTime();

			airbus.mes.stationtracker.AssignmentManager.bOpen = true;
			scheduler.addSection({ key: sAVLKey , rescheduled:"R" , name:"Select Operator"}, sKey );   
		
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

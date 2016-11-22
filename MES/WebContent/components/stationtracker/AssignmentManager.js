"use strict";

jQuery.sap.declare("airbus.mes.stationtracker.AssignmentManager")
airbus.mes.stationtracker.AssignmentManager = {
	
	bOpen : undefined,
	bInitial : false,
	CpPress : false,
	affectationHierarchy : {},
	polypolyAffectation : undefined,
	checkQA : false,
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
		var sUserID ;
		switch(sModeAssignment){
		case "S" :
			sUserID = airbus.mes.stationtracker.AssignmentManager.polypolyAssignment.selectedUser.login;
			break;
		case "D" :
			sUserID = undefined;
			break;
		case "W" :
			sUserID = airbus.mes.stationtracker.AssignmentManager.affectationHierarchy[airbus.mes.stationtracker.AssignmentManager.polypolyAssignment.selectedLine.avlLine][airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftID][0].user;
//			airbus.mes.stationtracker.AssignmentManager.checkQA = false;
			sModeAssignment = "S";
			break;
		default:
		}
		var sShiftName = airbus.mes.stationtracker.AssignmentManager.polypolyAssignment.selectedShift.shiftName;
		var sDay = airbus.mes.stationtracker.AssignmentManager.polypolyAssignment.selectedShift.day;
		var sAVLLineSKILL = airbus.mes.stationtracker.AssignmentManager.polypolyAssignment.selectedLine.avlLine;
		var sLine = sAVLLineSKILL.split("_")[0];
		var sSkill = sAVLLineSKILL.split("_")[1];
		var sSite = airbus.mes.settings.ModelManager.site;
		var sStation = airbus.mes.settings.ModelManager.station;
		var sMSN = airbus.mes.settings.ModelManager.msn;
//		var sMyUserID = "UserBO:" + sSite + ",NG55E48"; //FIXME ??
//		var sMyUserID = "UserBO:" + sSite + "," + Cookies.getJSON("login").user; //FIXME ??

		
//		sDay = (new Date(sDay)).toISOString().slice(0,10).replace(/-/g,"");
		
		airbus.mes.stationtracker.ModelManager.setLineAssignment(sSite, sStation, sMSN, sUserID, sShiftName, sDay, sLine, sSkill, sModeAssignment, bIgnoreCheckQA);

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

			if (!oHierarchy[el.avlLine + "_" + el.skills]) {

				oHierarchy[el.avlLine + "_" + el.skills] = {};
			}
			if (!oHierarchy[el.avlLine + "_" + el.skills][el.shiftName.split(",")[1] + el.day]) {

				oHierarchy[el.avlLine + "_" + el.skills][el.shiftName.split(",")[1] + el.day] = [];
			}
			
			var userAffectation = {

				"user" : el.user,
//				"user" : el.operator,
				"firstName" : el.firstName,
				"lastName" : el.lastName,
				"email" : el.email,
				//"picture" : el.picture,
				"picture": el.user,
				"warn" : el.warn,
			};

			oHierarchy[el.avlLine + "_" + el.skills][el.shiftName.split(",")[1] + el.day].push(userAffectation);
		});
		
	},
	
	/**
	 *	action attach to + button on scheduler 
	 */
	newLine : function(sKey) {
//			TODO : only 9 numbers (INTEGER --> 9 numbers)
//			Define an unique identifier for the AVL Line by the difference in milliseconde between the 01/01/2016 and the current date
//		    at 03/01/2020, value will be more than 9 numbers
			var sAVLKey = Math.floor((new Date() - new Date("2016-11-01")) /100)

			airbus.mes.stationtracker.AssignmentManager.bOpen = true;
			scheduler.addSection({ key: sAVLKey , rescheduled:"R" , name:"Select Operator" }, sKey );   
		
	},
	
	 idName : function(sText){
			 
			 var sTextF="";
			 var aText=sText.split(new RegExp("[ ]+", "g"));    // Récupère tous les mots dans un tableau : texte_decoup
			 
			 for (var i=0; i < aText.length; i++) {
				 if ( aText.length - 1=== i ){
					 sTextF += aText[i];  // le + " " NE FONCTIONNE PAS. IDEM AVEC String.fromCharCode(32) 
					 } else {
						 sTextF += aText[i] + "_";
					}
			    }
			    
			    return sTextF;
			},
				
}

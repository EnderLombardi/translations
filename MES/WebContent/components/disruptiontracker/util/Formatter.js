"use strict";

jQuery.sap.declare("airbus.mes.disruptiontracker.Formatter");

airbus.mes.disruptiontracker.Formatter = {
		
		setText : function(status, gravity, escalation) {
			
			if(status == "CLOSED") {
				return "Solved";
			} else if(gravity == 3 || escalation == 2 || escalation == 3)
				return "Blocked";
			else if(gravity == 1)
				return "Not Blocked";
			else if(gravity == 2)
				return "Disturbed";
			else
				return "";
		},

	setState : function(status, gravity, escalation) {
		
		if(status == "CLOSED")
			return "Success";
		
		else if(status == "SOLVED") {
			
			if(escalation == 2 || escalation == 3)
				return "Error";
			
			else if(gravity == 3)
				return "Warning";
		} else if(escalation == 2 || escalation == 3)
			return "Error";
		
		else if(gravity == 3)
			return "Warning";
		
		else if(gravity == 1 || gravity == 2)
			return "Success";
		
		else
			return "None";

	},
	
	setGravityColor : function(sStatus, iGravity, sEscalation){
		
		switch(iGravity) {
		case "1":
			return airbus.mes.settings.AppConfManager._getConfiguration("MES_COLOR_GRAVITY1");
			break;
		case "2":
			return airbus.mes.settings.AppConfManager._getConfiguration("MES_COLOR_GRAVITY2");
			break;
			
		case "3":
			/*if(escalationLevel>1)
				return "red";
			else
				return "orange";*/		
			return airbus.mes.settings.AppConfManager._getConfiguration("MES_COLOR_GRAVITY3");
			break;
		default:
			return "";
			break;
		}
		
	},

	setIcon : function(status) {
		
		if(status == "CLOSED")
			return "sap-icon://sys-enter-2";
		
		else {
			
			return "sap-icon://alert";
		}
		

	},
	
	formatOperation: function(operation){
		if(operation != undefined && operation != "")
			return operation.split(",")[1];
		
	},
	
	formatOpeningTime: function(openDate, closureDate){
		if(closureDate == undefined || closureDate == "")
			return 0;
		
		var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
		var aOpenDate = reggie.exec(openDate); 
		var oOpenDate = new Date(
		    (+aOpenDate[1]),
		    (+aOpenDate[2])-1, // Careful, month starts at 0!
		    (+aOpenDate[3]),
		    (+aOpenDate[4]),
		    (+aOpenDate[5]),
		    (+aOpenDate[6])
		);
		
		var aClosureDate = reggie.exec(closureDate); 
		var oClosureDate = new Date(
		    (+aClosureDate[1]),
		    (+aClosureDate[2])-1, // Careful, month starts at 0!
		    (+aClosureDate[3]),
		    (+aClosureDate[4]),
		    (+aClosureDate[5]),
		    (+aClosureDate[6])
		);
		
		var unit = airbus.mes.settings.AppConfManager._getConfiguration("MES_TIME_UNIT");
		
		var openingTime;
		
		if (unit == "HR")
			openingTime = ( Math.round( (oClosureDate - oOpenDate)/(1000 * 60 * 60) * 100 ) / 100 ) + " Hr";
			
		else if (unit == "IM")
			openingTime = ( Math.round( (oClosureDate - oOpenDate) * 100 / (1000 * 60 * 60) * 100 ) / 100 ) + " IM";
			
		else if (unit == "M")
			openingTime = ( Math.round( (oClosureDate - oOpenDate)/(1000 * 60) * 100 ) / 100 ) + " Min";
			
		else if (unit == "D")
			openingTime = ( Math.round( (oClosureDate - oOpenDate)/(1000 * 60 * 60 * 24) * 100 ) / 100 ) + " Days";
		
		return openingTime;
	},
	
	setEscalationText : function(escalationLevel) {
		if(escalationLevel == 1)
			return "Not Escalated";
		
		else if(escalationLevel == 2)
			return "First Escalation";
		
		else if(escalationLevel == 3)
			return "Final Escalation";
		else
			return "-----";
	}
};

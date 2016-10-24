"use strict";

jQuery.sap.declare("airbus.mes.disruptiontracker.Formatter");

airbus.mes.disruptiontracker.Formatter = {

	setState : function(gravity, escalation) {
		
		if(gravity == "Solved")
			return "Success";
		
		else if(gravity == "Blocked"){
			
			if(escalation.length == 0){
				return "Warning";}
			else
				return "Error";
			
		}

	},

	setIcon : function(gravity) {
		
		if(gravity == "Solved")
			return "sap-icon://sys-enter-2";
		
		else if(gravity == "Blocked")
			return "sap-icon://alert";

	}
};
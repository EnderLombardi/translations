"use strict";

jQuery.sap.declare("airbus.mes.disruptiontracker.Formatter");

airbus.mes.disruptiontracker.Formatter = {
		
		setText : function(status) {
			
			if(status == "CLOSED") {
				return "Solved";
			}
			return "Blocked";
		},

	setState : function(status, gravity, escalation) {
		
		if(status == "CLOSED")
			return "Success";
		
		else if(status == "SOLVED") {
			
			if(escalation == 2 || escalation == 3)
				return "Error";
			
			else if(gravity == 3)
				return "Warning";
		}
		
		else if(escalation == 2 || escalation == 3)
			return "Error";
		
		else if(gravity == 3)
			return "Warning";
		
		else if(gravity == 1 || gravity == 2)
			return "Success";
		
		else
			return "None";

	},

	setIcon : function(status) {
		
		if(status == "CLOSED")
			return "sap-icon://sys-enter-2";
		
		else if(status == "SOLVED") {
			
			return "sap-icon://alert";
		}
		else
			return "sap-icon://status-critical";
		
		
		
		
		
		
		if(status == "CLOSED")
			return "sap-icon://sys-enter-2";
		
		else if(status == "SOLVED")
			return "sap-icon://alert";
		
		else
			return "sap-icon://status-critical";

	}
};
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
	
	formatTTGF: function(ttgf){
		if(ttgf == undefined || ttgf == "")
			return 0;
		
		var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
		var aTTGF = reggie.exec(ttgf); 
		var oTTGF = new Date(
		    (+aTTGF[1]),
		    (+aTTGF[2])-1, // Careful, month starts at 0!
		    (+aTTGF[3]),
		    (+aTTGF[4]),
		    (+aTTGF[5]),
		    (+aTTGF[6])
		);
		
		var oDate = new Date();
		
		/***********************************************************
		 * Convert Difference in to Days, Hours and Minutes format
		 */
		var seconds = Math.floor((oTTGF- oDate)/1000);
		if(seconds <= 0 )
			return 0;
		
		var minutes = Math.floor(seconds/60);
		var hours = Math.floor(minutes/60);
		var days = Math.floor(hours/24);

		hours = hours-(days*24);
		minutes = minutes-(days*24*60)-(hours*60);
		seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);	
		
		var sTime = "";
		
		if(days > 0)
			sTime = sTime + days + "D";
		
		if(hours > 0){
			if(sTime != "")
				sTime = sTime + " ";
			sTime = sTime + hours + "H";
		}
		
		if(minutes > 0){
			if(sTime != "")
				sTime = sTime + " ";
			sTime = sTime + minutes + "M";
		}
		
		if(seconds > 0){
			if(sTime != "")
				sTime = sTime + " ";
			sTime = sTime + seconds + "S";
		}
		
		return sTime;
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
"use strict";

jQuery.sap.declare("airbus.mes.disrtuptions.Formatter");

airbus.mes.disruptions.Formatter = {
	monthNames : [ "January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December" ],
			
	status: {
		"pending": "Pending",
		"closed" : "Closed",
		"acknowledged" : "Acknowledged",
		"solved" : "Solved",
		"rejected" : "Rejected"
	},
	
	severity: {
		"info": "INTO",
		"warning" : "CLOSED",
		"critical" : "CRITICAL"
	},

	defaultDateConversion : function(defaultDate, defaultTime) {

		return defaultDate.getFullYear() + "-" + defaultDate.getMonth() + "-"
				+ defaultDate.getDate()
	},

	setText : function(status, gravity, escalation) {

		if (status == airbus.mes.disruptions.Formatter.status.closed) {
			return airbus.mes.disruptions.Formatter.status.solved;
		} else if (gravity == 3 || escalation == 2 || escalation == 3)
			return "Blocked";
		else if (gravity == 1)
			return "Not Blocked";
		else if (gravity == 2)
			return "Disturbed";
	},

	getDate : function(datetime) {
		
		if(datetime == null || datetime === undefined)
			{
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth(); // January is 0!

			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd
			}

			var month = airbus.mes.disruptions.Formatter.monthNames[mm];

			return (month + ' ' + dd + ',' + yyyy);
		} else {
			return datetime.split(" ")[0];
		}

	},

	getTime : function(datetime) {
		
		if(datetime == null || datetime === undefined)
			{
			var today = new Date();
			var HH = today.getHours();
			var mm = today.getMinutes();
			var ss = today.getSeconds();

			return (HH + ":" + mm + ":" + ss);
		} else {

			return datetime.split(" ")[1];

		}
	},

	setEditButtonVisibility : function(originatorFlag, status) {

		if (originatorFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.solved || status == airbus.mes.disruptions.Formatter.status.reject || status == airbus.mes.disruptions.Formatter.status.pending) {
				return true;
			}
		}

		return false;
	},

	setDeleteButtonVisibility : function(originatorFlag) {

		if (originatorFlag == 'X') {
			return true;
		}

		return false;
	},

	setCloseButtonVisibility : function(originatorFlag, status) {

		if (originatorFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.solved || status == airbus.mes.disruptions.Formatter.status.reject || status == airbus.mes.disruptions.Formatter.status.pending) {
				return true;
			}
		}

		return false;
	},

	setRejectButtonVisibility : function(responsibleFlag, status) {

		if (responsibleFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.rejected) {
				
				this.setText(airbus.mes.disruptions.Formatter.status.rejected);
				this.setEnabled(false);
				
				return true;
				
			} else if (status == airbus.mes.disruptions.Formatter.status.pending) {
				return true;
				
			} else if(status == airbus.mes.disruptions.Formatter.status.acknowledged) {
				
				return true;
				
			}

		}

		return false;
	},

	setAddCommentButtonVisibility : function(originatorFlag, responsibleFlag) {

		return true;
	},

	setAcknowledgeButtonVisibility : function(responsibleFlag, status) {

		if (responsibleFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.pending) {
				return true;
			}
		}

		return false;
	},

	setEscalateButtonVisibility : function(originatorFlag, severity) {

		if (originatorFlag == "X") {

			if (severity == airbus.mes.disruptions.Formatter.severity.info) {
				
				this.setText("Escalate to Level 1")
				
			} else if (severity == airbus.mes.disruptions.Formatter.severity.warning) {
				
				this.setText("Escalate to Level 2")
				
			} else if (severity == airbus.mes.disruptions.Formatter.severity.critical) {
				
				this.setText("Escalated");
				this.setEnabled(false);
				
			}
			
			return true;

		}

		return false;
	},

	setMarkSolvedButtonVisibility : function(responsibleFlag, status) {

		if (responsibleFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.acknowledged) {
				return true;
			}
		}

		return false;
	}

};

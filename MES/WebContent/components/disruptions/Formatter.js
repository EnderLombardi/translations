"use strict";

jQuery.sap.declare("airbus.mes.disrtuptions.Formatter");

airbus.mes.disruptions.Formatter = {
	monthNames : [ "January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December" ],

	status : {
		"pending" : "Pending",
		"closed" : "Closed",
		"acknowledged" : "Acknowledged",
		"solved" : "Solved",
		"rejected" : "Rejected",
		"deleted" : "Deleted"
	},

	defaultDateConversion : function(defaultDate, defaultTime) {

		return defaultDate.getFullYear() + "-" + defaultDate.getMonth() + "-"
				+ defaultDate.getDate();
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

		if (datetime == null || datetime === undefined) {
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

		if (datetime == null || datetime === undefined) {
			var today = new Date();
			var HH = today.getHours();
			var mm = today.getMinutes();
			var ss = today.getSeconds();

			return (HH + ":" + mm + ":" + ss);
		} else {

			return datetime.split(" ")[1];

		}
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
	},
	
	setEditButtonVisibility : function(originatorFlag, status) {

		if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {
			return false;
		} else if (originatorFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.solved
					|| status == airbus.mes.disruptions.Formatter.status.reject
					|| status == airbus.mes.disruptions.Formatter.status.pending) {

				return true;
			}
		}

		return false;
	},

	setDeleteButtonVisibility : function(originatorFlag, status) {

		if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {
			return false;
		} else if (originatorFlag == 'X') {

			return true;
		}

		return false;
	},

	setCloseButtonVisibility : function(originatorFlag, status) {

		if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {
			return false;
		} else if (originatorFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.solved
					|| status == airbus.mes.disruptions.Formatter.status.reject
					|| status == airbus.mes.disruptions.Formatter.status.pending) {

				return true;
			}
		}

		return false;
	},

	setRejectButtonVisibility : function(responsibleFlag, status) {

		if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {
			return false;
		} else if (responsibleFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.rejected) {

				this.setText(airbus.mes.disruptions.Formatter.status.rejected);
				this.setEnabled(false);

				return true;

			} else if (status == airbus.mes.disruptions.Formatter.status.pending) {

				return true;

			} else if (status == airbus.mes.disruptions.Formatter.status.acknowledged) {

				return true;

			}

		}

		return false;
	},

	setAddCommentButtonVisibility : function(originatorFlag, responsibleFlag, status) {

		if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed)
			return false;
		
		else 
			return true;
	},

	setAcknowledgeButtonVisibility : function(responsibleFlag, status) {

		if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {
			return false;
		} else if (responsibleFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.pending) {

				return true;
			}
		}

		return false;
	},

	setEscalateButtonVisibility : function(originatorFlag, escalation, status) {

		if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {
			return false;
		} else if (originatorFlag != "X" || escalation == 3)
			return false;

		else
			return true;
	},

	setMarkSolvedButtonVisibility : function(responsibleFlag, status) {

		if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {
			return false;
		} else if (responsibleFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.acknowledged) {

				return true;
			}
		}

		return false;
	},
	
	setEmptyPromisedDateTimeText : function(dateTime) {
		if(dateTime == "")
			return "--:--:--";
		
		return dateTime;
	},
	
	textCaseFormat : function(text) {
		text = text.toLowerCase();
		return text;
	},
	
	setClosureDateVisibility : function(status) {
		if (status == airbus.mes.disruptions.Formatter.status.closed)
			return true;
		
		return false;
	},
	
	setTimeBeforeNextEscVisibility : function(escalationLevel) {
		if(escalationLevel < 3)
			return true;
		
		return false;
	}

};

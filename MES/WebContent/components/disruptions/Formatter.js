"use strict";

jQuery.sap.declare("airbus.mes.disruptions.Formatter");

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

	setGravityText : function(gravity) {

		if (gravity == 1)
			return airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("NotBlocked");
		else if (gravity == 2)
			return airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("Disturbed");
		else if (gravity == 3)
			return airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("Blocked");
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
			return airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("NotEscalated");
		
		else if(escalationLevel == 2)
			return airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("FirstEscalation");
		
		else if(escalationLevel == 3)
			return airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("FinalEscalation");
		else
			return "-----";
	},
	
	setEditButtonVisibility : function(originatorFlag, responsibleFlag, status) {

		if (originatorFlag != "X" && responsibleFlag != "X")
			return false;
		
		else if (originatorFlag == "X" && responsibleFlag != "X" && status == airbus.mes.disruptions.Formatter.status.acknowledged)
			return false;
		
		else if (status == airbus.mes.disruptions.Formatter.status.pending && responsibleFlag == "X" && originatorFlag != "X")
			return false;
		
		else if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {
			return false;
		}
		
		return true;
	},

	setDeleteButtonVisibility : function(originatorFlag, status) {

		if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {
			return false;
		} 
		else if (originatorFlag == 'X') {

			return true;
		}

		return false;
	},

	setCloseButtonVisibility : function(originatorFlag, status) {

		if (originatorFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.solved
					|| status == airbus.mes.disruptions.Formatter.status.reject
					|| status == airbus.mes.disruptions.Formatter.status.pending) {

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

			}
			else if (status == airbus.mes.disruptions.Formatter.status.pending || status == airbus.mes.disruptions.Formatter.status.acknowledged) {

				return true;

			}

		}

		return false;
	},

	setAddCommentButtonVisibility : function(originatorFlag, responsibleFlag, status) {

		if (originatorFlag == "X" && responsibleFlag != "X" && status == airbus.mes.disruptions.Formatter.status.acknowledged)
			return false;
		
		else if (originatorFlag != "X" && responsibleFlag != "X")
			return false;
		
		else if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed)
			return false;
		
		else 
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

	setEscalateButtonVisibility : function(originatorFlag, escalation, status) {

		if (status == airbus.mes.disruptions.Formatter.status.solved || status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {
			return false;
		} 
		else if (originatorFlag == "X" && escalation < 3)
			return true;

		else
			return false;
	},

	setMarkSolvedButtonVisibility : function(responsibleFlag, status) {

		if (responsibleFlag == "X") {

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
	},
	
	setSolutionVisibility : function(solution) {
		if(solution == "")
			return false;
		
		return true;
	},
	
	setDisruptionTitle : function(iGravity){
		
		var sGravity;
		switch(iGravity)
		{
		case "1":
			return "green";
		case "2":
			return "orange";
		case "3":
			return "red";
		}
	}

};

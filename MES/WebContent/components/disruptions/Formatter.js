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
	
	setDisruptionTitle : function(iGravity, escalationLevel){
		
		switch(iGravity) {
		case "1":
			return airbus.mes.settings.AppConfManager._getConfiguration("MES_COLOR_GRAVITY1");
			break;
		case "2":
			if(airbus.mes.settings.AppConfManager._getConfiguration("MES_COLOR_GRAVITY2") === "Amber")
				return "#FFC200";
				
			return airbus.mes.settings.AppConfManager._getConfiguration("MES_COLOR_GRAVITY2");
			break;
		case "3":
			return airbus.mes.settings.AppConfManager._getConfiguration("MES_COLOR_GRAVITY3");
			break;
		default:
			return "";
			break;
		}
	},
	
	setGravityText : function(gravity) {
		
		var property;
		
		switch(gravity) {
		case "1":
			property = airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("NotBlocked");
			break;
		case "2":
			property = airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("Disturbed");
			break;
		case "3":
			property = airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("Blocked");
			break;
		default:
			break;
		}
		return property;
	},

	setTimeLostValue : function(timeLost) {
		
		var timeUnit = airbus.mes.disruptions.Formatter.getConfigTimeUnit();
		
		if (timeLost != "") {
			return airbus.mes.disruptions.Formatter.timeMillisecondsToConfig(timeLost) + " " + timeUnit;
		}
		
		return 0 + " " + timeUnit;
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
		
		else if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed)
			return false;
		
		else if (originatorFlag == "X" && responsibleFlag != "X" && status == airbus.mes.disruptions.Formatter.status.acknowledged)
			return false;
		
		else if ( (status == airbus.mes.disruptions.Formatter.status.pending || status == airbus.mes.disruptions.Formatter.status.rejected)
					&& responsibleFlag == "X" && originatorFlag != "X")
			return false;

		return true;
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

		if (originatorFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.solved
					|| status == airbus.mes.disruptions.Formatter.status.rejected
					|| status == airbus.mes.disruptions.Formatter.status.pending) {

				return true;
			}
		}

		return false;
	},

	setRejectButtonVisibility : function(originatorFlag, responsibleFlag, status) {

		if (responsibleFlag == "X" && originatorFlag != "X") {

			if (status == airbus.mes.disruptions.Formatter.status.rejected) {

				this.setText(airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("rejected"));
				this.setEnabled(false);

				return true;

			} else if (status == airbus.mes.disruptions.Formatter.status.pending || status == airbus.mes.disruptions.Formatter.status.acknowledged) {
				
				this.setText(airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("reject"));
				this.setEnabled(true);
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

	setAcknowledgeButtonVisibility : function(originatorFlag, responsibleFlag, status) {

		if (originatorFlag != "X" && responsibleFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.pending) {

				return true;
			}
		}

		return false;
	},

	setEscalateButtonVisibility : function(originatorFlag, escalation, status) {

	if (status == airbus.mes.disruptions.Formatter.status.solved || status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {
		return false;
	} else if (originatorFlag == "X" && escalation < 3)
		return true;
		else
			return false;
	},

	setMarkSolvedButtonVisibility : function(originatorFlag, responsibleFlag, status) {

		if (originatorFlag != "X" && responsibleFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.acknowledged) {

				return true;
			}
		}

		return false;
	},
	
	setRefuseButtonVisibility : function(originatorFlag, responsibleFlag, status) {
		if (originatorFlag == "X" && responsibleFlag != "X" && status == airbus.mes.disruptions.Formatter.status.solved)
			return true;

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
	
	/*setTimeBeforeNextEsc : function(escalationLevel) {
		if(escalationLevel == 3)
			this.setText(airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("escalated"));
	},*/
	
	setSolutionVisibility : function(solution) {
		if(solution == "")
			return false;
		
		return true;
	},
	
	setMaterialqty :function(oText) {
		var loString;
		var loNewStr;
		if (oText){
			loString = oText.replace(/[(]/g , " Quantity-");
			loNewStr = loString.replace(/[)]/g,"");
			loNewStr = loNewStr.replace(/[,]/g,"\n");
			
		} else {
			
			loNewStr = "-";
			
		}
		return loNewStr;
		
	},
	

	
	setOpeningTimeVisibility : function(closureDate) {
		if (closureDate != "")
			return true;
		
		return false;
	},
	
	formatOpeningTime : function(openDate, closureDate) {
		
		if (closureDate == undefined || closureDate == "")
			return 0;
		
		var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
		var aOpenDate = reggie.exec(openDate);
		var oOpenDate = new Date((+aOpenDate[1]), (+aOpenDate[2]) - 1, // Careful,
																		// month
																		// starts
																		// at 0!
		(+aOpenDate[3]), (+aOpenDate[4]), (+aOpenDate[5]), (+aOpenDate[6]));

		var aClosureDate = reggie.exec(closureDate);
		var oClosureDate = new Date((+aClosureDate[1]), (+aClosureDate[2]) - 1, // Careful,
																				// month
																				// starts
																				// at
																				// 0!
		(+aClosureDate[3]), (+aClosureDate[4]), (+aClosureDate[5]),
				(+aClosureDate[6]));

		var unit = airbus.mes.settings.AppConfManager._getConfiguration("MES_TIME_UNIT");

		var openingTime;

		if (unit == "H")
			openingTime = airbus.mes.disruptions.Formatter.removeDecimal( ((oClosureDate - oOpenDate) / (1000 * 60 * 60)).toFixed(2) ) + " Hr";

		else if (unit == "IM")
			openingTime = airbus.mes.disruptions.Formatter.removeDecimal( ((oClosureDate - oOpenDate) * 100 / (1000 * 60 * 60)).toFixed(2) ) + " IM";

		else if (unit == "M")
			openingTime = airbus.mes.disruptions.Formatter.removeDecimal( ((oClosureDate - oOpenDate) / (1000 * 60)).toFixed(2) ) + " Min";

		else if (unit == "D")
			openingTime = airbus.mes.disruptions.Formatter.removeDecimal( ((oClosureDate - oOpenDate) / (1000 * 60 * 60 * 24)).toFixed(2) ) + " Days";

		return openingTime;
	},
	
	timeToMilliseconds : function (time) {
		
		var timeUnit = airbus.mes.settings.AppConfManager._getConfiguration("MES_TIME_UNIT");
		
		if (timeUnit == "H")
			return ( time * 60 * 60 * 1000 );
			
		else if (timeUnit == "IM")
			return ( (time / 100) * 60 * 60 * 1000 );
		
		else if (timeUnit == "M")
			return ( time * 60 * 1000 );
		
		else if (timeUnit == "D")
			return ( time * 24 * 60 * 60 * 1000 );
				
		return;
	},
	
	timeMillisecondsToConfig : function (time) {
		
		var timeUnit = airbus.mes.settings.AppConfManager._getConfiguration("MES_TIME_UNIT");
		
		if (timeUnit == "H")
			time = (time / (60 * 60 * 1000)).toFixed(2);
			
		else if (timeUnit == "IM")
			time = ((time * 100) / (60 * 60 * 1000)).toFixed(2);
		
		else if (timeUnit == "M")
			time = (time / (60 * 1000)).toFixed(2);
		
		else if (timeUnit == "D")
			time = (time / (24 * 60 * 60 * 1000)).toFixed(2);
				
		return airbus.mes.disruptions.Formatter.removeDecimal(time);
	},
	
	getConfigTimeUnit : function() {
		
		var timeUnit = airbus.mes.settings.AppConfManager._getConfiguration("MES_TIME_UNIT");
		
		if (timeUnit == "H")
			return "Hr";

		else if (timeUnit == "IM")
			return "IM";

		else if (timeUnit == "M")
			return "Min";

		else if (timeUnit == "D")
			return "Days";
		
		return;
		
	},
	
	getConfigTimeFullUnit : function() {
		
		var timeUnit = airbus.mes.settings.AppConfManager._getConfiguration("MES_TIME_UNIT");
		
		if (timeUnit == "H")
			return "Hours";

		else if (timeUnit == "IM")
			return "Industrial Minutes";

		else if (timeUnit == "M")
			return "Minutes";

		else if (timeUnit == "D")
			return "Days";
		
		return;
		
	},
	
	removeDecimal : function(num) {
		var iNum = parseInt(num);
		
		if (num-iNum == 0)
			return iNum;
		
		return num;
	},
	
	setDisruptionStatus : function(status){
		return airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty(status);
	}


};

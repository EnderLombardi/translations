"use strict";

jQuery.sap.declare("airbus.mes.disruptiontracker.Formatter");

airbus.mes.disruptiontracker.Formatter = {

	getConfigTimeUnit : function() {

		var timeUnit = airbus.mes.settings.util.AppConfManager._getConfiguration("MES_TIME_UNIT");

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

	setSeverityText : function(status, gravity, escalation) {

		if (status == "CLOSED") {
			return airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("solved");
		} else if (gravity == 3 || escalation == 2 || escalation == 3)
			return airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("blocked");
		else if (gravity == 1)
			return airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("not_Blocked");
		else if (gravity == 2)
			return airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("disturbed");
		else
			return "";
	},

	setGravityColor : function(iGravity) {

		switch (iGravity) {
		case "1":
			return airbus.mes.settings.util.AppConfManager._getConfiguration("MES_COLOR_GRAVITY1");
		case "2":
			if (airbus.mes.settings.util.AppConfManager._getConfiguration("MES_COLOR_GRAVITY2") === "Amber")
				return "#FFC200";
			return airbus.mes.settings.util.AppConfManager._getConfiguration("MES_COLOR_GRAVITY2");
		case "3":
			return airbus.mes.settings.util.AppConfManager._getConfiguration("MES_COLOR_GRAVITY3");
		default:
			return "";
		}
	},
	setGravityText : function(gravity) {

		var property;

		switch (gravity) {
		case "1":
			property = airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("NotBlocked");
			break;
		case "2":
			property = airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("Disturbed");
			break;
		case "3":
			property = airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("Blocked");
			break;
		default:
			break;
		}
		return property;
	},

	setIcon : function(status) {

		if (status == "CLOSED")
			return "sap-icon://sys-enter-2";
		else {
			return "sap-icon://alert";
		}

	},

	formatOperation : function(operation) {
		if (operation != undefined && operation != "") {
			if (operation.indexOf("OperationBO:") != -1) {
				return operation.split(",")[1];
			} else {
				return operation;
			}
		} else
			return "";

	},

	timeMillisecondsToConfig : function(iTime) {
		if (iTime == undefined || iTime =="")
			return "---";


		var unit = airbus.mes.settings.util.AppConfManager._getConfiguration("MES_TIME_UNIT");

		var iFormattedTime;

		if (unit === "H")
			iFormattedTime = (Math.round((iTime) / (1000 * 60 * 60) * 100) / 100) + " Hr";

		else if (unit === "IM")
			iFormattedTime = (Math.round((iTime) * 100 / (1000 * 60 * 60) * 100) / 100) + " IM";

		else if (unit === "M")
			iFormattedTime = (Math.round((iTime) / (1000 * 60) * 100) / 100) + " Min";

		else if (unit === "D")
			iFormattedTime = (Math.round((iTime) / (1000 * 60 * 60 * 24) * 100) / 100) + " Days";

		return airbus.mes.disruptiontracker.Formatter.removeDecimal(iFormattedTime);
	},

	removeDecimal : function(num) {
		var iNum = parseInt(num, 10);

		if (num - iNum == 0)
			return iNum;

		return num;
	},

	setEscalationText : function(escalationLevel) {
		if (escalationLevel == 1)
			return airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("not_Escalated");

		else if (escalationLevel == 2)
			return airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("first_Escalated");

		else if (escalationLevel == 3)
			return airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("final_Escalated");
		else
			return "-----";
	},

	setOperationText : function(operation) {
		if (operation)
			var operationText = operation.substring(operation.length - 6, operation.length - 2);
		return operationText;

	},

	/*setTimeLostValue : function(timeLost) {
		var timeUnit = airbus.mes.disruptiontracker.Formatter.getConfigTimeUnit();

		if (timeLost != "") {
			return airbus.mes.disruptiontracker.Formatter.timeMillisecondsToConfig(timeLost) + " " + timeUnit;
		}

		return 0 + " " + timeUnit;
	},

	timeMillisecondsToConfig : function(time) {

		var timeUnit = airbus.mes.settings.util.AppConfManager._getConfiguration("MES_TIME_UNIT");

		if (timeUnit == "H")
			time = (time / (60 * 60 * 1000)).toFixed(2);

		else if (timeUnit == "IM")
			time = ((time * 100) / (60 * 60 * 1000)).toFixed(2);

		else if (timeUnit == "M")
			time = (time / (60 * 1000)).toFixed(2);

		else if (timeUnit == "D")
			time = (time / (24 * 60 * 60 * 1000)).toFixed(2);

		return airbus.mes.disruptiontracker.Formatter.removeDecimal(time);
	},*/
	setDisruptionTrackerStatus : function(status) {
		if (status)
			return airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("status." + status.toLowerCase());
	},

};

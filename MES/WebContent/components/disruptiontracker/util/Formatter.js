"use strict";

jQuery.sap.declare("airbus.mes.disruptiontracker.Formatter");

airbus.mes.disruptiontracker.Formatter = {

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

	setText : function(status, gravity, escalation) {

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

	setGravityColor : function(sStatus, iGravity, sEscalation) {

		switch (iGravity) {
		case "1":
			return airbus.mes.settings.AppConfManager._getConfiguration("MES_COLOR_GRAVITY1");
		case "2":
			if (airbus.mes.settings.AppConfManager._getConfiguration("MES_COLOR_GRAVITY2") === "Amber")
				return "#FFC200";
			return airbus.mes.settings.AppConfManager._getConfiguration("MES_COLOR_GRAVITY2");
		case "3":
			return airbus.mes.settings.AppConfManager._getConfiguration("MES_COLOR_GRAVITY3");
		default:
			return "";
		}
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

	formatOpeningTime : function(openDate, closureDate) {

		if (closureDate == undefined || closureDate == "")
			return 0;

		var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
		var aOpenDate = reggie.exec(openDate);
		var oOpenDate = new Date((+aOpenDate[1]), (+aOpenDate[2]) - 1, // Careful
		// month
		// starts
		// at 0!
		(+aOpenDate[3]), (+aOpenDate[4]), (+aOpenDate[5]), (+aOpenDate[6]));

		var aClosureDate = reggie.exec(closureDate);
		var oClosureDate = new Date((+aClosureDate[1]), (+aClosureDate[2]) - 1, // Careful
		// month
		// starts
		// at
		// 0!
		(+aClosureDate[3]), (+aClosureDate[4]), (+aClosureDate[5]), (+aClosureDate[6]));

		var unit = airbus.mes.settings.AppConfManager._getConfiguration("MES_TIME_UNIT");

		var openingTime;

		if (unit === "H")
			openingTime = (Math.round((oClosureDate - oOpenDate) / (1000 * 60 * 60) * 100) / 100) + " Hr";

		else if (unit === "IM")
			openingTime = (Math.round((oClosureDate - oOpenDate) * 100 / (1000 * 60 * 60) * 100) / 100) + " IM";

		else if (unit === "M")
			openingTime = (Math.round((oClosureDate - oOpenDate) / (1000 * 60) * 100) / 100) + " Min";

		else if (unit === "D")
			openingTime = (Math.round((oClosureDate - oOpenDate) / (1000 * 60 * 60 * 24) * 100) / 100) + " Days";

		return openingTime;
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

	setTimeLostValue : function(timeLost) {
		var timeUnit = airbus.mes.disruptiontracker.Formatter.getConfigTimeUnit();

		if (timeLost != "") {
			return airbus.mes.disruptiontracker.Formatter.timeMillisecondsToConfig(timeLost) + " " + timeUnit;
		}

		return 0 + " " + timeUnit;
	},

	timeMillisecondsToConfig : function(time) {

		var timeUnit = airbus.mes.settings.AppConfManager._getConfiguration("MES_TIME_UNIT");

		if (timeUnit == "H")
			time = (time / (60 * 60 * 1000)).toFixed(2);

		else if (timeUnit == "IM")
			time = ((time * 100) / (60 * 60 * 1000)).toFixed(2);

		else if (timeUnit == "M")
			time = (time / (60 * 1000)).toFixed(2);

		else if (timeUnit == "D")
			time = (time / (24 * 60 * 60 * 1000)).toFixed(2);

		return airbus.mes.disruptiontracker.Formatter.removeDecimal(time);
	},
	setDisruptionTrackerStatus : function(status) {
		if(status)
		return airbus.mes.disruptiontracker.oView.getModel("disruptiontrackerI18n").getProperty("status." + status.toLowerCase());
	},
	/**
	 * @param milli
	 *            seconds
	 * @output minutes function to conver milliseconds to minutes devide by
	 *         60000
	 */
	msToMinutesConverter : function(ms) {
		if (ms != '' || ms != undefined) {
			return Math.round(ms / 60000);
		}
		return 0;
	},

	/**
	 * Set Roles for type of Table Column
	 */
	setType : function(){
//		var Flag = airbus.mes.shell.RoleManager.isAllowed(airbus.mes.shell.RoleManager.parseRoleValue("DISRUPTION_DIS_DETAIL_CONSULT"), 'V');
//        airbus.mes.shell.RoleManager.userRoles = [];
//		if(Flag === true){
//			return "Navigation"
//		}
//		else if(Flag === false){
//			return "Inactive"
//		}
		return "Navigation"

	},
	/**
	 * Set Disruption table visible on the basis of Roles
	 */

	setVisible : function(){
//		var Flag = airbus.mes.shell.RoleManager.isAllowed(airbus.mes.shell.RoleManager.parseRoleValue("DISRUPTION_DISRUPTION_LIST"), 'V');
//        airbus.mes.shell.RoleManager.userRoles = [];
//        return Flag;
		return true;
	}

};

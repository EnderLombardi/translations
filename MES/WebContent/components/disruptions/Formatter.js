"use strict";

jQuery.sap.declare("airbus.mes.disruptions.Formatter");

airbus.mes.disruptions.Formatter = {
	monthNames : [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],

	status : {
		"pending" : "Pending",
		"closed" : "Closed",
		"acknowledged" : "Acknowledged",
		"solved" : "Solved",
		"rejected" : "Rejected",
		"deleted" : "Deleted"
	},

	/* For ui5-preload gulp task, we need to escape '$' characters */

	actions : {
		"close" : "close\$\$",
		"del" : "delete\$\$",
		"reject" : "reject\$\$",
		"refuse" : "refuse\$\$",
		"comment" : "comment\$\$",
		"acknowledge" : "acknowledge\$\$",
		"solve" : "solve\$\$",
		"edit" : "edit\$\$",
		"create" : "create\$\$",
		"escalation" : "escalation\$\$",
		"escalationLevel1" : "escalationLevel1\$\$",
		"escalationLevel2" : "escalationLevel2\$\$"
	},

	opStatus : {
		'completed' : 'COMPLETED',
		'paused' : 'IN_QUEUE',
		'active' : 'IN_WORK',
		'notStarted' : 'NOT_STARTED',
		'blocked' : 'Blocked'
	},

	defaultDateConversion : function(defaultDate, defaultTime) {

		return defaultDate.getFullYear() + "-" + defaultDate.getMonth() + "-" + defaultDate.getDate();
	},

	setDisruptionTitle : function(iGravity, escalationLevel) {

		switch (iGravity) {
		case "1":
			return airbus.mes.settings.AppConfManager._getConfiguration("MES_COLOR_GRAVITY1");
			break;
		case "2":
			if (airbus.mes.settings.AppConfManager._getConfiguration("MES_COLOR_GRAVITY2") === "Amber")
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

		switch (gravity) {
		case "1":
			property = sap.ui.getCore().byId(this.sId.split("--")[0]).getModel("i18nModel").getProperty("NotBlocked");
			break;
		case "2":
			property = sap.ui.getCore().byId(this.sId.split("--")[0]).getModel("i18nModel").getProperty("Disturbed");
			break;
		case "3":
			property = sap.ui.getCore().byId(this.sId.split("--")[0]).getModel("i18nModel").getProperty("Blocked");
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
	
	formatTimeBeforeEsc: function(sEscLEvel, sTime){
		if(sEscLEvel == "3")
			return 'Escalated';
		else if(sTime == '')
			return '-';
		else
			return sTime;
	},
	
	/*getDate : function(datetime) {

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

	},*/

	// New function created for "Required Fix By" as MII parsing error on Date
	// using getDate function
	getDate : function(datetime) {

		if (datetime == null || datetime === undefined) {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1; // January is 0!

			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd
			}

			if (mm < 10) {
				mm = '0' + mm
			}

			return (yyyy + '-' + mm + '-' + dd);
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
		if (escalationLevel == 1)
			return sap.ui.getCore().byId(this.sId.split("--")[0]).getModel("i18nModel").getProperty("NotEscalated");

		else if (escalationLevel == 2)
			return sap.ui.getCore().byId(this.sId.split("--")[0]).getModel("i18nModel").getProperty("FirstEscalation");

		else if (escalationLevel == 3)
			return sap.ui.getCore().byId(this.sId.split("--")[0]).getModel("i18nModel").getProperty("FinalEscalation");
		else
			return "-----"; 	
	},

	setEditButtonVisibility : function(originatorFlag, responsibleFlag, status, expanded) {
		if(expanded != "true")
			return false;
			
		else if (originatorFlag != "X" && responsibleFlag != "X")
			return false;

		else if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed)
			return false;

		else if (originatorFlag == "X" && responsibleFlag != "X" && status == airbus.mes.disruptions.Formatter.status.acknowledged)
			return false;

		else if ((status == airbus.mes.disruptions.Formatter.status.pending || status == airbus.mes.disruptions.Formatter.status.rejected)
			&& responsibleFlag == "X" && originatorFlag != "X")
			return false;
		 
			
		return true;
	},

	setDeleteButtonVisibility : function(originatorFlag, status, expanded) {

		if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {
			return false;
		} else if (originatorFlag == 'X' && expanded =="true") {
			return true;
		}

		return false;
	},

	setCloseButtonVisibility : function(originatorFlag, status) {

		if (originatorFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.solved || status == airbus.mes.disruptions.Formatter.status.rejected
				|| status == airbus.mes.disruptions.Formatter.status.pending) {

				return true;
			}
		}

		return false;
	},

	setRejectButtonVisibility : function(responsibleFlag, status) {

		// if (responsibleFlag == "X" && originatorFlag != "X") {
		if (responsibleFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.rejected) {

				this.setText(sap.ui.getCore().byId(this.sId.split("--")[0]).getModel("i18nModel").getProperty("rejected"));
				this.setEnabled(false);

				return false;

			} else if (status == airbus.mes.disruptions.Formatter.status.pending || status == airbus.mes.disruptions.Formatter.status.acknowledged) {

				this.setText(sap.ui.getCore().byId(this.sId.split("--")[0]).getModel("i18nModel").getProperty("reject"));
				this.setEnabled(true);
				return true;
			}
		}

		return false;
	},

	setAddCommentButtonVisibility : function(originatorFlag, responsibleFlag, resolverID, status, commentBoxOpened) {
		
		if(commentBoxOpened === "true")
			return false;
		
		if(status == airbus.mes.disruptions.Formatter.status.acknowledged){
			if (responsibleFlag == "X" && 
				resolverID == sap.ui.getCore().getModel("userSettingModel").getProperty("/Rowsets/Rowset/0/Row/0/user"))
				return true;
			else
				return false;
		} else if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed)
			return false;

		else if (originatorFlag != "X" && responsibleFlag != "X")
			return false;

		else
			return true;
	},

	setAcknowledgeButtonVisibility : function(responsibleFlag, status) {

		// if (originatorFlag != "X" && responsibleFlag == "X") {
		if (responsibleFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.pending) {

				return true;
			}
		}

		return false;
	},

	setEscalateButtonVisibility : function(originatorFlag, escalation, status) {

		if (status == airbus.mes.disruptions.Formatter.status.solved || status == airbus.mes.disruptions.Formatter.status.deleted
			|| status == airbus.mes.disruptions.Formatter.status.closed) {
			return false;
		} else if (originatorFlag == "X" && escalation < 3)
			return true;
		else
			return false;
	},

	setMarkSolvedButtonVisibility : function(responsibleFlag, status) {

		// if (originatorFlag != "X" && responsibleFlag == "X") {
		if (responsibleFlag == "X") {

			if (status == airbus.mes.disruptions.Formatter.status.acknowledged) {

				return true;
			}
		}

		return false;
	},

	setRefuseButtonVisibility : function(originatorFlag, status) {
		// if (originatorFlag == "X" && responsibleFlag != "X" && status ==
		// airbus.mes.disruptions.Formatter.status.solved)
		if (originatorFlag == "X" && status == airbus.mes.disruptions.Formatter.status.solved)
			return true;

		return false;
	},

	setEmptyPromisedDateTimeText : function(dateTime) {
		if (dateTime == "")
			return "--:--:--";
		return dateTime;
	},

	textCaseFormat : function(text) {
		text = text.toLowerCase();
		return text;
	},
	formatCommentAction : function(action, comment) {
		if (comment.indexOf("\$\$") > -1) {
			action = comment.split("\$\$")[0];
		}

		return sap.ui.getCore().byId(this.sId.split("--")[0]).getModel("i18nModel").getProperty(action.toLowerCase()).toLowerCase();
	},
	formatComment : function(comment) {
		if(!comment){
			return "";
		}
		
		if (comment.indexOf("\$\$") > -1) {
			comment =  comment.split("\$\$")[1];
		}
		if(comment == "" || comment == " ")
			this.setVisible(false);
		return comment;
	},

	setClosureDateVisibility : function(status) {
		if (status == airbus.mes.disruptions.Formatter.status.closed)
			return true;

		return false;
	},
	

	/*
	 * setTimeBeforeNextEsc : function(escalationLevel) { if(escalationLevel ==
	 * 3)
	 * this.setText(sap.ui.getCore().byId(this.sId.split("--")[0]).getModel("i18nModel").getProperty("escalated")); },
	 */
	setSolutionVisibility : function(solution) {
		if (solution == "")
			return false;

		return true;
	},

	setMaterialqty : function(oText) {
		var loString;
		var loNewStr;
		if (oText) {
			loString = oText.replace(/[(]/g, " Quantity-");
			loNewStr = loString.replace(/[)]/g, "");
			loNewStr = loNewStr.replace(/[,]/g, "\n");

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
		(+aClosureDate[3]), (+aClosureDate[4]), (+aClosureDate[5]), (+aClosureDate[6]));

		var unit = airbus.mes.settings.AppConfManager._getConfiguration("MES_TIME_UNIT");

		var openingTime;

		if (unit == "H")
			openingTime = airbus.mes.disruptions.Formatter.removeDecimal(((oClosureDate - oOpenDate) / (1000 * 60 * 60)).toFixed(2)) + " Hr";

		else if (unit == "IM")
			openingTime = airbus.mes.disruptions.Formatter.removeDecimal(((oClosureDate - oOpenDate) * 100 / (1000 * 60 * 60)).toFixed(2)) + " IM";

		else if (unit == "M")
			openingTime = airbus.mes.disruptions.Formatter.removeDecimal(((oClosureDate - oOpenDate) / (1000 * 60)).toFixed(2)) + " Min";

		else if (unit == "D")
			openingTime = airbus.mes.disruptions.Formatter.removeDecimal(((oClosureDate - oOpenDate) / (1000 * 60 * 60 * 24)).toFixed(2)) + " Days";

		return openingTime;
	},

	timeToMilliseconds : function(time) {

		var timeUnit = airbus.mes.settings.AppConfManager._getConfiguration("MES_TIME_UNIT");

		if (timeUnit == "H")
			return (time * 60 * 60 * 1000);

		else if (timeUnit == "IM")
			return ((time / 100) * 60 * 60 * 1000);

		else if (timeUnit == "M")
			return (time * 60 * 1000);

		else if (timeUnit == "D")
			return (time * 24 * 60 * 60 * 1000);

		else
			return time;

		return;
	},

	timeMillisecondsToConfig : function(time) {
		
		if(time == undefined || time == null || time == "")
			return 0;

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

		return "";

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

		return "";

	},

	removeDecimal : function(num) {
		var iNum = parseInt(num, 10);

		if (num - iNum == 0)
			return iNum;

		return num;
	},

	setDisruptionStatus : function(status) {
		if(status == undefined || status == null || status == "")
			return sap.ui.getCore().byId(this.sId.split("--")[0]).getModel("i18nModel").getProperty("Pending");
		return sap.ui.getCore().byId(this.sId.split("--")[0]).getModel("i18nModel").getProperty(status);
	},
	isStatusFinal : function(status) {
		if (status === airbus.mes.disruptions.Formatter.status.closed || status === airbus.mes.disruptions.Formatter.status.solved
			|| status === airbus.mes.disruptions.Formatter.status.rejected || status === airbus.mes.disruptions.Formatter.status.deleted) {
			return true;
		} else {
			return false;
		}
	},
	setFileType : function() {
		return airbus.mes.settings.AppConfManager.getConfiguration("AIRBUS_ALLOWED_FILE_TYPES");
	},
	getFileIcon : function(sType) {
		var sIcon = "";
		
		if (sType === 'png' || sType === 'jpg') {
			sIcon = "sap-icon://camera"
		} else if (sType === 'txt') {
			sIcon = "sap-icon://document-text"
		} else if (sType === 'doc' || sType === 'docs') {
			sIcon = "sap-icon://doc-attachment"
		} else if (sType === 'pdf') {
			sIcon = "sap-icon://pdf-attachment"
		} else if (sType === 'xlsx') {
			sIcon = "sap-icon://excel-attachment"
		} else if (sType === 'pptx' || sType === 'ppt') {
			sIcon = "sap-icon://ppt-attachment"
		} else {
			sIcon = "sap-icon://document-text"
		}
		return sIcon;
	},

	/*
	 * setNumberofAttachment : function(number) { var sValue = number + "\n" + "
	 * Attachments"; return sValue; }
	 */
	
	/*******************************************************************
	 * Fields Enable/Disable for Create end screen
	 */
	setFivemCategoryEnable : function() {
		if (airbus.mes.disruptions.ModelManager.createViewMode == "Create") {
			return true;

		} else
			return false;

	},
	setReasonEnable : function(originatorFlag, status) {
		if (airbus.mes.disruptions.ModelManager.createViewMode == "Create") {
			return false;

		} else if (airbus.mes.disruptions.ModelManager.createViewMode == "Edit" && originatorFlag == "X" ){
			return true;
		} else
			return false;
	},
	setResponsibleGrpEnable : function( responsibleFlag, status) {
		if (airbus.mes.disruptions.ModelManager.createViewMode == "Create") {
			return true;
		} else if (airbus.mes.disruptions.ModelManager.createViewMode == "Edit" && responsibleFlag == "X")
			return true;
		else
			return false;
	},
	selectResolverEnable : function(responsibleFlag, status) {
		if (airbus.mes.disruptions.ModelManager.createViewMode == "Create") {
			return false;

		} else if (airbus.mes.disruptions.ModelManager.createViewMode == "Edit" && responsibleFlag == "X")
			return true;
		else
			return false;
	},
	
	
	promisedDateEnable : function(responsibleFlag, status){
		if (responsibleFlag == "X"  && status == airbus.mes.disruptions.Formatter.status.pending)
			return true;
		else
			return false;
	},
	
	expectedDateEnable : function(originatorFlag, status){
		if (airbus.mes.disruptions.ModelManager.createViewMode == "Create") {
			return true;
		} else if (airbus.mes.disruptions.ModelManager.createViewMode == "Edit" && originatorFlag == "X"
			&& status == airbus.mes.disruptions.Formatter.status.pending)
			return true;
		else
			return false;
	},
	expectedTimeEnable : function(originatorFlag, status){
		if (airbus.mes.disruptions.ModelManager.createViewMode == "Create") {
			return true;
		} else if (airbus.mes.disruptions.ModelManager.createViewMode == "Edit" && originatorFlag == "X"
			&& status == airbus.mes.disruptions.Formatter.status.pending)
			return true;
		else
			return false;
	},
	setGravityEnable : function(originatorFlag, status){
		if (airbus.mes.disruptions.ModelManager.createViewMode == "Create")
			return true;

		else if (airbus.mes.disruptions.ModelManager.createViewMode == "Edit" && originatorFlag == "X")
			return true;
		else
			return false;
	},
	setIssuerGroupEnable: function(originatorFlag, status){
		if (airbus.mes.disruptions.ModelManager.createViewMode == "Create") 
			return true;

		else if (airbus.mes.disruptions.ModelManager.createViewMode == "Edit" && originatorFlag == "X") 
			return true;
		
		else
			return false;
	},
	setUpdateButtonVisibility:function(sStatus){
		if(sStatus == airbus.mes.disruptions.Formatter.status.solved || sStatus == airbus.mes.disruptions.Formatter.status.deleted || sStatus == airbus.mes.disruptions.Formatter.status.closed ){
			return false;
		}else
			return true;
	},
	workCenterText:function(workCenter){
		var sText ;
		if(workCenter){
		sText = workCenter.split(",").pop();
		}
		return sText;
	},
	/**
	 * MES v1.5 
	 * when status is pending it should be dispalyed in Red Colour
	 * @param {string} sStatus take status as an input
	 * @return {string} returns status
	 */
	statusColour : function(sStatus) {
		if (sStatus == airbus.mes.disruptions.Formatter.status.pending) {
			this.getParent().addStyleClass("statusPendingColor");
			return sStatus;
		} else
			return sStatus;
	}
};

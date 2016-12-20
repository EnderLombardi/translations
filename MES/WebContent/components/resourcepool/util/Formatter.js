"use strict";

jQuery.sap.declare("airbus.mes.resourcepool.util.Formatter");

airbus.mes.resourcepool.util.Formatter = {

	shiftTimeToHours : function(totalSeconds) {

		var time = new Date(null);
		time.setSeconds(totalSeconds); // specify value for SECONDS here
		time = time.toISOString().substr(11, 8);

		return time;

	},

	shiftHoursToTime : function(time) {
		var a = time.split(':'); // split it at the colons
		// minutes are worth 60 seconds. Hours are worth 60 minutes.
		var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
		return seconds;
	},

	shiftStringToDate : function(dateString) {

		return dateString.substring(6, 8) + "/" + dateString.substring(4, 6)
				+ "/" + dateString.substring(0, 4);

	},

	shiftDateToString : function(date) {
		return date.substring(6, 10) + date.substring(3, 5)
				+ date.substring(0, 2);
	},

	state : function(ASSIGNED) {
		if (ASSIGNED == "true") {
			this.getParent().addStyleClass("sapMLIBSelected");
			return true;
		}
		this.getParent().removeStyleClass("sapMLIBSelected");
		return false;

	},

	nameFormatter : function(fName, lName) {
		var name = "";

		if (fName != "" && fName != "---")
			name = fName;

		if (lName != "" && lName != "---") {
			if (name != "")
				name = name + " ";
			name = name + lName;
		}
		return name;
	},

	userAlreadyAssigned : function(loanedRP_Name, assignedTo) {
		var that = this.getParent().getParent();
		that.removeStyleClass("yellowColor");
		that.removeStyleClass("loanColor");
		that.removeStyleClass("blueBorderChange");
		// User is completely available
		if (assignedTo == "---" || assignedTo == "") {
			return;
		} else if (loanedRP_Name == "---" || loanedRP_Name == "") {
			// User is only assigned
			if(airbus.mes.resourcepool.util.ModelManager.resourceName !=assignedTo)
				that.addStyleClass("yellowColor");
			else
				that.addStyleClass("blueBorderChange");
			return "Assigned : "+ assignedTo;
		}

		// User is assigned as well as loaned
		if(airbus.mes.resourcepool.util.ModelManager.resourceName !=assignedTo && airbus.mes.resourcepool.util.ModelManager.resourceName != loanedRP_Name)
			that.addStyleClass("loanColor");
		if(airbus.mes.resourcepool.util.ModelManager.resourceName ==assignedTo || airbus.mes.resourcepool.util.ModelManager.resourceName == loanedRP_Name)
			that.addStyleClass("blueBorderChange");
		return "Assigned : " + assignedTo + "\n" +"Loaned : "+ loanedRP_Name;
		

	},

	assignedToSelf : function(loanedRP_Name, assignedTo) {
		var that = this.getParent().getParent();
		that.removeStyleClass("blueBorderChange");
		if (assignedTo == "---" || assignedTo == ""){
			that.addStyleClass("blueBorderChange");
			return;
		} else if (loanedRP_Name == "---" || loanedRP_Name == ""){
			if(airbus.mes.resourcepool.util.ModelManager.resourceName !=assignedTo)
				that.addStyleClass("blueBorderChange");
			return "Assigned : "+assignedTo;
		}
		if(airbus.mes.resourcepool.util.ModelManager.resourceName !=assignedTo && airbus.mes.resourcepool.util.ModelManager.resourceName != loanedRP_Name)
			that.addStyleClass("blueBorderChange");
		return "Assigned : "+assignedTo + "\n" +"Loaned : "+ loanedRP_Name;
	},

	isEnabled : function() {
		// return true;

		return airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_PRODMNG')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_MANUFMNG')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_HOOPE')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_MFTEAM');

	},


	isEditable : function() {
		// return true;
		return airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_PRODMNG')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_MANUFMNG')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_HOOPE')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_MFTEAM');

	},

	selectionMode : function() {
		if (airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_PRODMNG')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_MANUFMNG')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_HOOPE')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_MFTEAM'))

			return "MultiSelect";
		else
			return "None";

	},
	AssignShiftEnabled : function() {
		return airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_PRODMNG')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_MANUFMNG')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_HOOPE')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_MFTEAM');
	},
	saveAllowed : function() {
		return airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_PRODMNG')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_MANUFMNG')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_HOOPE')
				|| airbus.mes.shell.RoleManager.isAllowed('MII_MOD1684_MFTEAM');
	},
	displayImage : function() {
		return airbus.mes.settings.AppConfManager.getConfiguration("MES_PHOTO_DISPLAY");
	},
	selectImageToDisplay : function(userId){
		var src = airbus.mes.shell.UserImageManager.getUserImage(this.sId, userId);
		return src;
	}

};

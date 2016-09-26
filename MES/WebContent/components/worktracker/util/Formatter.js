"use strict";

jQuery.sap.declare("util.Formatter");

util.Formatter = {
	monthNames : [ "January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December" ],

	setIcon : function(status) {
		switch (status) {
		case "CONFIRMED":
			this.getParent().getParent().addStyleClass("listColorBlue");
			this.addStyleClass("colorGreen");
			return "sap-icon://sys-enter-2";

		case "Blocked":
			this.getParent().getParent().addStyleClass("listColorRed");
			this.addStyleClass("whiteColorText");
			return "sap-icon://alert";

		case "In Progress":
			this.getParent().getParent().addStyleClass("listColorGreen");
			return "";

		case "Not Started":
			this.getParent().getParent().addStyleClass("listColorGrey");
			return "";
		}

	},

	getFullName : function(fName, lName) {
		var name = "";
		if (typeof fName != 'undefined' && fName != "")
			name = fName[0].toUpperCase() + fName.substr(1).toLowerCase();
		if (typeof lName != 'undefined' && lName != "") {
			if (name != "")
				name = name + " ";
			name = name + lName[0].toUpperCase()
					+ lName.substr(1).toLowerCase();
		}

		return name;

	},

	getCurrentdate : function() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth(); // January is 0!

		var yyyy = today.getFullYear();
		if (dd < 10) {
			dd = '0' + dd
		}
		var month = util.Formatter.monthNames[mm];

		return (dd + ' ' + month + ' ' + yyyy);
	},

	setUserImage : function(image) {

		if (typeof image != 'undefined' && image != "") {
			this.removeStyleClass("hide");
			return image;
		}
		this.addStyleClass("hide");
		return;

	},

	setUserInitials : function(fName, lName, image) {

		if (typeof image != 'undefined' && image != "") {
			this.addStyleClass("hide");
			return;
		} else if(fName !="" && lName != "") {
			var name = util.Functions.getInitials(fName, lName);
			this.removeStyleClass("hide");
			return name;
		}

	},
	
	getMessageTitle: function(fName, lName, team_name, read){
		
		if(typeof image != 'undefined' && read == "false")
			this.getParent().getParent().getParent().addStyleClass("UnreadMessage");;
		
		if(typeof team_name != 'undefined' && team_name != '')
			return "Message from "+team_name;
			
		return util.Formatter.getFullName(fName, lName);
	},
	
	setVisibility : function(status) {
		if (status === "Pending" || status === "Acknowledge"){
			this.getParent().getParent().getParent().addStyleClass("formBackgroundPen");
			this.getParent().getParent().getParent().getParent().addStyleClass("formBorderPen");
			if (status === "Acknowledge")
				return true;
			return false;
		}
		else{
			this.getParent().getParent().getParent().addStyleClass("formBackgroundAck");
			this.getParent().getParent().getParent().getParent().addStyleClass("formBorderAck");
			return false;
		}
	},
	
	showComment : function(commentVisible){
		if (commentVisible == "false"){
			return false;
		}
		else{
			return true;
		}
	},
	markSolvedBtn:function(status){
		if(status == "Solved")
		return "solved";
		
		return "Mark solved ";
	}
	
};

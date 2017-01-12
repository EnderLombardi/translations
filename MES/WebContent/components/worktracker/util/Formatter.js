"use strict";

jQuery.sap.declare("airbus.mes.worktracker.util.Formatter");

airbus.mes.worktracker.util.Formatter = {
	monthNames : [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ],
			
	status:{'completed': 'COMPLETED', 
			'paused': 'IN_QUEUE',
			'active': 'IN_WORK',
			'notStarted': 'NOT_STARTED'},

	
	setOprtnStatus: function(status, progress){
		progress=parseInt(progress,10);
		switch (status) {
			case airbus.mes.worktracker.util.Formatter.status.completed:
				return "Confirmed";
	
			case airbus.mes.worktracker.util.Formatter.status.active:
				return "In Progress "+String(progress).split(".")[0]+"%";
				
			case airbus.mes.worktracker.util.Formatter.status.paused:
				this.getParent().getParent().addStyleClass("listColorGreen");
				return "Paused "+String(progress).split(".")[0]+"%";
			default:
				this.getParent().getParent().addStyleClass("listColorGrey");
				return "Not Started "
		}
	},
	
	setSliderStatus: function(status, progress){
		switch (status) {
			case airbus.mes.worktracker.util.Formatter.status.completed:
				return "Confirmed";
	
			case airbus.mes.worktracker.util.Formatter.status.active:
				return "In Progress";
				
			case airbus.mes.worktracker.util.Formatter.status.paused:
				if(progress == "0.0" || progress == "0" || progress == 0)
					return "Not Started";
				else
					return "Paused "+String(progress).split(".")[0]+"%";
			default:
				return "Not Started";
		}
	},
	
	setOprtnIcon : function(status, progress) {
		this.getParent().getParent().removeStyleClass("listColorBlue");
		this.getParent().getParent().removeStyleClass("listColorRed");
		this.getParent().getParent().removeStyleClass("listColorGreen");
		this.getParent().getParent().removeStyleClass("listColorGrey");
		
		switch (status) {
			case airbus.mes.worktracker.util.Formatter.status.completed:
				this.getParent().getParent().addStyleClass("listColorBlue");
				this.addStyleClass("colorGreen");
				return "sap-icon://sys-enter-2";
	
			case "Blocked":
				this.getParent().getParent().addStyleClass("listColorRed");
				this.addStyleClass("whiteColorText");
				return "sap-icon://alert";
	
			case airbus.mes.worktracker.util.Formatter.status.active:
				this.getParent().getParent().addStyleClass("listColorGreen");
				return "";
	
			case airbus.mes.worktracker.util.Formatter.status.paused:
				this.getParent().getParent().addStyleClass("listColorGreen");
				return "";

			default:
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
		var month = airbus.mes.worktracker.util.Formatter.monthNames[mm];

		return (dd + ' ' + month + ' ' + yyyy);
	},

	setUserImage : function(image) {

		if (typeof image != 'undefined' && image != "") {
			this.setVisible(true);
			return image;
		}
		this.setVisible(false);
		return;

	},

	setUserInitials : function(fName, lName, image) {

		if (typeof image != 'undefined' && image != "") {
			this.setVisible(false);
			return;
		} else if(fName !="" && lName != "") {
			var name = airbus.mes.worktracker.util.Functions.getInitials(fName, lName);
			this.setVisible(true);
			return name;
		}

	},
	
	getMessageTitle: function(fName, lName, team_name, read){
		
		if(typeof image != 'undefined' && read == "false")
			this.getParent().getParent().getParent().addStyleClass("UnreadMessage");;
		
		if(typeof team_name != 'undefined' && team_name != '')
			return "Message from "+team_name;
			
		return airbus.mes.worktracker.util.Formatter.getFullName(fName, lName);
	},
	
	setVisibility : function(status) {
		if (status === "Pending" || status === "Acknowledge"){
			this.getParent().getParent().getParent().addStyleClass("formBackgroundPen");
			this.getParent().getParent().getParent().getParent().addStyleClass("formBorderPen");
			if (status === "Acknowledge")
				return true;
			return false;
		} else {
			this.getParent().getParent().getParent().addStyleClass("formBackgroundAck");
			this.getParent().getParent().getParent().getParent().addStyleClass("formBorderAck");
			return false;
		}
	},
	
	showComment : function(commentVisible){
		if (commentVisible == "false"){
			return false;
		} else{
			return true;
		}
	},
	markSolvedBtn:function(status){
		if(status == "Solved")
		return "solved";
		
		return "Mark solved ";
	},
	/*slider:function(enable){
		
		return true;
	},*/
	sliderStatusFirst:function(status, progress){
		if(typeof progress == "undefined") return;
		
		this.removeStyleClass("dynProgressSlider");
		this.setVisible(true);
		this.removeStyleClass("sliderBlockedColor");
		this.addStyleClass("sliderCompletedColor");
		
		//to manage blocked status for next version
		if(status == "B"){
			this.removeStyleClass("sliderCompletedColor");
			this.addStyleClass("sliderBlockedColor");
		}
		
		
		if(progress == "0.0" || progress == "0" || progress == 0){
			this.setVisible(false);
			this.setProperty("max",0);
			this.setProperty("value",0);
			return " 0%";
		} else if (String(progress) == "100") {
			this.setProperty("max",100);
			this.setProperty("value",100);
			return progress+"%";
		    
		} else{
			this.setProperty("max",parseInt(progress,10));
			this.setProperty("value",parseInt(progress,10));
			return progress+"%";
			
		}
	},
	

	sliderStatus : function(status, progress) {
		
		if(typeof progress == "undefined") return;
		
		this.removeStyleClass("dynProgressSlider");
		this.setVisible(true);
		

		if (progress == "0.0" || progress == "0" || progress == 0 || progress==NaN) {
			this.removeStyleClass("dynProgressSlider");
			this.setProperty("min", 0);
			this.setProperty("value", 0);
			return " 100%";
		} else if (String(progress) == "100") {
			this.setVisible(false);
			return " 0%";
		} else {
			this.addStyleClass("dynProgressSlider");
			this.setProperty("min", parseInt(progress,10));
			this.setProperty("value", parseInt(progress,10));
			return (100 - parseInt(progress,10)) + "%";
			
		}
	
		
	},
	
};

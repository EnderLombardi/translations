"use strict";

jQuery.sap.declare("airbus.mes.operationdetail.Formatter");

airbus.mes.operationdetail.Formatter = {
		status:{'completed': 'COMPLETED', 
			'paused': 'IN_QUEUE',
			'active': 'IN_WORK',
			'notStarted': 'NOT_STARTED'},
			
	setSliderStatus : function(status, progress) {
		switch (status) {
		case airbus.mes.operationdetail.Formatter.status.completed:
			return "Confirmed";

		case airbus.mes.operationdetail.Formatter.status.active:
			return "In Progress";

		case airbus.mes.operationdetail.Formatter.status.paused:
			if (progress == "0.0" || progress == "0" || progress == 0)
				return "Not Started";
			else
				return "Paused " + String(progress).split(".")[0] + "%";
		default:
			return "Not Started";
		}
	},

	sliderStatusFirst : function(status, progress) {
		if (typeof progress == "undefined")
			return;

		this.removeStyleClass("dynProgressSlider");
		this.setVisible(true);
		this.removeStyleClass("sliderBlockedColor");
		this.addStyleClass("sliderCompletedColor");

		//to manage blocked status for next version
		if (status == "B") {
			this.removeStyleClass("sliderCompletedColor");
			this.addStyleClass("sliderBlockedColor");
		}

		if (progress == "0.0" || progress == "0" || progress == 0) {
			this.setVisible(false);
			//this.setProperty("max", 0);
			return "0%";
		} else if (String(progress) == "100") {
			//this.setProperty("max", 100);
			return progress + "%";

		} else {
			//this.setProperty("max", parseInt(progress));
			return progress + "%";

		}
	},

	sliderStatus : function(status, progress) {

		if (typeof progress == "undefined")
			return;

		this.removeStyleClass("dynProgressSlider");
		this.setVisible(true);

		if (progress == "0.0" || progress == "0" || progress == 0
				|| progress == NaN) {
			this.removeStyleClass("dynProgressSlider");
			//this.setProperty("min", 0);
			return "100%";
		} else if (String(progress) == "100") {
			this.setVisible(false);
			return "0%";
		} else {
			this.addStyleClass("dynProgressSlider");
			//this.setProperty("min", parseInt(progress));
			return (100 - parseInt(progress)) + "%";

		}

	},
	/*sliderStatusValue:function(status, progress){
		if (typeof progress == "undefined")
			return;
		this.removeStyleClass("sliderCompletedColor");
		this.removeStyleClass("sliderInprogressColor");
		if (progress == "0.0" || progress == "0" || progress == 0
				|| progress == NaN) {
			return 0;
		} else if (String(progress) == "100") {
			this.addStyleClass("sliderCompletedColor")
			return 100;
		} else {
			this.addStyleClass("sliderInprogressColor")
			return progress ;

		}

	},*/
	
	//Reasoncode is disabled when operation is not started or paused
	
	setReasonCodeEnabled : function(status)
	{
		switch (status) {
		case airbus.mes.operationdetail.Formatter.status.completed:
			return false;

		case airbus.mes.operationdetail.Formatter.status.active:
			return true;

		case airbus.mes.operationdetail.Formatter.status.paused:
			return false;
		default:
			return false;
		}
	}

};
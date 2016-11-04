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

		//to manage blocked status for next version
		if (status == "B") {
			this.removeStyleClass("sliderCompletedColor");
			this.addStyleClass("sliderBlockedColor");
		}

		if (progress == "0.0" || progress == "0" || progress == 0) {
			this.setVisible(false);
			return "0%";
		} else if (String(progress) == "100") {
			return progress + "%";

		} else {
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
			return "100%";
		} else if (String(progress) == "100") {
			this.setVisible(false);
			return "0%";
		} else {
			this.addStyleClass("dynProgressSlider");
			return (100 - parseInt(progress)) + "%";

		}

	},
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
"use strict";

jQuery.sap.declare("airbus.mes.operationdetail.Formatter");

airbus.mes.operationdetail.Formatter = {
		status:{'completed': 'COMPLETED', 
			'paused': 'IN_QUEUE',
			'active': 'IN_WORK',
			'notStarted': 'NOT_STARTED',
			'blocked':'Blocked'},
			
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
		case airbus.mes.operationdetail.Formatter.status.blocked:
			return "Blocked";
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

	
	displayOriginalPlan : function(startTime, endTime) {
		if (endTime !== undefined) {
			var newStartTime = startTime.replace("T", " ");
			var newEndTime = endTime.replace("T", " ");
			return newStartTime + " - " + newEndTime;
		}

			
	},
	checkOperationStartEndDate:function(startTime, endTime,endDate){
		if (endDate === undefined || endDate === 'TimeUnavailable'){
			var newStartTime = startTime.replace("T", " ");
			var newEndTime = endTime.replace("T", " ");
			return newStartTime + " - " + newEndTime;
		
		}
		else return endDate;
	},
	displayBadge : function(){
		return airbus.mes.settings.AppConfManager.getConfiguration("MES_BADGE_ACTIVATED");
	},
	displayPin : function(){
		return airbus.mes.settings.AppConfManager.getConfiguration("MES_BADGE_PIN");
	}


};

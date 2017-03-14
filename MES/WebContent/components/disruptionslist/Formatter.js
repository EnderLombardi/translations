"use strict";

jQuery.sap.declare("airbus.mes.disruptionslist.Formatter");

airbus.mes.disruptionslist.Formatter = {

	setClosureDateVisibility : function(status) {
		if (status == airbus.mes.disruptions.Formatter.status.closed) {
			return true;
		}

		return false;
	},
	
	setOpenSince:function(openingTime){
		if (openingTime == undefined || openingTime =="") {
			return 0;
		}
		var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
		/*to avoid T*/
		openingTime = openingTime.replace("T"," ");
		var aOpenDate = reggie.exec(openingTime);
		var oOpenDate = new Date((+aOpenDate[1]), (+aOpenDate[2]) - 1, // Careful
		// month
		// starts
		// at 0!
		(+aOpenDate[3]), (+aOpenDate[4]), (+aOpenDate[5]), (+aOpenDate[6]));
		var dPresent = new Date();
		var unit = airbus.mes.settings.AppConfManager._getConfiguration("MES_TIME_UNIT");
		var openSince;

		if (unit === "H")
			openSince = (Math.round((dPresent - oOpenDate) / (1000 * 60 * 60) * 100) / 100) + " Hr";

		else if (unit === "IM")
			openSince = (Math.round((dPresent - oOpenDate) * 100 / (1000 * 60 * 60) * 100) / 100) + " IM";

		else if (unit === "M")
			openSince = (Math.round((dPresent - oOpenDate) / (1000 * 60) * 100) / 100) + " Min";

		else if (unit === "D")
			openSince = (Math.round((dPresent - oOpenDate) / (1000 * 60 * 60 * 24) * 100) / 100) + " Days";

		return openSince;
		
	},
	
	setSolutionIn: function(promisedTime, status){
		if(status == airbus.mes.disruptions.Formatter.status.closed || status == airbus.mes.disruptions.Formatter.status.solved){
			return "";
		}
		
		if (promisedTime == undefined || promisedTime =="") {
			return "---";
		}
		var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
		/*to avoid T*/
		promisedTime = promisedTime.replace("T"," ");
		var aPromisedTime = reggie.exec(promisedTime);
		var oPromisedTime = new Date((+aPromisedTime[1]), (+aPromisedTime[2]) - 1, // Careful
		// month
		// starts
		// at 0!
		(+aPromisedTime[3]), (+aPromisedTime[4]), (+aPromisedTime[5]), (+aPromisedTime[6]));
		var dPresent = new Date();
		var unit = airbus.mes.settings.AppConfManager._getConfiguration("MES_TIME_UNIT");
		var solutionIn;

		if (unit === "H")
			solutionIn = (Math.round((oPromisedTime - dPresent) / (1000 * 60 * 60) * 100) / 100) + " Hr";

		else if (unit === "IM")
			solutionIn = (Math.round((oPromisedTime - dPresent) * 100 / (1000 * 60 * 60) * 100) / 100) + " IM";

		else if (unit === "M")
			solutionIn = (Math.round((oPromisedTime - dPresent) / (1000 * 60) * 100) / 100) + " Min";

		else if (unit === "D")
			solutionIn = (Math.round((oPromisedTime - dPresent) / (1000 * 60 * 60 * 24) * 100) / 100) + " Days";

		return solutionIn;
	},
};

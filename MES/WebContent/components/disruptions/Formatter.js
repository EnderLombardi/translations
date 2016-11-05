"use strict";

jQuery.sap.declare("airbus.mes.disrtuptions.Formatter");

airbus.mes.disruptions.Formatter = {
		monthNames : [ "January", "February", "March", "April", "May", "June",
		   			"July", "August", "September", "October", "November", "December" ],

	json2xml : function(o, tab) {
		var toXml = function(v, name, ind) {
			var xml = "";
			if (v instanceof Array) {
				for (var i = 0, n = v.length; i < n; i++)
					xml += ind + toXml(v[i], name, ind + "\t") + "\n";
			} else if (typeof (v) == "object") {
				var hasChild = false;
				xml += ind + "<" + name;
				for ( var m in v) {
					if (m.charAt(0) == "@")
						xml += " " + m.substr(1) + "=\"" + v[m].toString()
								+ "\"";
					else
						hasChild = true;
				}
				xml += hasChild ? ">" : "/>";
				if (hasChild) {
					for ( var m in v) {
						if (m == "#text")
							xml += v[m];
						else if (m == "#cdata")
							xml += "<![CDATA[" + v[m] + "]]>";
						else if (m.charAt(0) != "@")
							xml += toXml(v[m], m, ind + "\t");
					}
					xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "")
							+ "</" + name + ">";
				}
			} else {
				xml += ind + "<" + name + ">" + v.toString() + "</" + name
						+ ">";
			}
			return xml;
		}, xml = "";
		for ( var m in o)
			xml += toXml(o[m], m, "");
		return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
	},

	defaultDateConversion : function(defaultDate, defaultTime) {

		return defaultDate.getFullYear() + "-" + defaultDate.getMonth() + "-"
				+ defaultDate.getDate()
	},

	setText : function(status, gravity, escalation) {

		if (status == "CLOSED") {
			return "Solved";
		} else if (gravity == 3 || escalation == 2 || escalation == 3)
			return "Blocked";
		else if (gravity == 1)
			return "Not Blocked";
		else if (gravity == 2)
			return "Disturbed";
	},
	
	formatUserGroup : function(userGroup){
		
		return userGroup.split(",")[1];
	},
	
	getCurrentdate : function() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth(); // January is 0!

		var yyyy = today.getFullYear();
		if (dd < 10) {
			dd = '0' + dd
		}
		
		var month = airbus.mes.disruptions.Formatter.monthNames[mm];
		
		return (month + ' ' + dd + ',' + yyyy);
	},
	
	getCurrentTime : function() {
		var today = new Date();
		var HH = today.getHours();
		var mm = today.getMinutes();
		var ss = today.getSeconds();
		
		return (HH + ":" + mm + ":" + ss);
	}

};

"use strict";

jQuery.sap.declare("airbus.mes.shell.util.Formatter");

airbus.mes.shell.util.Formatter = {
		
		checkCurrentView :function(){
			
			console.log("toto");
		},
		
		stationTrackerStation : function(Station) {
//			sap.ui.getCore().getModel("StationTrackerI18n").getProperty("Station");
			return airbus.mes.shell.oView.getModel("ShellI18n").getProperty("Station") + " " + Station;
		},
		stationTrackerMsn : function(Msn) {
			return airbus.mes.shell.oView.getModel("ShellI18n").getProperty("MSN") + " " + + Msn;
		},
		stationTrackerPlant : function(Plant) {
			return airbus.mes.shell.oView.getModel("ShellI18n").getProperty("Plant") + " " + Plant;
		},
		stationTrackerLine : function(Line) {
			return airbus.mes.shell.oView.getModel("ShellI18n").getProperty("Line") + " " + Line;
		},
		setInformationVisibility : function() {
			if(!airbus.mes.stationtracker.isVisible) {
				return airbus.mes.stationtracker.isVisible;		
			} else {
				return false;
			}
		},		
		
	
	checkCurrentView : function() {

		console.log("toto");
	},

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

	stationTrackerStation : function(Station) {
		// sap.ui.getCore().getModel("StationTrackerI18n").getProperty("Station");
		return airbus.mes.shell.oView.getModel("ShellI18n").getProperty(
				"Station")
				+ " " + Station;
	},
	stationTrackerMsn : function(Msn) {
		return airbus.mes.shell.oView.getModel("ShellI18n").getProperty("MSN")
				+ " " + +Msn;
	},
	stationTrackerPlant : function(Plant) {
		return airbus.mes.shell.oView.getModel("ShellI18n")
				.getProperty("Plant")
				+ " " + Plant;
	},
	stationTrackerLine : function(Line) {
		return airbus.mes.shell.oView.getModel("ShellI18n").getProperty("Line")
				+ " " + Line;
	},
};

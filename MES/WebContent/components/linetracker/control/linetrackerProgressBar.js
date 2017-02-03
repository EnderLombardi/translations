"use strict";
sap.ui.core.Control.extend("airbus.mes.linetracker.control.linetrackerProgressBar", {
	metadata : {
		properties : {
			confirmed : {
				type : "String",
				defaultValue : "0"
					
			},
			planned : {
				type : "String",
				defaultValue : "0"
			}

		}
	},
	
	renderer : function(oRm, oControl) {
		
		var gc = +oControl.getConfirmed();
		var gp = +oControl.getPlanned();
		oRm.write("<div ");
		oRm.writeControlData(oControl);
		oRm.addClass("progress");
		oRm.writeClasses();
		oRm.write(">");
		if (gc == 100) {
			oRm.write("<div ");
			oRm.addClass("progress-bar");
			oRm.writeClasses();
			oRm.addStyle("width", gc - 0.4 + "%");
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<i");
			oRm.addClass("fa");
			oRm.addClass("fa-check");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</i>");

			oRm.write("</div>");

			oRm.write("<div ");
			oRm.addClass("progress-bar");
			oRm.addClass("progress-bar-verticalDiv");
			oRm.writeClasses();
			oRm.addStyle("width", "0.4%");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write("</div>");

		}else if (gc < gp){
			oRm.write("<div ");
			oRm.addClass("progress-bar");

			oRm.addClass("progress-bar-warning");
			oRm.writeClasses();
			oRm.addStyle("width", gc + "%");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write("</div>");
			oRm.write("<div ");
			oRm.addClass("progress-bar");
			oRm.addClass("progress-bar-grey");
			oRm.writeClasses();
			oRm.addStyle("width", gp
					- gc - 0.4 + "%");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write("</div>");

			oRm.write("<div ");
			oRm.addClass("progress-bar");
			oRm.addClass("progress-bar-verticalDiv");
			oRm.writeClasses();
			oRm.addStyle("width", "0.4%");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write("</div>");

		} else {
			oRm.write("<div ");
			oRm.addClass("progress-bar");

			oRm.addClass("progress-bar-success");
			oRm.writeClasses();
			oRm.addStyle("width", gp - 0.4 + "%");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write("</div>");

			oRm.write("<div ");
			oRm.addClass("progress-bar");
			oRm.addClass("progress-bar-verticalDiv");
			oRm.writeClasses();
			oRm.addStyle("width", "0.4%");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write("</div>");

			oRm.write("<div ");
			oRm.addClass("progress-bar");
			oRm.addClass("progress-bar-success");
			oRm.writeClasses();
			oRm.addStyle("width", gc
					- gp + "%");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write("</div>");
		}

		oRm.write("</div>");

	}

});

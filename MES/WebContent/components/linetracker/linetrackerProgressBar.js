"use strict";
sap.ui.core.Control.extend("airbus.mes.linetracker.linetrackerProgressBar", {
	metadata : {
		properties : {
			confirmed : {
				type : "float",
				defaultValue : "0"
					
			},
			planned : {
				type : "float",
				defaultValue : "0"
			}

		}
	},
	
	renderer : function(oRm, oControl) {
		
		oRm.write("<div ");
		oRm.addClass("progress");
		oRm.writeClasses();
		oRm.write(">");
		if (oControl.getConfirmed() == 100) {
			oRm.write("<div ");
			oRm.addClass("progress-bar");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getConfirmed() - 0.4 + "%");
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

		}else if (oControl.getConfirmed() < oControl.getPlanned()){
			oRm.write("<div ");
			oRm.addClass("progress-bar");

			oRm.addClass("progress-bar-warning");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getConfirmed() + "%");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write("</div>");
			oRm.write("<div ");
			oRm.addClass("progress-bar");
			oRm.addClass("progress-bar-grey");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getPlanned()
					- oControl.getConfirmed() - 0.4 + "%");
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
			oRm.addStyle("width", oControl.getPlanned() - 0.4 + "%");
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
			oRm.addStyle("width", oControl.getConfirmed()
					- oControl.getPlanned() + "%");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write("</div>");
		}

		oRm.write("</div>");

	}

});

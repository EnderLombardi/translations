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
	
	init:function(){
//		airbus.mes.linetracker.util.ModelManager.loadStationDataModel();
		/*var oViewModel = sap.ui.getCore().getModel("stationDataModel");
//		airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true); 
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlstationData"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"station" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn
			}),

			success : function(data) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
//				airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			},

			error : function(error, jQXHR) {
				console.log(error);
//				airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			}
		});*/
		
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

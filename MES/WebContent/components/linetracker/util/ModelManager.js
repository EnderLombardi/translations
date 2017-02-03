"use strict";

jQuery.sap.declare("airbus.mes.linetracker.util.ModelManager");

airbus.mes.linetracker.util.ModelManager = {
	urlModel : undefined,
	//site : undefined,
	program : undefined,
	customLineBO : undefined,

	init : function(core) {

		var aModel = [ "stationDataModel", // Model for Station Data
		"lineVariantModel", // Model for Line variant Data
		//"KPIchartTaktAdherence", // Model for Takt Adherence KPI chart data
		//"KPItaktAdherence", // Model for KPI Takt Ahderence
		//"KPItaktEfficiency", // Model for KPI takt efficiency
		//"KPIdisruption", // Model for KPI Disruption
		//"KPIresolutionEfficiency", // Model for KPI Resolution Efficiency
		//"KPIopenAnomalies", // Model for Open Anomalies
		//"KPIextraWork", // Model for KPI Extra Work
		//"KPIshiftStaffing", // Model for KPI Shift Staffing
		//"airlineLogoModel" // Model for Airline Logo
		]
		airbus.mes.shell.ModelManager.createJsonModel(core, aModel);
		// Airline Logo Model
//		sap.ui.getCore().getModel("airlineLogoModel").attachRequestCompleted(airbus.mes.linetracker.util.ModelManager.loadFlightLogo);
		//airbus.mes.linetracker.util.ModelManager.site = airbus.mes.settings.ModelManager.site;
		
	    // Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.linetracker.config.url_config");
		
		core.getModel("stationDataModel").loadData(this.urlModel.getProperty("urlstationData"), null, false);

		//this.loadStationDataModel();
		//this.loadLineVariantModel();

		//this.loadPlantModel();
		//this.loadFlightLogo();
		//set customLineBO from userSettings Model

	},

	loadLinetrackerKPI : function() {
		/*this.loadKPIChartTaktAdherence();
		this.loadKPItaktAdherence();
		this.loadKPItaktEfficiency();
		this.loadKPIdisruption();
		this.loadKPIresolutionEfficiency();
		this.loadKPIopenAnomalies();
		this.loadKPIextraWork();
		this.loadKPIshiftStaffing();
		this.loadPlantModel();*/
		this.loadLineVariantModel();
		this.loadStationDataModel();
		

	},
	/**
	 * BR:SD-PPC-LT-070
	 * Load Station Details in line tracker
	 */
	loadStationDataModel : function() {
		var oViewModel = sap.ui.getCore().getModel("stationDataModel");
		// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlstationData"),
			contentType : 'application/json',
			cache : false,
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"customLine" : airbus.mes.linetracker.util.ModelManager.customLineBO,//.split(",")[1],
				"lang" : sap.ui.getCore().byId("globalNavView--SelectLanguage").getSelectedItem().getKey()
			}),

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				// this is required to scroll the Linetracker table. Don't
				// remove/comment
				sap.ui.getCore().byId("idLinetracker1--linetrackerTable").rerender();
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
			}
		});
	},

	/**
	 * BR:SD-PPC-LT-100
	 * Load Line variant names for value help
	 */
	loadLineVariantModel : function() {
		var oViewModel = sap.ui.getCore().getModel("lineVariantModel");
		 //sap.ui.getCore().byId("idLinetracker1").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlLineVariant"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"lang" : sap.ui.getCore().byId("globalNavView--SelectLanguage").getSelectedItem().getKey()
			}),

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				 //sap.ui.getCore().byId("idLinetracker1").setBusy(false);
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
				// sap.ui.getCore().byId("idLinetracker1").setBusy(false);
			}
		});
	},

	/**
	 * BR:SD-PPC-LT-270
	 * Load KPI Chart Takt Adherence Model
	 */
/*	loadKPIChartTaktAdherence : function() {
		var oViewModel = sap.ui.getCore().getModel("KPIchartTaktAdherence");
		// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPIChartTaktAdherence"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"station" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn
			}),

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			}
		});
	},
*/
	/**
	 * BR:SD-PPC-LT-270
	 * Load KPI Takt Adherence Model
	 */
/*	loadKPItaktAdherence : function() {
		var oViewModel = sap.ui.getCore().getModel("KPItaktAdherence");
		// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPITaktAdherence"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"station" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn
			}),

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			}
		});
	},*/

	/**
	 * BR:SD-PPC-LT-270
	 * Load KPI Takt Efficiency Model
	 */
/*	loadKPItaktEfficiency : function() {
		var oViewModel = sap.ui.getCore().getModel("KPItaktEfficiency");
		// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPItaktEfficiency"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"station" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn
			}),

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			}
		});

	},*/

	/**
	 * BR:SD-PPC-LT-270
	 * Load KPI Disruption/Andon Model
	 */
/*	loadKPIdisruption : function() {
		var oViewModel = sap.ui.getCore().getModel("KPIdisruption");
		// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPIdisruption"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"station" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn
			}),

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			}
		});
	},*/

	/**
	 * BR:SD-PPC-LT-270
	 * Load KPI Resolution Efficiency Model
	 */
/*	loadKPIresolutionEfficiency : function() {
		var oViewModel = sap.ui.getCore().getModel("KPIresolutionEfficiency");
		// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPIresolutionEfficiency"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"station" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn
			}),

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			}
		});
	},*/

	/**
	 * BR:SD-PPC-LT-270
	 * Load Open Anomalies Model
	 */
/*	loadKPIopenAnomalies : function() {
		var oViewModel = sap.ui.getCore().getModel("KPIopenAnomalies");
		// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPIopenAnomalies"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"station" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn
			}),

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			}
		});
	},*/

	/**
	 * BR:SD-PPC-LT-270
	 * Load Extra Work Model
	 */
/*	loadKPIextraWork : function() {
		var oViewModel = sap.ui.getCore().getModel("KPIextraWork");
		// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPIextraWork"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"station" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn
			}),

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			}
		});
	},*/

	/**
	 * BR:SD-PPC-LT-270
	 * Load KPI shift Staffing Model data
	 */
/*	loadKPIshiftStaffing : function() {
		var oViewModel = sap.ui.getCore().getModel("KPIshiftStaffing");
		// TODO get current shift from real service
		var sCurrentShift = "S0";
		// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPIshiftStaffing"),
			contentType : 'application/json',
			data : JSON.stringify({
				"day" : airbus.mes.linetracker.util.ModelManager.getCurrentDateFormatted(),
				"site" : airbus.mes.settings.ModelManager.site,
				"physicalStation" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn,
				"shift" : sCurrentShift
			}),

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
				// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			}
		});
	},*/

	/**
	 * Load Plant Model Data
	 */
/*	loadPlantModel : function() {
		var oViewModel = sap.ui.getCore().getModel("plantModel");
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlPlantData"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"station" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn
			}),

			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
			}
		});
	},*/

	/**
	 * Get current system date
	 * @returns {string} current system date
	 */
	getCurrentDateFormatted : function() {
		return (new Date()).toISOString().slice(0, 10).replace(/-/g, "");
	},


	updateLineInUserSettings : function(){
//		var urlCustomLineBOInUserSetting = this.urlModel.getProperty('updatevarianthandle');
		jQuery.ajax({
			url : this.urlModel.getProperty('updatevarianthandle').replace("$customLineBO", airbus.mes.linetracker.util.ModelManager.customLineBO),
			async : true,
			type : 'get',
			contentType : 'application/json',
			success : function(data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				console.log(data);
			},

			error : function(error, jQXHR) {
				jQuery.sap.log.info(error);
			}
		})
	},
	/**
	 * @param station, msn
	 * set settings variables to corresponding station and msn so that the particular station can be opened from station tracker
	 *  
	 */
	setProgramLineForStationMsn : function(station, msn) {
		var arr = sap.ui.getCore().getModel("plantModel").getProperty("/Rowsets/Rowset/0/Row");
		var result = arr.filter(function(o) {
			return o.station == station && o.msn == msn;
		});
		result = result ? result[0] : null; // or undefined
		airbus.mes.settings.ModelManager.program = result.program;
		airbus.mes.settings.ModelManager.station = result.station;
		airbus.mes.settings.ModelManager.msn = result.msn;
		airbus.mes.settings.ModelManager.line = result.line;
		var oModel = sap.ui.getCore().getModel("userSettingModel");
		oModel.setProperty("/Rowsets/Rowset/0/Row/0/stationDescription",result.stationDescription);
		oModel.setProperty("/Rowsets/Rowset/0/Row/0/msn",result.msn);
		oModel.setProperty("/Rowsets/Rowset/0/Row/0/lineDescription",result.lineDescription);
		oModel.setProperty("/Rowsets/Rowset/0/Row/0/programDescription",result.lineDescription);
		oModel.setProperty("/Rowsets/Rowset/0/Row/0/station",result.station);
		oModel.setProperty("/Rowsets/Rowset/0/Row/0/line",result.line);
		oModel.setProperty("/Rowsets/Rowset/0/Row/0/program",result.line);
		oModel.refresh();
	}

};

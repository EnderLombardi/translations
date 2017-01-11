"use strict";

jQuery.sap.declare("airbus.mes.linetracker.util.ModelManager");

airbus.mes.linetracker.util.ModelManager = {
	urlModel : undefined,
	site : undefined,
	program : undefined,
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {

		var aModel = [ "stationDataModel", // Model for Station Data
		"lineVariantModel", // Model for Line variant Data
		"KPIchartTaktAdherence", // Model for Takt Adherence KPI chart data
		"KPItaktAdherence", // Model for KPI Takt Ahderence
		"KPItaktEfficiency", // Model for KPI takt efficiency
		"KPIdisruption", // Model for KPI Disruption
		"KPIresolutionEfficiency", // Model for KPI Resolution Efficiency
		"KPIopenAnomalies", // Model for Open Anomalies
		"KPIextraWork", // Model for KPI Extra Work
		"KPIshiftStaffing", // Model for KPI Shift Staffing
		"airlineLogoModel" // Model for Airline Logo
		]
		airbus.mes.shell.ModelManager.createJsonModel(core, aModel);
		// Airline Logo Model
		sap.ui.getCore().getModel("airlineLogoModel").attachRequestCompleted(airbus.mes.linetracker.util.ModelManager.loadFlightLogo);

		airbus.mes.linetracker.util.ModelManager.site = airbus.mes.settings.ModelManager.site;

		var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "sopra";
			break;
//		case "wsapbpc01.ptx.fr.sopra":
//			dest = "sopra";
//			break;
		default:
			dest = "airbus";
			break;
		}

		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleName : "airbus.mes.linetracker.config.url_config",
			bundleLocale : dest
		});

		core.getModel("stationDataModel").loadData(this.urlModel.getProperty("urlstationData"), null, false);

		if (dest === "sopra") {

			var oModel = this.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;

			for ( var prop in oModel) {
				if (oModel[prop].slice(-5) != ".json") {
					oModel[prop] += "&j_user=" + Cookies.getJSON("login").user + "&j_password=" + Cookies.getJSON("login").mdp;
				}
			}
		}

		this.loadStationDataModel();
		this.loadLineVariantModel();

		this.loadPlantModel();
		this.loadFlightLogo();

	},

	loadLinetrackerKPI : function() {
		this.loadKPIChartTaktAdherence();
		this.loadKPItaktAdherence();
		this.loadKPItaktEfficiency();
		this.loadKPIdisruption();
		this.loadKPIresolutionEfficiency();
		this.loadKPIopenAnomalies();
		this.loadKPIextraWork();
		this.loadKPIshiftStaffing();
		this.loadPlantModel();

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
				"station" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn
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
		// airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlLineVariant"),
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

	/**
	 * BR:SD-PPC-LT-270
	 * Load KPI Chart Takt Adherence Model
	 */
	loadKPIChartTaktAdherence : function() {
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

	/**
	 * BR:SD-PPC-LT-270
	 * Load KPI Takt Adherence Model
	 */
	loadKPItaktAdherence : function() {
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
	},

	/**
	 * BR:SD-PPC-LT-270
	 * Load KPI Takt Efficiency Model
	 */
	loadKPItaktEfficiency : function() {
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

	},

	/**
	 * BR:SD-PPC-LT-270
	 * Load KPI Disruption/Andon Model
	 */
	loadKPIdisruption : function() {
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
	},

	/**
	 * BR:SD-PPC-LT-270
	 * Load KPI Resolution Efficiency Model
	 */
	loadKPIresolutionEfficiency : function() {
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
	},

	/**
	 * BR:SD-PPC-LT-270
	 * Load Open Anomalies Model
	 */
	loadKPIopenAnomalies : function() {
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
	},

	/**
	 * BR:SD-PPC-LT-270
	 * Load Extra Work Model
	 */
	loadKPIextraWork : function() {
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
	},

	/**
	 * BR:SD-PPC-LT-270
	 * Load KPI shift Staffing Model data
	 */
	loadKPIshiftStaffing : function() {
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
	},

	/**
	 * Load Plant Model Data
	 */
	loadPlantModel : function() {
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
	},

	/**
	 * Get current system date
	 * @returns {string} current system date
	 */
	getCurrentDateFormatted : function() {
		return (new Date()).toISOString().slice(0, 10).replace(/-/g, "");
	},

	/**
	 * BR: SD-PPC-LT-110
	 * Load Airline Logo Model
	 */
	// TODO $TF, $Application_ID and $msn values to be changed
	loadFlightLogo : function() {
		var oViewModel = sap.ui.getCore().getModel("airlineLogoModel");
		var url = this.urlModel.getProperty("urlAirline_logo");
		url = url.replace("$TF", "V");
		url = url.replace("$Application_ID", "000000000030");
		url = url.replace("$msn", "00002");
		jQuery.ajax({
			async : false,
			type : 'post',
			url : url,
			contentType : 'application/json',
			data : JSON.stringify({
			// "param.1" : "V",
			// "param.2" : "000000000030",
			// "param.3" : "00002"
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
	}

};

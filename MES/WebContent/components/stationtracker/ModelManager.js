"use strict";

jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.declare("airbus.mes.stationtracker.ModelManager");
airbus.mes.stationtracker.ModelManager = {
       urlModel : undefined,
       queryParams : jQuery.sap.getUriParameters(),

       i18nModel : undefined,
       operationType : undefined,

       firstTime : undefined,
       
//     parameters from the settings component
       settings : undefined,
       showDisrupionBtnClicked : false, // button Disruption on Station Tracker clicked
       init : function(core) {


              core.setModel(new sap.ui.model.json.JSONModel(), "operationDetailModel");// Model having operation detail
              core.setModel(new sap.ui.model.json.JSONModel(), "WorkListModel");
              core.setModel(new sap.ui.model.json.JSONModel(), "stationTrackerRModel"); // Station tracker model  // reschedule line
              core.setModel(new sap.ui.model.json.JSONModel(), "stationTrackerIModel"); // Station tracker model// initial line
              core.setModel(new sap.ui.model.json.JSONModel(), "shiftsModel"); // Shifts// model
              core.setModel(new sap.ui.model.json.JSONModel(), "affectationModel");
              core.setModel(new sap.ui.model.json.JSONModel(), "unPlannedModel"); // Unplanned// // model
              core.setModel(new sap.ui.model.json.JSONModel(), "groupModel"); // Unplanned      // Filter// Model
              core.setModel(new sap.ui.model.json.JSONModel(), "OSWModel"); // OutStanding// Work      // model
              core.setModel(new sap.ui.model.json.JSONModel(), "stationTrackerShift"); // Shifts// for/ station// tracker
              core.setModel(new sap.ui.model.json.JSONModel(), "KPI"); // KPI
              core.setModel(new sap.ui.model.json.JSONModel(), "productionGroupModel"); // production Group model
              core.setModel(new sap.ui.model.json.JSONModel(), "ressourcePoolModel"); // Resource// poolModel
              core.setModel(new sap.ui.model.json.JSONModel(), "groupModel"); // Unplanned// Filter// Model
              core.setModel(new sap.ui.model.json.JSONModel(), "KPIextraWork"); // KPI Extra Work
              core.setModel(new sap.ui.model.json.JSONModel(), "KPItaktAdherence"); // KPI Takt Adherence
              core.setModel(new sap.ui.model.json.JSONModel(), "phStationSelected"); // physical station Selected for Osw
      
              core.setModel(new sap.ui.model.json.JSONModel(), "KPIshiftStaffing"); // KPI Shift Staffing
              core.setModel(new sap.ui.model.json.JSONModel(), "KPItaktEfficiency"); // KPI Shift Staffing
              core.setModel(new sap.ui.model.json.JSONModel(), "KPIresolutionEfficiency"); // KPI Resolution Staffing
              core.setModel(new sap.ui.model.json.JSONModel(), "KPIdisruption"); // KPI Resolution Staffing
              core.setModel(new sap.ui.model.json.JSONModel(), "KPIchartTaktAdherence"); // KPI Resolution Staffing
              core.setModel(new sap.ui.model.json.JSONModel(), "spentTimedataModel"); // to store and get spent time


           this.settings = airbus.mes.settings.ModelManager;
           
           core.getModel("stationTrackerRModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onStationTrackerLoad);
           core.getModel("stationTrackerIModel").attachRequestCompleted( airbus.mes.stationtracker.ModelManager.onStationTrackerLoadInitial);
           core.getModel("shiftsModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onShiftsLoad);
           core.getModel("affectationModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onAffectationLoad);
           core.getModel("unPlannedModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onUnPlannedLoad);
           core.getModel("OSWModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onOWSLoad);
           core.getModel("ressourcePoolModel").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onRessourcePoolLoad);
           core.getModel("phStationSelected").attachRequestCompleted(airbus.mes.stationtracker.ModelManager.onPhStationLoad);
           

		var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "sopra";
			break;
		default:
			dest = "airbus";
			break;
		}

		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel(
				{
					bundleUrl : "../components/stationtracker/config/url_config.properties",
					bundleLocale : dest
				});

		if (dest === "sopra") {

			var oModel = this.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;

			for ( var prop in oModel) {
				if (oModel[prop].slice(-5) != ".json") {
					oModel[prop] += "&j_user=" + Cookies.getJSON("login").user
							+ "&j_password=" + Cookies.getJSON("login").mdp;
				}
			}
		}

		this.loadFilterUnplanned();

	},

	setLineAssignment : function(sSite, sStation, sMSN, sUserID, sShiftName,sDay, sLine, sSkill, sModeAssignment, bQACheck) {
		var seturlLineAssignment = this.urlModel.getProperty('urlsetlineassignment');
		seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$site", sSite);
		seturlLineAssignment = this.replaceURI(seturlLineAssignment,"$station", sStation);
		seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$msn", sMSN);
		seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$userid",	sUserID);
		seturlLineAssignment = this.replaceURI(seturlLineAssignment,"$shiftName", sShiftName);
		seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$day", sDay);
		seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$line", sLine);
		seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$skill", sSkill);
		// seturlLineAssignment = this.replaceURI(seturlLineAssignment,
		// "$myuserid", sMyUserID);
		seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$mode", sModeAssignment);
		seturlLineAssignment = this.replaceURI(seturlLineAssignment, "$qacheck", bQACheck);

		$
				.ajax({
					url : seturlLineAssignment,
					cache : false,
					success : function(data, textStatus, jqXHR) {
						// Handle Local url_config
						if (typeof data == "string") {
							data = JSON.parse(data);
						}
						if (airbus.mes.shell.util.Formatter
								.getMiiMessageType(data) == "E") {
							sap.m.MessageToast
									.show(airbus.mes.shell.util.Formatter
											.getMiiTextFromData(data));
						} else if (data.Rowsets.Rowset != undefined) {
							if (data.Rowsets.Rowset[0].Row[0].message == "W") {
								var checkQAModel = new sap.ui.model.json.JSONModel();
								checkQAModel.setData(data.Rowsets.Rowset[1]);
								airbus.mes.stationtracker.oView.getController()
										.openCheckQAPopup(checkQAModel);
							} else if (data.Rowsets.Rowset[0].Row[0].message == "S") {
								airbus.mes.shell.oView.getController()
										.renderStationTracker();
								airbus.mes.stationtracker.oPopoverPolypoly
										.close();
							}
						} else {// if (data.Rowsets.Rowset[0].Row[0].message ==
							// "S"){
							airbus.mes.shell.oView.getController()
									.renderStationTracker();
							airbus.mes.stationtracker.oPopoverPolypoly.close();
						}
					},
				});
	},

	loadAffectation : function() {

		var oData = airbus.mes.stationtracker.ModelManager.settings;
		var geturlAffectation = this.urlModel.getProperty('urlaffectation');

		geturlAffectation = airbus.mes.stationtracker.ModelManager.replaceURI(
				geturlAffectation, "$site", oData.site);
		geturlAffectation = airbus.mes.stationtracker.ModelManager.replaceURI(
				geturlAffectation, "$station", oData.station);
		geturlAffectation = airbus.mes.stationtracker.ModelManager.replaceURI(
				geturlAffectation, "$msn", oData.msn);

		var oViewModel = sap.ui.getCore().getModel("affectationModel");
		oViewModel.loadData(geturlAffectation, null, false);

	},

	onAffectationLoad : function() {

		var oModel = sap.ui.getCore().getModel("affectationModel");

		if (oModel.getProperty("/Rowsets/Rowset/0/Row")) {

			oModel = sap.ui.getCore().getModel("affectationModel").oData.Rowsets.Rowset[0].Row;

		} else {
			// oModel.oData.Rowsets.Rowset[0].Row = [];
			console.log("no affectationModel load");
		}
		airbus.mes.stationtracker.AssignmentManager
				.computeAffectationHierarchy();

	},

	loadStationTracker : function(sType) {

		var oData = airbus.mes.stationtracker.ModelManager.settings;
		this.operationType = sType;

		var geturlstationtracker = this.urlModel
				.getProperty('urlstationtrackeroperation');
		geturlstationtracker = airbus.mes.stationtracker.ModelManager
				.replaceURI(geturlstationtracker, "$site", oData.site);
		geturlstationtracker = airbus.mes.stationtracker.ModelManager
				.replaceURI(geturlstationtracker, "$station", oData.station);
		geturlstationtracker = airbus.mes.stationtracker.ModelManager
				.replaceURI(geturlstationtracker, "$msn", oData.msn);
		geturlstationtracker = airbus.mes.stationtracker.ModelManager
				.replaceURI(geturlstationtracker, "$operationType", sType);
		geturlstationtracker = airbus.mes.stationtracker.ModelManager
				.replaceURI(geturlstationtracker, "$productionGroup",
						oData.prodGroup);
		geturlstationtracker = airbus.mes.stationtracker.ModelManager
				.replaceURI(
						geturlstationtracker,
						"$user",
						airbus.mes.stationtracker.AssignmentManager.userSelected);
		//console.log(geturlstationtracker);
		var oViewModel;
		switch (sType) {
		case "R":
			oViewModel = sap.ui.getCore().getModel("stationTrackerRModel");
			break;
		case "I":
			oViewModel = sap.ui.getCore().getModel("stationTrackerIModel");
			break;
		case "U":
			airbus.mes.stationtracker.oView.byId("unplannedButton").setBusy(true);
			oViewModel = sap.ui.getCore().getModel("unPlannedModel");
			break;
		case "O":
			airbus.mes.stationtracker.oView.byId("oswButton").setBusy(true);
			oViewModel = sap.ui.getCore().getModel("OSWModel");
			break;
		default:

		}

		oViewModel.loadData(geturlstationtracker, null, true);

	},
	computeStatus : function(aModel) {

		aModel.forEach(function(el) {

			// TODO : factorize this computation
			// Developped too on ModelManager.js
			var sStatus = "0";
			// Operation is active

			if (el.PAUSED === "false") {

				sStatus = "2";
			}

			// Operation is not started
			if (el.PAUSED === "---") {

				sStatus = "1";

				// Operation is pause
				if (el.PAUSED === "---" && el.PROGRESS != "0") {

					sStatus = "3";
				}

			}

			// Operation Completed
			if (el.STATE === "C") {

				sStatus = "0";
			}

			el.status = sStatus;
		});

	},
	/***************************************************************************
     * Import OSw or UNplanned activities selected in gantt before importing it
     * call the check QA and display it if operation are inserted and the user
     * affected has no QA
     * 
     * @param {ARRAY} aItem, List of sfcStepBO selected
     * @param {STRING} sProdgroups, Value of Prod group selected
     * @param {STRING} sCheckQa Perform the CheckQA or not true/false
     * @param {BOOLEAN} bOuStanding Permit to know if we import unplanned or Osw
     ****************************************************************************/
	setOSW : function(aItem,sProdgroups,sCheckQa,bOuStanding) {
		//sCheckQa true dont do check Qa
		//sCheckQa false do check Qa
		//bOuStanding = true insert OSW
		//bOuStanding = false insert unplanned
		
		// This is done to keep dmi xml format Rowsets/Rowset/Row/ect..
		var sXmlStart = '<?xml version="1.0" encoding="iso-8859-1"?><Rowsets><Rowset>';
		var sXmlEnd =     '</Rowset></Rowsets>';
		var sXmlByRow = "";
		
		aItem.forEach(function(el){			
			sXmlByRow += airbus.mes.stationtracker.util.Formatter.json2xml({Row : {
				sfcStepBO : [el]
			},})
		})
		
		var sXml = sXmlStart + sXmlByRow + sXmlEnd;
	    var sDateShift = airbus.mes.settings.ModelManager.taktStart;
		var oData = airbus.mes.stationtracker.ModelManager.settings;
		var geturlsetosw = this.urlModel.getProperty('urlsetosw');
		
		geturlsetosw = airbus.mes.stationtracker.ModelManager.replaceURI(geturlsetosw, "$site", oData.site);
		geturlsetosw = airbus.mes.stationtracker.ModelManager.replaceURI(geturlsetosw, "$sCheckQa", sCheckQa);
		geturlsetosw = airbus.mes.stationtracker.ModelManager.replaceURI(geturlsetosw, "$bOuStanding", bOuStanding);
		geturlsetosw = airbus.mes.stationtracker.ModelManager.replaceURI(geturlsetosw, "$sProdgroups", sProdgroups);
		geturlsetosw = airbus.mes.stationtracker.ModelManager.replaceURI(geturlsetosw, "$station", oData.station);
		geturlsetosw = airbus.mes.stationtracker.ModelManager.replaceURI(geturlsetosw, "$msn", oData.msn);
		geturlsetosw = airbus.mes.stationtracker.ModelManager.replaceURI(geturlsetosw, "$sDateShift", sDateShift);
		geturlsetosw = airbus.mes.stationtracker.ModelManager.replaceURI(geturlsetosw, "$sXml", sXml);
		
		$.ajax({
			async : false,
			url : geturlsetosw,
			contentType : 'application/json',
		
				success : function(data, textStatus, jqXHR) {
					// Handle Local url_config
					if (typeof data == "string") {
						data = JSON.parse(data);
					}
					if (airbus.mes.shell.util.Formatter.getMiiMessageType(data) == "E") {
						sap.m.MessageToast.show(airbus.mes.shell.util.Formatter.getMiiTextFromData(data));
						console.log("no import done");
					} else if ( data.Rowsets.Rowset != undefined ) {
						if (data.Rowsets.Rowset[0].Row[0].message == "W") {
							var checkQAModel = new sap.ui.model.json.JSONModel();
							checkQAModel.setData(data.Rowsets.Rowset[1]);
							//Permit to display button ok and cancel
							airbus.mes.stationtracker.AssignmentManager.checkQA = true;
							airbus.mes.stationtracker.oView.getController().openCheckQAPopup(checkQAModel);
						} else if (data.Rowsets.Rowset[0].Row[0].message == "S") {
							airbus.mes.shell.oView.getController().renderStationTracker();
							airbus.mes.stationtracker.ImportOswUnplannedPopover.close();
							 if ( airbus.mes.stationtracker.dialogProdGroup != undefined ) { airbus.mes.stationtracker.dialogProdGroup.close(); }
						}
					} else {
						
						airbus.mes.shell.oView.getController().renderStationTracker();
						airbus.mes.stationtracker.ImportOswUnplannedPopover.close();
						if ( airbus.mes.stationtracker.dialogProdGroup != undefined ) { airbus.mes.stationtracker.dialogProdGroup.close(); }
					}
				},
			});

		console.log(sXml);

	},

	onUnPlannedLoad : function() {

		airbus.mes.stationtracker.oView.byId("unplannedButton").setBusy(false);
		var aModel = sap.ui.getCore().getModel("unPlannedModel");

		if (!aModel.getProperty("/Rowsets/Rowset/0/Row")) {

			aModel = [];
			console.log("no Unplanned operation load");

		} else {

			aModel = aModel.getProperty("/Rowsets/Rowset/0/Row")
		}

		// Compute status for Unplanned and OSW Model
		airbus.mes.stationtracker.ModelManager.computeStatus(aModel);

	},

	onOWSLoad : function() {

		airbus.mes.stationtracker.oView.byId("oswButton").setBusy(false);
		var aModel = sap.ui.getCore().getModel("OSWModel");

		if (!aModel.getProperty("/Rowsets/Rowset/0/Row")) {

			aModel = [];
			console.log("no OWS operation load");

		} else {

			aModel = aModel.getProperty("/Rowsets/Rowset/0/Row")
		}
		// Compute status for Unplanned and OSW Model
		airbus.mes.stationtracker.ModelManager.computeStatus(aModel);

	},

	loadFilterUnplanned : function() {
		var oViewModel = sap.ui.getCore().getModel("groupModel");
		oViewModel.loadData(this.urlModel.getProperty("urlgroupmodel"), null,
				false);
		airbus.mes.stationtracker.ModelManager.filterUnplanned = oViewModel;

	},
	loadRessourcePool : function() {

		var oData = airbus.mes.stationtracker.ModelManager.settings;
		var oViewModel = sap.ui.getCore().getModel("ressourcePoolModel");
		var geturlressourcepool = this.urlModel.getProperty("urlressourcepool");

		geturlressourcepool = airbus.mes.stationtracker.ModelManager
				.replaceURI(geturlressourcepool, "$site", oData.site);
		geturlressourcepool = airbus.mes.stationtracker.ModelManager
				.replaceURI(geturlressourcepool, "$station", oData.station);

		oViewModel.loadData(geturlressourcepool, null, true);

	},
	onRessourcePoolLoad : function() {

		// var oViewModel = sap.ui.getCore().getModel("ressourcePoolModel"); Not
		// used
		var aModel = sap.ui.getCore().getModel("ressourcePoolModel");

		if (aModel.getProperty("/Rowsets/Rowset/0/Row")) {

			aModel.oData.Rowsets.Rowset[0].Row.unshift({
				"FNAME" : "All User",
				"USER_ID" : "ALL",
			});

			sap.ui.getCore().getModel("ressourcePoolModel").refresh(true);

		} else {
			console.log("NO user in ressource pool");
		}
	},
	loadProductionGroup : function() {

		var oData = airbus.mes.stationtracker.ModelManager.settings;
		var geturlstationtracker = this.urlModel
				.getProperty('urlproductiongroup');

		geturlstationtracker = airbus.mes.stationtracker.ModelManager
				.replaceURI(geturlstationtracker, "$station", oData.station);
		geturlstationtracker = airbus.mes.stationtracker.ModelManager
				.replaceURI(geturlstationtracker, "$plant", oData.site);

		var oViewModel = sap.ui.getCore().getModel("productionGroupModel");
		oViewModel.loadData(geturlstationtracker, null, true);
		airbus.mes.stationtracker.ModelManager.ProductionGroup = oViewModel;

	},
	loadKPI : function() {
		var oViewModel = sap.ui.getCore().getModel("KPI");
		oViewModel.loadData(this.urlModel.getProperty("urlKPI"), null, true);
		airbus.mes.stationtracker.ModelManager.KPI = oViewModel;
		
//		// Model For the Disruption Andon KPI
//		var oDisruptionAndonModel = sap.ui.getCore().getModel("disruptionAndonKPI");
//		var urlDisruptionKpi = this.urlModel.getProperty("urlDisruptionKpi");
//		urlDisruptionKpi = airbus.mes.settings.ModelManager.replaceURI(urlDisruptionKpi, "$site", airbus.mes.settings.ModelManager.site);
//		urlDisruptionKpi = airbus.mes.settings.ModelManager.replaceURI(urlDisruptionKpi, "$station", airbus.mes.settings.ModelManager.station);
//		oDisruptionAndonModel.loadData(urlDisruptionKpi, null, true);
		
		this.loadKPIextraWork();
		this.loadKPItaktAdherence();
//		this.loadKPIshiftStaffing(); Moved to the end of this.selectMyShift()
		this.loadKPItaktEfficiency();
		this.loadKPIresolutionEfficiency();
		this.loadKPIdisruption();
		this.loadKPIchartTaktAdherence();

	},
	loadKPIextraWork : function() {
		var oViewModel = sap.ui.getCore().getModel("KPIextraWork");
		airbus.mes.stationtracker.oView.byId("boxExtraWork").setBusy(true);
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
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				airbus.mes.stationtracker.oView.byId("boxExtraWork").setBusy(false);
			},

			error : function(error, jQXHR) {
				console.log(error);
				airbus.mes.stationtracker.oView.byId("boxExtraWork").setBusy(false);
			}
		});
	},
	loadKPItaktAdherence : function() {
		var oViewModel = sap.ui.getCore().getModel("KPItaktAdherence");
		airbus.mes.stationtracker.oView.byId("boxTaktAdherenceRight").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPItaktAdherence"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"currentStation" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn
			}),

			success : function(data) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				airbus.mes.stationtracker.oView.byId("boxTaktAdherenceRight").setBusy(false);
			},

			error : function(error, jQXHR) {
				console.log(error);
				airbus.mes.stationtracker.oView.byId("boxTaktAdherenceRight").setBusy(false);

			}
		});
	},
	
	loadKPIshiftStaffing : function() {
		var oViewModel = sap.ui.getCore().getModel("KPIshiftStaffing");
		airbus.mes.stationtracker.oView.byId("boxShiftStaffing").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPIshiftStaffing"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"physicalStation" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn,
				"day" : airbus.mes.stationtracker.ShiftManager.ShiftSelected.day,
				"shift" : airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftName 
			}),

			success : function(data) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				airbus.mes.stationtracker.oView.byId("boxShiftStaffing").setBusy(false);
			},

			error : function(error, jQXHR) {
				console.log(error);
				airbus.mes.stationtracker.oView.byId("boxShiftStaffing").setBusy(false);

			}
		});
	},
	
	loadKPItaktEfficiency : function() {
		var oViewModel = sap.ui.getCore().getModel("KPItaktEfficiency");
		airbus.mes.stationtracker.oView.byId("boxSLBEfficiecy").setBusy(true);
		airbus.mes.stationtracker.oView.byId("boxLabourEfficiency").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPItaktEfficiency"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"currentStation" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn
			}),

			success : function(data) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				airbus.mes.stationtracker.oView.byId("boxSLBEfficiecy").setBusy(false);
				airbus.mes.stationtracker.oView.byId("boxLabourEfficiency").setBusy(false);
			},

			error : function(error, jQXHR) {
				console.log(error);
				airbus.mes.stationtracker.oView.byId("boxSLBEfficiecy").setBusy(false);
				airbus.mes.stationtracker.oView.byId("boxLabourEfficiency").setBusy(false);

			}
		});
	},
	
	loadKPIresolutionEfficiency : function() {
		var oViewModel = sap.ui.getCore().getModel("KPIresolutionEfficiency");
		airbus.mes.stationtracker.oView.byId("boxResolutionEfficiency").setBusy(true);
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
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				airbus.mes.stationtracker.oView.byId("boxResolutionEfficiency").setBusy(false);
			},

			error : function(error, jQXHR) {
				console.log(error);
				airbus.mes.stationtracker.oView.byId("boxResolutionEfficiency").setBusy(false);

			}
		});
	},
	
	loadKPIdisruption : function() {
		var oViewModel = sap.ui.getCore().getModel("KPIdisruption");
		airbus.mes.stationtracker.oView.byId("boxOpenDisruptions").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPIdisruption"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"station" : airbus.mes.settings.ModelManager.station
			}),

			success : function(data) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				airbus.mes.stationtracker.oView.byId("boxOpenDisruptions").setBusy(false);
			},

			error : function(error, jQXHR) {
				console.log(error);
				airbus.mes.stationtracker.oView.byId("boxOpenDisruptions").setBusy(false);

			}
		});
	},
	
	loadKPIchartTaktAdherence : function() {
		var oViewModel = sap.ui.getCore().getModel("KPIchartTaktAdherence");
		airbus.mes.stationtracker.oView.byId("chartId").setBusy(true);
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPIchartTaktAdherence"),
			contentType : 'application/json',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"currentStation" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn
			}),

			success : function(data) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
				airbus.mes.stationtracker.oView.byId("chartId").setBusy(false);
			},

			error : function(error, jQXHR) {
				console.log(error);
				airbus.mes.stationtracker.oView.byId("chartId").setBusy(false);

			}
		});
	},

	/**
	 * Used to update data of shift combobox regarding the day of the gantt
	 * 
	 */
	selectMyShift : function() {
		// stationTrackerShift model
		var oView = airbus.mes.stationtracker.oView;
		var options = airbus.mes.stationtracker.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.ShiftManager.current_day];
		var modelarray = [];
		var sShiftName = "";
		// var i = 0; not used
		for ( var prop in options) {
			// skip loop if the property is from prototype
			if (!options.hasOwnProperty(prop))
				continue;

			airbus.mes.stationtracker.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.ShiftManager.current_day][prop]
					.forEach(function(key1, index) {

						sShiftName = airbus.mes.stationtracker.GroupingBoxingManager.shiftHierarchy[airbus.mes.stationtracker.ShiftManager.current_day][prop][index].shiftName;

					});

			var element = {};
			element.value = prop;
			element.visible = airbus.mes.stationtracker.ShiftManager.dayDisplay;
			element.shiftName = sShiftName;
			element.day = airbus.mes.stationtracker.ShiftManager.current_shift.day;
			element.shiftID = prop;
			modelarray.push(element);

		}

		oView.getModel("stationTrackerShift").setData(modelarray);
		oView.getModel("stationTrackerShift").refresh();

		if (airbus.mes.stationtracker.ShiftManager.dayDisplay) {
			
			if ( airbus.mes.stationtracker.ShiftManager.selectFirstShift ) {
				
				//when using Arrow in gantt we select the first shift of the day
				airbus.mes.stationtracker.oView.byId("selectShift").fireChange(0);
				airbus.mes.stationtracker.ShiftManager.selectFirstShift = false;

			} else {
				// Select the previous shift selected
				airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftID);
				airbus.mes.stationtracker.oView.byId("selectShift").fireChange(0);
				
			}

		}

		if (airbus.mes.stationtracker.ShiftManager.shiftDisplay) {

			airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftName = airbus.mes.stationtracker.ShiftManager.current_shift.shiftName;
			airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftID = airbus.mes.stationtracker.ShiftManager.current_shift.shiftID;
			airbus.mes.stationtracker.ShiftManager.ShiftSelected.day = airbus.mes.stationtracker.ShiftManager.current_shift.day;
			airbus.mes.stationtracker.ShiftManager.ShiftSelected.StartDate = airbus.mes.stationtracker.ShiftManager.current_shift.StartDate;

			airbus.mes.stationtracker.oView.byId("selectShift").setSelectedKey(	airbus.mes.stationtracker.ShiftManager.ShiftSelected.shiftID);
			scheduler.updateView(airbus.mes.stationtracker.ShiftManager.ShiftSelected.StartDate);

		}

		var oDate = new Date($("div[class='dhx_cal_date']").contents()[0].data
				.split("-")[0]);
		var oFormatddMMyyy = sap.ui.core.format.DateFormat.getInstance({
			pattern : "dd MMM yyyy",
			calendarType : sap.ui.core.CalendarType.Gregorian
		});
		var oText = airbus.mes.stationtracker.oView.byId("dateLabel");
		oText.setText(oFormatddMMyyy.format(oDate));
		
		this.loadKPIshiftStaffing();
	},
	onStationTrackerLoad : function() {

		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;

		GroupingBoxingManager.parseOperation(GroupingBoxingManager.group,GroupingBoxingManager.box);
	
	},
		
	onStationTrackerLoadInitial : function() {

		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;

		GroupingBoxingManager.parseOperation(GroupingBoxingManager.group,GroupingBoxingManager.box);

	},

	loadShifts : function() {

		var oViewModelshift = sap.ui.getCore().getModel("shiftsModel");
		var getUrlShifts = this.urlModel.getProperty("urlshifts");
		var oData = airbus.mes.stationtracker.ModelManager.settings;
		var reqResult = "";
		getUrlShifts = airbus.mes.stationtracker.ModelManager.replaceURI(getUrlShifts, "$site", oData.site);
		getUrlShifts = airbus.mes.stationtracker.ModelManager.replaceURI(getUrlShifts, "$station", oData.station);
		getUrlShifts = airbus.mes.stationtracker.ModelManager.replaceURI(getUrlShifts, "$msn", oData.msn);

		oViewModelshift.loadData(getUrlShifts, null, false);

		reqResult = airbus.mes.shell.util.Formatter
				.getMiiMessageType(oViewModelshift.oData);

		switch (reqResult) {
		case "S":
			break;
		case "E":
			sap.m.MessageToast.show("Error : "
					+ airbus.mes.shell.util.Formatter
							.getMiiTextFromData(oViewModelshift.oData));
			break;
		default:
		}

	},
	onShiftsLoad : function() {

		var GroupingBoxingManager = airbus.mes.stationtracker.GroupingBoxingManager;
		GroupingBoxingManager.parseShift();
	},

	replaceURI : function(sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},
	
	sendRescheduleRequest : function(bCheckQa,oFinal,oInitial) {
		
		// get Url of the service
		var urlReschedulingService = this.urlModel.getProperty("urlReschedulingService");
		var oData = airbus.mes.stationtracker.ModelManager.settings;

		jQuery.ajax({
			async : false ,
			url : urlReschedulingService,
			data : {
				"Param.1" : oData.site,
				"Param.2" : bCheckQa,
				"Param.3" : oInitial.ProdGroup,
				"Param.4" : oData.station,
				"Param.5" : oData.msn, 
				"Param.6" : airbus.mes.stationtracker.util.Formatter.dDate2sDate(oFinal.start_date),
				"Param.7" : oInitial.sSfcStep,
				"Param.8" : oFinal.section_id.split("_")[1],
				"Param.9" : oFinal.section_id.split("_")[2],
				"Param.10" : oInitial.avlLine,
				"Param.11" : oInitial.skill,

			},
			
			success : function(data, textStatus, jqXHR) {
				// Handle Local url_config
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				if (airbus.mes.shell.util.Formatter.getMiiMessageType(data) == "E") {
					sap.m.MessageToast.show(airbus.mes.shell.util.Formatter.getMiiTextFromData(data));
					airbus.mes.shell.oView.getController().renderStationTracker();
				} else if ( data.Rowsets.Rowset != undefined ) {
					if (data.Rowsets.Rowset[0].Row[0].message == "W") {
						var checkQAModel = new sap.ui.model.json.JSONModel();
						checkQAModel.setData(data.Rowsets.Rowset[1]);
						//Permit to display button ok and cancel
						airbus.mes.stationtracker.AssignmentManager.checkQA = true;
						airbus.mes.stationtracker.oView.getController().openCheckQAPopup(checkQAModel);
					} else if (data.Rowsets.Rowset[0].Row[0].message == "S") {
						airbus.mes.shell.oView.getController().renderStationTracker();
					}
				} else {
					
					airbus.mes.shell.oView.getController().renderStationTracker();
					airbus.mes.stationtracker.dialogProdGroup.close();
					airbus.mes.stationtracker.ImportOswUnplannedPopover.close();
				}
			},
	
		});
	},

	openWorkListPopover : function(id) {

		// var elModel; not used
		var elOverallModel = {};
		var aOverallModel = [];
		var fAllDuration = 0;
		var fAllProgress = 0;
		var fNumberEl = 0;

		// Check if there is only one operation on the worklist
		// If yes, open the operation list
		var aModel = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy[scheduler.getEvent(id).group][scheduler.getEvent(id).avlLine][scheduler.getEvent(id).box];
		//Search avlDate and use it in operation Detail	
		if ( airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy[scheduler.getEvent(id).group].hasOwnProperty(["I_" + scheduler.getEvent(id).avlLine] )) {
			
			if ( airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy[scheduler.getEvent(id).group]["I_" + scheduler.getEvent(id).avlLine].hasOwnProperty([scheduler.getEvent(id).box]) ) {

				var sAvlStart = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy[scheduler.getEvent(id).group]["I_" + scheduler.getEvent(id).avlLine][scheduler.getEvent(id).box][0].START_TIME;
				var sAvlEnd = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy[scheduler.getEvent(id).group]["I_" + scheduler.getEvent(id).avlLine][scheduler.getEvent(id).box][0].END_TIME;		
				
			}
			
		}
		
		
		if (aModel.length === 1) {

			airbus.mes.stationtracker.ModelManager.openOperationDetailPopup(aModel,sAvlStart,sAvlEnd);
			return;
		}

		if (airbus.mes.stationtracker.worklistPopover === undefined) {

			airbus.mes.stationtracker.worklistPopover = sap.ui.xmlfragment(	"worklistPopover","airbus.mes.stationtracker.worklistPopover", airbus.mes.stationtracker.oView.getController());
			airbus.mes.stationtracker.worklistPopover.addStyleClass("alignTextLeft");
			airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.worklistPopover);
		}

		airbus.mes.stationtracker.worklistPopover.OSW = false;
		airbus.mes.stationtracker.worklistPopover.unPlanned = false;
		// Keep the array list of operation to ease the click action on the
		// operation
		airbus.mes.stationtracker.worklistPopover.aModel = aModel;

		sap.ui.getCore().byId("worklistPopover--myList").bindAggregation(
				'items',
				{
					path : "WorkListModel>/",
					template : sap.ui.getCore().byId("worklistPopover--sorterList"),
					sorter : [ new sap.ui.model.Sorter({
						// Change this value dynamic
						path : 'WORKORDER_ID',
						descending : false,
						group : true,
					}), new sap.ui.model.Sorter({
						path : 'index',
						descending : false
					}) ]
				});

		if (aModel && aModel.length > 0 && aModel) {
			aModel = airbus.mes.stationtracker.util.Formatter
					.sortWorkList(aModel);
		}

		// Manage model on worklist
		// Overall progress model
		aModel.forEach(function(elModel) {
					// TODO
					// elOverallModel.STATE =???
					// elOverallModel.andons = ???
					fNumberEl = fNumberEl + 1;
					fAllDuration = fAllDuration + elModel.DURATION;
					fAllProgress = fAllProgress + elModel.PROGRESS;

					elOverallModel.WORKORDER_ID = elModel.WORKORDER_ID;
					elOverallModel.WORKORDER_DESCRIPTION = elModel.WORKORDER_DESCRIPTION;
				});

		elOverallModel.OPERATION_ID = "";
		elOverallModel.OPERATION_DESCRIPTION = "";
		elOverallModel.DURATION = Math.floor(fAllDuration / fNumberEl);
		elOverallModel.PROGRESS = Math.floor(fAllProgress / fNumberEl);
		aOverallModel.push(elOverallModel);

		airbus.mes.stationtracker.worklistPopover.setModel(
				new sap.ui.model.json.JSONModel(aOverallModel),
				"WorkListOverallModel");
		airbus.mes.stationtracker.worklistPopover.getModel(
				"WorkListOverallModel").refresh(true);

		// Operation model
		airbus.mes.stationtracker.worklistPopover.setModel(
				new sap.ui.model.json.JSONModel(aModel), "WorkListModel");
		airbus.mes.stationtracker.worklistPopover.getModel("WorkListModel")
				.refresh(true);

		// Overall Progress is only display on worklist
		sap.ui.getCore().byId("worklistPopover--overallProgress").setVisible(
				true);

		// delay because addDependent will do a async rerendering and the
		// popover will immediately close without it
		airbus.mes.stationtracker.worklistPopover.open();

	},

	OpenWorkList : function(id) {
	
			airbus.mes.stationtracker.ModelManager.openWorkListPopover(id);
	
	},
	/***************************************************************************
	 * open operation detail popup containing progress slider
	 **************************************************************************/
	openOperationDetailPopup : function(aModel,sAvlStart,sAvlEnd) {
		if (airbus.mes.stationtracker.operationDetailPopup === undefined) {

			airbus.mes.stationtracker.operationDetailPopup = sap.ui
					.xmlfragment(
							"operationDetailPopup",
							"airbus.mes.stationtracker.fragments.operationDetailPopup",
							airbus.mes.stationtracker.oView.getController());
			airbus.mes.stationtracker.operationDetailPopup.setModel(sap.ui
					.getCore().getModel("operationDetailModel"),
					"operationDetailModel");

			airbus.mes.stationtracker.oView
					.addDependent(airbus.mes.stationtracker.operationDetailPopup);

		}
		//spent time calculation
		var operation = aModel[0].OPERATION_BO.split(",")[1];
		var order = aModel[0].SHOP_ORDER_BO.split(",")[1];
		var spentTimeInMs = 0;
		//TODO Exception to display to UI
		if(operation && order){
			spentTimeInMs  = airbus.mes.stationtracker.ModelManager.getSpentTimePerOperation(operation,order);
		}
		// calculate status of operation
		var sStatus;
		if (aModel[0].status == "0")
			sStatus = "COMPLETED";
		else if (aModel[0].status == "2")
			sStatus = "IN_WORK";
		else if (aModel[0].status === "3")
			sStatus = "IN_QUEUE";
		else if (aModel[0].status === "1")
			sStatus = "NOT_STARTED";
		else if (aModel[0].status === "4" || aModel[0].status === "5"
				|| aModel[0].status === "6" || aModel[0].status === "7")	
			sStatus = airbus.mes.stationtracker.oView.getModel("StationTrackerI18n").getProperty("StatusBlocked");

		// progress calculation
		var progress;
		if (sStatus == "COMPLETED")
			progress = 100;
		else if (parseInt(aModel[0].DURATION, 10) === 0)
			progress = 0;
		else
			progress = aModel[0].PROGRESS / parseInt(aModel[0].DURATION, 10)
					* 100;
		var oOperModel = {
			"Rowsets" : {
				"Rowset" : [ {
					"Row" : [ {
						"prodGroup" : aModel[0].PROD_GROUP,
						"skills" : aModel[0].SKILLS,
						"avlLine" : aModel[0].AVL_LINE,
						"sfc" : aModel[0].SFC,
						"sfc_step_ref" : aModel[0].SFC_STEP_REF,
						"operation_bo" : aModel[0].OPERATION_BO,
						"operation_id" : aModel[0].OPERATION_ID,
						"operation_no" : aModel[0].OPERATION_BO.split(",")[1],
						"operation_desc" : aModel[0].OPERATION_DESCRIPTION,
						"material_description" : aModel[0].WORKORDER_DESCRIPTION,
						"operation_revision" : aModel[0].SFC_STEP_REF.split(",")[5],
						"wo_no" : aModel[0].SHOP_ORDER_BO.split(",")[1],
						"workcenter" : aModel[0].PP_STATION.split(",")[1],
						"status" : sStatus,
						"realStatus" :  aModel[0].status,
						"progress" : parseInt(progress, 10),
						"progress_new" : parseInt(progress, 10),
						"time_spent" : spentTimeInMs,
						"reschedule_start_time" :  aModel[0].START_TIME,
						"reschedule_end_time" :  aModel[0].END_TIME,
						"original_start_time" : sAvlStart,
						"original_end_time" : sAvlEnd,
						"cpp_cluster" : aModel[0].CPP_CLUSTER,
						"work_package" : aModel[0].WORK_PACKAGE,
						"erp_system" : aModel[0].ERP_SYSTEM,
						"previously_start" : aModel[0].PREVIOUSLY_STARTED,
						"paused" : aModel[0].PAUSED, 
						"noOfEmp" : aModel[0].NUMBER_OF_EMPLOYEES
					} ]
				} ]
			}
		};

		if (airbus.mes.operationdetail === undefined) {
			jQuery.sap.registerModulePath("airbus.mes.operationdetail",
					"../components/operationdetail");
			this.oOperationDetailComp = sap.ui.getCore().createComponent({
				name : "airbus.mes.operationdetail",
				id : "operationDetailComponent"
			});
			airbus.mes.operationdetail.oView = this.oOperationDetailComp.oView;
			airbus.mes.operationdetail.parentId = airbus.mes.stationtracker.operationDetailPopup.sId;
		}
		airbus.mes.stationtracker.operationDetailPopup.open();
		airbus.mes.operationdetail.oView.placeAt(airbus.mes.stationtracker.operationDetailPopup.sId	+ "-scrollCont");

		airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").setData(oOperModel);
		airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").refresh();
		sap.ui.getCore().getModel("operationDetailModel").setData(oOperModel);
		sap.ui.getCore().getModel("operationDetailModel").refresh();

//		If previously_started is true, the operation has to be on execution mode
		if( aModel[0].PREVIOUSLY_STARTED === "true" ){
			airbus.mes.operationdetail.oView.byId("switchOperationModeBtn").setState(true);
			airbus.mes.operationdetail.oView.byId("switchOperationModeBtn").setEnabled(false);
			airbus.mes.operationdetail.oView.byId("switchStatusLabel").setText(airbus.mes.operationdetail.oView.getModel("i18n").getProperty("Execution"));
			// Permit to know if the operation is active pause or not started
			airbus.mes.operationdetail.status.oView.getController().operationIsActive();
		} else {
			airbus.mes.operationdetail.oView.byId("switchOperationModeBtn").setState(false);
			airbus.mes.operationdetail.oView.byId("switchOperationModeBtn").setEnabled(true);			
			airbus.mes.operationdetail.oView.byId("switchStatusLabel").setText(airbus.mes.operationdetail.oView.getModel("i18n").getProperty("ReadOnly"));
			//Set no Button activate
			airbus.mes.operationdetail.status.oView.getController().setProgressScreenBtn(false,false);
		}
		// Pause the Refresh timer till the Pop-Up is opened
		//airbus.mes.shell.AutoRefreshManager.pauseRefresh();

	},
	OpenReschedule : function(id) {

		//    	  
		var aGroup = [];

		// Check if we are on operation grouping
		// SD-PPC-ST-386
		if (airbus.mes.stationtracker.GroupingBoxingManager.box !== 'OPERATION_ID') {
			return;
		}

		var aOperationHierachy = airbus.mes.stationtracker.GroupingBoxingManager.operationHierarchy;
		var aModel = [scheduler.getEvent(id)];

		// Define all group
		for ( var oTmpOperationHierarchy in aOperationHierachy) {
			aGroup.push(oTmpOperationHierarchy);
		}

		if (airbus.mes.stationtracker.ReschedulePopover === undefined) {
			airbus.mes.stationtracker.ReschedulePopover = sap.ui.xmlfragment("ReschedulePopover","airbus.mes.stationtracker.Reschedule",airbus.mes.stationtracker.oView.getController());
			airbus.mes.stationtracker.ReschedulePopover.addStyleClass("alignTextLeft");

			airbus.mes.stationtracker.oView.addDependent(airbus.mes.stationtracker.ReschedulePopover);
		}
		// Model for the current operation
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(aModel);
		airbus.mes.stationtracker.ReschedulePopover.setModel(oModel,"RescheduleModel");

		oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(aGroup);
		airbus.mes.stationtracker.ReschedulePopover.setModel(oModel,"RescheduleGroupModel");

		airbus.mes.stationtracker.ReschedulePopover.open();

	},
	

	savePhStation : function(aPhStation) {

		// get Url of the service
		var urlsavephstation = this.urlModel.getProperty("urlsavephstation");
		var oData = airbus.mes.stationtracker.ModelManager.settings;

		jQuery.ajax({
			async : false,
			url : urlsavephstation,
			data : {
				"Param.1" : oData.site,
				"Param.2" : oData.station,
				"Param.3" : aPhStation.toString(),

			},

		});

	},
	
	getPhStation : function() {
		
		var urlgetphstation = this.urlModel.getProperty("urlgetphstation");
		var oData = airbus.mes.stationtracker.ModelManager.settings;

		urlgetphstation = airbus.mes.stationtracker.ModelManager.replaceURI(urlgetphstation, "$site", oData.site);
		urlgetphstation = airbus.mes.stationtracker.ModelManager.replaceURI(urlgetphstation, "$station", oData.station);
		urlgetphstation = airbus.mes.stationtracker.ModelManager.replaceURI(urlgetphstation, "$phStation", oData.station);
		
		var oViewModel = sap.ui.getCore().getModel("phStationSelected");
		oViewModel.loadData(urlgetphstation, null, true);
				
	},
	
	onPhStationLoad : function() {
		
		var aModel = sap.ui.getCore().getModel("phStationSelected");

		if (aModel.getProperty("/Rowsets/Rowset/0/Row")) {              
			
			aModel = sap.ui.getCore().getModel("phStationSelected").oData.Rowsets.Rowset[0].Row[0].originPhysicalStation;
			
        } else  {
        aModel = "";
        console.log("no phStationSelected load");
        }
		
		
		if ( airbus.mes.stationtracker.ImportOswUnplannedPopover != undefined) {
			
			if ( airbus.mes.stationtracker.CheckQa === "OSW" ) ;

			var aValueSelected = [];
			
			aModel.split(",").forEach(function(el){
			
				aValueSelected.push(el);
								
			})
			//Check if one value is saved otherwise select by default all value// if no value send mii send ---
			if ( aValueSelected[0] === "---" ) {

				sap.ui.getCore().byId("ImportOswUnplannedPopover--myList").getBinding("items").filter();
				return;
								
			}
			
			// Filter is doing in UpperCase
			aValueSelected = aValueSelected.map(function(x){ return x.toUpperCase(); })
			var binding = sap.ui.getCore().byId("ImportOswUnplannedPopover--myList").getBinding("items");
			// Erase duplicate key in combobox selection
			var Filter = new sap.ui.model.Filter({ path : "WORK_CENTER",
										           test : function(value) {
										                     if (aValueSelected.indexOf(value) != -1) {
										            			 sap.ui.getCore().byId("ImportOswUnplannedPopover--filterPhStation").setSelectedKeys(value);
										                    	 return true;
										                     } else {
										                            return false;
										                     }
										              }
													});	
			
			binding.filter(Filter);
		
		}
		
	},
	getSpentTimePerOperation : function(operation, order){
		//var oViewModel = sap.ui.getCore().getModel("spentTimedataModel");
		var spentTime =0;
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlGetTimeSpentPerOperation"),
			contentType : 'application/json',
			async : false,
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"order" : order,
				"operation" : operation,
			}),

			success : function(data) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				if(data.success){
					spentTime =  data.spentTime;
				} else
					return 0;
			},

			error : function(error, jQXHR) {
				console.log(error);
				return 0;

			}
		});
		return spentTime; 
	}
	
};

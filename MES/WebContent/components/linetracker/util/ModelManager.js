"use strict";
/* refresh object */
var oRefresh;
var oRefreshDiaporama;
//var Takt_start_date; // variable for takt start marker on order worklist
//var aContent = {};// we cache the content in this object
//var bClearData = false;// var to prevent clearing on gantt data for first time.
// gantt data needs to be cleared for refresh.
// refer:StationView.cotroller.js lockStation function
/* Initializing Gannt Objects for 'order worklist' and 'Operation worklist' */

jQuery.sap.declare("airbus.mes.linetracker.util.ModelManager");

airbus.mes.linetracker.util.ModelManager = {
	operation_User : [],
	role : undefined,
	user : "", // constant
	Unit_Of_Confirmation : "H",// for confirmation of Operation Worklist
	hand : "", // set from calling screen 'station summary' for
	// (order/operation worklist) used in both the screens
	msn : "",// set from calling screen 'station summary' for
	// (order/operation worklist) used in both the screens
	Load_Unload : "", // set from loading or unloading MSNs on stations 5
	MessageBar : undefined,

	// USER affectation Part
	cdate : undefined,// set from DHTMLXGanttuser.js when open fragment for
	// user affectation
	worder : undefined,// set from DHTMLXGanttuser.js when open fragment for
	// user affectation
	operation : undefined,// set from DHTMLXGanttuser.js when open fragment
	// for user affectation
	startdate : undefined,// set from DHTMLXGanttuser.js when open fragment
	// for user affectation
	enddate : undefined,// set from DHTMLXGanttuser.js when open fragment for
	// user affectation
	user_name : undefined,// set from UserAffect.controller.js when call
	// onSave fct
	user_affectation : undefined,// set from UserAffect.controller.js when
	// call onSave fct
	user_id : undefined,// set from UserAffect.controller.js when call onSave
	// fct
	a_UserSave : undefined,// set from Affectation.fragment array to stock new
	// user to save
	polypoly_UserSave : [],// set to stock new user to save in polypoly dialog

	// diaporama + refresh auto
	indexrow : 0,// index for diaporama
	vStoprefresh : true,
	vStopdiaporama : true,

	toolbar_status : true, // Screen 4-5-6 toolbar

	// global param. moved to model manager. station_number, line_number//used
	// to open order worklist operation worklist and update confiramtion
	// operation
	factory_name : "F1",
	site : "CHES",
	revision : "A",
	station_number : "",
	line_number : "",

	lockshellselect : false,

	StationList : [ "5", "10", "20", "30", "40", "50", "60", "70", "80" ],
	ProductionImage : [ "station 5", "Skeleton Build", "Automation",
			"Bottom Manual Drill", "Top Manual Drill", "Bottom Bolt",
			"Mixed Bolting", "Top Bolting", "Wing Unload" ],
	PulseList : [ "Pulse Entire Line", "Pulse from S10", "Pulse from S20",
			"Pulse from S30", "Pulse from S40", "Pulse from S50",
			"Pulse from S60", "Pulse from S70", "Pulse from S80",
			"Reverse Pulse Entire Line" ],

	open : false,
	opentask : [],
	/** URL Model. Resource where to get model URL patterns. */
	urlModel : undefined,
	/** I18N Model. Resource where to get internationalized strings. */
	i18nModel : undefined,
	maxModelSize : 1000000,
	/** URL parameters. */
	queryParams : jQuery.sap.getUriParameters(),
	qaAdmin : undefined,
	gantColorPalette : {},
	init : function(core) {

		// Initialization of all models
		this.core = core;
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "FactoryModel");
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "PulseModel");
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "StationModel");
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "newFactoryModel");
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "ProductionModel");
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "newStationModel");
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "newProductionModel");
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "lModel"); // Station 5

		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "colorPaletteModel");
		/* Station Selection on PolyPolyscreen */
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "stationList");

		// attach event on end of loading model
		
		sap.ui.getCore().getModel("FactoryModel").attachRequestCompleted(
				airbus.mes.linetracker.util.ModelManager.onFactoryModelLoaded);
		sap.ui.getCore().getModel("ProductionModel").attachRequestCompleted(
				airbus.mes.linetracker.util.ModelManager.onProductionModelLoaded);
		sap.ui.getCore().getModel("StationModel").attachRequestCompleted(
				airbus.mes.linetracker.util.ModelManager.onStationModelLoaded);
		// Set Max setSizeLimit(this.maxModelSize)

		sap.ui.getCore().getModel("FactoryModel").setSizeLimit(this.maxModelSize);
		sap.ui.getCore().getModel("PulseModel").setSizeLimit(this.maxModelSize);
		sap.ui.getCore().getModel("StationModel").setSizeLimit(this.maxModelSize);
		sap.ui.getCore().getModel("newFactoryModel").setSizeLimit(this.maxModelSize);
		sap.ui.getCore().getModel("ProductionModel").setSizeLimit(this.maxModelSize);
		sap.ui.getCore().getModel("newStationModel").setSizeLimit(this.maxModelSize);
		sap.ui.getCore().getModel("newProductionModel").setSizeLimit(this.maxModelSize);
		sap.ui.getCore().getModel("lModel").setSizeLimit(this.maxModelSize); // Station 5
		sap.ui.getCore().getModel("colorPaletteModel").setSizeLimit(this.maxModelSize);
		// core.getModel("stationList").setSizeLimit(this.maxModelSize);

		var dest;

		switch (window.location.hostname) {
		case "localhost":
			// dest = "sopra";
			dest = "local";
			break;
		case "wsapbpc01.ptx.fr.sopra":
			dest = "sopra";
			break;
		default:
			dest = "airbus";

			break;
		}

		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "../components/linetracker/config/url_config.properties",
			bundleLocale : dest
		});
		
		if (  dest === "sopra" ) {

			var oModel = this.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;
				
			for (var prop in oModel) {
				if (oModel[prop].slice(-5) != ".json" ) {
				oModel[prop] += "&j_user=" + Cookies.getJSON("login").user + "&j_password="  + Cookies.getJSON("login").mdp; 
				}
			}
		}
//		this.i18nModel = new sap.ui.model.resource.ResourceModel({
//			bundleUrl : "i18n/messageBundle.properties",
//			bundleLocale : sap.ui.getCore().getConfiguration().getLanguage()
//		});
		this.loadPulseModel();
		this.loadModelFactoryModel();
		this.loadModelColorPaletteModel(); // Load Color Palettes
		//core.setModel(this.i18nModel, "messageBundle");

	},
	
	getTranscoStation : function(sSite, sFactory, sLineNumber, sStationNumber) {
		var geturltranscostation = this.urlModel.getProperty('urltranscostation');
		geturltranscostation = this.replaceURI(geturltranscostation, "$site", sSite);
		geturltranscostation = this.replaceURI(geturltranscostation, "$factory", sFactory);
		geturltranscostation = this.replaceURI(geturltranscostation, "$line", sLineNumber);
		geturltranscostation = this.replaceURI(geturltranscostation, "$station", sStationNumber);

		$.ajax({
			url : geturltranscostation,
			cache : false,
			success : function(data, textStatus, jqXHR) {
				//TODO handle Warning QA
				if(airbus.mes.shell.util.Formatter.getMiiMessageType(data) == "E"){
					sap.m.MessageToast.show(airbus.mes.shell.util.Formatter.getMiiTextFromData(data));
				}else{
					airbus.mes.settings.ModelManager.site = data.Rowsets.Rowset[0].Row[0].Site;
					airbus.mes.settings.ModelManager.program = data.Rowsets.Rowset[0].Row[0].Program;
					airbus.mes.settings.ModelManager.station = data.Rowsets.Rowset[0].Row[0].Physical_Station;
					airbus.mes.settings.ModelManager.line = data.Rowsets.Rowset[0].Row[0].Line;
					airbus.mes.settings.ModelManager.saveUserSetting(sap.ui.getCore().getConfiguration().getLanguage().slice(0,2));
					airbus.mes.settings.ModelManager.loadUserSettingsModel();
					airbus.mes.settings.oView.getController().saveUserSettings();
					airbus.mes.shell.util.navFunctions.stationTracker();
				}
				
			},
		});
	},
	
	replaceURI : function(sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},
	
	
	getMessageControler : function() {

		if (!this.MessageBar)
			this.MessageBar = sap.ui.getCore().byId("idMainView--MessageBar");
		if (!this.MessageBar.getMessageNotifier()) {
			var notifier = new sap.ui.ux3.Notifier({
				title : "Message Logs"
			});
			notifier.attachMessageSelected(airbus.mes.linetracker.util.ModelManager.msgClickListener);
			this.MessageBar.setMessageNotifier(notifier);
		}

		return this.MessageBar.getMessageNotifier();

	},
	addMessages : function(Message, Type) {

		var oMessage = new sap.ui.core.Message({
			text : Message,
			timestamp : (new Date()).toUTCString(),
			level : Type
		});

		this.getMessageControler().addMessage(oMessage);

	},
	msgClickListener : function(oEvent) {
		var oMessage = oEvent.getParameter("message");
		airbus.mes.linetracker.util.ModelManager.messageShow(oMessage.getText());
	},
	minimizeMsgBar : function() {
		if (this.MessageBar)
			this.MessageBar.setVisibleStatus("Min");
	},
	// ************************************Get information of current userlog**************************************
	getRoles : function() {
		var rep = jQuery.ajax({
			async : false,
			url : this.urlModel.getProperty('urlgetroles'),
			type : 'POST',///
			/////
		});

		return rep.responseJSON;
	},

	// ************************************Launch/StopDiaporama**************************************
	launchdiaporama : function() {//
		if (airbus.mes.linetracker.util.ModelManager.vStopdiaporama) {
			oRefreshDiaporama = setInterval(function() {

				airbus.mes.linetracker.util.ModelManager.screendiaporama();

			}, 5000)
			sap.ui.getCore().byId("idMainView--Slideshow").setVisible(true);
			sap.ui.getCore().byId("idMainView--diaporama").setIcon(
					"sap-icon://pause");
			airbus.mes.linetracker.util.ModelManager.vStopdiaporama = false;
		} else {

			clearInterval(oRefreshDiaporama);
			sap.ui.getCore().byId("idMainView--Slideshow").setVisible(false);
			sap.ui.getCore().byId("idMainView--diaporama").setIcon(
					"sap-icon://play");
			airbus.mes.linetracker.util.ModelManager.vStopdiaporama = true;
			if (sap.ui.getCore().byId("idMainView--myShell")
					.getSelectedWorksetItem() === "idMainView--idFactory")
				airbus.mes.linetracker.util.ModelManager.lockshellselected = false;
		}
	},

	// ************************************Launch/StopDiaporama**************************************
	screendiaporama : function() {
//		var station = this.station_number;
//		var line = this.line_number;
//		var screen;
		var aStation = [];
		var oViewModel = sap.ui.getCore().getModel("FactoryModel").oData.Rowsets.Rowset[0].Row;

		oViewModel.some(function(el) {
			if (el.MSN != "---") {
				aStation.push(el);
			}
		});

		switch (sap.ui.getCore().byId("idMainView--myShell")
				.getSelectedWorksetItem()) {
		case "idMainView--idFactory":
			screen = 1;
			if (this.indexrow + 1 > aStation.length) {
				this.indexrow = 0
			}

			if (aStation.length > 0) {

				this.line_number = (aStation[this.indexrow].Line);
				this.station_number = (aStation[this.indexrow].Station)
				this.msn = (aStation[this.indexrow].MSN)
				if (!this.station_number === 5)
					sap.ui.getCore().byId("idMainView").getController()
							.lineSelected();
				else
					sap.ui.getCore().byId("idMainView").getController()
							.stationSelected();
			}

			break;

		case "idMainView--idProduction":
			screen = 2;
			if (this.indexrow + 1 > aStation.length) {
				this.indexrow = 0
			}
			if (aStation.length > 0) {

				this.line_number = (aStation[this.indexrow].Line);
				this.station_number = (aStation[this.indexrow].Station)
				this.msn = (aStation[this.indexrow].MSN)
				sap.ui.getCore().byId("idMainView").getController()
						.stationSelected();
			}

			break;

		case "idMainView--idStation":
			screen = 3;
			if (this.indexrow + 1 > aStation.length) {
				this.indexrow = 0
			}

			if (aStation.length > 0) {

				this.line_number = (aStation[this.indexrow].Line);
				this.station_number = (aStation[this.indexrow].Station)
				this.msn = (aStation[this.indexrow].MSN)
				this.hand = (aStation[this.indexrow].HAND)
				var oEvtReplica = {
					oSource : sap.ui.getCore().byId("idMainView--myShell"),
					mParameters : {
						key : "order"
					}
				};
				airbus.mes.linetracker.util.ModelManager.lockshellselected = true;
				// ModelManager.loadOrderWorklistModel();
				sap.ui.getCore().byId("idMainView").getController()
						.worksetItemSelected(oEvtReplica);
				this.indexrow++;

			}
			break;

//		case "idMainView--idOrder":
//			screen = 4;
//
//			var oEvtReplica = {
//				oSource : sap.ui.getCore().byId("idMainView--myShell"),
//				mParameters : {
//					key : "factory"
//				}
//			};
//			airbus.mes.linetracker.util.ModelManager.lockshellselected = true
//			sap.ui.getCore().byId("idMainView").getController()
//					.worksetItemSelected(oEvtReplica);
//			this.indexrow++;
//
//			break;
			default:
				break;
		}

	},

	// ************************************Launch/StopRefreshAllModel**************************************

	launchrefresh : function() {
		if (airbus.mes.linetracker.util.ModelManager.vStoprefresh) {
			oRefresh = setInterval(function() {
				airbus.mes.linetracker.util.ModelManager.refreshall();
			}, 30000)
			sap.ui.getCore().byId("idMainView--refresh").setVisible(true);
			airbus.mes.linetracker.util.ModelManager.vStoprefresh = false;
		} else {

			clearInterval(oRefresh);
			sap.ui.getCore().byId("idMainView--refresh").setVisible(false);
			airbus.mes.linetracker.util.ModelManager.vStoprefresh = true;
		}
	},
	// ************************************RefreshActivePage**************************************

	refreshall : function() {

		switch (sap.ui.getCore().byId("idMainView--myShell")
				.getSelectedWorksetItem()) {

		case "idMainView--idFactory":
			this.refreshFactoryModel();
			break;

		case "idMainView--idProduction":
			this.refreshProdLine(true);
			break;

		case "idMainView--idStation":
			this.refreshStationDetail(true);
			break;

		case "idMainView--idOrder":
			this.open = true;
			this.loadOrderWorklistModel();

			break;

		case "idMainView--idOperation":
			this.loadOperationWorklistModel();
			break;
		case "idMainView--idAllocation":

			this.loadOrderWorklistModel();
			break;

		}
	},

	// ************************************getCurrentDate**************************************

	getCurrentDate : function(transform) {
		if (transform) {
			var today = new Date(transform);
		} else {
			var today = new Date();
		}
		var isotoday = moment(today).format('YYYY-MM-DD[T]HH:mm:ss')
		return isotoday;

	},
	// ************************************RefreshStationDetail**************************************

	refreshStationDetail : function(ok) {
		sap.ui.getCore().byId("idStationView").getController()
				.refreshStationDetail(ok);
	},
	// ************************************RefreshProdLine**************************************

	refreshProdLine : function(ok) {

  

                     if(sap.ui.getCore().byId("idProductionView")  )
                  sap.ui.getCore().byId("idProductionView").getController().refreshProdLine(ok);

	},
	// ************************************RefreshFactoryModel**************************************

	refreshFactoryModel : function() {
		sap.ui.getCore().byId("idFactoryView").getController()
				.refreshFactoryModel();
	},
	// ************************************RefreshStationModel
	// 5**************************************

	refreshStationModel5 : function(lineNumber, msn_loaded, hand_loaded) {
		sap.ui.getCore().byId("idFactoryView").getController()
				.refreshStationModel5(lineNumber, msn_loaded, hand_loaded);
	},
	// ************************************RefreshStationModel
	// 5**************************************
	/* not needed anymore */
	ClearStation5 : function(lineNumber) {
		sap.ui.getCore().byId("idFactoryView").getController().ClearStation5(
				lineNumber);
	},	

	// *****************************************Station 5
	// Model********************************************
	getAvailableStations : function() {
		var geturlload = this.urlModel.getProperty('urlloadingstation5');
		geturlload = geturlload.replace("$factory", this.factory_name);
		geturlload = geturlload.replace("$line", this.line_number);
		// geturlload = geturlload.replace("$Load_Unload", this.Load_Unload);
		// geturlload = geturlload.replace("$Loaded_Hand", this.hand);
		// geturlload = geturlload.replace("$Loaded_MSN", this.msn);
		var oViewModel = sap.ui.getCore().getModel("lModel");
		oViewModel.loadData(geturlload, null, false);
	},

	loadUnloadStation5 : function(msn_loaded, hand_loaded) {
		sap.ui.core.BusyIndicator.show(0);
		jQuery.ajax({
			url : this.urlModel.getProperty('urlloadunload5'),
			type : 'POST',
			async : 'false',
			data : {
				"Param.1" : this.factory_name,
				"Param.2" : parseInt(this.line_number,10),
				"Param.3" : this.Load_Unload,
				"Param.4" : hand_loaded,
				"Param.5" : msn_loaded,
			},
			success : function(data, textStatus, jqXHR) {
				var message;
				if (airbus.mes.linetracker.util.ModelManager.Load_Unload == "Load") {
					message = "Load successful";
				}
				airbus.mes.linetracker.util.ModelManager.loadModelFactoryModel();
				airbus.mes.linetracker.util.ModelManager.ajaxMsgHandler(data, message);
			},
			error : airbus.mes.linetracker.util.ModelManager.ajaxError
		});
	},
	ajaxError : function(jqXHR, textStatus, errorThrown) {
		var message = textStatus + errorThrown;
		airbus.mes.linetracker.util.ModelManager.addMessages(message, sap.ui.core.MessageType.Error);
		airbus.mes.linetracker.util.ModelManager.messageShow(message);
		sap.ui.core.BusyIndicator.hide();
	},
	ajaxMsgHandler : function(data, Message) {

		if (data.Rowsets.FatalError != undefined) {
			sap.ui.core.BusyIndicator.hide();
			airbus.mes.linetracker.util.ModelManager.messageShow(data.Rowsets.FatalError);
			airbus.mes.linetracker.util.ModelManager.addMessages(data.Rowsets.FatalError,
					sap.ui.core.MessageType.Error);

		} else if (data.Rowsets.Messages != undefined) {
		// Need to implement Server message
		// else if(data.Rowsets.Message_Type ){
			airbus.mes.linetracker.util.ModelManager.addMessages(data.Rowsets.Messages[0].Message,
					sap.ui.core.MessageType.Success);
		} else if (data.Rowsets.Rowset != undefined) {
			// [0].Row[0].Message != undefined
			if (data.Rowsets.Rowset[0].Row[0].Message_Type != undefined) {

				airbus.mes.linetracker.util.ModelManager.messageShow(data.Rowsets.Rowset[0].Row[0].Message);
				if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S")
					airbus.mes.linetracker.util.ModelManager.addMessages(
							data.Rowsets.Rowset[0].Row[0].Message,
							sap.ui.core.MessageType.Success);
				else
					airbus.mes.linetracker.util.ModelManager.addMessages(
							data.Rowsets.Rowset[0].Row[0].Message,
							sap.ui.core.MessageType.Error);

			} else {
				airbus.mes.linetracker.util.ModelManager.messageShow(Message);
				airbus.mes.linetracker.util.ModelManager.addMessages(Message,
						sap.ui.core.MessageType.Success);
			}
			sap.ui.core.BusyIndicator.hide();
		} else {
			airbus.mes.linetracker.util.ModelManager.refreshFactoryModel();
			sap.ui.core.BusyIndicator.hide();

			airbus.mes.linetracker.util.ModelManager.messageShow(Message);
			airbus.mes.linetracker.util.ModelManager.addMessages(Message, sap.ui.core.MessageType.Success);

		}
		sap.ui.core.BusyIndicator.hide();
	},
	
	// *****************************************Pulse**************************************
	pulse : function(lineNumber, stationNumber) {
		sap.ui.core.BusyIndicator.show(0);
		jQuery.ajax({
			url : this.urlModel.getProperty('urlpulse'),
			type : 'POST',
			async : 'false',
			data : {
				"Param.1" : "F1",
				"Param.2" : lineNumber,
				"Param.3" : stationNumber,

			},
			success : function(data, textStatus, jqXHR) {

				airbus.mes.linetracker.util.ModelManager.ajaxMsgHandler(data, "Pulse successful");
				airbus.mes.linetracker.util.ModelManager.refreshFactoryModel();
			},
			error : airbus.mes.linetracker.util.ModelManager.ajaxError
		});

	},
	pulseLine : function(lineNumber) {
		sap.ui.core.BusyIndicator.show(0);
		jQuery.ajax({
			url : this.urlModel.getProperty('urlpulseLine'),
			type : 'POST',
			async : 'false',
			data : {
				"Param.1" : this.factory_name,
				"Param.2" : lineNumber,
			},
			success : function(data, textStatus, jqXHR) {

				airbus.mes.linetracker.util.ModelManager.ajaxMsgHandler(data, "Line Pulse successful");
				airbus.mes.linetracker.util.ModelManager.refreshFactoryModel();
			},
			error : airbus.mes.linetracker.util.ModelManager.ajaxError
		});

	},

	// ********************************************************************************************
	refreshOperation : function(oEvt) {
		sap.ui.core.BusyIndicator.show(0);
		var line = oEvt.getSource().getParent().getItems()[0].getText().split(
				" ")[1];
		jQuery.ajax({
			url : airbus.mes.linetracker.util.ModelManager.urlModel.getProperty('refreshoperation'),
			type : 'POST',
			async : 'false',
			data : {
				"Param.1" : "F1",
				"Param.2" : line,
				"Param.3" : airbus.mes.linetracker.util.ModelManager.station_number,

			},
			success : function(data, textStatus, jqXHR) {

				airbus.mes.linetracker.util.ModelManager.ajaxMsgHandler(data, "Refresh successful");

				airbus.mes.linetracker.util.ModelManager.refreshStationDetail();
				airbus.mes.linetracker.util.ModelManager.refreshProdLine();
				sap.ui.core.BusyIndicator.hide();
			},
			error : airbus.mes.linetracker.util.ModelManager.ajaxError
		});

	},
	// ************************************LogOut****************************************

	logOut : function() {
		jQuery.ajax({
			url : airbus.mes.linetracker.util.ModelManager.urlModel.getProperty("urllogout"),
			type : 'POST',
			async : false,
			complete : function() {

				location.reload();
			}

		})
	},
	
	// *************************************FactoryModel*********************************
	getUrlFactoryModel : function() {

		// var urlFactoryModel = this.urlModel.getProperty('urlfactview');
		var urlFactoryModel = this.urlModel.getProperty('urlstationmodel');
		return urlFactoryModel;
	},

	loadModelFactoryModel : function() {

		var geturlfact = airbus.mes.linetracker.util.ModelManager.getUrlFactoryModel();
		var oViewModel = sap.ui.getCore().getModel("FactoryModel");
		oViewModel.loadData(geturlfact, null, false);
	},
	onFactoryModelLoaded : function() {
		var oProperty;
		var oLength = 0;
		if (sap.ui.getCore().getModel("FactoryModel").getProperty(
				"/Rowsets/Rowset/0/Row")) {
			oProperty = sap.ui.getCore().getModel("FactoryModel").getProperty(
					"/Rowsets/Rowset/0/Row")
			oLength = sap.ui.getCore().getModel("FactoryModel").oData.Rowsets.Rowset[0].Row.length;
		}
		var line = [ 1, 2, 3 ];
//		var ModelDataFactory = [];
		var count = 0;
//		var outerJson;
		var cModelDataLine = [];
		while (count < line.length) {
			var sModelDataLine = [];

			for (var j = 0; j < oLength; j++) {
				if (parseInt(oProperty[j].Line,10) == line[count] /*
																 * &&
																 * parseInt(oProperty[j].Station)!==5
																 */) {
					sModelDataLine.push(oProperty[j]);
				}
			}

			var k = 0;
			for (var i = 0; i <= 8; i++) {
				if (sModelDataLine[k]
						&& sModelDataLine[k].Station == airbus.mes.linetracker.util.ModelManager.StationList[i]) {
					cModelDataLine.push(sModelDataLine[k++])
				} else {
					var oJson = {
						"Line" : line[count],
						"Station" : airbus.mes.linetracker.util.ModelManager.StationList[i],
						"Conveyor_Status" : "",
						"Takt_Resource_Status" : "",
						"MSN" : "",
						"TF" : "",
						"HAND" : ""
					};
					cModelDataLine.push(oJson);
				}
			}
			count++;

		}
		sap.ui.getCore().getModel("newFactoryModel").setData(cModelDataLine);
		sap.ui.getCore().getModel("newFactoryModel").refresh();
		/* necessary to rerender view as we are filtering in onAfterRendering */
		if (sap.ui.getCore().byId("idFactoryView"))/*
													 * no need to rerender on
													 * initial load
													 */
			sap.ui.getCore().byId("idFactoryView").rerender()
	},
	// *************************************Production
	// Model*********************************
	getUrlProductionModel : function() {

		// var urlProductionModel =
		// this.urlModel.getProperty('urlproductionview');
		var urlProductionModel = this.urlModel.getProperty('urllinemodel');
		return urlProductionModel;
	},

	loadModelProductionModel : function() {
		// var geturlprodline = this.urlModel.getProperty('urllinemodel');
		// var geturlproduction = ModelManager.();
		var oViewModel = sap.ui.getCore().getModel("ProductionModel");
		oViewModel.loadData(this.getUrlProductionModel(), null, false);
	},
	onProductionModelLoaded : function() {
		var oProperty;
		var oLength = 0;
		if (sap.ui.getCore().getModel("ProductionModel").getProperty(
				"/Rowsets/Rowset/0/Row")) {
			oProperty = sap.ui.getCore().getModel("ProductionModel")
					.getProperty("/Rowsets/Rowset/0/Row")
			oLength = sap.ui.getCore().getModel("ProductionModel").oData.Rowsets.Rowset[0].Row.length;
		}
		var ModelData = [];
		for (var j = 0; j < oLength; j++) {
			if (parseInt(oProperty[j].Line,10) == airbus.mes.linetracker.util.ModelManager.line_number) {
				ModelData.push(oProperty[j]);
			}
		}
		var ProdModelData = [];
		var k = 0;
		for (var i = 1; i <= 8; i++) {
			if (ModelData[k] && ModelData[k].Station == 5) {
				i--;
				k++;
			} else if (ModelData[k]
					&& ModelData[k].Station === airbus.mes.linetracker.util.ModelManager.StationList[i]) {
				var total;
				var onSchedule = Math.abs(parseInt(ModelData[k].Takt,10)
						- parseInt(ModelData[k].Progress,10));

				if (parseInt(ModelData[k].Progress,10) > parseInt(ModelData[k].Takt,10)) {
					if (onSchedule > 100)
						onSchedule = 100;
					total = 100 - (parseInt(ModelData[k].Takt,10) + onSchedule)
					ModelData[k].Donut = [ {
						"name" : "Certified work on time",
						"value" : ModelData[k].Takt
					}, {
						"name" : "Incomplete work in past",// this field will
						// always remain
						// zero in this case
						// as Incomplete
						// work in past
						// (late work) is
						// zero (takt <
						// progress)
						"value" : 0
					}, {
						"name" : "Certified work in future",
						"value" : onSchedule
					}, {
						"name" : "Future work",
						"value" : total
					} ];

				} else {
					total = 100 - (parseInt(ModelData[k].Progress,10) + onSchedule)

					ModelData[k].Donut = [ {
						"name" : "Certified work on time",
						"value" : ModelData[k].Progress
					}, {
						"name" : "Incomplete work in past",
						"value" : onSchedule
					}, {
						"name" : "Certified work in future",// this field will
						// always remain
						// zero in this case
						// as work done
						// (certified) in
						// future is zero
						// (progress < takt)
						"value" : 0
					}, {
						"name" : "Future work",
						"value" : total
					} ];
				}
				ModelData[k].Image = "../components/linetracker/images/Station" + ModelData[k].Station
						+ ".png";
				ModelData[k].ImageName = airbus.mes.linetracker.util.ModelManager.ProductionImage[i],
						ProdModelData.push(ModelData[k]);
				k++;
			} else {
				var oJson = {
					"Line" : airbus.mes.linetracker.util.ModelManager.line_number,
					"Station" : airbus.mes.linetracker.util.ModelManager.StationList[i],
					"STV" : 0,
					"TAKT_STATUS" : "",
					"Andon_raised" : 0,
					"Andon_rai_stat" : "",
					"Andon_escalated" : 0,
					"Andon_esc_stat" : "",
					"Takt" : 0,
					"TaktTime" : 0,
					"Progress" : 0,
					"Target_Takt" : "",
					"Allocated_Resource" : 0,
					"Total_Time" : 0,
					"Labour_Assigned" : 0,
					"MSN" : null,
					"HAND" : "",
					"RTO" : 0,
					"Image" : "../components/linetracker/images/Station" + airbus.mes.linetracker.util.ModelManager.StationList[i]
							+ ".png",
					"ImageName" : airbus.mes.linetracker.util.ModelManager.ProductionImage[i],
					"Donut" : [ {
						"name" : "Certified work on time",
						"value" : 0
					}, {
						"name" : "Incomplete work in past",
						"value" : 0
					}, {
						"name" : "Certified work in future",
						"value" : 0
					}, {
						"name" : "Future work",
						"value" : 100
					} ]
				};
				ProdModelData.push(oJson)
			}
		}

		sap.ui.getCore().getModel("newProductionModel").setData(ProdModelData);
		sap.ui.getCore().getModel("newProductionModel").refresh();
	},
	// *************************************StationModel*********************************
	getUrlStationModel : function() {

		var urlStationModel = this.urlModel.getProperty('urllinemodel');
		return urlStationModel;
	},

	loadModelStationModel : function() {

		var oViewModel = sap.ui.getCore().getModel("StationModel");
		// var newStationModel = sap.ui.getCore().getModel("newStationModel");

		oViewModel.loadData(airbus.mes.linetracker.util.ModelManager.getUrlStationModel(), null, false);
	},
	onStationModelLoaded : function() {

		var oProperty;
		var oLength = 0;
		if (sap.ui.getCore().getModel("StationModel").getProperty(
				"/Rowsets/Rowset/0/Row")) {
			oProperty = sap.ui.getCore().getModel("StationModel").getProperty(
					"/Rowsets/Rowset/0/Row")
			oLength = sap.ui.getCore().getModel("StationModel").oData.Rowsets.Rowset[0].Row.length;
		}
		var ModelData = [];

		for (var j = 0; j < oLength; j++) {
			if (parseInt(oProperty[j].Station,10) == airbus.mes.linetracker.util.ModelManager.station_number) {
				ModelData.push(oProperty[j]);
			}
		}
		var StationModelData = [];
		var k = 0;
		for (var i = 1; i <= 3; i++) {
			if (ModelData[k] && parseInt(ModelData[k].Line,10) === i) {

				var total;
				var onSchedule = Math.abs(parseInt(ModelData[k].Takt,10)
						- parseInt(ModelData[k].Progress,10));

				if (parseInt(ModelData[k].Progress,10) > parseInt(ModelData[k].Takt,10)) {
					if (onSchedule > 100)
						onSchedule = 100;
					total = 100 - (parseInt(ModelData[k].Takt,10) + onSchedule)
					ModelData[k].Donut = [ {
						"name" : "Certified work on time",
						"value" : ModelData[k].Takt
					}, {
						"name" : "Incomplete work in past",// this field will
						// always remain
						// zero in this case
						// as Incomplete
						// work in past
						// (late work) is
						// zero (takt <
						// progress)
						"value" : 0
					}, {
						"name" : "Certified work in future",
						"value" : onSchedule
					}, {
						"name" : "Future work",
						"value" : total
					} ];

				} else {
					total = 100 - (parseInt(ModelData[k].Progress,10) + onSchedule)

					ModelData[k].Donut = [ {
						"name" : "Certified work on time",
						"value" : ModelData[k].Progress
					}, {
						"name" : "Incomplete work in past",
						"value" : onSchedule
					}, {
						"name" : "Certified work in future",// this field will
						// always remain
						// zero in this case
						// as work done
						// (certified) in
						// future is zero
						// (progress < takt)
						"value" : 0
					}, {
						"name" : "Future work",
						"value" : total
					} ];
				}
				var colour;
				if (ModelData[k].Total_Time === "NA")
					ModelData[k].Total_Time = 0
				if (ModelData[k].Allocated_Resource < ModelData[k].Total_Time)
					colour = "Error";
				else
					colour = "Neutral";

				ModelData[k].Actual = {
					"value" : parseFloat(ModelData[k].Allocated_Resource),
					"color" : colour
				};

				ModelData[k].Threshold = [
						{
							"value" : 0
						},
						{
							"value" : Math
									.round(parseFloat(ModelData[k].Total_Time) * 1 / 3)
						},
						{
							"value" : parseFloat(ModelData[k].Total_Time)
						},
						{
							"value" : Math
									.round(parseFloat(ModelData[k].Total_Time) * 3 / 2)
						}, ];
				StationModelData.push(ModelData[k]);
				k++;
			} else {
				var oJson = {
					"Line" : "0" + i,
					"Station" : airbus.mes.linetracker.util.ModelManager.station_number,
					"STV" : 0,
					"TAKT_STATUS" : "",
					"Andon_raised" : 0,
					"Andon_rai_stat" : "",
					"Andon_escalated" : 0,
					"Andon_esc_stat" : "",
					"Takt" : 0,
					"TaktTime" : 0,
					"Progress" : 0,
					"Target_Takt" : "",
					"Allocated_Resource" : 0,
					"Total_Time" : 0,
					"Labour_Assigned" : 0,
					"MSN" : null,
					"RTO" : 0,
					"HAND" : "",
					"Donut" : [ {
						"name" : "Certified work on time",
						"value" : 0
					}, {
						"name" : "Incomplete work in past",
						"value" : 0
					}, {
						"name" : "Certified work in future",
						"value" : 0
					}, {
						"name" : "Future work",
						"value" : 100
					} ],
					"Actual" : {
						"value" : 0,
						"color" : "Neutral"

					},
					"Threshold" : [ {
						"value" : 0
					}, {
						"value" : 0
					}, {
						"value" : 0
					}, {
						"value" : 0
					} ]

				};
				StationModelData.push(oJson);
			}
		}

		sap.ui.getCore().getModel("newStationModel").setData(StationModelData);
		sap.ui.getCore().getModel("newStationModel").refresh();
		sap.ui.getCore().byId("idStationView").getController().lockStation()

	},
	// *************************************PulseModel*********************************
	loadPulseModel : function() {
		sap.ui.getCore().getModel("PulseModel").setData(airbus.mes.linetracker.util.ModelManager.PulseList);
		// sap.ui.getCore().setModel(newPulseModel, "PulseModel");
	},
	/*
	 * Loading Station List
	 */
	loadStationListModel : function() {
		sap.ui.getCore().getModel("stationList").setData(
				airbus.mes.linetracker.util.ModelManager.StationList);
	},
	// ***********************************SwapStations******************************************
	onSwap : function(oEvent) {

//		var oShell = sap.ui.getCore().byId("idMainView--myShell");
//		var worksetItem = oShell.getSelectedWorksetItem();
//		var pressed = oEvent.getSource().getPressed();
		
		var oNav = sap.ui.getCore().byId("idMainView--MainViewNavContainer");
		var worksetItem = oNav.getCurrentPage().getId();
		var pressed = oEvent.getSource().getPressed();

		switch (worksetItem) {
//		case "idMainView--idFactory":
		case "idFactoryView":
			airbus.mes.linetracker.util.ModelManager.swapStationsFactoryView(pressed);

			break;

//		case "idMainView--idProduction":
		case "idProductionView":
			airbus.mes.linetracker.util.ModelManager.swapStationsProductionView(pressed);
			break;

		default:
			break;
		}

	},

	swapStationsFactoryView : function(state) {

		var oFactoryHBox = sap.ui.getCore().byId("idFactoryView").byId(
				"factoryHBox");
//		var oLineVBox = sap.ui.getCore().byId("idFactoryView").byId(
//				"idFactoryView--VboxLeft");
		var oLineHBox1 = sap.ui.getCore().byId("idFactoryView").byId(
				"idFactoryView--stationLine1");
		var oLineHBox2 = sap.ui.getCore().byId("idFactoryView").byId(
				"idFactoryView--stationLine2");
		var oLineHBox3 = sap.ui.getCore().byId("idFactoryView").byId(
				"idFactoryView--stationLine3");
		var oLineHBox5 = sap.ui.getCore().byId("idFactoryView").byId(
				"idFactoryView--stationLine5");

		if (state === true) {
			oFactoryHBox.setDirection(sap.m.FlexDirection.RowReverse);
			oLineHBox1.setDirection(sap.m.FlexDirection.Row);
			oLineHBox2.setDirection(sap.m.FlexDirection.Row);
			oLineHBox3.setDirection(sap.m.FlexDirection.Row);
			oLineHBox5.setDirection(sap.m.FlexDirection.Row);
		} else {
			oFactoryHBox.setDirection(sap.m.FlexDirection.Row);
			oLineHBox1.setDirection(sap.m.FlexDirection.RowReverse);
			oLineHBox2.setDirection(sap.m.FlexDirection.RowReverse);
			oLineHBox3.setDirection(sap.m.FlexDirection.RowReverse);
			oLineHBox5.setDirection(sap.m.FlexDirection.RowReverse);
		}
	},
	swapStationsProductionView : function(state) {

		var oProductionHBox = sap.ui.getCore().byId("idProductionView").byId(
				"productionVBox");
		if (state === true) {
			oProductionHBox.setDirection(sap.m.FlexDirection.RowReverse);
		} else {
			oProductionHBox.setDirection(sap.m.FlexDirection.Row);
		}
	},

	onAndonClick : function() {
		window.open(airbus.mes.linetracker.util.ModelManager.urlModel.getProperty('urlandonapp'), "_blank");
	},
	launchResourcePool : function() {
		window.open(airbus.mes.linetracker.util.ModelManager.urlModel.getProperty('urlresourcepoolapp'),
				"_blank");
	},
	launchCusto : function() {
		window.open(airbus.mes.linetracker.util.ModelManager.urlModel.getProperty('urlcustoapp'),"_blank");
	},
	
	// *************************************colorPaletteModel*********************************
	getUrlColorPaletteModel : function() {

		var urlColorPaletteModel = this.urlModel.getProperty('urlColorPalette');
		return urlColorPaletteModel;
	},

	loadModelColorPaletteModel : function() {

		var oViewModel = sap.ui.getCore().getModel("colorPaletteModel");
		oViewModel
				.loadData(airbus.mes.linetracker.util.ModelManager.getUrlColorPaletteModel(), null, false);
	},

	getColorPalette : function(Type) {
		// Set Color Palettes
		var colorPaletteModel = sap.ui.getCore().getModel("colorPaletteModel").oData.Rowsets.Rowset[0].Row;

		var colorPalette = {};
		for (var i = 0; i < colorPaletteModel.length; i++) {
			if (colorPaletteModel[i].Type == Type)
				if (colorPaletteModel[i].CurrentPalette != "")
					colorPalette[colorPaletteModel[i].Property] = colorPaletteModel[i].CurrentPalette;
				else
					colorPalette[colorPaletteModel[i].Property] = colorPaletteModel[i].DefaultPalette;
		}
		return colorPalette;
	},

	loadStationColorPalette : function() {
		// Get Color Palette from Model
		var unorderedPalett = airbus.mes.linetracker.util.ModelManager.getColorPalette("Donut");

		var colorPalette = []; // Order of colors is important
		colorPalette.push(unorderedPalett.CertifiedWorkOnTime);
		colorPalette.push(unorderedPalett.IncompleteWorkInPast);
		colorPalette.push(unorderedPalett.CertifiedWorkInFuture);
		colorPalette.push(unorderedPalett.FutureWork);

		// Set the color palettes of DoNut Charts
		var oDonut1 = sap.ui.getCore().byId("idStationView--staionVbox2")
				.getItems()[0].getContent().getItems()[1];
		oDonut1.setVizProperties({
			plotArea : {
				colorPalette : colorPalette
			},
			title : {
				visible : false
			}
		});

		var oDonut2 = sap.ui.getCore().byId("idStationView--staionVbox2")
				.getItems()[1].getContent().getItems()[1];
		oDonut2.setVizProperties({
			plotArea : {
				colorPalette : colorPalette
			},
			title : {
				visible : false
			}
		});

		var oDonut3 = sap.ui.getCore().byId("idStationView--staionVbox2")
				.getItems()[2].getContent().getItems()[1];
		oDonut3.setVizProperties({
			plotArea : {
				colorPalette : colorPalette
			},
			title : {
				visible : false
			}
		});
	},

	loadProdLineColorPalette : function() {
		// Get Color Palette form Model
		var unorderedPalett = airbus.mes.linetracker.util.ModelManager.getColorPalette("Donut");

		var colorPalette = []; // Order of colors is important
		colorPalette.push(unorderedPalett.CertifiedWorkOnTime);
		colorPalette.push(unorderedPalett.IncompleteWorkInPast);
		colorPalette.push(unorderedPalett.CertifiedWorkInFuture);
		colorPalette.push(unorderedPalett.FutureWork);

		// Set the color palettes of DoNut Charts
		var oDonut = sap.ui.getCore().byId("idProductionView--productionVBox")
				.getItems();

		for (var i = 0; i < oDonut.length; i++) {
			var donut = oDonut[i].getItems()[2].getContent()
			donut.setVizProperties({
				plotArea : {
					colorPalette : colorPalette
				},

				title : {
					visible : false
				}
			});
		}
	}
};
//airbus.mes.linetracker.util.ModelManager.init(sap.ui.getCore());

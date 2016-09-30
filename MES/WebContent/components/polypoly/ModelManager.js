//"use strict";
jQuery.sap.declare("airbus.mes.polypoly.ModelManager")

/* refresh object */
var oRefresh;
var oRefreshDiaporama;
var Takt_start_date; // variable for takt start marker on order worklist
var aContent = {};// we cache the content in this object
var bClearData = false;// var to prevent clearing on gantt data for first time.
// gantt data needs to be cleared for refresh.
// refer:StationView.cotroller.js lockStation function
/* Initializing Gannt Objects for 'order worklist' and 'Operation worklist' */



airbus.mes.polypoly.ModelManager = {

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
	station_number : "10",
	line_number : "1",

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
	/* to show takt time in line View */
	highestTaktTime : undefined,
	minutesSpan : undefined,
	hoursSpan : undefined,
	secondsSpan : undefined,
	init : function(core) {

		// Initialization of all models

		/* Station Selection on PolyPolyscreen */
		core.setModel(new sap.ui.model.json.JSONModel(), "stationList");

		var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "sopra";
//			dest = "imi";
			break;
		case "wsapbpc01.ptx.fr.sopra":
			dest = "sopra";
			break;
		default:
			dest = "airbus";

			break;
		}

		this.queryParams.get("QaAdmin") == 'T' ? this.qaAdmin = true
				: this.qaAdmin = undefined;

		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "config/url_config.properties",
			bundleLocale : dest
		});
		this.i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/messageBundle.properties",
			bundleLocale : core.getConfiguration().getLanguage()
		});
		this.loadPulseModel();
		this.loadModelFactoryModel();
		this.loadModelColorPaletteModel(); // Load Color Palettes
		this.gantColorPalette = ModelManager.getColorPalette("Gantt") // Get
		// Color
		// Palette
		// form
		// Model
		this.writeGanttStyleElement(); // Write Gantt Color Css
		core.setModel(this.i18nModel, "messageBundle");

	},
	// //*************************************Line is
	// pulsing******************************************************
	// lineIsPulsing : function(){
	// jQuery.ajax({
	// url : this.urlModel.getProperty('urllispulsing'),
	// type : 'POST',
	// success : function(data, textStatus, jqXHR) {
	// if(data.Rowsets.FatalError === true){
	// sap.ui.core.BusyIndicator.show(0);
	// }else{
	// sap.ui.core.BusyIndicator.hide();
	// }
	//				
	// },error : function() {
	//				
	// ModelManager.messageShow("Problem access network");
	//					
	// }
	//				
	// });
	//		
	// },
	//	

	getMessageControler : function() {

		if (!this.MessageBar)
			this.MessageBar = sap.ui.getCore().byId("idMainView--MessageBar");
		if (!this.MessageBar.getMessageNotifier()) {
			var notifier = new sap.ui.ux3.Notifier({
				title : "Message Logs"
			});
			notifier.attachMessageSelected(ModelManager.msgClickListener);
			this.MessageBar.setMessageNotifier(notifier);
		}

		return this.MessageBar.getMessageNotifier();

	},
	addMessages : function(Message, Type) {

		// Pass Message as string and Type as "sap.ui.core.MessageType"

		// var now = (new Date()).toUTCString();
		var oMessage = new sap.ui.core.Message({
			text : Message,
			timestamp : (new Date()).toUTCString(),
			level : Type
		});

		// oMessage.setLevel(Type);

		this.getMessageControler().addMessage(oMessage);

	},
	oDialogNotification : undefined,
	msgClickListener : function(oEvent) {
		var oMessage = oEvent.getParameter("message");
		if (!ModelManager.oDialogNotification) {
			ModelManager.oDialogNotification = sap.ui.xmlfragment(
					"airbus.messageDialog", ModelManager);
		}
		if (oMessage.getProperty("level") != "Error"
				&& oMessage.getProperty("level") != "Success"
				&& oMessage.getProperty("level") != "Warning") {
			ModelManager.oDialogNotification.setTitle("Information");
			ModelManager.oDialogNotification
					.setIcon("sap-icon://message-information");

		} else {
			ModelManager.oDialogNotification.setTitle(oMessage
					.getProperty("level"));
			ModelManager.oDialogNotification.setState(oMessage
					.getProperty("level"));
		}
		sap.ui.getCore().byId("DialogNotificationTitle").setText(
				oMessage.getText())

		ModelManager.oDialogNotification.open();

		/* ModelManager.messageShow(oMessage.getText()); */
	},
	onClose : function() {

		ModelManager.oDialogNotification.close()
	},
	minimizeMsgBar : function() {
		if (this.MessageBar)
			this.MessageBar.setVisibleStatus("Min");
	},
	// ************************************Get information of current user
	// log**************************************
	getRoles : function() {
		var rep = jQuery.ajax({
			async : false,
			url : this.urlModel.getProperty('urlgetroles'),
			type : 'POST',
		});

		return rep.responseJSON;
	},

	// ************************************Launch/StopDiaporama**************************************
	launchdiaporama : function() {
		if (ModelManager.vStopdiaporama) {
			oRefreshDiaporama = setInterval(function() {

				ModelManager.screendiaporama();

			}, 5000)
			sap.ui.getCore().byId("idMainView--Slideshow").setVisible(true);
			sap.ui.getCore().byId("idMainView--diaporama").setIcon(
					"sap-icon://pause");
			ModelManager.vStopdiaporama = false;
		} else {

			clearInterval(oRefreshDiaporama);
			sap.ui.getCore().byId("idMainView--Slideshow").setVisible(false);
			sap.ui.getCore().byId("idMainView--diaporama").setIcon(
					"sap-icon://play");
			ModelManager.vStopdiaporama = true;
			if (sap.ui.getCore().byId("idMainView--myShell")
					.getSelectedWorksetItem() === "idMainView--idFactory")
				ModelManager.lockshellselected = false;
		}
	},

	// ************************************Launch/StopDiaporama**************************************
	screendiaporama : function() {
		var station = this.station_number;
		var line = this.line_number;
		var screen;
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
				ModelManager.lockshellselected = true;
				// ModelManager.loadOrderWorklistModel();
				sap.ui.getCore().byId("idMainView").getController()
						.worksetItemSelected(oEvtReplica);

			}
			break;

		case "idMainView--idOrder":
			screen = 4;

			var oEvtReplica = {
				oSource : sap.ui.getCore().byId("idMainView--myShell"),
				mParameters : {
					key : "factory"
				}
			};
			ModelManager.lockshellselected = true
			sap.ui.getCore().byId("idMainView").getController()
					.worksetItemSelected(oEvtReplica);
			this.indexrow++;

			break;
		}

	},

	// ************************************Launch/StopRefreshAllModel**************************************

	launchrefresh : function() {
		if (ModelManager.vStoprefresh) {
			oRefresh = setInterval(function() {
				ModelManager.refreshall();
			}, 30000)
			sap.ui.getCore().byId("idMainView--refresh").setVisible(true);
			ModelManager.vStoprefresh = false;
		} else {

			clearInterval(oRefresh);
			sap.ui.getCore().byId("idMainView--refresh").setVisible(false);
			ModelManager.vStoprefresh = true;
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

		if (sap.ui.getCore().byId("idProductionView"))
			sap.ui.getCore().byId("idProductionView").getController()
					.refreshProdLine(ok);

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
	// *****************************************zModel**************************************
	getAffectation : function() {

		var urlgetaffectation = this.urlModel.getProperty('urlgetaffectation');
		urlgetaffectation = urlgetaffectation.replace("$factory",
				this.factory_name);
		urlgetaffectation = urlgetaffectation.replace("$station",
				this.station_number);
		urlgetaffectation = urlgetaffectation
				.replace("$line", this.line_number);
		urlgetaffectation = urlgetaffectation.replace("$worder", this.worder);
		urlgetaffectation = urlgetaffectation.replace("$operation",
				this.operation);
		urlgetaffectation = urlgetaffectation.replace("$startdate",
				this.startdate);
		urlgetaffectation = urlgetaffectation.replace("$enddate", this.enddate);

		return urlgetaffectation;
	},

	// *****************************************SaveUser**************************************

	saveUser : function(url) {
		jQuery.ajax({
			url : this.urlModel.getProperty(url),
			type : 'POST',
			data : {
				"Param.1" : this.factory_name,
				"Param.2" : this.worder,
				"Param.3" : this.operation,
				"Param.4" : this.user_id,
				"Param.5" : this.startdate,
				"Param.6" : this.enddate,
				"Param.7" : this.user_affectation,
				"Param.8" : this.user_name,
				"Param.9" : this.line_number,
				"Param.10" : this.station_number,

			},

			success : function(data, textStatus, jqXHR) {
				ModelManager.ajaxMsgHandler(data,
						data.Rowsets.Rowset[0].Row[0].Message);
				// if (data.Rowsets.FatalError != undefined) {
				//
				// ModelManager.addMessages(data.Rowsets.FatalError,
				// sap.ui.core.MessageType.Error);
				// ModelManager.messageShow(data.Rowsets.FatalError);
				// }

			},
			error : ModelManager.ajaxError

		// function() {
		//				
		// ModelManager.addMessages("Couldn't Commit Changes. Pleasy Try
		// again!!",sap.ui.core.MessageType.Error);
		//				
		// ModelManager.messageShow("Couldn't Commit Changes. Pleasy Try
		// again!!");
		//					
		// }
		});

	},

	// *****************************************Affectation
	// Model******************************************

	loadModelGetAffectation : function() {
		var oViewModel = sap.ui.getCore().getModel("zModel");
		oViewModel.loadData(this.getAffectation(), null, false);
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
				"Param.2" : parseInt(this.line_number),
				"Param.3" : this.Load_Unload,
				"Param.4" : hand_loaded,
				"Param.5" : msn_loaded,
			},
			success : function(data, textStatus, jqXHR) {
				var message;
				if (ModelManager.Load_Unload == "Load") {
					message = "Load successful";
				}
				ModelManager.loadModelFactoryModel();
				ModelManager.ajaxMsgHandler(data, message);

				// if(data.Rowsets.FatalError != undefined){
				// sap.ui.core.BusyIndicator.hide();
				// ModelManager.messageShow(data.Rowsets.FatalError);
				// ModelManager.addMessages(data.Rowsets.FatalError,sap.ui.core.MessageType.Error);
				// }else{
				// ModelManager.refreshStationModel();
				// sap.ui.core.BusyIndicator.hide();
				// if (ModelManager.Load_Unload == "Load") {
				// ModelManager.messageShow("Load successful");}
				// ModelManager.addMessages("Load
				// successful",sap.ui.core.MessageType.Error);
				//					
				// }
			},
			error : ModelManager.ajaxError
		});
	},
	ajaxError : function(jqXHR, textStatus, errorThrown) {
		var message = textStatus + errorThrown;
		ModelManager.addMessages(message, sap.ui.core.MessageType.Error);
		ModelManager.messageShow(message);
		sap.ui.core.BusyIndicator.hide();
	},
	ajaxMsgHandler : function(data, Message) {

		if (data.Rowsets.FatalError != undefined) {
			sap.ui.core.BusyIndicator.hide();
			ModelManager.messageShow(data.Rowsets.FatalError);
			ModelManager.addMessages(data.Rowsets.FatalError,
					sap.ui.core.MessageType.Error);

		}
		// Need to implement Server message
		// else if(data.Rowsets.Message_Type ){
		else if (data.Rowsets.Messages != undefined) {
			ModelManager.addMessages(data.Rowsets.Messages[0].Message,
					sap.ui.core.MessageType.Success);
		} else if (data.Rowsets.Rowset != undefined) {
			// [0].Row[0].Message != undefined
			if (data.Rowsets.Rowset[0].Row[0].Message_Type != undefined) {

				ModelManager.messageShow(data.Rowsets.Rowset[0].Row[0].Message);
				if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S")
					ModelManager.addMessages(
							data.Rowsets.Rowset[0].Row[0].Message,
							sap.ui.core.MessageType.Success);
				else
					ModelManager.addMessages(
							data.Rowsets.Rowset[0].Row[0].Message,
							sap.ui.core.MessageType.Error);

			} else {
				ModelManager.messageShow(Message);
				ModelManager.addMessages(Message,
						sap.ui.core.MessageType.Success);
			}
			sap.ui.core.BusyIndicator.hide();
		} else {
			ModelManager.refreshFactoryModel();
			sap.ui.core.BusyIndicator.hide();

			ModelManager.messageShow(Message);
			ModelManager.addMessages(Message, sap.ui.core.MessageType.Success);

		}
		sap.ui.core.BusyIndicator.hide();
	},
	// *****************************************Break Management
	// Model*************************************
	getBreakData : function() {
		var geturlbreak = this.urlModel.getProperty('urlbreakmanagement');
		geturlbreak = geturlbreak.replace("$line", this.line_number);
		geturlbreak = geturlbreak.replace("$station", this.station_number);
		geturlbreak = geturlbreak.replace("$factory", this.factory_name);
		var oViewModel = sap.ui.getCore().getModel("bModel");
		oViewModel.loadData(geturlbreak, null, false);
		if (sap.ui.getCore().getModel('bModel').oData.Rowsets.Rowset[0].Row != undefined) {
			ModelManager
					.ajaxMsgHandler(oViewModel.oData, "Station Data loaded");
		}
	},

	isBreakTime : function(date, gantt) {

		var hours = gantt.getWorkHours(date);
		var hour = date.getHours() + date.getMinutes() / 100;

		if (hours.length % 2 == 1) {
			hours.length = hours.length - 1;
		}

		for (var i = 0; i < hours.length; i += 2) {
			if (hour < hours[i]) {
				return 'yes';
			} else if (hour < hours[i + 1]) {
				return 'no';
			}
		}

		return 'yes';

	},

	// *****************************************allocation Worklist
	// Model**************************************
	getUrlAllocationWorklistModel : function() {

		var urlAllocationWorklistModel = this.urlModel
				.getProperty('allocationworklist');
		urlAllocationWorklistModel = urlAllocationWorklistModel.replace(
				"$factory", this.factory_name);
		urlAllocationWorklistModel = urlAllocationWorklistModel.replace(
				"$station", this.station_number);
		urlAllocationWorklistModel = urlAllocationWorklistModel.replace(
				"$line", this.line_number);
		urlAllocationWorklistModel = urlAllocationWorklistModel.replace("$msn",
				this.msn);
		urlAllocationWorklistModel = urlAllocationWorklistModel.replace(
				"$hand", this.hand);
		return urlAllocationWorklistModel;
	},
	loadAllocationWorklistModel : function() {
		// sap.ui.getCore().byId('ssview').setBusy(true);
		var oViewModel = sap.ui.getCore().getModel("allocationWrkListModel");
		oViewModel.setData({
			data : null
		});
		oViewModel.refresh();
		if (sap.ui.getCore().byId("idAllocationWorkListView")) {
			UserAffect_Gantt.clearAll();
		}
		oViewModel.loadData(this.getUrlAllocationWorklistModel(), null, true);

	},

	// *****************************************operation Worklist
	// Model**************************************
	getUrlOperationWorklistModel : function() {

		var urlOperationWorklistModel = this.urlModel
				.getProperty('operationworklist');
		urlOperationWorklistModel = urlOperationWorklistModel.replace(
				"$factory", this.factory_name);
		urlOperationWorklistModel = urlOperationWorklistModel.replace(
				"$station", this.station_number);
		urlOperationWorklistModel = urlOperationWorklistModel.replace("$line",
				this.line_number);
		urlOperationWorklistModel = urlOperationWorklistModel.replace("$msn",
				this.msn);
		urlOperationWorklistModel = urlOperationWorklistModel.replace("$hand",
				this.hand);
		return urlOperationWorklistModel;
	},

	loadOperationWorklistModel : function() {
		// sap.ui.getCore().byId('ssview').setBusy(true);
		var oViewModel = sap.ui.getCore().getModel("oprWrkListModel");
		oViewModel.setData({
			data : null
		});
		oViewModel.refresh();
		if (sap.ui.getCore().byId("idOperationWorkListView")) {
			WkLOpr_Gantt.clearAll();
		}
		oViewModel.loadData(this.getUrlOperationWorklistModel(), null, true);

	},
	onAllocationWorklistModelLoaded : function() {
		ModelManager.operation_User = [];
		var oModel = sap.ui.getCore().getModel("allocationWrkListModel");
		var sexist;
		// sap.ui.getCore().byId('ssview').setBusy(false);

		for (var i = 1; i < oModel.oData.firstChild.firstChild.childNodes.length; i++) {
			if (oModel.oData.firstChild.firstChild.childNodes[i].childNodes[9].childNodes.length > 0) {

				oModel.oData.firstChild.firstChild.childNodes[i].childNodes[9].childNodes[0].nodeValue
						.split("/")
						.some(
								function(el) {
									if (el) {

										for (var a = 0; a < ModelManager.operation_User.length; a++) {
											if (ModelManager.operation_User[a].name === el) {
												sexist = a;
												break;
											} else {
												sexist = -1
											}
										}
										if (sexist >= 0) {

											ModelManager.operation_User[sexist].operation
													.push(oModel.oData.firstChild.firstChild.childNodes[i].childNodes[0].childNodes[0].nodeValue)

										} else {
											ModelManager.operation_User
													.push({
														name : el,
														operation : [ oModel.oData.firstChild.firstChild.childNodes[i].childNodes[0].childNodes[0].nodeValue ]
													});
										}
									}
								});

			}

		}

		// jQuery.sap.require({modName:"airbus.operationWorklistGantt",type:
		// "view"});
		if (sap.ui.getCore().byId("comboboxsearch")) {

			sap.ui.getCore().byId("comboboxsearch").destroyItems();
			sap.ui.getCore().byId("comboboxsearch").addItem(
					new sap.ui.core.Item({
						text : "All user",
						key : "All user"
					}))

			ModelManager.operation_User.some(function(el) {
				sap.ui.getCore().byId("comboboxsearch").addItem(
						new sap.ui.core.Item({
							text : el.name,
							key : el.name
						}))
			})
		}
	},
	// *************************Gantt Model-Confirmation Operation
	// Worklist***********************
	getUrlOprWrklistConfirmationModel : function(orderId, operationId,
			actualPercentage, targetPercent, username, password) {

		var urlOprWrklistConfirmationModel = this.urlModel
				.getProperty('confiramtionModel');
		urlOprWrklistConfirmationModel = urlOprWrklistConfirmationModel
				.replace("$factory", this.factory_name);
		urlOprWrklistConfirmationModel = urlOprWrklistConfirmationModel
				.replace("$orderId", orderId);
		urlOprWrklistConfirmationModel = urlOprWrklistConfirmationModel
				.replace("$operationId", operationId);
		urlOprWrklistConfirmationModel = urlOprWrklistConfirmationModel
				.replace("$actualPercentage", actualPercentage);
		urlOprWrklistConfirmationModel = urlOprWrklistConfirmationModel
				.replace("$targetPercent", targetPercent);
		urlOprWrklistConfirmationModel = urlOprWrklistConfirmationModel
				.replace("$Unit_Of_Confirmation", this.Unit_Of_Confirmation);
		urlOprWrklistConfirmationModel = urlOprWrklistConfirmationModel
				.replace("$UserName", username.toUpperCase());
		urlOprWrklistConfirmationModel = urlOprWrklistConfirmationModel
				.replace("$Password", password);

		return urlOprWrklistConfirmationModel;
	},

	// *****************************************Order Worklist
	// Model**************************************
	getUrlOrderWorklistModel : function() {

		var urlOrderWorklistModel = this.urlModel.getProperty('orderworklist');
		urlOrderWorklistModel = urlOrderWorklistModel.replace("$factory",
				this.factory_name);
		urlOrderWorklistModel = urlOrderWorklistModel.replace("$station",
				this.station_number);
		urlOrderWorklistModel = urlOrderWorklistModel.replace("$line",
				this.line_number);
		urlOrderWorklistModel = urlOrderWorklistModel.replace("$msn", this.msn);
		urlOrderWorklistModel = urlOrderWorklistModel.replace("$hand",
				this.hand);
		return urlOrderWorklistModel;
	},

	loadOrderWorklistModel : function() {
		// sap.ui.getCore().byId('ssview').setBusy(true);
		var oViewModel = sap.ui.getCore().getModel("OrderWorklistModel");

		oViewModel.setData({
			data : null
		});
		oViewModel.refresh();
		if (sap.ui.getCore().byId("idOrderWorkListView")) {
			WLOrd_Gantt.clearAll();
		}
		// if (sap.ui.getCore().byId("uview")) {
		// UserAffect_Gantt.clearAll();
		// }

		oViewModel.loadData(this.getUrlOrderWorklistModel(), null, false);

	},
	onOrderWorklistModelLoaded : function() {
		ModelManager.operation_User = [];
		var oModel = sap.ui.getCore().getModel("OrderWorklistModel");
		var sexist;
		// sap.ui.getCore().byId('ssview').setBusy(false);

		for (var i = 1; i < oModel.oData.firstChild.firstChild.childNodes.length; i++) {
			if (oModel.oData.firstChild.firstChild.childNodes[i].childNodes[9].childNodes.length > 0) {

				oModel.oData.firstChild.firstChild.childNodes[i].childNodes[9].childNodes[0].nodeValue
						.split("/")
						.some(
								function(el) {
									if (el) {

										for (var a = 0; a < ModelManager.operation_User.length; a++) {
											if (ModelManager.operation_User[a].name === el) {
												sexist = a;
												break;
											} else {
												sexist = -1
											}
										}
										if (sexist >= 0) {

											ModelManager.operation_User[sexist].operation
													.push(oModel.oData.firstChild.firstChild.childNodes[i].childNodes[0].childNodes[0].nodeValue);

										} else {
											ModelManager.operation_User
													.push({
														name : el,
														operation : [ oModel.oData.firstChild.firstChild.childNodes[i].childNodes[0].childNodes[0].nodeValue ]
													});
										}
									}
								});

			}

		}

	},

	// *****************************************UserModel**************************************
	/* TODO:is this function needed? */
	loadModelUsersModel : function() {

		var geturlusermodel = this.urlModel.getProperty("urlusermodel");

		geturlusermodel = geturlusermodel.replace("$formatteddate", this
				.getCurrentDate());

		var oViewModel = sap.ui.getCore().getModel("UsersModel");
		oViewModel.loadData(geturlusermodel, null, false);

	},
	// *****************************************Pulse**************************************
	pulse : function(line_number, station_number) {
		sap.ui.core.BusyIndicator.show(0);
		jQuery.ajax({
			url : this.urlModel.getProperty('urlpulse'),
			type : 'POST',
			async : 'false',
			data : {
				"Param.1" : "F1",
				"Param.2" : line_number,
				"Param.3" : station_number,

			},
			success : function(data, textStatus, jqXHR) {

				ModelManager.ajaxMsgHandler(data, "Pulse successful");
				ModelManager.refreshFactoryModel();

				// if(data.Rowsets.FatalError != undefined){
				// ModelManager.messageShow(data.Rowsets.FatalError);
				// sap.ui.core.BusyIndicator.hide();
				// }else{
				// ModelManager.refreshStationModel();
				// sap.ui.core.BusyIndicator.hide();
				// ModelManager.messageShow("Pulse successful");
				// }
			},
			error : ModelManager.ajaxError

		// function() {
		// ModelManager.messageShow("Couldn't Commit Changes. Pleasy Try
		// again!!");
		// sap.ui.core.BusyIndicator.hide();
		// }
		});

	},
	pulseLine : function(line_number) {
		sap.ui.core.BusyIndicator.show(0);
		jQuery.ajax({
			url : this.urlModel.getProperty('urlpulseLine'),
			type : 'POST',
			async : 'false',
			data : {
				"Param.1" : this.factory_name,
				"Param.2" : line_number,
			},
			success : function(data, textStatus, jqXHR) {

				ModelManager.ajaxMsgHandler(data, "Line Pulse successful");
				ModelManager.refreshFactoryModel();

				// if(data.Rowsets.Rowset[0].Row[0].Message != undefined){
				// ModelManager.refreshStationModel();
				// ModelManager.messageShow(data.Rowsets.Rowset[0].Row[0].Message);
				// sap.ui.core.BusyIndicator.hide();
				// }else{
				// ModelManager.refreshStationModel();
				// sap.ui.core.BusyIndicator.hide();
				// ModelManager.messageShow("Line Pulse successful");
				// }
			},
			error : ModelManager.ajaxError
		});

	},

	// ********************************************************************************************
	refreshOperation : function(oEvt) {
		sap.ui.core.BusyIndicator.show(0);
		var line = oEvt.getSource().getParent().getItems()[0].getText().split(
				" ")[1];
		jQuery.ajax({
			url : ModelManager.urlModel.getProperty('refreshoperation'),
			type : 'POST',
			async : 'false',
			data : {
				"Param.1" : "F1",
				"Param.2" : line,
				"Param.3" : ModelManager.station_number,

			},
			success : function(data, textStatus, jqXHR) {

				ModelManager.ajaxMsgHandler(data, "Refresh successful");

				// ModelManager.loadOrderWorklistModel();
				// ModelManager.loadAllocationWorklistModel();
				ModelManager.refreshStationDetail();
				ModelManager.refreshProdLine();
				sap.ui.core.BusyIndicator.hide();
				// if(data.Rowsets.FatalError != undefined){
				// ModelManager.messageShow(data.Rowsets.FatalError);
				// sap.ui.core.BusyIndicator.hide();
				// }else{
				// ModelManager.loadOperationWorklistModel();
				// ModelManager.loadOrderWorklistModel();
				// ModelManager.loadAllocationWorklistModel();
				// ModelManager.refreshStationDetail();
				// ModelManager.refreshProdLine();
				// sap.ui.core.BusyIndicator.hide();
				// ModelManager.messageShow("Refresh successful");
				// }
			},
			error : ModelManager.ajaxError
		});

	},
	// ************************************LogOut****************************************

	logOut : function() {
		jQuery.ajax({
			url : ModelManager.urlModel.getProperty("urllogout"),
			type : 'POST',
			async : false,
			complete : function() {

				location.reload();
			}

		})
	},
	// ************************************GANTT 3 COLOURED TASK
	// RENDERER****************************************
	taktColorRendered : function(task, element, maxWidth, SelectedGantt) {
		var done = task.progress * 1 || 0;
		maxWidth = Math.max(maxWidth, 0);// 2px for borders
		var pr = document.createElement("div");
		pr.className = "gantt_task_progress";
		if (task.progressColor) {
			pr.style.backgroundColor = task.progressColor;
			pr.style.opacity = 1;
		}
		pr.innerHTML = SelectedGantt.templates.progress_text(task.start_date,
				task.end_date, task);
		var task_end_date = new Date(task.end_date);
		var task_start_date = new Date(task.start_date);
		var today = new Date();
		var ukdate = today.getUTCFullYear() + '-' + (today.getUTCMonth() + 1)
				+ '-' + (today.getUTCDate()) + ' ' + (today.getUTCHours())
				+ ':' + (today.getUTCMinutes()) + ':' + today.getUTCSeconds();
		var curr_date = new Date(ukdate);
		// if it is a past task
		if (task_end_date <= curr_date) {
			var width = maxWidth * done;
			width = Math.min(maxWidth, width);
			pr.style.width = width + 'px';
		}// if this is a future task
		else if (task_start_date >= curr_date) {
			var width = maxWidth * done;
			width = Math.min(maxWidth, width);
			if (width > 0) {
				// make progress as max, then float the extra width to
				// right, this will give progress in darkgreen(has to be
				// made red) and remaining in light green(extra width)
				var extraWidth = maxWidth - width;
				pr.style.width = maxWidth + 'px';
				// element.style.cssText = 'display:inline !important';
				pr.style.cssText = "background-color: "
						+ this.gantColorPalette.CertifiedWorkInFuture
						+ " !important";
				// creating a new div for hiding the background color(status
				// based) and showing the color according to the rule
				var bgOverlap = document.createElement("div");
				bgOverlap.style.backgroundColor = this.gantColorPalette.FutureWork;
				bgOverlap.style.opacity = 1;
				bgOverlap.style.zIndex = 50;
				bgOverlap.style.float = "right";
				bgOverlap.style.height = "inherit";
				bgOverlap.style.width = Math.max(extraWidth, 0) + 'px';
				if (Math.max(extraWidth, 0) != 0)
					pr.appendChild(bgOverlap);
			} else {// if it is a current task...ie... if width is zero we
				// have to show the status of the color as it is.
				pr.style.width = width + 'px';
			}
		}// Case 3: if the takt line is overlapping the task,
		else {
			var lag = task.difference * 1 || 0;// lag shows how much the
			// task is ahead or behind
			// the target progress
			if (lag == 0) {// work is on the right time
				var width = maxWidth * done;
				width = Math.min(maxWidth, width);
				pr.style.width = width + 'px';
			} else {
				var chk;
				if (lag > 0) {// progress is behind time: lacking progress in
					// light red
					chk = false;
					done = done + lag;
				} else {// progress is ahead of time ; extra progress in
					// dark red
					chk = true;
					lag = Math.abs(lag);
				}
				var width = maxWidth * done;
				width = Math.min(maxWidth, width);
				var diff = maxWidth * lag;
				var extraWidth = maxWidth - width;// to display bgOverlapEnd
				// setting the progress to full width. then we will
				// substract the lag from it, and the background color as
				// well
				pr.style.width = maxWidth + 'px';

				// for progress lacking or extra
				var taktLag = document.createElement("div");

				if (chk)// show dark red as progress is ahead of time
				{
					// taktLag.style.cssText = "background-color: #ff0000
					// !important";
					taktLag.style.backgroundColor = this.gantColorPalette.CertifiedWorkInFuture;
				} else// show background as progress is behind time
				{
					// taktLag.style.cssText = "background-color: #d96c49
					// !important";
					taktLag.style.backgroundColor = this.gantColorPalette.IncompleteWorkInPast;
				}
				taktLag.style.opacity = 1;
				taktLag.style.zIndex = 50;
				taktLag.style.float = "right";
				taktLag.style.height = "inherit";
				taktLag.style.width = Math.max(diff, 0) + 'px';

				// for background
				var bgOverlapEnd = document.createElement("div");
				bgOverlapEnd.style.backgroundColor = this.gantColorPalette.FutureWork;

				bgOverlapEnd.style.opacity = 1;
				bgOverlapEnd.style.zIndex = 50;
				bgOverlapEnd.style.float = "right";
				bgOverlapEnd.style.height = "inherit";
				bgOverlapEnd.style.width = Math.max(extraWidth, 0) + 'px';

				// adding the progress and bakground
				if (Math.max(extraWidth, 0) != 0)
					pr.appendChild(bgOverlapEnd);
				if (Math.max(diff, 0) != 0)
					pr.appendChild(taktLag);
			}
		}
		element.appendChild(pr);
	},

	messageShow : function(text) {
		sap.m.MessageToast.show(text, {
			duration : 3000,
			width : "25em",
			my : "center center",
			at : "center center",
			of : window,
			offset : "0 0",
			collision : "fit fit",
			onClose : null,
			autoClose : true,
			animationTimingFunction : "ease",
			animationDuration : 1000,
			closeOnBrowserNavigation : true
		});

	},
	// *************************************FactoryModel*********************************
	getUrlFactoryModel : function() {

		// var urlFactoryModel = this.urlModel.getProperty('urlfactview');
		var urlFactoryModel = this.urlModel.getProperty('urlstationmodel');
		return urlFactoryModel;
	},

	loadModelFactoryModel : function() {

		var geturlfact = ModelManager.getUrlFactoryModel();
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
		var ModelDataFactory = [];
		var count = 0;
		var outerJson;
		var cModelDataLine = [];
		while (count < line.length) {
			var sModelDataLine = [];

			for (var j = 0; j < oLength; j++) {
				if (parseInt(oProperty[j].Line) == line[count] /*
																 * &&
																 * parseInt(oProperty[j].Station)!==5
																 */) {
					sModelDataLine.push(oProperty[j]);
				}
			}

			var k = 0;
			for (var i = 0; i <= 8; i++) {
				if (sModelDataLine[k]
						&& sModelDataLine[k].Station == ModelManager.StationList[i]) {
					cModelDataLine.push(sModelDataLine[k++])
				} else {
					var oJson = {
						"Line" : line[count],
						"Station" : ModelManager.StationList[i],
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
			if (parseInt(oProperty[j].Line) == ModelManager.line_number) {
				ModelData.push(oProperty[j]);
			}
		}
		var ProdModelData = [];
		var k = 0;
		ModelManager.highestTaktTime = 0; // +V6.0/MJ 
		for (var i = 1; i <= 8; i++) {
			if (ModelData[k] && ModelData[k].Station == 5) {
				i--;
				k++;
			} else if (ModelData[k]
					&& ModelData[k].Station === ModelManager.StationList[i]) {
				if (ModelData[k].TaktTime > ModelManager.highestTaktTime) // +V6.0/MJ
					ModelManager.highestTaktTime = ModelData[k].TaktTime // +V6.0/MJ 
				var total;
				var onSchedule = Math.abs(parseInt(ModelData[k].Takt)
						- parseInt(ModelData[k].Progress));

				if (parseInt(ModelData[k].Progress) > parseInt(ModelData[k].Takt)) {
					if (onSchedule > 100)
						onSchedule = 100;
					total = 100 - (parseInt(ModelData[k].Takt) + onSchedule)
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
					total = 100 - (parseInt(ModelData[k].Progress) + onSchedule)

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
				ModelData[k].Image = "images/Station" + ModelData[k].Station
						+ ".png";
				ModelData[k].ImageName = ModelManager.ProductionImage[i],
						ProdModelData.push(ModelData[k]);
				k++;
			} else {
				var oJson = {
					"Line" : ModelManager.line_number,
					"Station" : ModelManager.StationList[i],
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
					"Image" : "images/Station" + ModelManager.StationList[i]
							+ ".png",
					"ImageName" : ModelManager.ProductionImage[i],
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
		if(ModelManager.highestTaktTime > 0)
		var remainingTime = new Date(Date.parse(new Date()) + ModelManager.highestTaktTime * 60 * 60 * 1000);
		else
			var remainingTime = 0;
		
		
		clearInterval(window.timeinterval);
		sap.ui.getCore().byId("idMainView").getController().initializeClock('clockdiv',remainingTime); //V6.0/MJ
	},
	// *************************************StationModel*********************************
	getUrlStationModel : function() {

		var urlStationModel = this.urlModel.getProperty('urllinemodel');
		return urlStationModel;
	},

	loadModelStationModel : function() {

		var oViewModel = sap.ui.getCore().getModel("StationModel");
		// var newStationModel = sap.ui.getCore().getModel("newStationModel");

		oViewModel.loadData(ModelManager.getUrlStationModel(), null, false);
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
			if (parseInt(oProperty[j].Station) == ModelManager.station_number) {
				ModelData.push(oProperty[j]);
			}
		}
		var StationModelData = [];
		var k = 0;
		for (var i = 1; i <= 3; i++) {
			if (ModelData[k] && parseInt(ModelData[k].Line) === i) {

				var total;
				var onSchedule = Math.abs(parseInt(ModelData[k].Takt)
						- parseInt(ModelData[k].Progress));

				if (parseInt(ModelData[k].Progress) > parseInt(ModelData[k].Takt)) {
					if (onSchedule > 100)
						onSchedule = 100;
					total = 100 - (parseInt(ModelData[k].Takt) + onSchedule)
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
					total = 100 - (parseInt(ModelData[k].Progress) + onSchedule)

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
					"Station" : ModelManager.station_number,
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
		sap.ui.getCore().getModel("PulseModel").setData(ModelManager.PulseList);
		// sap.ui.getCore().setModel(newPulseModel, "PulseModel");
	},
	/*
	 * Loading Station List
	 */
	loadStationListModel : function() {
		sap.ui.getCore().getModel("stationList").setData(
				ModelManager.StationList);
	},
	// ***********************************SwapStations******************************************
	onSwap : function(oEvent) {

		var oShell = sap.ui.getCore().byId("idMainView--myShell");
		var worksetItem = oShell.getSelectedWorksetItem();
		var pressed = oEvent.getSource().getPressed();

		switch (worksetItem) {
		case "idMainView--idFactory":
			ModelManager.swapStationsFactoryView(pressed);

			break;

		case "idMainView--idProduction":
			ModelManager.swapStationsProductionView(pressed);
			break;

		default:
			break;
		}

	},

	swapStationsFactoryView : function(state) {

		var oFactoryHBox = sap.ui.getCore().byId("idFactoryView").byId(
				"factoryHBox");
		var oLineVBox = sap.ui.getCore().byId("idFactoryView").byId(
				"idFactoryView--VboxLeft");
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
		window.open(ModelManager.urlModel.getProperty('urlandonapp'), "_blank");
	},
	launchResourcePool : function() {
		window.open(ModelManager.urlModel.getProperty('urlresourcepoolapp'),
				"_blank");
	},
	launchCusto : function() {
		window.open(ModelManager.urlModel.getProperty('urlcustoapp'), "_blank");
	},
	getUrlChkUserOprCertificate : function(USER_ID) {
		var urlChkUserOprCertificate = ModelManager.urlModel
				.getProperty('urlchkuseroprcertificate');
		urlChkUserOprCertificate = urlChkUserOprCertificate.replace("$Order",
				ModelManager.worder);
		urlChkUserOprCertificate = urlChkUserOprCertificate.replace("$Site",
				ModelManager.site);
		urlChkUserOprCertificate = urlChkUserOprCertificate.replace(
				"$Revision", ModelManager.revision);
		urlChkUserOprCertificate = urlChkUserOprCertificate.replace(
				"$Operation", ModelManager.operation);
		urlChkUserOprCertificate = urlChkUserOprCertificate.replace("$User_ID",
				USER_ID);
		return urlChkUserOprCertificate;
	},
	chkUserOprCertificate : function(USER_ID) {
		sap.ui.core.BusyIndicator.show(0);

		jQuery
				.ajax({
					url : ModelManager.getUrlChkUserOprCertificate(USER_ID),
					type : 'GET',
					async : false,
					success : function(data, textStatus, jqXHR) {

						if (data.Rowsets.FatalError != undefined) {
							ModelManager.messageShow(data.Rowsets.FatalError);
						} else if (data.Rowsets.Messages != undefined) {
							ModelManager.messageShow(data.Rowsets.Messages);
						} else if (data.Rowsets.Rowset) {
							if (data.Rowsets.Rowset[0].Row[0].Message_Type != undefined) {
								if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {
									ModelManager
											.messageShow(data.Rowsets.Rowset[0].Row[0].Message);
									sap.ui.getCore().byId(
											"idAllocationWorkListView")
											.getController()
											.afterConfirmPress();
								} else if (data.Rowsets.Rowset[0].Row[0].Message_Type == "W") {
									sap.ui.getCore().byId(
											"oDialogAffectatonConfirmation")
											.setState("Warning");
									sap.ui.getCore().byId(
											"oDialogAffectatonConfirmation")
											.setTitle("Warning");
									sap.ui
											.getCore()
											.byId("messageAffectConfirm")
											.setText(
													data.Rowsets.Rowset[0].Row[0].Message);
									sap.ui.getCore().byId(
											"oDialogAffectatonConfirmation")
											.open();
								} else {
									ModelManager
											.messageShow(data.Rowsets.Rowset[0].Row[0].Message);
								}
							} else {
								ModelManager
										.messageShow("Couldn't perform QA check. Please try again.");
							}
						} else {
							ModelManager
									.messageShow("Couldn't perform QA check. Please try again.");
						}
						sap.ui.core.BusyIndicator.hide();
					},
					error : ModelManager.ajaxError
				});

	},
	getUrlChkUserOprCertificatePolyPoly : function(ERP_ID) {
		var urlChkUserOprCertificatePolyPoly = ModelManager.urlModel
				.getProperty('urlchkuseroprcertificatepolypoly');
		urlChkUserOprCertificatePolyPoly = urlChkUserOprCertificatePolyPoly
				.replace("$Order", ModelManager.worder);
		urlChkUserOprCertificatePolyPoly = urlChkUserOprCertificatePolyPoly
				.replace("$Site", ModelManager.site);
		urlChkUserOprCertificatePolyPoly = urlChkUserOprCertificatePolyPoly
				.replace("$Revision", ModelManager.revision);
		urlChkUserOprCertificatePolyPoly = urlChkUserOprCertificatePolyPoly
				.replace("$Operation", ModelManager.operation);
		urlChkUserOprCertificatePolyPoly = urlChkUserOprCertificatePolyPoly
				.replace("$ERP_ID", ERP_ID);
		return urlChkUserOprCertificatePolyPoly;
	},
	chkUserOprCertificatePolyPoly : function(ERP_ID, checkBox) {
		sap.ui.core.BusyIndicator.show(0);

		jQuery
				.ajax({
					url : ModelManager
							.getUrlChkUserOprCertificatePolyPoly(ERP_ID),
					type : 'GET',
					async : false,
					success : function(data, textStatus, jqXHR) {

						if (data.Rowsets.FatalError != undefined) {
							ModelManager.messageShow(data.Rowsets.FatalError);
							checkBox.setSelected(false);// dont check the box
						} else if (data.Rowsets.Messages != undefined) {
							ModelManager
									.messageShow(data.Rowsets.Messages[0].Message);
							// return true;//check the box
						} else if (data.Rowsets.Rowset) {
							if (data.Rowsets.Rowset[0].Row[0].Message_Type != undefined) {
								if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {
									ModelManager
											.messageShow(data.Rowsets.Rowset[0].Row[0].Message);
									// return true;//check the box
								} else if (data.Rowsets.Rowset[0].Row[0].Message_Type == "W") {
									sap.ui
											.getCore()
											.byId(
													"oDialogAffectatonConfirmationPolyPoly")
											.setState("Warning");
									sap.ui
											.getCore()
											.byId(
													"oDialogAffectatonConfirmationPolyPoly")
											.setTitle("Warning");
									sap.ui
											.getCore()
											.byId(
													"messageAffectConfirmPolyPoly")
											.setText(
													data.Rowsets.Rowset[0].Row[0].Message);
									sap.ui
											.getCore()
											.byId(
													"oDialogAffectatonConfirmationPolyPoly")
											.open();
								} else {
									ModelManager
											.messageShow(data.Rowsets.Rowset[0].Row[0].Message);
									// return true;//check the box
								}
							} else {
								ModelManager
										.messageShow("Couldn't perform QA check. Please try again.");
								// return true;//check the box
							}
						} else {
							ModelManager
									.messageShow("Couldn't perform QA check. Please try again.");
							// return true;//check the box
						}
						PolypolyManager.setUserAllocation();
						sap.ui.core.BusyIndicator.hide();
					},
					error : ModelManager.ajaxError
				});

	},
	// *************************************colorPaletteModel*********************************
	getUrlColorPaletteModel : function() {

		var urlColorPaletteModel = this.urlModel.getProperty('urlColorPalette');
		return urlColorPaletteModel;
	},

	loadModelColorPaletteModel : function() {

		var oViewModel = sap.ui.getCore().getModel("colorPaletteModel");
		oViewModel
				.loadData(ModelManager.getUrlColorPaletteModel(), null, false);
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
		var unorderedPalett = ModelManager.getColorPalette("Donut");

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
		var unorderedPalett = ModelManager.getColorPalette("Donut");

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
	},

	writeGanttStyleElement : function() {

		var css = ".high {background-color: "
				+ this.gantColorPalette.IncompleteWorkInPast + " !important; }";
		css = css + ".medium {background-color: "
				+ this.gantColorPalette.FutureWork + " !important; }";
		css = css
				+ ".high .gantt_task_progress, .medium .gantt_task_progress{background-color: "
				+ this.gantColorPalette.CertifiedWorkOnTime + " !important; }";
		css = css + ".taskOrphan {background-color: "
				+ this.gantColorPalette.OrphanOperations + " !important; }";
		css = css + ".taskOutstanding {background-color: "
				+ this.gantColorPalette.OutstandingOperations
				+ " !important; }";
		css = css + ".today {background-color: "
				+ this.gantColorPalette.ProgressLineMarker + " !important; }";

		var style = document.createElement('style');
		style.type = "text/css"

		if (style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}

		var head = document.head || document.getElementsByTagName('head')[0];
		head.appendChild(style);
	}
};
airbus.mes.polypoly.ModelManager.init(sap.ui.getCore());
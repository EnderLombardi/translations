"use strict";
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

	stationMII : undefined,
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
	/* to show takt time in line View */
	highestTaktTime : undefined,
	minutesSpan : undefined,
	hoursSpan : undefined,
	secondsSpan : undefined,
	init : function(core) {

		// Initialization of all models
		/* Station Selection on PolyPolyscreen */
		core.setModel(new sap.ui.model.json.JSONModel(), "stationList");
		core.setModel(new sap.ui.model.json.JSONModel(),"mTableModel");
		core.setModel(new sap.ui.model.json.JSONModel(),"mQATableModel");
		// this model seems to be the main model to create polypoly
		core.setModel(new sap.ui.model.json.JSONModel(),"mii");
		
		// attach event on end of loading model
		core.getModel("mii").attachRequestCompleted(airbus.mes.polypoly.ModelManager.onPolyPolyModelLoaded);
				
		core.setModel(new sap.ui.model.json.JSONModel(), "listQA");
//		core.setModel(new sap.ui.model.json.JSONModel(), "columnModel");
		core.setModel(new sap.ui.model.json.JSONModel(), "rpModel");
		core.setModel(new sap.ui.model.json.JSONModel("../components/polypoly/model/needlevels.json"), "needlevels");
		core.setModel(new sap.ui.model.json.JSONModel(), "affectationModel");
		
		
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

		this.queryParams.get("QaAdmin") == 'T' ? this.qaAdmin = true
				: this.qaAdmin = undefined;

		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "../components/polypoly/config/url_config.properties",
			bundleLocale : dest
		});

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
	
	handleUserConnection : function(sUrl) {
		var bModeDroits = true;
		if(bModeDroits){
			if(this.queryParams.get("url_config") == "sopra" || this.queryParams.get("url_config") == "airbus"){
				var sUser = "NG43F36";
				var sPassword = "tretre654";
				var sAddUrl = "&j_user="+ sUser + "&j_password=" + sPassword;

				return sUrl + sAddUrl
			}else{
				return sUrl
			}
		}else{
			return sUrl
		}
	},
	
	// PBA ADD LOADING MODEL FOR POLYPOLY replace the getPolypolyModel place in polypolymanager
	
	getPolyPolyModel : function (sSite, sStation) {
		
		var urlgetpolypoly = this.urlModel.getProperty("urlgetpolypoly");

		urlgetpolypoly = urlgetpolypoly.replace("$station", sStation);
		urlgetpolypoly = urlgetpolypoly.replace("$site", sSite);
		
		//Handle User & Password
		urlgetpolypoly = this.handleUserConnection(urlgetpolypoly);
		
		// Rename this model
		sap.ui.getCore().getModel("mii").loadData(urlgetpolypoly,null,false);
		
		var urlgetqalist = this.urlModel.getProperty("urlgetqalist");
		urlgetqalist = urlgetqalist.replace("$site", sSite);
		
		//Handle User & Password
		urlgetqalist = this.handleUserConnection(urlgetqalist); //FIXME
		
		sap.ui.getCore().getModel("listQA").loadData(urlgetqalist,null,false);
		
		airbus.mes.polypoly.ModelManager.getPolyStation(sSite, sStation);
		
	},
	
	getPolyStation : function(sSite, sStation) {
		var urlgetpolystation = this.urlModel.getProperty("urlgetpolystation");

		urlgetpolystation = urlgetpolystation.replace("$station", sStation);
		urlgetpolystation = urlgetpolystation.replace("$site", sSite);
		
		//Handle User & Password
		urlgetpolystation = this.handleUserConnection(urlgetpolystation);	//FIXME

		$.ajax({
			url : urlgetpolystation,
			success : function(data, textStatus, jqXHR) {
				airbus.mes.polypoly.ModelManager.stationMII = data.Rowsets.Rowset[0].Row[0].PPM_Station;
			},
		})
	},
	
	onPolyPolyModelLoaded : function(oResponse) {
//		oResponse = oResponse.getSource().getData().Rowsets.Rowset[0].Row[0];
//		if(oResponse.hasOwnProperty("Message_Type")){
//		if(oResponse.Message_Type == "E"){
//		sap.ui.getCore().getModel("mii").oData.Rowsets.Rowset[0].Row = {};
//		}
//		}

//		var oData = sap.ui.getCore().getModel("mii").getData().Rowsets;
//		if (oData.Rowset && oData.Rowset.length > 0 && oData.Rowset[0].Row && !oData.Rowset[0].Row[0].hasOwnProperty("Message_Type")) {
//			var oMiiData = sap.ui.getCore().getModel("mii").getData();
//			var oTableData = airbus.mes.polypoly.PolypolyManager.createTableData(oMiiData);
//			var mTableModel = new sap.ui.model.json.JSONModel(oTableData);
//			airbus.mes.polypoly.PolypolyManager.internalContext.oModel = mTableModel;
//
//			var oQATableData = airbus.mes.polypoly.PolypolyManager.createQATableData(oMiiData);
//			var mQATableModel = new sap.ui.model.json.JSONModel(oQATableData);
//			airbus.mes.polypoly.PolypolyManager.internalContext.oModelQA = mQATableModel;
//			// ????? 
//			sap.ui.getCore().byId("polypoly").setModel(mTableModel);
//			//sap.ui.getCore().getModel("mTableModel").loadData(mTableModel);
//
//		}else{
//			var mTableModel = new sap.ui.model.json.JSONModel();
//		}
		
		var oData = sap.ui.getCore().getModel("mii").getData().Rowsets;
		if (oData.Rowset && oData.Rowset.length > 0 && oData.Rowset[0].Row && !oData.Rowset[0].Row[0].hasOwnProperty("Message_Type")) {
			var oMiiData = sap.ui.getCore().getModel("mii").getData();
			var oTableData = airbus.mes.polypoly.PolypolyManager.createTableData(oMiiData);
			var mTableModel = new sap.ui.model.json.JSONModel(oTableData);
			var oQATableData = airbus.mes.polypoly.PolypolyManager.createQATableData(oMiiData);
			var mQATableModel = new sap.ui.model.json.JSONModel(oQATableData);
		}else{
			var mTableModel = new sap.ui.model.json.JSONModel();
			airbus.mes.polypoly.oView.byId("oTablePolypoly").setNoData(airbus.mes.shell.util.Formatter.getMiiTextFromData(oResponse.getSource().getData()));
		}
		airbus.mes.polypoly.PolypolyManager.internalContext.oModel = mTableModel;
		airbus.mes.polypoly.PolypolyManager.internalContext.oModelQA = mQATableModel;
		// ????? 
		sap.ui.getCore().byId("polypoly").setModel(mTableModel);
		//sap.ui.getCore().getModel("mTableModel").loadData(mTableModel);
		
	},
	
	
	loadStationListModel : function() {
		sap.ui.getCore().getModel("stationList").setData(this.StationList);
	},

//	getUrlChkUserOprCertificatePolyPoly : function(ERP_ID) {
//		var urlChkUserOprCertificatePolyPoly = this.urlModel.getProperty('urlchkuseroprcertificatepolypoly');
//		urlChkUserOprCertificatePolyPoly = urlChkUserOprCertificatePolyPoly.replace("$Order", this.worder);
//		urlChkUserOprCertificatePolyPoly = urlChkUserOprCertificatePolyPoly
//				.replace("$Site", this.site);
//		urlChkUserOprCertificatePolyPoly = urlChkUserOprCertificatePolyPoly
//				.replace("$Revision", this.revision);
//		urlChkUserOprCertificatePolyPoly = urlChkUserOprCertificatePolyPoly
//				.replace("$Operation", this.operation);
//		urlChkUserOprCertificatePolyPoly = urlChkUserOprCertificatePolyPoly
//				.replace("$ERP_ID", ERP_ID);
//		return urlChkUserOprCertificatePolyPoly;
//	},
//	chkUserOprCertificatePolyPoly : function(ERP_ID) {
//		sap.ui.core.BusyIndicator.show(0);
//
//		jQuery.ajax({
//			url : this.getUrlChkUserOprCertificatePolyPoly(ERP_ID),
//			type : 'GET',
//			async : false,
//			success : function(data, textStatus, jqXHR) {
//
//				if (data.Rowsets.FatalError != undefined) {
//					this.messageShow(data.Rowsets.FatalError);
//				} else if (data.Rowsets.Messages != undefined) {
//					this.messageShow(data.Rowsets.Messages[0].Message);
//					// return true;//check the box
//				} else if (data.Rowsets.Rowset) {
//					if (data.Rowsets.Rowset[0].Row[0].Message_Type != undefined) {
//						if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {
//							this.messageShow(data.Rowsets.Rowset[0].Row[0].Message);
//							// return true;//check the box
//						} else if (data.Rowsets.Rowset[0].Row[0].Message_Type == "W") {
//							airbus.mes.polypoly.oView.byId("oDialogAffectatonConfirmationPolyPoly").setState("Warning");
//							airbus.mes.polypoly.oView.byId("oDialogAffectatonConfirmationPolyPoly").setTitle("Warning");
//							airbus.mes.polypoly.oView.byId("messageAffectConfirmPolyPoly").setText(data.Rowsets.Rowset[0].Row[0].Message);
//							airbus.mes.polypoly.oView.byId("oDialogAffectatonConfirmationPolyPoly").open();
//						} else {
//							this.messageShow(data.Rowsets.Rowset[0].Row[0].Message);
//							// return true;//check the box
//						}
//					} else {
//						this.messageShow("Couldn't perform QA check. Please try again.");
//						// return true;//check the box
//					}
//				} else {
//					this.messageShow("Couldn't perform QA check. Please try again.");
//					// return true;//check the box
//				}
////				PolypolyManager.setUserAllocation();
//				sap.ui.core.BusyIndicator.hide();
//			},
//			error : function(){
//				this.messageShow("Error");
//				sap.ui.core.BusyIndicator.hide();
//			}
//		});
//
//	},

};
airbus.mes.polypoly.ModelManager.init(sap.ui.getCore());


"use strict";
jQuery.sap.declare("airbus.mes.polypoly.ModelManager")

///* refresh object */
//var oRefresh;
//var oRefreshDiaporama;
//var Takt_start_date; // variable for takt start marker on order worklist
//var aContent = {};// we cache the content in this object
//var bClearData = false;// var to prevent clearing on gantt data for first time.
//// gantt data needs to be cleared for refresh.
//// refer:StationView.cotroller.js lockStation function
///* Initializing Gannt Objects for 'order worklist' and 'Operation worklist' */

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
		airbus.mes.shell.ModelManager.createJsonModel(core,["stationList",
		                                                    "mTableModel",
		                                                    "mQATableModel",
		                                                    "mii",
		                                                    "listQA", 
		                                                    "columnModel",
		                                                    "rpModel",
		                                                    "affectationModel",
		                                                    ]);
		
		core.setModel(new sap.ui.model.json.JSONModel("../components/polypoly/model/needlevels.json"), "needlevels");
	
		// attach event on end of loading model
		core.getModel("mii").attachRequestCompleted(airbus.mes.polypoly.ModelManager.onPolyPolyModelLoaded);

        // Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.polypoly.config.url_config");

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
		var bModeDroits = false;
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
		var urlgetqalist = this.urlModel.getProperty("urlgetqalist");
		urlgetqalist = urlgetqalist.replace("$site", sSite);
		
		//Handle User & Password
		urlgetqalist = this.handleUserConnection(urlgetqalist); //FIXME
		
		sap.ui.getCore().getModel("listQA").loadData(urlgetqalist,null,true);
		
		airbus.mes.polypoly.ModelManager.getPolyStation(sSite, sStation);
		
		var urlgetpolypoly = this.urlModel.getProperty("urlgetpolypoly");

		urlgetpolypoly = urlgetpolypoly.replace("$station", sStation);
		urlgetpolypoly = urlgetpolypoly.replace("$site", sSite);
		
		//Handle User & Password
		urlgetpolypoly = this.handleUserConnection(urlgetpolypoly);
		
		// Rename this model
		sap.ui.getCore().getModel("mii").loadData(urlgetpolypoly,null,true);
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
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				airbus.mes.polypoly.ModelManager.stationMII = data.Rowsets.Rowset[0].Row[0].PPM_Station;
			},
		})
	},
	
	onPolyPolyModelLoaded : function(oResponse) {
		
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
		
		//defect 325
		// TODO : new call, confirm if is correct, consequences two calls every time
		airbus.mes.polypoly.oView.getController().initiatePolypoly();
		//
		// duplicate with initiatePolypoly();
		//
		//sap.ui.getCore().getModel("mTableModel").loadData(mTableModel);
		//airbus.mes.polypoly.oView.getController().clearFilters();
		//if (airbus.mes.polypoly.oView.byId("oTablePolypoly").getBinding("rows") != undefined) {		
		//	sap.ui.getCore().byId("polypoly--polypolySearchField").setValue(airbus.mes.polypoly.PolypolyManager.getValueSelected);
		//	airbus.mes.polypoly.oView.getController().onRPSearch();
		//}
		// *****
		
		//Set Scroll bar at previous level - Stored in polypoly.controller.onChangeClick() and reset in navFunctions.polypoly()
		airbus.mes.polypoly.oView.byId("oTablePolypoly").setFirstVisibleRow(airbus.mes.polypoly.PolypolyManager.firstVisibleRow);
		
		airbus.mes.shell.busyManager.unsetBusy(airbus.mes.polypoly.oView);
	},
	
	
	loadStationListModel : function() {
		sap.ui.getCore().getModel("stationList").setData(this.StationList);
	}

};
airbus.mes.polypoly.ModelManager.init(sap.ui.getCore());
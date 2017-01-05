"use strict";

jQuery.sap.declare("airbus.mes.linetracker.util.ModelManager");

airbus.mes.linetracker.util.ModelManager = {
		urlModel : undefined,
		site : undefined,
		program:undefined,
		queryParams : jQuery.sap.getUriParameters(),
		
    init : function(core) {
    	core.setModel(new sap.ui.model.json.JSONModel(), "stationDataModel"); // Station model
    	core.setModel(new sap.ui.model.json.JSONModel(), "lineVariantModel"); // Line Variant Data model
    	core.setModel(new sap.ui.model.json.JSONModel(), "KPIchartTaktAdherence"); // KPI Chart Takt Adherence model
    	core.setModel(new sap.ui.model.json.JSONModel(), "KPItaktAdherence"); // KPI Takt Adherence model
    	core.setModel(new sap.ui.model.json.JSONModel(), "KPItaktEfficiency"); // KPI Takt Efficiency model
    	core.setModel(new sap.ui.model.json.JSONModel(), "KPIdisruption"); // KPI Disruptions/Andon model
    	core.setModel(new sap.ui.model.json.JSONModel(), "KPIresolutionEfficiency"); // KPI Resolution Efficiency model
    	core.setModel(new sap.ui.model.json.JSONModel(), "KPIopenAnomalies"); // KPI Open Anomalies model
    	core.setModel(new sap.ui.model.json.JSONModel(), "KPIextraWork"); // KPI Open Anomalies model
    	core.setModel(new sap.ui.model.json.JSONModel(), "KPIshiftStaffing"); // KPI Shift Staffing model
    	//core.setModel(new sap.ui.model.json.JSONModel(), "plantModel"); // KPI Shift Staffing model
    	//sap.ui.getCore().getModel("stationDataModel").attachRequestCompleted(airbus.mes.linetracker.util.ModelManager.renderControls);
    	//Not Used
    	core.setModel(new sap.ui.model.json.JSONModel(), "KPI"); // KPI Data for All model 

    	airbus.mes.linetracker.util.ModelManager.site = airbus.mes.settings.ModelManager.site;

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
					bundleUrl : "../components/linetracker/config/url_config.properties",
					bundleLocale : dest
				});
		
		core.getModel("stationDataModel").loadData(this.urlModel.getProperty("urlstationData"),null,false);
		
		if (dest === "sopra") {

			var oModel = this.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;

			for ( var prop in oModel) {
				if (oModel[prop].slice(-5) != ".json") {
					oModel[prop] += "&j_user=" + Cookies.getJSON("login").user
							+ "&j_password=" + Cookies.getJSON("login").mdp;
				}
			}
		}
		
		this.loadStationDataModel();
		this.loadLineVariantModel();
		this.loadKPIChartTaktAdherence();
		this.loadKPItaktAdherence();
		this.loadKPItaktEfficiency();
		this.loadKPIdisruption();
		this.loadKPIresolutionEfficiency();
		this.loadKPIopenAnomalies();
		this.loadKPIextraWork();
		this.loadKPIshiftStaffing();
		this.loadKPI(); //Not Used 
		this.loadPlantModel();
		
    },
    /*
     * Load Station Details in line tracker
     */
    loadStationDataModel: function(){
		var oViewModel = sap.ui.getCore().getModel("stationDataModel");
//		airbus.mes.linetracker.oView.byId("idLinetracker1--linetrackerTable").setBusy(true); 
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlstationData"),
			contentType : 'application/json',
			cache: false,
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"station" : airbus.mes.settings.ModelManager.station,
				"msn" : airbus.mes.settings.ModelManager.msn
			}),

			success : function(data) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				//oViewModel.setData([]);
				oViewModel.setData(data);
				//oViewModel.refresh();
				sap.ui.getCore().byId("idLinetracker1--linetrackerTable").rerender();
//				sap.ui.getCore().byId("idLinetracker1--linetrackerTable").getRows().forEach(function(row){row.rerender();});
//				airbus.mes.linetracker.oView.byId("idLinetracker1--linetrackerTable").setBusy(false);
			},

			error : function(error, jQXHR) {
				console.log(error);
//				airbus.mes.linetracker.oView.byId("idLinetracker1--linetrackerTable").setBusy(false);
			}
		});
    },
    
    /*
     * Load Line variant names for value help
     */
    loadLineVariantModel:function(){
    	var oViewModel = sap.ui.getCore().getModel("lineVariantModel");
//		airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true); 
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
		});
    },
    
    /*
     * Load KPI Chart Takt Adherence Model
     */
    loadKPIChartTaktAdherence: function(){
    	var oViewModel = sap.ui.getCore().getModel("KPIchartTaktAdherence");
//		airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true); 
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
		});
    },
    
    /*
     * Load KPI Takt Adherence Model
     */
    loadKPItaktAdherence:function(){
    	var oViewModel = sap.ui.getCore().getModel("KPItaktAdherence");
//		airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true); 
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
		});
    },
    
    /*
     * Load KPI Takt Efficiency Model
     */
    loadKPItaktEfficiency:function(){
    	var oViewModel = sap.ui.getCore().getModel("KPItaktEfficiency");
//		airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true); 
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
		});
    	
    },
    
    /*
     * Load KPI Disruption/Andon Model
     */
    loadKPIdisruption:function(){
    	var oViewModel = sap.ui.getCore().getModel("KPIdisruption");
//		airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true); 
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
		});
    },
    
    /*
     * Load KPI Resolution Efficiency Model 
     */
    loadKPIresolutionEfficiency: function(){
    	var oViewModel = sap.ui.getCore().getModel("KPIresolutionEfficiency");
//		airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true); 
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
//				airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			},

			error : function(error, jQXHR) {
				console.log(error);
//				airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			}
		});
    },
    
    /*
     * Load Open Anomalies Model
     */
    loadKPIopenAnomalies: function(){
    	var oViewModel = sap.ui.getCore().getModel("KPIopenAnomalies");
//		airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true); 
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
		});
    },
    
    /*
     * Load Extra Work Model
     */
    loadKPIextraWork: function(){
    	var oViewModel = sap.ui.getCore().getModel("KPIextraWork");
//		airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true); 
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
//				airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			},

			error : function(error, jQXHR) {
				console.log(error);
//				airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(false);
			}
		});
    },
    
    loadKPIshiftStaffing: function(){
    	var oViewModel = sap.ui.getCore().getModel("KPIshiftStaffing");
//		airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true); 
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPIshiftStaffing"),
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
		});
    },
    
    /* Not Used 
     * Load All KPI chats model
     */
    loadKPI: function(){
    	var oViewModel = sap.ui.getCore().getModel("KPI");
//		airbus.mes.linetracker.oView.byId("linetrackerTable").setBusy(true); 
		jQuery.ajax({
			type : 'post',
			url : this.urlModel.getProperty("urlKPI"),
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
		});
    },
    
    loadPlantModel : function(){
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
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				oViewModel.setData(data);
			},

			error : function(error, jQXHR) {
				console.log(error);
			}
		});
    	
    }    

};


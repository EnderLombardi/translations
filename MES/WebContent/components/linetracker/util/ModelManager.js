"use strict";

jQuery.sap.declare("airbus.mes.linetracker.util.ModelManager");

airbus.mes.linetracker.util.ModelManager = {
    
    init : function(core) {
    // Models for New linetracker 
    	this.core = core;
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(),"stationDataModel");
		sap.ui.getCore().getModel("stationDataModel").loadData("../components/linetracker/local/data.json",null,false);

		var oModel1 = new sap.ui.model.resource.ResourceModel({bundleName:"airbus.mes.linetracker.i18n.i18n"});
		sap.ui.getCore().setModel(oModel1, "i18n");
		
		// KPICharts models
		var i18nModel = new sap.ui.model.resource.ResourceModel(
				{
					bundleUrl : "../components/linetracker/KPICharts/i18n/i18n.properties",
				});
		core.setModel(i18nModel, "kpiI18n");

		//Takt Efficiency
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(),"KPItaktEfficiency");
		sap.ui.getCore().getModel("KPItaktEfficiency").loadData("../components/linetracker/KPICharts/data/KPItaktEfficiencyModel.json",null, false);
		//Takt Adherence
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(),"KPItaktAdherence");
		sap.ui.getCore().getModel("KPItaktAdherence").loadData("../components/linetracker/KPICharts/data/KPItaktAdherenceModel.json",null, false);
		//Shift Staffing
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(),"KPIshiftStaffing");
		sap.ui.getCore().getModel("KPIshiftStaffing").loadData("../components/linetracker/KPICharts/data/KPIshiftStaffingModel.json",null, false);
		// Extrawork
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(),"KPIextraWork");
		sap.ui.getCore().getModel("KPIextraWork").loadData("../components/linetracker/KPICharts/data/KPIextraWorkModel.json",null, false);
		//KPI Model
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(),"KPI");
		sap.ui.getCore().getModel("KPI").loadData("../components/linetracker/KPICharts/data/KPIModel.json",null, false);
		
		//KPI Chart Model
        sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(),"KPIchartTaktAdherence");
        sap.ui.getCore().getModel("KPIchartTaktAdherence").loadData("../components/linetracker/KPICharts/data/KPIchartTaktAdherenceModel.json",null, false);
        
        //KPI Chart Model
        sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(),"KPIdisruption");
        sap.ui.getCore().getModel("KPIdisruption").loadData("../components/linetracker/KPICharts/data/KPIdisruptionModel.json",null, false);
        
      //KPI Resolution Efficiency Model 
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(),"KPIresolutionEfficiency");
		sap.ui.getCore().getModel("KPIresolutionEfficiency").loadData("../components/linetracker/KPICharts/data/KPIresolutionEfficiencyModel.json",null, false);

		//KPI Open Anomalies Model
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(),"KPIopenAnomalies");
		sap.ui.getCore().getModel("KPIopenAnomalies").loadData("../components/linetracker/KPICharts/data/KPIopenAnomaliesModel.json",null, false);


    },

};


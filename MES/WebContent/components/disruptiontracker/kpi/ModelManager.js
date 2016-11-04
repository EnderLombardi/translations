//"use strict";
jQuery.sap.declare("airbus.mes.disruptiontracker.kpi.ModelManager")
airbus.mes.disruptiontracker.kpi.ModelManager = {
	urlModel : undefined,
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {
		
		core.setModel(new sap.ui.model.json.JSONModel(), "TimeLostperCategory");//Model having disruptionKPI category detail
		core.setModel(new sap.ui.model.json.JSONModel(), "TimeLostperReason");
		core.setModel(new sap.ui.model.json.JSONModel(), "TimeLostperOperation");
		core.setModel(new sap.ui.model.json.JSONModel(), "TimeLostperMSN");
		core.setModel(new sap.ui.model.resource.ResourceModel({bundleName:"airbus.mes.disruptiontracker.kpi.i18n.i18n",bundleLocale:"en"}), 
														 "i18n");


		var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "local";
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
					bundleUrl : "../components/disruptiontracker/kpi/config/url_config.properties",
					bundleLocale : dest
				});
		
//		this.loadDisruptionCustomData();
		this.loadDisruptionCategoryModel();
		this.loadDisruptionReasonModel();
		this.loadDisruptionOperationModel();
		this.loadDisruptionmsnModel();
	},
	
	getKPICategoryData : function() {
		var urlCategoryData = this.urlModel.getProperty("getDiruptionKPIcategoryURL");
		urlCategoryData = airbus.mes.shell.ModelManager.replaceURI(urlCategoryData,
				"$site", airbus.mes.settings.ModelManager.site);
		return urlCategoryData;
	},
	
	loadDisruptionCategoryModel : function() {
		var oViewModel = sap.ui.getCore().getModel("TimeLostperCategory");
		oViewModel.loadData(this.getKPICategoryData(), null, false);
	},
	
	loadDisruptionReasonModel : function() {
		var oViewModel = sap.ui.getCore().getModel("TimeLostperReason");
		oViewModel.loadData(this.urlModel.getProperty("urlreasonmodel"), null, false);

	},
	
	loadDisruptionOperationModel : function() {
		var oViewModel = sap.ui.getCore().getModel("TimeLostperOperation");
		oViewModel.loadData(this.urlModel.getProperty("urloperationmodel"), null, false);

	},
	
	loadDisruptionmsnModel : function() {
		var oViewModel = sap.ui.getCore().getModel("TimeLostperMSN");
		oViewModel.loadData(this.urlModel.getProperty("urlmsnmodel"), null, false);

	}

		
}

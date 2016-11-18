//"use strict";
jQuery.sap.declare("airbus.mes.disruptiontracker.kpi.ModelManager")
airbus.mes.disruptiontracker.kpi.ModelManager = {
	urlModel : undefined,
	queryParams : jQuery.sap.getUriParameters(),
	
	sStaion: "",

	init : function(core) {
		core.setModel(new sap.ui.model.json.JSONModel(), "TimeLostperAttribute");
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
	},
	
	
	getKPIData : function() {
		var urlCategoryData = this.urlModel.getProperty("getDisruptionKPIURL");
		urlCategoryData = airbus.mes.shell.ModelManager.replaceURI(urlCategoryData,
				"$site", airbus.mes.settings.ModelManager.site);
		urlCategoryData = airbus.mes.shell.ModelManager.replaceURI(urlCategoryData,
				"$station", this.sStation);
		
		return urlCategoryData;
	},
	
	loadDisruptionKPIModel : function() {
		var oViewModel = sap.ui.getCore().getModel("TimeLostperAttribute");
		oViewModel.loadData(this.getKPIData(), null, false);
		
	}
	

		
}

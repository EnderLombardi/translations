//"use strict";
jQuery.sap.declare("airbus.mes.disruptions.ModelManager")
airbus.mes.disruptions.ModelManager = {
	urlModel : undefined,
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {
		
		core.setModel(new sap.ui.model.json.JSONModel(), "DisruptionDetail");//Model having disruptions detail
		/*core.setModel(new sap.ui.model.resource.ResourceModel({bundleName:"airbus.mes.disruptions.i18n.i18n",bundleLocale:"en"}), 
														 "disruptionsI18n");*/


		var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "local";
			break;
		default:
			dest = "local";
			break;
		}
		
		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "../components/disruptions/config/url_config.properties",
			bundleLocale : dest
		});
	},
	
	loadDisruptionsByOperation: function(operation) {
		var oViewModel = sap.ui.getCore().getModel("DisruptionDetail");
		
		var getDiruptionsURL = this.urlModel.getProperty("getDiruptionsURL");
		
		getDiruptionsURL = getDiruptionsURL.replace('$Site', airbus.mes.settings.ModelManager.site);
		getDiruptionsURL = getDiruptionsURL.replace('$Operation', operation);
		
		oViewModel.loadData(this.urlModel.getProperty("getDiruptionsURL"), null, false);
	}
	
}

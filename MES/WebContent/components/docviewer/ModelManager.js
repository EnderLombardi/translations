"use strict";

jQuery.sap.declare("airbus.mes.disruptions.ModelManager")

airbus.mes.docviewer.ModelManager = {

	onCloseFunction : undefined,

	init : function(core) {

		this.core = core;

		core.setModel(new sap.ui.model.json.JSONModel(), "documentsModel");

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

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "../components/docviewer/config/url_config.properties",
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

	}
};

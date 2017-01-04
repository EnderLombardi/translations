"use strict";

jQuery.sap.declare("airbus.mes.docviewer.ModelManager")

airbus.mes.docviewer.ModelManager = {
	
	oViewerElement: undefined,
	sViewerElementId: undefined,
	
	WebViewer: undefined,

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

	},
	
	
	openDocument: function(fileURL){
		// Firstly - Empty the container
		this.oViewerElement.removeAllItems()
		
		 // Initialize PDF Tron
        airbus.mes.docviewer.ModelManager.WebViewer = new PDFTron.WebViewer({
            type: "html5",
            path: "../lib/pdftron",
            initialDoc: fileURL,
            documentType: "pdf",
            config: "../components/docviewer/config.js",
            serverUrl: "http://localhost/",
            documentId: "webviewer_developer_guide",
            enableAnnotations: true,
            streaming: false,
            useDownloader: false
        }, this.sViewerElementId);
		
		
	}
};

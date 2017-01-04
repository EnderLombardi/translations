"use strict";

jQuery.sap.declare("airbus.mes.docviewer.ModelManager")

airbus.mes.docviewer.ModelManager = {
	
	oContainer: undefined,		// UI5 Object where PDF Tron is placed
	oViewerElement: undefined, // Object containing DOM element where PDF Tron is placed
	
	WebViewer: undefined,  // Object for PDF Tron Web Viewer

	onCloseFunction : undefined,
	
	/******** Variables for Data/ File Path ******/
	fileURL: undefined,
	/*********************************************/

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
	
	/********************************
	 * Open PDF via URL
	 */
	openDocumentByURL: function(){
		// Firstly - Empty the container
		airbus.mes.docviewer.ModelManager.oContainer.removeAllItems()
		
		 // Initialize PDF Tron
        airbus.mes.docviewer.ModelManager.WebViewer = new PDFTron.WebViewer({
            type: "html5",
            path: "../lib/pdftron",
            initialDoc: airbus.mes.docviewer.ModelManager.fileURL,
            documentType: "pdf",
            config: "../components/docviewer/config.js",
            serverUrl: "http://localhost/",
            documentId: "webviewer_developer_guide",
            enableAnnotations: true,
            streaming: false,
            useDownloader: false
        }, airbus.mes.docviewer.ModelManager.oViewerElement);
		
	}
};

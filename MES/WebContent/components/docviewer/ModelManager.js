"use strict";

jQuery.sap.declare("airbus.mes.docviewer.ModelManager")

airbus.mes.docviewer.ModelManager = {
	
	queryParams: jQuery.sap.getUriParameters(),
	
	WebViewer: undefined,  // Object for PDF Tron Web Viewer

	onCloseFunction : undefined, // Function to be called while closing the PDF Tron (Document Viewer)
	
	/******** Variables for Data/ File Path ******/
	//fileURL: undefined,
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
	openDocumentByURL: function(fileURL){
		
		var oViewerElement = document.getElementById("docviewerView--pdfViewer");
		
		// Firstly - Empty the container
		oViewerElement.innerHTML = ""
		
		 // Initialize PDF Tron
        airbus.mes.docviewer.ModelManager.WebViewer = new PDFTron.WebViewer({
            type: "html5",
            path: "../lib/pdftron",
            initialDoc: fileURL,
            documentType: "pdf",
            config: "../components/docviewer/config.js",
            serverUrl: "http://localhost/",
            documentId: "mes_document_viewer",
            custom: JSON.stringify({
            	'save' :  airbus.mes.docviewer.ModelManager.save,
            	'close': airbus.mes.docviewer.ModelManager.onCloseFunction}),
            enableAnnotations: true,
            streaming: false,
            useDownloader: false
        }, oViewerElement);
		
	},
	
	
	save: function(){
		// Create an AJAX request to the server, with the data being the command
		// string returned by AnnotationManager.getAnnotCommand()

		if (readerControl.serverUrl == null) {
			console.warn("Not configured for server-side annotation saving.");
			return;
		}
		var am = readerControl.docViewer.getAnnotationManager();
		var xfdfString = am.getAnnotCommand();
		$.ajax({
			type: 'POST',
		 	url: readerControl.serverUrl + '?did=' + readerControl.docId,
		 	data: xfdfString,
		 	success: function(data){
		 		//Annotations were successfully uploaded to server
		 	},
		 	error: function(jqXHR, textStatus, errorThrown) {
		 		console.warn("Failed to send annotations to server. " + textStatus);
		 	},
		 	dataType: 'xml'
		});
	 },
};

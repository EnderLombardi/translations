"use strict";

jQuery.sap.declare("airbus.mes.docviewer.ModelManager")

airbus.mes.docviewer.ModelManager = {
	
	WebViewer: undefined,  // Object for PDF Tron Web Viewer

	onCloseFunction : undefined, // Function to be called while closing the PDF Tron (Document Viewer)
	
	/******** Variables for Data/ File Path ******/
	//fileURL: undefined,
	/*********************************************/

	init : function(core) {

		this.core = core;

		core.setModel(new sap.ui.model.json.JSONModel(), "documentsModel");

		// Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.docviewer.config.url_config");
		
	},
	
	/********************************
	 * Open PDF via URL
	 */
	openDocumentByURL: function(fileURL){
		
		var oViewerElement = document.getElementById("docviewerView--pdfViewer");
		
		// Firstly - Empty the container
		oViewerElement.innerHTML = ""

		var urlSplit = fileURL.split(".");
		var ext      = urlSplit[(urlSplit.length - 1)];
		
		// Initialize PDF Tron
        airbus.mes.docviewer.ModelManager.WebViewer = new PDFTron.WebViewer({
            type: "html5",
            path: "../lib/pdftron",
            initialDoc: fileURL,
            documentType: ext,
            config: "../components/docviewer/config.js",
            serverUrl: window.location.host,
            documentId: "mes_document_viewer",
            mobileRedirect: false,
            /*custom: JSON.stringify({
            	'save' :  airbus.mes.docviewer.ModelManager.save,
            	'close': airbus.mes.docviewer.ModelManager.onCloseFunction}),*/
            enableAnnotations: function(){
    	    	if(sap.ui.getCore().getModel("Profile").oData.connectedUser.permissions.WORK_DIS_ANNOTATE_DOC === true ){
            	return true;
            	} else { 
            	return false;
           	} 
            },

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
	 }
};

/**
 * @fileOverview Define the pdftron controller.
 * @version 1.0.0
 */
"use strict";
sap.ui.controller("airbus.mes.pdftron.pdftron", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf components.globalnav.globalNavigation
	 */
	 //onInit : function() {
	 //},


	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's
	 * View is re-rendered (NOT before the first rendering! onInit() is used for
	 * that one!).
	 * 
	 * @memberOf components.globalnav.globalNavigation
	 */
	// onBeforeRendering: function() {
	// },
	
	/**
	 * Called when the View has been rendered (so its HTML is part of the document).
	 * Post-rendering manipulations of the HTML could be done here. This hook is the
	 * same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf components.globalnav.globalNavigation
	 */
	 onAfterRendering : function() {
		var viewId = this.getView().sId;
		var viewerElement = document.getElementById(viewId+'pdfViewer');
        var myWebViewer = new PDFTron.WebViewer({
            type: "html5",
            path: "../lib/pdftron",
            //initialDoc: "../pdf/text.txt",
            documentType: "pdf",
            config: "../components/pdftron/config.js",
            serverUrl: "http://localhost/",
            documentId: "webviewer_developer_guide",
            enableAnnotations: true,
            streaming: false,
            useDownloader: false
        }, viewerElement);
	 },
	
	 
	 savePdf: function(){
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
	 
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and
	 * finalize activities.
	 * 
	 * @memberOf components.globalnav.globalNavigation
	 */
	// onExit: function() {
	// }
});

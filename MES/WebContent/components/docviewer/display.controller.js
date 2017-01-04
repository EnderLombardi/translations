/**
 * @fileOverview Define the docviewer controller.
 * @version 1.0.0
 */
"use strict";
sap.ui.controller("airbus.mes.docviewer.display", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf components.docviewer.display
	 */
	 //onInit : function() {
	 //},


	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's
	 * View is re-rendered (NOT before the first rendering! onInit() is used for
	 * that one!).
	 * 
	 * @memberOf components.docviewer.display
	 */
	// onBeforeRendering: function() {
	// },
	
	/**
	 * Called when the View has been rendered (so its HTML is part of the document).
	 * Post-rendering manipulations of the HTML could be done here. This hook is the
	 * same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf components.docviewer.display
	 */
	 onAfterRendering : function() {
		
    	// Set the Viewer Element in Model Manager   	
		 airbus.mes.docviewer.ModelManager.oContainer = this.getView().byId('pdfViewer');
		
		// Get ID of the HBox where PDFTron will be placed
    	airbus.mes.docviewer.ModelManager.oViewerElement = 
    		document.getElementById(airbus.mes.docviewer.ModelManager.oContainer.sId);
    	

    	// Finally open the document viewer with the document URL
    	airbus.mes.docviewer.ModelManager.openDocumentByURL();
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
	 * @memberOf components.docviewer.display
	 */
	// onExit: function() {
	// }
});

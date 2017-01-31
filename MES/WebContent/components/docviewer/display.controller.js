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
	 //onAfterRendering : function() {
	 //
	 //},
	 
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and
	 * finalize activities.
	 * 
	 * @memberOf components.docviewer.display
	 */
	// onExit: function() {
	// }
	
	/********************
	 * Close PDF Viewer
	 */
	onCloseDocument: function(){
		
		// Call closing function, if any required
		if(airbus.mes.docviewer.ModelManager.onCloseFunction != undefined && airbus.mes.docviewer.ModelManager.onCloseFunction != "")
			airbus.mes.docviewer.ModelManager.onCloseFunction();
		
		// Go Back
		nav.back();
		
	},
	
	
	/**********************
	 * Hide annotations
	 */
	hideAnnotations: function(){
		
		// Get Annotation Manager
		var annotManager = window.readerControl.annotationManager;
		
		// Get Annotations
		var annotations = annotManager.getAnnotationsList();
		 
        // hide annotations
		annotManager.hideAnnotations(annotations);
        
        this.getView().byId("hideAnnotationsButton").setVisible(false);
        this.getView().byId("showAnnotationsButton").setVisible(true);
		
	},
	
	
	/**********************
	 * Show annotations
	 */
	showAnnotations: function(){
		
		// Get Annotation Manager
		var annotManager = window.readerControl.annotationManager;
		
		// Get Annotations
		var annotations = annotManager.getAnnotationsList();
		 
        // Hide annotations
		annotManager.showAnnotations(annotations);
        
        this.getView().byId("hideAnnotationsButton").setVisible(true);
        this.getView().byId("showAnnotationsButton").setVisible(false);
		
	}
	
});

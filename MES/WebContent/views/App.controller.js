sap.ui.controller("airbus.mes.views.App", {

	onInit : function() {

		// in order to see the debug info in the console, the log level needs to
		// be explicitly
		// set to INFO here.
		// But for application development, the log level doesn't need to be set
		// again in the code.
		jQuery.sap.log.setLevel(jQuery.sap.log.Level.INFO);

		var oRouter = this.getOwnerComponent().getRouter();

		oRouter.attachBypassed(function(oEvent) {
			var sHash = oEvent.getParameter("hash");
			// do something here, i.e. send logging data to the backend for
			// analysis
			// telling what resource the user tried to access...
			jQuery.sap.log.info("Sorry, but the hash '" + sHash
					+ "' is invalid.", "The resource was not found.");
		});

	}
});

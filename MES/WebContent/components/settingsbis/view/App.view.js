sap.ui.jsview("airbus.mes.settings.view.App", {

	getControllerName: function () {
		return "airbus.mes.settings.view.App";
	},
	
	createContent: function (oController) {
		
		// to avoid scroll bars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		
		// create app
		this.app = new sap.m.App();
		
		// load the master page
		var master = sap.ui.xmlview("Master", "airbus.mes.settings.view.Master");
		master.getController().nav = this.getController();
		this.app.addPage(master, false);
	
		// load the detail page
//		var detail = sap.ui.xmlview("Detail", "sopra.ui.xxxx.view.Detail");
//		detail.getController().nav = this.getController();
//		this.app.addPage(detail, false);
		
		
		// done
		return this.app;
	}
});
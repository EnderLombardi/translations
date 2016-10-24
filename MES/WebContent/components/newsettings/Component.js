jQuery.sap.require("sap.ui.core.UIComponent"), jQuery.sap.declare("sopra.ui.xxxx.Component");

// Pointing out metadata manifest to the application
sap.ui.core.UIComponent.extend("sopra.ui.xxxx.Component", {
    metadata : {
	manifest : "json"
    },

    init : function() {

	// call the init function of the parent
	sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

	var oModel1 = new sap.ui.model.json.JSONModel();

	oModel1.loadData(this.getMetadata().getManifestEntry("sap.app").dataSources["dataMock_program"].uri, null,false);
	
	this.setModel(oModel1, "program");
	
	var oModel2 = new sap.ui.model.json.JSONModel();
	
	oModel2.loadData(this.getMetadata().getManifestEntry("sap.app").dataSources["dataMock_site"].uri, null,false);
	
	this.setModel(oModel2, "site");
	
	var oModel3 = new sap.ui.model.json.JSONModel();
	
	oModel3.loadData(this.getMetadata().getManifestEntry("sap.app").dataSources["dataMock_region"].uri, null,false);
	
	this.setModel(oModel3, "region");	
	
    },

});
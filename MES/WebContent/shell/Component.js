jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.model.resource.ResourceModel");
jQuery.sap.require("airbus.mes.shell.ModelManager");
jQuery.sap.require("airbus.mes.shell.util.Formatter");
jQuery.sap.require("airbus.mes.shell.util.navFunctions");
jQuery.sap.require("airbus.mes.shell.ModelManager");
jQuery.sap.require("airbus.mes.shell.RoleManager");

jQuery.sap.declare("airbus.mes.shell.Component");

sap.ui.core.UIComponent.extend("airbus.mes.shell.Component", {

	
	metadata : {
//		manifest: "json",
		properties : {},
		includes : [ "css/shell.css" ] //array of css and/or javascript files that should be used in the component  

	},

	oView:undefined,
});

airbus.mes.shell.Component.prototype.createContent = function() {
	
	//	View on XML
	if (airbus.mes.shell.oView === undefined) {

		// Initialize ModelManager and load needed file
		airbus.mes.shell.ModelManager.init(sap.ui.getCore());
		
		// Initialize Role Manager
		airbus.mes.shell.RoleManager.init(sap.ui.getCore());
		
				
		this.oView = sap.ui.view({
			id : "globalNavView",
			viewName : "airbus.mes.shell.globalNavigation",
			type : "XML",
			height:"100%"
			
		}).addStyleClass("absolutePosition");

		airbus.mes.shell.oView = this.oView;
		
		this.oView.setModel(sap.ui.getCore().getModel("userDetailModel"),	"userDetailModel");
		this.oView.setModel(sap.ui.getCore().getModel("ShellI18n"), "ShellI18n");
		this.oView.setModel(sap.ui.getCore().getModel("userSettingModel"),	"userSettingModel");
		
//		Retrieve the language selector to define default language corresponding to sap-language parameter
		var aItems = this.oView.byId("SelectLanguage").getItems();
		
//		Retrieve connexion language
		var sLanguage = jQuery.sap.getUriParameters().get("sap-language"); 
		
		switch(sLanguage) {
		case "EN":
			var sLanguageText = "English";
			break;
		case "DE":
			var sLanguageText = "Deutsch";
			break;
		case "FR":
			var sLanguageText = "French";
			break;
		case "SP":
			var sLanguageText = "Spanish";
			break;
		default :
			var sLanguageText = "English";
			break;
		};
		
	    for(var i=0; i<aItems.length; i++) {
	        if (aItems[i].getText() === sLanguageText) {
	        	this.oView.byId("SelectLanguage").setSelectedItemId(aItems[i].getId());
	        }
	    }
		
		
		return this.oView;
	}

};


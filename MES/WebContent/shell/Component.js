jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.model.resource.ResourceModel");
jQuery.sap.require("airbus.mes.shell.util.Formatter");



//jQuery.sap.registerModulePath("airbus.mes.settings","/MES/components/settings");

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
//		var oUserSettingModel = new sap.ui.model.json.JSONModel();
		
		this.oView = sap.ui.view({
			id : "globalNavView",
			viewName : "airbus.mes.shell.globalNavigation",
			type : "XML",
			height:"100%"
			
		}).addStyleClass("absolutePosition");

		airbus.mes.shell.oView = this.oView;
//		this
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(),"userSettingModel");	
//		this 
		sap.ui.getCore().getModel("userSettingModel").loadData("https://dmiswde0.eu.airbus.corp/XMII/Illuminator?QueryTemplate=XX_MOD1684_MES%2FMII%2FStationTracker%2FuserDetail%2F015_Get_User_Detail_QUE&IsTesting=T&Content-Type=text%2Fjson&j_user=ng56d2a&j_password=Fonate36*",null,false);

		
		// create the views based on the url/hash
//		this.getRouter().initialize();		
		
		var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl : "./i18n/i18n.properties",
//            bundleLocale : "en" automatic defined by parameter sap-language
         });
		
		this.oView.setModel(i18nModel, "i18n");
		
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


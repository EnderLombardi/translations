jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.registerModulePath("airbus.mes.settings","/MES/components/settings");

jQuery.sap.declare("airbus.mes.shell.Component");

sap.ui.core.UIComponent.extend("airbus.mes.shell.Component", {
	
	metadata : {
		properties : {},
		includes : [ "css/shell.css" ] //array of css and/or javascript files that should be used in the component  

	},
	//manifestUrl : "component.json",
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
			
		}).addStyleClass("absoultePosition");

		airbus.mes.shell.oView = this.oView;
//		this
		sap.ui.getCore()
		.setModel(new sap.ui.model.json.JSONModel(),"userDetailModel");	
//		this 
		sap.ui.getCore()
		.getModel("userDetailModel").loadData("https://dmiswde0.eu.airbus.corp/XMII/Illuminator?QueryTemplate=XX_MOD1684_MES%2FMII%2FStationTracker%2FuserDetail%2F015_Get_User_Detail_QUE&IsTesting=T&Content-Type=text%2Fjson&j_user=ng56d2a&j_password=Fonate36*",null,false);

		return this.oView;
	}

};


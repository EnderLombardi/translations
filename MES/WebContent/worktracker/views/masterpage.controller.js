sap.ui.controller("airbus.mes.worktracker.views.masterpage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
*/
	
	
	
	onInit: function() {
		// Localization model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/i18n.properties",
			bundleLocale : sap.ui.getCore().getConfiguration().getLanguage()
		});
		sap.ui.getCore().setModel(i18nModel, "i18n");
		
		// Model for Header bar
		sap.ui.getCore()
		.setModel(new sap.ui.model.json.JSONModel(),"userDetailModel");	
		sap.ui.getCore()
		.getModel("userDetailModel").loadData("https://dmiswde0.eu.airbus.corp/XMII/Illuminator?QueryTemplate=XX_MOD1684_MES%2FMII%2FStationTracker%2FuserDetail%2F015_Get_User_Detail_QUE&IsTesting=T&Content-Type=text%2Fjson&j_user=ng34ed3&j_password=Malice0*",null,false);

	},
	onPress:function(oEvt){
	
	},
	onUserIconPress:function(oEvent){
		if (!this.oDialog){
			this.oDialog = sap.ui.xmlfragment("airbus.mes.worktracker.fragments.userDetail", this);
			this.getView().addDependent(this.oDialog);	
		}
		this.oDialog.setModel(this.getView().getModel("userDetailModels"));
		
		this.oDialog.openBy(oEvent.getSource());
	},

	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
*/
	onAfterRendering: function() {
		this.getView().byId("user_id").setModel(sap.ui.getCore().getModel("userDetailModel"),"userDetailModel");
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf components.globalnav.globalNavigation
*/
//	onExit: function() {
//
//	}
	
	
	goToHome : function() {
		location.href="../../shell";
	},
	
	openSettings: function(){
		//location.href="#settings";
	}
});

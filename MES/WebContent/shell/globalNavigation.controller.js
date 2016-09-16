sap.ui.controller("airbus.mes.shell.globalNavigation", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf components.globalnav.globalNavigation
*/
	
	
	
	onInit: function() {
//		oCompCont.component.setModel(new sap.ui.model.json.JSONModel(),"userDetailModel");
//		this.loadUserDetailsModel();
		

	},
	onPress:function(oEvt){
	
	},
	onBack : function(){
		  jQuery.sap.registerModulePath("airbus.mes.settings","/MES/components/settings");
		    
		    if (airbus.mes.settings != undefined) {
		    	nav.to(airbus.mes.settings.oView.getId());
			}
		    else {
		    	sap.ui.getCore().createComponent({
				name : "airbus.mes.settings", // root component folder is resources
			});
		    	
			nav.addPage(airbus.mes.settings.oView);
			nav.to(airbus.mes.settings.oView.getId()); }
		
	},
//	getUrlUserDetail:function(){
//		//var urlUserDetail = this.urlModel.getProperty("urlgetuserdetail");
//		return "https://dmiswde0.eu.airbus.corp/XMII/Illuminator?QueryTemplate=XX_MOD1684_MES%2FMII%2FStationTracker%2FuserDetail%2F015_Get_User_Detail_QUE&IsTesting=T&Content-Type=text%2Fjson&j_user=ng56d2a&j_password=Fonate36*";
//		
//	},
//	loadUserDetailsModel:function(){
//		
////		var oUserSettingModel = oCompCont.component.getModel("userDetailModel");
//////		oCompCont.component.setModel(new sap.ui.model.json.JSONModel(),"userDetailModel");
////		oUserSettingModel.loadData(this.getUrlUserDetail(),null,false);
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf components.globalnav.globalNavigation
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf components.globalnav.globalNavigation
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
	naviguate : function(){
		
	    jQuery.sap.registerModulePath("airbus.mes.settings","/MES/components/settings");
	    jQuery.sap.registerModulePath("airbus.mes.stationtracker","/MES/components/stationtracker");

	    if (airbus.mes.settings != undefined) {
	    	nav.to(airbus.mes.settings.oView.getId());
		}
	    else {
	    	sap.ui.getCore().createComponent({
			name : "airbus.mes.settings", // root component folder is resources
		});
	    	
		nav.addPage(airbus.mes.settings.oView);
		nav.to(airbus.mes.settings.oView.getId()); }
	},
	
	goToHome : function(){
		//jQuery.sap.registerModulePath("airbus.mes.homepage","/MES/components/settings");
	    //jQuery.sap.registerModulePath("airbus.mes.stationtracker","/MES/components/stationtracker");

	    if (airbus.mes.homepage != undefined) {
	    	nav.to(airbus.mes.homepage.oView.getId());
		}
	    else {
	    	sap.ui.getCore().createComponent({
			name : "airbus.mes.homepage", // root component folder is resources
		});
	    	
		nav.addPage(airbus.mes.homepage.oView);
		nav.to(airbus.mes.homepage.oView.getId());
	    }
	}
});

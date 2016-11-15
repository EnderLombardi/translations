sap.ui.controller("airbus.mes.login.login", {
	
	onConfirm : function(oEvent) {
		airbus.mes.login.user = oEvent.getSource().getParent().getAggregation("content")[1].getValue();
		airbus.mes.login.pass = oEvent.getSource().getParent().getAggregation("content")[3].getValue() ;

		oComp1 = sap.ui.getCore().createComponent({
			name : "airbus.mes.homepage", // root component folder is resources
		});
		
	 	airbus.mes.component = airbus.mes.component || {};
		
		airbus.mes.component.settings = sap.ui.getCore().createComponent({
			name : "airbus.mes.settings", // root component folder is resources
		});
	
		
	
		
		nav = airbus.mes.shell.oView.byId("navCont");
		nav.addPage(airbus.mes.homepage.oView);
		nav.to(airbus.mes.homepage.oView.getId());	
		
		


	
		
		airbus.mes.settings.ModelManager.loadUserSettingsModel();
		airbus.mes.settings.ModelManager.checkDisplayFirstSetting();
	
	
	}
});
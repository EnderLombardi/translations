jQuery.sap.declare("airbus.mes.settings.GlobalFunction")
airbus.mes.settings.GlobalFunction = {
	
	bOpen : undefined,
	bInitial : false,
	CpPress : false,
	
	navigateTo : function(sButtonText,sButtonAction) {
			
		if(airbus.mes.component.settings === undefined) {
			airbus.mes.component.settings = sap.ui.getCore().createComponent({
					name : "airbus.mes.settings", // root component folder is resources
					settings : {
						textButtonTo : sButtonText,
						buttonAction : sButtonAction
					}	
				});	  
			
		} else {	
			airbus.mes.component.settings.setTextButtonTo(sButtonText);
			airbus.mes.component.settings.setButtonAction(sButtonAction);
		};
		
		nav.addPage(airbus.mes.component.settings.oView);
		nav.to(airbus.mes.component.settings.oView.getId());	
		
	},
	
}
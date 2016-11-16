sap.ui.controller("airbus.mes.login.login", {
	
	onAfterRendering : function() {
		
	if ( Cookies.getJSON("login") != undefined ) {
		
		airbus.mes.login.oView.byId("user").setValue(Cookies.getJSON("login").user);
		airbus.mes.login.oView.byId("mdp").setValue(Cookies.getJSON("login").mdp);
	}
		
	},
	
	onConfirm : function(oEvent) {
		
		var sUser = oEvent.getSource().getParent().getAggregation("content")[1].getValue();
		var sPass= oEvent.getSource().getParent().getAggregation("content")[3].getValue() ;

		Cookies.set("login",{user:sUser,mdp:sPass}, { expires: 50 });
		
		window.location.href =  window.location.origin + window.location.pathname + "?url_config=sopra"
	},

	logLocal : function() {
		 
		window.location.href = window.location.origin + window.location.pathname + "?url_config=local"
			
	}
});
sap.ui.controller("airbus.mes.login.login", {
	
	onAfterRendering : function() {
		
	if ( Cookies.getJSON("login") != undefined ) {
		
		airbus.mes.login.oView.byId("user").setValue(Cookies.getJSON("login").user);
		airbus.mes.login.oView.byId("mdp").setValue(Cookies.getJSON("login").mdp);
	}
		
	},
	
	onConfirm : function(oEvent) {
		
		var sUser = airbus.mes.login.oView.byId("login").getValue();
		var sPass= airbus.mes.login.oView.byId("password").getValue();
		var sUrl = "https://dmiswde0.eu.airbus.corp/XMII/Illuminator?QueryTemplate=XX_MOD1684_MES%2FMII%2FStationTracker%2FUserSettings%2F040_Get_User_Setting_QUE&IsTesting=T&Content-Type=text%2Fjson&j_user=" + sUser +"&j_password=" + sPass 
		
		
		jQuery.ajax({
			url : sUrl,
			error : function(xhr, status, error) {
				
				alert("WRONG PASSWORD USER NAME §§§§§§§§§§");
				
			},
			success : function(result, status, xhr) {
				
				if ( result.Rowsets != undefined ) {
					
					Cookies.set("login",{user:sUser,mdp:sPass}, { expires: 50 });
					window.location.href =  window.location.origin + window.location.pathname + "?url_config=sopra"
							
				} 
				
				if ( result.search("unexpected problem has occurred") > 0 ) {
				
					alert("WRONG PASSWORD USER NAME §§§§§§§§§§");
					
				} else {
					
				Cookies.set("login",{user:sUser,mdp:sPass}, { expires: 50 });
				window.location.href =  window.location.origin + window.location.pathname + "?url_config=sopra"
				
				}
			
			} 
						
		});
		
	},

	logLocal : function() {
		 
		window.location.href = window.location.origin + window.location.pathname + "?url_config=local"
			
	}
});
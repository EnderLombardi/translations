//"use strict";
jQuery.sap.declare("airbus.mes.shell.RoleManager")
airbus.mes.shell.RoleManager = {

	init : function(core) {
		airbus.mes.shell.RoleManager.parseProfile();
	},

	userProfile : {},
    queryParams : jQuery.sap.getUriParameters(),

	// check if the current user has the right role to execute the action define
	// in ROLES array
	isAllowed : function(role) {
		var dest = "";
		switch (window.location.hostname) {
		case "localhost":
			dest = "local";
			break;
		default:
			dest = "airbus";
			break;
		}
		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}
		if(dest == "local")
			return true;
		
		return airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles.some(function(el) {
			return airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles.indexOf(role) >= 0;

		});
	},

	// Set all information about current user log in userProfile variable
	parseProfile : function() {
		var profile = airbus.mes.shell.ModelManager.getRoles().Rowsets.Rowset[0].Row;
		for (var i = 0; i < profile.length; i++) {
			airbus.mes.shell.RoleManager.userProfile[profile[i].Name] = profile[i].Value;
		}

		airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles = airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles
				.replace(/'/g, "").split(",");

	},

};

"use strict";
jQuery.sap.declare("airbus.mes.shell.RoleManager")
airbus.mes.shell.RoleManager = {

	init : function(core) {
		airbus.mes.shell.RoleManager.parseProfile();
	},

	userProfile : {},
	userRoles : [],
	flag : [],
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
		if (dest == "local")
			return true;

		var UserRoles = airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles;
		var FeatureRole = role;
		// var FeatureRole = $.map(role, function(value, index) {
		// return [ value ];
		// });
		var Feature;

		for (var i = 0; i < FeatureRole.length; i++) {
			Feature = FeatureRole[i];
			if (UserRoles.indexOf(Feature) >= 0) {
				airbus.mes.shell.RoleManager.flag[i] = "true";
			} else {
				airbus.mes.shell.RoleManager.flag[i] = "false";
			}
		}

		if (airbus.mes.shell.RoleManager.flag.indexOf("true") >= 0) {
			var oModel = sap.ui.getCore().getModel("FeatureRoleModel");
			var sAuth = oModel.oData.Rowsets.Rowset[0].Row[i-1];
			if (sAuth === 'X')
				{
				//login popup
				}
			else {
				return true;
			}
					
		} else {
			return false;
		}

		// return
		// airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles.some(function(el)
		// {
		// return
		// airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles.indexOf(role)
		// >= 0;
		//
		// });
	},

	// Set all information about current user log in userProfile variable
	parseProfile : function() {
		var profile = airbus.mes.shell.ModelManager.getRoles().Rowsets.Rowset[0].Row;
		for (var i = 0; i < profile.length; i++) {
			airbus.mes.shell.RoleManager.userProfile[profile[i].Name] = profile[i].Value;
		}

		airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles = airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles.replace(/'/g, "").split(",");

	},
	// getting all the Roles based on the feature
	parseRoleValue : function() {
		var sRoles = airbus.mes.shell.ModelManager.getRolesForFeature().Rowsets.Rowset[0].Row;

		for (var i = 0; i < sRoles.length; i++) {
			// airbus.mes.shell.RoleManager.userRoles[0] =
			// airbus.mes.shell.RoleManager.userRoles[0]
			// +"'"+sRoles[i].Roles+"',";
			airbus.mes.shell.RoleManager.userRoles[i] = sRoles[i].Roles;
		}
		// var sRole = airbus.mes.shell.RoleManager.userRoles[0];
		// var Role = sRole.split("undefined")[1];
		// var iLength = Role.length;
		// var arr = [Role.substring(0,iLength-1)];

		return airbus.mes.shell.RoleManager.userRoles;
	}

};

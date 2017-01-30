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
	isAllowed : function(role,oCheck) {
//		var dest = "";
//		switch (window.location.hostname) {
//		case "localhost":
//			dest = "local";
//			break;
//		default:
//			dest = "airbus";
//			break;
//		}
//		if (this.queryParams.get("url_config")) {
//			dest = this.queryParams.get("url_config");
//		}
//		if (dest == "local")
//			return true;

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
			if (oCheck === 'A'){
				var oModel = sap.ui.getCore().getModel("FeatureRoleModel");
				var sAuth = oModel.oData.Rowsets.Rowset[0].Row[i-1].Authenticate;
			if (sAuth === 'X')
				{
				//login popup
                if (!this.myProfileDailog) {
                    this.myProfileDailog = sap.ui.xmlfragment("airbus.mes.shell.myProfile", this);
//                    sap.ui.getCore().addDependent(this._myProfileDialog);
                }

                this.myProfileDailog.open();
                sap.ui.getCore().getElementById("msgstrpMyProfile").setVisible(false);
                sap.ui.getCore().byId("uIdMyProfile").setValue("");
                sap.ui.getCore().byId("badgeIdMyProfile").setValue("");
                sap.ui.getCore().byId("userNameMyProfile").setValue("");
                sap.ui.getCore().byId("passwordMyProfile").setValue("");
                sap.ui.getCore().byId("pinCodeMyProfile").setValue("");
                return true;
				}
			else {
				return true;
			}
		}
			else if (oCheck === 'V'){
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
	parseRoleValue : function(sFeature) {
//		var sRoles = airbus.mes.shell.ModelManager.getRolesForFeature().Rowsets.Rowset[0].Row;
		var sRoles = sap.ui.getCore().getModel("AllRolesModel").oData.Rowsets.Rowset[0].Row;

		for (var i = 0; i < sRoles.length; i++) {
			if(sRoles[i].Feature === sFeature){
				airbus.mes.shell.RoleManager.userRoles[i] = sRoles[i].Roles;
			}
		}
		// Roles hardcoded for particular features so that everyone has access to every feature. Has to be removed.
		airbus.mes.shell.RoleManager.userRoles.push("SAP_XMII_User","Everyone");

		return airbus.mes.shell.RoleManager.userRoles;
	}

};

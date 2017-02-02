"use strict";
jQuery.sap.declare("airbus.mes.shell.RoleManager")
airbus.mes.shell.RoleManager = {

	init : function(core) {
		airbus.mes.shell.RoleManager.parseProfile();
	},

	userProfile : {},
	Profile : {},
	userRoles : [],
	featureName : [],
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
                	airbus.mes.shell.oView.oController.goToMyProfile();
                }

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
	},

	// Set all information about current user log in userProfile variable
	parseProfile : function() {
		var profile = airbus.mes.shell.ModelManager.getRoles().Rowsets.Rowset[0].Row;
		for (var i = 0; i < profile.length; i++) {
			airbus.mes.shell.RoleManager.userProfile[profile[i].Name] = profile[i].Value;
		}

		airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles = airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles.replace(/'/g, "").split(",");

	},
	getUnique : function(inputArray){
		var outputArray = [];
	    
	    for (var i = 0; i < inputArray.length; i++)
	    {
	        if ((jQuery.inArray(inputArray[i], outputArray)) == -1)
	        {
	            outputArray.push(inputArray[i]);
	        }
	    }
	   
	    return outputArray;
	},
	// getting all the Roles based on the feature
	parseRoleValue : function(sFeature) {
		var sRoles = sap.ui.getCore().getModel("AllRolesModel").oData.Rowsets.Rowset[0].Row;
		//temporary 'if' till this table doses not have data.// can be removed once table has data. does no harm anyway//vaibhav
		if(sRoles){
		for (var i = 0; i < sRoles.length; i++) {
			airbus.mes.shell.RoleManager.featureName[i] = sRoles[i].Feature;
			if(sRoles[i].Feature === sFeature){
				airbus.mes.shell.RoleManager.userRoles[i] = sRoles[i].Roles;
				
			}
		}
		}

		var aFeatureList = airbus.mes.shell.RoleManager.featureName;
		var aDistinctFeature = airbus.mes.shell.RoleManager.getUnique(aFeatureList);
		airbus.mes.shell.RoleManager.userProfile.permission = [];
		for(i=0;i<aDistinctFeature.length;i++){
			var abc = aDistinctFeature[i].valueOf().toString();
//			var abc= "aBC";
			var arr={};
			arr[abc] = "false";
			airbus.mes.shell.RoleManager.userProfile.permission.push(arr[abc]="false");
		}

		airbus.mes.shell.RoleManager.Profile = {connectedUser: airbus.mes.shell.RoleManager.userProfile ,identifiedUser: airbus.mes.shell.RoleManager.userProfile};
		
		// Roles hardcoded for particular features so that everyone has access to every feature. Has to be removed.
		airbus.mes.shell.RoleManager.userRoles.push("SAP_XMII_User","Everyone");
		return airbus.mes.shell.RoleManager.userRoles;
	}


};

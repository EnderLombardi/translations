"use strict";
jQuery.sap.declare("airbus.mes.shell.RoleManager")
airbus.mes.shell.RoleManager = {

	init : function(core) {
		// Load all the roles based on site
		airbus.mes.shell.ModelManager.getRolesForSite();
		airbus.mes.shell.RoleManager.parseProfile();
		
		airbus.mes.shell.RoleManager.parseRoleValue();
	},

	userProfile : {},
	Profile : {},
	features : [],
	positiveRoles : {},
	negativeRoles : {},
	funcRoles : [],
	techRoles : [],
	userFeatureRoles : [],
	usertechRoles : [],
	featureName : [],
	flag : [],
	queryParams : jQuery.sap.getUriParameters(),

	// check if the current user has the right role to execute the action define
	// in ROLES array
	isAllowed : function(feature) {
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
//		var iLength = airbus.mes.shell.RoleManager.Profile.connectedUser.permission.length;
//		for(var i = 0; i<iLength; i++){
//			if(airbus.mes.shell.RoleManager.Profile.connectedUser.permission[i][feature] === !undefined){
//				airbus.mes.shell.RoleManager.Profile.connectedUser.permission[i][feature] = airbus.mes.shell.RoleManager.Profile.connectedUser.IllumLoginRoles.containsOneOf(airbus.mes.shell.RoleManager.features.positiveRoles.funcRoles || airbus.mes.shell.RoleManager.features.positiveRoles.techRoles)& !(airbus.mes.shell.RoleManager.Profile.connectedUser.IllumLoginRoles.containsOneOf(airbus.mes.shell.RoleManager.features.negativeRoles.funcRoles || airbus.mes.shell.RoleManager.features.negativeRoles.techRoles) )
//; 
//			}
//		}
		
		
//		var UserRoles = airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles;
//		var FeatureRole = role;
//		var Feature;
//
//		for (var i = 0; i < FeatureRole.length; i++) {
//			Feature = FeatureRole[i];
//			if (UserRoles.indexOf(Feature) >= 0) {
//				airbus.mes.shell.RoleManager.flag[i] = "true";
//			} else {
//				airbus.mes.shell.RoleManager.flag[i] = "false";
//			}
//		}
//
//		if (airbus.mes.shell.RoleManager.flag.indexOf("true") >= 0) {
//			if (oCheck === 'A') {
//				var oModel = sap.ui.getCore().getModel("FeatureRoleModel");
//				var sAuth = oModel.oData.Rowsets.Rowset[0].Row[i - 1].Authenticate;
//				if (sAuth === 'X') {
//					//login pop up
//					if (!this.myProfileDailog) {
//						airbus.mes.shell.oView.oController.goToMyProfile();
//					}
//
//					return true;
//				} else {
//					return true;
//				}
//			} else if (oCheck === 'V') {
//				return true;
//			}
//			// set visible true
//			return true;
//		} else {
//			return false;
//		}
	},

	// Set all information about current user log in userProfile variable
	parseProfile : function() {
		var profile = airbus.mes.shell.ModelManager.getRoles().Rowsets.Rowset[0].Row;
		for (var i = 0; i < profile.length; i++) {
			airbus.mes.shell.RoleManager.userProfile[profile[i].Name] = profile[i].Value;
		}

		airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles = airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles.replace(/'/g, "").split(",");

		var sRoles = sap.ui.getCore().getModel("AllRolesModel").oData.Rowsets.Rowset[0].Row;
		if (sRoles) {
			for (var k = 0; k < sRoles.length; k++) {
				//Getting all the features from the model
				airbus.mes.shell.RoleManager.featureName[k] = sRoles[k].Feature;
			}
		}

		// Getting distinct Feature Name from the Model
		var aFeatureList = airbus.mes.shell.RoleManager.featureName;
		var aDistinctFeature = airbus.mes.shell.RoleManager.getUnique(aFeatureList);
		airbus.mes.shell.RoleManager.userProfile.permission = [];
		//Updating the Feature name in the user Profile
		for (var j = 0; j < aDistinctFeature.length; j++) {
			var abc = aDistinctFeature[j].valueOf().toString();
			var arr = {};
			arr[abc] = "false";
			airbus.mes.shell.RoleManager.userProfile.permission.push(arr);
		}
		//Setting the data for connected user and identified user
		airbus.mes.shell.RoleManager.Profile = {
			connectedUser : airbus.mes.shell.RoleManager.userProfile,
			identifiedUser : airbus.mes.shell.RoleManager.userProfile
		};

	},
	//Function to get unique records from an array
	getUnique : function(inputArray) {
		var outputArray = [];

		for (var i = 0; i < inputArray.length; i++) {
			if ((jQuery.inArray(inputArray[i], outputArray)) == -1) {
				outputArray.push(inputArray[i]);
			}
		}
		return outputArray;
	},

	// getting all the Roles based on the feature
	parseRoleValue : function(sFeature) {
		var sRoles = sap.ui.getCore().getModel("AllRolesModel").oData.Rowsets.Rowset[0].Row;
		//temporary 'if' till this table doses not have data.// can be removed once table has data. does no harm anyway//vaibhav
		if (sRoles) {
			for (var i = 0; i < sRoles.length; i++) {
//				if (sRoles[i].Feature === sFeature) {
					airbus.mes.shell.RoleManager.userFeatureRoles[i] = sRoles[i].Roles;
//				}
			}
		}
		
		var aRoles = sap.ui.getCore().getModel("FeatureRoleModel").oData.Rowsets.Rowset[0].Row;
		
		if(aRoles) {
			for (var p = 0; p < aRoles.length; p++) {
				airbus.mes.shell.RoleManager.usertechRoles[p] = aRoles[p].Roles;
			}
		}

		// Roles hard coded for particular features so that everyone has access to every feature. Has to be removed.
		airbus.mes.shell.RoleManager.userFeatureRoles.push("SAP_XMII_User", "Everyone");
		airbus.mes.shell.RoleManager.funcRoles.push(airbus.mes.shell.RoleManager.userFeatureRoles);
		airbus.mes.shell.RoleManager.techRoles.push(airbus.mes.shell.RoleManager.usertechRoles);
		
		airbus.mes.shell.RoleManager.positiveRoles = ({funcRoles:airbus.mes.shell.RoleManager.funcRoles, techRoles:airbus.mes.shell.RoleManager.techRoles});
		airbus.mes.shell.RoleManager.negativeRoles = ({funcRoles:airbus.mes.shell.RoleManager.funcRoles, techRoles:airbus.mes.shell.RoleManager.techRoles});
		var aFeatureList = airbus.mes.shell.RoleManager.featureName;
		var aDistinctFeature = airbus.mes.shell.RoleManager.getUnique(aFeatureList);
		
		
		for (var j = 0; j < aDistinctFeature.length; j++) {
			var abc = aDistinctFeature[j].valueOf().toString();
			var arr = {};
			arr[abc] = [{positiveRoles:airbus.mes.shell.RoleManager.positiveRoles,negativeRoles:airbus.mes.shell.RoleManager.negativeRoles}];
			airbus.mes.shell.RoleManager.features.push(arr);
		}
	}

};

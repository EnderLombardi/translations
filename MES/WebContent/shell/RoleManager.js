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
	aflag : [],
	queryParams : jQuery.sap.getUriParameters(),

	
	/**
	 * check if the current user has the right to access a particular feature
	 * 
	 * @param {String}
	 *            feature : Feature
	 * @returns {Boolean} aFlagVal : true or false
	 */
	isAllowed : function(feature) {
		// var dest = "";
		// switch (window.location.hostname) {
		// case "localhost":
		// dest = "local";
		// break;
		// default:
		// dest = "airbus";
		// break;
		// }
		// if (this.queryParams.get("url_config")) {
		// dest = this.queryParams.get("url_config");
		// }
		// if (dest == "local")
		// return true;
		
		var iLength = airbus.mes.shell.RoleManager.Profile.connectedUser.permission.length;
		for (var i = 0; i < iLength; i++) {
			//if condition would only run for the particular feature which is passed as an input parameter.
			if (airbus.mes.shell.RoleManager.features[i][feature]){
				//fetching the positive funcRoles and techRoles
			var aPositivefuncRoles = airbus.mes.shell.RoleManager.features[i][feature][0].positiveRoles.funcRoles[0];
			var aPositivetechRoles = airbus.mes.shell.RoleManager.features[i][feature][0].positiveRoles.techRoles[0];
				//fetching the negative funcRoles and techRoles
			var aNegativefuncRoles = airbus.mes.shell.RoleManager.features[i][feature][0].negativeRoles.funcRoles[0];
			var aNegativetechRoles = airbus.mes.shell.RoleManager.features[i][feature][0].negativeRoles.techRoles[0];
				//merging both positive & negative funcRoles and techRoles into one 
				//aPositiveRoles array and aNegativeRoles array
			var aPositiveRoles = aPositivefuncRoles.concat(aPositivetechRoles);
			var aNegativeRoles = aNegativefuncRoles.concat(aNegativetechRoles);
				//Roles based on the logged in user
			var aIllumLoginRoles = airbus.mes.shell.RoleManager.Profile.connectedUser.IllumLoginRoles;
				
				//checking if at least one of the array element from aPositiveRoles is present in aIllumLoginRoles
				//if it matches, true is stored in the array flag[]
				//if it doesn't matches, false is stored in the array flag[]
			for (var q = 0; q < aPositiveRoles.length; q++) {
				if (aIllumLoginRoles.indexOf(aPositiveRoles[q]) > -1) {
					airbus.mes.shell.RoleManager.flag[q] = "true"
				} else {
					airbus.mes.shell.RoleManager.flag[q] = "false"
				}
			}
				//checking if at least one of the array element from aNegativeRoles is present in aIllumLoginRoles
				//if it matches, true is stored in the array aflag[]
				//if it doesn't matches, false is stored in the array aflag[]
			for (var w = 0; w < aNegativeRoles.length; w++) {
				if (aIllumLoginRoles.indexOf(aNegativeRoles[w]) > -1) {
					airbus.mes.shell.RoleManager.aflag[w] = "true"
				} else {
					airbus.mes.shell.RoleManager.aflag[w] = "false"
				}
			}
			
			//checking if an element "true" exist in flag[] and aflag[]
			var iVal = (airbus.mes.shell.RoleManager.flag.indexOf("true") > 0) & !(airbus.mes.shell.RoleManager.aflag.indexOf("true") > 0);
			var bVal = "true"
			if (iVal === 1) {
				bVal = "true";
			} else if (iVal === 0) {
				bVal = "false"
			}
			//if bVal is true, then corresponding feature value is set to true, and vice versa.
			if (airbus.mes.shell.RoleManager.Profile.connectedUser.permission[i][feature] === "false"
				|| airbus.mes.shell.RoleManager.Profile.connectedUser.permission[i][feature] === "true") {
				airbus.mes.shell.RoleManager.Profile.connectedUser.permission[i][feature] = bVal;
			}
			
		}
		}
		
		//For a particular logged in user, the feature is checked, accordingly aFlagVal is returned.
		var iPermissionLength = airbus.mes.shell.RoleManager.Profile.connectedUser.permission.length;
		var aFlagVal;
		for (var n = 0; n < iPermissionLength; n++) {
			if (airbus.mes.shell.RoleManager.features[n][feature]){
		if(airbus.mes.shell.RoleManager.Profile.connectedUser.permission[n][feature] === "true")	{
			aFlagVal =  true;
		}else{
			aFlagVal = false;
			}
		
		}
		}
		return aFlagVal;
		
	},

	
	/**
	 * Set all information about current user log in userProfile variable
	 * 
	 */
	parseProfile : function() {
		var profile = airbus.mes.shell.ModelManager.getRoles().Rowsets.Rowset[0].Row;
		for (var i = 0; i < profile.length; i++) {
			airbus.mes.shell.RoleManager.userProfile[profile[i].Name] = profile[i].Value;
		}

		airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles = airbus.mes.shell.RoleManager.userProfile.IllumLoginRoles.replace(/'/g, "").split(",");

		var sRoles = sap.ui.getCore().getModel("AllRolesModel").oData.Rowsets.Rowset[0].Row;
		if (sRoles) {
			for (var k = 0; k < sRoles.length; k++) {
				// Getting all the features from the model
				airbus.mes.shell.RoleManager.featureName[k] = sRoles[k].Feature;
			}
		}

		// Getting distinct Feature Name from the Model
		var aFeatureList = airbus.mes.shell.RoleManager.featureName;
		var aDistinctFeature = airbus.mes.shell.RoleManager.getUnique(aFeatureList);
		airbus.mes.shell.RoleManager.userProfile.permission = [];
		// Updating the Feature name in the user Profile
		for (var j = 0; j < aDistinctFeature.length; j++) {
			var abc = aDistinctFeature[j].valueOf().toString();
			var arr = {};
			arr[abc] = "false";
			airbus.mes.shell.RoleManager.userProfile.permission.push(arr);
		}
		// Setting the data for connected user and identified user
		airbus.mes.shell.RoleManager.Profile = {
			connectedUser : airbus.mes.shell.RoleManager.userProfile,
			identifiedUser : airbus.mes.shell.RoleManager.userProfile
		};

	},
	/**
	 * function to get unique records from an array
	 * 
	 * @param {Array}
	 *            inputArray : array of duplicate features
	 * @returns {Array} outputArray : distinct features
	 */
	getUnique : function(inputArray) {
		var outputArray = [];

		for (var i = 0; i < inputArray.length; i++) {
			if ((jQuery.inArray(inputArray[i], outputArray)) == -1) {
				outputArray.push(inputArray[i]);
			}
		}
		return outputArray;
	},

	/**
	 * Distinct features with Positive Roles and Negative Roles are store in features array 
	 */
	parseRoleValue : function(sFeature) {
		var sRoles = sap.ui.getCore().getModel("AllRolesModel").oData.Rowsets.Rowset[0].Row;
		// temporary 'if' till this table doses not have data.// can be removed
		// once table has data. does no harm anyway//vaibhav
		if (sRoles) {
			for (var i = 0; i < sRoles.length; i++) {
				// if (sRoles[i].Feature === sFeature) {
				airbus.mes.shell.RoleManager.userFeatureRoles[i] = sRoles[i].Roles;
				// }
			}
		}

		var aRoles = sap.ui.getCore().getModel("FeatureRoleModel").oData.Rowsets.Rowset[0].Row;

		if (aRoles) {
			for (var p = 0; p < aRoles.length; p++) {
				airbus.mes.shell.RoleManager.usertechRoles[p] = aRoles[p].Roles;
			}
		}

		// Roles hard coded for particular features so that everyone has access
		// to every feature. Has to be removed.
		airbus.mes.shell.RoleManager.userFeatureRoles.push("SAP_XMII_User", "Everyone");
		airbus.mes.shell.RoleManager.funcRoles.push(airbus.mes.shell.RoleManager.userFeatureRoles);
		airbus.mes.shell.RoleManager.techRoles.push(airbus.mes.shell.RoleManager.usertechRoles);

		airbus.mes.shell.RoleManager.positiveRoles = ({
			funcRoles : airbus.mes.shell.RoleManager.funcRoles,
			techRoles : airbus.mes.shell.RoleManager.techRoles
		});
		airbus.mes.shell.RoleManager.negativeRoles = ({
			funcRoles : airbus.mes.shell.RoleManager.funcRoles,
			techRoles : airbus.mes.shell.RoleManager.techRoles
		});
		//All the feature are store in aFeatureList
		var aFeatureList = airbus.mes.shell.RoleManager.featureName;
		//All Distinct features are stored in aDistinctFeature
		var aDistinctFeature = airbus.mes.shell.RoleManager.getUnique(aFeatureList);
		
		//All Distinct features with their respective Positive Roles and Negative Roles are store in features array
		for (var j = 0; j < aDistinctFeature.length; j++) {
			var abc = aDistinctFeature[j].valueOf().toString();
			var arr = {};
			arr[abc] = [ {
				positiveRoles : airbus.mes.shell.RoleManager.positiveRoles,
				negativeRoles : airbus.mes.shell.RoleManager.negativeRoles
			} ];
			airbus.mes.shell.RoleManager.features.push(arr);
		}
	}

};

"use strict";
jQuery.sap.declare("airbus.mes.shell.RoleManager")
airbus.mes.shell.RoleManager = {
	
	profile: {
		connectedUser: {},
		identifiedUser: {}
	},

	features: {},

	queryParams : jQuery.sap.getUriParameters(),
	
	/**
	 * Initialize Role Manager.
	 * 
	 * @param {sap.ui.Core} core: core app.
	 */
	init : function(core) {
		
		// Featch feature list
		this.fetchTechnicalFeatures();
		this.fetchFunctionnalFeatures();
		
		// Fetch connected user profile
		this.profile.connectedUser = this.parseConnectedProfile();
		this.profile.connectedUser.permissions = this.computePermissions(this.profile.connectedUser.roles);
		
		// Initialize identified user with the same values as connected user
		this.profile.identifiedUser = this.profile.connectedUser;
		
		// Share profile in Profile
		airbus.mes.shell.ModelManager.createJsonModel(core, ["Profile"])
		core.getModel("Profile").setData(this.profile);
		core.getModel("Profile").refresh(true);
	},
	
	/**
	 * Fetch Technical Roles from the JSON Model and then parse the list of roles
	 * to populate 'this.features' object with each feature and the list of positive
	 * and negative roles associated.
	 */
	fetchTechnicalFeatures: function() {
		var roleModel = airbus.mes.shell.ModelManager.loadFeatureRoleModel();
		var roleTable = jQuery.sap.getObject("Roles", undefined, roleModel) || [];
		
		function addRoles(feature, _role) {
			var attr = _role[0] == '!' ? 'negativeRoles' : 'positiveRoles';
			var role = _role[0] == '!' ? _role.substring(1) : _role;
			feature[attr].techRoles.push(role);
		}
		
		function collectRoles(col, rec) {
			col[rec.Feature] = col[rec.Feature] || { positiveRoles: { funcRoles: [], techRoles: [] },
													 negativeRoles: { funcRoles: [], techRoles: [] } };
			rec.Roles.forEach(addRoles.bind(this, col[rec.Feature]));
			return col;
		}
		
		this.features = roleTable.reduce(collectRoles, {}); // Populate initially
	},
	
	/**
	 * Fetch Functionnal Roles from the Customizing Table and then parse the list of roles
	 * to populate 'this.features' object with each feature and the list of positive
	 * and negative roles associated.
	 */
	fetchFunctionnalFeatures: function() {
		var roleModel = airbus.mes.shell.ModelManager.getRolesForSite();
		var roleTable = jQuery.sap.getObject("data", undefined, roleModel) || [];
		
		function collectRoles(col, rec) {
			col[rec.feature] = col[rec.feature] || { positiveRoles: { funcRoles: [], techRoles: [] },
													 negativeRoles: { funcRoles: [], techRoles: [] } };
			var attr = rec.roles[0] == '!' ? 'negativeRoles' : 'positiveRoles';
			var role = rec.roles[0] == '!' ? rec.roles.substring(1) : rec.roles;
			col[rec.feature][attr].funcRoles.push(role);
			return col;
		}
		
//		this.features = roleTable.reduce(collectRoles, this.features); // Augment initially populated list
	},
	

	/**
	 * Fetch profile of current user and parse it as a user profile + role mapping.
	 * 
	 * @return {Map} User Profile as key => value map.
	 */
	parseConnectedProfile: function() {
		var profileModel = airbus.mes.shell.ModelManager.getCurrentProfile();
		var profile = jQuery.sap.getObject("Rowsets.Rowset.0.Row", undefined, profileModel) || [];
		
		var userProfile = profile.reduce(function(col, rec) { col[rec.Name] = rec.Value; return col; }, {});
		userProfile.roles = userProfile.IllumLoginRoles.replace(/'/g, "").split(",");
		return userProfile;
	},
	
	/**
	 * Compute permissions associated to this role list.
	 * 
	 * @param {Array} roles: list of roles
	 * @return {Map} permission => allowed? mapping
	 */
	computePermissions: function(roles) {
		var roleMap = this.listToMap(roles, true);
		var allowed = this.isAllowed.bind(this, roleMap);
		
		function permToAllowed(perms, feature) {
			perms[feature] = allowed(feature);
			return perms;
		}
		
		return Object.keys(this.features).reduce(permToAllowed, {});
	},
	
	/**
	 * Is the role map given allowed for the requested feature.
	 * The role map can be computed from the (identified|connected) user's
	 * role with the listToMap converter.
	 * 
	 * @param {Map} userRoleMap: role map of user
	 * @param {String} featureName: feature name
	 * @return {Boolean} allowed?
	 */
	isAllowed: function(userRoleMap, featureName) {
		var feature = this.features[featureName];
		var oneOf = this.hasOneOf.bind(this, userRoleMap);
		return !( oneOf(feature.negativeRoles.funcRoles) || oneOf(feature.negativeRoles.techRoles) )
			&& ( oneOf(feature.positiveRoles.funcRoles) || oneOf(feature.positiveRoles.techRoles) );
	},
	
	/**
	 * Check if the provided list of roles contain any element
	 * which is valid (with regard to the given role map).
	 * 
	 * @param {Map} roleMap: role map associated to a user profile
	 * @param {Array} roles: list of roles to check
	 * @return {Boolean} one of the role is valid?
	 */
	hasOneOf: function(roleMap, roles) {
		var checkRole = this.isValidRole.bind(this);
		return roles.some(function(r) { return checkRole(r, roleMap); });
	},
	
	/**
	 * Convert an Array<String> to a Map<String, Any>.
	 * Each element of the array is used as a key of the newly
	 * created map and all the map values are set to the provided
	 * value.
	 * 
	 * @param {Array} list: the list to convert
	 * @param {Any} value: the default's map values
	 * @return {Map} a key => value map
	 */
	listToMap: function(list, value) {
		return list.reduce(function(map, el) { map[el] = value; return map; }, {});
	},
	
	/**
	 * Check if the role is valid with regard to the
	 * provided role map.
	 * 
	 * @param {String} role: the role
	 * @param {Map} roleMap: role map of user profile
	 * @return {Boolean} validity of role 
	 */
	isValidRole: function(role, roleMap) {
		if (role.startsWith('eval ')) {
			return this.evaluate(role.substring(5), roleMap);
		} else {
			return Boolean(roleMap[role]);	
		}
	},
	
	/** Evaluation context for complex expressions. */
	evaluation: {
		
		roleMap: {},
		
		host: function(pattern) {
			var regex = new RegExp(pattern);
			return regex.test(window.location.hostname);
		},
		
		hasRole: function(role) {
			return Boolean(this.roleMap[role]);
		},

		queryParam: function(param, value) {
			return airbus.mes.shell.RoleManager.queryParams.get(param) == value;
		},
		
		feature: function(name) {
			var featurelist = airbus.mes.shell.RoleManager.queryParams.get('features') || "";
			var featuretab = featurelist.split(',');
			return featuretab.indexOf(name) >= 0;
		}
	
	},
	
	/**
	 * Evaluate an expression in the context of RoleManager.evaluation
	 * (i.e. all attributes and methods of RoleManager.evaluation are
	 * available either as toplevel in expr or in this for inner
	 * functions).
	 * 
	 *  @param {String} expr: an expression to evaluate
	 *  @param {Map} roleMap: the role map
	 *  @return {Boolean} result of the evaluation
	 */
	evaluate: function(expr, roleMap) {
		var res = false;
		var code = "";
		this.evaluation.roleMap = roleMap;
		for (var key in this.evaluation) {
			if (this.evaluation.hasOwnProperty(key)) {
				if (typeof this.evaluation[key] === "function") {
					code += 'var ' + key + ' = this.evaluation.' + key + '.bind(this.evaluation);';
				} else {
					code += 'var ' + key + ' = this.evaluation.' + key + ';';
				}
			}
		}
		code += 'res = ' + expr + ';';
		eval(code);
		return Boolean(res);
	}
	
};

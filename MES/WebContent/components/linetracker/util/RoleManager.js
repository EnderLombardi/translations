"use strict";
jQuery.sap.declare("airbus.mes.linetracker.util.RoleManager")
airbus.mes.linetracker.util.RoleManager = {

	init : function(core) {
		//	this.parseProfile();
	},

	userProfile: {},
//	roles: [],
	                  
//	ROLES: {
//		FACTORY_VIEW : [ 'G_MII_MOD1684_ADM','G_MII_MOD1684_MFTEAM','G_MII_MOD1684_PLTMNG','G_MII_MOD1684_CDTSUP','G_MII_MOD1684_HOOPE','G_MII_MOD1684_MANUFMNG','G_MII_MOD1684_PRODMNG','G_MII_MOD1684_OPERATOR','SAP_XMII_ProjectManagement'],
//		LINE_VIEW : ['G_MII_MOD1684_ADM','G_MII_MOD1684_MFTEAM','G_MII_MOD1684_PLTMNG','G_MII_MOD1684_CDTSUP','G_MII_MOD1684_HOOPE','G_MII_MOD1684_MANUFMNG','G_MII_MOD1684_PRODMNG','G_MII_MOD1684_OPERATOR',"SAP_XMII_ProjectManagement"],
//		STATION_VIEW : ['G_MII_MOD1684_ADM','G_MII_MOD1684_MFTEAM','G_MII_MOD1684_PLTMNG','G_MII_MOD1684_CDTSUP','G_MII_MOD1684_HOOPE','G_MII_MOD1684_MANUFMNG','G_MII_MOD1684_PRODMNG','G_MII_MOD1684_OPERATOR',"SAP_XMII_ProjectManagement"],
//		ORDER_WRKL : ['G_MII_MOD1684_ADM','G_MII_MOD1684_MFTEAM','G_MII_MOD1684_PLTMNG','G_MII_MOD1684_CDTSUP','G_MII_MOD1684_HOOPE','G_MII_MOD1684_MANUFMNG','G_MII_MOD1684_PRODMNG','G_MII_MOD1684_OPERATOR',"SAP_XMII_ProjectManagement"],
//		OPERATION_WRKL : ['G_MII_MOD1684_MFTEAM','G_MII_MOD1684_CDTSUP','G_MII_MOD1684_MANUFMNG','G_MII_MOD1684_PRODMNG','MII_MOD1684_OPERATOR',"SAP_XMII_ProjectManagement"],
//		USER_WKRL: ['G_MII_MOD1684_MFTEAM','G_MII_MOD1684_PLTMNG','G_MII_MOD1684_CDTSUP','G_MII_MOD1684_HOOPE','G_MII_MOD1684_PRODMNG','G_MII_MOD1684_OPERATOR',"SAP_XMII_ProjectManagement"],
//		PARTIALPULSE : ["SAP_XMII_ProjectManagement",'G_MII_MOD1684_MFTEAM'],
//		PULSE : ['G_MII_MOD1684_MFTEAM','G_MII_MOD1684_MANUFMNG','G_MII_MOD1684_PRODMNG',"SAP_XMII_ProjectManagement"],
//		CONFIRMATION : ['G_MII_MOD1684_PRODMNG','MII_MOD1684_OPERATOR',"SAP_XMII_ProjectManagement"],
//		ASSIGNEMENT :['G_MII_MOD1684_MFTEAM','G_MII_MOD1684_PLTMNG','G_MII_MOD1684_CDTSUP','G_MII_MOD1684_HOOPE','G_MII_MOD1684_MANUFMNG','G_MII_MOD1684_PRODMNG','G_MII_MOD1684_OPERATOR',"SAP_XMII_ProjectManagement"],
//		SLIDE_SHOW :['G_MII_MOD1684_PRODMNG',"SAP_XMII_ProjectManagement"],
//
//
//	},
	
//check if the current user has the right role to execute the action define in ROLES array
	isAllowed: function (role) {
		/*return this.userProfile.IllumLoginRoles.some(function (el) {
//			//return airbus.mes.linetracker.util.RoleManager.ROLES[role].indexOf(el) >= 0;
			return airbus.mes.linetracker.util.RoleManager.userProfile.IllumLoginRoles.indexOf(role) >= 0;
			
		});*/
		return true;
	},
	
	
//Set all information about current user log in userProfile variable
	parseProfile : function () {
		var profile = airbus.mes.linetracker.util.ModelManager.getRoles().Rowsets.Rowset[0].Row;
		for (var i=0; i<profile.length; i++) {
			this.userProfile[profile[i].Name] = profile[i].Value;
		}
		
		this.userProfile.IllumLoginRoles = this.userProfile.IllumLoginRoles.replace(/'/g,"").split(",");

	},
				
};

//airbus.mes.linetracker.util.RoleManager.init(sap.ui.getCore());
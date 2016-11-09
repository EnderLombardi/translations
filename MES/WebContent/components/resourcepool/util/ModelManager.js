"use strict";

jQuery.sap.declare("airbus.mes.resourcepool.util.ModelManager");

airbus.mes.resourcepool.util.ModelManager = {
	urlModel : undefined,
	oCreateResDialog : undefined,
	site : undefined,
	resourceName : undefined,
	resourceId : undefined,
	// resourcePool: undefined,
	resourceDescription : undefined,
	date : undefined,
	currentView : undefined,
	anyChangesFlag : false,
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {
		core.setModel(new sap.ui.model.json.JSONModel(), "ValueHelpModel");
		core.setModel(new sap.ui.model.json.JSONModel(), "ResourcePoolDetailModel");
		var dest;

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

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "../components/resourcepool/config/url_config.properties",
			bundleLocale : dest

		});

		/*
		 * airbus.mes.resourcepool.oView.getModel("i18nModel"). = new
		 * sap.ui.model.resource.ResourceModel({ bundleUrl :
		 * "i18n/i18n.properties", bundleLocale :
		 * core.getConfiguration().getLanguage() });
		 * core.setModel(airbus.mes.resourcepool.oView.getModel("i18nModel").,
		 * "i18n");
		 */

		this.loadModelValueHelp();
	},
	
	askResourcePool: function(){
		// Ask to select Resource Pool if launched initially or Site is changed
		if(airbus.mes.resourcepool.util.ModelManager.site != airbus.mes.settings.ModelManager.site || airbus.mes.resourcepool.util.ModelManager.resourceName === undefined){
			airbus.mes.resourcepool.util.ModelManager.site = airbus.mes.settings.ModelManager.site;
			airbus.mes.resourcepool.oView.getController().openSelectResourcePool();
			sap.ui.getCore().getModel("ResourcePoolDetailModel").setData();
			sap.ui.getCore().getModel("ResourcePoolDetailModel").refresh();
			sap.ui.getCore().byId("resourcePool--resourcePoolName").setText();
			airbus.mes.resourcepool.util.ModelManager.resourceName = undefined;
			airbus.mes.resourcepool.util.ModelManager.goBack=true;
		}
	},

	loadMainViewModels : function() {
		airbus.mes.resourcepool.util.ModelManager.currentView.setBusy(true);
		this.loadModelResourcePoolModel();
		airbus.mes.resourcepool.util.ModelManager.currentView.setBusy(false);
	},

	getUrlValueHelpModel : function() {

		var urlValueHelpModel = this.urlModel.getProperty('urlvaluehelp');
		urlValueHelpModel = urlValueHelpModel.replace('$Site',
				airbus.mes.settings.ModelManager.site);
		return urlValueHelpModel;
	},
	
	loadModelValueHelp : function() {

		var geturlvaluehelp = this.getUrlValueHelpModel();
		var oValueHelpModel = sap.ui.getCore().getModel("ValueHelpModel");
		oValueHelpModel.loadData(geturlvaluehelp, null, false);
	},

	/*getUrlAvailableUsersModel : function() {

		var urlAvailableUsers = this.urlModel.getProperty('urlavailableusers');
		urlAvailableUsers = urlAvailableUsers.replace("$Site",
				airbus.mes.settings.ModelManager.site);
		urlAvailableUsers = urlAvailableUsers.replace("$ResourcePoolName",
				this.resourceName);
		return urlAvailableUsers;
	},

	loadModelAvailableUsers : function() {

		var geturlavailableusers = this.getUrlAvailableUsersModel();
		var oAvailableUsersModel = sap.ui.getCore().getModel(
				"AvailableUsersModel");
		oAvailableUsersModel.loadData(geturlavailableusers, null, false);
	},

	getUrlAssignedUsersModel : function() {

		var urlAssignedUsers = this.urlModel.getProperty('urlassignedusers');
		urlAssignedUsers = urlAssignedUsers.replace("$Site",
				airbus.mes.settings.ModelManager.site);
		urlAssignedUsers = urlAssignedUsers.replace("$ResourcePoolName",
				this.resourceName);
		return urlAssignedUsers;
	},

	loadModelAssignedUsers : function() {

		var geturlassignedusers = this.getUrlAssignedUsersModel();
		var oAssignedUsersModel = sap.ui.getCore().getModel(
				"AssignedUsersModel");
		oAssignedUsersModel.loadData(geturlassignedusers, null, false);
	},

	getUrlAssignedWCModel : function() {

		var urlAssignedWC = this.urlModel.getProperty('urlassignedworkcenters');
		urlAssignedWC = urlAssignedWC.replace("$Site",
				airbus.mes.settings.ModelManager.site);
		urlAssignedWC = urlAssignedWC.replace("$ResourcePoolName",
				this.resourceName);
		return urlAssignedWC;
	},

	loadModelAssignedWC : function() {

		var geturlassignedWC = this.getUrlAssignedWCModel();
		var oAssignedWCModel = sap.ui.getCore().getModel("AssignedWCModel");
		oAssignedWCModel.loadData(geturlassignedWC, null, false);
	},
	getUrlAvailableWCModel : function() {

		var urlAvailableWC = this.urlModel
				.getProperty('urlavailableworkcenters');
		urlAvailableWC = urlAvailableWC.replace("$Site",
				airbus.mes.settings.ModelManager.site);
		urlAvailableWC = urlAvailableWC.replace("$ResourcePoolName",
				this.resourceName);
		return urlAvailableWC;
	},

	loadModelAvailableWC : function() {

		var geturlavailableWC = this.getUrlAvailableWCModel();
		var oAvailableWCModel = sap.ui.getCore().getModel("AvailableWCModel");
		oAvailableWCModel.loadData(geturlavailableWC, null, false);
	},
	getUrlAvailableShiftModel : function() {

		var urlAvailableShift = this.urlModel.getProperty('urlshifts');
		urlAvailableShift = urlAvailableShift.replace("$Site",
				airbus.mes.settings.ModelManager.site);
		urlAvailableShift = urlAvailableShift.replace("$ResourcePoolName",
				this.resourceName);
		return urlAvailableShift;
	},

	loadModelAvailableShift : function() {

		var geturlavailableShift = this.getUrlAvailableShiftModel();
		var oAvailableShiftModel = sap.ui.getCore().getModel(
				"AvailableShiftModel");
		oAvailableShiftModel.loadData(geturlavailableShift, null, false);
	},*/

	getUrlResourcePoolDetail : function(){
		var urlResourceDetailPool = this.urlModel.getProperty('resourcepooldetails');
		urlResourceDetailPool = urlResourceDetailPool.replace("$Site",
				airbus.mes.settings.ModelManager.site);
		urlResourceDetailPool = urlResourceDetailPool.replace("$ResourcePoolName",
				this.resourceName);
		return urlResourceDetailPool;
	},
	loadModelResourcePoolModel : function(){
		var oResourcePoolDetailModel = sap.ui.getCore().getModel("ResourcePoolDetailModel");
		oResourcePoolDetailModel.loadData(this.getUrlResourcePoolDetail(), null, false); 
		//TODO: extract string from, json data
//		var data = JSON.parse('{"ns2:resourcePool" : {"ns2:id" : "2", "ns2:name" : "RP MII TEST 1", "ns2:description" : "RP MII TEST 1 DESC", "ns2:modifyDate" : "2016-11-03T22:36:19.000Z", "ns2:usersAvailable" : [{"ns2:handle" : "UserBO:FNZ1,COURRENT", "ns2:userId" : "COURRENT", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,LEONARD_PI", "ns2:userId" : "LEONARD_PI", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,MESYS", "ns2:userId" : "MESYS", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG000524", "ns2:userId" : "NG000524", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG004BDE", "ns2:userId" : "NG004BDE", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG33A7F", "ns2:userId" : "NG33A7F", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG34ED3", "ns2:userId" : "NG34ED3", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG3B45E", "ns2:userId" : "NG3B45E", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,ZMII1684L201", "ns2:userId" : "ZMII1684L201", "ns2:erpUserId" : "", "ns2:personalNo" : "4400022", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG43F36", "ns2:userId" : "NG43F36", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG4B21D", "ns2:userId" : "NG4B21D", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG55033", "ns2:userId" : "NG55033", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG55E48", "ns2:userId" : "NG55E48", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG56D2A", "ns2:userId" : "NG56D2A", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG5B8F3", "ns2:userId" : "NG5B8F3", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG5E052", "ns2:userId" : "NG5E052", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG5E054", "ns2:userId" : "NG5E054", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG5E059", "ns2:userId" : "NG5E059", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG5E7C1", "ns2:userId" : "NG5E7C1", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,NG65FF5", "ns2:userId" : "NG65FF5", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,S007C96", "ns2:userId" : "S007C96", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,S00DB44", "ns2:userId" : "S00DB44", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,S0137BF", "ns2:userId" : "S0137BF", "ns2:erpUserId" : "S0137BF", "ns2:personalNo" : "S0137BF", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,SITE_ADMIN", "ns2:userId" : "SITE_ADMIN", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,ST27164", "ns2:userId" : "ST27164", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,TH32PK", "ns2:userId" : "TH32PK", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,TO105976", "ns2:userId" : "TO105976", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,TO31681", "ns2:userId" : "TO31681", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,TO80924", "ns2:userId" : "TO80924", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}, {"ns2:handle" : "UserBO:FNZ1,TO95871", "ns2:userId" : "TO95871", "ns2:erpUserId" : "", "ns2:personalNo" : "", "ns2:type" : "U"}], "ns2:workCentersAvailable" : [{"ns2:handle" : "WorkCenterBO:FNZ1,1L", "ns2:name" : "1L", "ns2:type" : "WC", "ns2:description" : "ASO labour work centre"}, {"ns2:handle" : "WorkCenterBO:FNZ1,2L", "ns2:name" : "2L", "ns2:type" : "WC", "ns2:description" : "SASC-1-20"}, {"ns2:handle" : "WorkCenterBO:FNZ1,3L", "ns2:name" : "3L", "ns2:type" : "WC", "ns2:description" : "SASC-1-30"}, {"ns2:handle" : "WorkCenterBO:FNZ1,4L", "ns2:name" : "4L", "ns2:type" : "WC", "ns2:description" : "SASC-1-40"}, {"ns2:handle" : "WorkCenterBO:FNZ1,5L", "ns2:name" : "5L", "ns2:type" : "WC", "ns2:description" : "SASC-1-50"}, {"ns2:handle" : "WorkCenterBO:FNZ1,6L", "ns2:name" : "6L", "ns2:type" : "WC", "ns2:description" : "SASC-1-60"}, {"ns2:handle" : "WorkCenterBO:FNZ1,7L", "ns2:name" : "7L", "ns2:type" : "WC", "ns2:description" : "SASC-1-70"}, {"ns2:handle" : "WorkCenterBO:FNZ1,8L", "ns2:name" : "8L", "ns2:type" : "WC", "ns2:description" : "SASC-1-80"}, {"ns2:handle" : "WorkCenterBO:FNZ1,CHES_LG_1_L1_CG", "ns2:name" : "CHES_LG_1_L1_CG", "ns2:type" : "WC", "ns2:description" : "CHES_LG_1_L1_CG"}, {"ns2:handle" : "WorkCenterBO:FNZ1,CHES_LG_1_L2_CG", "ns2:name" : "CHES_LG_1_L2_CG", "ns2:type" : "WC", "ns2:description" : "CHES_LG_1_L1_CG"}, {"ns2:handle" : "WorkCenterBO:FNZ1,CHES_LG_1_L3_CG", "ns2:name" : "CHES_LG_1_L3_CG", "ns2:type" : "WC", "ns2:description" : "CHES_LG_1_L1_CG"}, {"ns2:handle" : "WorkCenterBO:FNZ1,CHES_LG_2_L1_CG", "ns2:name" : "CHES_LG_2_L1_CG", "ns2:type" : "WC", "ns2:description" : "CHES_LG_1_L1_CG"}, {"ns2:handle" : "WorkCenterBO:FNZ1,CHES_LG_2_L2_CG", "ns2:name" : "CHES_LG_2_L2_CG", "ns2:type" : "WC", "ns2:description" : "CHES_LG_1_L1_CG"}, {"ns2:handle" : "WorkCenterBO:FNZ1,CHES_LG_2_L3_CG", "ns2:name" : "CHES_LG_2_L3_CG", "ns2:type" : "WC", "ns2:description" : "CHES_LG_1_L1_CG"}, {"ns2:handle" : "WorkCenterBO:FNZ1,CHES_LG_3_L1_CG", "ns2:name" : "CHES_LG_3_L1_CG", "ns2:type" : "WC", "ns2:description" : "CHES_LG_1_L1_CG"}, {"ns2:handle" : "WorkCenterBO:FNZ1,CHES_LG_3_L2_CG", "ns2:name" : "CHES_LG_3_L2_CG", "ns2:type" : "WC", "ns2:description" : "CHES_LG_1_L1_CG"}, {"ns2:handle" : "WorkCenterBO:FNZ1,CHES_LG_3_L3_CG", "ns2:name" : "CHES_LG_3_L3_CG", "ns2:type" : "WC", "ns2:description" : "CHES_LG_1_L1_CG"}, {"ns2:handle" : "WorkCenterBO:FNZ1,IP1 PA", "ns2:name" : "IP1 PA", "ns2:type" : "WC", "ns2:description" : "Assemblage Structure 11/12 4"}, {"ns2:handle" : "WorkCenterBO:FNZ1,IP1 TC", "ns2:name" : "IP1 TC", "ns2:type" : "WC", "ns2:description" : "Assemblage Systeme 15/21 1"}, {"ns2:handle" : "WorkCenterBO:FNZ1,IP2 PA", "ns2:name" : "IP2 PA", "ns2:type" : "WC", "ns2:description" : "Assemblage Structure 11/12 5"}, {"ns2:handle" : "WorkCenterBO:FNZ1,IP2 TC", "ns2:name" : "IP2 TC", "ns2:type" : "WC", "ns2:description" : "Assemblage Systeme 15/21 2"}, {"ns2:handle" : "WorkCenterBO:FNZ1,IP3 PA", "ns2:name" : "IP3 PA", "ns2:type" : "WC", "ns2:description" : "Assemblage Structure 11/12 6"}, {"ns2:handle" : "WorkCenterBO:FNZ1,IP3 TC", "ns2:name" : "IP3 TC", "ns2:type" : "WC", "ns2:description" : "Assemblage Systeme 15/21 3"}, {"ns2:handle" : "WorkCenterBO:FNZ1,IP4 TC", "ns2:name" : "IP4 TC", "ns2:type" : "WC", "ns2:description" : "Assemblage Systeme 15/21 4"}, {"ns2:handle" : "WorkCenterBO:FNZ1,IP5 TC", "ns2:name" : "IP5 TC", "ns2:type" : "WC", "ns2:description" : "Assemblage Systeme 15/21 5"}, {"ns2:handle" : "WorkCenterBO:FNZ1,PHYS_ST_IP3", "ns2:name" : "PHYS_ST_IP3", "ns2:type" : "WC", "ns2:description" : "IP3 Physical Station"}, {"ns2:handle" : "WorkCenterBO:FNZ1,PHYS_ST_IP4", "ns2:name" : "PHYS_ST_IP4", "ns2:type" : "WC", "ns2:description" : "IP4 Physical Station"}, {"ns2:handle" : "WorkCenterBO:FNZ1,STATION_N", "ns2:name" : "STATION_N", "ns2:type" : "WC", "ns2:description" : "STATION_N"}]}}');
//		oResourcePoolDetailModel.setData(data);
//		oResourcePoolDetailModel.refresh();
	},
	
	getUrlCreateResource : function(name, description) {
		var urlCreateResource = this.urlModel.getProperty('urlcreateresource');
		urlCreateResource = urlCreateResource.replace("$Site",
				airbus.mes.settings.ModelManager.site);
		urlCreateResource = urlCreateResource
				.replace("$ResourcePoolName", name);
		urlCreateResource = urlCreateResource.replace("$Description",
				description);
		return urlCreateResource;
	},

	createResource : function(name, description) {
		var value;
		jQuery.ajax({
			async : false,
			url : this.getUrlCreateResource(name, description),
			cache : false,
			type : 'GET',
			success : function(data, textStatus, jqXHR) {
				var message = airbus.mes.resourcepool.oView.getModel(
						"i18nModel").getProperty("Created");
				value = airbus.mes.resourcepool.util.ModelManager
						.handleMessages(data, textStatus, jqXHR, message,
								"Strip");
				airbus.mes.resourcepool.util.ModelManager.loadModelValueHelp();

			},
			error : function() {
				airbus.mes.resourcepool.util.ModelManager
						.handleServerError("Strip")
			}
		});
		return value;
		// this.loadModelValueHelp();
	},

	updateResource : function(name, description) {
		var value;
		jQuery.ajax({
			async : false,
			url : airbus.mes.resourcepool.util.ModelManager.getUrlUpdateResourcePool(),
			cache : false,
			type : 'POST',
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : name,
				"Param.3" : description,
				"Param.4" : false,
				"Param.5" : ""
			},
			success : function(data, textStatus, jqXHR) {
				var message = airbus.mes.resourcepool.oView.getModel(
						"i18nModel").getProperty("Updated");
				value = airbus.mes.resourcepool.util.ModelManager
						.handleMessages(data, textStatus, jqXHR, message,
								"Strip");
				airbus.mes.resourcepool.util.ModelManager.loadModelValueHelp();

			},
			error : function() {
				airbus.mes.resourcepool.util.ModelManager
						.handleServerError("Strip")
			}
		});
		return value;

	},

	getUrlUpdateResourcePool : function() {
		var urlUpdateResourcePool = this.urlModel
				.getProperty('urlupdateresource');

		return urlUpdateResourcePool;
	},

	updateResourcePool : function(oModelData){
		jQuery.ajax({
			async : true,
			cache : false,
			url : this.getUrlUpdateResourcePool(),
			type : 'POST',
			data : {
				"Param.1" : airbus.mes.settings.ModelManager.site,
				"Param.2" : this.resourceName,
				"Param.3" : this.resourceDescription,
				"Param.4" : true,
				"Param.5" : airbus.mes.shell.ModelManager.json2xml(oModelData)
			},
			success : function(data, textStatus, jqXHR) {
				airbus.mes.resourcepool.util.ModelManager.loadMainViewModels();
				airbus.mes.resourcepool.util.ModelManager.currentView.setBusy(false);
				var message = airbus.mes.resourcepool.oView.getModel(
						"i18nModel").getProperty("SavedResourcePool");
				airbus.mes.resourcepool.util.ModelManager.handleMessages(data,
						textStatus, jqXHR, message, "Toast");

			},
			error : function() {
				airbus.mes.resourcepool.util.ModelManager.currentView.setBusy(false);
				airbus.mes.resourcepool.util.ModelManager
						.handleServerError("Toast")
			}

		});
	},

	getUrlDeleteResource : function() {
		var urlDeleteResource = this.urlModel.getProperty('urldeleteresource');
		return urlDeleteResource;
	},

	deleteResource : function(name) {
		var value;
		jQuery.ajax({
			async : false,
			url : this.getUrlDeleteResource(),
			cache : false,
			type : 'POST',
			data : {
				"Param.1" : name,
				"Param.2" : airbus.mes.settings.ModelManager.site,
			},
			success : function(data, textStatus, jqXHR) {
				var message = airbus.mes.resourcepool.oView.getModel(
						"i18nModel").getProperty("Deleted");
				value = airbus.mes.resourcepool.util.ModelManager
						.handleMessages(data, textStatus, jqXHR, message,
								"Strip");
				airbus.mes.resourcepool.util.ModelManager.loadModelValueHelp();
			},
			error : function() {
				airbus.mes.resourcepool.util.ModelManager
						.handleServerError("Strip")

			}
		});

		return value;
	},

	handleServerError : function(display) {
		this.showMessage(display, "Error", airbus.mes.resourcepool.oView
				.getModel("i18nModel").getProperty("TryAgain"), true);
		if(airbus.mes.resourcepool.util.ModelManager.currentView)
			airbus.mes.resourcepool.util.ModelManager.currentView.setBusy(false);
	},

	handleMessages : function(data, textStatus, jqXHR, message, display) {
		var rowExists = data.Rowsets.Rowset;
		if (rowExists != undefined) {
			if (data.Rowsets.Rowset[0].Row[0].Message_Type == "S") {

				this.showMessage(display, "Success",
						data.Rowsets.Rowset[0].Row[0].Message, true);
				return 0;
			} else {
				this.showMessage(display, "Error",
						data.Rowsets.Rowset[0].Row[0].Message, true);
				return 1;
			}
		} else {
			if (data.Rowsets.FatalError) {
				this.showMessage(display, "Error", data.Rowsets.FatalError,
						true);
				return 2;
			} else {
				this.showMessage(display, "Success", message, true);
				return 0;
			}
		}
		
		if(airbus.mes.resourcepool.util.ModelManager.currentView)
			airbus.mes.resourcepool.util.ModelManager.currentView.setBusy(false);
	},

	showMessage : function(display, msgType, msgText, visible, duration) {

		if (duration === undefined)
			duration = 3000;

		switch (display) {

		case "Toast":
			sap.m.MessageToast.show(msgText, {
				duration : duration,
				closeOnBrowserNavigation : false
			});
			break;
		default:

			var oMessageStrip = sap.ui.getCore().byId(
					"searchResourcePool--messageBox");
			oMessageStrip.setType(msgType);
			oMessageStrip.setText(msgText);
			oMessageStrip.setVisible(visible);

			setTimeout(function() {

				var oMessageStrip = sap.ui.getCore().byId(
						"searchResourcePool--messageBox");
				oMessageStrip.setVisible(false);
				oMessageStrip.setText("");
			}, 10000);
		}
	}

}
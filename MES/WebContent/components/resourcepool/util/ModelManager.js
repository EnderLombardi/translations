"use strict";

jQuery.sap.declare("airbus.mes.resourcepool.util.ModelManager");

airbus.mes.resourcepool.util.ModelManager = {
	urlModel : undefined,
	oCreateResDialog : undefined,
	site : 'CHES',
	resourceName : undefined,
	// resourcePool: undefined,
	resourceDescription : undefined,
	date : undefined,
	/** I18N Model. Resource where to get internationalized strings. */
	i18nModel : undefined,
	currentView : undefined,
	anyChangesFlag : false,
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {
		core.setModel(new sap.ui.model.json.JSONModel(), "ValueHelpModel");
		core.setModel(new sap.ui.model.json.JSONModel(), "AvailableUsersModel");
		core.setModel(new sap.ui.model.json.JSONModel(), "AssignedUsersModel");
		core.setModel(new sap.ui.model.json.JSONModel(), "AvailableWCModel");
		core.setModel(new sap.ui.model.json.JSONModel(), "AssignedWCModel");
		core.setModel(new sap.ui.model.json.JSONModel(), "AvailableShiftModel");

		var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "local";
			break;
		case "wsapbpc01.ptx.fr.sopra":
			dest = "sopra";
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
		
		this.loadModelValueHelp();
	},

	loadMainViewModels : function() {
		this.loadModelAvailableShift();
		this.loadModelAssignedUsers();
		this.loadModelAvailableUsers();
		this.loadModelAssignedWC();
		this.loadModelAvailableWC();
	},
	
	//************************************LogOut****************************************

	logOut : function() {
		jQuery
		.ajax({
			url : this.urlModel.getProperty("urllogout"),
			type : 'POST',
			async : false,
			complete : function() {
				
				location.reload();
			}
		
	})
	},

	getUrlValueHelpModel : function() {

		var urlValueHelpModel = this.urlModel.getProperty('urlvaluehelp');
		urlValueHelpModel = urlValueHelpModel.replace('$Site',
				this.site);
		return urlValueHelpModel;
	},

	loadModelValueHelp : function() {

		var geturlvaluehelp = this.getUrlValueHelpModel();
		var oValueHelpModel = sap.ui.getCore().getModel("ValueHelpModel");
		oValueHelpModel.loadData(geturlvaluehelp, null, false);
	},

	getUrlAvailableUsersModel : function() {

		var urlAvailableUsers = this.urlModel.getProperty('urlavailableusers');
		urlAvailableUsers = urlAvailableUsers.replace("$Site",
				this.site);
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
		urlAssignedUsers = urlAssignedUsers.replace("$Site", this.site);
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
		urlAssignedWC = urlAssignedWC.replace("$Site", this.site);
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
		urlAvailableWC = urlAvailableWC.replace("$Site", this.site);
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
				this.site);
		urlAvailableShift = urlAvailableShift.replace("$ResourcePoolName",
				this.resourceName);
		return urlAvailableShift;
	},

	loadModelAvailableShift : function() {

		var geturlavailableShift = this.getUrlAvailableShiftModel();
		var oAvailableShiftModel = sap.ui.getCore().getModel(
				"AvailableShiftModel");
		oAvailableShiftModel.loadData(geturlavailableShift, null, false);
	},

	getUrlCreateResource : function() {
		var urlCreateResource = this.urlModel.getProperty('urlcreateresource');
		urlCreateResource = urlCreateResource.replace("$Site",
				this.site);
		urlCreateResource = urlCreateResource.replace("$ResourcePoolName",
				this.resourceName);
		urlCreateResource = urlCreateResource.replace("$Description",
				this.resourceDescription);
		return urlCreateResource;
	},

	createResource : function() {
		var value;
		jQuery.ajax({
			async : false,
			url : this.getUrlCreateResource(),
			cache : false,
			type : 'GET',
			success : function(data, textStatus, jqXHR) {
				var message = this.i18nModel.getProperty("Created");
				value = this.handleMessages(data, textStatus, jqXHR,
						message, "Strip");
				this.loadModelValueHelp();

			},
			error : function() {
				this.handleServerError("Strip")
			}
		});
		return value;
		// this.loadModelValueHelp();
	},

	getUrlUpdateResource : function() {
		var urlUpdateResource = this.urlModel.getProperty('urlupdateresdesc');
		urlUpdateResource = urlUpdateResource.replace("$Site",
				this.site);
		urlUpdateResource = urlUpdateResource.replace("$ResourcePoolName",
				this.resourceName);
		urlUpdateResource = urlUpdateResource.replace("$Description",
				this.resourceDescription);

		return urlUpdateResource;
	},

	updateResource : function() {
		var value;
		jQuery.ajax({
			async : false,
			url : this.getUrlUpdateResource(),
			cache : false,
			type : 'GET',
			success : function(data, textStatus, jqXHR) {
				var message = this.i18nModel.getProperty("Updated");
				value = this.handleMessages(data, textStatus, jqXHR,
						message, "Strip");
				this.loadModelValueHelp();

			},
			error : function() {
				this.handleServerError("Strip")
			}
		});
		return value;

	},

	getUrlUpdateResourcePool : function(oModelData) {
		var urlUpdateResourcePool = this.urlModel
				.getProperty('urlupdateresource');
/*		urlUpdateResourcePool = urlUpdateResourcePool.replace("$Site",
				ModelManager.site);
		urlUpdateResourcePool = urlUpdateResourcePool.replace(
				"$ResourcePoolName", ModelManager.resourceName);
		urlUpdateResourcePool = urlUpdateResourcePool.replace("$Description",
				ModelManager.resourceDescription);

		urlUpdateResourcePool = urlUpdateResourcePool.replace("$Assignments",
				airbus.mes.shell.util.Formatter.json2xml({
					CT_WORKLIST : {
						item : oModelData
					}
				}));*/
		return urlUpdateResourcePool;
	},

	updateResourcePool : function(oModelData) {
		jQuery.ajax({
			async: true,
			cache : false,
			url : this.getUrlUpdateResourcePool(oModelData),
			type : 'POST',
			data: {
				"Param.1": ModelManager.site,
				"Param.2": ModelManager.resourceName,
				"Param.3": ModelManager.resourceDescription,
				"Param.4":airbus.mes.shell.util.Formatter.json2xml({
					CT_WORKLIST : {
						item : oModelData
					}
				})
			},
			success : function(data, textStatus, jqXHR) {
				ModelManager.loadMainViewModels();
				sap.ui.core.BusyIndicator.hide(); 
				var message = ModelManager.i18nModel
						.getProperty("SavedResourcePool");
				ModelManager.handleMessages(data, textStatus, jqXHR, message,
						"Toast");

			},
			error : function() {
				sap.ui.core.BusyIndicator.hide(); 
				ModelManager.handleServerError("Toast")
			}

		});

	},

	getUrlDeleteResource : function() {
		var urlDeleteResource = this.urlModel.getProperty('urldeleteresource');
		urlDeleteResource = urlDeleteResource.replace("$Site",
				ModelManager.site);
		urlDeleteResource = urlDeleteResource.replace("$ResourcePoolName",
				ModelManager.resourceName);
		return urlDeleteResource;
	},

	deleteResource : function() {
		var value;
		jQuery.ajax({
			async : false,
			url : this.getUrlDeleteResource(),
			cache : false,
			type : 'GET',
			success : function(data, textStatus, jqXHR) {
				var message = ModelManager.i18nModel.getProperty("Deleted");
				value = ModelManager.handleMessages(data, textStatus, jqXHR,
						message, "Strip");
				ModelManager.loadModelValueHelp();
			},
			error : function() {
				ModelManager.handleServerError("Strip")

			}
		});

		return value;
	},

	handleServerError : function(display) {
		ModelManager.showMessage(display, "Error", ModelManager.i18nModel
				.getProperty("TryAgain"), true);
		ModelManager.currentView.setBusy(false);
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

		ModelManager.currentView.setBusy(false);
	},

	showMessage : function(display, msgType, msgText, visible) {

		switch (display) {

		case "Toast":
			sap.m.MessageToast.show(msgText);
			break;
		default:

			var oMessageStrip = sap.ui.getCore().byId("idSearchView").byId(
					"messageBox");
			oMessageStrip.setType(msgType);
			oMessageStrip.setText(msgText);
			oMessageStrip.setVisible(visible);

			setTimeout(function() {

				var oMessageStrip = sap.ui.getCore().byId("idSearchView").byId(
						"messageBox");
				oMessageStrip.setVisible(false);
				oMessageStrip.setText("");
			}, 10000);
		}

		ModelManager.currentView.setBusy(false);
	}

}
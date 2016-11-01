//"use strict";
jQuery.sap.declare("airbus.mes.disruptiontracker.ModelManager")
airbus.mes.disruptiontracker.ModelManager = {
	urlModel : undefined,
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {
		
		core.setModel(new sap.ui.model.json.JSONModel(), "disruptionsListData");//Model having disruptions detail
		core.setModel(new sap.ui.model.json.JSONModel(), "disruptionsFilterData");
		core.setModel(new sap.ui.model.json.JSONModel(), "disruptionsOrderData");
		core.setModel(new sap.ui.model.resource.ResourceModel({bundleName:"airbus.mes.disruptiontracker.i18n.i18n",bundleLocale:"en"}), 
														 "disruptiontrackerI18n");


		var dest;

		switch (window.location.hostname) {
		case "localhost":
			dest = "local";
			break;
		default:
			dest = "local";
			break;
		}
		
		if (this.queryParams.get("url_config")) {
			dest = this.queryParams.get("url_config");
		}

		this.urlModel = new sap.ui.model.resource.ResourceModel(
				{
					bundleUrl : "../components/disruptiontracker/config/url_config.properties",
					bundleLocale : dest
				});
		
		this.loadData();
		
	},
	
	loadData: function() {
		this.loadDisruptionFilterModel();
		this.loadDisruptionOrderModel();
		this.loadDisruptionListModel();
	},
	
	loadDisruptionFilterModel : function() {
		var oViewModel = sap.ui.getCore().getModel("disruptionsFilterData");
		oViewModel.loadData(this.urlModel.getProperty("urlfiltermodel"), null, false);

	},
	
	loadDisruptionOrderModel : function() {
		var oViewModel = sap.ui.getCore().getModel("disruptionsOrderData");
		oViewModel.loadData(this.urlModel.getProperty("urlordermodel"), null, false);

	},
	
	loadDisruptionListModel : function() {
		
		var oViewModel = sap.ui.getCore().getModel("disruptionsListData");
		
		var urlListModel = this.urlModel.getProperty("urllistmodel");
		
		urlListModel = urlListModel.replace('$Site', airbus.mes.settings.ModelManager.site);
		urlListModel = urlListModel.replace('$Status', "ALL");
/*		urlListModel = urlListModel.replace('$Resource', "");
		urlListModel = urlListModel.replace('$Operation', "");
		urlListModel = urlListModel.replace('$SFC', "");
		urlListModel = urlListModel.replace('$OperationRevision', "");
		urlListModel = urlListModel.replace('$SignalFlag', "");
		urlListModel = urlListModel.replace('$FromDate', "");
		urlListModel = urlListModel.replace('$ToDate', "");
		urlListModel = urlListModel.replace('$WorkCenter', "");
		urlListModel = urlListModel.replace('$userGroup', "");
		urlListModel = urlListModel.replace('$MessageType', "");*/
		
		oViewModel.loadData(urlListModel, null, false);

	}
	
}

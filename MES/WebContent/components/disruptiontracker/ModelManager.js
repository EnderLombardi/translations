//"use strict";
jQuery.sap.declare("airbus.mes.disruptiontracker.ModelManager")
airbus.mes.disruptiontracker.ModelManager = {
	urlModel : undefined,
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {
		
		core.setModel(new sap.ui.model.json.JSONModel(), "disruptionsTrackerModel");//Model having disruptions detail
		core.setModel(new sap.ui.model.json.JSONModel(), "disruptionsFilterData");
		core.setModel(new sap.ui.model.json.JSONModel(), "disruptionsOrderData");
		/*core.setModel(new sap.ui.model.resource.ResourceModel({bundleName:"airbus.mes.disruptiontracker.i18n.i18n",bundleLocale:"en"}), 
														 "disruptiontrackerI18n");*/


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

		this.urlModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "../components/disruptiontracker/config/url_config.properties",
			bundleLocale : dest
		});
		
		this.loadData();
		
	},
	
	loadData: function() {
		this.loadDisruptionFilterModel();
		this.loadDisruptionOrderModel();
		//this.loadDisruptionListModel();
	},
	
	loadDisruptionFilterModel : function() {
		var oViewModel = sap.ui.getCore().getModel("disruptionsFilterData");
		oViewModel.loadData(this.urlModel.getProperty("urlfiltermodel"), null, false);

	},
	
	loadDisruptionOrderModel : function() {
		var oViewModel = sap.ui.getCore().getModel("disruptionsOrderData");
		oViewModel.loadData(this.urlModel.getProperty("urlordermodel"), null, false);

	},
	
	loadDisruptionTrackerModel : function(oFilters) {
		
		var oViewModel = sap.ui.getCore().getModel("disruptionsTrackerModel");
		
		var getDiruptionsURL = this.urlModel.getProperty("getDiruptionsURL");
		
		getDiruptionsURL = getDiruptionsURL.replace('$Site', airbus.mes.settings.ModelManager.site);
		getDiruptionsURL = getDiruptionsURL.replace('$Status', "ALL");
		getDiruptionsURL = getDiruptionsURL.replace('$Resource', "");
		
		if(oFilters.operation != undefined && oFilters.operation != ""){
			getDiruptionsURL = getDiruptionsURL.replace('$Operation', oFilters.operation);
		}
		else{
			getDiruptionsURL = getDiruptionsURL.replace('$Operation', "");
		}
		
		getDiruptionsURL = getDiruptionsURL.replace('$SFC', "");
		getDiruptionsURL = getDiruptionsURL.replace('$OperationRevision', "");
		getDiruptionsURL = getDiruptionsURL.replace('$SignalFlag', "");
		getDiruptionsURL = getDiruptionsURL.replace('$FromDate', "");
		getDiruptionsURL = getDiruptionsURL.replace('$ToDate', ""); 
		
		if(oFilters.station != undefined && oFilters.station != ""){
			getDiruptionsURL = getDiruptionsURL.replace('$WorkCenter', oFilters.station);
			airbus.mes.disruptiontracker.oView.byId("stationComboBox").setSelectedKey(oFilters.station);
		}
		else{
			getDiruptionsURL = getDiruptionsURL.replace('$WorkCenter', "");
			airbus.mes.disruptiontracker.oView.byId("stationComboBox").setSelectedKey("");
		}
		
	  getDiruptionsURL = getDiruptionsURL.replace('$userGroup', "");
		getDiruptionsURL = getDiruptionsURL.replace('$MessageType', "");
		
		oViewModel.loadData(getDiruptionsURL, null, false);

	}
	
}

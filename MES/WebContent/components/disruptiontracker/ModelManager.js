//"use strict";
jQuery.sap.declare("airbus.mes.disruptiontracker.ModelManager")
airbus.mes.disruptiontracker.ModelManager = {
	urlModel : undefined,
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {
		
		core.setModel(new sap.ui.model.json.JSONModel(), "tableData");//Model having disruptions detail
		core.setModel(new sap.ui.model.json.JSONModel(), "filterData");
		core.setModel(new sap.ui.model.json.JSONModel(), "orderData");
		core.setModel(new sap.ui.model.resource.ResourceModel({bundleName:"airbus.mes.disruptiontracker.i18n.i18n",bundleLocale:"en"}), 
														 "disruptiontrackerI18n");


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

		this.urlModel = new sap.ui.model.resource.ResourceModel(
				{
					bundleUrl : "../components/disruptiontracker/config/url_config.properties",
					bundleLocale : dest
				});
		
		this.loadDisruptionFilterModel();
		this.loadDisruptionOrderModel();
		this.loadDisruptionListModel();
	},
	
	loadDisruptionFilterModel : function() {
		var oViewModel = sap.ui.getCore().getModel("filterData");
		oViewModel.loadData(this.urlModel.getProperty("urlfiltermodel"), null, false);

	},
	
	loadDisruptionOrderModel : function() {
		var oViewModel = sap.ui.getCore().getModel("orderData");
		oViewModel.loadData(this.urlModel.getProperty("urlordermodel"), null, false);

	},
	
	loadDisruptionListModel : function() {
		var oViewModel = sap.ui.getCore().getModel("tableData");
		oViewModel.loadData(this.urlModel.getProperty("urllistmodel"), null, false);

	}

	/*loadDisruptionTracker : function(sType) {
		
		//Model for disruptions list data in table
		var oViewModel_1=  new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oViewModel_1,"tableData");
		sap.ui.getCore().getModel("tableData").loadData("data/table.json",null,false);
		
		//Model for disruptions filter data in ComboBox
		var oViewModel_2=  new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oViewModel_2,"filterData");
		sap.ui.getCore().getModel("filterData").loadData("data/filter.json",null,false);
		
		//Model for disruptions order data in ComboBox
		var oViewModel_3=  new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oViewModel_3,"orderData");
		sap.ui.getCore().getModel("orderData").loadData("data/order.json",null,false);

	}*/
	
}

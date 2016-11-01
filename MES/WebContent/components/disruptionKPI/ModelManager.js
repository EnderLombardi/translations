//"use strict";
jQuery.sap.declare("airbus.mes.disruptionKPI.ModelManager")
airbus.mes.disruptionKPI.ModelManager = {
	urlModel : undefined,
	queryParams : jQuery.sap.getUriParameters(),

	init : function(core) {
		
		core.setModel(new sap.ui.model.json.JSONModel(), "TimeLostperCategory");//Model having disruptionKPI category detail
		core.setModel(new sap.ui.model.json.JSONModel(), "TimeLostperReason");
		core.setModel(new sap.ui.model.json.JSONModel(), "TimeLostperOperation");
		core.setModel(new sap.ui.model.json.JSONModel(), "TimeLostperMSN");
//		core.setModel(new sap.ui.model.resource.ResourceModel({bundleName:"airbus.mes.disruptiontracker.i18n.i18n",bundleLocale:"en"}), 
//														 "disruptiontrackerI18n");


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
					bundleUrl : "../components/disruptionKPI/config/url_config.properties",
					bundleLocale : dest
				});
		
		this.loadDisruptionCategoryModel();
		this.loadDisruptionReasonModel();
		this.loadDisruptionOperationModel();
		this.loadDisruptionmsnModel();
	},
	
	loadDisruptionCategoryModel : function() {
		var oViewModel = sap.ui.getCore().getModel("TimeLostperCategory");
		oViewModel.loadData(this.urlModel.getProperty("urlcategorymodel"), null, false);

	},
	
	loadDisruptionReasonModel : function() {
		var oViewModel = sap.ui.getCore().getModel("TimeLostperReason");
		oViewModel.loadData(this.urlModel.getProperty("urlreasonmodel"), null, false);

	},
	
	loadDisruptionOperationModel : function() {
		var oViewModel = sap.ui.getCore().getModel("TimeLostperOperation");
		oViewModel.loadData(this.urlModel.getProperty("urloperationmodel"), null, false);

	},
	
	loadDisruptionmsnModel : function() {
		var oViewModel = sap.ui.getCore().getModel("TimeLostperMSN");
		oViewModel.loadData(this.urlModel.getProperty("urlmsnmodel"), null, false);

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

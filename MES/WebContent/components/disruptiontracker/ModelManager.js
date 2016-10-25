//"use strict";
jQuery.sap.declare("airbus.mes.disruptiontracker.ModelManager")
airbus.mes.disruptiontracker.ModelManager = {

	i18nModel : undefined,

	init : function(core) {
		
		core.setModel(new sap.ui.model.json.JSONModel(), "tableData");//Model having disruptions detail
		core.setModel(new sap.ui.model.json.JSONModel(), "filterData");
		core.setModel(new sap.ui.model.json.JSONModel(), "orderData");


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
	},

	loadDisruptionTracker : function(sType) {
		
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

	}
	
}

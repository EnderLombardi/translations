jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.model.resource.ResourceModel");
jQuery.sap.require("sap.ui.base.Event");
jQuery.sap.require("airbus.mes.polypoly.ModelManager");
jQuery.sap.require("airbus.mes.polypoly.PolypolyManager");

jQuery.sap.declare("airbus.mes.polypoly.Component");

sap.ui.core.UIComponent.extend("airbus.mes.polypoly.Component", {
	metadata : {
		properties : {},
		includes : [ "./css/polypoly.css" ] //array of css and/or javascript files that should be used in the component   

	},
	//manifestUrl : "component.json",
});

airbus.mes.polypoly.Component.prototype.createContent = function() {

//	var oModel = new sap.ui.model.json.JSONModel();
//	this.setModel(oModel, "buttonUrl");
//	oModel.loadData("../components/homepage/data/url.json", null, false);

	if (airbus.mes.polypoly.oView === undefined) {
		//	View on XML
		airbus.mes.polypoly.ModelManager.init(this);
		airbus.mes.polypoly.PolypolyManager.init(this);
		airbus.mes.polypoly.PolypolyManager.getPolypolyModel("F1","1","10","CHES");
		var page = sap.ui.view({
			id : "polypoly",
			viewName : "airbus.mes.polypoly.polypoly",
			type : sap.ui.core.mvc.ViewType.XML
		});
		airbus.mes.polypoly.PolypolyManager.onModelLoaded();

		airbus.mes.polypoly.oView = page;
		
		//Bind model
		var oData = sap.ui.getCore().getModel("mii").getData().Rowsets;
		if (oData.Rowset && oData.Rowset.length > 0 && oData.Rowset[0].Row) {
			var oMiiData = sap.ui.getCore().getModel("mii").getData();
			var oTableData = airbus.mes.polypoly.PolypolyManager.createTableData(oMiiData);
			var mTableModel = new sap.ui.model.json.JSONModel(oTableData);
			sap.ui.getCore().setModel(mTableModel, "mTableModel");
			airbus.mes.polypoly.PolypolyManager.internalContext.oModel = mTableModel;
		} 
		else {
			var mTableModel = new sap.ui.model.json.JSONModel();

			}
		
		sap.ui.getCore().byId("polypoly").setModel(sap.ui.getCore().getModel("mTableModel"));
//		var i18nModel = new sap.ui.model.resource.ResourceModel({
//	        bundleUrl : "../components/homepage/i18n/i18n.properties",
////	        bundleLocale : "en" automatic defined by parameter sap-language
//	     });
		
//		this.oView.setModel(i18nModel, "i18n");		
		
		return page;

	}

};


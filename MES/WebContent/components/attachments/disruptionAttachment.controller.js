"use strict";
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel'
], function(Controller,JSONModel) {
	

	return Controller.extend("airbus.mes.attachments.disruptionAttachment", {
		onInit: function(){
			var x = this.getView().byId("idPanel");
			var oModel = new sap.ui.model.json.JSONModel("local/DisruptionList.json");
			sap.ui.getCore().setModel(oModel);	
		},
		onNavPress: function(){
			this.nav = this.getView().oParent;
			this.nav.back();
		}

	});
});

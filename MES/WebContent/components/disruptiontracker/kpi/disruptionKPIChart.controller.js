sap.ui.controller("airbus.mes.disruptiontracker.kpi.disruptionKPIChart", {

	/* ============================================================ */
	/* Life-cycle Handling                                          */
	/* ============================================================ */
	/**
	 * Method called when the application is initalized.
	 *
	 * @public
	 */
	onInit : function() {	
		var vizframe1 = this.getView().byId("vizFrame");
		vizframe1.setVizProperties({
            title : { 
					visible : true, 
					text : 'Lost Time (minutes) per Category'
					} 
	            });
		
//		For Reason
		var oViewModel_2=  new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oViewModel_2,"TimeLostperReason");
		sap.ui.getCore().getModel("TimeLostperReason").loadData("../components/disruptiontracker/kpi/data/timelostperReason.json",null,false);
		this.getView().setModel(oViewModel_2);
		
		var vizframe2 = this.getView().byId("vizFrame2");
		vizframe2.setVizProperties({
            title : { 
					visible : true, 
					text : 'Lost Time (minutes) per Reason'
					} 
	            });
				
//		For Operation {i18n>frame3Title}
		var oViewModel_3=  new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oViewModel_3,"TimeLostperOperation");
		sap.ui.getCore().getModel("TimeLostperOperation").loadData("../components/disruptiontracker/kpi/data/timelostperOperation.json",null,false);		
		this.getView().setModel(oViewModel_3);
		
		var vizframe3 = this.getView().byId("vizFrame3");
		vizframe3.setVizProperties({
            title : { 
					visible : true, 
					text : 'Lost Time (minutes) per Operation'
					} 
	            });
		
//		For MSN
		var oViewModel_4=  new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oViewModel_4,"TimeLostperMSN");
		sap.ui.getCore().getModel("TimeLostperMSN").loadData("../components/disruptiontracker/kpi/data/timelostperMSN.json",null,false);		
		this.getView().setModel(oViewModel_4);
		
		var vizframe4 = this.getView().byId("vizFrame4");
		vizframe4.setVizProperties({
            title : { 
					visible : true, 
					text : 'Lost Time (minutes) per MSN'
					} 
	            });
		
		
	},
	
	onNavBack: function(oEvent){
		nav.back();
	}


});
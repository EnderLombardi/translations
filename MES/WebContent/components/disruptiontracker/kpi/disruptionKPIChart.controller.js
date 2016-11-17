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

//     Title For Category
		var vizframe1 = this.getView().byId("vizFrame");
		vizframe1.setVizProperties({
            title : { 
					visible : true, 
					text : 'Lost Time (minutes) per Category'
					} 
	            });
	
		
		
//		Title For Reason
		var vizframe2 = this.getView().byId("vizFrame2");
		vizframe2.setVizProperties({
            title : { 
					visible : true, 
					text : 'Lost Time (minutes) per Reason'
					} 
	            });
				
//		Title For Operation 
		var vizframe3 = this.getView().byId("vizFrame3");
		vizframe3.setVizProperties({
            title : { 
					visible : true, 
					text : 'Lost Time (minutes) per Operation'
					} 
	            });
		
//		Title For MSN
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
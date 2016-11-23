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
			},
			
			general: {
				layout: {
					padding : 2
				}
			},
			
			categoryAxis: {
				title: {
					visible: true
				},
				
				label : {
					visible : true,
					truncatedLabelRatio: 1,
					angle : 0,
					linesOfWrap : 4,
					style: {
						fontSize: "10px"
					}
				}
			},
		});
	
		
		
//		Title For Reason
		var vizframe2 = this.getView().byId("vizFrame2");
		vizframe2.setVizProperties({
			title : { 
				visible : true, 
				text : 'Lost Time (minutes) per Reason'
			},
			
			general: {
				layout: {
					padding : 2
				}
			},

			categoryAxis: {
				title: {
					visible: true
				},
				label : {
					visible : true,
					truncatedLabelRatio: 1,
					angle : 0,
					linesOfWrap : 4,
					style: {
						fontSize: "10px"
					}
				}
			},
		});
				
//		Title For Operation 
		var vizframe3 = this.getView().byId("vizFrame3");
		vizframe3.setVizProperties({
			title : { 
				visible : true, 
				text : 'Lost Time (minutes) per Operation'
			},
			general: {
				layout: {
					padding : 2
				}
			},
		});
		
//		Title For MSN
		var vizframe4 = this.getView().byId("vizFrame4");
		vizframe4.setVizProperties({
			title : { 
				visible : true, 
				text : 'Lost Time (minutes) per MSN'
			},
			general: {
				layout: {
					padding : 2
				}
			},
		});
		
		
	},
	
	onNavBack: function(oEvent){
		nav.back();
	}


});
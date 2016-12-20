"use strict";
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

		window.onresize = this.resize;
		  // Set Model (i18n) for Frame Titles
		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl : "../components/disruptiontracker/kpi/i18n/i18n.properties"
	     });
		this.oView.setModel(i18nModel, "i18n"); 		
		airbus.mes.disruptiontracker.kpi.oView = this.oView 
//     Title For Category
		var vizframe1 = this.getView().byId("vizFrame");
		vizframe1.setVizProperties({
			title : { 
				visible : true, 
				text : airbus.mes.disruptiontracker.kpi.oView.getModel("i18n").getProperty("frame1Title")
			},
			
			plotArea: {
                dataLabel: {
                    visible: true
                }
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
				text : airbus.mes.disruptiontracker.kpi.oView.getModel("i18n").getProperty("frame2Title")
			},
			
			plotArea: {
                dataLabel: {
                    visible: true
                }
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
				text : airbus.mes.disruptiontracker.kpi.oView.getModel("i18n").getProperty("frame3Title")
			},
			plotArea: {
                dataLabel: {
                    visible: true
                }
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
				text : airbus.mes.disruptiontracker.kpi.oView.getModel("i18n").getProperty("frame4Title")
			},
			plotArea: {
                dataLabel: {
                    visible: true
                }
            },
            
            general: {
				layout: {
					padding : 2
				}
			},
		});
		
		
	},
	onAfterRendering : function(){
		this.resize();
		
	}, 
	resize: function(){
		 if(window.innerWidth <= 1022){
			 sap.ui.getCore().byId("disruptionKPIView--divider1").setVisible(true);
			 sap.ui.getCore().byId("disruptionKPIView--divider4").setVisible(true);
			 sap.ui.getCore().byId("disruptionKPIView--divider3").setVisible(false);
		 }else{
			 sap.ui.getCore().byId("disruptionKPIView--divider1").setVisible(false);
			 sap.ui.getCore().byId("disruptionKPIView--divider4").setVisible(false);
			 sap.ui.getCore().byId("disruptionKPIView--divider3").setVisible(true);
		 }
		},
	
	onNavBack: function(oEvent){
		nav.back();
	}


});
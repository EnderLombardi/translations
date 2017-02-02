"use strict";
sap.ui.controller("airbus.mes.disruptionkpi.disruptionKPIChart", {

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
		  // Set Model (i18nModel) for Frame Titles
		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleName : "airbus.mes.disruptionkpi.i18n.i18n"
	     });
		this.oView.setModel(i18nModel, "i18nModel"); 		
		airbus.mes.disruptionkpi.oView = this.oView 
//     Title For Category
		var vizframe1 = this.getView().byId("vizFrame");
		vizframe1.setVizProperties({
			title : { 
				visible : true, 
				text : airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("frame1Title")
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
				text : airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("frame2Title")
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
				text : airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("frame3Title")
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
				text : airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("frame4Title")
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
	
	
	changeSelection: function(oEvt){
		
		var id = oEvt.getSource().getId().split("--")[1];

 	   	switch(id){
 	   
	 	   	case "lineComboBox":
				var sLine = this.getView().byId("lineComboBox").getSelectedKey();
				
				airbus.mes.disruptionkpi.ModelManager.oFilters.line = sLine;

				var aFilters = [];
				if(sLine != "All")
					aFilters.push(new sap.ui.model.Filter("line", sap.ui.model.FilterOperator.EQ, sLine));

				this.getView().byId("stationComboBox").removeAllSelectedItems();
				this.getView().byId("stationComboBox").getBinding("items").filter(aFilters);
				
				break;
				
	 	   	case "stationComboBox":
	 	   		airbus.mes.disruptionkpi.ModelManager.oFilters.station = sap.ui.getCore().byId("disruptionKPIView--stationComboBox").getSelectedKeys();
	 	   		break;
	 	   	
	 	   	case "timeUnit":
	 	   		airbus.mes.disruptionkpi.ModelManager.oFilters.timeUnit = sap.ui.getCore().byId("disruptionKPIView--timeUnit").getSelectedKey();
	 	   		break;
	 	   		break;
 	   	}
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

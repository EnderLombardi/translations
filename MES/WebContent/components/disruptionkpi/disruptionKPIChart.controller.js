sap.ui.define(["sap/ui/core/mvc/Controller", "sap/viz/ui5/DualCombination", "sap/viz/ui5/format/ChartFormatter"], function(Controller, DualCombination, ChartFormatter) {
	"use strict";
		
		
	return Controller.extend("airbus.mes.disruptionkpi.disruptionKPIChart",{

	/**
	 * Method called when the application is initalized.
	 *
	 * @public
	 */
	onInit : function() {	

		// Set Model (i18nModel) for Frame Titles
		var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleName : "airbus.mes.disruptionkpi.i18n.i18n"
	     });
		this.oView.setModel(i18nModel, "i18nModel"); 		
		airbus.mes.disruptionkpi.oView = this.oView;
		
		/******************************************
		 * Initialize Pareto chart for Time Lost Per Couple Category and Reason
		 */
		/*var oParetto = this.oVizFrame = this.getView().byId("idParettoCategoryReason");
		var sum = 0;
		var fValue = 0;
		var oTotal = 0;
		var FIORI_PERCENTAGE_FORMAT_2 = "__UI5__PercentageMaxFraction2";
		var chartFormatter = ChartFormatter
				.getInstance();
		chartFormatter
				.registerCustomFormatter(
						FIORI_PERCENTAGE_FORMAT_2,
						function(value) {
							var percentage = sap.ui.core.format.NumberFormat
									.getPercentInstance({
										style : 'precent',
										maxFractionDigits : 0
									});
							var val = value;
							return percentage
									.format(value / 100);
						});
		
		sap.viz.api.env.Format
				.numericFormatter(chartFormatter);
		var oDataset = sap.viz.ui5.data
				.FlattenedDataset({
					dimensions : [
							{
								axis : 1,
								name : "Reason",
								value : "{Model>Disruptions}"
							},
							{
								axis : 2,
								name : "Value",
								value : "{Model>Value}"
							} ],
					measures : [
							{
								name : "Time Lost",
								value : "{Model>Occurrences}"
							},
							{
								name : "Percent",
								value : {
									path : "Model>Value",
									formatter : function(
											fValue) {
										if (fValue !== null) {
											if (oTotal === undefined) {
												var oTotal = 0;
												var lolength = this
														.getModel("Model").oData.Rowsets.Rowset[0].Row.length;
												for (var i = 0; i < lolength; i++) {
													var val = this
															.getModel("Model").oData.Rowsets.Rowset[0].Row[i].Value;
													var oTotal = oTotal
															+ val;
												}
											}
											sum = sum
													+ fValue;
											var Total = (sum / oTotal) * 100;
											var oTol = Math
													.round(Total * 10) / 10;
											return (oTol);
										}
									}
								}
							} ],
					data : {
						path : "Model>/Rowsets/Rowset/0/Row"
					}
				});
		oParetto.setDataset(oDataset);
		oParetto
				.setVizType('dual_stacked_combination');
		// oParetto.setvizScales({});
		oParetto
				.setVizProperties({
		
					plotArea : {
						secondaryScale : {
							fixedRange : true,
							maxValue : 100,
							minValue : 0
						},
						dataLabel : {
							visible : true
						},
						dataShape : {
							primaryAxis : [ "bar" ],
							secondaryAxis : [ "line" ]
						}
					},
					categoryAxis : {
		
						label : {
							hideSubLevels : false,
						}
					},
					valueAxis : {},
					valueAxis2 : {
		
						label : {
							visible : true,
							formatString : FIORI_PERCENTAGE_FORMAT_2
						}
					},
					title : {
						visible : "true",
						text : "Profit & Measure By Region & Company"
					}
				});
		var feedValueAxis1 = new sap.viz.ui5.controls.common.feeds.FeedItem(
				{
					'uid' : "valueAxis",
					'type' : "Measure",
					'values' : [ "Time Lost" ]
				}), feedValueAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem(
				{
					'uid' : "valueAxis2",
					'type' : "Measure",
					'values' : [ "Percent" ]
				}), feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem(
				{
					'uid' : "categoryAxis",
					'type' : "Dimension",
					'values' : [ "Reason", "Value" ]
				});
		oParetto.addFeed(feedValueAxis1);
		oParetto.addFeed(feedValueAxis2);
		oParetto.addFeed(feedCategoryAxis);*/
		
		
		
		/*// Title For Category
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
	
		
		
		//	Title For Reason
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
		});*/
		
				
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
	
	
	onChangeSelection: function(oEvt){
		
		var id = oEvt.getSource().getId().split("--")[1];
		var oView = this.getView();

 	   	switch(id){
 	   
	 	   	case "lineComboBox":
				var sLine = oView.byId("lineComboBox").getSelectedKey();
				
				airbus.mes.disruptionkpi.ModelManager.oFilters.line = sLine;

				var aFilters = [];
				if(sLine != "All")
					aFilters.push(new sap.ui.model.Filter("line", sap.ui.model.FilterOperator.EQ, sLine));

				oView.byId("stationComboBox").removeAllSelectedItems();
				oView.byId("stationComboBox").getBinding("items").filter(aFilters);
				
				break;
				
	 	   	case "stationComboBox":
	 	   		airbus.mes.disruptionkpi.ModelManager.oFilters.station = oView.byId("stationComboBox").getSelectedKeys();
	 	   		break;
	 	   		
	 	   	case "startDateTime":
				var oTime = oView.byId("startDateTime").getDateValue();
				if(oTime == ""){
					oView.byId("startDateTime").focus();
					airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("startDateNoEmpty"));
					return;
				}
					
	 	   		airbus.mes.disruptionkpi.ModelManager.oFilters.startDateTime = oTime;
				break;
	 	   		
	 	   	case "endDateTime":
				var oTime = oView.byId("endDateTime").getDateValue();
				if(oTime == ""){
					airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("endDateNoEmpty"));
					oView.byId("endDateTime").focus();
					return;
				}
				
				airbus.mes.disruptionkpi.ModelManager.oFilters.endDateTime = oTime;
				break;
	 	   	
	 	   	case "timeUnit":
	 	   		airbus.mes.disruptionkpi.ModelManager.oFilters.timeUnit = oView.byId("timeUnit").getSelectedKey();
	 	   		break;
 	   	}
	},
	
	resize: function(){
		 if(window.innerWidth <= 1022){
			 //sap.ui.getCore().byId("disruptionKPIView--divider1").setVisible(true);
			 sap.ui.getCore().byId("disruptionKPIView--divider4").setVisible(true);
			 //sap.ui.getCore().byId("disruptionKPIView--divider3").setVisible(false);
		 }else{
			 //sap.ui.getCore().byId("disruptionKPIView--divider1").setVisible(false);
			 sap.ui.getCore().byId("disruptionKPIView--divider4").setVisible(false);
			 //sap.ui.getCore().byId("disruptionKPIView--divider3").setVisible(true);
		 }
	},
	
	onNavBack: function(oEvent){
		nav.back();
	},
	
	onAfterRendering: function(oEvent){
        
        document.getElementById("disruptionKPIView--startDateTime-inner").disabled = true
        document.getElementById("disruptionKPIView--endDateTime-inner").disabled = true
	}

	});
});

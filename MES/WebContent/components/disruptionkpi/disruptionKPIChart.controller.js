"use strict";
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/viz/ui5/DualCombination", "sap/viz/ui5/format/ChartFormatter"], function(Controller, DualCombination, ChartFormatter) {
	
		
		
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
		var oParetto = this.getView().byId("idParettoCategoryReason");
		
		var FIORI_PERCENTAGE_FORMAT_2 = "__UI5__PercentageMaxFraction2";
		
		var chartFormatter = ChartFormatter.getInstance();
		chartFormatter.registerCustomFormatter(
			FIORI_PERCENTAGE_FORMAT_2,
			function(value) {
				var percentage = sap.ui.core.format.NumberFormat.getPercentInstance({
					style : 'precent',
					maxFractionDigits : 0
				});

				return percentage.format(value / 100);
		});
		
		
		sap.viz.api.env.Format.numericFormatter(chartFormatter);
		
		var oDataset = this.getFlattenedDataSet();
				
		oParetto.setDataset(oDataset);
		oParetto.setVizType('dual_stacked_combination')
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
							hideSubLevels : false
						}
					},
					valueAxis  : {},
					valueAxis2 : {
						label  : {
							visible : true,
							formatString : FIORI_PERCENTAGE_FORMAT_2
						}
					},
					title : {
						visible : "true",
						text : airbus.mes.disruptionkpi.oView.getModel("i18nModel").getProperty("Pareto1Title")
					}
				});
		
		i18nModel = this.getView().getModel("i18nModel");
		var feedValueAxis1 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid' : "valueAxis",
				'type' : "Measure",
				'values' : [ "Time Lost" ]
			}), 
			feedValueAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid' : "valueAxis2",
				'type' : "Measure",
				'values' : [ "Percent" ]
			}), 
			feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid' : "categoryAxis",
				'type' : "Dimension",
				'values' : [ "Category Per Reason", "Number of Disruptions" ]
			});
		oParetto.addFeed(feedValueAxis1);
		oParetto.addFeed(feedValueAxis2);
		oParetto.addFeed(feedCategoryAxis);
		
		
		var oPopover = new sap.viz.ui5.controls.Popover({});
		oPopover.connect(oParetto.getVizUid());
		
		
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
	
	getFlattenedDataSet: function(){
		return new sap.viz.ui5.data.FlattenedDataset({
			dimensions : [
							{
								axis : 1,
								name : "Category Per Reason",
								value : "{ParetoChartModel>categoryReason}",
							},
							{
								axis : 2,
								name : "Number of Disruptions",
								value : "{ParetoChartModel>totalDisruption}"
							} ],
			measures : [
							{
								name : "Time Lost",
								value : {
									path : "ParetoChartModel>timeLost",
									formatter : function(ms) {
										var unit  = sap.ui.getCore().byId("disruptionKPIView--timeUnit").getSelectedKey();
										if (ms != '' && ms != undefined) {
											if (unit === "Minutes")
												return ms / 60000.0;
											else if (unit === "Hours")
												return ms / 3600000.0;
										}
										return 0;
									}
								}
							},
							{
								name : "Percent",
								value : "{ParetoChartModel>cumulativePercentage}"
							}
						],
			data : "{ParetoChartModel>/data}"
		});
	},
	
	onToggleDisruptions : function(oEvent) {
		var oVizFrame = this.getView().byId("idParettoCategoryReason");
		
		if (oVizFrame) {
			var state = oEvent.getParameter('state');
			
			oVizFrame.setVizProperties({
				categoryAxis: {
					label: {
						hideSubLevels: !state
					}
				},
			});
		}
	},
	
	onChangeSelection: function(oEvt){
		
		var id = oEvt.getSource().getId().split("--")[1];
		var oView = this.getView();
		
 	   	switch(id) {
 	   	
 	   		case "lineComboBox":
				var sLine = oView.byId("lineComboBox").getSelectedKey();
				
				airbus.mes.disruptionkpi.ModelManager.oFilters.line = sLine;

				oView.byId("stationComboBox").removeAllSelectedItems();

				airbus.mes.disruptionkpi.ModelManager.removeDuplicateStations();
				airbus.mes.disruptionkpi.ModelManager.loadDisruptionKPIModel();
				
				break;
				
	 	   	case "stationComboBox":
	 	   		airbus.mes.disruptionkpi.ModelManager.oFilters.station = oView.byId("stationComboBox").getSelectedKeys();
				
				airbus.mes.disruptionkpi.ModelManager.loadDisruptionKPIModel();
				
	 	   		break;
	 	   		
	 	   	case "startDateTime":
				var oTime = oView.byId("startDateTime").getDateValue();
				if(oTime == null){
					oView.byId("startDateTime").focus();
					airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("startDateNoEmpty"));
					return;
				} else if (oTime > oView.byId("endDateTime").getDateValue()) {
					
					var sMessageError = this.getView().getModel("i18nModel").getProperty("wrongDateRange");
					airbus.mes.shell.ModelManager.messageShow(sMessageError);
					return false;
				}
				
	 	   		airbus.mes.disruptionkpi.ModelManager.oFilters.startDateTime = oTime;
				
				airbus.mes.disruptionkpi.ModelManager.loadDisruptionKPIModel();
				
				break;
	 	   		
	 	   	case "endDateTime":
				var oTime = oView.byId("endDateTime").getDateValue();
				if(oTime == null){
					airbus.mes.shell.ModelManager.messageShow(oView.getModel("i18nModel").getProperty("endDateNoEmpty"));
					oView.byId("endDateTime").focus();
					return;
				} else if (oView.byId("startDateTime").getDateValue() > oTime) {
					
					var sMessageError = this.getView().getModel("i18nModel").getProperty("wrongDateRange");
					airbus.mes.shell.ModelManager.messageShow(sMessageError);
					return false;
				}
				
				airbus.mes.disruptionkpi.ModelManager.oFilters.endDateTime = oTime;
				
				airbus.mes.disruptionkpi.ModelManager.loadDisruptionKPIModel();
				
				break;
	 	   	
	 	   	case "timeUnit":
	 	   		airbus.mes.disruptionkpi.ModelManager.oFilters.timeUnit = oView.byId("timeUnit").getSelectedKey();
	 	   		// Re-Set Dataset
	 	   		this.getView().byId("idParettoCategoryReason").setDataset(this.getFlattenedDataSet());
	 	   		
	 	   		sap.ui.getCore().byId("disruptionKPIView").getModel("TimeLostperAttribute").refresh(true)
	 	   		
	 	   		break;
	 	   		
	 	   	default: break;
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
		this.resize();
	}

	});
});

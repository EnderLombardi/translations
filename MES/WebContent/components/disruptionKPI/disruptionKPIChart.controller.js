sap.ui.controller("airbus.mes.disruptionKPI.disruptionKPIChart", {



	/* ============================================================ */
	/* Life-cycle Handling                                          */
	/* ============================================================ */
	/**
	 * Method called when the application is initalized.
	 *
	 * @public
	 */
	onInit : function() {
		
//		comment the first and run the second ok
//		For Category
		var oViewModel_1=  new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oViewModel_1,"TimeLostperCategory");
		sap.ui.getCore().getModel("TimeLostperCategory").loadData("../components/disruptionKPI/data/timelostperCategory.json",null,false);
		
		this.getView().setModel(oViewModel_1);
		var oPage = this.getView().byId("page");
		
		var oVizFrame = this.getView().byId("vizFrame");
		oVizFrame.setVizProperties({

				title : {
				visible :"true",
				text : "Lost Time (minutes) per Category"
				
			},			

		});
		
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
		 	dimensions: [{
		 		name: 'Category',
				axis : 1,
		 		value: "{Category}"
		 	}
		 		],
		 	measures: [
		 		{
		 			name: 'Time Lost', 
						 axis : 1,
		 			value: '{Time Lost}' 
		 		}
		 	],
		 	data: {
		 		path: "/businessData"
		 	}
		 });
		
		oVizFrame.setDataset(oDataset);
		oVizFrame.setModel(oViewModel_1);

		var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : "primaryValues",
			'type' : "Measure",
			'values' : ["Time Lost"]
		});

		var feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : "axisLabels",
			'type' : "Dimension",
			'values' : ["Category"]
		
		});

		oVizFrame.addFeed(feedPrimaryValues);
		oVizFrame.addFeed(feedAxisLabels);
		oPage.addContent(oVizFrame);
		
		
//		For Reason
		var oViewModel_2=  new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oViewModel_2,"TimeLostperReason");
		sap.ui.getCore().getModel("TimeLostperReason").loadData("../components/disruptionKPI/data/timelostperReason.json",null,false);
		
		this.getView().setModel(oViewModel_2);
				
		var oVizFrame2 = this.getView().byId("vizFrame2");
		oVizFrame2.setVizProperties({
				title : {
				visible :"true",
				text : "Lost Time (minutes) per Reason"
				
			},			

		});

		var oDataset2 = new sap.viz.ui5.data.FlattenedDataset({
		 	dimensions: [{
		 		name: 'Reason',
				axis : 1,
		 		value: "{Reason}"
		 	}
		 		],
		 	measures: [
		 		{
		 			name: 'Time Lost', 
						 axis : 1,
		 			value: '{Time Lost}' 
		 		}
		 	],
		 	data: {
		 		path: "/businessData1"
		 	}
		 });
		
		oVizFrame2.setDataset(oDataset2);
		oVizFrame2.setModel(oViewModel_2);

		var feedPrimaryValues1 = new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : "primaryValues",
			'type' : "Measure",
			'values' : ["Time Lost"]
		});

		var feedAxisLabels1 = new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : "axisLabels",
			'type' : "Dimension",
			'values' : ["Reason"]
		
		});

		oVizFrame2.addFeed(feedPrimaryValues1);
		oVizFrame2.addFeed(feedAxisLabels1);
		oPage.addContent(oVizFrame2);
		
		
//		For Operation
		var oViewModel_3=  new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oViewModel_3,"TimeLostperOperation");
		sap.ui.getCore().getModel("TimeLostperOperation").loadData("../components/disruptionKPI/data/timelostperOperation.json",null,false);
		
		this.getView().setModel(oViewModel_3);
				
		var oVizFrame3 = this.getView().byId("vizFrame3");
		oVizFrame3.setVizProperties({

				title : {
				visible :"true",
				text : "Lost Time (minutes) per Operation"
				
			},			

		});

		var oDataset3 = new sap.viz.ui5.data.FlattenedDataset({
		 	dimensions: [{
		 		name: 'Operation',
				axis : 1,
		 		value: "{Operation}"
		 	}
		 		],
		 	measures: [
		 		{
		 			name: 'Time Lost', 
						 axis : 1,
		 			value: '{Time Lost}' 
		 		}
		 	],
		 	data: {
		 		path: "/LostTimeperOperation"
		 	}
		 });
		
		oVizFrame3.setDataset(oDataset3);
		oVizFrame3.setModel(oViewModel_3);

		var feedPrimaryValues3 = new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : "primaryValues",
			'type' : "Measure",
			'values' : ["Time Lost"]
		});

		var feedAxisLabels3 = new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : "axisLabels",
			'type' : "Dimension",
			'values' : ["Operation"]
		
		});

		oVizFrame3.addFeed(feedPrimaryValues3);
		oVizFrame3.addFeed(feedAxisLabels3);
		oPage.addContent(oVizFrame3);
		
//		For MSN
		var oViewModel_4=  new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oViewModel_4,"TimeLostperMSN");
		sap.ui.getCore().getModel("TimeLostperMSN").loadData("../components/disruptionKPI/data/timelostperMSN.json",null,false);
		
		this.getView().setModel(oViewModel_4);
				
		var oVizFrame4 = this.getView().byId("vizFrame4");
		oVizFrame4.setVizProperties({
				title : {
				visible :"true",
				text : "Lost Time (minutes) per Operation"
				
			},			

		});
		var oDataset4 = new sap.viz.ui5.data.FlattenedDataset({
		 	dimensions: [{
		 		name: 'MSN',
				axis : 1,
		 		value: "{MSN}"
		 	}
		 		],
		 	measures: [
		 		{
		 			name: 'Time Lost', 
						 axis : 1,
		 			value: '{Time Lost}' 
		 		}
		 	],
		 	data: {
		 		path: "/LostTimeperMSN"
		 	}
		 });
		
		oVizFrame4.setDataset(oDataset4);
		oVizFrame4.setModel(oViewModel_4);

		var feedPrimaryValues4 = new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : "primaryValues",
			'type' : "Measure",
			'values' : ["Time Lost"]
		});

		var feedAxisLabels4 = new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : "axisLabels",
			'type' : "Dimension",
			'values' : ["MSN"]
		
		});

		oVizFrame4.addFeed(feedPrimaryValues4);
		oVizFrame4.addFeed(feedAxisLabels4);
		oPage.addContent(oVizFrame4);
		

	},


});
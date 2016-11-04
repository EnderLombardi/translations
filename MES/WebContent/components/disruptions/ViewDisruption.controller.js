sap.ui
		.controller(
				"airbus.mes.disruptions.ViewDisruption",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf components.disruptions.ViewDisruption
					 */
					// onInit : function() {
					//	
					// },
					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf components.disruptions.ViewDisruption
					 */
					// onBeforeRendering: function() {
					//
					// },
					/**
					 * Called when the View has been rendered (so its HTML is
					 * part of the document). Post-rendering manipulations of
					 * the HTML could be done here. This hook is the same one
					 * that SAPUI5 controls get after being rendered.
					 * 
					 * @memberOf components.disruptions.ViewDisruption
					 */
					// onAfterRendering: function() {
					//
					// },
					/**
					 * Called when the Controller is destroyed. Use this one to
					 * free resources and finalize activities.
					 * 
					 * @memberOf components.disruptions.ViewDisruption
					 */
					// onExit: function() {
					//
					// },
					applyFiltersOnComments : function() {
						var listItems = this.getView().byId("disrptlist")
								.getItems();
						$
								.each(
										listItems,
										function(key, value) {
											// Apply filters on Message Comments
											var oBinding = value.getContent()[0]
													.getContent()[2]
													.getBinding("items");

											var sPath = value
													.getBindingContext("operationDisruptionsModel");
											var messageRef = sap.ui
													.getCore()
													.getModel(
															"operationDisruptionsModel")
													.getProperty(
															sPath
																	+ "/MessageRef")

											oBinding
													.filter([ new sap.ui.model.Filter(
															"MessageRef", "EQ",
															messageRef) ]);
										});

					},

					/***********************************************************
					 * Open Pop-Up to ask Time Lost while Closing the Disruption
					 */
					onCloseDisruption: function(oEvt){
						var sPath = oEvt.getSource().getParent().getParent().getParent().getBindingContext("operationDisruptionsModel").sPath;
						var messageRef = this.getView().getModel("operationDisruptionsModel").getProperty(sPath+"/MessageRef");
						
						// Call Close Disruption fragment
						if (!this._closeDialog) {

							this._closeDialog = sap.ui.xmlfragment("airbus.mes.disruptions.fragment.closeDisruption",this);

							this.getView().addDependent(this._closeDialog);

						}
						this._closeDialog.open();
					},

					/***********************************************************
					 * Close selected disruption
					 */
					onAcceptCloseDisruption: function(oEvent){
						this._closeDialog.close();
						//	Initialize the inputs							
						sap.ui.getCore().byId("input1").setValue("");
						sap.ui.getCore().byId("closeDisruptionComments").setValue(""); 
					},
					
					/***********************************************************
					 * Close Pop-Up
					 */
					cancelClosingDisruption: function(oEvent){
						this._closeDialog.close();
					},
					
					showCommentBox : function(oEvt) {
						var path = oEvt.getSource().sId;
						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];
						var a = this.getView().byId(
								this.getView().sId + "--commentBox-" +
								this.getView().sId + "--disrptlist-"
										+ listnum);
						a.setVisible(true);

						var b = sap.ui.getCore().byId(path);
						b.setVisible(false);

					},

					hideCommentBox : function(oEvt) {
						var path = oEvt.getSource().sId;
						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];
						var a = this.getView().byId(
								this.getView().sId + "--commentBox-" +
								this.getView().sId + "--disrptlist-"
										+ listnum);
						a.setVisible(false);

						var b = sap.ui.getCore().byId(
								this.getView().sId + "--addComment-" +
								this.getView().sId + "--disrptlist-"
										+ listnum);
						b.setVisible(true);

					},

					submitComment : function(oEvt) {

						// Get Comment Text and Message Reference
						var path = oEvt.getSource().sId;

						var msgRef = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel").getObject(
								"MessageRef");

						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];
						var sComment = this.getView().byId(
								this.getView().sId + "--commentArea-" +
								this.getView().sId + "--disrptlist-" + listnum).getValue();

						var oComment = {
							"MessageRef" : msgRef,
							"Comment" : sComment
						};

						// Call Add comment Service
						airbus.mes.disruptions.ModelManager
								.addComment(oComment);
						
						this.getView().byId(
									this.getView().sId + "--commentArea-" +
									this.getView().sId + "--disrptlist-" + listnum).setValue("");
						

					},

					onMarkSolved : function(oEvt) {
						/*
						 * var path = oEvt.getSource().getBindingContext(
						 * "disruptionModel").getPath();
						 * this.getView().getModel("disruptionModel").setProperty(
						 * path + "/Status", "Solved");
						 * this.getView().getModel("disruptionModel").setProperty(
						 * path + "/commentVisible", "false");
						 * this.getView().getModel("disruptionModel").setProperty(
						 * path + "/message", " ");
						 * oEvt.getSource().setType("Accept");
						 */

					},

					/***********************************************************
					 * Close other panels when one panel is expanded
					 */
					handleDisruptionPanelExpand : function(oevent) {

						if (!oevent.oSource.getExpanded())
							return;
						var disruptions = this.getView().byId("disrptlist");
						$(disruptions.getItems())
								.each(
										function() {
											var currentPanel = this
													.getContent()[0];
											if (oevent.getSource().getId() != currentPanel
													.getId())
												currentPanel.setExpanded(false)
										});

					},

					onEscalate : function(oEvent) {

						var msgRef = oEvent.getSource().getBindingContext(
								"operationDisruptionsModel").getObject(
								"MessageRef");

						airbus.mes.disruptions.ModelManager
								.escalateDisruption(msgRef);
					},

					onReportDisruption : function(oEvent) {

						var oOperDetailNavContainer = sap.ui.getCore().byId(
								"operationDetailsView--operDetailNavContainer");

						if (airbus.mes.operationdetail.createDisruption === undefined
								|| airbus.mes.operationdetail.createDisruption.oView === undefined) {
							sap.ui
									.getCore()
									.createComponent(
											{
												name : "airbus.mes.operationdetail.createDisruption",
											});

							oOperDetailNavContainer
									.addPage(airbus.mes.operationdetail.createDisruption.oView);
						}

						oOperDetailNavContainer
								.to(airbus.mes.operationdetail.createDisruption.oView
										.getId());
					},

					onEditDisruption : function(oEvent) {

						// to auto fill fields on edit screen

						var oTranModel = sap.ui.getCore().getModel(
								"DisruptionModel");

						// set the data for the model
						oTranModel
								.setData(oEvent.getSource().getBindingContext(
										"operationDisruptionsModel"));

						var oOperDetailNavContainer = sap.ui.getCore().byId(
								"operationDetailsView--operDetailNavContainer");

						if (airbus.mes.operationdetail.editDisruption === undefined
								|| airbus.mes.operationdetail.editDisruption.oView === undefined) {
							sap.ui
									.getCore()
									.createComponent(
											{
												name : "airbus.mes.operationdetail.editDisruption",
											});

							oOperDetailNavContainer
									.addPage(airbus.mes.operationdetail.editDisruption.oView);
						}

						oOperDetailNavContainer
								.to(airbus.mes.operationdetail.editDisruption.oView
										.getId());

					},

					onCloseOperationDetailPopup : function() {

						airbus.mes.stationtracker.operationDetailPopup.close();
						airbus.mes.shell.oView.getController()
								.renderStationTracker();						
					}

				});

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
					onInit : function() {
					},
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
						$.each(listItems,
								function(key, value) {
									// Apply filters on Message Comments
									var oBinding = value.getContent()[0]
											.getContent()[2]
											.getBinding("items");

									var messageRef = value.getBindingContext(
											"operationDisruptionsModel")
											.getObject().MessageRef;

									oBinding.filter([ new sap.ui.model.Filter(
											"MessageRef", "EQ", messageRef) ]);
								});

					},

					/***********************************************************
					 * Open Pop-Up to ask Time Lost while Closing the Disruption <<<<<<<
					 * HEAD
					 */
					onCloseDisruption : function(oEvt) {
						var sPath = oEvt.getSource().getParent().getParent()
								.getParent().getBindingContext(
										"operationDisruptionsModel").sPath;
						var msgRef = this.getView().getModel(
								"operationDisruptionsModel").getProperty(
								sPath + "/MessageRef");
						var timeLost = this.getView().getModel(
								"operationDisruptionsModel").getProperty(
								sPath + "/TimeLost");

						// Call Close Disruption fragment
						if (!this._closeDialog) {

							this._closeDialog = sap.ui
									.xmlfragment(
											"airbus.mes.disruptions.fragment.closeDisruption",
											this);

							var title = this.getView().getModel("i18nModel")
									.getProperty("closeDisruption");

							sap.ui.getCore().byId("disruptionCloseDislog")
									.setTitle(title);

							this.getView().addDependent(this._closeDialog);

						}

						sap.ui.getCore().byId("closeDisruption-timeLost")
								.setValue(timeLost);
						sap.ui.getCore().byId("closeDisruption-msgRef")
								.setText(msgRef);

						this._closeDialog.open();
					},

					/***********************************************************
					 * Close selected disruption
					 */
					onAcceptCloseDisruption : function(oEvent) {

						this._closeDialog.close();

						var timeLost = sap.ui.getCore().byId(
								"closeDisruption-timeLost");
						var comment = sap.ui.getCore().byId(
								"closeDisruptionComments");
						var msgRef = sap.ui.getCore().byId(
								"closeDisruption-msgRef");

						var timeLostValue = timeLost.getValue();
						var commentValue = comment.getValue();
						var msgRefValue = msgRef.getText();

						// Initialize the inputs
						timeLost.setValue("");
						comment.setValue("");
						msgRef.setValue("");

						// Call Close Disruption Service
						airbus.mes.disruptions.ModelManager.closeDisruption(
								msgRefValue, commentValue, timeLostValue);

						// Initialize the inputs
						sap.ui.getCore().byId("closeDisruption-timeLost")
								.setValue("");
						sap.ui.getCore().byId("closeDisruptionComments")
								.setValue("");
					},

					/***********************************************************
					 * Close Pop-Up - Closing Disruption Pop-Up
					 */
					cancelClosingDisruption : function(oEvent) {
						this._closeDialog.close();

						var timeLost = sap.ui.getCore().byId(
								"closeDisruption-timeLost");
						var comment = sap.ui.getCore().byId(
								"closeDisruptionComments");
						var msgRef = sap.ui.getCore().byId(
								"closeDisruption-msgRef");

						// Initialize the inputs
						timeLost.setValue("");
						comment.setValue("");
						msgRef.setText("");
					},

					/***********************************************************
					 * Reject the Disruption
					 */
					onRejectDisruption : function(oEvt) {
						// var sPath =
						// oEvt.getSource().getParent().getParent().getParent().getBindingContext("operationDisruptionsModel").sPath;
						// var messageRef =
						// this.getView().getModel("operationDisruptionsModel").getProperty(sPath+"/MessageRef");

						// Call Reject Disruption fragment
						if (!this._rejectDialog) {

							this._rejectDialog = sap.ui
									.xmlfragment(
											"airbus.mes.disruptions.fragment.commentBoxDisruption",
											this);

							var title = this.getView().getModel("i18nModel")
									.getProperty("rejectDisruption");

							sap.ui.getCore().byId("disruptionCommentDialogue")
									.setTitle(title);
							sap.ui
									.getCore()
									.byId("disruptionCommentOK")
									.attachPress(this.onAcceptDisruptionComment);

							this.getView().addDependent(this._rejectDialog);

						}
						this._rejectDialog.open();
					},
					/***********************************************************
					 * Confirming Reject Disruption pop-up
					 */
					onAcceptDisruptionComment : function(oEvent) {
						var rejComment = this.getView().byId(
								"rejectDisruptionComment").getValue();

						sap.ui.getCore().byId("rejectDisruptionComment")
								.setValue("");
						this._rejectDialog.close();

					},
					/***********************************************************
					 * close the Reject Disruption pop-up
					 */
					onCancelDisruptionComment : function(oEvent) {
						sap.ui.getCore().byId("disruptionCommentBox").setValue("");
						this._rejectDialog.close();

					},

					showCommentBox : function(oEvt) {
						var path = oEvt.getSource().sId;
						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];
						var a = this.getView().byId(
								this.getView().sId + "--commentBox-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum);
						a.setVisible(true);

						var b = sap.ui.getCore().byId(path);
						b.setVisible(false);

					},

					hideCommentBox : function(oEvt) {
						var path = oEvt.getSource().sId;
						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];

						var commentBoxId = this.getView().byId(
								this.getView().sId + "--commentBox-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum);

						commentBoxId.setVisible(false);

						var submitCommentId = sap.ui.getCore().byId(
								this.getView().sId + "--addComment-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum);

						submitCommentId.setVisible(true);

					},

					submitComment : function(oEvt) {
						var path = oEvt.getSource().sId;

						var oModel = sap.ui.getCore().getModel("commentsModel");
						oModel
								.loadData(
										"../components/disruptions/local/commentsModel.json",
										null, false);

						var commentsData = oModel.getData();

						var msgRef = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel").getObject(
								"MessageRef");

						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];

						var sComment = this.getView().byId(
								this.getView().sId + "--commentArea-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum).getValue();

						var oComment = {
							"MessageRef" : msgRef,
							"Comment" : sComment
						};

						// Call Add comment Service
						airbus.mes.disruptions.ModelManager
								.addComment(oComment);

						this.getView().byId(
								this.getView().sId + "--commentArea-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum).setValue("");
					},

					onAckDisruption : function() {

						if (!this._commentDialog) {

							this._commentDialog = sap.ui
									.xmlfragment(
											"airbus.mes.disruptions.fragment.commentBoxDisruption",
											this);

							var title = this.getView().getModel("i18nModel")
									.getProperty("ackDisruption");

							sap.ui.getCore().byId("disruptionCommentDialogue")
									.setTitle(title);

							sap.ui.getCore().byId("disruptionCommentOK")
									.attachPress(
											this.onAcceptAckDisruptionComment);

							this.getView().addDependent(this._commentDialog);

						}
						this._commentDialog.open();

					},

					onAcceptAckDisruptionComment : function() {

						var msgRef = sap.ui.getCore().byId(
								"commentDisruption-msgRef").getText();

						var comment = sap.ui.getCore().byId(
								"disruptionCommentBox").getText();
						
						msgRef.setText("");

						// Call to Acknowledge Disruption
						airbus.mes.disruptions.ModelManager.ackDisruption(
								msgRef, comment);
					},

					onMarkSolvedDisruption : function(oEvt) {
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

					operationDisruptionsModel : function(oEvent) {

						var msgRef = oEvent.getSource().getBindingContext(
								"operationDisruptionsModel").getObject(
								"MessageRef");

						airbus.mes.disruptions.ModelManager
								.escalateDisruption(msgRef);
					},

					onReportDisruption : function(oEvent) {
						airbus.mes.operationdetail.oView.setBusy(true); // Set
						// Busy
						// Indicator

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

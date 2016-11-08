jQuery.sap.require("sap.m.MessageBox");

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
					onAfterRendering : function() {
						if (sap.ui.getCore().byId(
								"operationDetailsView--switchOperationModeBtn")
								.getState() == false) {
							this.getView().byId("reportDisruption").setVisible(
									false);
						} else {
							this.getView().byId("reportDisruption").setVisible(
									true);
						}

					},
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
									/** Apply filters on Message Comments * */

									// Get Message Ref from current list
									var messageRef = value.getBindingContext(
											"operationDisruptionsModel")
											.getObject().MessageRef;

									// Get Binding of Comment list in Current
									// List item
									var oBinding = value.getContent()[0]
											.getContent()[2]
											.getBinding("items");
									// Aplly filter
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
						sap.ui.getCore().byId("closeDisruption-sPath").setText(
								sPath);
						sap.ui.getCore().byId("closeDisruptionComments")
								.setValue("");

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

						var i18nModel = this.getView().getModel("i18nModel");

						// Call Close Disruption Service
						var isSuccess = airbus.mes.disruptions.ModelManager
								.closeDisruption(msgRefValue, commentValue,
										timeLostValue, i18nModel);

						if (isSuccess) {
							var sPath = sap.ui.getCore().byId(
									"closeDisruption-sPath").getValue();
							this.getView()
									.getModel("operationDisruptionsModel")
									.getProperty(sPath).Status = airbus.mes.disruptions.Formatter.status.closed;
							this.getView()
									.getModel("operationDisruptionsModel")
									.refresh();
						}
					},

					/***********************************************************
					 * Close Pop-Up - Closing Disruption Pop-Up
					 */
					cancelClosingDisruption : function(oEvent) {
						this._closeDialog.close();
					},

					/***********************************************************
					 * Open the Enter Comment Pop-Up
					 */
					onOpenDisruptionComment : function(title, msgRef, sPath,
							okEvent) {
						// Call Disruption Comment Popup fragment
						if (!airbus.mes.disruptions.__enterCommentDialogue) {
							airbus.mes.disruptions.__enterCommentDialogue = sap.ui
									.xmlfragment(
											"airbus.mes.disruptions.fragment.commentBoxDisruption",
											this);
							this
									.getView()
									.addDependent(
											airbus.mes.disruptions.__enterCommentDialogue);

						}
						sap.ui.getCore().byId("disruptionCommentDialogue")
								.setTitle(title);
						sap.ui.getCore().byId("disruptionCommentMsgRef")
								.setText(msgRef);
						sap.ui.getCore().byId("disruptionCommentSpath")
								.setText(sPath);
						sap.ui.getCore().byId("disruptionCommentBox").setValue(
								"");
						sap.ui.getCore().byId("disruptionCommentOK")
								.attachPress(okEvent);

						airbus.mes.disruptions.__enterCommentDialogue.open();
					},

					/***********************************************************
					 * Close the Enter Comment Pop-Up
					 */
					onCloseDisruptionComment : function(oEvent) {
						sap.ui.getCore().byId("disruptionCommentBox").setValue(
								"");
						airbus.mes.disruptions.__enterCommentDialogue.close();

					},

					/***********************************************************
					 * Delete the Disruption
					 */
					onDeleteDisruption : function(oEvt) {

						var title = this.getView().getModel("i18nModel")
								.getProperty("deleteDisruption");
						var msgRef = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel").getObject(
								"MessageRef");
						var sPath = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel").sPath;

						this.onOpenDisruptionComment(title, msgRef, sPath,
								this.onConfirmDelete);

					},
					/***********************************************************
					 * Confirming Delete Disruption
					 */
					onConfirmDelete : function(oEvent) {
						var comment = sap.ui.getCore().byId(
								"disruptionCommentBox").getValue();
						var msgref = sap.ui.getCore().byId(
								"disruptionCommentMsgRef").getText();
						var i18nModel = this.getView().getModel("i18nModel");

						// Call Disruption Service
						var isSuccess = airbus.mes.disruptions.ModelManager
								.rejectDisruption(comment, msgref, i18nModel);

						airbus.mes.disruptions.__enterCommentDialogue.close();

						if (isSuccess) {
							var sPath = sap.ui.getCore().byId(
									"disruptionCommentSpath").getValue();
							this.getView()
									.getModel("operationDisruptionsModel")
									.getProperty(sPath).Status = airbus.mes.disruptions.Formatter.status.rejected;
							this.getView()
									.getModel("operationDisruptionsModel")
									.refresh();
						}

					},

					/***********************************************************
					 * Reject the Disruption
					 */
					onRejectDisruption : function(oEvt) {

						var status = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel")
								.getObject("Status");

						if (status == airbus.mes.disruptions.Formatter.status.pending) {

							sap.m.MessageBox
									.error(this.getView().getModel("i18nModel").getProperty("disruptionNotAckError"));

						} else {

							var title = this.getView().getModel("i18nModel")
									.getProperty("rejectDisruption");
							var msgRef = oEvt.getSource().getBindingContext(
									"operationDisruptionsModel").getObject(
									"MessageRef");
							var sPath = oEvt.getSource().getBindingContext(
									"operationDisruptionsModel").sPath;

							this.onOpenDisruptionComment(title, msgRef, sPath,
									this.onConfirmRejection);

						}

					},
					
					/***********************************************************
					 * Confirming Reject Disruption
					 */
					onConfirmRejection : function(oEvent) {
						var comment = sap.ui.getCore().byId(
								"disruptionCommentBox").getValue();
						var msgref = sap.ui.getCore().byId(
								"disruptionCommentMsgRef").getText();
						var i18nModel = this.getView().getModel("i18nModel");

						// Call Disruption Service
						var isSuccess = airbus.mes.disruptions.ModelManager
								.rejectDisruption(comment, msgref, i18nModel);

						airbus.mes.disruptions.__enterCommentDialogue.close();

						if (isSuccess) {
							var sPath = sap.ui.getCore().byId(
									"disruptionCommentSpath").getValue();
							this.getView()
									.getModel("operationDisruptionsModel")
									.getProperty(sPath).Status = airbus.mes.disruptions.Formatter.status.rejected;
							this.getView()
									.getModel("operationDisruptionsModel")
									.refresh();
						}

					},

					/***********************************************************
					 * Show Comment Box to Add Comments
					 */
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

					/***********************************************************
					 * Hide Comment Box to Add Comments
					 */
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

					/***********************************************************
					 * Submit Disruption Comment
					 */
					submitComment : function(oEvt) {
						var path = oEvt.getSource().sId;

						var oModel = sap.ui.getCore().getModel(
								"operationDisruptionsModel");
						oModel
								.loadData(
										"../components/disruptions/local/disruptions.json",
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

						var i18nModel = this.getView().getModel("i18nModel");

						// Call Add comment Service
						airbus.mes.disruptions.ModelManager.addComment(
								oComment, i18nModel);

						this.getView().byId(
								this.getView().sId + "--commentArea-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum).setValue("");
					},

					/***********************************************************
					 * When Acknowledge Button is Pressed
					 */
					onAckDisruption : function(oEvt) {
						var title = this.getView().getModel("i18nModel")
								.getProperty("ackDisruption");
						var msgRef = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel").getObject(
								"MessageRef");

						// Call Acknowledge Disruption fragment
						if (!airbus.mes.disruptions.__enterAckCommentDialogue) {
							airbus.mes.disruptions.__enterAckCommentDialogue = sap.ui
									.xmlfragment(
											"airbus.mes.disruptions.fragment.ackDisruption",
											this);
							this
									.getView()
									.addDependent(
											airbus.mes.disruptions.__enterAckCommentDialogue);

						}
						sap.ui.getCore().byId("disruptionAckCommentDialogue")
								.setTitle(title);

						sap.ui.getCore().byId("disruptionAckDate")
								.setDateValue(new Date());

						sap.ui.getCore().byId("disruptionAckSpathMsgRef")
								.setText(msgRef);

						sap.ui.getCore().byId("disruptionAckComment").setValue(
								"");

						sap.ui.getCore().byId("disruptionAckCommentOK")
								.attachPress(this.onAcceptAckDisruptionComment);

						airbus.mes.disruptions.__enterAckCommentDialogue.open();
					},

					/***********************************************************
					 * When Comment is Added to Acknowledge Disruption
					 */
					onAcceptAckDisruptionComment : function() {

						var date = sap.ui.getCore().byId("disruptionAckDate")
								.getValue();

						var obDate = new Date(date);

						if (obDate == "Invalid Date" || date.length != 10)
							airbus.mes.shell.ModelManager.messageShow(this
									.getView().getModel("i18nModel")
									.getProperty("invalidDateError"));

						else {

							var time = sap.ui.getCore().byId(
									"disruptionAckTime").getValue();

							if (time == "")
								time = "00:00:00";

							var dateTime = date + " " + time;

							var msgRef = sap.ui.getCore().byId(
									"disruptionAckSpathMsgRef").getText();

							var comment = sap.ui.getCore().byId(
									"disruptionAckComment").getValue();

							var i18nModel = this.getView()
									.getModel("i18nModel");

							// Call to Acknowledge Disruption
							var isSuccess = airbus.mes.disruptions.ModelManager
									.ackDisruption(dateTime, msgRef, comment,
											i18nModel);

							airbus.mes.disruptions.__enterAckCommentDialogue
									.close();

							if (isSuccess) {
								var sPath = sap.ui.getCore().byId(
										"disruptionAckSpath").getValue();
								this.getView().getModel(
										"operationDisruptionsModel")
										.getProperty(sPath).Status = airbus.mes.disruptions.Formatter.status.acknowledged;
								this.getView().getModel(
										"operationDisruptionsModel").refresh();
							}
						}

					},

					/***********************************************************
					 * Close the Enter Comment Pop-Up
					 */
					onCloseAckDisruptionComment : function(oEvent) {

						sap.ui.getCore().byId("disruptionAckDate").setValue("");
						sap.ui.getCore().byId("disruptionAckTime").setValue("");
						sap.ui.getCore().byId("disruptionAckComment").setValue(
								"");
						airbus.mes.disruptions.__enterAckCommentDialogue
								.close();

					},

					onMarkSolvedDisruption : function(oEvt) {

						var title = this.getView().getModel("i18nModel")
								.getProperty("markSolvedDisruption");
						var msgRef = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel").getObject(
								"MessageRef");
						var sPath = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel").sPath;

						this.onOpenDisruptionComment(title, msgRef, sPath,
								this.onMarkSolvedDisruptionComment);

					},

					/***********************************************************
					 * When Comment is Submitted to Mark Solved Disruption
					 */
					onMarkSolvedDisruptionComment : function() {

						var msgRef = sap.ui.getCore().byId(
								"disruptionCommentMsgRef").getText();

						var comment = sap.ui.getCore().byId(
								"disruptionCommentBox").getValue();

						var i18nModel = this.getView().getModel("i18nModel");

						// Call to Mark Solved Disruption
						var isSuccess = airbus.mes.disruptions.ModelManager
								.markSolvedDisruption(msgRef, comment,
										i18nModel);

						airbus.mes.disruptions.__enterCommentDialogue.close();

						if (isSuccess) {
							var sPath = sap.ui.getCore().byId(
									"disruptionCommentSpath").getValue();
							this.getView()
									.getModel("operationDisruptionsModel")
									.getProperty(sPath).Status = airbus.mes.disruptions.Formatter.status.solved;
							this.getView()
									.getModel("operationDisruptionsModel")
									.refresh();
						}
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

					onEscalateDisruption : function(oEvent) {

						var msgRef = oEvent.getSource().getBindingContext(
								"operationDisruptionsModel").getObject(
								"MessageRef");

						var i18nModel = this.getView().getModel("i18nModel");

						// Call Escalate Service
						var isSuccess = airbus.mes.disruptions.ModelManager
								.escalateDisruption(msgRef, i18nModel);

						// Change Severity level in model
						if (isSuccess) {
							var sPath = oEvent.getSource().getBindingContext(
									"operationDisruptionsModel").sPath;

							this.getView()
									.getModel("operationDisruptionsModel")
									.getProperty(sPath).Escalation = this
									.getView().getModel(
											"operationDisruptionsModel")
									.getProperty(sPath).Escalation + 1;

							this.getView()
									.getModel("operationDisruptionsModel")
									.refresh();
						}

					},

					onReportDisruption : function(oEvent) {

						var oOperDetailNavContainer = sap.ui.getCore().byId(
								"operationDetailsView--operDetailNavContainer");

						if (airbus.mes.operationdetail.createDisruption === undefined
								|| airbus.mes.operationdetail.createDisruption.oView === undefined) {
							airbus.mes.operationdetail.oView.setBusy(true);
							sap.ui
									.getCore()
									.createComponent(
											{
												name : "airbus.mes.operationdetail.createDisruption",
											});

							oOperDetailNavContainer
									.addPage(airbus.mes.operationdetail.createDisruption.oView);
						}

						// clear disruptionDetailModel if edit is loaded before
						// ReportDisruption
						sap.ui.getCore().getModel("DisruptionDetailModel")
								.setData();

						oOperDetailNavContainer
								.to(airbus.mes.operationdetail.createDisruption.oView
										.getId());

						airbus.mes.operationdetail.createDisruption.oView.oController
								.resetAllFields();
						
						//set buttons according to create disruption
						sap.ui.getCore().byId("createDisruptionView--btnUpdateDisruption").setVisible(false);
						sap.ui.getCore().byId("createDisruptionView--btnCreateDisruption").setVisible(true);
						
						//set input according to update disruption
						sap.ui.getCore().byId("createDisruptionView--selectOriginator").setEnabled(true);
						sap.ui.getCore().byId("createDisruptionView--description").setEnabled(true);
						sap.ui.getCore().byId("createDisruptionView--timeLost").setEnabled(true);
					},

					onEditDisruption : function(oEvent) {

						if (sap.ui.getCore().byId(
								"operationDetailsView--switchOperationModeBtn")
								.getState() == false) {

							sap.m.MessageBox.error(this.getView().getModel(
									"i18nModel").getProperty("readModeError"));

						} else {

							// Navigate to Edit Screen
							var oOperDetailNavContainer = sap.ui
									.getCore()
									.byId(
											"operationDetailsView--operDetailNavContainer");

							// if component is not created - create the
							// component
							if (airbus.mes.operationdetail.createDisruption === undefined
									|| airbus.mes.operationdetail.createDisruption.oView === undefined) {
								airbus.mes.operationdetail.oView.setBusy(true);
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

							// fill model DisruptionDetailModel to show data on
							// edit screen
							var oModel = sap.ui.getCore().getModel(
									"DisruptionDetailModel");

							// set the data for this new model from the already
							// loaded model
							var oBindingContext = oEvent.getSource()
									.getBindingContext(
											"operationDisruptionsModel");

							oModel.setData(oBindingContext
									.getProperty(oBindingContext.sPath));
							oModel.refresh();

							// set buttons according to update disruption
							sap.ui
									.getCore()
									.byId(
											"createDisruptionView--btnUpdateDisruption")
									.setVisible(true);
							sap.ui
									.getCore()
									.byId(
											"createDisruptionView--btnCreateDisruption")
									.setVisible(false);

						}

						oOperDetailNavContainer
								.to(airbus.mes.operationdetail.createDisruption.oView
										.getId());

						// fill model DisruptionDetailModel to show data on edit
						// screen
						var oModel = sap.ui.getCore().getModel(
								"DisruptionDetailModel");

						// set the data for this new model from the already
						// loaded model
						var oBindingContext = oEvent.getSource()
								.getBindingContext("operationDisruptionsModel");

						oModel.setData(oBindingContext
								.getProperty(oBindingContext.sPath));
						oModel.refresh();
						
						//set buttons according to update disruption
						sap.ui.getCore().byId("createDisruptionView--btnUpdateDisruption").setVisible(true);
						sap.ui.getCore().byId("createDisruptionView--btnCreateDisruption").setVisible(false);
						
						//set input according to update disruption
						sap.ui.getCore().byId("createDisruptionView--selectOriginator").setEnabled(false);
						sap.ui.getCore().byId("createDisruptionView--description").setEnabled(false);
						sap.ui.getCore().byId("createDisruptionView--timeLost").setEnabled(false);


					},

					onCloseOperationDetailPopup : function() {

						airbus.mes.stationtracker.operationDetailPopup.close();
						airbus.mes.shell.oView.getController()
								.renderStationTracker();
					}

				});

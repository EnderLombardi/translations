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
					 * Open the Enter Comment Pop-Up
					 */
					onOpenDisruptionComment : function(title, msgRef, okEvent) {
						// Call Reject Disruption fragment
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
						sap.ui.getCore().byId("disruptionComment-msgRef")
								.setText(msgRef);
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
					 * Reject the Disruption
					 */
					onRejectDisruption: function(oEvt){
						
						var status = oEvt.getSource().getBindingContext(
						"operationDisruptionsModel").getObject("Status");
						
						if(status == airbus.mes.disruptions.Formatter.status.pending) {
							
							sap.m.MessageBox.error("You must first \"Acknowledge\" the disruption.");
							
						} else {

							var title = this.getView().getModel("i18nModel").getProperty("rejectDisruption");
							var msgRef = oEvt.getSource().getBindingContext(
							"operationDisruptionsModel").getObject("MessageRef");
							this.onOpenDisruptionComment(title, msgRef, this.onConfirmRejection);	
							
						}
									
					},
					/********************************************
					 * Confirming Reject Disruption
					 */
					onConfirmRejection: function(oEvent){
						var comment = sap.ui.getCore().byId("disruptionCommentBox").getValue();
						var msgref = sap.ui.getCore().byId("disruptionComment-msgRef").getText();
						
						//	Call Disruption Service
						airbus.mes.disruptions.ModelManager.rejectDisruption(comment,msgref);
						airbus.mes.disruptions.__enterCommentDialogue.close();

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

						// Call Add comment Service
						airbus.mes.disruptions.ModelManager
								.addComment(oComment);

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

						this.onOpenDisruptionComment(title, msgRef,
								this.onAcceptAckDisruptionComment);
					},

					/***********************************************************
					 * When Comment is Added to Acknowledge Disruption
					 */
					onAcceptAckDisruptionComment : function() {

						var msgRef = sap.ui.getCore().byId(
								"disruptionAckSpathMsgRef").getText();

						var comment = sap.ui.getCore().byId(
								"disruptionAckComment").getValue();
						
						var i18nModel = this.getView().getModel("i18nModel");

						// Call to Acknowledge Disruption
						var success = airbus.mes.disruptions.ModelManager.ackDisruption(
								msgRef, comment, i18nModel);

						airbus.mes.disruptions.__enterCommentDialogue.close();
						
						if(success){
							var sPath = sap.ui.getCore().byId("disruptionAckSpath").getValue();
							this.getView().getModel("operationDisruptionsModel").getProperty(sPath).Status = airbus.mes.disruptions.Formatter.status.acknowledged;
							this.getView().getModel("operationDisruptionsModel").refresh();
						}
					},

					onMarkSolvedDisruption : function(oEvt) {
						
						var title = this.getView().getModel("i18nModel").getProperty("markSolvedDisruption");
						var msgRef = oEvt.getSource().getBindingContext(
							"operationDisruptionsModel").getObject("MessageRef");
						
						this.onOpenDisruptionComment(title, msgRef, this.onMarkSolvedDisruptionComment);

					},
					
					/***********************************************************
					 * When Comment is Submitted to Mark Solved Disruption
					 */
					onMarkSolvedDisruptionComment : function() {

						var msgRef = sap.ui.getCore().byId(
								"disruptionComment-msgRef").getText();

						var comment = sap.ui.getCore().byId(
								"disruptionCommentBox").getValue();
						
						// Call to Mark Solved Disruption
						airbus.mes.disruptions.ModelManager.markSolvedDisruption(
								msgRef, comment);
						
						airbus.mes.disruptions.__enterCommentDialogue.close();
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
						if(isSuccess){
							var sPath = oEvent.getSource().getBindingContext("operationDisruptionsModel").sPath;
							
							var severity = this.getView().getModel("operationDisruptionsModel").getProperty(sPath).Severity;
							
							switch(severity){
							case airbus.mes.disruptions.Formatter.severity[0]:
								this.getView().getModel("operationDisruptionsModel").getProperty(sPath).Severity = airbus.mes.disruptions.ModelManager.severity[1]
								break;
							
							case severity == airbus.mes.disruptions.Formatter.severity[1]:
								this.getView().getModel("operationDisruptionsModel").getProperty(sPath).Severity = airbus.mes.disruptions.Formatter.severity[2];
								break;
							};
							
							this.getView().getModel("operationDisruptionsModel").refresh();
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
					},

					onEditDisruption : function(oEvent) {

						// Navigate to Edit Screen
						var oOperDetailNavContainer = sap.ui.getCore().byId(
								"operationDetailsView--operDetailNavContainer");
						

						// if component is not created - create the component
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

						// fill model DisruptionDetailModel to show data on edit screen
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

					},

					onCloseOperationDetailPopup : function() {

						airbus.mes.stationtracker.operationDetailPopup.close();
						airbus.mes.shell.oView.getController()
								.renderStationTracker();
					}

				});

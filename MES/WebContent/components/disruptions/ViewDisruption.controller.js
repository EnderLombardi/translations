"use strict";
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui
		.controller(
				"airbus.mes.disruptions.ViewDisruption",
				{
					pressEvent : undefined,
					expandedDisruptionPanel : undefined,

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf components.disruptions.ViewDisruption
					 */
					//onInit : function() {
					//
					//},
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
						var oSorter = new sap.ui.model.Sorter("OpeningTime", true);

						// sorting based on opening time
						this.getView().byId("ViewDisruptionView--disrptlist").getBinding("items").sort(oSorter);
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
					/***********************************************************
					 * Turn buttons on off based on execution mode
					 */
					turnOnOffButtons : function() {
						if (sap.ui.getCore().byId(
								"operationDetailsView--switchOperationModeBtn")
								.getState() == false) {
							sap.ui.getCore().byId(
									"operationDetailPopup--reportDisruption")
									.setVisible(false);
						} else {
							sap.ui.getCore().byId(
									"operationDetailPopup--reportDisruption")
									.setVisible(true);
						}
					},

					/***********************************************************
					 * Filter comments by removing comments not related to the
					 * selected disruption
					 */
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
											.getContent()[3]
											.getBinding("items");
									// Apply filter
									oBinding.filter([ new sap.ui.model.Filter(
											"MessageRef", "EQ", messageRef) ]);
								});

					},

					/***********************************************************
					 * Open Pop-Up to ask Time Lost while Closing the Disruption
					 */
					onCloseDisruption : function(oEvt) {

						if (nav.getCurrentPage().sId == "stationTrackerView" && 
								sap.ui.getCore().byId("operationDetailsView--switchOperationModeBtn").getState() == false) {

							sap.m.MessageBox.error(this.getView().getModel(
									"i18nModel").getProperty("readModeError"));
							
							return;

						}
						
						//Close panel
						oEvt.getSource().getParent().getParent().setExpanded(false);
						
						
						// Close Comment Box if open
						var path = oEvt.getSource().sId;
						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];
						var commentBox = this.getView().byId(
								this.getView().sId + "--commentBox-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum);
						commentBox.setVisible(false);
						
						var submitCommentId = sap.ui.getCore().byId(
								this.getView().sId + "--addComment-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum);

						submitCommentId.setVisible(true);
						//*********************************************************
						
						// Get Fields to Pre-Fill Comment Pop-up
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

							sap.ui.getCore().byId("disruptionCloseDialogue")
									.setTitle(title);

							this.getView().addDependent(this._closeDialog);

						}

						sap.ui.getCore().byId("closeDisruption-timeLost")
								.setValue(airbus.mes.disruptions.Formatter.timeMillisecondsToConfig(timeLost));
						sap.ui.getCore().byId("closeDisruption-timeLostUnit")
								.setText(airbus.mes.disruptions.Formatter.getConfigTimeUnit());
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

						var timeLostValue = airbus.mes.disruptions.Formatter.timeToMilliseconds(timeLost.getValue());
						var commentValue = comment.getValue();
						var msgRefValue = msgRef.getText();

						var i18nModel = airbus.mes.disruptions.oView.viewDisruption
								.getModel("i18nModel");

						// Call Close Disruption Service
						var isSuccess = airbus.mes.disruptions.ModelManager
								.closeDisruption(msgRefValue, commentValue,
										timeLostValue, i18nModel);

						if (isSuccess) {
							
							var operationDisruptionsModel = this.getView().getModel("operationDisruptionsModel");
							
							var sPath = sap.ui.getCore().byId(
									"closeDisruption-sPath").getText();
							
							operationDisruptionsModel.getProperty(sPath).Status = airbus.mes.disruptions.Formatter.status.closed;
							
							operationDisruptionsModel.getProperty(sPath).TimeLost = timeLostValue;
							
							
							// Set Closure date
							var date = new Date();							
							operationDisruptionsModel.getProperty(sPath).ClosureDate = 
								date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
							
							var currDate = new Date();
							var date = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
							
							var oComment = {
									"Action" : this.getView().getModel("i18nModel").getProperty("close"),
									"Comments" : commentValue,
									"Counter" : "",
									"Date" : date,
									"MessageRef" : msgRefValue,
									"UserFullName" : ( sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " +
											   sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase() )
							};
							
							operationDisruptionsModel.getProperty("/Rowsets/Rowset/1/Row").push(oComment);
							
							operationDisruptionsModel.refresh();
							
							if (nav.getCurrentPage().sId == "stationTrackerView")
								airbus.mes.disruptions.ModelManager.checkDisruptionStatus(operationDisruptionsModel);
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
						// Call Disruption Comment Pop-up fragment
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
						.detachPress(this.pressEvent);
						sap.ui.getCore().byId("disruptionCommentOK")
								.attachPress(okEvent);
						this.pressEvent = okEvent;
						
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

						if (nav.getCurrentPage().sId == "stationTrackerView" && 
								sap.ui.getCore().byId("operationDetailsView--switchOperationModeBtn").getState() == false) {

							sap.m.MessageBox.error(this.getView().getModel(
									"i18nModel").getProperty("readModeError"));
							
							return;

						}
						
						// Close Comment Box if open
						var path = oEvt.getSource().sId;
						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];
						var commentBox = this.getView().byId(
								this.getView().sId + "--commentBox-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum);
						commentBox.setVisible(false);
						
						var submitCommentId = sap.ui.getCore().byId(
								this.getView().sId + "--addComment-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum);

						submitCommentId.setVisible(true);
						//*********************************************************
						
						var status = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel")
								.getObject("Status");

						if (status == airbus.mes.disruptions.Formatter.status.acknowledged) {
							sap.m.MessageBox
									.error(airbus.mes.disruptions.oView.viewDisruption
											.getModel("i18nModel").getProperty(
													"disruptionDeleteError"));
						} else {

							var title = this.getView().getModel("i18nModel")
									.getProperty("deleteDisruption");
							var msgRef = oEvt.getSource().getBindingContext(
									"operationDisruptionsModel").getObject(
									"MessageRef");
							var sPath = oEvt.getSource().getBindingContext(
									"operationDisruptionsModel").sPath;

							this.onOpenDisruptionComment(title, msgRef, sPath,
									this.onConfirmDelete);
						}

					},

					/***********************************************************
					 * Confirming Delete Disruption
					 */
					onConfirmDelete : function(oEvent) {

						var i18nModel = airbus.mes.disruptions.oView.viewDisruption
								.getModel("i18nModel");

						var comment = sap.ui.getCore().byId(
								"disruptionCommentBox").getValue();

						var msgRef = sap.ui.getCore().byId(
								"disruptionCommentMsgRef").getText();

						var sMessage = i18nModel.getProperty("successDelete");

						// Call Disruption Service
						var isSuccess = airbus.mes.disruptions.ModelManager
								.rejectDisruption(comment, msgRef, sMessage,
										i18nModel);

						airbus.mes.disruptions.__enterCommentDialogue.close();

						if (isSuccess) {

							var operationDisruptionsModel = airbus.mes.disruptions.oView.viewDisruption
									.getModel("operationDisruptionsModel");

							var sPath = sap.ui.getCore().byId(
									"disruptionCommentSpath").getText();

							operationDisruptionsModel.getProperty(sPath).Status = airbus.mes.disruptions.Formatter.status.deleted;
							
							var currDate = new Date();
							var date = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
							
							var oComment = {
									"Action" : airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("delete"),
									"Comments" : comment,
									"Counter" : "",
									"Date" : date,
									"MessageRef" : msgRef,
									"UserFullName" : ( sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " +
											   sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase() )
							};
							operationDisruptionsModel.getProperty("/Rowsets/Rowset/1/Row").push(oComment);

							operationDisruptionsModel.refresh();

							if (nav.getCurrentPage().sId == "stationTrackerView")
								airbus.mes.disruptions.ModelManager.checkDisruptionStatus(operationDisruptionsModel);
						}

					},

					/***********************************************************
					 * Reject the Disruption
					 */
					onRejectDisruption : function(oEvt) {

						if (nav.getCurrentPage().sId == "stationTrackerView" && 
								sap.ui.getCore().byId("operationDetailsView--switchOperationModeBtn").getState() == false) {

							sap.m.MessageBox.error(this.getView().getModel(
									"i18nModel").getProperty("readModeError"));
							
							return;

						}
						
						// Close Comment Box if open
						var path = oEvt.getSource().sId;
						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];
						var commentBox = this.getView().byId(
								this.getView().sId + "--commentBox-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum);
						commentBox.setVisible(false);
						
						var submitCommentId = sap.ui.getCore().byId(
								this.getView().sId + "--addComment-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum);

						submitCommentId.setVisible(true);
						//*********************************************************
						
//						var status = oEvt.getSource().getBindingContext(
//								"operationDisruptionsModel")
//								.getObject("Status");

						/*if (status == airbus.mes.disruptions.Formatter.status.pending) {

							sap.m.MessageBox
									.error(airbus.mes.disruptions.oView.viewDisruption
											.getModel("i18nModel").getProperty(
													"disruptionNotAckError"));
							return;

						}*/

						var title = airbus.mes.disruptions.oView.viewDisruption
								.getModel("i18nModel").getProperty(
										"rejectDisruption");
						var msgRef = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel").getObject(
								"MessageRef");
						var sPath = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel").sPath;

						this.onOpenDisruptionComment(title, msgRef, sPath,
								this.onConfirmRejection);

					},

					/***********************************************************
					 * Confirming Reject Disruption
					 */
					onConfirmRejection : function(oEvent) {
						var i18nModel = airbus.mes.disruptions.oView.viewDisruption
								.getModel("i18nModel");

						var comment = sap.ui.getCore().byId(
								"disruptionCommentBox").getValue();
						var msgRef = sap.ui.getCore().byId(
								"disruptionCommentMsgRef").getText();
						var sMessage = i18nModel.getProperty("successReject");
						
						if(comment == "") {
							sap.m.MessageToast.show(i18nModel.getProperty("plsEnterComment"));
							return;
						}

						// Call Disruption Service
						var isSuccess = airbus.mes.disruptions.ModelManager
								.rejectDisruption(comment, msgRef, sMessage,
										i18nModel);

						airbus.mes.disruptions.__enterCommentDialogue.close();

						if (isSuccess) {
							var sPath = sap.ui.getCore().byId(
									"disruptionCommentSpath").getText();

							var operationDisruptionsModel = airbus.mes.disruptions.oView.viewDisruption
									.getModel("operationDisruptionsModel");

							operationDisruptionsModel.getProperty(sPath).Status = airbus.mes.disruptions.Formatter.status.rejected;
							
							var currDate = new Date();
							var date = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
							
							var oComment = {
									"Action" : airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("reject"),
									"Comments" : comment,
									"Counter" : "",
									"Date" : date,
									"MessageRef" : msgRef,
									"UserFullName" : ( sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " +
											   sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase() )
							};
							operationDisruptionsModel.getProperty("/Rowsets/Rowset/1/Row").push(oComment);

							operationDisruptionsModel.refresh();
						}

					},
					
					/***********************************************************
					 * Refuse the Disruption
					 */
					onRefuseDisruption : function() {
						if (nav.getCurrentPage().sId == "stationTrackerView" && 
								sap.ui.getCore().byId("operationDetailsView--switchOperationModeBtn").getState() == false) {

							sap.m.MessageBox.error(this.getView().getModel(
									"i18nModel").getProperty("readModeError"));
							
							return;

						}
						
						// Close Comment Box if open
						var path = oEvt.getSource().sId;
						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];
						var commentBox = this.getView().byId(
								this.getView().sId + "--commentBox-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum);
						commentBox.setVisible(false);
						
						var submitCommentId = sap.ui.getCore().byId(
								this.getView().sId + "--addComment-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum);

						submitCommentId.setVisible(true);
						//*********************************************************
						
						var title = airbus.mes.disruptions.oView.viewDisruption
								.getModel("i18nModel").getProperty(
										"refuseDisruption");
						var msgRef = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel").getObject(
								"MessageRef");
						var sPath = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel").sPath;

						this.onOpenDisruptionComment(title, msgRef, sPath,
								this.onConfirmRefuse);
					},
					
					/***********************************************************
					 * Confirming Refuse Disruption
					 */
					onConfirmRefuse : function(oEvent) {
						var i18nModel = airbus.mes.disruptions.oView.viewDisruption
								.getModel("i18nModel");

						var comment = sap.ui.getCore().byId(
								"disruptionCommentBox").getValue();
						var msgRef = sap.ui.getCore().byId(
								"disruptionCommentMsgRef").getText();
						var sMessage = i18nModel.getProperty("successRefuse");
						
						if(comment == "") {
							sap.m.MessageToast.show(i18nModel.getProperty("plsEnterComment"));
							return;
						}

						// Call Disruption Service
						var isSuccess = airbus.mes.disruptions.ModelManager
								.refuseDisruption(comment, msgRef, sMessage,
										i18nModel);

						airbus.mes.disruptions.__enterCommentDialogue.close();

						if (isSuccess) {
							var sPath = sap.ui.getCore().byId(
									"disruptionCommentSpath").getText();

							var operationDisruptionsModel = airbus.mes.disruptions.oView.viewDisruption
									.getModel("operationDisruptionsModel");

							operationDisruptionsModel.getProperty(sPath).Status = airbus.mes.disruptions.Formatter.status.pending;
							
							var currDate = new Date();
							var date = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
							
							var oComment = {
									"Action" : airbus.mes.disruptions.oView.viewDisruption.getModel("i18nModel").getProperty("refuse"),
									"Comments" : comment,
									"Counter" : "",
									"Date" : date,
									"MessageRef" : msgRef,
									"UserFullName" : ( sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " +
											   sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase() )
							};
							operationDisruptionsModel.getProperty("/Rowsets/Rowset/1/Row").push(oComment);

							operationDisruptionsModel.refresh();
						}

					},

					/***********************************************************
					 * Show Comment Box to Add Comments
					 */
					showCommentBox : function(oEvt) {

						if (nav.getCurrentPage().sId == "stationTrackerView" && 
								sap.ui.getCore().byId("operationDetailsView--switchOperationModeBtn").getState() == false) {

							sap.m.MessageBox.error(this.getView().getModel(
									"i18nModel").getProperty("readModeError"));
							
							return;

						}
						
						var path = oEvt.getSource().sId;
						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];
						var commentBox = this.getView().byId(
								this.getView().sId + "--commentBox-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum);
						commentBox.setVisible(true);

						var submitComment = sap.ui.getCore().byId(path);
						submitComment.setVisible(false);

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
						
						var status = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel").getObject(
								"Status");
						
						if (status == airbus.mes.disruptions.Formatter.status.deleted || status == airbus.mes.disruptions.Formatter.status.closed) {
							
							sap.m.MessageToast.show(this.getView().getModel("i18nModel").getProperty("cannotComment"));
							
							return;
						}
							
						var path = oEvt.getSource().sId;

						var msgRef = oEvt.getSource().getBindingContext(
								"operationDisruptionsModel").getObject(
								"MessageRef");

						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];

						var sComment = this.getView().byId(
								this.getView().sId + "--commentArea-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum).getValue();
						
						var currDate = new Date();
						var date = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();

						var oComment = {
								"Action" : this.getView().getModel("i18nModel").getProperty("comment"),
								"Comments" : sComment,
								"Counter" : "",
								"Date" : date,
								"MessageRef" : msgRef,
								"UserFullName" : ( sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " +
										   sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase() )
						};

						var i18nModel = airbus.mes.disruptions.oView.viewDisruption
								.getModel("i18nModel");

						// Call Add comment Service
						airbus.mes.disruptions.ModelManager.addComment(oComment, i18nModel);

						this.getView().byId(
								this.getView().sId + "--commentArea-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum).setValue("");
					},

					/***********************************************************
					 * When Acknowledge Button is Pressed
					 */
					onAckDisruption : function(oEvt) {

						if (nav.getCurrentPage().sId == "stationTrackerView" && 
								sap.ui.getCore().byId("operationDetailsView--switchOperationModeBtn").getState() == false) {

							sap.m.MessageBox.error(this.getView().getModel(
									"i18nModel").getProperty("readModeError"));
							
							return;

						}
						
						// Close Comment Box if open
						var path = oEvt.getSource().sId;
						var listnum = path.split("-");
						listnum = listnum[listnum.length - 1];
						var commentBox = this.getView().byId(
								this.getView().sId + "--commentBox-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum);
						commentBox.setVisible(false);
						
						var submitCommentId = sap.ui.getCore().byId(
								this.getView().sId + "--addComment-"
										+ this.getView().sId + "--disrptlist-"
										+ listnum);

						submitCommentId.setVisible(true);
						//*********************************************************
						
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

						sap.ui.getCore().byId("disruptionAckSpath").setText(
								oEvt.getSource().getBindingContext(
										"operationDisruptionsModel").sPath);

						sap.ui.getCore().byId("disruptionAckComment").setValue(
								"");

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

							var i18nModel = airbus.mes.disruptions.oView.viewDisruption
									.getModel("i18nModel");

							// Call to Acknowledge Disruption
							var isSuccess = airbus.mes.disruptions.ModelManager
									.ackDisruption(dateTime, msgRef, comment,
											i18nModel);

							airbus.mes.disruptions.__enterAckCommentDialogue
									.close();

							if (isSuccess) {
								var sPath = sap.ui.getCore().byId(
										"disruptionAckSpath").getText();

								var operationDisruptionsModel = airbus.mes.disruptions.oView.viewDisruption
										.getModel("operationDisruptionsModel");

								operationDisruptionsModel.getProperty(sPath).Status = airbus.mes.disruptions.Formatter.status.acknowledged;
								operationDisruptionsModel.getProperty(sPath).PromisedDateTime = dateTime;
								
								var currDate = new Date();
								var date = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
								
								var oComment = {
										"Action" : this.getView().getModel("i18nModel").getProperty("acknowledge"),
										"Comments" : comment,
										"Counter" : "",
										"Date" : date,
										"MessageRef" : msgRef,
										"UserFullName" : ( sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " +
												   sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase() )
								};
								operationDisruptionsModel.getProperty("/Rowsets/Rowset/1/Row").push(oComment);

								operationDisruptionsModel.refresh();
								
								
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

						if (nav.getCurrentPage().sId == "stationTrackerView" && 
								sap.ui.getCore().byId("operationDetailsView--switchOperationModeBtn").getState() == false) {

							sap.m.MessageBox.error(this.getView().getModel(
									"i18nModel").getProperty("readModeError"));
							
							return;

						}
						
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

						var i18nModel = sap.ui.getCore().byId("ViewDisruptionView").getModel("i18nModel");

						// Call to Mark Solved Disruption
						var isSuccess = airbus.mes.disruptions.ModelManager
								.markSolvedDisruption(msgRef, comment,
										i18nModel);

						airbus.mes.disruptions.__enterCommentDialogue.close();

						if (isSuccess) {
							var sPath = sap.ui.getCore().byId(
									"disruptionCommentSpath").getText();
							sap.ui.getCore().byId("ViewDisruptionView").getModel("operationDisruptionsModel").getProperty(sPath).Status = airbus.mes.disruptions.Formatter.status.solved;
							
							var currDate = new Date();
							var date = currDate.getFullYear() + "-" + currDate.getMonth() + "-" + currDate.getDate();
							
							var oComment = {
									"Action" : i18nModel.getProperty("markSolved"),
									"Comments" : comment,
									"Counter" : "",
									"Date" : date,
									"MessageRef" : msgRef,
									"UserFullName" : ( sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/first_name").toLowerCase() + " " +
													   sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/last_name").toLowerCase() )
							};
							sap.ui.getCore().byId("ViewDisruptionView").getModel("operationDisruptionsModel")
									.getProperty("/Rowsets/Rowset/1/Row").push(oComment);
							
							sap.ui.getCore().byId("ViewDisruptionView").getModel("operationDisruptionsModel")
									.refresh();
						}
					},

					/***********************************************************
					 * Close other panels when one panel is expanded
					 */
					handleDisruptionPanelExpand : function(oevent) {
						
						if (!oevent.oSource.getExpanded())
							return;
						
						this.expandedDisruptionPanel = oevent.getSource().getId();
						
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

					/***********************************************************
					 * When Comment is Submitted to Escalate Disruption
					 */
					onEscalateDisruption : function(oEvent) {

						if (nav.getCurrentPage().sId == "stationTrackerView" && 
								sap.ui.getCore().byId("operationDetailsView--switchOperationModeBtn").getState() == false) {

							sap.m.MessageBox.error(this.getView().getModel(
									"i18nModel").getProperty("readModeError"));
							
							return;

						}
						
						var msgRef = oEvent.getSource().getBindingContext(
								"operationDisruptionsModel").getObject(
								"MessageRef");

						var i18nModel = airbus.mes.disruptions.oView.viewDisruption
								.getModel("i18nModel");

						// Call Escalate Service
						var isSuccess = airbus.mes.disruptions.ModelManager
								.escalateDisruption(msgRef, i18nModel);

						// Change Severity level in model
						if (isSuccess) {
							var sPath = oEvent.getSource().getBindingContext(
									"operationDisruptionsModel").sPath;

							this.getView()
									.getModel("operationDisruptionsModel")
									.getProperty(sPath).EscalationLevel = parseInt(this
									.getView().getModel("operationDisruptionsModel")
									.getProperty(sPath).EscalationLevel,10) + 1;

							this.getView()
									.getModel("operationDisruptionsModel")
									.refresh();
						}

					},

					onReportDisruption : function(oEvent) {
						
						// Close expanded disruption panel
						if(this.expandedDisruptionPanel)
							sap.ui.getCore().byId(this.expandedDisruptionPanel).setExpanded(false);
						
						var oOperDetailNavContainer = sap.ui.getCore().byId(
								"operationDetailsView--operDetailNavContainer");
						
						// clear disruptionDetailModel if edit is loaded before ReportDisruption
						sap.ui.getCore().getModel("DisruptionDetailModel").setData();


						// Clear disruptionDetailModel if edit is loaded before ReportDisruption
						sap.ui.getCore().getModel("DisruptionDetailModel").setData();

						oOperDetailNavContainer.to(airbus.mes.disruptions.oView.createDisruption.getId());
						
						
						//destroying Material List dialog which might have already loaded and will show inconsistent data otherwise
						if(sap.ui.getCore().byId("createDisruptionView").oController._materialListDialog){
							sap.ui.getCore().byId("createDisruptionView").oController._materialListDialog.destroy(false);
							sap.ui.getCore().byId("createDisruptionView").oController._materialListDialog = undefined;
						}
						if(sap.ui.getCore().byId("createDisruptionView").oController.jigToolSelectDialog){
							sap.ui.getCore().byId("createDisruptionView").oController.jigToolSelectDialog.destroy(false);
							sap.ui.getCore().byId("createDisruptionView").oController.jigToolSelectDialog = undefined;
						}
					},

					/***********************************************************
					 * Edit Disruption
					 */
					onEditDisruption : function(oEvent) {

						if (nav.getCurrentPage().sId == "stationTrackerView" && 
								sap.ui.getCore().byId("operationDetailsView--switchOperationModeBtn").getState() == false) {

							sap.m.MessageBox.error(this.getView().getModel(
									"i18nModel").getProperty("readModeError"));

						} else {
							
							// Close expanded disruption panel
							if(this.expandedDisruptionPanel)
								sap.ui.getCore().byId(this.expandedDisruptionPanel).setExpanded(false);
							
							var oOperDetailNavContainer;

							// Navigate to Edit Screen
							if (nav.getCurrentPage().sId == "stationTrackerView")
								oOperDetailNavContainer = sap.ui
										.getCore()
										.byId(
												"operationDetailsView--operDetailNavContainer");
							else if (nav.getCurrentPage().sId == "disruptiontrackerView")
								oOperDetailNavContainer = sap.ui
										.getCore()
										.byId(
												"disruptionDetailPopup--disruptDetailNavContainer");

							oOperDetailNavContainer.to(airbus.mes.disruptions.oView.createDisruption.getId());

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
							
						}

					}

				});

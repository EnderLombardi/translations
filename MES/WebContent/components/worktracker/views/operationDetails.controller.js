jQuery.sap.require("airbus.mes.worktracker.util.ModelManager");
jQuery.sap.require("airbus.mes.worktracker.util.Functions");
jQuery.sap.require("airbus.mes.worktracker.util.Formatter");

// Include CSS file
jQuery.sap.includeStyleSheet("worktracker/css/workTracker.css");
jQuery.sap.includeStyleSheet("worktracker/css/sideNavigation.css");
sap.ui
		.controller(
				"airbus.mes.worktracker.views.operationDetails",
				{
					reasonCodeText : undefined,
					operationStatus : undefined,

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf worktracker.views.home
					 */
					onInit : function() {

						/*******************************************************
						 * Create a new model to hold detail of operation
						 ******************************************************/
						this.getView().setModel(
								new sap.ui.model.json.JSONModel(),
								"operationDetailModel");

						// Model for Document List
						/*
						 * sap.ui.getCore().setModel( new
						 * sap.ui.model.json.JSONModel(), "documentsNameModel");
						 * sap.ui.getCore().getModel("documentsNameModel")
						 * .loadData("local/document.json", null, false);
						 */

						/*
						 * // Model for Disruption Data var oModel = new
						 * sap.ui.model.json.JSONModel();
						 * this.getView().setModel(oModel, "disruptionModel");
						 * oModel.loadData("worktracker/local/data.json", null,
						 * false); // Model for Task List data
						 * this.getView().setModel( new
						 * sap.ui.model.json.JSONModel(), "tasklist");
						 * this.getView().getModel("tasklist").loadData(
						 * "worktracker/local/tasklist.json", null, false);
						 */

					},

					onCreateDisruption : function() {
						this.getView().byId("FormToolbar").setVisible(true);
						this.getView().byId("disruptionsHeader").setVisible(
								false);
					},
					onCancelCreateDisruption : function() {
						this.getView().byId("disruptionsHeader").setVisible(
								true);
						this.getView().byId("FormToolbar").setVisible(false);

					},

					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf worktracker.views.home
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
					 * @memberOf worktracker.views.home
					 */
					onAfterRendering : function() {

						// Set colors for Count on Icon Bar
						airbus.mes.worktracker.util.Functions
								.addCountTextClass("operationNav");

					},

					/**
					 * Called when the Controller is destroyed. Use this one to
					 * free resources and finalize activities.
					 * 
					 * @memberOf worktracker.views.home
					 */
					onExit : function() {
					},

					// Functions for Sub Header
					navigateHome : function() {
						nav.back();
					},

					expandOperationDetailPanel : function(oEvent) {
						this.getView().byId("opDetailExpandButton")
								.toggleStyleClass("invisible");
						this.getView().byId("operationDetailPanel")
								.setExpanded();
					},

					toggleMessagesPopOver : function(oEvt) {

						airbus.mes.worktracker.util.Functions
								.handleMessagePopOver(this, oEvt);
					},

					/* Progress Functions */

					addProgress : function() {
						oProgressSlider = this.getView().byId("progressSlider");
						oProgressSlider.stepUp(1);
					},

					reduceProgress : function() {
						oProgressSlider = this.getView().byId("progressSlider");
						oProgressSlider.stepDown(1);
					},

					setProgressScreenBtn : function(progressBtnStatus,
							actionBtnStatus, activateBtnStatus) {
						this.getView().byId("btnAdd").setEnabled(
								progressBtnStatus);
						this.getView().byId("btnReduce").setEnabled(
								progressBtnStatus);
						this.getView().byId("btnPause").setVisible(
								actionBtnStatus);
						this.getView().byId("btnConfirm").setVisible(
								actionBtnStatus);
						this.getView().byId("btnComplete").setVisible(
								actionBtnStatus);
						this.getView().byId("btnActivate").setVisible(
								activateBtnStatus);
					},

					activateOperation : function() {

						var data = this.getView().getModel(
								"operationDetailModel").oData.schedule;
						var sMessage = this.getView().getModel("i18n")
								.getProperty("SuccessfulActivation");
						var flag_success;
						jQuery
								.ajax({
									url : airbus.mes.worktracker.util.ModelManager
											.getUrlStartOperation(data),
									async : false,
									error : function(xhr, status, error) {
										airbus.mes.worktracker.util.ModelManager
												.messageShow("Error");
									},
									success : function(result, status, xhr) {

										if (result.Rowsets.Rowset[0].Row[0].Message_Type == undefined) {
											airbus.mes.worktracker.util.ModelManager
													.messageShow(sMessage);
											flag_success = true;
										} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
											airbus.mes.worktracker.util.ModelManager
													.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
											flag_success = false;
										} else {
											airbus.mes.worktracker.util.ModelManager
													.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
											flag_success = true;
										}

									}
								});

						// Refresh User Operation Model and Operation Detail
						airbus.mes.worktracker.util.ModelManager.loadUserOperationsModel();
						
						//this.refreshOperationData();

						if (flag_success == true) {
							this.setProgressScreenBtn(true, true, false);
							this.getView().byId("progressSlider").setEnabled(
									true);
							this.getView().byId("operationStatus").setText(
									this.getView().getModel("i18n")
											.getProperty("in_progress"));
						}
					},
					pauseOperation : function() {
						var data = this.getView().getModel(
								"operationDetailModel").oData.schedule;
						var sMessage = this.getView().getModel("i18n")
								.getProperty("SuccessfulPause");

						jQuery
								.ajax({
									url : airbus.mes.worktracker.util.ModelManager
											.getUrlPauseOperation(data),
									async : false,
									error : function(xhr, status, error) {
										airbus.mes.worktracker.util.ModelManager
												.messageShow("Error");

									},
									success : function(result, status, xhr) {

										if (result.Rowsets.Rowset[0].Row[0].Message_Type == undefined) {
											airbus.mes.worktracker.util.ModelManager
													.messageShow(sMessage);
											flag_success = true;
										} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
											airbus.mes.worktracker.util.ModelManager
													.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
											flag_success = false;
										} else {
											airbus.mes.worktracker.util.ModelManager
													.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
											flag_success = true;
										}

									}
								});

						// Refresh User Operation Model and Operation Detail
						airbus.mes.worktracker.util.ModelManager
								.loadUserOperationsModel();
						//this.refreshOperationData();

						if (flag_success == true) {
							this.setProgressScreenBtn(false, false, true);
							this.getView().byId("progressSlider").setEnabled(
									false);
							this.getView().byId("btnActivate")
									.setType("Accept");
							this.getView().byId("operationStatus").setText(
									this.getView().getModel("i18n")
											.getProperty("paused"));
						}

					},

					confirmOperation : function(oEvent) {

						if (oEvent.getSource().getText() == this.getView()
								.getModel("i18n").getProperty("confirm")) {
							if (!this._reasonCodeDialog) {

								this._reasonCodeDialog = sap.ui
										.xmlfragment(
												"airbus.mes.worktracker.fragments.reasonCode",
												this);

								this.getView().addDependent(
										this._reasonCodeDialog);
								// click on confirm
								this.operationStatus = "C";
							}
							this._reasonCodeDialog.open();
						} else if (oEvent.getSource().getText() == this
								.getView().getModel("i18n").getProperty(
										"complete")) {
							if (!this._oUserConfirmationDialog) {

								this._oUserConfirmationDialog = sap.ui
										.xmlfragment(
												"airbus.mes.worktracker.fragments.userConfirmation",
												this);

								this.getView().addDependent(
										this._oUserConfirmationDialog);
								// click on complete
								this.operationStatus = "X";
							}
							this._oUserConfirmationDialog.open();

						}
					},

					/***********************************************************
					 * ReasonCode Fragment Methods
					 **********************************************************/

					onSubmitReasonCode : function(oEvent) {
						// store reason Code text
						this.reasonCodeText = sap.ui.getCore().byId(
								"reasonCodeSelectBox").getSelectedKey()
								+ "-"
								+ sap.ui.getCore().byId("reasonCodeComments")
										.getValue()
						// Close reason code dialog
						this._reasonCodeDialog.close();

						if (!this._oUserConfirmationDialog) {

							this._oUserConfirmationDialog = sap.ui
									.xmlfragment(
											"airbus.mes.worktracker.fragments.userConfirmation",
											this);

							this.getView().addDependent(
									this._oUserConfirmationDialog);
						}
						this._oUserConfirmationDialog.open();

					},

					onCancelReasonCode : function() {
						this._reasonCodeDialog.close();
					},

					/***********************************************************
					 * User Confirmation Dialog Methods
					 */
					onCancelConfirmation : function() {
						this._oUserConfirmationDialog.close();
						sap.ui.getCore().byId("msgstrpConfirm").setVisible(
								false);
					},

					onOKConfirmation : function(oEvent) {

						var user = sap.ui.getCore().byId(
								"userNameForConfirmation").getValue();
						var pass = sap.ui.getCore().byId(
								"passwordForConfirmation").getValue();
						
						var sMessageSuccess = this.getView().getModel("i18n").getProperty("SuccessfulConfirmation");
						var sMessageError = this.getView().getModel("i18n").getProperty("ErrorDuringConfirmation");
						

						if (user == "" || pass == "") {
							sap.ui.getCore().byId("msgstrpConfirm").setVisible(
									true);
							sap.ui.getCore().byId("msgstrpConfirm").setType(
									"Error");
							sap.ui.getCore().byId("msgstrpConfirm").setText(
									this.getView().getModel("i18n")
											.getProperty(
													"CompulsaryConfirmation"));
						} else {
							sap.ui.getCore().byId("msgstrpConfirm").setVisible(
									false);
							var sfc = airbus.mes.worktracker.util.ModelManager.sfc;
							if (this.operationStatus == "X")
								var percent = "100"
							else {
								var percent = this.getView().byId(
										"progressSlider").getValue();
							}

							// Call service for Operation Confirmation
							jQuery
									.ajax({
										url : airbus.mes.worktracker.util.ModelManager
												.getConfirmationUrl(
														user,
														pass,
														this.operationStatus,
														percent,
														this
																.getView()
																.getModel(
																		"operationDetailModel")
																.getProperty(
																		"/schedule/sfc_step_ref"),
														this.reasonCodeText),
										async : false,
										error : function(xhr, status, error) {
											airbus.mes.worktracker.util.ModelManager
													.messageShow(sMessageError);

										},
										success : function(result, status, xhr) {

											airbus.mes.worktracker.util.ModelManager
													.messageShow(sMessageSuccess);

										}
									});

							this._oUserConfirmationDialog.close();

							// Refresh User Operation Model and Operation Detail
							airbus.mes.worktracker.util.ModelManager.loadUserOperationsModel();
							
							this.refreshOperationData(percent);

						}
					},
					
					refreshOperationData: function(percentage){
						this.getView().byId("progressSliderfirst").setWidth(percentage+"%");
						this.getView().byId("progressSlider").setWidth((100- parseInt(percentage))+"%");
						
						this.getView().byId("progressSliderfirst").setMax(parseInt(percentage));
						this.getView().byId("progressSlider").setMin(parseInt(percentage));
						
						this.getView().byId("progressSliderfirst").setValue(parseInt(percentage));
						this.getView().byId("progressSlider").setValue(parseInt(percentage));
						

						switch(parseInt(percentage)){
							case 100:
								this.getView().byId("progressSliderfirst").setVisible(true);
								this.getView().byId("progressSlider").setVisible(false);
								break;
							case 0:
								this.getView().byId("progressSliderfirst").setVisible(false);
								this.getView().byId("progressSlider").setVisible(true);
								this.getView().byId("progressSlider").removeStyleClass("dynProgressSlider");
								break;
							default:
								this.getView().byId("progressSliderfirst").setVisible(true);
								this.getView().byId("progressSlider").setVisible(true);
								this.getView().byId("progressSlider").addStyleClass("dynProgressSlider");
								break;
						}
					},

					showCommentBox : function(oEvt) {
						var path = oEvt.getSource().getBindingContext(
								"disruptionModel").getPath();
						this.getView().getModel("disruptionModel").setProperty(
								path + "/commentVisible", "true");
					},
					onMarkSolved : function(oEvt) {
						var path = oEvt.getSource().getBindingContext(
								"disruptionModel").getPath();
						this.getView().getModel("disruptionModel").setProperty(
								path + "/Status", "Solved");
						this.getView().getModel("disruptionModel").setProperty(
								path + "/commentVisible", "false");
						this.getView().getModel("disruptionModel").setProperty(
								path + "/message", " ");
						oEvt.getSource().setType("Accept");

					},
					onCreateDisrupt : function() {

						var oNewDisruptionData = {
							"Gravity" : this.getView().byId("Gravity")
									.getSelectedKey(),
							"Object" : this.getView().byId("Object")
									.getSelectedKey(),
							"Nature" : this.getView().byId("Nature")
									.getSelectedKey(),
							"Help" : this.getView().byId("Help")
									.getSelectedKey(),
							"Open Date" : this.getView().byId("opendate")
									.getValue(),
							"Time" : this.getView().byId("time").getValue(),
							"Expected" : this.getView().byId("Expected")
									.getValue(),
							"TimeEx" : this.getView().byId("time2").getValue(),
							"Status" : "Pending",
							"message" : this.getView().byId("addMessage")
									.getValue(),
							"commentVisible" : "false"
						};
						this.getView().getModel("disruptionModel").getProperty(
								"/Disruption").push(oNewDisruptionData);
						this.getView().getModel("disruptionModel").refresh();
						this.getView().byId("disruptionsHeader").setVisible(
								true);
						this.getView().byId("FormToolbar").setVisible(false);

					},

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

					}
				/*
				 * onLiveChangetxtArea:function(){
				 * this.getView().byId("addMessage").getValue(); }
				 */

				});

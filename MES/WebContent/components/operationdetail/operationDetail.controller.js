//jQuery.sap.require("airbus.mes.stationtracker.util.Formatter");

sap.ui
		.controller(
				"airbus.mes.operationdetail.operationDetail",
				{
					reasonCodeText : undefined,
					operationStatus : undefined,

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf components.stationtracker.stationtracker
					 */
					onInit : function() {
						this.nav = this.getView()
								.byId("operDetailNavContainer");
						if (airbus.mes.operationdetail.status === undefined
								|| airbus.mes.operationdetail.status.oView === undefined) {
							sap.ui.getCore().createComponent({
								name : "airbus.mes.operationdetail.status",
							});
							this.nav
									.addPage(airbus.mes.operationdetail.status.oView);
						}

						this.nav.to(airbus.mes.operationdetail.status.oView
								.getId());
					},
					expandOperationDetailPanel : function(oEvent) {
						var toggleButton = this.getView().byId(
								"opDetailExpandButton");
						toggleButton.setVisible(!toggleButton.getVisible());

						this.getView().byId("operationDetailPanel")
								.setExpanded();
					},
					/* increase or decrease Progress Functions */

					addProgress : function() {
						oProgressSlider = this.getView().byId("progressSlider");
						oProgressSlider.stepUp(1);
					},

					reduceProgress : function() {
						oProgressSlider = this.getView().byId("progressSlider");
						oProgressSlider.stepDown(1);
					},
					onCloseOperationDetailPopup : function() {

						airbus.mes.stationtracker.operationDetailPopup.close();
						airbus.mes.shell.oView.getController()
								.renderStationTracker();
					},
					/***********************************************************
					 * 
					 * activate pause or confirm operation
					 * 
					 **********************************************************/
					activateOperation : function() {

						var data = this.getView().getModel(
								"operationDetailModel").oData.Rowsets.Rowset[0].Row[0];
						var sMessageSuccess = this.getView().getModel("i18n")
								.getProperty("SuccessfulActivation");
						var sMessageError = this.getView().getModel("i18n")
								.getProperty("UnsuccessfulActivation");
						var flag_success;
						jQuery
								.ajax({
									url : airbus.mes.operationdetail.ModelManager
											.getUrlStartOperation(data),
									async : false,
									error : function(xhr, status, error) {
										airbus.mes.operationdetail.ModelManager
												.messageShow(sMessageError);
										flag_success = false
									},
									success : function(result, status, xhr) {

										if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
											airbus.mes.operationdetail.ModelManager
													.messageShow(sMessageSuccess);
											flag_success = true;
										} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
											airbus.mes.operationdetail.ModelManager
													.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
											flag_success = false;
										} else {
											airbus.mes.operationdetail.ModelManager
													.messageShow(sMessageSuccess);
											flag_success = true;
										}

									}
								});

						// Refresh User Operation Model and Operation Detail
						airbus.mes.shell.oView.getController()
								.renderStationTracker();

						// this.refreshOperationData();

						if (flag_success == true) {
							this.setProgressScreenBtn(true, true, false);
							this.getView().byId("progressSlider").setEnabled(
									true);
							this.getView().byId("operationStatus").setText(
									this.getView().getModel("i18n")
											.getProperty("in_progress"));

							// Re-Render Station Tracker
							airbus.mes.shell.oView.getController()
									.renderStationTracker();

							// update operationDetailsModel

							sap.ui.getCore().getModel("operationDetailModel")
									.setProperty(
											"/Rowsets/Rowset/0/Row/0/status",
											"IN_WORK")
							sap.ui.getCore().getModel("operationDetailModel")
									.refresh();

						}
					},
					pauseOperation : function() {
						var data = this.getView().getModel(
								"operationDetailModel").oData.Rowsets.Rowset[0].Row[0];
						var sMessageSuccess = this.getView().getModel("i18n")
								.getProperty("SuccessfulPause");
						var sMessageError = this.getView().getModel("i18n")
								.getProperty("UnsuccessfulPause");
						var flag_success;
						jQuery
								.ajax({
									url : airbus.mes.operationdetail.ModelManager
											.getUrlPauseOperation(data),
									async : false,
									error : function(xhr, status, error) {
										airbus.mes.operationdetail.ModelManager
												.messageShow(sMessageError);
										flag_success = false

									},
									success : function(result, status, xhr) {

										if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
											airbus.mes.operationdetail.ModelManager
													.messageShow(sMessageSuccess);
											flag_success = true;
										} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
											airbus.mes.operationdetail.ModelManager
													.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
											flag_success = false;
										} else {
											airbus.mes.operationdetail.ModelManager
													.messageShow(sMessageSuccess);
											flag_success = true;
										}

									}
								});

						if (flag_success == true) {
							this.setProgressScreenBtn(false, false, true);
							this.getView().byId("progressSlider").setEnabled(
									false);
							this.getView().byId("btnActivate")
									.setType("Accept");
							this.getView().byId("operationStatus").setText(
									this.getView().getModel("i18n")
											.getProperty("paused"));

							// Re-Render Station Tracker
							airbus.mes.shell.oView.getController()
									.renderStationTracker();

							// update operationDetailsModel

							sap.ui.getCore().getModel("operationDetailModel")
									.setProperty(
											"/Rowsets/Rowset/0/Row/0/status",
											"IN_QUEUE")
							sap.ui.getCore().getModel("operationDetailModel")
									.refresh();

							// reset the progress slider to original position
							this
									.refreshOperationData(sap.ui
											.getCore()
											.getModel("operationDetailModel")
											.getProperty(
													"/Rowsets/Rowset/0/Row/0/progress"));

						}

					},

					confirmOperation : function(oEvent) {

						if (oEvent.getSource().getText() == this.getView()
								.getModel("i18n").getProperty("confirm")) {
							if (!this._reasonCodeDialog) {

								this._reasonCodeDialog = sap.ui
										.xmlfragment(
												"airbus.mes.operationdetail.fragments.reasonCode",
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
												"airbus.mes.operationdetail.fragments.userConfirmation",
												this);

								this.getView().addDependent(
										this._oUserConfirmationDialog);
								// click on complete
								this.operationStatus = "X";
							}
							this._oUserConfirmationDialog.open();

							sap.ui.getCore().byId("userNameForConfirmation")
									.setValue("");
							sap.ui.getCore().byId("passwordForConfirmation")
									.setValue("");

						}
					},

					/***********************************************************
					 * 
					 * User Confirmation Dialog Methods
					 * 
					 **********************************************************/
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

						var sMessageSuccess = this.getView().getModel("i18n")
								.getProperty("SuccessfulConfirmation");
						var sMessageError = this.getView().getModel("i18n")
								.getProperty("ErrorDuringConfirmation");

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
							var sfc = airbus.mes.operationdetail.ModelManager.sfc;
							if (this.operationStatus == "X")
								var percent = "100"
							else {
								var percent = this.getView().byId(
										"progressSlider").getValue();
							}

							// Call service for Operation Confirmation
							jQuery
									.ajax({
										url : airbus.mes.operationdetail.ModelManager
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
																		"/Rowsets/Rowset/0/Row/0/sfc_step_ref"),
														this.reasonCodeText),
										async : false,
										error : function(xhr, status, error) {
											airbus.mes.operationdetail.ModelManager
													.messageShow(sMessageError);
											flag_success = false

										},
										success : function(result, status, xhr) {
											if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
												airbus.mes.operationdetail.ModelManager
														.messageShow(sMessageSuccess);
												flag_success = true;
											} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
												airbus.mes.operationdetail.ModelManager
														.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
												flag_success = false;
											} else {
												airbus.mes.operationdetail.ModelManager
														.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
												flag_success = true;
											}

										}
									});

							this._oUserConfirmationDialog.close();

							if (flag === true) {
								// Refresh User Operation Model and Operation
								// Detail
								airbus.mes.shell.oView.getController()
										.renderStationTracker();

								this.refreshOperationData(percent);

								// update operationDetailsModel
								sap.ui.getCore().getModel(
										"operationDetailModel").setProperty(
										"/Rowsets/Rowset/0/Row/0/progress",
										percent)
								sap.ui.getCore().getModel(
										"operationDetailModel").refresh();

							}

						}
					},

					refreshOperationData : function(percentage) {
						this.getView().byId("progressSliderfirst").setWidth(
								percentage + "%");
						this.getView().byId("progressSlider").setWidth(
								(100 - parseInt(percentage)) + "%");

						this.getView().byId("progressSliderfirst").setMax(
								parseInt(percentage));
						this.getView().byId("progressSlider").setMin(
								parseInt(percentage));

						this.getView().byId("progressSliderfirst").setValue(
								parseInt(percentage));
						this.getView().byId("progressSlider").setValue(
								parseInt(percentage));

						switch (parseInt(percentage)) {
						case 100:
							this.getView().byId("progressSliderfirst")
									.setVisible(true);
							this.getView().byId("progressSlider").setVisible(
									false);
							break;
						case 0:
							this.getView().byId("progressSliderfirst")
									.setVisible(false);
							this.getView().byId("progressSlider").setVisible(
									true);
							this.getView().byId("progressSlider")
									.removeStyleClass("dynProgressSlider");
							break;
						default:
							this.getView().byId("progressSliderfirst")
									.setVisible(true);
							this.getView().byId("progressSlider").setVisible(
									true);
							this.getView().byId("progressSlider")
									.addStyleClass("dynProgressSlider");
							break;
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
											"airbus.mes.operationdetail.fragments.userConfirmation",
											this);

							this.getView().addDependent(
									this._oUserConfirmationDialog);
						}
						this._oUserConfirmationDialog.open();
						sap.ui.getCore().byId("userNameForConfirmation")
								.setValue("");
						sap.ui.getCore().byId("passwordForConfirmation")
								.setValue("");

					},

					onCancelReasonCode : function() {
						this._reasonCodeDialog.close();
					},
					/***********************************************************
					 * set Buttons on the screen according to status
					 * 
					 **********************************************************/

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

					/**
					 * Similar to onBeforeRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf components.stationtracker.stationtracker
					 */
					onBeforeRendering : function() {

						//				
					},
					/**
					 * Called when the View has been rendered (so its HTML is
					 * part of the document). Post-rendering manipulations of
					 * the HTML could be done here. This hook is the same one
					 * that SAPUI5 controls get after being rendered.
					 * 
					 * @memberOf components.stationtracker.stationtracker
					 */
					onAfterRendering : function() {

						// Collapse Operation Detail panel and show Expand
						// button
						this.getView().byId("opDetailExpandButton").setVisible(
								true);
						this.getView().byId("operationDetailPanel")
								.setExpanded(false);

						/*
						 * // Load Reason Code Model // Model for Reason Code
						 * Comments airbus.mes.operationdetail.ModelManager
						 * .loadReasonCodeModel(); // Set Slider enabled or
						 * dis-abeled based on Status
						 * sap.ui.getCore().getModel("operationDetailModel")
						 * .refresh();
						 * 
						 * if (this.getView().byId("operationStatus").getText()
						 * === "Not Started" ||
						 * this.getView().byId("operationStatus") .getText() ===
						 * "Paused") {
						 * 
						 * this.setProgressScreenBtn(false, false, true);
						 * this.getView().byId("progressSlider").setEnabled(
						 * false); } else if
						 * (this.getView().byId("operationStatus") .getText()
						 * === "In Progress") {
						 * 
						 * this.setProgressScreenBtn(true, true, false);
						 * this.getView().byId("progressSlider").setEnabled(
						 * true); } else if
						 * (this.getView().byId("operationStatus") .getText()
						 * === "Blocked" ||
						 * this.getView().byId("operationStatus") .getText() ===
						 * "Confirmed") {
						 * 
						 * this.setProgressScreenBtn(false, false, false);
						 * this.getView().byId("progressSlider").setEnabled(
						 * false); this.getView().byId("progressSliderfirst")
						 * .setEnabled(false); }
						 * 
						 * $("#operationDetailsView--operationNav-content")
						 * .height( ($("#"+
						 * airbus.mes.operationdetail.parentId).height() -
						 * $("#operationDetailsView--operationDetailPanel").height() -
						 * $("#operationDetailsView--operationNav--header").height() -
						 * $("#operationDetailsView--operationStatusFooter").height()
						 * ));
						 */

					},

					/***********************************************************
					 * 
					 * Switch Execution Mode for Operation Detail
					 * 
					 * @param oEvent
					 */
					switchMode : function(oEvent) {
						var oSwitchButton = oEvent.getSource();

						if (oSwitchButton.getState() == true) {
							this.getView().byId("switchStatusLabel").setText(
									this.getView().getModel("i18n")
											.getProperty("Execution"));
							// this.setScreenforSwitchMode(true);

						} else {
							this.getView().byId("switchStatusLabel").setText(
									this.getView().getModel("i18n")
											.getProperty("ReadOnly"));
							// this.setScreenforSwitchMode(false);
						}
					},
					/***********************************************************
					 * Click on segmented button to respective page
					 */
					openPage : function(oEvent) {
						var sItemKey = oEvent.getSource().getKey();

						switch (sItemKey) {

						case "status":
							if (airbus.mes.operationdetail.status === undefined
									|| airbus.mes.operationdetail.status.oView === undefined) {
								sap.ui.getCore().createComponent({
									name : "airbus.mes.operationdetail.status",
								});
								this.nav
										.addPage(airbus.mes.operationdetail.status.oView);
							}

							this.nav.to(airbus.mes.operationdetail.status.oView
									.getId());

							break;
						case "disruption":
							if (airbus.mes.operationdetail.viewDisruption === undefined
									|| airbus.mes.operationdetail.viewDisruption.oView === undefined) {
								sap.ui
										.getCore()
										.createComponent(
												{
													name : "airbus.mes.operationdetail.viewDisruption",
												});
								this.nav
										.addPage(airbus.mes.operationdetail.viewDisruption.oView);
							}

							this.nav
									.to(airbus.mes.operationdetail.viewDisruption.oView
											.getId());
							break;
						}
					},

				/*
				 * setScreenforSwitchMode : function(mode) {
				 * this.getView().byId("btnPause").setVisible(mode);
				 * this.getView().byId("btnConfirm").setVisible(mode);
				 * this.getView().byId("btnComplete").setVisible(mode);
				 * this.getView().byId("reasonCodeSelectBox").setEnabled(mode);
				 * this.getView().byId("reasonCodeComments").setEnabled(mode);
				 * 
				 * this.getView().byId("btnReduce").setEnbaled(mode);
				 * this.getView().byId("btnAdd").setEnbaled(mode);
				 * this.getView().byId("progressSlider").setEnabled(mode); }
				 */
				});

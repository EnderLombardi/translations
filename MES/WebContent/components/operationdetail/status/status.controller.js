sap.ui
		.controller(
				"airbus.mes.operationdetail.status.status",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf components.operationdetail.status.status
					 */
					// onInit: function() {
					//
					// },
					/**
					 * Similar to onAfterRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf components.operationdetail.status.status
					 */
					// onBeforeRendering: function() {
					//
					// },
					/* increase or decrease Progress Functions */

					addProgress : function() {
						oProgressSlider = sap.ui.getCore().byId("progressSlider")
						oProgressSlider.stepUp(1);
					},

					reduceProgress : function() {
						oProgressSlider = sap.ui.getCore().byId("progressSlider")
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

						if (flag_success == true) {
							this.setProgressScreenBtn( true, false);
							
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
							this.setProgressScreenBtn( false, true);
							
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

						}

					},

					confirmOperation : function(oEvent) {

						switch(oEvent.getSource().getText()){
						
						case this.getView().getModel("i18n").getProperty("confirm"):

							// click on confirm
							this.operationStatus = "C";
							this.Mode = this.getView().getModel("i18n").getProperty("EarnedStandards")
							
							airbus.mes.operationdetail.ModelManager.loadReasonCodeModel();
							if (!this._reasonCodeDialog) {

								this._reasonCodeDialog = sap.ui
										.xmlfragment(
												"airbus.mes.operationdetail.fragments.reasonCode",
												this);

								this.getView().addDependent(
										this._reasonCodeDialog);
							}
							this._reasonCodeDialog.open();
							
							break;
							
						case this.getView().getModel("i18n").getProperty("complete"):
							
							// Click on Complete
							this.operationStatus = "X";
							this.Mode = this.getView().getModel("i18n").getProperty("complete")
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
							
							break;

						}
						
					},

					/***********************************************************
					 * 
					 * User Confirmation Dialog Methods
					 * 
					 **********************************************************/
					onCancelConfirmation : function() {
						this._oUserConfirmationDialog.close();
						
					},
					
					/*********************************************************
					 * Close - Close Disruption Pop-Up
					 */
					closeCancelDisruptFragment: function(oEvnt){
						
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
								{
								var percent = 100;
									this.getView().byId("operationStatus").setText(
											this.getView().getModel("i18n")
													.getProperty("confirm"));
								this.setProgressScreenBtn(false,false);
								sap.ui.getCore().getModel("operationDetailModel")
								.setProperty(
										"/Rowsets/Rowset/0/Row/0/status",
										"COMPLETED")
										sap.ui.getCore().getModel("operationDetailModel")
								.setProperty(
										"/Rowsets/Rowset/0/Row/0/progress",
										100);
										sap.ui.getCore().getModel("operationDetailModel")
								.refresh();
								}
							else {
								var percent = sap.ui.getCore().byId(
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
														this.reasonCodeText,this.Mode),
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
							// Close reason code dialog
							this._reasonCodeDialog.close();
							this._oUserConfirmationDialog.close();

							if (flag_success === true) {
								// Refresh User Operation Model and Operation
								// Detail
								airbus.mes.shell.oView.getController()
										.renderStationTracker();

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
						//this._reasonCodeDialog.close();

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
						
						sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].progress_new = sap.ui
								.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].progress;
						sap.ui.getCore().getModel("operationDetailModel").refresh();
						this._reasonCodeDialog.close();
					},
					/***********************************************************
					 * set Buttons on the screen according to status
					 * 
					 **********************************************************/

					setProgressScreenBtn : function(
							actionBtnStatus, activateBtnStatus) {
						
					
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
				 * Called when the View has been rendered (so its HTML is part
				 * of the document). Post-rendering manipulations of the HTML
				 * could be done here. This hook is the same one that SAPUI5
				 * controls get after being rendered.
				 * 
				 * @memberOf components.operationdetail.status.status
				 */
					 onAfterRendering: function() {
						 this.setOperationActionButtons();
						

						},
						setOperationActionButtons:function(){
							 if(sap.ui.getCore().byId("operationDetailsView--switchOperationModeBtn").getState() == false)
							 {
							 this.setProgressScreenBtn(false, false);
							 }
						 else if (this.getView().byId("operationStatus").getText() === "Not Started"
									|| this.getView().byId("operationStatus")
											.getText() === "Paused") {

								this.setProgressScreenBtn(false, true);
								
							} else if (this.getView().byId("operationStatus")
									.getText() === "In Progress") {

								this.setProgressScreenBtn(true, false);
								
							} else if (this.getView().byId("operationStatus")
									.getText() === "Blocked"
									|| this.getView().byId("operationStatus")
											.getText() === "Confirmed") {

								this.setProgressScreenBtn(false, false);
														}
							
						}
						
				/**
				 * Called when the Controller is destroyed. Use this one to free
				 * resources and finalize activities.
				 * 
				 * @memberOf components.operationdetail.status.status
				 */
				// onExit: function() {
				//
				// }
				});
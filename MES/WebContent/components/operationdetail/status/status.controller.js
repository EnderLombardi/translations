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
					onInit : function() {

						// Set action on buttons
						sap.ui.getCore().byId("operationDetailPopup--btnPause")
								.detachPress(this.pauseOperation);
						sap.ui.getCore().byId(
								"operationDetailPopup--btnConfirm")
								.detachPress(this.confirmOperation);
						sap.ui.getCore().byId(
								"operationDetailPopup--btnActivate")
								.detachPress(this.activateOperation);
						sap.ui.getCore().byId(
								"operationDetailPopup--btnComplete")
								.detachPress(this.confirmOperation);
						
						sap.ui.getCore().byId("operationDetailPopup--btnPause")
								.attachPress(this.pauseOperation);
						sap.ui.getCore().byId(
								"operationDetailPopup--btnConfirm")
								.attachPress(this.confirmOperation);
						sap.ui.getCore().byId(
								"operationDetailPopup--btnActivate")
								.attachPress(this.activateOperation);
						sap.ui.getCore().byId(
								"operationDetailPopup--btnComplete")
								.attachPress(this.confirmOperation);

					},
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
						oProgressSlider = sap.ui.getCore().byId(
								"progressSlider")
						oProgressSlider.stepUp(1);
					},

					reduceProgress : function() {
						oProgressSlider = sap.ui.getCore().byId(
								"progressSlider")
						oProgressSlider.stepDown(1);
					},


					/***********************************************************
					 * 
					 * activate pause or confirm operation
					 * 
					 **********************************************************/
					activateOperation : function() {

						var oView = airbus.mes.operationdetail.status.oView;

						var data = oView.getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0];

						var sMessageSuccess = oView.getModel("i18n")
								.getProperty("SuccessfulActivation");
						var sMessageError = oView.getModel("i18n").getProperty(
								"UnsuccessfulActivation");

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
													.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
											flag_success = true;
										}

									}
								});

						// Refresh User Operation Model and Operation Detail
						
						airbus.mes.shell.oView.getController()
								.renderStationTracker();


						// Refresh User Operation Model and Operation Detail
						if (flag_success == true) {
							oView.getController().setProgressScreenBtn(true,
									false);

							oView.byId("operationStatus").setText(
									oView.getModel("i18n").getProperty(
											"in_progress"));

							// Re-Render Station Tracker
							/*airbus.mes.shell.oView.getController()
									.renderStationTracker();*/

							// update operationDetailsModel

							sap.ui.getCore().getModel("operationDetailModel")
									.setProperty(
											"/Rowsets/Rowset/0/Row/0/status",
											"IN_WORK")
							sap.ui.getCore().getModel("operationDetailModel")
									.refresh();
							
							
							// Refresh Station tracker Gantt Chart
							/*airbus.mes.shell.oView.getController()
									.renderStationTracker();*/

						}
					},
					pauseOperation : function() {
						var oView = airbus.mes.operationdetail.status.oView;

						var data = oView.getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0];
						var sMessageSuccess = oView.getModel("i18n")
								.getProperty("SuccessfulPause");
						var sMessageError = oView.getModel("i18n").getProperty(
								"UnsuccessfulPause");
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
													.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
											flag_success = true;
										}

									}
								});

						if (flag_success == true) {
							oView.getController().setProgressScreenBtn(false,
									true);

							//oView.byId("btnActivate").setType("Accept");
							oView.byId("operationStatus").setText(
									oView.getModel("i18n")
											.getProperty("paused"));

							// Re-Render Station Tracker
							/*airbus.mes.shell.oView.getController()
									.renderStationTracker();*/

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

						var oView = airbus.mes.operationdetail.status.oView;

						switch (oEvent.getSource().getText()) {

						case oView.getModel("i18n").getProperty("confirm"):

							// click on confirm
							oView.getController().operationStatus = "C";
							oView.getController().Mode = oView.getModel("i18n")
									.getProperty("EarnedStandards")

							airbus.mes.operationdetail.ModelManager
									.loadReasonCodeModel();
							if (!oView._reasonCodeDialog) {

								oView._reasonCodeDialog = sap.ui
										.xmlfragment(
												"airbus.mes.operationdetail.fragments.reasonCode",
												oView.getController());

								oView.addDependent(oView._reasonCodeDialog);
							}
							oView._reasonCodeDialog.open();

							break;

						case oView.getModel("i18n").getProperty("complete"):

							// Click on Complete
							oView.getController().operationStatus = "X";
							oView.getController().Mode = airbus.mes.operationdetail.status.oView
									.getModel("i18n").getProperty("complete")
							if (!oView._oUserConfirmationDialog) {

								oView._oUserConfirmationDialog = sap.ui
										.xmlfragment(
												"airbus.mes.operationdetail.fragments.userConfirmation",
												oView.getController());

								oView
										.addDependent(oView._oUserConfirmationDialog);
							}
							//Display PIN Field in Confirmation PopUp
							var flagForPIN = airbus.mes.settings.AppConfManager.getConfiguration("MES_BADGE_PIN");	
							if(flagForPIN == true){	
								sap.ui.getCore().byId("confirmPinLabel")
								.setVisible(true);
								sap.ui.getCore().byId("pinForConfirmation")
								.setVisible(true);
							}	

							oView._oUserConfirmationDialog.open();
							sap.ui.getCore().byId("msgstrpConfirm")
									.setVisible(false);
							sap.ui.getCore().byId("UIDForConfirmation")
									.setValue("");
							sap.ui.getCore().byId("badgeIDForConfirmation")
									.setValue("");
							sap.ui.getCore().byId("pinForConfirmation")
									.setValue("");
							sap.ui.getCore().byId("userNameForConfirmation")
									.setValue("");
							sap.ui.getCore().byId("passwordForConfirmation")
									.setValue("");

							break;

						}

					},


					/***********************************************************
					 * on click of go to Disruption button when status of
					 * operation is Blocked
					 * 
					 */
					onPressGotoDisruptios : function() {
						this.nav = sap.ui.getCore().byId(
								"operationDetailsView--operDetailNavContainer")
						airbus.mes.shell.util.navFunctions
								.disruptionsDetail(
										this.nav,
										sap.ui
												.getCore()
												.byId(
														"operationDetailPopup--reportDisruption"), // Report
																									// Disruption
																									// Button
										sap.ui
												.getCore()
												.byId(
														"operationDetailPopup--btnCreateDisruption"), // Create
																										// Button
										sap.ui
												.getCore()
												.byId(
														"operationDetailPopup--btnUpdateDisruption"), // Update
																										// Button
										sap.ui
												.getCore()
												.byId(
														"operationDetailPopup--btnCancelDisruption") // Cancel
																										// Button
								);
						this.nav.to(airbus.mes.disruptions.oView.viewDisruption
								.getId());

						sap.ui
								.getCore()
								.byId(
										"operationDetailsView--opDetailSegmentButtons")
								.setSelectedButton(
										sap.ui
												.getCore()
												.byId(
														"operationDetailsView--opDetailSegmentButtons")
												.getButtons()[1].sId);

					},

					/***********************************************************
					 * 
					 * User Confirmation Dialog Methods
					 * 
					 **********************************************************/
					/***********************************************************
					 * Scan Badge for User Confirmation
					 */
					onScanConfirmation : function(oEvt) {
						var timer;
						sap.ui.getCore().byId("UIDForConfirmation").setValue();
						sap.ui.getCore().byId("badgeIDForConfirmation").setValue();
							//close existing connection. then open again
							oEvt.getSource().setEnabled(false);
						var callBackFn = function(){
								console.log("callback entry \n");
								console.log("connected");
								if(airbus.mes.shell.ModelManager.badgeReader.readyState==1){
									airbus.mes.shell.ModelManager.brStartReading();
									sap.ui.getCore().byId("msgstrpConfirm").setText("Conenction Opened");
									var i=10;
									
									timer = setInterval(function(){
										sap.ui.getCore().byId("msgstrpConfirm").setType("Information");
										sap.ui.getCore().byId("msgstrpConfirm").setText("Please Connect your badge in "+ i--);
										if(i<0){
											clearInterval(timer);
											airbus.mes.shell.ModelManager.brStopReading();
											sap.ui.getCore().byId("scanButton").setEnabled(true);
											sap.ui.getCore().byId("msgstrpConfirm").setType("Warning");
											sap.ui.getCore().byId("msgstrpConfirm").setText("Conenction Timeout. Click on scan to confirm");
											airbus.mes.shell.ModelManager.brStopReading();
											airbus.mes.shell.ModelManager.badgeReader.close();
											setTimeout(function(){
												sap.ui.getCore().byId("msgstrpConfirm").setVisible(false);
											},2000)
										}
									}, 1000)
									

								}
							}
							

						var response = function(data) {
							clearInterval(timer);
							sap.ui.getCore().byId("scanButton").setEnabled(true);
							sap.ui.getCore().byId("msgstrpConfirm").setVisible(false);
							if (data.Message) {
								type = data.Message.split(":")[0]
								id = data.Message.split(":")[1];

								if (type == "UID") {
									sap.ui.getCore().byId("UIDForConfirmation")
											.setValue(id);
									sap.ui.getCore().byId("msgstrpConfirm").setType("Success");
									sap.ui.getCore().byId("msgstrpConfirm").setText("Scanned Successfully");
									sap.ui.getCore().byId("msgstrpConfirm").setVisble(true);
								} else if (type == "BID") {
									sap.ui.getCore().byId("badgeIDForConfirmation").setValue(id);
									sap.ui.getCore().byId("msgstrpConfirm").setType("Success");
									sap.ui.getCore().byId("msgstrpConfirm").setText("Scanned Successfully");
									sap.ui.getCore().byId("msgstrpConfirm").setVisble(true);
								} else {
									sap.ui.getCore().byId("msgstrpConfirm")
											.setVisible(true);
									sap.ui.getCore().byId("msgstrpConfirm")
											.setText("Error in scanning. Please try again.");
									sap.ui.getCore().byId("msgstrpConfirm").setType("Error");
								}
							}
							else {
								sap.ui.getCore().byId("msgstrpConfirm")
										.setVisible(true);
								sap.ui.getCore().byId("msgstrpConfirm").setType("Error");
								sap.ui.getCore().byId("msgstrpConfirm")
										.setText("Error in scanning. Please try again.");
							}
							setTimeout(function(){
								sap.ui.getCore().byId("msgstrpConfirm").setVisible(false);
								sap.ui.getCore().byId("msgstrpConfirm").setText("");
							},2000)
							
							airbus.mes.shell.ModelManager.badgeReader.close();
							sap.ui.getCore().byId("scanButton").setEnabled(true);
						}
						
						var error = function(){
							sap.ui.getCore().byId("scanButton").setEnabled(true);
							sap.ui.getCore().byId("msgstrpConfirm").setVisible(true);
							sap.ui.getCore().byId("msgstrpConfirm").setType("Error");
							sap.ui.getCore().byId("msgstrpConfirm").setText("Error in connection to websocket. try again.");
							setTimeout(function(){
								sap.ui.getCore().byId("msgstrpConfirm").setVisible(false);
								sap.ui.getCore().byId("msgstrpConfirm").setText("");
							},2000)
							sap.ui.getCore().byId("scanButton").setEnabled(true);
							
						}
							
							// Open a web socket connection
							//if(!airbus.mes.operationdetail.ModelManager.badgeReader){
							airbus.mes.shell.ModelManager.connectBadgeReader(callBackFn,response, error);
							//}

							sap.ui.getCore().byId("msgstrpConfirm").setType("Information");
							sap.ui.getCore().byId("msgstrpConfirm").setText("Opening connection Please wait...")
							sap.ui.getCore().byId("msgstrpConfirm").setVisible(true);
							
					},

					onCancelConfirmation : function() {
						var oView = airbus.mes.operationdetail.status.oView;

						oView._oUserConfirmationDialog.close();

					},

					onOKConfirmation : function(oEvent) {

						var oView = airbus.mes.operationdetail.status.oView;

						var uID = sap.ui.getCore().byId(
								"UIDForConfirmation").getValue();
						var bID = sap.ui.getCore().byId(
								"badgeIDForConfirmation").getValue();
						var ID;
						if (bID != "") {
							ID = bID;
						} else {
							ID = uID;
						}
						var pin = sap.ui.getCore().byId(
								"pinForConfirmation").getValue();
						var user = sap.ui.getCore().byId(
								"userNameForConfirmation").getValue();
						var pass = sap.ui.getCore().byId(
								"passwordForConfirmation").getValue();

						var sMessageSuccess = oView.getModel("i18n")
								.getProperty("SuccessfulConfirmation");
						var sMessageError = oView.getModel("i18n").getProperty(
								"ErrorDuringConfirmation");

						if ((user == "" || pass == "") && (ID == "")) {
							sap.ui.getCore().byId("msgstrpConfirm").setVisible(
									true);
							sap.ui.getCore().byId("msgstrpConfirm").setType(
									"Error");
							sap.ui.getCore().byId("msgstrpConfirm").setText(
									oView.getModel("i18n").getProperty(
											"CompulsaryCredentials"));
						} else {
							sap.ui.getCore().byId("msgstrpConfirm").setVisible(false);
							var percent;
							
							var sfc = airbus.mes.operationdetail.ModelManager.sfc;
							if (oView.getController().operationStatus == "X") {
								percent = 100;
							} 
							else{
								percent = sap.ui.getCore().byId("progressSlider").getValue();
							}
							//
							// Call service for Operation Confirmation
							var flag_success = airbus.mes.operationdetail.ModelManager.confirmOperation(user,
									pass,
									oView.getController().operationStatus,
									percent,
									oView.getModel("operationDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/sfc_step_ref"),
									oView.getController().reasonCodeText,
									oView.getController().Mode,
									ID, pin, sMessageError, sMessageSuccess);
							
							// Close reason code dialog
							oView._reasonCodeDialog.close();
							oView._oUserConfirmationDialog.close();

							if (flag_success === true) {
								// Refresh User Operation Model and Operation
								// Detail
								/*airbus.mes.shell.oView.getController()
										.renderStationTracker();*/

								// update operationDetailsModel
								if(oView.getController().operationStatus == "X"){
									sap.ui.getCore().getModel("operationDetailModel").setProperty("/Rowsets/Rowset/0/Row/0/status","COMPLETED");
									oView.getController().setProgressScreenBtn(false, false);
								}
								
								sap.ui.getCore().getModel("operationDetailModel").setProperty("/Rowsets/Rowset/0/Row/0/progress",percent)
								sap.ui.getCore().getModel("operationDetailModel").refresh();
								

							}

						}
					},

					/***********************************************************
					 * ReasonCode Fragment Methods
					 **********************************************************/
					onSubmitReasonCode : function(oEvent) {
						var oView = airbus.mes.operationdetail.status.oView;

						// store reason Code text
						oView.getController().reasonCodeText = sap.ui.getCore()
								.byId("reasonCodeSelectBox").getSelectedKey()
								+ "-"
								+ sap.ui.getCore().byId("reasonCodeComments")
										.getValue()
						// Close reason code dialog
						// this._reasonCodeDialog.close();

						if (!oView._oUserConfirmationDialog) {

							oView._oUserConfirmationDialog = sap.ui
									.xmlfragment(
											"airbus.mes.operationdetail.fragments.userConfirmation",
											oView.getController());

							oView.addDependent(oView._oUserConfirmationDialog);
						}
						//Display PIN Field in Confirmation PopUp
						var flagForPIN = airbus.mes.settings.AppConfManager.getConfiguration("MES_BADGE_PIN");	
						if(flagForPIN == true){	
							sap.ui.getCore().byId("confirmPinLabel")
							.setVisible(true);
							sap.ui.getCore().byId("pinForConfirmation")
							.setVisible(true);
						} 
						oView._oUserConfirmationDialog.open();
						sap.ui.getCore().byId("msgstrpConfirm")
								.setVisible(false);
						sap.ui.getCore().byId("UIDForConfirmation")
								.setValue("");
						sap.ui.getCore().byId("badgeIDForConfirmation")
								.setValue("");
						sap.ui.getCore().byId("pinForConfirmation")
								.setValue("");
						sap.ui.getCore().byId("userNameForConfirmation")
								.setValue("");
						sap.ui.getCore().byId("passwordForConfirmation")
								.setValue("");

					},

					onCancelReasonCode : function() {

						var oView = airbus.mes.operationdetail.status.oView;

						sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].progress_new = sap.ui
								.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].progress;
						sap.ui.getCore().getModel("operationDetailModel")
								.refresh();
						oView._reasonCodeDialog.close();
					},
					/***********************************************************
					 * set Buttons on the screen according to status
					 * 
					 **********************************************************/

					setProgressScreenBtn : function(actionBtnStatus,
							activateBtnStatus) {

						sap.ui.getCore().byId("operationDetailPopup--btnPause")
								.setVisible(actionBtnStatus);
						sap.ui.getCore().byId(
								"operationDetailPopup--btnConfirm").setVisible(
								actionBtnStatus);
						sap.ui.getCore().byId(
								"operationDetailPopup--btnComplete")
								.setVisible(actionBtnStatus);
						sap.ui.getCore().byId(
								"operationDetailPopup--btnActivate")
								.setVisible(activateBtnStatus);
					},

					/**
					 * Called when the View has been rendered (so its HTML is
					 * part of the document). Post-rendering manipulations of
					 * the HTML could be done here. This hook is the same one
					 * that SAPUI5 controls get after being rendered.
					 * 
					 * @memberOf components.operationdetail.status.status
					 */
					onAfterRendering : function() {
						this.setOperationActionButtons();

					},

					setOperationActionButtons : function() {
						this.getView().byId("blockedText").setVisible(false);
						this.getView().byId("goToDisruption").setVisible(false);
						if (sap.ui.getCore().byId(
								"operationDetailsView--switchOperationModeBtn")
								.getState() == false) {
							this.setProgressScreenBtn(false, false);
							if (this.getView().byId("operationStatus")
									.getText() === airbus.mes.operationdetail.status.oView
									.getModel("i18n").getProperty("blocked")) {
								this.getView().byId("blockedText").setVisible(
										true);
								this.getView().byId("goToDisruption")
										.setVisible(true);

							}
						} else if (this.getView().byId("operationStatus")
								.getText() === airbus.mes.operationdetail.status.oView
								.getModel("i18n").getProperty("notStarted")
								|| this.getView().byId("operationStatus")
										.getText() === airbus.mes.operationdetail.status.oView
										.getModel("i18n").getProperty("paused")) {

							this.setProgressScreenBtn(false, true);

						} else if (this.getView().byId("operationStatus")
								.getText() === airbus.mes.operationdetail.status.oView
								.getModel("i18n").getProperty("in_progress")) {

							this.setProgressScreenBtn(true, false);

						} else if (this.getView().byId("operationStatus")
								.getText() === airbus.mes.operationdetail.status.oView
								.getModel("i18n").getProperty("blocked")) {
							this.setProgressScreenBtn(false, false);
							this.getView().byId("blockedText").setVisible(true);
							this.getView().byId("goToDisruption").setVisible(
									true);

						} else if (this.getView().byId("operationStatus")
								.getText() === airbus.mes.operationdetail.status.oView
								.getModel("i18n").getProperty("confirmed")) {

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

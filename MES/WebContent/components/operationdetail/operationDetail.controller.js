"use strict";
sap.ui
		.controller(
				"airbus.mes.operationdetail.operationDetail",
				{
					reasonCodeText : undefined,
					operationStatus : undefined,
					disruptionsFlag : false,
					disruptionsCustomDataFlag: undefined,

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf components.operationdetail.operationDetail
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
						
					},
					expandOperationDetailPanel : function(oEvent) {
						var toggleButton = this.getView().byId(
								"opDetailExpandButton");
						toggleButton.setVisible(!toggleButton.getVisible());

						var toggleButton2 = this.getView().byId(
								"opDetailCloseButton");
						toggleButton2.setVisible(!toggleButton2.getVisible());

						this.getView().byId("operationDetailPanel")
								.setExpanded(!toggleButton.getVisible());
					},

					/*onCloseOperationDetailPopup : function() {

						airbus.mes.stationtracker.operationDetailPopup.close();
						airbus.mes.shell.oView.oController
								.renderStationTracker();
					},*/

					/**
					 * Similar to onBeforeRendering, but this hook is invoked
					 * before the controller's View is re-rendered (NOT before
					 * the first rendering! onInit() is used for that one!).
					 * 
					 * @memberOf components.operationdetail.operationDetail
					 */
					//onBeforeRendering : function() {/
					//				
					//},
					/**
					 * Called when the View has been rendered (so its HTML is
					 * part of the document). Post-rendering manipulations of
					 * the HTML could be done here. This hook is the same one
					 * that SAPUI5 controls get after being rendered.
					 * 
					 * @memberOf components.operationdetail.operationDetail
					 */
					onAfterRendering : function() {
						this.disruptionsFlag = false;
						this.disruptionsCustomDataFlag = false;

						// Navigation to Status every time pop-up is opened
						this.nav.to(airbus.mes.operationdetail.status.oView
								.getId());
						this.getView().byId("opDetailSegmentButtons")
								.setSelectedButton(
										this.getView().byId(
												"opDetailSegmentButtons")
												.getButtons()[0].sId);

						// Collapse Operation Detail panel and show Expand
						// button
						this.getView().byId("opDetailExpandButton").setVisible(
								true);
						this.getView().byId("opDetailCloseButton").setVisible(
								false);
						this.getView().byId("operationDetailPanel")
								.setExpanded(false);
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

						} else {
							this.getView().byId("switchStatusLabel").setText(
									this.getView().getModel("i18n")
											.getProperty("ReadOnly"));
						}
						/**
						 * ***set the buttons according to the status of
						 * operation mode *****
						 */
						switch(this.nav.getCurrentPage().getId()){
						
						case "idStatusView":
							airbus.mes.operationdetail.status.oView.oController.setOperationActionButtons();
							break;
							
						case "ViewDisruptionView":
							airbus.mes.disruptions.oView.viewDisruption.oController.turnOnOffButtons();
							break;

						case "createDisruptionView":
							airbus.mes.disruptions.oView.createDisruption.oController.onCancelCreateDisruption();
							
						case "reschedulePage--reschedulePage":
							
							if (sap.ui.getCore().byId("operationDetailsView--switchOperationModeBtn").getState() === true) {
								
								sap.ui.getCore().byId("operationDetailPopup--btnReschedule").setVisible(true);
							} else  { sap.ui.getCore().byId("operationDetailPopup--btnReschedule").setVisible(false); }
							
						default:
							break;
						}

					},

					/***********************************************************
					 * Click on segmented button to respective page
					 */
					openPage : function(oEvent) {
						var sItemKey = oEvent.getSource().getKey();

						switch (sItemKey) {

						case "status":
							if (airbus.mes.operationdetail.status === undefined	|| airbus.mes.operationdetail.status.oView === undefined) {
								sap.ui.getCore().createComponent({ name : "airbus.mes.operationdetail.status",	});
								this.nav.addPage(airbus.mes.operationdetail.status.oView);
							}

							this.nav.to(airbus.mes.operationdetail.status.oView	.getId());

							break;
						case "disruption":
							airbus.mes.shell.util.navFunctions.disruptionsDetail(this.nav,
									sap.ui.getCore().byId("operationDetailPopup--reportDisruption"), // Report Disruption Button
									sap.ui.getCore().byId("operationDetailPopup--btnCreateDisruption"), // Create Button
									sap.ui.getCore().byId("operationDetailPopup--btnUpdateDisruption"), // Update Button
									sap.ui.getCore().byId("operationDetailPopup--btnCancelDisruption")	// Cancel Button		
						);
							

							
							/***************************************************
							 * Load Disruption Data
							 **************************************************/
							if (!this.disruptionsFlag) {
								var operationBO = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].operation_bo;
								var sSfcStepRef = sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0].sfc_step_ref;
								airbus.mes.disruptions.ModelManager.loadDisruptionsByOperation(operationBO,sSfcStepRef);
								this.disruptionsFlag = true;
							}
							
							
							/** Navigate **/
							this.nav.to(airbus.mes.disruptions.oView.viewDisruption.getId());
							
							break;
							
							case "reschedule":
							  	  
							var aGroup = [];

							// Check if we are on operation grouping
							// SD-PPC-ST-386
							if (airbus.mes.stationtracker.GroupingBoxingManager.box !== 'OPERATION_ID') {
								return;
							}

							var aModel = [sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0]];

							if (airbus.mes.stationtracker.ReschedulePopover === undefined) {
								
								var oModel = airbus.mes.stationtracker.oView.getModel("StationTrackerI18n");
								airbus.mes.stationtracker.ReschedulePopover = sap.ui.xmlfragment("reschedulePage","airbus.mes.stationtracker.Reschedule",airbus.mes.stationtracker.oView.getController());
								airbus.mes.stationtracker.ReschedulePopover.addStyleClass("alignTextLeft");
								airbus.mes.stationtracker.ReschedulePopover.setModel(oModel,"i18nModel");
								this.nav.addPage(airbus.mes.stationtracker.ReschedulePopover);
							}
							// Model for the current operation
							var oModel = new sap.ui.model.json.JSONModel();
							oModel.setData(aModel);
							
							airbus.mes.stationtracker.ReschedulePopover.setModel(oModel,"RescheduleModel");
							airbus.mes.stationtracker.ReschedulePopover.getModel()
							if (sap.ui.getCore().byId("operationDetailsView--switchOperationModeBtn").getState() === true) {
								
								sap.ui.getCore().byId("operationDetailPopup--btnReschedule").setVisible(true);
							} else  { sap.ui.getCore().byId("operationDetailPopup--btnReschedule").setVisible(false); }
							
							this.nav.to(airbus.mes.stationtracker.ReschedulePopover.getId());
							
							break;
							default:
							break;
						}
					},
					
					
					onNavigate: function(oEvent){
						
						
						/***************************************************
						 * Show/ Hide Footer Buttons
						 */
						switch(this.nav.getCurrentPage().sId){
						case "idStatusView":
							// Hide buttons
							sap.ui.getCore().byId("operationDetailPopup--btnPause").setVisible(false);
							sap.ui.getCore().byId("operationDetailPopup--btnActivate").setVisible(false);
							sap.ui.getCore().byId("operationDetailPopup--btnConfirm").setVisible(false);
							sap.ui.getCore().byId("operationDetailPopup--btnComplete").setVisible(false);
							
							break;
							
						case "ViewDisruptionView":
							// Hide buttons
							sap.ui.getCore().byId("operationDetailPopup--reportDisruption").setVisible(false);
							
							break;
						
						
						case "createDisruptionView":
							// Hide buttons
							sap.ui.getCore().byId("operationDetailPopup--btnCreateDisruption").setVisible(false);
							sap.ui.getCore().byId("operationDetailPopup--btnUpdateDisruption").setVisible(false);
							sap.ui.getCore().byId("operationDetailPopup--btnCancelDisruption").setVisible(false);
						
							break;
						
						case "reschedulePage--reschedulePage":
							
							 sap.ui.getCore().byId("operationDetailPopup--btnReschedule").setVisible(false); 
							
							break;
							
							
							
						default:
							break;
						}
						
					},

					renderViews : function(oEvent) {
						
						/*****************************************
						 * Load Data
						 */
						switch (this.nav.getCurrentPage().sId) {
						
						case "idStatusView":
							/** Set buttons visibility ****/
							airbus.mes.operationdetail.status.oView.oController.setOperationActionButtons();
							break;

						case "ViewDisruptionView":
							/** Set buttons visibility ****/
							airbus.mes.disruptions.oView.viewDisruption.oController.turnOnOffButtons();
							break;

						case "createDisruptionView":

							/*****************************
							 *  Set buttons visibility
							 *****************************/							
							// In case of Update of Disruption
							if (sap.ui.getCore().getModel("DisruptionDetailModel").getData() != undefined) {
									
								// set buttons according to update disruption
								sap.ui.getCore().byId("operationDetailPopup--btnUpdateDisruption").setVisible(true);
								sap.ui.getCore().byId("operationDetailPopup--btnCreateDisruption").setVisible(false);
								sap.ui.getCore().byId("operationDetailPopup--btnCancelDisruption").setVisible(true);
							} else {
								// In case of Creation of disruption
								// set buttons according to create disruption
								sap.ui.getCore().byId("operationDetailPopup--btnUpdateDisruption").setVisible(false);
								sap.ui.getCore().byId("operationDetailPopup--btnCreateDisruption").setVisible(true);
								sap.ui.getCore().byId("operationDetailPopup--btnCancelDisruption").setVisible(true);
								sap.ui.getCore().byId("createDisruptionView--openTime").setValue(airbus.mes.disruptions.Formatter.getTime());
								sap.ui.getCore().byId("createDisruptionView--openDate").setValue(airbus.mes.disruptions.Formatter.getDate());
								sap.ui.getCore().byId("createDisruptionView--status").setValue(this.getView().getModel("i18n").getProperty("Pending"));
							}
							
							/***************************************************
							 * Load Disruption Custom Data
							 **************************************************/
							if (!this.disruptionsCustomDataFlag) {
								
								airbus.mes.disruptions.ModelManager.loadData();
								this.disruptionsCustomDataFlag = true;
							} else
								airbus.mes.disruptions.oView.createDisruption.oController.setDataForEditDisruption();
							
							
							break;
							
						default:
							

						};

					}

				});
